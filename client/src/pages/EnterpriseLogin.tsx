import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Shield, Cpu, Sparkles, ArrowRight, Fingerprint } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

/**
 * Enterprise Login Portal
 * High-security access for ShadowChat v1111
 */

export default function EnterpriseLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    
    // Simulate high-security authentication
    setTimeout(() => {
      setIsAuthenticating(false);
      toast.success("Access Granted. Welcome, Sovereign.");
      setLocation("/admin-control");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Neural Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15)_0,transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900/40 border border-slate-800 rounded-3xl p-10 backdrop-blur-xl relative z-10 shadow-2xl"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/20">
            <Shield className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic mb-2 text-white">
            Sovereign<span className="text-emerald-500">Access</span>
          </h1>
          <p className="text-slate-500 font-mono text-[10px] tracking-[0.3em] uppercase">
            Enterprise Infrastructure // v1111 Standard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Access Identity</label>
            <div className="relative">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="skyler@shadowchat.ai"
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-4 text-white focus:border-emerald-500 focus:outline-none transition-all placeholder:text-slate-800"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Security Key</label>
            <div className="relative">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-4 text-white focus:border-emerald-500 focus:outline-none transition-all placeholder:text-slate-800"
                required
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isAuthenticating}
            className="w-full bg-emerald-500 text-black font-black uppercase italic py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/10 disabled:opacity-50"
          >
            {isAuthenticating ? (
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
            ) : (
              <>
                Initiate Access <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-10 border-t border-slate-800/50 flex flex-col gap-4">
          <button className="flex items-center justify-between px-6 py-4 bg-slate-950/30 border border-slate-800 rounded-xl hover:border-cyan-500 transition-all group">
            <div className="flex items-center gap-3">
              <Fingerprint className="w-5 h-5 text-cyan-400" />
              <span className="text-xs font-bold text-slate-400 group-hover:text-white">Biometric Neural Sync</span>
            </div>
            <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
          </button>
          
          <div className="flex justify-between items-center px-2">
            <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest flex items-center gap-2">
              <Cpu className="w-3 h-3" /> Quantum Encrypted
            </span>
            <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-3 h-3" /> v1111 Protocol
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
