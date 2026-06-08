// @ts-nocheck
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function Gamification() {
  const [tab, setTab] = useState<"overview" | "achievements" | "quests" | "leaderboard" | "referrals">("overview");
  const { data: profile } = trpc.gamification.profile.useQuery();
  const { data: achievements } = trpc.gamification.achievements.useQuery();
  const { data: quests } = trpc.gamification.dailyQuests.useQuery();
  const { data: streaks } = trpc.gamification.streaks.useQuery();
  const { data: leaderboard } = trpc.gamification.leaderboard.useQuery({ type: "xp", limit: 20 });
  const { data: referrals } = trpc.gamification.referralStats.useQuery();
  const { data: loyalty } = trpc.gamification.loyaltyBalance.useQuery();
  const { data: socialProof } = trpc.gamification.socialProof.useQuery();

  const tabs = [
    { id: "overview", label: "Overview", icon: "🎮" },
    { id: "achievements", label: "Achievements", icon: "🏆" },
    { id: "quests", label: "Daily Quests", icon: "⚔️" },
    { id: "leaderboard", label: "Leaderboard", icon: "👑" },
    { id: "referrals", label: "Referrals", icon: "🔗" },
  ] as const;

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase" style={{ fontFamily: "Syne, sans-serif" }}>
              Prestige <span className="text-purple-400">System</span>
            </h1>
            <div className="px-2 py-0.5 rounded border border-purple-500/30 bg-purple-500/10 text-[8px] font-mono text-purple-400 tracking-[0.2em] uppercase">Global Ranking</div>
          </div>
          <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.3em] mt-1">Gamified Ecosystem & Social Proof Network</span>
        </div>
        {profile && (
          <div className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-2 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
            <div className="relative">
              <span className="text-2xl font-black text-white" style={{ fontFamily: "Space Mono, monospace" }}>LV.{profile.level}</span>
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-purple-500 animate-ping" />
            </div>
            <div className="text-sm border-l border-white/10 pl-3">
              <div className="text-purple-400 font-bold tracking-tight uppercase text-[10px]">{profile.rank}</div>
              <div className="text-white/40 font-mono text-[9px]">{profile.xp.toLocaleString()} / {((profile.level + 1) ** 2 * 100).toLocaleString()} XP</div>
            </div>
          </div>
        )}
      </div>

      {/* XP Progress Bar */}
      {profile && (
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Level {profile.level} → Level {profile.level + 1}</span>
            <span className="text-primary font-medium">{Math.round(profile.xpProgress)}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-500" style={{ width: `${profile.xpProgress}%` }} />
          </div>
          <div className="text-xs text-muted-foreground mt-1">{profile.xpToNextLevel.toLocaleString()} XP to next level</div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-muted/50 rounded-lg p-1 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all ${tab === t.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Stats Cards */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-3xl mb-1">🔥</div>
            <div className="text-2xl font-bold text-foreground">{streaks?.current.login || 0} days</div>
            <div className="text-sm text-muted-foreground">Login Streak</div>
            <div className="text-xs text-primary mt-1">{streaks?.multiplier ? `${streaks.multiplier.toFixed(1)}x` : "1x"} XP multiplier</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-3xl mb-1">🏆</div>
            <div className="text-2xl font-bold text-foreground">{profile?.unlockedAchievements || 0}/{profile?.totalAchievements || 0}</div>
            <div className="text-sm text-muted-foreground">Achievements</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-3xl mb-1">⚔️</div>
            <div className="text-2xl font-bold text-foreground">{quests?.completedToday || 0}/{quests?.totalAvailable || 0}</div>
            <div className="text-sm text-muted-foreground">Quests Today</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-3xl mb-1">💎</div>
            <div className="text-2xl font-bold text-foreground">{loyalty?.balance.toLocaleString() || 0}</div>
            <div className="text-sm text-muted-foreground">SKY Tokens</div>
          </div>

          {/* Social Proof Feed */}
          <div className="md:col-span-2 lg:col-span-4 bg-card border border-border rounded-xl p-4">
            <h3 className="font-semibold text-foreground mb-3">Live Activity</h3>
            <div className="space-y-2">
              {socialProof?.events.map((e, i) => (
                <div key={i} className="flex items-center gap-2 text-sm py-1 border-b border-border last:border-0">
                  <span className="font-medium text-primary">{e.user}</span>
                  <span className="text-muted-foreground">{e.message}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{Math.floor((Date.now() - e.time) / 60000)}m ago</span>
                </div>
              ))}
            </div>
            <div className="text-xs text-muted-foreground mt-2">{socialProof?.totalActiveNow.toLocaleString()} users active now</div>
          </div>
        </div>
      )}

      {tab === "achievements" && (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">{achievements?.progress.toFixed(1)}% complete ({achievements?.unlocked.length}/{achievements?.total})</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {achievements?.unlocked.map(a => (
              <div key={a.id} className="bg-card border border-primary/30 rounded-xl p-4 flex items-start gap-3">
                <span className="text-3xl">{a.icon}</span>
                <div>
                  <div className="font-medium text-foreground">{a.name}</div>
                  <div className="text-xs text-muted-foreground">{a.description}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${a.rarity === "legendary" ? "bg-yellow-500/20 text-yellow-500" : a.rarity === "epic" ? "bg-purple-500/20 text-purple-500" : a.rarity === "rare" ? "bg-blue-500/20 text-blue-500" : "bg-muted text-muted-foreground"}`}>{a.rarity}</span>
                    <span className="text-xs text-primary">+{a.xpReward} XP</span>
                  </div>
                </div>
              </div>
            ))}
            {achievements?.locked.slice(0, 9).map(a => (
              <div key={a.id} className="bg-card border border-border rounded-xl p-4 flex items-start gap-3 opacity-50">
                <span className="text-3xl grayscale">🔒</span>
                <div>
                  <div className="font-medium text-foreground">{a.name}</div>
                  <div className="text-xs text-muted-foreground">{a.description}</div>
                  <div className="text-xs text-muted-foreground mt-1">{a.unlockedBy}% of users have this</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "quests" && (
        <div className="space-y-3">
          {quests?.quests.map((q, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium text-foreground">{q.name}</div>
                <span className="text-sm text-primary font-medium">+{q.xp} XP</span>
              </div>
              <div className="text-sm text-muted-foreground mb-2">{q.description}</div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min(100, ((q.progress || 0) / (q.target || 1)) * 100)}%` }} />
              </div>
              <div className="text-xs text-muted-foreground mt-1">{q.progress}/{q.target} {q.completed ? "✅ Complete!" : ""}</div>
            </div>
          ))}
        </div>
      )}

      {tab === "leaderboard" && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="divide-y divide-border">
            {leaderboard?.leaders.map(l => (
              <div key={l.rank} className={`flex items-center gap-4 px-4 py-3 ${l.rank <= 3 ? "bg-primary/5" : ""}`}>
                <span className="text-lg font-bold w-8 text-center">{l.badge || `#${l.rank}`}</span>
                <div className="flex-1">
                  <div className="font-medium text-foreground">{l.username}</div>
                  <div className="text-xs text-muted-foreground">Level {l.level}</div>
                </div>
                <div className="text-sm font-semibold text-primary">{l.value.toLocaleString()} XP</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "referrals" && referrals && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-sm text-muted-foreground mb-1">Your Referral Code</div>
            <div className="text-xl font-mono font-bold text-primary">{referrals.referralCode}</div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div><div className="text-2xl font-bold text-foreground">{referrals.totalReferrals}</div><div className="text-xs text-muted-foreground">Total Referrals</div></div>
              <div><div className="text-2xl font-bold text-foreground">{referrals.activeReferrals}</div><div className="text-xs text-muted-foreground">Active</div></div>
              <div><div className="text-2xl font-bold text-foreground">{referrals.totalEarned}</div><div className="text-xs text-muted-foreground">XP Earned</div></div>
            </div>
          </div>
          <div className="space-y-2">
            {referrals.tiers.map((t, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${t.reached ? "border-primary/30 bg-primary/5" : "border-border bg-card"}`}>
                <span className="text-lg">{t.reached ? "✅" : "🔒"}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">Level {t.level}: {t.referrals} referrals</div>
                  <div className="text-xs text-muted-foreground">{t.bonus}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
