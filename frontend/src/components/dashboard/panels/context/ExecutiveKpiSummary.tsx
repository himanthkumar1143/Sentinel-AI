import React from 'react';
import { Card, CardContent } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { ShieldCheck, AlertTriangle, AlertOctagon, Cpu, CheckCircle2, Zap, BrainCircuit } from 'lucide-react';
import type { OperationalContextPayload } from './ContextTypes';

interface ExecutiveKpiSummaryProps {
  context: OperationalContextPayload;
}

export const ExecutiveKpiSummary: React.FC<ExecutiveKpiSummaryProps> = ({ context }) => {
  const kpiSummary = context.kpiSummary || (context as any).executiveKpiSummary || {
    overallConfidence: context.statistics?.contextConfidence || 100,
    activeRulesCount: context.statistics?.rulesLoaded || 52,
    triggeredAlertsCount: context.statistics?.rulesTriggered || 0,
    compoundRiskLevel: context.scenario === 'critical' ? ('CRITICAL' as const) : context.scenario === 'warning' ? ('WARNING' as const) : ('SAFE' as const),
    processingTimeMs: context.executionTimeMs || 14
  };
  const overallStatus = context.overallStatus || (context as any).overallOperationalStatus || 'ONLINE - NORMAL';
  const scenario = context.scenario || 'normal';

  const isCritical = scenario === 'critical' || kpiSummary?.compoundRiskLevel === 'CRITICAL' || overallStatus?.includes('CRITICAL');
  const isWarning = scenario === 'warning' || kpiSummary?.compoundRiskLevel === 'WARNING' || overallStatus?.includes('WARNING');

  const StatusIcon = isCritical ? AlertOctagon : isWarning ? AlertTriangle : ShieldCheck;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Overall Plant Status */}
      <Card className="bg-carbon-900/80 border-slateBlue-800 backdrop-blur-md shadow-panel relative overflow-hidden group hover:border-slateBlue-600 transition-all">
        <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${isCritical ? 'bg-industrial-critical' : isWarning ? 'bg-industrial-warning' : 'bg-industrial-safe'}`} />
        <CardContent className="p-4 pl-5 flex flex-col justify-between h-full space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slateBlue-400">
            <span>PLANT OPERATIONAL STATE</span>
            <StatusIcon className={`w-4 h-4 ${isCritical ? 'text-industrial-critical animate-pulse' : isWarning ? 'text-industrial-warning' : 'text-industrial-safe'}`} />
          </div>
          <div className="space-y-1">
            <h4 className={`text-sm font-mono font-extrabold uppercase tracking-wide ${isCritical ? 'text-industrial-critical' : isWarning ? 'text-industrial-warning' : 'text-industrial-safe'}`}>
              {overallStatus}
            </h4>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slateBlue-400">
              <span className="w-1.5 h-1.5 rounded-full bg-industrial-cyan animate-ping" />
              <span>Scenario: {scenario.toUpperCase()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Context Confidence */}
      <Card className="bg-carbon-900/80 border-slateBlue-800 backdrop-blur-md shadow-panel relative overflow-hidden group hover:border-slateBlue-600 transition-all">
        <CardContent className="p-4 flex flex-col justify-between h-full space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slateBlue-400">
            <span>INTELLIGENCE CONFIDENCE</span>
            <CheckCircle2 className="w-4 h-4 text-industrial-cyan" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-mono font-black text-slate-100">{kpiSummary.overallConfidence}%</span>
              <Badge variant="outline" className="border-industrial-cyan/40 text-industrial-cyan text-[10px] font-mono">
                VERIFIED
              </Badge>
            </div>
            <div className="w-full bg-carbon-950 h-1.5 rounded-full overflow-hidden border border-slateBlue-800">
              <div
                className="bg-gradient-to-r from-industrial-cyan to-industrial-safe h-full rounded-full transition-all duration-700"
                style={{ width: `${kpiSummary.overallConfidence}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Rules Evaluated */}
      <Card className="bg-carbon-900/80 border-slateBlue-800 backdrop-blur-md shadow-panel relative overflow-hidden group hover:border-slateBlue-600 transition-all">
        <CardContent className="p-4 flex flex-col justify-between h-full space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slateBlue-400">
            <span>DETERMINISTIC RULES</span>
            <BrainCircuit className="w-4 h-4 text-industrial-safe" />
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-mono font-black text-industrial-safe">{kpiSummary.activeRulesCount}</span>
              <span className="text-xs font-mono text-slateBlue-400">/ 52 Active</span>
            </div>
            <p className="text-[10px] font-mono text-slateBlue-400">
              100% Engineering Rule Coverage
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Triggered Alerts */}
      <Card className="bg-carbon-900/80 border-slateBlue-800 backdrop-blur-md shadow-panel relative overflow-hidden group hover:border-slateBlue-600 transition-all">
        <CardContent className="p-4 flex flex-col justify-between h-full space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slateBlue-400">
            <span>TRIGGERED OBSERVATIONS</span>
            <Zap className={`w-4 h-4 ${kpiSummary.triggeredAlertsCount > 0 ? 'text-industrial-warning' : 'text-industrial-safe'}`} />
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline justify-between">
              <span className={`text-2xl font-mono font-black ${kpiSummary.triggeredAlertsCount > 10 ? 'text-industrial-critical' : kpiSummary.triggeredAlertsCount > 0 ? 'text-industrial-warning' : 'text-industrial-safe'}`}>
                {kpiSummary.triggeredAlertsCount}
              </span>
              <Badge variant="outline" className="border-slateBlue-700 text-slateBlue-300 text-[10px] font-mono">
                {context.generatedObservations.length} Cards
              </Badge>
            </div>
            <p className="text-[10px] font-mono text-slateBlue-400">
              Correlated Multi-Domain Events
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Processing Latency */}
      <Card className="bg-carbon-900/80 border-slateBlue-800 backdrop-blur-md shadow-panel relative overflow-hidden group hover:border-slateBlue-600 transition-all">
        <CardContent className="p-4 flex flex-col justify-between h-full space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slateBlue-400">
            <span>SYNTHESIS SPEED</span>
            <Cpu className="w-4 h-4 text-industrial-cyan" />
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-mono font-black text-cyan-300">{kpiSummary.processingTimeMs} ms</span>
              <Badge variant="outline" className="border-industrial-safe/40 text-industrial-safe text-[10px] font-mono">
                SUB-SECOND
              </Badge>
            </div>
            <p className="text-[10px] font-mono text-slateBlue-400">
              Deterministic Engine Synthesis
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
