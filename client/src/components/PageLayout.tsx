/*
 * PageLayout — shared wrapper for all module pages
 */
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: "cyan" | "gold" | "green" | "red" | "purple";
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

const badgeStyles = {
  cyan: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  gold: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  green: "bg-green-500/15 text-green-400 border-green-500/30",
  red: "bg-red-500/15 text-red-400 border-red-500/30",
  purple: "bg-purple-500/15 text-purple-400 border-purple-500/30",
};

export default function PageLayout({
  title, subtitle, badge, badgeColor = "cyan", actions, children, className
}: PageLayoutProps) {
  return (
    <div className={cn("min-h-full p-6", className)}>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Syne, sans-serif' }}>
              {title}
            </h1>
            {badge && (
              <span className={cn(
                "text-[10px] px-2 py-0.5 rounded border font-mono font-semibold tracking-wider",
                badgeStyles[badgeColor]
              )}>
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
      {children}
    </div>
  );
}

/* Stat card */
export function StatCard({
  label, value, sub, color = "cyan", icon: Icon
}: {
  label: string; value: string | number; sub?: string;
  color?: "cyan" | "gold" | "green" | "red" | "purple";
  icon?: React.ElementType;
}) {
  const colors = {
    cyan: { text: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
    gold: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    green: { text: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
    red: { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
    purple: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  };
  const c = colors[color];
  return (
    <div className={cn("rounded-lg border p-4 card-dark", c.border)}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
        {Icon && <div className={cn("p-1.5 rounded", c.bg)}><Icon className={cn("w-3.5 h-3.5", c.text)} /></div>}
      </div>
      <div className={cn("text-2xl font-bold mono", c.text)}>{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </div>
  );
}

/* Section header */
export function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">{title}</h2>
      {action}
    </div>
  );
}

/* Module card */
export function ModuleCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("card-dark rounded-lg border border-border p-4", className)}>
      {children}
    </div>
  );
}
