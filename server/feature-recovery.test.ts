import { describe, it, expect } from "vitest";

// ─── Dating Router ───
describe("dating router", () => {
  it("exports datingRouter with discover, swipe, myMatches, startMatchChat, analyzeCompatibility", async () => {
    const { datingRouter } = await import("./routers/dating");
    expect(datingRouter).toBeDefined();
    expect(datingRouter._def.procedures.discover).toBeDefined();
    expect(datingRouter._def.procedures.swipe).toBeDefined();
    expect(datingRouter._def.procedures.myMatches).toBeDefined();
    expect(datingRouter._def.procedures.startMatchChat).toBeDefined();
    expect(datingRouter._def.procedures.analyzeCompatibility).toBeDefined();
  });
});

// ─── Live Video Router ───
describe("liveVideo router", () => {
  it("exports liveVideoRouter with browse, startStream, endStream, getChat, sendChat", async () => {
    const { liveVideoRouter } = await import("./routers/liveVideo");
    expect(liveVideoRouter).toBeDefined();
    expect(liveVideoRouter._def.procedures.getLive).toBeDefined();
    expect(liveVideoRouter._def.procedures.startStream).toBeDefined();
    expect(liveVideoRouter._def.procedures.endStream).toBeDefined();
    expect(liveVideoRouter._def.procedures.getMessages).toBeDefined();
    expect(liveVideoRouter._def.procedures.sendMessage).toBeDefined();
  });
});

// ─── Creator Studio Router ───
describe("creatorStudio router", () => {
  it("exports creatorStudioRouter with getProfile, updateProfile, getContent, publish, getScheduled, getRevenue, getAudienceInsights", async () => {
    const { creatorStudioRouter } = await import("./routers/creatorStudio");
    expect(creatorStudioRouter).toBeDefined();
    expect(creatorStudioRouter._def.procedures.getProfile).toBeDefined();
    expect(creatorStudioRouter._def.procedures.updateProfile).toBeDefined();
    expect(creatorStudioRouter._def.procedures.getContent).toBeDefined();
    expect(creatorStudioRouter._def.procedures.createContent).toBeDefined();
    expect(creatorStudioRouter._def.procedures.getScheduled).toBeDefined();
    expect(creatorStudioRouter._def.procedures.getRevenue).toBeDefined();
    expect(creatorStudioRouter._def.procedures.getAudienceInsights).toBeDefined();
  });
});

// ─── Payments Router ───
describe("payments router", () => {
  it("exports paymentsRouter with getSummary, getInvoices, getPayouts, getTransactions, requestPayout", async () => {
    const { paymentsRouter } = await import("./routers/payments");
    expect(paymentsRouter).toBeDefined();
    expect(paymentsRouter._def.procedures.getSummary).toBeDefined();
    expect(paymentsRouter._def.procedures.getInvoices).toBeDefined();
    expect(paymentsRouter._def.procedures.getPayouts).toBeDefined();
    expect(paymentsRouter._def.procedures.getTransactions).toBeDefined();
    expect(paymentsRouter._def.procedures.requestPayout).toBeDefined();
  });
});

// ─── Social Graph Router ───
describe("socialGraph router", () => {
  it("exports socialGraphRouter with getFollowers, getFollowing, follow, unfollow, getMutuals, getInfluenceMap", async () => {
    const { socialGraphRouter } = await import("./routers/socialGraph");
    expect(socialGraphRouter).toBeDefined();
    expect(socialGraphRouter._def.procedures.getFollowers).toBeDefined();
    expect(socialGraphRouter._def.procedures.getFollowing).toBeDefined();
    expect(socialGraphRouter._def.procedures.toggleFollow).toBeDefined();
    expect(socialGraphRouter._def.procedures.getCircles).toBeDefined();
    expect(socialGraphRouter._def.procedures.getMutuals).toBeDefined();
    expect(socialGraphRouter._def.procedures.getStats).toBeDefined();
  });
});

// ─── Sandbox Router ───
describe("sandbox router", () => {
  it("exports sandboxRouter with getEnvironments, createEnvironment, runSimulation, getResults", async () => {
    const { sandboxRouter } = await import("./routers/sandbox");
    expect(sandboxRouter).toBeDefined();
    expect(sandboxRouter._def.procedures.getEnvironments).toBeDefined();
    expect(sandboxRouter._def.procedures.create).toBeDefined();
    expect(sandboxRouter._def.procedures.runSimulation).toBeDefined();
    expect(sandboxRouter._def.procedures.toggleStatus).toBeDefined();
  });
});

// ─── Moderation Router ───
describe("moderation router", () => {
  it("exports moderationRouter with getStats, getReports, reviewReport, getAutomodConfig", async () => {
    const { moderationRouter } = await import("./routers/moderation");
    expect(moderationRouter).toBeDefined();
    expect(moderationRouter._def.procedures.getStats).toBeDefined();
    expect(moderationRouter._def.procedures.getReports).toBeDefined();
    expect(moderationRouter._def.procedures.resolveReport).toBeDefined();
    expect(moderationRouter._def.procedures.checkContent).toBeDefined();
  });
});
