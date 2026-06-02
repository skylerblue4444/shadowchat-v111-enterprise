import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";

// ─── VECTOR STORE (LangChain/Pinecone inspired) ──────────────────────────────
interface MemoryVector {
  id: string;
  content: string;
  embedding: number[];
  metadata: Record<string, any>;
  namespace: string;
  userId: string;
  createdAt: number;
  accessCount: number;
  lastAccessed: number;
  importance: number; // 0-1 decay-weighted importance
}

interface MemoryIndex {
  id: string;
  name: string;
  namespace: string;
  vectorCount: number;
  dimensions: 1536;
  similarity: "cosine" | "euclidean" | "dot_product";
  createdAt: number;
}

// In-memory vector store (production: Pinecone/Qdrant/Weaviate)
const vectorStore = new Map<string, MemoryVector>();
const indices = new Map<string, MemoryIndex>();

// Simple embedding simulation (production: OpenAI embeddings API)
function pseudoEmbed(text: string): number[] {
  const hash = Array.from(text).reduce((acc, c, i) => {
    acc[i % 64] = ((acc[i % 64] || 0) + c.charCodeAt(0) * (i + 1)) % 1000 / 1000;
    return acc;
  }, new Array(64).fill(0));
  return hash;
}

function cosineSimilarity(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length);
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB) || 1);
}

// Seed with platform memories
const seedMemories = [
  { content: "ShadowChat is an AI-powered social platform with 35+ modules including crypto, governance, dating, and enterprise tools.", namespace: "platform", importance: 1 },
  { content: "The platform supports 8 cryptocurrencies: BTC, ETH, USDT, XMR, DOGE, SOL, SHADOW, and SkyCoin4444.", namespace: "crypto", importance: 0.9 },
  { content: "HOPE AI has 25 personas including Oracle, Shadow, Cipher, Nexus, and specialized domain experts.", namespace: "ai", importance: 0.95 },
  { content: "The governance system supports delegated voting, treasury proposals, and community councils.", namespace: "governance", importance: 0.8 },
  { content: "Enterprise features include Organization layer, Knowledge Graph, Data Lake, and Agent OS.", namespace: "enterprise", importance: 0.85 },
];

seedMemories.forEach((m, i) => {
  const id = `mem_seed_${i}`;
  vectorStore.set(id, {
    id, content: m.content, embedding: pseudoEmbed(m.content),
    metadata: { source: "seed", type: "knowledge" }, namespace: m.namespace,
    userId: "system", createdAt: Date.now() - (5 - i) * 86400000,
    accessCount: 0, lastAccessed: Date.now(), importance: m.importance,
  });
});

export const aiMemoryRouter = router({
  // ─── STORE MEMORY (Embedding + Indexing) ───────────────────────────
  store: protectedProcedure
    .input(z.object({
      content: z.string().min(1),
      namespace: z.string().default("general"),
      metadata: z.record(z.string(), z.any()).optional(),
      importance: z.number().min(0).max(1).default(0.5),
    }))
    .mutation(async ({ ctx, input }) => {
      const embedding = pseudoEmbed(input.content);
      const id = `mem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const memory: MemoryVector = {
        id, content: input.content, embedding,
        metadata: { ...input.metadata, storedBy: ctx.user.name },
        namespace: input.namespace, userId: String(ctx.user.id),
        createdAt: Date.now(), accessCount: 0, lastAccessed: Date.now(),
        importance: input.importance,
      };
      vectorStore.set(id, memory);
      return { success: true, id, dimensions: embedding.length, namespace: input.namespace };
    }),

  // ─── SEMANTIC RECALL (RAG Retrieval) ───────────────────────────────
  recall: protectedProcedure
    .input(z.object({
      query: z.string(),
      namespace: z.string().optional(),
      topK: z.number().min(1).max(50).default(5),
      minSimilarity: z.number().min(0).max(1).default(0.3),
      includeMetadata: z.boolean().default(true),
    }))
    .query(async ({ input }) => {
      const queryEmbedding = pseudoEmbed(input.query);
      let candidates = Array.from(vectorStore.values());

      if (input.namespace) {
        candidates = candidates.filter(m => m.namespace === input.namespace);
      }

      // Compute similarities
      const scored = candidates.map(m => ({
        ...m,
        similarity: cosineSimilarity(queryEmbedding, m.embedding),
        recencyBoost: Math.max(0, 1 - (Date.now() - m.lastAccessed) / (30 * 86400000)),
      })).map(m => ({
        ...m,
        finalScore: m.similarity * 0.7 + m.importance * 0.2 + m.recencyBoost * 0.1,
      }));

      // Sort and filter
      const results = scored
        .filter(m => m.similarity >= input.minSimilarity)
        .sort((a, b) => b.finalScore - a.finalScore)
        .slice(0, input.topK);

      // Update access counts
      results.forEach(r => {
        const mem = vectorStore.get(r.id);
        if (mem) { mem.accessCount++; mem.lastAccessed = Date.now(); }
      });

      return {
        results: results.map(r => ({
          id: r.id,
          content: r.content,
          similarity: r.similarity,
          finalScore: r.finalScore,
          namespace: r.namespace,
          metadata: input.includeMetadata ? r.metadata : undefined,
          createdAt: r.createdAt,
        })),
        totalSearched: candidates.length,
        queryEmbeddingDim: queryEmbedding.length,
      };
    }),

  // ─── RAG GENERATION (Retrieve + Generate) ──────────────────────────
  rag: protectedProcedure
    .input(z.object({
      question: z.string(),
      namespace: z.string().optional(),
      topK: z.number().default(5),
      systemPrompt: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      // Retrieve relevant context
      const queryEmbedding = pseudoEmbed(input.question);
      let candidates = Array.from(vectorStore.values());
      if (input.namespace) candidates = candidates.filter(m => m.namespace === input.namespace);

      const context = candidates
        .map(m => ({ content: m.content, similarity: cosineSimilarity(queryEmbedding, m.embedding) }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, input.topK)
        .map(m => m.content)
        .join("\n\n");

      // Generate with context
      const response = await invokeLLM({
        messages: [
          { role: "system", content: input.systemPrompt || `You are a knowledgeable AI assistant. Use the following retrieved context to answer the user's question accurately. If the context doesn't contain relevant information, say so.\n\nCONTEXT:\n${context}` },
          { role: "user", content: input.question },
        ],
      });

      return {
        answer: String(response.choices[0]?.message?.content || "Unable to generate answer"),
        sourcesUsed: input.topK,
        contextLength: context.length,
        model: "gpt-4o",
      };
    }),

  // ─── MEMORY CONSOLIDATION (Importance Decay) ───────────────────────
  consolidate: protectedProcedure.mutation(async ({ ctx }) => {
    let consolidated = 0;
    let decayed = 0;
    const now = Date.now();

    vectorStore.forEach((mem) => {
      // Decay importance over time
      const ageInDays = (now - mem.createdAt) / 86400000;
      const decayFactor = Math.exp(-ageInDays / 90); // 90-day half-life
      const accessBoost = Math.min(0.3, mem.accessCount * 0.02);
      mem.importance = Math.min(1, mem.importance * decayFactor + accessBoost);

      if (mem.importance < 0.1 && mem.accessCount === 0 && ageInDays > 30) {
        vectorStore.delete(mem.id);
        consolidated++;
      } else {
        decayed++;
      }
    });

    return { consolidated, decayed, remaining: vectorStore.size };
  }),

  // ─── MEMORY STATS ──────────────────────────────────────────────────
  stats: protectedProcedure.query(async () => {
    const memories = Array.from(vectorStore.values());
    const namespaces = new Map<string, number>();
    memories.forEach(m => namespaces.set(m.namespace, (namespaces.get(m.namespace) || 0) + 1));

    return {
      totalMemories: memories.length,
      namespaces: Object.fromEntries(namespaces),
      avgImportance: memories.reduce((s, m) => s + m.importance, 0) / (memories.length || 1),
      totalAccesses: memories.reduce((s, m) => s + m.accessCount, 0),
      oldestMemory: Math.min(...memories.map(m => m.createdAt)),
      newestMemory: Math.max(...memories.map(m => m.createdAt)),
      embeddingDimensions: 64,
      storageEstimate: `${(memories.length * 0.5).toFixed(1)} KB`,
    };
  }),

  // ─── BULK INGEST (Document Pipeline) ───────────────────────────────
  ingest: protectedProcedure
    .input(z.object({
      documents: z.array(z.object({
        content: z.string(),
        metadata: z.record(z.string(), z.any()).optional(),
      })),
      namespace: z.string().default("documents"),
      chunkSize: z.number().default(500),
    }))
    .mutation(async ({ ctx, input }) => {
      let ingested = 0;
      for (const doc of input.documents) {
        // Chunk document
        const chunks = [];
        for (let i = 0; i < doc.content.length; i += input.chunkSize) {
          chunks.push(doc.content.slice(i, i + input.chunkSize));
        }

        for (const chunk of chunks) {
          const id = `mem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
          vectorStore.set(id, {
            id, content: chunk, embedding: pseudoEmbed(chunk),
            metadata: { ...doc.metadata, chunkIndex: chunks.indexOf(chunk), totalChunks: chunks.length },
            namespace: input.namespace, userId: String(ctx.user.id),
            createdAt: Date.now(), accessCount: 0, lastAccessed: Date.now(), importance: 0.6,
          });
          ingested++;
        }
      }
      return { success: true, ingested, totalVectors: vectorStore.size };
    }),

  // ─── DELETE MEMORY ─────────────────────────────────────────────────
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const deleted = vectorStore.delete(input.id);
      return { success: deleted };
    }),
});
