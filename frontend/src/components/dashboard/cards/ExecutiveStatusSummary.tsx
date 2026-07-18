import React from 'react';
import type { PlantOverview, OperationalStatus } from '../../../types/industrial';
import { ShieldCheck, ShieldAlert, Cpu, AlertTriangle, CheckCircle2, Eye, FileText, Clock } from 'lucide-react';

interface ExecutiveStatusSummaryProps {
  overview: PlantOverview;
  operationalStatus: OperationalStatus;
  sensorsCount?: number;
  recommendationsCount?: number;
}

export const ExecutiveStatusSummary: React.FC<ExecutiveStatusSummaryProps> = React.memo(({
  overview,
  operationalStatus: _operationalStatus,
  sensorsCount = 24,
  recommendationsCount = 4
}) => {
  const isCritical = overview.statusColor === 'critical';
  const isWarning = overview.statusColor === 'warning';

  const getStatusBadgeStyle = () => {
    if (isCritical) return 'bg-rose-500/20 text-rose-300 border-rose-500/60 shadow-glow-critical/30';
    if (isWarning) return 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-glow-warning/30';
    return 'bg-industrial-safe/20 text-industrial-safe border-industrial-safe/60 shadow-glow-safe/30';
  };

  const getRiskColor = () => {
    if (overview.compoundRiskIndex >= 70) return 'text-rose-400';
    if (overview.compoundRiskIndex >= 40) return 'text-amber-400';
    return 'text-industrial-cyan';
  };

  return (
    <div className={`bg-gradient-to-r from-carbon-900 via-carbon-850 to-carbon-900 border ${
      isCritical ? 'border-rose-500/60 shadow-[0_0_35px_rgba(244,63,94,0.18)]' : isWarning ? 'border-amber-500/60 shadow-[0_0_35px_rgba(245,158,11,0.18)]' : 'border-slateBlue-800 shadow-panel'
    } rounded-2xl p-6 space-y-4 transition-all duration-300 font-mono select-none`}>
      
      {/* Header Title & Timestamp */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slateBlue-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-industrial-cyan/15 border border-industrial-cyan/40 flex items-center justify-center text-industrial-cyan shrink-0">
            <Cpu className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-industrial-cyan">
              EXECUTIVE BRIEFING
            </span>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-100 uppercase tracking-tight">
              Executive Status Summary
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slateBlue-300 bg-carbon-950/80 px-3 py-1.5 rounded-lg border border-slateBlue-800">
          <Clock className="w-3.5 h-3.5 text-industrial-cyan shrink-0" />
          <span>Last Updated: <strong className="text-slate-100">{overview.lastUpdated || 'Real-Time Sync'}</strong></span>
        </div>
      </div>

      {/* 8 Compact Enterprise KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3">
        {/* 1. Plant Status */}
        <div className="bg-carbon-950/70 border border-slateBlue-800/80 rounded-xl p-2.5 sm:p-3 flex flex-col justify-between hover:border-slateBlue-600 transition-all">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slateBlue-400">Plant Status</span>
          <div className="mt-1 flex items-center gap-1.5">
            {isCritical ? <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" /> : isWarning ? <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" /> : <ShieldCheck className="w-4 h-4 text-industrial-safe shrink-0" />}
            <span className={`text-xs font-extrabold px-1.5 py-0.5 rounded border ${getStatusBadgeStyle()} truncate`}>
              {isCritical ? 'CRITICAL' : isWarning ? 'WARNING' : 'SAFE - ONLINE'}
            </span>
          </div>
        </div>

        {/* 2. Operational Context */}
        <div className="bg-carbon-950/70 border border-slateBlue-800/80 rounded-xl p-2.5 sm:p-3 flex flex-col justify-between hover:border-slateBlue-600 transition-all">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slateBlue-400">Op Context</span>
          <div className="mt-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-industrial-cyan shrink-0" />
            <span className="text-xs font-bold text-slate-100 truncate" title="52 Deterministic Rules Evaluated">
              52 Rules Active
            </span>
          </div>
        </div>

        {/* 3. Compound Risk */}
        <div className="bg-carbon-950/70 border border-slateBlue-800/80 rounded-xl p-2.5 sm:p-3 flex flex-col justify-between hover:border-slateBlue-600 transition-all">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slateBlue-400">Compound Risk</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className={`text-base sm:text-lg font-black ${getRiskColor()}`}>
              {overview.compoundRiskIndex}
            </span>
            <span className="text-[10px] text-slateBlue-400">/ 100</span>
          </div>
        </div>

        {/* 4. AI Decision */}
        <div className="bg-carbon-950/70 border border-slateBlue-800/80 rounded-xl p-2.5 sm:p-3 flex flex-col justify-between hover:border-slateBlue-600 transition-all">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slateBlue-400">AI Decision</span>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-industrial-cyan animate-ping shrink-0" />
            <span className="text-xs font-bold text-industrial-cyan truncate" title="Online Hybrid Model Synced">
              HYBRID SYNCED
            </span>
          </div>
        </div>

        {/* 5. Triggered Rules */}
        <div className="bg-carbon-950/70 border border-slateBlue-800/80 rounded-xl p-2.5 sm:p-3 flex flex-col justify-between hover:border-slateBlue-600 transition-all">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slateBlue-400">Triggered Rules</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className={`text-base sm:text-lg font-black ${overview.activeAlertsCount > 0 ? 'text-amber-400' : 'text-slate-200'}`}>
              {overview.activeAlertsCount}
            </span>
            <span className="text-[10px] text-slateBlue-400 uppercase">Alerts Active</span>
          </div>
        </div>

        {/* 6. Observations */}
        <div className="bg-carbon-950/70 border border-slateBlue-800/80 rounded-xl p-2.5 sm:p-3 flex flex-col justify-between hover:border-slateBlue-600 transition-all">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slateBlue-400">Observations</span>
          <div className="mt-1 flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-slateBlue-400 shrink-0" />
            <span className="text-xs font-bold text-slate-100">
              {sensorsCount} Metrics
            </span>
          </div>
        </div>

        {/* 7. Recommendations */}
        <div className="bg-carbon-950/70 border border-slateBlue-800/80 rounded-xl p-2.5 sm:p-3 flex flex-col justify-between hover:border-slateBlue-600 transition-all">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slateBlue-400">Recommendations</span>
          <div className="mt-1 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-industrial-cyan shrink-0" />
            <span className="text-xs font-bold text-slate-100">
              {recommendationsCount} Actions
            </span>
          </div>
        </div>

        {/* 8. Telemetry Gateway */}
        <div className="bg-carbon-950/70 border border-slateBlue-800/80 rounded-xl p-2.5 sm:p-3 flex flex-col justify-between hover:border-slateBlue-600 transition-all">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slateBlue-400">Gateway</span>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-industrial-safe shrink-0 shadow-glow-safe" />
            <span className="text-xs font-bold text-industrial-safe truncate">
              Node-01 (ONLINE)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

ExecutiveStatusSummary.displayName = 'ExecutiveStatusSummary';
