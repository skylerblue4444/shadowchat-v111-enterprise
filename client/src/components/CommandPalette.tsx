import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command, X, ArrowRight, Zap, Shield, Globe, Activity, Cpu } from "lucide-react";
import { useLocation } from "wouter";

/**
 * Global Command Palette (Neural Search)
 * Shortcut: CMD+K or CTRL+K
 */

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [, setLocation] = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const items = [
    { path: "/neural-nav", label: "Neural Navigation", category: "System", icon: Cpu },
    { path: "/legal-compliance", label: "Legal Compliance Engine", category: "Enterprise", icon: Shield },
    { path: "/financial", label: "Financial Intelligence Hub", category: "Finance", icon: Zap },
    { path: "/quantum-security", label: "Quantum Security Vault", category: "Security", icon: Shield },
    { path: "/geopolitical", label: "Geopolitical Intel Center", category: "Intelligence", icon: Globe },
    { path: "/gaming", label: "High-Stakes Gaming Hub", category: "Gaming", icon: Activity },
    { path: "/events-hub", label: "Global Events Hub", category: "Events", icon: Activity },
    { path: "/research", label: "Autonomous R&D Lab", category: "Intelligence", icon: Cpu },
    { path: "/workforce", label: "Workforce Management", category: "Enterprise", icon: Activity },
    { path: "/sustainability", label: "Sustainability Hub", category: "Enterprise", icon: Zap },
  ];

  const filteredItems = items.filter(item => 
    item.label.toLowerCase().includes(query.toLowerCase()) || 
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    setLocation(path);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998]"
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl z-[9999] overflow-hidden"
          >
            <div className="relative p-6 border-b border-white/5">
              <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search everything... (Neural Sync Active)"
                className="w-full bg-transparent pl-12 pr-4 text-xl font-bold text-white focus:outline-none placeholder:text-slate-700"
              />
              <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest border border-slate-800 px-2 py-1 rounded">ESC to close</span>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto p-2 custom-scrollbar">
              {filteredItems.length > 0 ? (
                <div className="space-y-1">
                  {filteredItems.map((item, idx) => (
                    <button
                      key={item.path}
                      onClick={() => handleSelect(item.path)}
                      className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-emerald-500 transition-all">
                          <item.icon className="w-5 h-5 text-slate-400 group-hover:text-emerald-400" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{item.label}</div>
                          <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{item.category}</div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-700 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="text-4xl mb-4">🔍</div>
                  <div className="text-slate-500 font-bold">No results found for "{query}"</div>
                  <div className="text-[10px] text-slate-700 font-black uppercase tracking-widest mt-2">Try searching for "Legal" or "Quantum"</div>
                </div>
              )}
            </div>

            <div className="p-4 bg-white/[0.02] border-t border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px] font-mono text-slate-400">↑↓</kbd>
                  <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Navigate</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px] font-mono text-slate-400">ENTER</kbd>
                  <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Select</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Neural Palette Active</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
