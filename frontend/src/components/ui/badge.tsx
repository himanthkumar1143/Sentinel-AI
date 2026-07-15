import * as React from "react";
import { cn } from "./card";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'safe' | 'warning' | 'critical' | 'info' | 'outline' | 'maintenance';
}

function Badge({ className, variant = "info", ...props }: BadgeProps) {
  const variants = {
    safe: "bg-industrial-safe/15 text-industrial-safe border-industrial-safe/30 font-mono shadow-[0_0_8px_rgba(16,185,129,0.2)]",
    warning: "bg-industrial-warning/15 text-industrial-warning border-industrial-warning/30 font-mono shadow-[0_0_8px_rgba(245,158,11,0.2)]",
    critical: "bg-industrial-critical/20 text-industrial-critical border-industrial-critical/50 font-mono shadow-[0_0_10px_rgba(244,63,94,0.3)] animate-pulse",
    maintenance: "bg-slateBlue-700/40 text-slateBlue-300 border-slateBlue-600 font-mono",
    info: "bg-industrial-cyan/15 text-industrial-cyan border-industrial-cyan/30 font-mono",
    outline: "text-slateBlue-400 border-slateBlue-700 font-sans"
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider transition-colors focus:outline-none",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
