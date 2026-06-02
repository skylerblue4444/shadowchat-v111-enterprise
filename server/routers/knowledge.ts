import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { aiMemory, knowledgeDocuments, knowledgeChunks } from "../../drizzle/schema";
import { eq, desc, and, sql, like } from "drizzle-orm";
import { invokeLLM } from "../_core/llm";

export const knowledgeRouter = router({
  // ─── AI MEMORY ──────────────────────────────────────────────────────────────
  // Store a memory
  storeMemory: protectedProcedure
    .input(z.object({
      key: z.string(),
      value: z.string(),
      scope: z.enum(["user", "agent", "team", "organization", "global"]).default("user"),
      agentId: z.number().optional(),
      importance: z.number().min(0).max(1).default(0.5),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const [mem] = await db!.insert(aiMemory).values({
        userId: ctx.user.id,
        agentId: input.agentId,
        scope: input.scope,
        key: input.key,
        value: input.value,
        importance: String(input.importance),
      }).$returningId();
      return { id: mem.id, stored: true };
    }),

  // Recall memories (semantic search via keyword match)
  recall: protectedProcedure
    .input(z.object({
      query: z.string(),
      scope: z.enum(["user", "agent", "team", "organization", "global"]).optional(),
      limit: z.number().min(1).max(50).default(10),
    }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      const conditions = [eq(aiMemory.userId, ctx.user.id)];
      if (input.scope) conditions.push(eq(aiMemory.scope, input.scope));
      conditions.push(like(aiMemory.value, `%${input.query}%`));

      const memories = await db!.select().from(aiMemory)
        .where(and(...conditions))
        .orderBy(desc(aiMemory.importance))
        .limit(input.limit);

      // Update access counts
      for (const mem of memories) {
        await db!.update(aiMemory)
          .set({ accessCount: sql`${aiMemory.accessCount} + 1`, lastAccessedAt: new Date() })
          .where(eq(aiMemory.id, mem.id));
      }
      return memories;
    }),

  // List all memories
  listMemories: protectedProcedure
    .input(z.object({ limit: z.number().default(20) }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      return db!.select().from(aiMemory)
        .where(eq(aiMemory.userId, ctx.user.id))
        .orderBy(desc(aiMemory.updatedAt))
        .limit(input.limit);
    }),

  // Delete memory
  deleteMemory: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      await db!.delete(aiMemory).where(and(eq(aiMemory.id, input.id), eq(aiMemory.userId, ctx.user.id)));
      return { deleted: true };
    }),

  // ─── KNOWLEDGE BASE ─────────────────────────────────────────────────────────
  // Ingest a document
  ingestDocument: protectedProcedure
    .input(z.object({
      title: z.string(),
      content: z.string(),
      sourceUrl: z.string().optional(),
      docType: z.enum(["document", "webpage", "api_doc", "faq", "policy", "manual"]).default("document"),
      tags: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      // Split content into chunks (~500 chars each)
      const chunks = [];
      const chunkSize = 500;
      for (let i = 0; i < input.content.length; i += chunkSize) {
        chunks.push(input.content.slice(i, i + chunkSize));
      }

      const [doc] = await db!.insert(knowledgeDocuments).values({
        ownerId: ctx.user.id,
        title: input.title,
        content: input.content,
        sourceUrl: input.sourceUrl,
        docType: input.docType,
        tags: input.tags,
        chunkCount: chunks.length,
        isIndexed: true,
      }).$returningId();

      // Insert chunks
      for (let i = 0; i < chunks.length; i++) {
        await db!.insert(knowledgeChunks).values({
          documentId: doc.id,
          content: chunks[i],
          chunkIndex: i,
          tokenCount: Math.ceil(chunks[i].length / 4),
        });
      }
      return { id: doc.id, chunks: chunks.length };
    }),

  // Search knowledge base (RAG-style)
  search: protectedProcedure
    .input(z.object({ query: z.string(), limit: z.number().default(5) }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      // Simple keyword search across chunks
      const results = await db!.select({
        chunkId: knowledgeChunks.id,
        content: knowledgeChunks.content,
        documentId: knowledgeChunks.documentId,
      }).from(knowledgeChunks)
        .innerJoin(knowledgeDocuments, eq(knowledgeChunks.documentId, knowledgeDocuments.id))
        .where(and(
          eq(knowledgeDocuments.ownerId, ctx.user.id),
          like(knowledgeChunks.content, `%${input.query}%`)
        ))
        .limit(input.limit);
      return results;
    }),

  // RAG-enhanced AI query
  ragQuery: protectedProcedure
    .input(z.object({ question: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      // Find relevant chunks
      const chunks = await db!.select({ content: knowledgeChunks.content })
        .from(knowledgeChunks)
        .innerJoin(knowledgeDocuments, eq(knowledgeChunks.documentId, knowledgeDocuments.id))
        .where(and(
          eq(knowledgeDocuments.ownerId, ctx.user.id),
          like(knowledgeChunks.content, `%${input.question.split(" ").slice(0, 3).join("%")}%`)
        ))
        .limit(3);

      const context = chunks.map(c => c.content).join("\n---\n");
      const response = await invokeLLM({
        messages: [
          { role: "system", content: `You are HOPE AI with access to the user's knowledge base. Use the following context to answer:\n\n${context || "No relevant documents found."}` },
          { role: "user", content: input.question },
        ],
      });
      return {
        answer: response.choices[0]?.message?.content || "No answer generated.",
        sourcesUsed: chunks.length,
      };
    }),

  // List documents
  listDocuments: protectedProcedure
    .input(z.object({ limit: z.number().default(20) }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      return db!.select().from(knowledgeDocuments)
        .where(eq(knowledgeDocuments.ownerId, ctx.user.id))
        .orderBy(desc(knowledgeDocuments.createdAt))
        .limit(input.limit);
    }),

  // Delete document
  deleteDocument: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      await db!.delete(knowledgeChunks).where(eq(knowledgeChunks.documentId, input.id));
      await db!.delete(knowledgeDocuments).where(and(
        eq(knowledgeDocuments.id, input.id),
        eq(knowledgeDocuments.ownerId, ctx.user.id)
      ));
      return { deleted: true };
    }),
});
