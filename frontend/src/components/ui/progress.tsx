import * as React from "react";
import { cn } from "./card";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0-100
  variant?: 'safe' | 'warning' | 'critical' | 'cyan';
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, variant = 'cyan', ...props }, ref) => {
    const clampedValue = Math.min(100, Math.max(0, value));

    const barColors = {
      safe: 'bg-industrial-safe shadow-[0_0_8px_rgba(16,185,129,0.5)]',
      warning: 'bg-industrial-warning shadow-[0_0_8px_rgba(245,158,11,0.5)]',
      critical: 'bg-industrial-critical shadow-[0_0_10px_rgba(244,63,94,0.7)]',
      cyan: 'bg-industrial-cyan shadow-[0_0_8px_rgba(6,182,212,0.5)]'
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-slateBlue-900 border border-slateBlue-800",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "h-full w-full flex-1 transition-all duration-500 ease-out",
            barColors[variant]
          )}
          style={{ transform: `translateX(-${100 - clampedValue}%)` }}
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
