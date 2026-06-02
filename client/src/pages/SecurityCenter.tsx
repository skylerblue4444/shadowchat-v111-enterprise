import { useState } from "react";
import { Lock, Shield, AlertTriangle, CheckCircle2, Eye, EyeOff, Smartphone, Globe, Activity, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function SecurityCenter() {
  const { data: dashboard, isLoading } = trpc.security.dashboard.useQuery();
  const { data: sessions } = trpc.security.getSessions.useQuery();
  const { data: threats } = trpc.security.getThreats.useQuery({ limit: 10 });
  const { data: auditLog } = trpc.security.getAuditLog.useQuery({ limit: 10 });

  const toggle2FA = trpc.security.toggle2FA.useMutation({
    onSuccess: (d) => toast.success(`2FA ${d.twoFactorEnabled ? "enabled" : "disabled"}`),
  });
  const revokeSession = trpc.security.revokeSession.useMutation({
    onSuccess: () => toast.success("Session revoked"),
  });
  const resolveThread = trpc.security.resolveThread.useMutation({
    onSuccess: () => toast.success("Threat resolved"),
  });

  const [biometric, setBiometric] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(false);

  if (isLoading) return (
    <div className="p-5 flex items-center justify-center h-64">
      <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
    </div>
  );

  return (
    <div className="p-5 max-w-[1000px] space-y-5">
      <div className="flex flex-col">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black text-white tracking-tighter uppercase" style={{ fontFamily: "Syne, sans-serif" }}>
            Cyber <span className="text-cyan-400">Shield</span>
          </h1>
          <div className="flex items-center gap-2">
            <div className="px-2 py-0.5 rounded border border-cyan-500/30 bg-cyan-500/10 text-[8px] font-mono text-cyan-400 tracking-[0.2em] uppercase">Active Defense</div>
            <div className="px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-[8px] font-mono text-emerald-400 tracking-[0.2em] uppercase">Score: 98/100</div>
          </div>
        </div>
        <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.3em] mt-1">Enterprise-Grade Threat Mitigation Suite</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          {label:"Security Score",value:`${dashboard?.securityScore || 0}/100`,icon:Shield,color:"green"},
          {label:"Unresolved Threats",value:String(dashboard?.unresolvedThreats || 0),icon:AlertTriangle,color:"amber"},
          {label:"Active Sessions",value:String(dashboard?.activeSessions || 0),icon:Globe,color:"cyan"},
        ].map(s=>(
          <div key={s.label} className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4">
            <div className="text-[10px] text-white/40 mb-2">{s.label}</div>
            <div className="text-2xl font-bold text-white font-mono">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4 space-y-3">
        <h3 className="text-[13px] font-semibold text-white">Security Settings</h3>
        {[
          {label:"Two-Factor Authentication",desc:"TOTP app required for all logins",state:dashboard?.twoFactorEnabled||false,toggle:()=>toggle2FA.mutate({enabled:!dashboard?.twoFactorEnabled})},
          {label:"Biometric Login",desc:"Use fingerprint or Face ID",state:biometric,toggle:()=>{setBiometric(p=>!p);toast.success(`Biometric ${!biometric?"enabled":"disabled"}`);}},
          {label:"Privacy Mode",desc:"Hide balance and activity from public",state:privacyMode,toggle:()=>{setPrivacyMode(p=>!p);toast.success(`Privacy mode ${!privacyMode?"enabled":"disabled"}`);}},
        ].map(s=>(
          <div key={s.label} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <div>
              <div className="text-[12px] font-semibold text-white">{s.label}</div>
              <div className="text-[10px] text-white/40">{s.desc}</div>
            </div>
            <button onClick={s.toggle}
              className={cn("w-10 h-5 rounded-full transition-all relative",s.state?"bg-cyan-500":"bg-white/[0.12]")}>
              <span className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all",s.state?"left-5":"left-0.5")}/>
            </button>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4">
        <h3 className="text-[13px] font-semibold text-white mb-3">Active Sessions</h3>
        <div className="space-y-2">
          {(sessions && sessions.length > 0) ? sessions.map(s=>(
            <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-white/40"/>
                <div>
                  <div className="text-[12px] font-semibold text-white">{s.deviceName || "Unknown Device"} · {s.browser || s.os}</div>
                  <div className="text-[10px] text-white/40">{s.location || "Unknown"} · {s.ipAddress} · {s.lastActiveAt ? new Date(s.lastActiveAt).toLocaleString() : ""}</div>
                </div>
              </div>
              {s.isCurrent?<span className="text-[10px] text-green-400 font-mono">CURRENT</span>:
                <button onClick={()=>revokeSession.mutate({sessionId:s.id})} className="text-[10px] text-red-400 hover:text-red-300 transition-colors">Revoke</button>}
            </div>
          )) : (
            <div className="text-center py-6 text-white/30 text-[11px]">No active sessions tracked yet</div>
          )}
        </div>
      </div>
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
        <h3 className="text-[13px] font-semibold text-white mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-400"/> Recent Threats</h3>
        <div className="space-y-2">
          {(threats && threats.length > 0) ? threats.map(t=>(
            <div key={t.id} className="flex items-start justify-between p-2.5 rounded-lg bg-white/[0.03]">
              <div className="flex items-start gap-2.5">
                <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0",t.severity==="critical"||t.severity==="high"?"bg-red-400":t.severity==="medium"?"bg-amber-400":"bg-yellow-400")}/>
                <div>
                  <div className="text-[11px] font-semibold text-white">{t.type?.replace(/_/g," ")}</div>
                  <div className="text-[10px] text-white/50">{t.description || "No details"}</div>
                  <div className="text-[9px] text-white/30 mt-0.5">{t.sourceIp} · {new Date(t.createdAt).toLocaleString()}</div>
                </div>
              </div>
              {!t.isResolved && (
                <button onClick={()=>resolveThread.mutate({threatId:t.id})} className="text-[9px] text-cyan-400 hover:text-cyan-300 shrink-0">Resolve</button>
              )}
            </div>
          )) : (
            <div className="text-center py-4 text-white/30 text-[11px]">
              <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-green-400/50"/>
              No threats detected — all clear
            </div>
          )}
        </div>
      </div>
      {auditLog && auditLog.length > 0 && (
        <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4">
          <h3 className="text-[13px] font-semibold text-white mb-3 flex items-center gap-2"><Activity className="w-4 h-4 text-white/40"/> Audit Log</h3>
          <div className="space-y-1">
            {auditLog.map(log=>(
              <div key={log.id} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
                <div className="text-[10px] text-white/60">{log.event}</div>
                <div className="text-[9px] text-white/30">{new Date(log.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
