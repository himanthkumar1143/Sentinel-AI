import React, { useState, useEffect } from 'react';
import { ShieldAlert, Radio, Clock, Activity } from 'lucide-react';
import type { PlantOverview } from '../../types/industrial';
import { Badge } from '../ui/badge';

export type WorkspaceType = 'overview' | 'scenario-builder' | 'pipeline' | 'operations' | 'operational-context' | 'intelligence';

interface TopBarProps {
  overview: PlantOverview;
  activeWorkspace?: WorkspaceType;
  onSelectWorkspace?: (ws: WorkspaceType) => void;
  onBackToOverview?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  overview,
  onBackToOverview
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getStatusBadgeVariant = (statusColor: string) => {
    if (statusColor === 'critical') return 'critical';
    if (statusColor === 'warning') return 'warning';
    return 'safe';
  };

  return (
    <header className="min-h-[4rem] py-2 sm:py-0 border-b border-slateBlue-800 bg-carbon-900/95 backdrop-blur-md px-4 sm:px-6 flex flex-wrap lg:flex-nowrap items-center justify-between gap-3 sticky top-0 z-50 shadow-md w-full">
      {/* Left section: Back Button & Brand Logo */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0 max-w-full">
        {onBackToOverview && (
          <button
            onClick={onBackToOverview}
            className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-carbon-800 hover:bg-slateBlue-800/80 border border-slateBlue-800 hover:border-industrial-cyan/50 text-slateBlue-300 hover:text-slate-100 text-xs font-mono font-medium transition-all duration-200 shadow-sm shrink-0"
            title="Return to Landing Page"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-industrial-cyan group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">OVERVIEW</span>
          </button>
        )}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-industrial-cyan to-slateBlue-900 border border-industrial-cyan/40 flex items-center justify-center text-industrial-cyan font-mono font-black text-sm shadow-glow-safe shrink-0">
            S
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono font-extrabold text-slate-100 text-sm tracking-wide truncate">
                SentinelAI
              </span>
              <span className="bg-industrial-cyan/15 border border-industrial-cyan/40 text-industrial-cyan font-mono text-[10px] font-bold px-1.5 py-0.2 rounded shrink-0">
                ENTERPRISE PLATFORM
              </span>
            </div>
            <span className="text-[10px] font-mono text-slateBlue-400 hidden sm:block truncate">
              Compound Risk Intelligence Platform
            </span>
          </div>
        </div>
      </div>

      {/* Right section: Gateway status, UTC Clock, Local Time, Plant Status */}
      <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3 ml-auto shrink-0">
        {/* Gateway Status */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded bg-carbon-800 border border-slateBlue-800 text-xs text-slateBlue-300 whitespace-nowrap shrink-0 shadow-inner">
          <Radio className="w-3.5 h-3.5 text-industrial-safe animate-ping" />
          <span className="font-mono font-semibold">Gateway Node-01</span>
          <span className="w-2 h-2 rounded-full bg-industrial-safe shadow-glow-safe" />
        </div>

        {/* Live Clock */}
        <div className="flex items-center gap-2 bg-carbon-800 border border-slateBlue-800 px-3 py-1.5 rounded text-xs font-mono text-slate-200 whitespace-nowrap shrink-0 shadow-inner">
          <Clock className="w-3.5 h-3.5 text-industrial-cyan shrink-0" />
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-100">{time.toISOString().slice(11, 19)} UTC</span>
            <span className="text-slateBlue-500 hidden sm:inline">|</span>
            <span className="text-slateBlue-400 hidden sm:inline font-medium">{time.toLocaleTimeString()} LOCAL</span>
          </div>
        </div>

        {/* Plant Status Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <Activity className="w-4 h-4 text-slateBlue-400 hidden lg:block shrink-0" />
          <Badge variant={getStatusBadgeVariant(overview.statusColor)} className="px-3 sm:px-3.5 py-1 text-xs shadow-lg font-mono font-extrabold whitespace-nowrap shrink-0 tracking-wide border">
            {overview.overallStatus}
          </Badge>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
