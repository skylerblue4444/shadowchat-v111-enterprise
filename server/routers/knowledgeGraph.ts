import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";

// ─── IN-MEMORY GRAPH ENGINE ──────────────────────────────────────────────────
interface GraphNode {
  id: string;
  type: string;
  label: string;
  properties: Record<string, any>;
  createdAt: number;
  updatedAt: number;
  embedding?: number[];
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relationship: string;
  weight: number;
  properties: Record<string, any>;
  createdAt: number;
}

const nodes = new Map<string, GraphNode>();
const edges = new Map<string, GraphEdge>();

// Seed with platform knowledge
const seedNodes: GraphNode[] = [
  { id: "n_platform", type: "system", label: "ShadowChat Platform", properties: { version: "v72", modules: 35 }, createdAt: Date.now(), updatedAt: Date.now() },
  { id: "n_ai", type: "module", label: "AI Engine", properties: { personas: 25, models: 3 }, createdAt: Date.now(), updatedAt: Date.now() },
  { id: "n_crypto", type: "module", label: "Crypto Engine", properties: { coins: 8, features: ["stake", "mine", "burn", "trade"] }, createdAt: Date.now(), updatedAt: Date.now() },
  { id: "n_social", type: "module", label: "Social Layer", properties: { features: ["feed", "messaging", "dating", "live"] }, createdAt: Date.now(), updatedAt: Date.now() },
  { id: "n_governance", type: "module", label: "Governance", properties: { votingMethods: 3, treasury: true }, createdAt: Date.now(), updatedAt: Date.now() },
  { id: "n_security", type: "module", label: "Security Center", properties: { mfa: true, threatDetection: true }, createdAt: Date.now(), updatedAt: Date.now() },
  { id: "n_marketplace", type: "module", label: "Marketplace", properties: { nfts: true, listings: true }, createdAt: Date.now(), updatedAt: Date.now() },
  { id: "n_deveco", type: "module", label: "Developer Ecosystem", properties: { apis: true, webhooks: true, plugins: true }, createdAt: Date.now(), updatedAt: Date.now() },
];

const seedEdges: GraphEdge[] = [
  { id: "e_1", source: "n_platform", target: "n_ai", relationship: "CONTAINS", weight: 1, properties: {}, createdAt: Date.now() },
  { id: "e_2", source: "n_platform", target: "n_crypto", relationship: "CONTAINS", weight: 1, properties: {}, createdAt: Date.now() },
  { id: "e_3", source: "n_platform", target: "n_social", relationship: "CONTAINS", weight: 1, properties: {}, createdAt: Date.now() },
  { id: "e_4", source: "n_platform", target: "n_governance", relationship: "CONTAINS", weight: 1, properties: {}, createdAt: Date.now() },
  { id: "e_5", source: "n_platform", target: "n_security", relationship: "CONTAINS", weight: 1, properties: {}, createdAt: Date.now() },
  { id: "e_6", source: "n_platform", target: "n_marketplace", relationship: "CONTAINS", weight: 1, properties: {}, createdAt: Date.now() },
  { id: "e_7", source: "n_platform", target: "n_deveco", relationship: "CONTAINS", weight: 1, properties: {}, createdAt: Date.now() },
  { id: "e_8", source: "n_ai", target: "n_crypto", relationship: "POWERS", weight: 0.8, properties: { capability: "price prediction" }, createdAt: Date.now() },
  { id: "e_9", source: "n_ai", target: "n_social", relationship: "POWERS", weight: 0.9, properties: { capability: "content moderation" }, createdAt: Date.now() },
  { id: "e_10", source: "n_crypto", target: "n_governance", relationship: "ENABLES", weight: 0.7, properties: { capability: "token voting" }, createdAt: Date.now() },
  { id: "e_11", source: "n_security", target: "n_crypto", relationship: "PROTECTS", weight: 1, properties: {}, createdAt: Date.now() },
];

// Initialize
seedNodes.forEach(n => nodes.set(n.id, n));
seedEdges.forEach(e => edges.set(e.id, e));

export const knowledgeGraphRouter = router({
  // ─── QUERY GRAPH ───────────────────────────────────────────────────
  query: protectedProcedure
    .input(z.object({
      nodeType: z.string().optional(),
      relationship: z.string().optional(),
      depth: z.number().min(1).max(5).default(2),
      startNodeId: z.string().optional(),
    }))
    .query(async ({ input }) => {
      let filteredNodes = Array.from(nodes.values());
      let filteredEdges = Array.from(edges.values());

      if (input.nodeType) {
        filteredNodes = filteredNodes.filter(n => n.type === input.nodeType);
      }
      if (input.relationship) {
        filteredEdges = filteredEdges.filter(e => e.relationship === input.relationship);
      }
      if (input.startNodeId) {
        // BFS traversal
        const visited = new Set<string>();
        const queue = [{ id: input.startNodeId, depth: 0 }];
        while (queue.length > 0) {
          const { id, depth } = queue.shift()!;
          if (visited.has(id) || depth > input.depth) continue;
          visited.add(id);
          const connected = filteredEdges.filter(e => e.source === id || e.target === id);
          connected.forEach(e => {
            const nextId = e.source === id ? e.target : e.source;
            queue.push({ id: nextId, depth: depth + 1 });
          });
        }
        filteredNodes = filteredNodes.filter(n => visited.has(n.id));
        filteredEdges = filteredEdges.filter(e => visited.has(e.source) && visited.has(e.target));
      }

      return {
        nodes: filteredNodes,
        edges: filteredEdges,
        stats: { totalNodes: nodes.size, totalEdges: edges.size, queryNodes: filteredNodes.length, queryEdges: filteredEdges.length },
      };
    }),

  // ─── ADD NODE ──────────────────────────────────────────────────────
  addNode: protectedProcedure
    .input(z.object({
      type: z.string(),
      label: z.string(),
      properties: z.record(z.string(), z.any()).optional(),
    }))
    .mutation(async ({ input }) => {
      const id = `n_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const node: GraphNode = {
        id,
        type: input.type,
        label: input.label,
        properties: input.properties || {},
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      nodes.set(id, node);
      return { success: true, node };
    }),

  // ─── ADD EDGE ──────────────────────────────────────────────────────
  addEdge: protectedProcedure
    .input(z.object({
      source: z.string(),
      target: z.string(),
      relationship: z.string(),
      weight: z.number().min(0).max(1).default(1),
      properties: z.record(z.string(), z.any()).optional(),
    }))
    .mutation(async ({ input }) => {
      if (!nodes.has(input.source) || !nodes.has(input.target)) {
        throw new Error("Source or target node not found");
      }
      const id = `e_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const edge: GraphEdge = {
        id,
        source: input.source,
        target: input.target,
        relationship: input.relationship,
        weight: input.weight,
        properties: input.properties || {},
        createdAt: Date.now(),
      };
      edges.set(id, edge);
      return { success: true, edge };
    }),

  // ─── AI-POWERED INFERENCE ──────────────────────────────────────────
  infer: protectedProcedure
    .input(z.object({ question: z.string() }))
    .mutation(async ({ input }) => {
      const graphContext = Array.from(nodes.values()).slice(0, 20).map(n => `[${n.type}] ${n.label}: ${JSON.stringify(n.properties)}`).join("\n");
      const edgeContext = Array.from(edges.values()).slice(0, 20).map(e => {
        const src = nodes.get(e.source);
        const tgt = nodes.get(e.target);
        return `${src?.label} -[${e.relationship}]-> ${tgt?.label}`;
      }).join("\n");

      const response = await invokeLLM({
        messages: [
          { role: "system", content: `You are a Knowledge Graph reasoning engine. Given the following graph data, answer questions by traversing relationships and inferring connections.\n\nNODES:\n${graphContext}\n\nEDGES:\n${edgeContext}` },
          { role: "user", content: input.question },
        ],
      });

      return {
        answer: String(response.choices[0]?.message?.content || "Unable to infer"),
        nodesUsed: nodes.size,
        edgesTraversed: edges.size,
        confidence: 0.85,
      };
    }),

  // ─── GRAPH STATS ───────────────────────────────────────────────────
  stats: publicProcedure.query(async () => {
    const nodeTypes = new Map<string, number>();
    const relTypes = new Map<string, number>();
    nodes.forEach(n => nodeTypes.set(n.type, (nodeTypes.get(n.type) || 0) + 1));
    edges.forEach(e => relTypes.set(e.relationship, (relTypes.get(e.relationship) || 0) + 1));

    return {
      totalNodes: nodes.size,
      totalEdges: edges.size,
      nodeTypes: Object.fromEntries(nodeTypes),
      relationshipTypes: Object.fromEntries(relTypes),
      density: edges.size / (nodes.size * (nodes.size - 1) || 1),
      lastUpdated: Date.now(),
    };
  }),

  // ─── SHORTEST PATH ────────────────────────────────────────────────
  shortestPath: protectedProcedure
    .input(z.object({ from: z.string(), to: z.string() }))
    .query(async ({ input }) => {
      // BFS shortest path
      const visited = new Map<string, string | null>();
      const queue = [input.from];
      visited.set(input.from, null);

      while (queue.length > 0) {
        const current = queue.shift()!;
        if (current === input.to) break;

        const connected = Array.from(edges.values()).filter(e => e.source === current || e.target === current);
        for (const edge of connected) {
          const next = edge.source === current ? edge.target : edge.source;
          if (!visited.has(next)) {
            visited.set(next, current);
            queue.push(next);
          }
        }
      }

      // Reconstruct path
      const path: string[] = [];
      let current: string | null = input.to;
      while (current) {
        path.unshift(current);
        current = visited.get(current) || null;
      }

      return {
        found: path[0] === input.from,
        path: path.map(id => nodes.get(id)),
        length: path.length - 1,
      };
    }),
});
