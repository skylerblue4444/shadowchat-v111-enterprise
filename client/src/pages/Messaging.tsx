import { trpc } from "@/lib/trpc";
import { useState, useRef, useEffect } from "react";
import { Send, Search, Phone, Video, MoreHorizontal, Smile, Paperclip, Lock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CONTACTS = [
  {id:"c1",name:"Alex Rivera",handle:"@alexr",lastMsg:"Did you see SKYCOIN pump?",time:"2m",unread:3,online:true,color:"from-cyan-400 to-blue-600"},
  {id:"c2",name:"Maya Chen",handle:"@mayachain",lastMsg:"HOPE AI is incredible",time:"15m",unread:1,online:true,color:"from-purple-400 to-pink-600"},
  {id:"c3",name:"Jordan Wells",handle:"@jordanw",lastMsg:"Check the new governance vote",time:"1h",unread:0,online:false,color:"from-green-400 to-teal-600"},
  {id:"c4",name:"Zara Knight",handle:"@zaraknights",lastMsg:"NFT drop tomorrow!",time:"3h",unread:0,online:true,color:"from-amber-400 to-orange-600"},
  {id:"c5",name:"ShadowChat Team",handle:"@team",lastMsg:"New feature deployed",time:"1d",unread:0,online:true,color:"from-red-400 to-rose-600"},
];
const INIT_MSGS: Record<string,{role:"me"|"them",text:string,time:string}[]> = {
  c1:[
    {role:"them",text:"Hey! Did you see SKYCOIN4444 pumping today? 🚀",time:"2:01 PM"},
    {role:"me",text:"Yeah! HOPE AI predicted this move 3 days ago",time:"2:02 PM"},
    {role:"them",text:"Did you see SKYCOIN pump?",time:"2:05 PM"},
  ],
  c2:[{role:"them",text:"HOPE AI is incredible — it just saved me from a bad trade",time:"1:45 PM"}],
};

export default function Messaging() {
  const { data: conversations } = trpc.messaging.getConversations.useQuery();
  const [activeContact, setActiveContact] = useState("c1");
  const [messages, setMessages] = useState(INIT_MSGS);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const contact = CONTACTS.find(c=>c.id===activeContact)!;
  const msgs = messages[activeContact] || [];
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[messages,activeContact]);
  const send = () => {
    if(!input.trim()) return;
    const now = new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
    setMessages(p=>({...p,[activeContact]:[...(p[activeContact]||[]),{role:"me",text:input,time:now}]}));
    setInput("");
    setTimeout(()=>{
      const replies = ["Interesting! 🔥","SKYCOIN to the moon! 🚀","HOPE AI agrees with you","Let me check the charts...","That governance vote is important"];
      const reply = replies[Math.floor(Math.random()*replies.length)];
      setMessages(p=>({...p,[activeContact]:[...(p[activeContact]||[]),{role:"them",text:reply,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]}));
    },800+Math.random()*1200);
  };
  return (
    <div className="flex h-[calc(100vh-44px)] overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 shrink-0 border-r border-white/[0.07] bg-[oklch(0.09_0.01_265)] flex flex-col">
        <div className="p-3 border-b border-white/[0.07]">
          <div className="flex flex-col mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-white tracking-tighter uppercase" style={{ fontFamily: "Syne, sans-serif" }}>
                Secure <span className="text-cyan-400">Node</span>
              </h2>
              <div className="px-1.5 py-0.5 rounded border border-cyan-500/30 bg-cyan-500/10 text-[6px] font-mono text-cyan-400 tracking-[0.1em] uppercase">E2EE</div>
            </div>
            <span className="text-[6px] font-mono text-white/20 uppercase tracking-[0.2em] mt-1">Quantum-Safe Messaging</span>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg pl-8 pr-3 py-1.5 text-[11px] text-white placeholder:text-white/30 outline-none focus:border-cyan-500/40"/>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {CONTACTS.filter(c=>c.name.toLowerCase().includes(search.toLowerCase())).map(c=>(
            <button key={c.id} onClick={()=>setActiveContact(c.id)}
              className={cn("w-full flex items-center gap-2.5 px-3 py-3 hover:bg-white/[0.04] transition-colors text-left border-b border-white/[0.04]",activeContact===c.id&&"bg-cyan-500/10")}>
              <div className="relative shrink-0">
                <div className={cn("w-9 h-9 rounded-full bg-gradient-to-br flex items-center justify-center text-sm font-bold text-white",c.color)}>{c.name[0]}</div>
                {c.online&&<span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-[oklch(0.09_0.01_265)]"/>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-white truncate">{c.name}</span>
                  <span className="text-[9px] text-white/30 shrink-0">{c.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/40 truncate">{c.lastMsg}</span>
                  {c.unread>0&&<span className="w-4 h-4 rounded-full bg-cyan-500 text-[9px] text-white flex items-center justify-center font-bold shrink-0">{c.unread}</span>}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Chat */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-11 border-b border-white/[0.07] flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className={cn("w-7 h-7 rounded-full bg-gradient-to-br flex items-center justify-center text-xs font-bold text-white",contact.color)}>{contact.name[0]}</div>
            <div>
              <div className="text-[12px] font-semibold text-white">{contact.name}</div>
              <div className="text-[9px] text-green-400">{contact.online?"Online":"Offline"}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-green-400" />
            <button onClick={()=>toast.info("Voice call coming soon!")} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white/60 transition-colors"><Phone className="w-4 h-4"/></button>
            <button onClick={()=>toast.info("Video call coming soon!")} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white/60 transition-colors"><Video className="w-4 h-4"/></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {msgs.map((m,i)=>(
            <div key={i} className={cn("flex",m.role==="me"?"justify-end":"justify-start")}>
              <div className={cn("max-w-[70%] rounded-2xl px-3.5 py-2 text-[12px]",m.role==="me"?"bg-cyan-500/20 text-white border border-cyan-500/20":"bg-white/[0.06] text-white/80 border border-white/[0.07]")}>
                <p>{m.text}</p>
                <div className="text-[9px] text-white/30 mt-1 text-right">{m.time}</div>
              </div>
            </div>
          ))}
          <div ref={bottomRef}/>
        </div>
        <div className="border-t border-white/[0.07] p-3">
          <div className="flex gap-2 items-center">
            <button className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white/60 transition-colors"><Paperclip className="w-4 h-4"/></button>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} placeholder="Type a message..." className="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2 text-[12px] text-white placeholder:text-white/30 outline-none focus:border-cyan-500/40"/>
            <button onClick={send} disabled={!input.trim()} className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30 transition-colors disabled:opacity-40"><Send className="w-4 h-4"/></button>
          </div>
        </div>
      </div>
    </div>
  );
}
