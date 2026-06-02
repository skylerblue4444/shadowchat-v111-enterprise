import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Video, Music, Image, FileText, Play, Upload, TrendingUp, DollarSign, Star, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CONTENT_TYPES = [
  {id:"video",icon:Video,label:"Video",desc:"Short-form & long-form video content"},
  {id:"music",icon:Music,label:"Music",desc:"AI-generated tracks & remixes"},
  {id:"image",icon:Image,label:"Image",desc:"AI art, NFT collections, visuals"},
  {id:"post",icon:FileText,label:"Post",desc:"Written content & threads"},
];
const MY_CONTENT = [
  {id:"c1",title:"SKYCOIN4444 Deep Dive",type:"video",views:124000,earnings:4444,status:"published"},
  {id:"c2",title:"HOPE AI Tutorial",type:"video",views:89000,earnings:2800,status:"published"},
  {id:"c3",title:"ShadowChat Anthem",type:"music",views:44000,earnings:1200,status:"published"},
  {id:"c4",title:"Web3 Future Thread",type:"post",views:18000,earnings:440,status:"published"},
];

export default function CreatorStudio() {
  const { data: myPosts } = trpc.social.getFeed.useQuery({ limit: 10 });
  const [tab, setTab] = useState("Dashboard");
  const [aiPrompt, setAiPrompt] = useState("");
  const TABS = ["Dashboard","Create","Monetize","Analytics","AI Studio"];
  return (
    <div className="p-5 max-w-[1200px] space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase" style={{ fontFamily: "Syne, sans-serif" }}>
              Media <span className="text-cyan-400">Forge</span>
            </h1>
            <div className="px-2 py-0.5 rounded border border-cyan-500/30 bg-cyan-500/10 text-[8px] font-mono text-cyan-400 tracking-[0.2em] uppercase">Creator Studio</div>
          </div>
          <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.3em] mt-1">AI-Accelerated Content Engine</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-400">
          <DollarSign className="w-3.5 h-3.5"/>
          <span className="text-[11px] font-black font-mono">8,884 USD</span>
        </div>
      </div>
      <div className="flex gap-1 p-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)} className={cn("flex-1 py-1.5 rounded-md text-[11px] font-medium transition-all",tab===t?"bg-cyan-500/20 text-cyan-400 border border-cyan-500/20":"text-white/40 hover:text-white/60")}>{t}</button>
        ))}
      </div>
      {tab==="Dashboard" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {label:"Total Views",value:"275K"},
              {label:"Total Earnings",value:"$8,884"},
              {label:"Subscribers",value:"12.4K"},
              {label:"Avg Engagement",value:"18.7%"},
            ].map(s=>(
              <div key={s.label} className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4">
                <div className="text-[10px] text-white/40 mb-2">{s.label}</div>
                <div className="text-xl font-bold text-white font-mono">{s.value}</div>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] overflow-hidden">
            <div className="px-4 py-3 border-b border-white/[0.06]"><h3 className="text-[13px] font-semibold text-white">My Content</h3></div>
            <div className="divide-y divide-white/[0.04]">
              {MY_CONTENT.map(c=>(
                <div key={c.id} className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center">
                    {c.type==="video"?<Video className="w-4 h-4 text-cyan-400"/>:c.type==="music"?<Music className="w-4 h-4 text-purple-400"/>:c.type==="image"?<Image className="w-4 h-4 text-amber-400"/>:<FileText className="w-4 h-4 text-green-400"/>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-semibold text-white">{c.title}</div>
                    <div className="text-[10px] text-white/40">{c.views.toLocaleString()} views</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[12px] font-bold text-amber-400 font-mono">${c.earnings.toLocaleString()}</div>
                    <div className="text-[10px] text-green-400">{c.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {tab==="AI Studio" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5">
            <h3 className="text-[13px] font-semibold text-white flex items-center gap-2 mb-3"><Wand2 className="w-4 h-4 text-cyan-400"/> AI Content Generator</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CONTENT_TYPES.map(ct=>(
                  <div key={ct.id} className="p-3 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:border-cyan-500/30 transition-colors cursor-pointer text-center">
                    <ct.icon className="w-5 h-5 mx-auto mb-1.5 text-cyan-400"/>
                    <div className="text-[11px] font-semibold text-white">{ct.label}</div>
                    <div className="text-[9px] text-white/30 mt-0.5">{ct.desc}</div>
                  </div>
                ))}
              </div>
              <textarea value={aiPrompt} onChange={e=>setAiPrompt(e.target.value)} rows={3} placeholder="Describe what you want to create... e.g. 'A viral TikTok about SKYCOIN4444 going to the moon with epic music'"
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-cyan-500/40 resize-none"/>
              <button onClick={()=>toast.success("AI content generation started! Check back in 30 seconds.")} disabled={!aiPrompt.trim()}
                className="w-full py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-semibold hover:bg-cyan-500/30 transition-colors disabled:opacity-40">
                Generate with HOPE AI
              </button>
            </div>
          </div>
        </div>
      )}
      {!["Dashboard","AI Studio"].includes(tab) && (
        <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-8 text-center">
          <div className="text-4xl mb-3">🎬</div>
          <div className="text-[13px] font-semibold text-white">{tab}</div>
          <div className="text-[11px] text-white/40 mt-1">Full {tab.toLowerCase()} tools — enterprise creator suite</div>
        </div>
      )}
    </div>
  );
}
