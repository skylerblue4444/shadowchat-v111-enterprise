import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Shield, Scale, BookOpen, CheckCircle, AlertTriangle, Clock, Download, Plus, Search, Globe, Lock, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const TEMPLATES = [
  { id: 1, name: "Smart Contract - ERC-20 Token", category: "Crypto", uses: 12400, rating: 4.9, desc: "Standard ERC-20 token with burn, mint, and pause" },
  { id: 2, name: "Smart Contract - NFT Collection", category: "Crypto", uses: 8900, rating: 4.8, desc: "ERC-721 with royalties, whitelist, and reveal" },
  { id: 3, name: "SaaS Terms of Service", category: "Business", uses: 34000, rating: 4.7, desc: "Comprehensive ToS for SaaS platforms" },
  { id: 4, name: "Privacy Policy (GDPR + CCPA)", category: "Compliance", uses: 56000, rating: 4.9, desc: "Multi-jurisdiction privacy policy template" },
  { id: 5, name: "Freelancer Service Agreement", category: "Business", uses: 23000, rating: 4.6, desc: "Contract for freelance/consulting work" },
  { id: 6, name: "DAO Constitution", category: "Crypto", uses: 4500, rating: 4.8, desc: "Governance framework for decentralized organizations" },
  { id: 7, name: "Non-Disclosure Agreement (NDA)", category: "Business", uses: 67000, rating: 4.8, desc: "Mutual NDA for business partnerships" },
  { id: 8, name: "Token Sale Agreement (ICO/IDO)", category: "Crypto", uses: 3400, rating: 4.7, desc: "Legal framework for token sales" },
  { id: 9, name: "Employment Contract - Remote", category: "HR", uses: 18000, rating: 4.6, desc: "Remote work employment agreement" },
  { id: 10, name: "Data Processing Agreement", category: "Compliance", uses: 12000, rating: 4.8, desc: "GDPR-compliant DPA for data processors" },
  { id: 11, name: "Intellectual Property Assignment", category: "IP", uses: 8900, rating: 4.7, desc: "IP transfer and assignment agreement" },
  { id: 12, name: "Marketplace Seller Agreement", category: "Business", uses: 5600, rating: 4.5, desc: "Terms for marketplace sellers/vendors" },
];

const DISPUTES = [
  { id: "D-2024-001", title: "Payment dispute - NFT delivery", status: "resolved", amount: "$2,400", date: "2025-01-15", resolution: "Refund issued" },
  { id: "D-2024-002", title: "Service quality complaint", status: "in-review", amount: "$890", date: "2025-01-18", resolution: "Pending mediator" },
  { id: "D-2024-003", title: "Unauthorized transaction", status: "resolved", amount: "$12,000", date: "2025-01-10", resolution: "Funds recovered" },
  { id: "D-2024-004", title: "Copyright infringement claim", status: "escalated", amount: "$5,000", date: "2025-01-20", resolution: "Legal review" },
];

const COMPLIANCE_CHECKS = [
  { region: "EU (GDPR)", status: "compliant", score: 98, items: 47, passed: 46 },
  { region: "US (CCPA/CPRA)", status: "compliant", score: 96, items: 32, passed: 31 },
  { region: "UK (UK GDPR)", status: "compliant", score: 97, items: 38, passed: 37 },
  { region: "Singapore (PDPA)", status: "compliant", score: 94, items: 28, passed: 26 },
  { region: "Australia (APPs)", status: "compliant", score: 95, items: 24, passed: 23 },
  { region: "Canada (PIPEDA)", status: "compliant", score: 99, items: 20, passed: 20 },
];

const IP_ASSETS = [
  { type: "Trademark", name: "ShadowChat™", status: "registered", jurisdiction: "US, EU, UK", filed: "2023-06-15" },
  { type: "Trademark", name: "HOPE AI™", status: "registered", jurisdiction: "US, EU", filed: "2023-08-20" },
  { type: "Patent", name: "AI-Driven Voice Navigation System", status: "pending", jurisdiction: "US", filed: "2024-03-10" },
  { type: "Patent", name: "Decentralized Identity Verification", status: "granted", jurisdiction: "US, EU", filed: "2023-11-05" },
  { type: "Copyright", name: "ShadowChat Platform Source Code", status: "registered", jurisdiction: "International", filed: "2023-05-01" },
  { type: "Trade Secret", name: "HOPE AI Training Data Pipeline", status: "protected", jurisdiction: "Internal", filed: "2023-07-01" },
];

export default function LegalTools() {
  const [activeTab, setActiveTab] = useState<"templates" | "compliance" | "disputes" | "ip">("templates");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const categories = ["All", ...Array.from(new Set(TEMPLATES.map(t => t.category)))];
  const filteredTemplates = TEMPLATES.filter(t => {
    const matchCat = categoryFilter === "All" || t.category === categoryFilter;
    const matchSearch = searchTerm === "" || t.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="p-5 max-w-[1400px] space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>Legal Tools</h1>
          <p className="text-[11px] text-white/40">Smart Contracts · Compliance · IP Protection · Dispute Resolution</p>
        </div>
        <button onClick={() => toast.info("AI Legal Assistant — ask any legal question")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400 text-[11px]">
          <Scale className="w-3.5 h-3.5" /> AI Legal Assistant
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Templates Used", value: "234K", icon: FileText, color: "text-cyan-400" },
          { label: "Compliance Score", value: "97%", icon: Shield, color: "text-green-400" },
          { label: "Disputes Resolved", value: "1,247", icon: Scale, color: "text-purple-400" },
          { label: "IP Assets", value: "6", icon: Lock, color: "text-amber-400" },
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
          { id: "templates", label: "Templates", icon: FileText },
          { id: "compliance", label: "Compliance", icon: Globe },
          { id: "disputes", label: "Disputes", icon: Scale },
          { id: "ip", label: "IP Protection", icon: Lock },
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

      {/* Templates Tab */}
      {activeTab === "templates" && (
        <div className="space-y-4">
          <div className="flex gap-3 flex-col sm:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search templates..." className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-cyan-500/40" />
            </div>
            <div className="flex gap-2">
              {categories.map(c => (
                <button key={c} onClick={() => setCategoryFilter(c)} className={cn("px-3 py-2 rounded-lg text-[11px] border transition-all", categoryFilter === c ? "bg-cyan-500/15 border-cyan-500/25 text-cyan-400" : "border-white/[0.06] text-white/40 hover:border-white/[0.12]")}>{c}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredTemplates.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4 space-y-2 hover:border-cyan-500/20 transition-all cursor-pointer"
                onClick={() => toast.success(`Opening template: ${t.name}`)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] px-2 py-0.5 rounded bg-white/[0.05] text-white/50">{t.category}</span>
                  <span className="text-[10px] text-amber-400">★ {t.rating}</span>
                </div>
                <h4 className="text-[12px] font-semibold text-white">{t.name}</h4>
                <p className="text-[10px] text-white/40">{t.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/30">{t.uses.toLocaleString()} uses</span>
                  <button className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300">
                    <Download className="w-3 h-3" /> Use Template
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Compliance Tab */}
      {activeTab === "compliance" && (
        <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[13px] font-bold text-white">Global Compliance Status</h3>
            <span className="text-[10px] text-green-400 bg-green-500/10 px-2 py-1 rounded-lg border border-green-500/20">
              <CheckCircle className="w-3 h-3 inline mr-0.5" /> All Regions Compliant
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {COMPLIANCE_CHECKS.map(c => (
              <div key={c.region} className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.05] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-white">{c.region}</span>
                  <span className="text-[10px] text-green-400">{c.passed}/{c.items} checks</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/[0.05] overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-green-500 to-cyan-500" style={{ width: `${c.score}%` }} />
                </div>
                <div className="text-[10px] text-white/40">Score: {c.score}%</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disputes Tab */}
      {activeTab === "disputes" && (
        <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[13px] font-bold text-white">Dispute Resolution Center</h3>
            <button onClick={() => toast.info("File new dispute")} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[11px]">
              <Plus className="w-3.5 h-3.5" /> File Dispute
            </button>
          </div>
          {DISPUTES.map(d => (
            <div key={d.id} className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] border border-white/[0.05]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-white/40">{d.id}</span>
                  <span className={cn("text-[9px] px-1.5 py-0.5 rounded",
                    d.status === "resolved" ? "text-green-400 bg-green-500/10" :
                    d.status === "in-review" ? "text-amber-400 bg-amber-500/10" :
                    "text-red-400 bg-red-500/10"
                  )}>{d.status}</span>
                </div>
                <div className="text-[12px] font-medium text-white mt-1">{d.title}</div>
                <div className="text-[10px] text-white/40 mt-0.5">{d.resolution} · {d.date}</div>
              </div>
              <div className="text-right">
                <div className="text-[12px] font-bold text-white font-mono">{d.amount}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* IP Tab */}
      {activeTab === "ip" && (
        <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[13px] font-bold text-white">Intellectual Property Portfolio</h3>
            <button onClick={() => toast.info("File new IP registration")} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400 text-[11px]">
              <Plus className="w-3.5 h-3.5" /> Register IP
            </button>
          </div>
          {IP_ASSETS.map((ip, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] border border-white/[0.05]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.05] text-white/50">{ip.type}</span>
                  <span className={cn("text-[9px] px-1.5 py-0.5 rounded",
                    ip.status === "registered" || ip.status === "granted" ? "text-green-400 bg-green-500/10" :
                    ip.status === "pending" ? "text-amber-400 bg-amber-500/10" :
                    "text-cyan-400 bg-cyan-500/10"
                  )}>{ip.status}</span>
                </div>
                <div className="text-[12px] font-bold text-white mt-1">{ip.name}</div>
                <div className="text-[10px] text-white/40 mt-0.5">{ip.jurisdiction} · Filed: {ip.filed}</div>
              </div>
              <Lock className="w-4 h-4 text-white/20" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
