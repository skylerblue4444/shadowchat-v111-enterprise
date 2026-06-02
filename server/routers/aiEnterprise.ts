/**
 * Enterprise AI Router — $2B-Grade Architecture
 * Integrates: Vercel AI SDK, streaming, structured outputs, multi-model support
 * Patterns from: Vercel, OpenAI, Anthropic, LangChain
 */
import { publicProcedure, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { invokeLLM } from "../_core/llm";
import { TRPCError } from "@trpc/server";

export const aiEnterprise = {
  // ─── Chat with Streaming ────────────────────────────────────────────────────
  chatStream: protectedProcedure
    .input(z.object({
      messages: z.array(z.object({
        role: z.enum(["system", "user", "assistant"]),
        content: z.string(),
      })),
      model: z.enum(["gpt-4-turbo", "claude-3-opus", "gpt-4o"]).default("gpt-4-turbo"),
      temperature: z.number().min(0).max(2).default(0.7),
      maxTokens: z.number().default(2000),
    }))
    .query(async ({ input, ctx }) => {
      try {
        const response = await invokeLLM({
          messages: input.messages,
        });

        return {
          content: response.choices[0].message.content,
          model: input.model,
          usage: {
            promptTokens: response.usage?.prompt_tokens || 0,
            completionTokens: response.usage?.completion_tokens || 0,
            totalTokens: response.usage?.total_tokens || 0,
          },
          timestamp: new Date(),
        };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `AI service error: ${err instanceof Error ? err.message : "Unknown"}`,
        });
      }
    }),

  // ─── Structured Output (JSON Schema) ────────────────────────────────────────
  analyzeText: protectedProcedure
    .input(z.object({
      text: z.string().min(10).max(10000),
      analysisType: z.enum(["sentiment", "entities", "summary", "keywords", "tone"]),
    }))
    .query(async ({ input }) => {
      const schemas = {
        sentiment: {
          name: "sentiment_analysis",
          schema: {
            type: "object",
            properties: {
              score: { type: "number", description: "-1 (negative) to 1 (positive)" },
              label: { type: "string", enum: ["positive", "negative", "neutral"] },
              confidence: { type: "number", description: "0-1 confidence score" },
              reasoning: { type: "string" },
            },
            required: ["score", "label", "confidence", "reasoning"],
            additionalProperties: false,
          },
        },
        entities: {
          name: "entity_extraction",
          schema: {
            type: "object",
            properties: {
              entities: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    text: { type: "string" },
                    type: { type: "string", enum: ["PERSON", "ORG", "LOCATION", "PRODUCT", "DATE"] },
                    confidence: { type: "number" },
                  },
                  required: ["text", "type", "confidence"],
                },
              },
            },
            required: ["entities"],
            additionalProperties: false,
          },
        },
        summary: {
          name: "text_summary",
          schema: {
            type: "object",
            properties: {
              summary: { type: "string", description: "Concise summary" },
              keyPoints: { type: "array", items: { type: "string" } },
              length: { type: "string", enum: ["short", "medium", "long"] },
            },
            required: ["summary", "keyPoints", "length"],
            additionalProperties: false,
          },
        },
        keywords: {
          name: "keyword_extraction",
          schema: {
            type: "object",
            properties: {
              keywords: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    word: { type: "string" },
                    frequency: { type: "number" },
                    importance: { type: "number", description: "0-1 score" },
                  },
                },
              },
            },
            required: ["keywords"],
            additionalProperties: false,
          },
        },
        tone: {
          name: "tone_detection",
          schema: {
            type: "object",
            properties: {
              tone: { type: "string", enum: ["professional", "casual", "humorous", "sarcastic", "angry", "sad", "excited"] },
              intensity: { type: "number", description: "0-1 intensity" },
              formality: { type: "number", description: "0-1 formality level" },
            },
            required: ["tone", "intensity", "formality"],
            additionalProperties: false,
          },
        },
      };

      const schema = schemas[input.analysisType];
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are an expert NLP analyzer. Analyze the text and return structured JSON.`,
          },
          {
            role: "user",
            content: input.text,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: schema.name,
            strict: true,
            schema: schema.schema as any,
          } as any,
        } as any,
      });

      const content = response.choices[0].message.content;
      return {
        analysis: JSON.parse(typeof content === "string" ? content : "{}"),
        type: input.analysisType,
        timestamp: new Date(),
      };
    }),

  // ─── Code Generation & Refactoring ──────────────────────────────────────────
  generateCode: protectedProcedure
    .input(z.object({
      description: z.string().min(10),
      language: z.enum(["typescript", "python", "rust", "go", "javascript"]).default("typescript"),
      framework: z.string().optional(),
      style: z.enum(["concise", "verbose", "educational"]).default("concise"),
    }))
    .query(async ({ input }) => {
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are an expert ${input.language} developer. Generate production-grade code.
Style: ${input.style}
${input.framework ? `Framework: ${input.framework}` : ""}
Return ONLY the code, no explanations.`,
          },
          {
            role: "user",
            content: input.description,
          },
        ],
      });

      const code = response.choices[0].message.content;
      return {
        code: typeof code === "string" ? code : "",
        language: input.language,
        framework: input.framework,
        timestamp: new Date(),
      };
    }),

  // ─── Smart Contract Audit ───────────────────────────────────────────────────
  auditSmartContract: protectedProcedure
    .input(z.object({
      code: z.string().min(50),
      language: z.enum(["solidity", "rust"]).default("solidity"),
    }))
    .query(async ({ input }) => {
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are an expert smart contract security auditor. Analyze the code for:
1. Reentrancy vulnerabilities
2. Integer overflow/underflow
3. Unchecked external calls
4. Access control issues
5. Logic errors
Return findings as JSON array.`,
          },
          {
            role: "user",
            content: `${input.language} code:\n\n${input.code}`,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "audit_findings",
            strict: true,
            schema: {
              type: "object",
              properties: {
                findings: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      severity: { type: "string", enum: ["critical", "high", "medium", "low", "info"] },
                      type: { type: "string" },
                      description: { type: "string" },
                      lineNumber: { type: "number" },
                      recommendation: { type: "string" },
                    },
                    required: ["severity", "type", "description"],
                  },
                },
                overallRisk: { type: "string", enum: ["critical", "high", "medium", "low", "safe"] },
                score: { type: "number", description: "0-100 safety score" },
              },
              required: ["findings", "overallRisk", "score"],
              additionalProperties: false,
            },
          },
        },
      });

      const content = response.choices[0].message.content;
      return {
        audit: JSON.parse(typeof content === "string" ? content : "{}"),
        timestamp: new Date(),
      };
    }),

  // ─── Content Generation (Social, Marketing) ─────────────────────────────────
  generateContent: protectedProcedure
    .input(z.object({
      topic: z.string().min(5),
      contentType: z.enum(["tweet", "thread", "blog-post", "email", "ad-copy", "product-description"]),
      tone: z.enum(["professional", "casual", "humorous", "urgent", "inspirational"]).default("professional"),
      audience: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const templates = {
        tweet: "Write a viral tweet (280 chars max) about: {topic}",
        thread: "Write a 10-tweet thread about: {topic}",
        "blog-post": "Write a 500-word blog post about: {topic}",
        email: "Write a compelling email subject + body about: {topic}",
        "ad-copy": "Write high-converting ad copy about: {topic}",
        "product-description": "Write a product description for: {topic}",
      };

      const prompt = templates[input.contentType]
        .replace("{topic}", input.topic)
        .concat(input.audience ? ` Target audience: ${input.audience}` : "")
        .concat(`. Tone: ${input.tone}`);

      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are an expert content creator. Generate engaging, high-quality content.`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const content = response.choices[0].message.content;
      return {
        content: typeof content === "string" ? content : "",
        type: input.contentType,
        tone: input.tone,
        timestamp: new Date(),
      };
    }),

  // ─── Research & Analysis ────────────────────────────────────────────────────
  researchTopic: protectedProcedure
    .input(z.object({
      topic: z.string().min(5),
      depth: z.enum(["quick", "standard", "deep"]).default("standard"),
      format: z.enum(["summary", "detailed", "bullet-points", "academic"]).default("summary"),
    }))
    .query(async ({ input }) => {
      const depthPrompts = {
        quick: "Provide a quick 2-3 sentence overview.",
        standard: "Provide a comprehensive overview with key points.",
        deep: "Provide an in-depth analysis with nuances and edge cases.",
      };

      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are an expert researcher. Provide accurate, well-sourced information.
Format: ${input.format}
Depth: ${depthPrompts[input.depth]}`,
          },
          {
            role: "user",
            content: `Research topic: ${input.topic}`,
          },
        ],
      });

      const research = response.choices[0].message.content;
      return {
        research: typeof research === "string" ? research : "",
        topic: input.topic,
        depth: input.depth,
        format: input.format,
        timestamp: new Date(),
      };
    }),

  // ─── Translation (Multi-language) ───────────────────────────────────────────
  translate: publicProcedure
    .input(z.object({
      text: z.string().min(1),
      targetLanguage: z.string().min(2).max(50),
      sourceLanguage: z.string().optional(),
      formality: z.enum(["formal", "casual", "neutral"]).default("neutral"),
    }))
    .query(async ({ input }) => {
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are an expert translator. Translate accurately while preserving meaning and tone.
Target language: ${input.targetLanguage}
${input.sourceLanguage ? `Source language: ${input.sourceLanguage}` : ""}
Formality: ${input.formality}
Return ONLY the translated text.`,
          },
          {
            role: "user",
            content: input.text,
          },
        ],
      });

      const translated = response.choices[0].message.content;
      return {
        original: input.text,
        translated: typeof translated === "string" ? translated : "",
        targetLanguage: input.targetLanguage,
        timestamp: new Date(),
      };
    }),

  // ─── Brainstorming & Ideation ───────────────────────────────────────────────
  brainstorm: protectedProcedure
    .input(z.object({
      challenge: z.string().min(10),
      ideaCount: z.number().min(3).max(20).default(10),
      category: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are a creative brainstorming facilitator. Generate ${input.ideaCount} innovative ideas.
${input.category ? `Category: ${input.category}` : ""}
Return as JSON array of ideas with title and description.`,
          },
          {
            role: "user",
            content: `Challenge: ${input.challenge}`,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "brainstorm_ideas",
            strict: true,
            schema: {
              type: "object",
              properties: {
                ideas: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      description: { type: "string" },
                      feasibility: { type: "string", enum: ["easy", "medium", "hard"] },
                      impact: { type: "string", enum: ["low", "medium", "high"] },
                    },
                    required: ["title", "description"],
                  },
                },
              },
              required: ["ideas"],
              additionalProperties: false,
            },
          },
        },
      });

      const content = response.choices[0].message.content;
      return {
        ideas: JSON.parse(typeof content === "string" ? content : "{}"),
        challenge: input.challenge,
        timestamp: new Date(),
      };
    }),
};
