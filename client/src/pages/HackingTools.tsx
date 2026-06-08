import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Wifi, Globe, Server, Lock, AlertTriangle, Terminal, Eye, Zap, CheckCircle, XCircle, Clock, Activity, Bug, Search, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/* ─── Scan Types ─────────────────────────────────────────────────────── */
const SCAN_TYPES = [
  { id: "port", label: "Port Scanner", icon: Server, desc: "Scan open ports and services", risk: "low" },
  { id: "vuln", label: "Vulnerability Assessment", icon: Bug, desc: "OWASP Top 10 + CVE database", risk: "medium" },
  { id: "network", label: "Network Mapper", icon: Wifi, desc: "Discover hosts and topology", risk: "low" },
  { id: "web", label: "Web App Scanner", icon: Globe, desc: "XSS, SQLi, CSRF detection", risk: "high" },
  { id: "ssl", label: "SSL/TLS Analyzer", icon: Lock, desc: "Certificate and cipher audit", risk: "low" },
  { id: "dns", label: "DNS Enumeration", icon: Search, desc: "Subdomain discovery and records", risk: "low" },
];

const RECENT_SCANS = [
  { id: 1, target: "api.shadowchat.io", type: "Vulnerability Assessment", status: "completed", findings: 3, severity: "medium", duration: "4m 23s", date: "2 hours ago" },
  { id: 2, target: "192.168.1.0/24", type: "Network Mapper", status: "completed", findings: 24, severity: "info", duration: "1m 47s", date: "5 hours ago" },
  { id: 3, target: "exchange.shadowchat.io", type: "Web App Scanner", status: "completed", findings: 1, severity: "high", duration: "12m 08s", date: "1 day ago" },
  { id: 4, target: "mail.shadowchat.io", type: "SSL/TLS Analyzer", status: "completed", findings: 0, severity: "none", duration: "0m 34s", date: "1 day ago" },
  { id: 5, target: "cdn.shadowchat.io", type: "Port Scanner", status: "running", findings: 8, severity: "low", duration: "2m 11s", date: "Just now" },
];

const VULNERABILITIES = [
  { id: "CVE-2024-1234", title: "SQL Injection in Login Endpoint", severity: "critical", status: "patched", affected: "/api/auth/login", cvss: 9.8 },
  { id: "CVE-2024-5678", title: "XSS via Unescaped User Input", severity: "high", status: "patched", affected: "/api/posts/create", cvss: 7.5 },
  { id: "CVE-2024-9012", title: "Rate Limiting Bypass", severity: "medium", status: "mitigated", affected: "/api/trpc/*", cvss: 5.3 },
  { id: "CVE-2024-3456", title: "Weak TLS Cipher Suite", severity: "low", status: "patched", affected: "TLS 1.2 config", cvss: 3.1 },
  { id: "CVE-2024-7890", title: "Information Disclosure in Error Messages", severity: "medium", status: "open", affected: "/api/exchange/order", cvss: 4.7 },
];

const BUG_BOUNTY = [
  { id: 1, title: "Critical RCE in Image Upload", reward: "$50,000", hunter: "h4ck3r_01", status: "paid", date: "2024-12-15" },
  { id: 2, title: "Authentication Bypass via OAuth", reward: "$25,000", hunter: "security_ninja", status: "paid", date: "2024-11-28" },
  { id: 3, title: "IDOR in Wallet Transfer API", reward: "$15,000", hunter: "bug_bounty_pro", status: "paid", date: "2024-11-10" },
  { id: 4, title: "SSRF in Webhook Handler", reward: "$10,000", hunter: "white_hat_42", status: "reviewing", date: "2025-01-02" },
  { id: 5, title: "DOM XSS in Chat Module", reward: "$5,000", hunter: "xss_master", status: "paid", date: "2024-10-22" },
];

const COMPLIANCE = [
  { standard: "OWASP Top 10", score: 94, status: "passing", lastAudit: "2025-01-15" },
  { standard: "PCI DSS 4.0", score: 98, status: "passing", lastAudit: "2025-01-10" },
  { standard: "SOC 2 Type II", score: 96, status: "passing", lastAudit: "2024-12-20" },
  { standard: "ISO 27001", score: 92, status: "passing", lastAudit: "2024-12-01" },
  { standard: "GDPR", score: 99, status: "passing", lastAudit: "2025-01-18" },
  { standard: "HIPAA", score: 91, status: "passing", lastAudit: "2024-11-30" },
];

export default function HackingTools() {
  const [activeTab, setActiveTab] = useState<"scanner" | "vulns" | "bounty" | "compliance">("scanner");
  const [scanTarget, setScanTarget] = useState("");
  const [scanType, setScanType] = useState("port");
  const [isScanning, setIsScanning] = useState(false);

  const startScan = () => {
    if (!scanTarget) { toast.error("Enter a target URL or IP"); return; }
    setIsScanning(true);
    toast.success(`Starting ${SCAN_TYPES.find(s => s.id === scanType)?.label} on ${scanTarget}`);
    setTimeout(() => {
      setIsScanning(false);
      toast.success("Scan complete! 0 critical findings.");
    }, 3000);
  };

  const severityColor = (s: string) => {
    switch (s) {
      case "critical": return "text-red-400 bg-red-500/10 border-red-500/20";
      case "high": return "text-orange-400 bg-orange-500/10 border-orange-500/20";
      case "medium": return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "low": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      default: return "text-green-400 bg-green-500/10 border-green-500/20";
    }
  };

  return (
    <div className="p-5 max-w-[1400px] space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>Ethical Hacking Tools</h1>
          <p className="text-[11px] text-white/40">Enterprise Security · Penetration Testing · Bug Bounty · Compliance</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-[11px]">
            <Shield className="w-3.5 h-3.5" /> All Systems Secure
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Scans Run", value: "12,847", icon: Activity, color: "text-cyan-400" },
          { label: "Vulns Found", value: "347", icon: Bug, color: "text-amber-400" },
          { label: "Patched", value: "342", icon: CheckCircle, color: "text-green-400" },
          { label: "Bounty Paid", value: "$285K", icon: Zap, color: "text-purple-400" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center">
              <s.icon className={cn("w-4 h-4", s.color)} />
            </div>
            <div>
              <div className="text-[10px] text-white/40">{s.label}</div>
              <div className="text-sm font-bold text-white font-mono">{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
        {[
          { id: "scanner", label: "Scanner", icon: Terminal },
          { id: "vulns", label: "Vulnerabilities", icon: Bug },
          { id: "bounty", label: "Bug Bounty", icon: Zap },
          { id: "compliance", label: "Compliance", icon: FileText },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-medium transition-all",
              activeTab === tab.id
                ? "bg-cyan-500/15 border border-cyan-500/25 text-cyan-400"
                : "text-white/40 hover:text-white/60"
            )}
          >
            <tab.icon className="w-3.5 h-3.5" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Scanner Tab */}
      {activeTab === "scanner" && (
        <div className="space-y-4">
          {/* Scan Input */}
          <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-5 space-y-4">
            <h3 className="text-[13px] font-bold text-white">New Scan</h3>
            <div className="flex gap-3 flex-col sm:flex-row">
              <input
                value={scanTarget}
                onChange={e => setScanTarget(e.target.value)}
                placeholder="Enter target URL or IP (e.g., example.com or 192.168.1.1)"
                className="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-cyan-500/40"
              />
              <select
                value={scanType}
                onChange={e => setScanType(e.target.value)}
                className="bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white/70 outline-none"
              >
                {SCAN_TYPES.map(s => <option key={s.id} value={s.id} className="bg-[#0a0a1a]">{s.label}</option>)}
              </select>
              <button
                onClick={startScan}
                disabled={isScanning}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-[0.97]",
                  isScanning
                    ? "bg-amber-500/20 border border-amber-500/30 text-amber-400"
                    : "bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30"
                )}
              >
                {isScanning ? <><Clock className="w-4 h-4 animate-spin" /> Scanning...</> : <><Zap className="w-4 h-4" /> Start Scan</>}
              </button>
            </div>

            {/* Scan Types Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SCAN_TYPES.map(s => (
                <button
                  key={s.id}
                  onClick={() => setScanType(s.id)}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-lg border text-left transition-all",
                    scanType === s.id
                      ? "bg-cyan-500/10 border-cyan-500/25 text-cyan-400"
                      : "bg-white/[0.02] border-white/[0.06] text-white/50 hover:border-white/[0.12]"
                  )}
                >
                  <s.icon className="w-4 h-4 shrink-0" />
                  <div>
                    <div className="text-[11px] font-medium">{s.label}</div>
                    <div className="text-[9px] opacity-60">{s.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Scans */}
          <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-5 space-y-3">
            <h3 className="text-[13px] font-bold text-white">Recent Scans</h3>
            <div className="space-y-2">
              {RECENT_SCANS.map(scan => (
                <div key={scan.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-2 h-2 rounded-full", scan.status === "running" ? "bg-amber-400 animate-pulse" : "bg-green-400")} />
                    <div>
                      <div className="text-[12px] font-medium text-white">{scan.target}</div>
                      <div className="text-[10px] text-white/40">{scan.type} · {scan.duration}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn("text-[10px] px-2 py-0.5 rounded border", severityColor(scan.severity))}>
                      {scan.findings} findings
                    </span>
                    <span className="text-[10px] text-white/30">{scan.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Vulnerabilities Tab */}
      {activeTab === "vulns" && (
        <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[13px] font-bold text-white">Known Vulnerabilities</h3>
            <span className="text-[10px] text-green-400 bg-green-500/10 px-2 py-1 rounded-lg border border-green-500/20">4/5 Patched</span>
          </div>
          <div className="space-y-2">
            {VULNERABILITIES.map(vuln => (
              <div key={vuln.id} className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.05] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={cn("text-[10px] px-2 py-0.5 rounded border font-mono", severityColor(vuln.severity))}>
                      {vuln.severity.toUpperCase()}
                    </span>
                    <span className="text-[11px] font-mono text-white/50">{vuln.id}</span>
                  </div>
                  <span className={cn("text-[10px] px-2 py-0.5 rounded",
                    vuln.status === "patched" ? "text-green-400 bg-green-500/10" :
                    vuln.status === "mitigated" ? "text-amber-400 bg-amber-500/10" :
                    "text-red-400 bg-red-500/10"
                  )}>
                    {vuln.status === "patched" && <CheckCircle className="w-3 h-3 inline mr-1" />}
                    {vuln.status}
                  </span>
                </div>
                <div className="text-[12px] font-medium text-white">{vuln.title}</div>
                <div className="flex items-center gap-3 text-[10px] text-white/40">
                  <span>Affected: <code className="text-cyan-400/70">{vuln.affected}</code></span>
                  <span>CVSS: <span className="font-mono text-white/60">{vuln.cvss}</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bug Bounty Tab */}
      {activeTab === "bounty" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-bold text-white">Bug Bounty Program</h3>
              <button onClick={() => toast.info("Bug Bounty submission portal")} className="px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400 text-[11px]">
                Submit Report
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Critical", reward: "$50,000", color: "text-red-400" },
                { label: "High", reward: "$25,000", color: "text-orange-400" },
                { label: "Medium", reward: "$10,000", color: "text-amber-400" },
                { label: "Low", reward: "$2,500", color: "text-blue-400" },
              ].map(tier => (
                <div key={tier.label} className="rounded-lg bg-white/[0.03] p-3 text-center">
                  <div className={cn("text-[10px] font-medium", tier.color)}>{tier.label}</div>
                  <div className="text-sm font-bold text-white font-mono mt-1">{tier.reward}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-5 space-y-3">
            <h3 className="text-[13px] font-bold text-white">Recent Payouts</h3>
            {BUG_BOUNTY.map(b => (
              <div key={b.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                <div>
                  <div className="text-[12px] font-medium text-white">{b.title}</div>
                  <div className="text-[10px] text-white/40">by {b.hunter} · {b.date}</div>
                </div>
                <div className="text-right">
                  <div className="text-[12px] font-bold text-green-400 font-mono">{b.reward}</div>
                  <div className={cn("text-[9px]", b.status === "paid" ? "text-green-400" : "text-amber-400")}>{b.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compliance Tab */}
      {activeTab === "compliance" && (
        <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-5 space-y-3">
          <h3 className="text-[13px] font-bold text-white">Compliance Dashboard</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {COMPLIANCE.map(c => (
              <div key={c.standard} className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.05] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-white">{c.standard}</span>
                  <span className="text-[10px] text-green-400 bg-green-500/10 px-2 py-0.5 rounded">
                    <CheckCircle className="w-3 h-3 inline mr-0.5" /> {c.status}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/[0.05] overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-green-500" style={{ width: `${c.score}%` }} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-white/40">
                  <span>Score: {c.score}%</span>
                  <span>Last audit: {c.lastAudit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
