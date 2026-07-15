import React, { useState, useEffect } from 'react';
import { ShieldAlert, Radio, Clock, Activity, Lock } from 'lucide-react';
import type { PlantOverview } from '../../types/industrial';
import { Badge } from '../ui/badge';

export type WorkspaceType = 'overview' | 'operations' | 'pipeline' | 'intelligence';

interface TopBarProps {
  overview: PlantOverview;
  activeWorkspace?: WorkspaceType;
  onSelectWorkspace?: (ws: WorkspaceType) => void;
  onBackToOverview?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  overview,
  activeWorkspace = 'overview',
  onSelectWorkspace,
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
    <header className="h-16 border-b border-slateBlue-800 bg-carbon-900/95 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50 shadow-md">
      {/* Back Button & Brand Logo */}
      <div className="flex items-center gap-4 sm:gap-6">
        {onBackToOverview && (
          <button
            onClick={onBackToOverview}
            className="group flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-carbon-800 hover:bg-slateBlue-800/80 border border-slateBlue-800 hover:border-industrial-cyan/50 text-slateBlue-300 hover:text-slate-100 text-xs font-mono font-medium transition-all duration-200 shadow-sm hover:shadow-glow-safe/20 shrink-0"
            title="Return to Enterprise Overview"
          >
            <span className="text-industrial-cyan group-hover:-translate-x-1 transition-transform duration-200">←</span>
            <span className="hidden sm:inline uppercase tracking-wider font-semibold">Back to Overview</span>
          </button>
        )}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-industrial-steel to-slateBlue-900 border border-industrial-cyan/40 shadow-glow-safe">
            <ShieldAlert className="w-5 h-5 text-industrial-cyan animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-wider text-slate-100 font-mono uppercase">
                Sentinel<span className="text-industrial-cyan">AI</span>
              </h1>
              <span className="text-[10px] bg-slateBlue-800 text-slateBlue-300 px-2 py-0.5 rounded font-mono border border-slateBlue-700 font-semibold">
                Phase 1
              </span>
            </div>
            <p className="text-xs text-slateBlue-400 hidden xl:block tracking-wide font-medium">
              Industrial Compound Risk Intelligence Platform
            </p>
          </div>
        </div>
      </div>

      {/* PART 1 & PART 11: Enterprise Workspaces Navigation */}
      <nav className="hidden lg:flex items-center gap-1.5 bg-carbon-800/90 border border-slateBlue-800 px-2 py-1 rounded-xl shadow-inner">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'operations', label: 'Operations' },
          { id: 'pipeline', label: 'Pipeline' },
          { id: 'intelligence', label: 'Intelligence' }
        ].map(tab => {
          const isActive = activeWorkspace === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectWorkspace?.(tab.id as WorkspaceType)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all duration-200 ${
                isActive
                  ? 'bg-industrial-cyan text-carbon-950 shadow-glow-safe scale-[1.03]'
                  : 'text-slateBlue-300 hover:text-slate-100 hover:bg-slateBlue-800/60'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
        {/* PART 11: Advanced Simulation (Phase 5 reserved) */}
        <button
          disabled
          className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium uppercase text-slateBlue-500 flex items-center gap-1.5 cursor-not-allowed opacity-60 hover:bg-transparent"
          title="Advanced Simulation will be enabled in Phase 5"
        >
          <span>Advanced Simulation</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-slateBlue-900 border border-slateBlue-700 text-slateBlue-400 font-bold flex items-center gap-0.5">
            <Lock className="w-2.5 h-2.5" /> Phase 5
          </span>
        </button>
      </nav>

      {/* Center / Right Telemetry Status */}
      <div className="flex items-center gap-4 sm:gap-6 shrink-0">
        {/* Connection Status */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded bg-carbon-800 border border-slateBlue-800 text-xs text-slateBlue-300">
          <Radio className="w-3.5 h-3.5 text-industrial-safe animate-ping" />
          <span className="font-mono font-medium">Gateway Node-01</span>
          <span className="w-2 h-2 rounded-full bg-industrial-safe" />
        </div>

        {/* Live Clock */}
        <div className="flex items-center gap-2 bg-carbon-800 border border-slateBlue-800 px-3 py-1.5 rounded text-xs font-mono text-slate-200">
          <Clock className="w-3.5 h-3.5 text-industrial-cyan" />
          <div className="flex flex-col sm:flex-row sm:gap-2">
            <span>{time.toISOString().slice(11, 19)} UTC</span>
            <span className="text-slateBlue-500 hidden sm:inline">|</span>
            <span className="text-slateBlue-400 hidden sm:inline">{time.toLocaleTimeString()} LOCAL</span>
          </div>
        </div>

        {/* Plant Status Badge */}
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-slateBlue-400 hidden md:block" />
          <Badge variant={getStatusBadgeVariant(overview.statusColor)} className="px-3 py-1 text-xs shadow-lg font-mono font-bold">
            {overview.overallStatus}
          </Badge>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
