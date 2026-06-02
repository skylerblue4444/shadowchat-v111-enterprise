import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Radio, Eye, Play, Plus, Tv } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function LiveVideo() {
  const [tab, setTab] = useState<"browse" | "my">("browse");
  const { data: liveStreams, isLoading } = trpc.liveVideo.getLive.useQuery({ limit: 20 });
  const { data: myStreams } = trpc.liveVideo.myStreams.useQuery();
  const startMutation = trpc.liveVideo.startStream.useMutation({ onSuccess: () => toast.success("Stream started!") });
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<"gaming"|"music"|"talk"|"education"|"creative"|"other">("talk");

  const handleStart = () => {
    if (!title.trim()) return toast.error("Enter a stream title");
    startMutation.mutate({ title, category });
    setShowCreate(false);
    setTitle("");
  };

  return (
    <div className="p-5 max-w-[1100px] mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2" style={{fontFamily:"Syne,sans-serif"}}><Tv className="w-5 h-5 text-red-400"/> Live & Video</h1>
          <p className="text-[11px] text-white/40">Watch live streams, broadcast to your audience</p>
        </div>
        <div className="flex gap-2">
          <button onClick={()=>setTab("browse")} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all",tab==="browse"?"bg-red-500/20 text-red-400 border border-red-500/30":"text-white/50 hover:text-white")}>Browse</button>
          <button onClick={()=>setTab("my")} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all",tab==="my"?"bg-red-500/20 text-red-400 border border-red-500/30":"text-white/50 hover:text-white")}>My Streams</button>
          <button onClick={()=>setShowCreate(true)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center gap-1"><Plus className="w-3 h-3"/> Go Live</button>
        </div>
      </div>
      {showCreate && (
        <div className="rounded-xl border border-white/10 bg-[oklch(0.13_0.01_265)] p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white">Start a Live Stream</h3>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Stream title..." className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-red-500/50"/>
          <div className="flex gap-2 flex-wrap">
            {(["gaming","music","talk","education","creative","other"] as const).map(c=>(
              <button key={c} onClick={()=>setCategory(c)} className={cn("px-3 py-1 rounded-full text-xs capitalize transition-all",category===c?"bg-red-500/20 text-red-400 border border-red-500/30":"bg-white/5 text-white/50 border border-white/10")}>{c}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={handleStart} className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"><Radio className="w-3 h-3 inline mr-1"/> Start Broadcasting</button>
            <button onClick={()=>setShowCreate(false)} className="px-4 py-2 rounded-lg bg-white/5 text-white/60 text-sm hover:bg-white/10 transition-colors">Cancel</button>
          </div>
        </div>
      )}
      {tab==="browse"?(
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading?Array.from({length:6}).map((_,i)=>(<div key={i} className="h-48 rounded-xl bg-white/5 animate-pulse"/>)):
          !liveStreams||liveStreams.length===0?(
            <div className="col-span-full text-center py-16"><Radio className="w-10 h-10 text-gray-600 mx-auto mb-3"/><p className="text-gray-400">No live streams right now</p></div>
          ):(
            liveStreams.map(stream=>(
              <div key={stream.id} className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] overflow-hidden hover:border-red-500/30 transition-colors cursor-pointer group">
                <div className="h-32 bg-gradient-to-br from-red-600/20 to-purple-600/20 relative flex items-center justify-center">
                  <Play className="w-10 h-10 text-white/30 group-hover:text-white/60 transition-colors"/>
                  <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-red-500 rounded text-[10px] text-white font-medium"><Radio className="w-2.5 h-2.5"/> LIVE</div>
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-black/50 rounded text-[10px] text-white"><Eye className="w-2.5 h-2.5"/> {stream.viewerCount}</div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-white truncate">{stream.title}</h3>
                  <p className="text-[11px] text-white/40 mt-0.5">{stream.hostName}</p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/50 capitalize mt-2 inline-block">{stream.category}</span>
                </div>
              </div>
            ))
          )}
        </div>
      ):(
        <div className="space-y-3">
          {!myStreams||myStreams.length===0?(
            <div className="text-center py-16"><Tv className="w-10 h-10 text-gray-600 mx-auto mb-3"/><p className="text-gray-400">You haven't streamed yet</p></div>
          ):(
            myStreams.map(stream=>(
              <div key={stream.id} className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)]">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center",stream.status==="live"?"bg-red-500/20 text-red-400":"bg-white/5 text-white/30")}><Radio className="w-5 h-5"/></div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-white">{stream.title}</h3>
                  <p className="text-[11px] text-white/40">{stream.status==="live"?"Broadcasting now":`Ended`} · {stream.peakViewers} peak viewers</p>
                </div>
                <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium",stream.status==="live"?"bg-red-500/20 text-red-400":"bg-white/5 text-white/40")}>{stream.status}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
