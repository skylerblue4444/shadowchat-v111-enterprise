/**
 * IoT & Smart Home Router — Device Management, Automation, Monitoring
 * Inspired by Home Assistant, SmartThings patterns
 */
import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";

export const iotRouter = router({
  // ─── Get devices ───────────────────────────────────────────────────────────
  getDevices: protectedProcedure
    .query(async ({ ctx }) => {
      return {
        devices: [
          { id: "dev_1", name: "Living Room Light", type: "light", status: "on", brightness: 80, room: "Living Room", lastSeen: new Date() },
          { id: "dev_2", name: "Thermostat", type: "climate", status: "on", temperature: 72, targetTemp: 70, room: "Hallway", lastSeen: new Date() },
          { id: "dev_3", name: "Security Camera", type: "camera", status: "recording", room: "Front Door", lastSeen: new Date() },
          { id: "dev_4", name: "Smart Lock", type: "lock", status: "locked", room: "Front Door", lastSeen: new Date() },
          { id: "dev_5", name: "Mining Rig Monitor", type: "sensor", status: "on", hashRate: "120 TH/s", temperature: 65, room: "Server Room", lastSeen: new Date() },
          { id: "dev_6", name: "Solar Panel", type: "energy", status: "generating", output: "4.2 kW", room: "Roof", lastSeen: new Date() },
        ],
        totalDevices: 24,
        onlineDevices: 22,
        rooms: ["Living Room", "Bedroom", "Kitchen", "Server Room", "Front Door", "Roof"],
      };
    }),

  // ─── Control device ────────────────────────────────────────────────────────
  controlDevice: protectedProcedure
    .input(z.object({
      deviceId: z.string(),
      action: z.enum(["on", "off", "toggle", "set_temperature", "lock", "unlock"]),
      value: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      return { success: true, deviceId: input.deviceId, action: input.action, executedAt: new Date() };
    }),

  // ─── Get automations ───────────────────────────────────────────────────────
  getAutomations: protectedProcedure
    .query(async ({ ctx }) => {
      return {
        automations: [
          { id: "auto_1", name: "Night Mode", trigger: "sunset", actions: ["dim lights", "lock doors", "arm security"], enabled: true, lastRun: new Date(Date.now() - 43200000) },
          { id: "auto_2", name: "Mining Cooldown", trigger: "temp > 80°C", actions: ["reduce hashrate", "increase fans", "notify owner"], enabled: true, lastRun: new Date(Date.now() - 3600000) },
          { id: "auto_3", name: "Morning Routine", trigger: "7:00 AM", actions: ["lights on", "coffee maker", "news briefing"], enabled: true, lastRun: new Date(Date.now() - 86400000) },
          { id: "auto_4", name: "Energy Saver", trigger: "solar < 1kW", actions: ["switch to grid", "reduce mining", "notify"], enabled: true, lastRun: new Date(Date.now() - 7200000) },
        ],
      };
    }),

  // ─── Energy dashboard ──────────────────────────────────────────────────────
  getEnergyDashboard: protectedProcedure
    .query(async ({ ctx }) => {
      return {
        today: { generated: 28.4, consumed: 34.2, fromGrid: 5.8, toGrid: 0, cost: 1.74 },
        mining: { hashRate: "120 TH/s", powerConsumption: 3200, earnings24h: 45.67, efficiency: 0.0143 },
        solar: { currentOutput: 4.2, peakToday: 6.8, totalGenerated: 28.4, panels: 12 },
        monthly: { totalCost: 89.45, totalGenerated: 845, totalConsumed: 1024, miningRevenue: 1367.89 },
      };
    }),
});
