import React from 'react';
import type { TimelineEvent } from '../../../types/industrial';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { History, Clock, AlertTriangle, Flame, Info, CheckCircle2 } from 'lucide-react';

interface IndustrialEventTimelineProps {
  timeline: TimelineEvent[];
}

export const IndustrialEventTimeline: React.FC<IndustrialEventTimelineProps> = ({ timeline }) => {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Flame className="w-4 h-4 text-industrial-critical animate-pulse" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-industrial-warning" />;
      default:
        return <Info className="w-4 h-4 text-industrial-cyan" />;
    }
  };

  const getBadgeVariant = (severity: string) => {
    if (severity === 'critical') return 'critical';
    if (severity === 'warning') return 'warning';
    return 'info';
  };

  return (
    <Card className="h-full flex flex-col justify-between border-slateBlue-800/90 shadow-panel">
      <CardContent className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slateBlue-800 pb-3">
          <div className="flex items-center gap-2 text-base font-semibold tracking-wide text-slate-100">
            <History className="w-5 h-5 text-industrial-cyan" />
            <span>Timeline</span>
          </div>
          <Badge variant="outline" className="flex items-center gap-1.5 font-mono text-xs">
            <Clock className="w-3.5 h-3.5 text-industrial-cyan" /> Live sync
          </Badge>
        </div>

        {/* Timeline List */}
        <div className="space-y-4 pt-1 max-h-[380px] overflow-y-auto pr-1">
          {timeline.map((item, idx) => {
            const isLast = idx === timeline.length - 1;

            return (
              <div key={item.id} className="relative pl-7 pb-4">
                {/* Subtle vertical connecting line */}
                {!isLast && (
                  <div className="absolute left-2.5 top-6 w-px h-[calc(100%-12px)] bg-slateBlue-800/80" />
                )}

                {/* Node circle / icon */}
                <div className="absolute left-0 top-0.5 w-5 h-5 rounded-full bg-carbon-900 border border-slateBlue-700 flex items-center justify-center shadow-md">
                  {getSeverityIcon(item.severity)}
                </div>

                {/* Event Content */}
                <div className="bg-carbon-900/80 p-3.5 rounded-lg border border-slateBlue-800/80 space-y-2 transition-all hover:border-slateBlue-700">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-200">
                        {item.time}
                      </span>
                      <span className="text-slateBlue-600 font-mono">|</span>
                      <h4 className="text-xs sm:text-sm font-mono font-bold uppercase tracking-tight text-slate-100">
                        {item.title}
                      </h4>
                    </div>
                    <Badge variant={getBadgeVariant(item.severity)} className="font-mono text-[10px]">
                      {item.severity.toUpperCase()}
                    </Badge>
                  </div>

                  <p className="text-xs sm:text-sm font-sans text-slateBlue-300 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between text-xs font-mono text-slateBlue-400 pt-1 border-t border-slateBlue-800/50">
                    <span>Sector: <strong className="text-slateBlue-300">{item.zone}</strong></span>
                    <span className="flex items-center gap-1 text-industrial-safe font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Logged
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-slateBlue-800/60 flex items-center justify-between text-xs font-mono text-slateBlue-400">
          <span>Live event feed</span>
          <span className="text-slateBlue-300 font-semibold">{timeline.length} events chronicled</span>
        </div>
      </CardContent>
    </Card>
  );
};
