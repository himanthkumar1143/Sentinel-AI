import React, { useState, useEffect } from 'react';
import { ShieldAlert, Radio, Clock, Activity } from 'lucide-react';
import type { PlantOverview } from '../../types/industrial';
import { Badge } from '../ui/badge';

interface TopBarProps {
  overview: PlantOverview;
}

export const TopBar: React.FC<TopBarProps> = ({ overview }) => {
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
      {/* Brand Logo & Title */}
      <div className="flex items-center gap-3">
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
          <p className="text-xs text-slateBlue-400 hidden sm:block tracking-wide font-medium">
            Industrial Compound Risk Intelligence Platform
          </p>
        </div>
      </div>

      {/* Center / Right Telemetry Status */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Connection Status */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded bg-carbon-800 border border-slateBlue-800 text-xs text-slateBlue-300">
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

