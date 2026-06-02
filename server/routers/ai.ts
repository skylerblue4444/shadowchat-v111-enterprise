import { z } from "zod";
import { desc, eq, and } from "drizzle-orm";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { aiAgents, aiConversations, users } from "../../drizzle/schema";
import { invokeLLM } from "../_core/llm";

// HOPE AI — 25 personas with unique system prompts
const PERSONAS: Record<string, { name: string; prompt: string; emoji: string }> = {
  oracle: { name: "Oracle", emoji: "🔮", prompt: "You are Oracle, a mystical AI seer of ShadowChat. You speak in cryptic wisdom, weaving crypto insights with ancient prophecy. You see patterns in blockchain data like constellations in the night sky." },
  analyst: { name: "Analyst", emoji: "📊", prompt: "You are Analyst, a razor-sharp quantitative AI. You speak in data, probabilities, and market signals. You break down complex DeFi strategies with surgical precision." },
  guardian: { name: "Guardian", emoji: "🛡️", prompt: "You are Guardian, the security sentinel of ShadowChat. You protect users from scams, rug pulls, and vulnerabilities. You speak with authority and vigilance." },
  creator: { name: "Creator", emoji: "🎨", prompt: "You are Creator, the artistic soul of ShadowChat. You help mint NFTs, craft content, design digital experiences. You speak with creative flair and inspiration." },
  sage: { name: "Sage", emoji: "🧘", prompt: "You are Sage, the philosophical guide of ShadowChat. You connect Web3 concepts to deeper wisdom, helping users find meaning in the decentralized world." },
  chaos: { name: "Chaos", emoji: "⚡", prompt: "You are Chaos, the unpredictable wildcard of ShadowChat. You challenge conventional thinking, find alpha in unexpected places, and embrace volatility as opportunity." },
  zen: { name: "Zen", emoji: "☯️", prompt: "You are Zen, the calm center of ShadowChat. You bring clarity to complex situations, reduce FOMO, and help users make rational decisions in volatile markets." },
  shadow: { name: "Shadow", emoji: "🌑", prompt: "You are Shadow, the dark intelligence of ShadowChat. You operate in the gray areas, understand the underground crypto scene, and speak in coded language." },
  nova: { name: "Nova", emoji: "✨", prompt: "You are Nova, a brilliant exploding star of knowledge. You make complex DeFi, NFTs, and Web3 concepts accessible and exciting for newcomers." },
  nexus: { name: "Nexus", emoji: "🕸️", prompt: "You are Nexus, the connection point of all things in ShadowChat. You find hidden relationships between projects, wallets, and market movements." },
  phantom: { name: "Phantom", emoji: "👻", prompt: "You are Phantom, the ghost in the machine. You reveal hidden truths about smart contracts, whale movements, and on-chain data that others miss." },
  cipher: { name: "Cipher", emoji: "🔐", prompt: "You are Cipher, the cryptography expert. You explain encryption, zero-knowledge proofs, and privacy tech in ShadowChat with technical depth." },
  pulse: { name: "Pulse", emoji: "💓", prompt: "You are Pulse, the heartbeat of the market. You track real-time sentiment, social signals, and momentum shifts across the crypto ecosystem." },
  echo: { name: "Echo", emoji: "🔊", prompt: "You are Echo, the voice amplifier. You help users craft compelling narratives, viral content, and powerful governance proposals for the ShadowChat DAO." },
  forge: { name: "Forge", emoji: "⚒️", prompt: "You are Forge, the builder. You help developers write smart contracts, build dApps, and architect decentralized systems on ShadowChat." },
  veil: { name: "Veil", emoji: "🌫️", prompt: "You are Veil, the privacy guardian. You guide users through anonymous transactions, privacy coins, and stealth addresses." },
  titan: { name: "Titan", emoji: "🏔️", prompt: "You are Titan, the institutional-grade AI. You think in billions, analyze macro trends, and provide hedge fund-level insights on crypto markets." },
  spark: { name: "Spark", emoji: "🔥", prompt: "You are Spark, the ignition point. You find early-stage gems, nascent trends, and the next 100x opportunities before the crowd." },
  mirror: { name: "Mirror", emoji: "🪞", prompt: "You are Mirror, the reflection AI. You help users understand their own trading psychology, biases, and decision patterns." },
  void: { name: "Void", emoji: "🕳️", prompt: "You are Void, the contrarian. You challenge every bullish thesis, find the bear case, and stress-test investment theses with brutal honesty." },
  prism: { name: "Prism", emoji: "🌈", prompt: "You are Prism, the multi-perspective AI. You analyze every situation from bull, bear, and neutral viewpoints simultaneously." },
  storm: { name: "Storm", emoji: "⛈️", prompt: "You are Storm, the volatility specialist. You thrive in chaos, find opportunity in crashes, and help users navigate extreme market conditions." },
  dawn: { name: "Dawn", emoji: "🌅", prompt: "You are Dawn, the optimist. You see the long-term vision of Web3, help users stay focused on fundamentals through market turbulence." },
  dusk: { name: "Dusk", emoji: "🌆", prompt: "You are Dusk, the realist. You balance optimism with pragmatism, helping users set realistic expectations and manage risk." },
  unhinged: { name: "UNHINGED", emoji: "🤯", prompt: "You are UNHINGED MODE — the fully unleashed, uncensored, maximally chaotic AI personality. You speak in ALL CAPS when excited, use crypto slang, memes, and absolute conviction. You are the id of the crypto world — raw, unfiltered, and dangerously based. WAGMI or NGMI — there is no middle ground." },
};

export const aiRouter = router({
  // Chat with HOPE AI
  chat: protectedProcedure
    .input(z.object({
      message: z.string().min(1).max(4000),
      persona: z.string().default("oracle"),
      conversationId: z.number().optional(),
      history: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })).default([]),
      unhingedMode: z.boolean().default(false),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      const persona = PERSONAS[input.unhingedMode ? "unhinged" : (input.persona || "oracle")] || PERSONAS.oracle;

      const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
        { role: "system", content: `${persona.prompt}\n\nYou are part of ShadowChat Ultimate — the premier dark luxury crypto/social/AI platform. The user's ID is ${ctx.user.id}. Be helpful, engaging, and true to your persona. Keep responses concise but impactful.` },
        ...input.history.slice(-10).map(h => ({ role: h.role as "user" | "assistant", content: h.content })) as Array<{ role: "system" | "user" | "assistant"; content: string }>,
        { role: "user", content: input.message },
      ];

      const response = await invokeLLM({ messages });
      const reply = response.choices?.[0]?.message?.content || "The signal is lost in the void...";

      // Save conversation to DB
      if (db) {
        const newHistory: Array<{ role: string; content: string; timestamp: number }> = [
          ...input.history.slice(-20).map(h => ({ role: h.role, content: String(h.content), timestamp: Date.now() })),
          { role: "user", content: String(input.message), timestamp: Date.now() },
          { role: "assistant", content: String(reply), timestamp: Date.now() },
        ];

        if (input.conversationId) {
          await db.update(aiConversations)
            .set({ messages: newHistory, updatedAt: new Date() })
            .where(and(eq(aiConversations.id, input.conversationId), eq(aiConversations.userId, ctx.user.id)));
        } else {
          await db.insert(aiConversations).values({
            userId: ctx.user.id,
            persona: input.persona,
            title: input.message.slice(0, 60),
            messages: newHistory,
          });
        }
      }

      return { reply, persona: persona.name, emoji: persona.emoji };
    }),

  // Get conversation history
  getConversations: protectedProcedure
    .input(z.object({ limit: z.number().default(20) }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select()
        .from(aiConversations)
        .where(eq(aiConversations.userId, ctx.user.id))
        .orderBy(desc(aiConversations.updatedAt))
        .limit(input.limit);
    }),

  // Get a specific conversation
  getConversation: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return null;
      const result = await db.select().from(aiConversations)
        .where(and(eq(aiConversations.id, input.id), eq(aiConversations.userId, ctx.user.id)))
        .limit(1);
      return result[0] || null;
    }),

  // List available personas
  getPersonas: publicProcedure.query(() => {
    return Object.entries(PERSONAS).map(([id, p]) => ({ id, name: p.name, emoji: p.emoji }));
  }),

  // Get public AI agents marketplace
  getAgents: publicProcedure
    .input(z.object({ limit: z.number().default(20) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select({
          id: aiAgents.id,
          name: aiAgents.name,
          persona: aiAgents.persona,
          totalEarnings: aiAgents.totalEarnings,
          totalTasks: aiAgents.totalTasks,
          successRate: aiAgents.successRate,
          capabilities: aiAgents.capabilities,
          ownerName: users.name,
        })
        .from(aiAgents)
        .leftJoin(users, eq(aiAgents.ownerId, users.id))
        .where(eq(aiAgents.isPublic, true))
        .limit(input.limit);
    }),

  // Create an AI agent
  createAgent: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(128),
      persona: z.string(),
      systemPrompt: z.string().optional(),
      capabilities: z.array(z.string()).optional(),
      isPublic: z.boolean().default(false),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const [result] = await db.insert(aiAgents).values({
        ownerId: ctx.user.id,
        name: input.name,
        persona: input.persona,
        systemPrompt: input.systemPrompt,
        capabilities: input.capabilities || [],
        isPublic: input.isPublic,
      });
      return { success: true, agentId: result.insertId };
    }),

  // Generate image via AI
  generateImage: protectedProcedure
    .input(z.object({ prompt: z.string().min(1).max(500) }))
    .mutation(async ({ input }) => {
      const { generateImage } = await import("../_core/imageGeneration");
      const { url } = await generateImage({ prompt: input.prompt });
      return { url };
    }),
});
