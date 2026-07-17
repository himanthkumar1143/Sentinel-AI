import React from 'react';
import { Card, CardContent } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { Clock } from 'lucide-react';
import type { OperationalContextPayload } from './ContextTypes';

interface ContextGenerationTimelineProps {
  context: OperationalContextPayload;
}

export const ContextGenerationTimeline: React.FC<ContextGenerationTimelineProps> = ({ context }) => {
  const { timelineActivity } = context;

  const events = timelineActivity && timelineActivity.length > 0 ? timelineActivity : [
    {
      timestamp: '08:14:00',
      domain: 'Maintenance',
      eventTitle: 'SAP Work Order WO-9942 Initiated',
      description: 'Scheduled flange overhaul on Hydrocarbon Storage Manifold #2 started by Maintenance Crew C.',
      severity: 'warning' as const
    },
    {
      timestamp: '08:30:00',
      domain: 'Operations',
      eventTitle: 'Hot Work Safety Permit SWP-882 Active',
      description: 'Safety permit authorized for welding operations adjacent to Reactor Zone A.',
      severity: 'info' as const
    },
    {
      timestamp: '09:02:15',
      domain: 'Safety',
      eventTitle: 'SCADA Telemetry Spike — Gas Sensor #104',
      description: 'Ambient gas concentration reading elevated to 38.5 PPM (above 35 PPM critical threshold).',
      severity: 'critical' as const
    },
    {
      timestamp: '09:02:18',
      domain: 'Compound',
      eventTitle: 'Rule CR-07 Compound Conflict Triggered',
      description: 'Context Engine correlated Gas Spike + Hot Work Permit + 28 Personnel -> Emergency Evacuation Warning.',
      severity: 'critical' as const
    }
  ];

  const getDomainBadge = (domain: string) => {
    switch (domain) {
      case 'Safety':
        return <Badge className="bg-industrial-critical/20 text-industrial-critical border-industrial-critical/40 text-[10px] font-mono">SAFETY</Badge>;
      case 'Operations':
        return <Badge className="bg-industrial-safe/20 text-industrial-safe border-industrial-safe/40 text-[10px] font-mono">OPERATIONS</Badge>;
      case 'Maintenance':
        return <Badge className="bg-industrial-warning/20 text-industrial-warning border-industrial-warning/40 text-[10px] font-mono">MAINTENANCE</Badge>;
      case 'Compound':
        return <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-[10px] font-mono">COMPOUND AI</Badge>;
      default:
        return <Badge className="bg-slateBlue-800 text-slateBlue-300 border-slateBlue-700 text-[10px] font-mono">{domain.toUpperCase()}</Badge>;
    }
  };

  return (
    <Card className="bg-carbon-900/80 border-slateBlue-800 backdrop-blur-md shadow-panel relative overflow-hidden">
      <CardContent className="p-5 sm:p-6 space-y-4 relative z-10">
        <div className="flex items-center justify-between border-b border-slateBlue-800/80 pb-3">
          <div className="flex items-center gap-2 text-sm font-mono font-bold text-slate-100 uppercase tracking-wide">
            <Clock className="w-4 h-4 text-industrial-cyan" />
            <span>Cross-Domain Activity &amp; Event Correlation Timeline (Part 14)</span>
          </div>
          <span className="text-xs font-mono text-slateBlue-400">Temporal Sequence</span>
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slateBlue-800">
          {events.map((evt, idx) => {
            const isCritical = evt.severity === 'critical';
            const isWarning = evt.severity === 'warning';

            return (
              <div key={idx} className="relative flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 group">
                <span className={`absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full border-2 bg-carbon-950 transition-colors ${
                  isCritical ? 'border-industrial-critical text-industrial-critical shadow-glow-critical' : isWarning ? 'border-industrial-warning' : 'border-industrial-cyan'
                }`} />

                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-xs font-bold text-cyan-300">
                      {evt.timestamp}
                    </span>
                    {getDomainBadge(evt.domain)}
                    <h5 className="font-mono text-xs sm:text-sm font-bold text-slate-100">
                      {evt.eventTitle}
                    </h5>
                  </div>
                  <p className="text-xs font-sans text-slateBlue-300 leading-relaxed pl-1">
                    {evt.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
