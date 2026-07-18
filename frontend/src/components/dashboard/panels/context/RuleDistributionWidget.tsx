import React from 'react';
import { Card, CardContent } from '../../../ui/card';
import { BarChart3 } from 'lucide-react';
import type { OperationalContextPayload } from './ContextTypes';

interface RuleDistributionWidgetProps {
  context: OperationalContextPayload;
}

export const RuleDistributionWidget: React.FC<RuleDistributionWidgetProps> = ({ context }) => {
  const { generatedObservations } = context;

  const total = generatedObservations.length || 1;
  const criticalCount = generatedObservations.filter(o => o.severity === 'critical').length;
  const warningCount = generatedObservations.filter(o => o.severity === 'warning').length;
  const infoCount = generatedObservations.filter(o => o.severity === 'info' || o.severity === 'safe').length;

  const critPct = Math.round((criticalCount / total) * 100);
  const warnPct = Math.round((warningCount / total) * 100);
  const infoPct = 100 - critPct - warnPct;

  return (
    <Card className="bg-carbon-900/80 border-slateBlue-800 backdrop-blur-md shadow-panel relative overflow-hidden">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slateBlue-800/80 pb-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-100 uppercase tracking-wide">
            <BarChart3 className="w-4 h-4 text-industrial-cyan" />
            <span>Observation Severity Distribution</span>
          </div>
          <span className="text-xs font-mono text-slateBlue-400">Total: {total} Cards</span>
        </div>

        <div className="space-y-2">
          {/* Multi-segmented bar */}
          <div className="w-full h-4 rounded-lg bg-carbon-950 overflow-hidden flex border border-slateBlue-800">
            {critPct > 0 && (
              <div
                className="bg-industrial-critical h-full transition-all duration-500 relative group"
                style={{ width: `${critPct}%` }}
                title={`Critical: ${criticalCount} (${critPct}%)`}
              />
            )}
            {warnPct > 0 && (
              <div
                className="bg-industrial-warning h-full transition-all duration-500 relative group"
                style={{ width: `${warnPct}%` }}
                title={`Warning: ${warningCount} (${warnPct}%)`}
              />
            )}
            {infoPct > 0 && (
              <div
                className="bg-industrial-cyan h-full transition-all duration-500 relative group"
                style={{ width: `${infoPct}%` }}
                title={`Info / Safe: ${infoCount} (${infoPct}%)`}
              />
            )}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-industrial-critical" />
              <span className="text-slateBlue-300">Critical: <strong className="text-industrial-critical">{criticalCount}</strong> ({critPct}%)</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-industrial-warning" />
              <span className="text-slateBlue-300">Warning: <strong className="text-industrial-warning">{warningCount}</strong> ({warnPct}%)</span>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <span className="w-2.5 h-2.5 rounded-full bg-industrial-cyan" />
              <span className="text-slateBlue-300">Standard: <strong className="text-cyan-400">{infoCount}</strong> ({infoPct >= 0 ? infoPct : 0}%)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
