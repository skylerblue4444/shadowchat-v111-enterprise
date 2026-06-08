import React from "react";
import { motion } from "framer-motion";
import { 
  UserCheck, ShieldCheck, Fingerprint, 
  Key, FileText, Globe, Activity, Lock
} from "lucide-react";
import { useNeuralCore } from "@/lib/neural-core-sync";
import { SovereignCard, SovereignBadge, SovereignButton, SovereignHeading } from "@/components/SovereignUI";

/**
 * Sovereign Identity Vault Hub
 * Citizen ID, biometric verification, and decentralized identity
 */

export default function SovereignIdentityVault() {
  const { level, xp } = useNeuralCore();

  const credentials = [
    { type: "Citizen ID", status: "Verified", id: "SC-4444-ALPHA", icon: UserCheck },
    { type: "Biometric Hash", status: "Secured", id: "BIO-992-HSH", icon: Fingerprint },
    { type: "Governance Key", status: "Active", id: "GOV-KEY-V1", icon: Key },
    { type: "Sovereign Passport", status: "Ready", id: "PASS-GLB-01", icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      <SovereignHeading 
        title="Identity Vault" 
        subtitle="Sovereign Citizen ID // Biometric Verification // DID" 
        accent="emerald"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Profile Card */}
        <div className="lg:col-span-4 space-y-6">
          <SovereignCard glowColor="emerald" className="text-center flex flex-col items-center py-12">
            <div className="w-32 h-32 rounded-full border-4 border-emerald-500/20 p-2 mb-6 relative">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                <UserCheck className="w-16 h-16 text-emerald-400" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full border-4 border-[#050505] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-black uppercase italic mb-1">Sovereign_Citizen</h3>
            <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-6">Tier: Planetary_Alpha</p>
            <div className="flex gap-4">
              <SovereignBadge type="emerald">LVL {level}</SovereignBadge>
              <SovereignBadge type="cyan">{xp} XP</SovereignBadge>
            </div>
          </SovereignCard>

          <SovereignCard glowColor="slate">
            <h3 className="text-sm font-black uppercase italic mb-6">Security Settings</h3>
            <div className="space-y-4">
              {[
                { label: "Biometric Sync", status: "ON" },
                { label: "Quantum Encryption", status: "ON" },
                { label: "Sovereign Recovery", status: "READY" },
              ].map(setting => (
                <div key={setting.label} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-[10px] text-white/50 font-black uppercase tracking-widest">{setting.label}</span>
                  <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">{setting.status}</span>
                </div>
              ))}
            </div>
          </SovereignCard>
        </div>

        {/* Credentials Grid */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {credentials.map((cred, i) => (
              <SovereignCard key={i} glowColor="emerald" className="group">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                    <cred.icon className="w-6 h-6 text-white/30 group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <SovereignBadge type="emerald">{cred.status}</SovereignBadge>
                </div>
                <h4 className="text-lg font-black uppercase italic mb-1">{cred.type}</h4>
                <div className="text-[10px] text-white/20 font-mono mb-6">{cred.id}</div>
                <SovereignButton variant="outline" className="w-full py-4 text-[9px] font-black tracking-widest">
                  VIEW CERTIFICATE
                </SovereignButton>
              </SovereignCard>
            ))}
          </div>
          
          <SovereignCard glowColor="cyan">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center">
                <Lock className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-lg font-black uppercase italic mb-1">Zero-Knowledge Proofs</h4>
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-relaxed">
                  Your identity is protected by ZK-SNARKs, allowing you to prove your citizenship without revealing personal data.
                </p>
              </div>
            </div>
          </SovereignCard>
        </div>
      </div>
    </div>
  );
}
