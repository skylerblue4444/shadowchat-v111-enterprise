import { describe, it, expect } from "vitest";
import { eventBusRouter } from "./routers/eventBus";
import { knowledgeRouter } from "./routers/knowledge";
import { workflowRouter } from "./routers/workflow";
import { searchRouter } from "./routers/search";
import { securityRouter } from "./routers/security";
import { developerRouter } from "./routers/developer";
import { digitalTwinRouter } from "./routers/digitalTwin";
import { observabilityRouter } from "./routers/observability";
import { treasuryRouter } from "./routers/treasury";

describe("Enterprise Routers - Structure Validation", () => {
  it("eventBus router has all required procedures", () => {
    const procedures = Object.keys(eventBusRouter._def.procedures);
    expect(procedures).toContain("emit");
    expect(procedures).toContain("list");
    expect(procedures).toContain("subscribe");
    expect(procedures).toContain("subscriptions");
    expect(procedures).toContain("stats");
    expect(procedures.length).toBe(5);
  });

  it("knowledge router has memory and RAG procedures", () => {
    const procedures = Object.keys(knowledgeRouter._def.procedures);
    expect(procedures).toContain("storeMemory");
    expect(procedures).toContain("recall");
    expect(procedures).toContain("listMemories");
    expect(procedures).toContain("deleteMemory");
    expect(procedures).toContain("ingestDocument");
    expect(procedures).toContain("search");
    expect(procedures).toContain("ragQuery");
    expect(procedures).toContain("listDocuments");
    expect(procedures).toContain("deleteDocument");
    expect(procedures.length).toBe(9);
  });

  it("workflow router has CRUD and execution procedures", () => {
    const procedures = Object.keys(workflowRouter._def.procedures);
    expect(procedures).toContain("create");
    expect(procedures).toContain("list");
    expect(procedures).toContain("get");
    expect(procedures).toContain("update");
    expect(procedures).toContain("toggle");
    expect(procedures).toContain("execute");
    expect(procedures).toContain("runs");
    expect(procedures).toContain("delete");
    expect(procedures.length).toBe(8);
  });

  it("search router has global search and indexing", () => {
    const procedures = Object.keys(searchRouter._def.procedures);
    expect(procedures).toContain("global");
    expect(procedures).toContain("index");
    expect(procedures).toContain("searchIndex");
    expect(procedures).toContain("trending");
    expect(procedures.length).toBe(4);
  });

  it("security router has sessions, 2FA, threats, and audit", () => {
    const procedures = Object.keys(securityRouter._def.procedures);
    expect(procedures).toContain("getSessions");
    expect(procedures).toContain("revokeSession");
    expect(procedures).toContain("revokeAllSessions");
    expect(procedures).toContain("toggle2FA");
    expect(procedures).toContain("getThreats");
    expect(procedures).toContain("resolveThread");
    expect(procedures).toContain("dashboard");
    expect(procedures).toContain("getAuditLog");
    expect(procedures.length).toBe(8);
  });

  it("developer router has API keys, webhooks, and plugins", () => {
    const procedures = Object.keys(developerRouter._def.procedures);
    expect(procedures).toContain("createApiKey");
    expect(procedures).toContain("listApiKeys");
    expect(procedures).toContain("revokeApiKey");
    expect(procedures).toContain("createWebhook");
    expect(procedures).toContain("listWebhooks");
    expect(procedures).toContain("toggleWebhook");
    expect(procedures).toContain("deleteWebhook");
    expect(procedures).toContain("listPlugins");
    expect(procedures).toContain("createPlugin");
    expect(procedures).toContain("publishPlugin");
    expect(procedures).toContain("installPlugin");
    expect(procedures).toContain("stats");
    expect(procedures.length).toBe(12);
  });

  it("digitalTwin router has AI-powered twin management", () => {
    const procedures = Object.keys(digitalTwinRouter._def.procedures);
    expect(procedures).toContain("get");
    expect(procedures).toContain("create");
    expect(procedures).toContain("update");
    expect(procedures).toContain("analyze");
    expect(procedures).toContain("simulate");
    expect(procedures).toContain("earnings");
    expect(procedures.length).toBe(6);
  });

  it("observability router has health, metrics, and error tracking", () => {
    const procedures = Object.keys(observabilityRouter._def.procedures);
    expect(procedures).toContain("health");
    expect(procedures).toContain("recordMetric");
    expect(procedures).toContain("metrics");
    expect(procedures).toContain("reportError");
    expect(procedures).toContain("errors");
    expect(procedures).toContain("resolveError");
    expect(procedures).toContain("revenue");
    expect(procedures.length).toBe(7);
  });

  it("treasury router has accounts and revenue tracking", () => {
    const procedures = Object.keys(treasuryRouter._def.procedures);
    expect(procedures).toContain("accounts");
    expect(procedures).toContain("revenue");
    expect(procedures).toContain("recordRevenue");
    expect(procedures).toContain("summary");
    expect(procedures.length).toBe(4);
  });
});

describe("Enterprise Routers - Total Procedure Count", () => {
  it("all enterprise routers combined have 63 procedures", () => {
    const total = [
      eventBusRouter, knowledgeRouter, workflowRouter, searchRouter,
      securityRouter, developerRouter, digitalTwinRouter, observabilityRouter, treasuryRouter,
    ].reduce((sum, r) => sum + Object.keys(r._def.procedures).length, 0);
    expect(total).toBe(63);
  });
});
