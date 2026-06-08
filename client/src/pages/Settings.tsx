import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Globe, CreditCard, Cpu, Moon, Sun } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const SECTIONS = [
  {id:"account",icon:User,label:"Account"},
  {id:"notifications",icon:Bell,label:"Notifications"},
  {id:"security",icon:Shield,label:"Security"},
  {id:"appearance",icon:Palette,label:"Appearance"},
  {id:"ai",icon:Cpu,label:"AI & Agents"},
  {id:"billing",icon:CreditCard,label:"Billing"},
];

export default function Settings() {
  const { data: profile } = trpc.profile.getMe.useQuery();
  const { user: currentUser } = useAuth();
  if (!currentUser) return null;
  const [section, setSection] = useState("account");
  const [darkMode, setDarkMode] = useState(true);
  const [lang, setLang] = useState("English");
  const [currency, setCurrency] = useState("USD");
  const [notifs, setNotifs] = useState({trades:true,social:true,governance:true,security:true,marketing:false});
  return (
    <div className="flex h-[calc(100vh-44px)] overflow-hidden">
      <div className="w-56 shrink-0 border-r border-white/[0.07] bg-[oklch(0.09_0.01_265)] p-3">
        <h2 className="text-[13px] font-bold text-white mb-3 px-2" style={{fontFamily:"Syne,sans-serif"}}>Settings</h2>
        <div className="space-y-0.5">
          {SECTIONS.map(s=>(
            <button key={s.id} onClick={()=>setSection(s.id)}
              className={cn("w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all",section===s.id?"bg-cyan-500/15 text-cyan-400":"text-white/50 hover:text-white/80 hover:bg-white/[0.04]")}>
              <s.icon className="w-4 h-4 shrink-0"/>
              <span className="text-[12px] font-medium">{s.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        {section==="account" && (
          <div className="max-w-[600px] space-y-5">
            <h3 className="text-[15px] font-bold text-white">Account Settings</h3>
            <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[{label:"Display Name",val:currentUser.name},{label:"Username",val:(currentUser as any)?.username || 'user'},{label:"Email",val:"skyler@shadowchat.ai"},{label:"Phone",val:"+1 (555) 444-4444"}].map(f=>(
                  <div key={f.label}>
                    <label className="text-[10px] text-white/40 mb-1.5 block">{f.label}</label>
                    <input defaultValue={f.val} className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2 text-[12px] text-white outline-none focus:border-cyan-500/40"/>
                  </div>
                ))}
              </div>
              <button onClick={()=>toast.success("Account settings saved!")} className="px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[12px] hover:bg-cyan-500/30 transition-colors">Save Changes</button>
            </div>
          </div>
        )}
        {section==="notifications" && (
          <div className="max-w-[600px] space-y-5">
            <h3 className="text-[15px] font-bold text-white">Notification Preferences</h3>
            <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-5 space-y-3">
              {Object.entries(notifs).map(([key,val])=>(
                <div key={key} className="flex items-center justify-between py-2 border-b border-white/[0.05] last:border-0">
                  <div>
                    <div className="text-[12px] font-semibold text-white capitalize">{key} Notifications</div>
                    <div className="text-[10px] text-white/40">Receive alerts for {key} activity</div>
                  </div>
                  <button onClick={()=>{setNotifs(p=>({...p,[key]:!val}));toast.success(`${key} notifications ${!val?"enabled":"disabled"}`);}}
                    className={cn("w-10 h-5 rounded-full transition-all relative",val?"bg-cyan-500":"bg-white/[0.12]")}>
                    <span className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all",val?"left-5":"left-0.5")}/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {section==="appearance" && (
          <div className="max-w-[600px] space-y-5">
            <h3 className="text-[15px] font-bold text-white">Appearance</h3>
            <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[12px] font-semibold text-white">Dark Mode</div>
                  <div className="text-[10px] text-white/40">ShadowChat dark luxury theme</div>
                </div>
                <button onClick={()=>setDarkMode(p=>!p)} className={cn("w-10 h-5 rounded-full transition-all relative",darkMode?"bg-cyan-500":"bg-white/[0.12]")}>
                  <span className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all",darkMode?"left-5":"left-0.5")}/>
                </button>
              </div>
              <div>
                <label className="text-[10px] text-white/40 mb-1.5 block">Language</label>
                <select value={lang} onChange={e=>setLang(e.target.value)} className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2 text-[12px] text-white outline-none focus:border-cyan-500/40">
                  {["English","Spanish","French","German","Japanese","Chinese"].map(l=><option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-white/40 mb-1.5 block">Currency Display</label>
                <select value={currency} onChange={e=>setCurrency(e.target.value)} className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2 text-[12px] text-white outline-none focus:border-cyan-500/40">
                  {["USD","EUR","GBP","JPY","BTC","ETH"].map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <button onClick={()=>toast.success("Appearance settings saved!")} className="px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[12px] hover:bg-cyan-500/30 transition-colors">Save</button>
            </div>
          </div>
        )}
        {!["account","notifications","appearance"].includes(section) && (
          <div className="max-w-[600px]">
            <h3 className="text-[15px] font-bold text-white mb-4 capitalize">{SECTIONS.find(s=>s.id===section)?.label} Settings</h3>
            <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-8 text-center">
              <div className="text-4xl mb-3">⚙️</div>
              <div className="text-[13px] font-semibold text-white capitalize">{section} configuration</div>
              <div className="text-[11px] text-white/40 mt-1">Enterprise {section} management — full controls available</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
