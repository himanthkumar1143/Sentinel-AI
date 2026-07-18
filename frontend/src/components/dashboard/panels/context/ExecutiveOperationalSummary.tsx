import React from 'react';
import { Card, CardContent } from '../../../ui/card';
import { Sparkles, Terminal } from 'lucide-react';
import type { OperationalContextPayload } from './ContextTypes';

interface ExecutiveOperationalSummaryProps {
  context: OperationalContextPayload;
}

export const ExecutiveOperationalSummary: React.FC<ExecutiveOperationalSummaryProps> = ({ context }) => {
  const kpiSummary = context.kpiSummary || (context as any).executiveKpiSummary || {};
  const isCritical = context.scenario === 'critical' || kpiSummary.compoundRiskLevel === 'CRITICAL' || (context as any).overallOperationalStatus?.includes('CRITICAL');
  const isWarning = context.scenario === 'warning' || kpiSummary.compoundRiskLevel === 'WARNING' || (context as any).overallOperationalStatus?.includes('WARNING');

  const getSummaryText = (summary: any): string => {
    if (typeof summary === 'string') return summary;
    if (summary && typeof summary === 'object') {
      if (summary.overallPlantStatus) {
        const factors = Array.isArray(summary.primaryFactors) ? ' ' + summary.primaryFactors.join(' ') : '';
        return `${summary.overallPlantStatus}${factors}`;
      }
    }
    return 'Operational intelligence context synthesized across all active plant domains.';
  };

  return (
    <Card className={`border backdrop-blur-md shadow-panel relative overflow-hidden transition-all duration-300 ${
      isCritical
        ? 'bg-gradient-to-r from-carbon-900 via-industrial-critical/10 to-carbon-900 border-industrial-critical/50 shadow-[0_0_30px_rgba(244,63,94,0.15)]'
        : isWarning
        ? 'bg-gradient-to-r from-carbon-900 via-industrial-warning/10 to-carbon-900 border-industrial-warning/50 shadow-[0_0_25px_rgba(245,158,11,0.12)]'
        : 'bg-gradient-to-r from-carbon-900 via-industrial-cyan/5 to-carbon-900 border-slateBlue-800'
    }`}>
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      <CardContent className="p-5 sm:p-6 relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="space-y-2 max-w-4xl">
          <div className="flex items-center gap-2.5">
            <span className={`w-2.5 h-2.5 rounded-full animate-ping ${
              isCritical ? 'bg-industrial-critical' : isWarning ? 'bg-industrial-warning' : 'bg-industrial-safe'
            }`} />
            <span className={`text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-1.5 ${
              isCritical ? 'text-industrial-critical' : isWarning ? 'text-industrial-warning' : 'text-industrial-cyan'
            }`}>
              <Sparkles className="w-3.5 h-3.5" />
              EXECUTIVE OPERATIONAL BRIEFING
            </span>
          </div>
          <p className="text-sm sm:text-base font-sans font-medium text-slate-100 leading-relaxed">
            {getSummaryText(context.executiveSummary)}
          </p>
        </div>

        <div className="shrink-0 bg-carbon-950/80 border border-slateBlue-800 rounded-xl p-3.5 px-4 font-mono text-xs flex flex-col justify-center space-y-1 self-stretch sm:self-auto min-w-[190px]">
          <div className="flex items-center justify-between text-slateBlue-400 text-[10px] uppercase tracking-wider">
            <span>Synthesis Engine</span>
            <Terminal className="w-3.5 h-3.5 text-industrial-cyan" />
          </div>
          <div className="font-bold text-slate-200">
            ID: <span className="text-cyan-300">{context.contextId}</span>
          </div>
          <div className="text-[11px] text-slateBlue-400">
            {new Date(context.timestamp).toLocaleTimeString()} UTC
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
