import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, Star, MapPin, Zap, Brain, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

const COLORS = ["from-cyan-500 to-blue-600","from-purple-500 to-pink-600","from-green-500 to-teal-600","from-amber-500 to-orange-600"];

export default function Dating() {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState<"left"|"right"|null>(null);
  const { data: profiles } = trpc.dating.discover.useQuery({ limit: 20 });
  const { data: matchList } = trpc.dating.myMatches.useQuery();
  const swipeMutation = trpc.dating.swipe.useMutation({ onSuccess: (r) => { if(r.isMatch) toast.success("It's a match!"); } });
  const matches = matchList || [];
  const allProfiles = profiles || [];
  const profile = allProfiles[idx % (allProfiles.length || 1)];

  const swipe = (direction: "left"|"right") => {
    if(!profile) return;
    setDir(direction);
    setTimeout(()=>{
      swipeMutation.mutate({ targetId: profile.userId, action: direction==="right"?"like":"pass" });
      setIdx(p=>p+1);
      setDir(null);
    },300);
  };

  return (
    <div className="p-5 max-w-[900px] mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight uppercase" style={{fontFamily:"Syne,sans-serif"}}>Matching <span className="text-red-500">Engine</span></h1>
          <p className="text-[10px] font-mono text-white/30 mt-1 uppercase tracking-[0.2em]">AI-Driven Behavioral Alignment</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400">
          <Heart className="w-3.5 h-3.5 fill-red-500"/>
          <span className="text-[11px] font-black font-mono">{matches.length} NODES</span>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card stack */}
        <div className="lg:col-span-2 flex flex-col items-center gap-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={profile.id}
              initial={{opacity:0,scale:0.95,x:dir==="left"?-100:dir==="right"?100:0}}
              animate={{opacity:1,scale:1,x:0}}
              exit={{opacity:0,scale:0.95,x:dir==="left"?-200:200,rotate:dir==="left"?-15:15}}
              transition={{duration:0.25,ease:[0.23,1,0.32,1]}}
              className="w-full max-w-sm"
            >
              <div className="rounded-2xl overflow-hidden border border-white/[0.1] bg-[oklch(0.11_0.01_265)]">
                <div className={cn("h-64 bg-gradient-to-br flex items-end p-4", COLORS[idx % COLORS.length])}>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl font-bold text-white">{profile.name}</span>
                      <span className="text-white/80 text-lg"></span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80 text-[12px]">
                      <MapPin className="w-3 h-3"/> {profile.location || "nearby"}
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Brain className="w-4 h-4 text-cyan-400"/>
                      <span className="text-[12px] text-white font-semibold">AI Match Score</span>
                    </div>
                    <span className="text-xl font-bold text-cyan-400 font-mono">{profile.compatibilityScore}%</span>
                  </div>
                  <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full" style={{width:`${profile.compatibilityScore}%`}}/>
                  </div>
                  <p className="text-[12px] text-white/70">{profile.bio || "ShadowChat enthusiast"}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {((profile.interests as string[]) || []).map((t: string)=>(
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/60">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex gap-4">
            <button onClick={()=>swipe("left")} className="w-14 h-14 rounded-full border-2 border-red-500/40 bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-colors">
              <X className="w-6 h-6"/>
            </button>
            <button onClick={()=>swipe("right")} className="w-14 h-14 rounded-full border-2 border-green-500/40 bg-green-500/10 text-green-400 flex items-center justify-center hover:bg-green-500/20 transition-colors">
              <Heart className="w-6 h-6"/>
            </button>
          </div>
        </div>
        {/* Matches */}
        <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4">
          <h3 className="text-[13px] font-semibold text-white mb-3">Your Matches ({matches.length})</h3>
          {matches.length === 0 ? (
            <div className="text-center py-8 text-white/30 text-[12px]">Start swiping to see matches here</div>
          ) : (
            <div className="space-y-2">
              {matches.map((m: any)=>(
                <div key={m.id} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors cursor-pointer">
                  <div className={cn("w-9 h-9 rounded-full bg-gradient-to-br flex items-center justify-center text-sm font-bold text-white shrink-0", COLORS[m.id % COLORS.length])}>
                    {(m.name || "?")[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-semibold text-white">{m.name}</div>
                    <div className="text-[10px] text-cyan-400">{m.compatibilityScore}% match</div>
                  </div>
                  <MessageCircle className="w-4 h-4 text-white/30"/>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
