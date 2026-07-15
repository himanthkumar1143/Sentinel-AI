import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { ShieldAlert, Lock, Flame, Cpu, ArrowRight } from 'lucide-react';

export const CompoundRiskIntelligencePanel: React.FC = () => {
  return (
    <Card className="h-full border-slateBlue-800/80 bg-carbon-900/40 relative overflow-hidden flex flex-col justify-between shadow-panel">
      {/* Background blueprint grid styling */}
      <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />

      <CardContent className="p-6 space-y-4 relative z-10 flex flex-col justify-between h-full">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slateBlue-800/80 pb-3">
          <div className="flex items-center gap-2 text-base font-semibold tracking-wide text-slate-100">
            <ShieldAlert className="w-5 h-5 text-industrial-warning opacity-80" />
            <span>Compound Risk Intelligence</span>
          </div>
          <Badge variant="outline" className="border-industrial-warning/40 text-industrial-warning font-mono text-xs flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" /> Phase 4
          </Badge>
        </div>

        {/* Locked Enterprise Blueprint Placeholder Center Box */}
        <div className="my-auto py-8 px-6 rounded-xl border border-dashed border-slateBlue-700/80 bg-carbon-900/60 backdrop-blur-md flex flex-col items-center justify-center text-center space-y-3 shadow-inner">
          <div className="w-12 h-12 rounded-xl bg-slateBlue-900/80 border border-slateBlue-700 flex items-center justify-center shadow-glow-warning">
            <Flame className="w-6 h-6 text-industrial-warning" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-mono font-bold text-slate-100 tracking-wide">
              Compound Risk Intelligence Engine
            </h3>
            <p className="text-xs font-mono text-industrial-warning font-semibold">
              Coming in Phase 4
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slateBlue-300 font-sans max-w-md leading-relaxed pt-1">
            "Analyzes operational context to identify explainable compound risks."
          </p>

          <div className="pt-2 flex items-center gap-2 text-xs font-mono text-slateBlue-500">
            <span>Phase 1 active</span>
            <ArrowRight className="w-3.5 h-3.5 text-slateBlue-600" />
            <span>Phase 4 reserved</span>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-slateBlue-800/80 flex items-center justify-between text-xs font-mono text-slateBlue-400">
          <span className="flex items-center gap-1.5 text-slateBlue-400">
            <Cpu className="w-3.5 h-3.5 text-industrial-warning" /> Compute pipeline reserved
          </span>
          <span className="text-slateBlue-500">Phase 1 scope</span>
        </div>
      </CardContent>
    </Card>
  );
};

