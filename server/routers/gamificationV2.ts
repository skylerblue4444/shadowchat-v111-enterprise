/**
 * Gamification Engine v2 — Seasons, battle pass, quests, guilds, tournaments
 * Inspired by Fortnite, Discord, Duolingo patterns
 */
import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";

export const gamificationV2Router = router({
  getSeason: protectedProcedure.query(async () => ({
    current: { id: "s_4", name: "Shadow Season 4: Crypto Wars", startDate: new Date("2025-06-01"), endDate: new Date("2025-09-01"), tier: 47, maxTier: 100, xp: 23456, xpToNext: 5000 },
    battlePass: { owned: true, premium: true, rewards: [
      { tier: 1, free: "100 SKY", premium: "500 SKY" }, { tier: 10, free: "Avatar Frame", premium: "Legendary Avatar" },
      { tier: 25, free: "Chat Theme", premium: "Custom Emotes Pack" }, { tier: 50, free: "1000 SKY", premium: "Exclusive NFT" },
      { tier: 75, free: "Title: Veteran", premium: "Animated Profile" }, { tier: 100, free: "5000 SKY", premium: "Legendary Skin + 10K SKY" },
    ]},
    stats: { totalXP: 1234567, level: 78, rank: "Diamond III", streak: 34, questsCompleted: 567 },
  })),
  getDailyQuests: protectedProcedure.query(async () => ({
    daily: [
      { id: "dq_1", name: "Post 3 messages", progress: 2, target: 3, xp: 100, expires: new Date(Date.now() + 43200000) },
      { id: "dq_2", name: "Complete 1 trade", progress: 0, target: 1, xp: 200, expires: new Date(Date.now() + 43200000) },
      { id: "dq_3", name: "Like 5 posts", progress: 5, target: 5, xp: 75, expires: new Date(Date.now() + 43200000), completed: true },
    ],
    weekly: [
      { id: "wq_1", name: "Earn 1000 SKY", progress: 678, target: 1000, xp: 500, expires: new Date(Date.now() + 259200000) },
      { id: "wq_2", name: "Win 3 casino games", progress: 1, target: 3, xp: 750, expires: new Date(Date.now() + 259200000) },
    ],
    seasonal: [
      { id: "sq_1", name: "Reach Level 50", progress: 47, target: 50, xp: 5000 },
      { id: "sq_2", name: "Trade $10,000 volume", progress: 7890, target: 10000, xp: 10000 },
    ],
  })),
  getGuilds: protectedProcedure.query(async () => ({
    myGuild: { id: "g_1", name: "Shadow Elite", members: 234, level: 15, xp: 456789, rank: 3, banner: "dragon" },
    leaderboard: [
      { rank: 1, name: "Crypto Kings", members: 500, xp: 1234567, level: 23 },
      { rank: 2, name: "AI Masters", members: 345, xp: 987654, level: 20 },
      { rank: 3, name: "Shadow Elite", members: 234, xp: 456789, level: 15 },
    ],
    wars: [{ id: "war_1", opponent: "Crypto Kings", status: "active", ourScore: 12456, theirScore: 11234, endsAt: new Date(Date.now() + 172800000) }],
  })),
  getTournaments: protectedProcedure.query(async () => ({
    active: [
      { id: "t_1", name: "Weekly Trading Championship", participants: 456, prizePool: 50000, endsAt: new Date(Date.now() + 259200000), myRank: 23 },
      { id: "t_2", name: "AI Agent Battle Royale", participants: 128, prizePool: 25000, endsAt: new Date(Date.now() + 86400000), myRank: 7 },
    ],
    upcoming: [
      { id: "t_3", name: "Crypto Prediction Contest", startAt: new Date(Date.now() + 604800000), prizePool: 100000, maxParticipants: 1000 },
    ],
    history: [
      { id: "t_h1", name: "May Madness", myRank: 5, prize: 2500, participants: 890 },
    ],
  })),
});
