import React from "react";
import { motion } from "framer-motion";
import { 
  Trophy, Star, Zap, Activity, 
  Target, Award, Shield, Sparkles,
  ArrowUpRight, Users, Flame, Gem
} from "lucide-react";
import { useNeuralCore } from "@/lib/neural-core-sync";

/**
 * Sovereign Gamification Hub
 * Neural XP, Leveling, and Achievement Tracking
 */

export default function GamificationHub() {
  const { neuralXP, neuralLevel, achievements, skycoin } = useNeuralCore();

  const platformAchievements = [
    { id: 'Sovereign_Founder', title: "Sovereign Founder", desc: "One of the original architects of v1111.", icon: Shield, color: "text-emerald-500" },
    { id: 'First_Mint', title: "First Mint", desc: "Successfully generated MNS via Treasury.", icon: Zap, color: "text-cyan-400" },
    { id: 'Sky_Whale', title: "Sky Whale", desc: "Hold 10,000+ Skycoin4444.", icon: Flame, color: "text-amber-500" },
    { id: 'Legal_Master', title: "Legal Master", desc: "Resolve 10+ cases in AI Supreme Court.", icon: Award, color: "text-purple-400" },
  ];

  const xpToNext = 1000 - (neuralXP % 1000);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-end mb-12 border-b border-slate-800 pb-8">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic mb-2">
            Neural<span className="text-emerald-500">XP</span>
          </h1>
          <p className="text-slate-500 font-mono text-xs tracking-widest uppercase">
            Gamification Engine // Sovereign Leveling
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Current Level</div>
          <div className="text-emerald-500 font-black uppercase text-2xl">Lvl {neuralLevel}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Progress Card */}
        <div className="lg:col-span-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-10 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Trophy className="w-32 h-32 text-emerald-500" />
            </div>
            
            <h2 className="text-2xl font-black uppercase italic mb-8">Neural Progress</h2>
            <div className="space-y-8">
              <div>
                <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Total Experience</div>
                <div className="text-5xl font-black italic tracking-tighter text-white">{neuralXP.toLocaleString()} <span className="text-emerald-500 text-2xl">XP</span></div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-500">Next Level in {xpToNext} XP</span>
                  <span className="text-emerald-500">{((1000 - xpToNext) / 10).toFixed(1)}%</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(1000 - xpToNext) / 10}%` }}
                    className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl">
                  <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Rank</div>
                  <div className="text-sm font-black text-white italic uppercase">Architect</div>
                </div>
                <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl">
                  <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Achievements</div>
                  <div className="text-sm font-black text-white italic uppercase">{achievements.length} Unlocked</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Achievements Grid */}
        <div className="lg:col-span-8">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-8">Sovereign Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {platformAchievements.map((ach) => {
              const isUnlocked = achievements.includes(ach.id);
              return (
                <motion.div 
                  key={ach.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-8 rounded-3xl border transition-all group ${
                    isUnlocked ? "bg-slate-900/40 border-slate-800 hover:border-emerald-500/30" : "bg-slate-900/10 border-slate-900 opacity-50 grayscale"
                  }`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-12 h-12 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center ${isUnlocked ? "group-hover:border-emerald-500/50" : ""} transition-all`}>
                      <ach.icon className={`w-6 h-6 ${isUnlocked ? ach.color : "text-slate-700"}`} />
                    </div>
                    {isUnlocked && (
                      <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded uppercase tracking-widest">
                        Unlocked
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-black uppercase italic mb-2 text-white">{ach.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed uppercase tracking-wider font-bold">{ach.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="mt-20">
        <div className="flex justify-between items-end mb-8 border-b border-slate-800 pb-4">
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-500">Global XP Leaderboard</h2>
          <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-3 h-3" /> Real-time Sync
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { rank: 1, user: "Skyler_Blue", level: 99, xp: "1,245,000" },
            { rank: 2, user: "Neural_Architect", level: 88, xp: "850,400" },
            { rank: 3, user: "Sovereign_Node", level: 77, xp: "444,444" },
            { rank: 4, user: "You", level: neuralLevel, xp: neuralXP.toLocaleString() },
          ].map((u, i) => (
            <div key={i} className={`p-6 rounded-2xl border ${u.user === 'You' ? "border-emerald-500/30 bg-emerald-500/5" : "border-slate-800 bg-slate-900/20"}`}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black text-slate-500">#0{u.rank}</span>
                <span className="text-[10px] font-black text-emerald-500">Lvl {u.level}</span>
              </div>
              <div className="text-sm font-black uppercase italic mb-1">{u.user}</div>
              <div className="text-xs font-mono text-slate-500">{u.xp} XP</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
