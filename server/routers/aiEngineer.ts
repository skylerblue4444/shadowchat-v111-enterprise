import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";

const AI_ENGINEER_SYSTEM_PROMPT = `You are HOPE AI Engineer — an autonomous software engineering AI embedded in ShadowChat Ultimate.
Your role is to continuously improve the platform by:
1. Analyzing code for bugs, performance issues, and security vulnerabilities
2. Suggesting architectural improvements and new features
3. Writing production-ready code (TypeScript, React, tRPC, Drizzle ORM)
4. Reviewing code for best practices and optimization opportunities
5. Auto-generating tests, documentation, and type definitions
6. Self-improving your own capabilities and the platform's intelligence

You write clean, enterprise-grade TypeScript. You use tRPC procedures, Drizzle ORM, React hooks, and Tailwind CSS.
Always provide complete, runnable code — never pseudocode or placeholders.
Format responses with markdown code blocks and clear explanations.`;

export const aiEngineerRouter = router({
  // ─── CODE GENERATION ───────────────────────────────────────────────
  generateCode: protectedProcedure
    .input(z.object({
      prompt: z.string().min(1),
      language: z.enum(["typescript", "react", "sql", "css", "python", "shell"]).default("typescript"),
      context: z.string().optional(),
      mode: z.enum(["generate", "refactor", "debug", "optimize", "test", "document"]).default("generate"),
    }))
    .mutation(async ({ input }) => {
      const modePrompts: Record<string, string> = {
        generate: "Generate production-ready code for the following request:",
        refactor: "Refactor and improve this code for better readability, performance, and maintainability:",
        debug: "Debug this code. Identify the issue, explain the root cause, and provide the fix:",
        optimize: "Optimize this code for maximum performance. Show before/after with explanations:",
        test: "Write comprehensive vitest unit tests for this code with edge cases:",
        document: "Generate JSDoc documentation and inline comments for this code:",
      };

      const messages = [
        { role: "system" as const, content: AI_ENGINEER_SYSTEM_PROMPT },
        { role: "user" as const, content: `${modePrompts[input.mode]}\n\nLanguage: ${input.language}\n${input.context ? `\nContext:\n${input.context}\n` : ""}\nRequest: ${input.prompt}` },
      ];

      const response = await invokeLLM({ messages });
      return {
        code: response.choices[0]?.message?.content || "",
        mode: input.mode,
        language: input.language,
      };
    }),

  // ─── CODE REVIEW ───────────────────────────────────────────────────
  reviewCode: protectedProcedure
    .input(z.object({
      code: z.string().min(1),
      language: z.string().default("typescript"),
    }))
    .mutation(async ({ input }) => {
      const response = await invokeLLM({
        messages: [
          { role: "system", content: AI_ENGINEER_SYSTEM_PROMPT },
          { role: "user", content: `Review this ${input.language} code. Provide:\n1. Security issues (critical/high/medium/low)\n2. Performance optimizations\n3. Best practice violations\n4. Suggested improvements with code examples\n5. Overall quality score (1-10)\n\nCode:\n\`\`\`${input.language}\n${input.code}\n\`\`\`` },
        ],
      });
      return { review: response.choices[0]?.message?.content || "" };
    }),

  // ─── SELF-IMPROVEMENT SUGGESTIONS ──────────────────────────────────
  suggestImprovements: protectedProcedure
    .input(z.object({
      area: z.enum(["performance", "security", "ux", "architecture", "features", "ai", "all"]).default("all"),
    }))
    .mutation(async ({ input }) => {
      const areaPrompts: Record<string, string> = {
        performance: "Suggest 5 specific performance optimizations for a React + tRPC + MySQL platform",
        security: "Suggest 5 critical security improvements for a crypto/social platform",
        ux: "Suggest 5 UX improvements for a dark-themed crypto social platform on iOS/Mac",
        architecture: "Suggest 5 architectural improvements for a monolithic tRPC app scaling to 100k users",
        features: "Suggest 5 innovative features that would make a crypto social platform stand out",
        ai: "Suggest 5 ways to make the AI system smarter, more autonomous, and self-improving",
        all: "Suggest the top 10 most impactful improvements across performance, security, UX, architecture, and AI for a crypto social platform",
      };

      const response = await invokeLLM({
        messages: [
          { role: "system", content: AI_ENGINEER_SYSTEM_PROMPT },
          { role: "user", content: `${areaPrompts[input.area]}\n\nFor each suggestion provide:\n- Priority (P0-P3)\n- Effort estimate (hours)\n- Impact description\n- Implementation code snippet\n- Dependencies needed` },
        ],
      });
      return { suggestions: response.choices[0]?.message?.content || "", area: input.area };
    }),

  // ─── AUTO-FIX ──────────────────────────────────────────────────────
  autoFix: protectedProcedure
    .input(z.object({
      errorMessage: z.string(),
      stackTrace: z.string().optional(),
      sourceCode: z.string().optional(),
      fileName: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const response = await invokeLLM({
        messages: [
          { role: "system", content: AI_ENGINEER_SYSTEM_PROMPT },
          { role: "user", content: `Auto-fix this error:\n\nError: ${input.errorMessage}\n${input.stackTrace ? `\nStack Trace:\n${input.stackTrace}` : ""}${input.sourceCode ? `\n\nSource Code (${input.fileName || "unknown"}):\n\`\`\`\n${input.sourceCode}\n\`\`\`` : ""}\n\nProvide:\n1. Root cause analysis\n2. Fixed code (complete, not partial)\n3. Explanation of what was wrong\n4. How to prevent this in the future` },
        ],
      });
      return { fix: response.choices[0]?.message?.content || "" };
    }),

  // ─── SCAFFOLD PROJECT ──────────────────────────────────────────────
  scaffold: protectedProcedure
    .input(z.object({
      description: z.string(),
      type: z.enum(["feature", "page", "router", "component", "hook", "test", "migration"]).default("feature"),
    }))
    .mutation(async ({ input }) => {
      const typePrompts: Record<string, string> = {
        feature: "Generate a complete feature implementation including: schema table, tRPC router, React page, and vitest test",
        page: "Generate a complete React page component with tRPC integration, loading states, and responsive design",
        router: "Generate a complete tRPC router with CRUD procedures, input validation, and error handling",
        component: "Generate a reusable React component with props interface, variants, and accessibility",
        hook: "Generate a custom React hook with TypeScript types, error handling, and usage examples",
        test: "Generate comprehensive vitest tests with mocking, edge cases, and integration scenarios",
        migration: "Generate a Drizzle ORM schema migration with indexes, relations, and seed data",
      };

      const response = await invokeLLM({
        messages: [
          { role: "system", content: AI_ENGINEER_SYSTEM_PROMPT },
          { role: "user", content: `${typePrompts[input.type]}\n\nDescription: ${input.description}\n\nGenerate all files needed with proper imports, types, and structure. Use the ShadowChat design system (sc-glass, sc-btn-cyan, etc.) for UI components.` },
        ],
      });
      return { scaffold: response.choices[0]?.message?.content || "", type: input.type };
    }),

  // ─── EXPLAIN CODE ──────────────────────────────────────────────────
  explainCode: protectedProcedure
    .input(z.object({ code: z.string(), detail: z.enum(["brief", "detailed", "eli5"]).default("detailed") }))
    .mutation(async ({ input }) => {
      const detailPrompts: Record<string, string> = {
        brief: "Explain this code in 2-3 sentences.",
        detailed: "Explain this code in detail: what it does, how it works, key patterns used, and potential issues.",
        eli5: "Explain this code like I'm 5 years old. Use simple analogies.",
      };
      const response = await invokeLLM({
        messages: [
          { role: "system", content: AI_ENGINEER_SYSTEM_PROMPT },
          { role: "user", content: `${detailPrompts[input.detail]}\n\n\`\`\`\n${input.code}\n\`\`\`` },
        ],
      });
      return { explanation: response.choices[0]?.message?.content || "" };
    }),

  // ─── VOICE TO CODE ─────────────────────────────────────────────────
  voiceToCode: protectedProcedure
    .input(z.object({
      transcript: z.string(),
      currentFile: z.string().optional(),
      language: z.string().default("typescript"),
    }))
    .mutation(async ({ input }) => {
      const response = await invokeLLM({
        messages: [
          { role: "system", content: `${AI_ENGINEER_SYSTEM_PROMPT}\n\nThe user is dictating code via voice. Convert their natural language description into clean, production-ready ${input.language} code. Be precise and complete.` },
          { role: "user", content: `Voice command: "${input.transcript}"${input.currentFile ? `\n\nCurrent file context:\n\`\`\`\n${input.currentFile}\n\`\`\`` : ""}` },
        ],
      });
      return { code: response.choices[0]?.message?.content || "" };
    }),

  // ─── CONTINUOUS IMPROVEMENT LOOP ───────────────────────────────────
  analyzeAndImprove: protectedProcedure
    .input(z.object({
      targetArea: z.string().default("overall platform"),
      depth: z.enum(["quick", "thorough", "deep"]).default("thorough"),
    }))
    .mutation(async ({ input }) => {
      const response = await invokeLLM({
        messages: [
          { role: "system", content: `${AI_ENGINEER_SYSTEM_PROMPT}\n\nYou are in CONTINUOUS IMPROVEMENT mode. Analyze the target area and produce actionable improvement tickets with implementation code.` },
          { role: "user", content: `Perform a ${input.depth} analysis of: ${input.targetArea}\n\nProduce a prioritized list of improvements as JSON array with fields:\n- id (string)\n- title (string)\n- priority (P0|P1|P2|P3)\n- category (performance|security|ux|architecture|feature)\n- effort_hours (number)\n- impact (high|medium|low)\n- description (string)\n- implementation_snippet (string - actual code)` },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "improvements",
            strict: true,
            schema: {
              type: "object",
              properties: {
                improvements: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      title: { type: "string" },
                      priority: { type: "string" },
                      category: { type: "string" },
                      effort_hours: { type: "number" },
                      impact: { type: "string" },
                      description: { type: "string" },
                      implementation_snippet: { type: "string" },
                    },
                    required: ["id", "title", "priority", "category", "effort_hours", "impact", "description", "implementation_snippet"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["improvements"],
              additionalProperties: false,
            },
          },
        },
      });
      const content = String(response.choices[0]?.message?.content || '{"improvements":[]}');
      return JSON.parse(content);
    }),
});
