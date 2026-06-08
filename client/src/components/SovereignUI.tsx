import React from "react";
import { motion } from "framer-motion";

/**
 * Sovereign UI Component Library
 * Standardized components for the ShadowChat v1111 Corporate Identity System (CIS)
 */

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export const SovereignCard: React.FC<CardProps> = ({ children, className = "", glowColor = "emerald" }) => {
  const glowStyles = {
    emerald: "hover:border-emerald-500/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]",
    rose: "hover:border-rose-500/30 hover:shadow-[0_0_20px_rgba(244,63,94,0.1)]",
    cyan: "hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]",
    purple: "hover:border-purple-500/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)]",
    gold: "hover:border-amber-500/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-slate-900/40 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl transition-all duration-500 ${glowStyles[glowColor as keyof typeof glowStyles]} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const SovereignButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  className?: string;
  disabled?: boolean;
}> = ({ children, onClick, variant = "primary", className = "", disabled = false }) => {
  const variants = {
    primary: "bg-emerald-500 text-black hover:bg-emerald-400 shadow-lg shadow-emerald-500/10",
    secondary: "bg-slate-800 text-white hover:bg-slate-700",
    danger: "bg-rose-500 text-white hover:bg-rose-400 shadow-lg shadow-rose-500/10",
    ghost: "bg-transparent border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700",
  };

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-xl font-black uppercase italic text-xs tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export const SovereignBadge: React.FC<{
  children: React.ReactNode;
  type?: "emerald" | "rose" | "cyan" | "purple" | "amber" | "slate";
}> = ({ children, type = "emerald" }) => {
  const types = {
    emerald: "bg-emerald-500/10 text-emerald-500",
    rose: "bg-rose-500/10 text-rose-500",
    cyan: "bg-cyan-500/10 text-cyan-500",
    purple: "bg-purple-500/10 text-purple-500",
    amber: "bg-amber-500/10 text-amber-500",
    slate: "bg-slate-800 text-slate-400",
  };

  return (
    <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${types[type]}`}>
      {children}
    </span>
  );
};

export const SovereignHeading: React.FC<{
  title: string;
  subtitle: string;
  accent?: string;
}> = ({ title, subtitle, accent = "emerald" }) => {
  const accents = {
    emerald: "text-emerald-500",
    rose: "text-rose-500",
    cyan: "text-cyan-500",
    purple: "text-purple-500",
    amber: "text-amber-500",
  };

  return (
    <div className="mb-12 border-b border-slate-800 pb-8">
      <h1 className="text-5xl font-black tracking-tighter uppercase italic mb-2">
        {title.split(" ")[0]}<span className={accents[accent as keyof typeof accents]}>{title.split(" ").slice(1).join(" ")}</span>
      </h1>
      <p className="text-slate-500 font-mono text-[10px] tracking-[0.3em] uppercase">
        {subtitle}
      </p>
    </div>
  );
};
