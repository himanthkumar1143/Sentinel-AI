import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { BrainCircuit, Lock, Shield, Layers, ArrowRight } from 'lucide-react';

export const OperationalContextIntelligencePanel: React.FC = () => {
  return (
    <Card className="h-full border-slateBlue-800/80 bg-carbon-900/40 relative overflow-hidden flex flex-col justify-between shadow-panel">
      {/* Background blueprint grid styling */}
      <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />

      <CardContent className="p-6 space-y-4 relative z-10 flex flex-col justify-between h-full">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slateBlue-800/80 pb-3">
          <div className="flex items-center gap-2 text-base font-semibold tracking-wide text-slate-100">
            <BrainCircuit className="w-5 h-5 text-industrial-cyan opacity-80" />
            <span>Operational Context Intelligence</span>
          </div>
          <Badge variant="outline" className="border-industrial-cyan/40 text-industrial-cyan font-mono text-xs flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" /> Phase 3
          </Badge>
        </div>

        {/* Locked Enterprise Blueprint Placeholder Center Box */}
        <div className="my-auto py-8 px-6 rounded-xl border border-dashed border-slateBlue-700/80 bg-carbon-900/60 backdrop-blur-md flex flex-col items-center justify-center text-center space-y-3 shadow-inner">
          <div className="w-12 h-12 rounded-xl bg-slateBlue-900/80 border border-slateBlue-700 flex items-center justify-center shadow-glow-safe">
            <Layers className="w-6 h-6 text-industrial-cyan" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-mono font-bold text-slate-100 tracking-wide">
              Operational Context Intelligence Engine
            </h3>
            <p className="text-xs font-mono text-industrial-cyan font-semibold">
              Coming in Phase 3
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slateBlue-300 font-sans max-w-md leading-relaxed pt-1">
            "Correlates sensor, maintenance, permit and shift data into a unified operational context."
          </p>

          <div className="pt-2 flex items-center gap-2 text-xs font-mono text-slateBlue-500">
            <span>Phase 1 active</span>
            <ArrowRight className="w-3.5 h-3.5 text-slateBlue-600" />
            <span>Phase 3 reserved</span>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-slateBlue-800/80 flex items-center justify-between text-xs font-mono text-slateBlue-400">
          <span className="flex items-center gap-1.5 text-slateBlue-400">
            <Shield className="w-3.5 h-3.5 text-industrial-cyan" /> Architecture compliant
          </span>
          <span className="text-slateBlue-500">Phase 1 scope</span>
        </div>
      </CardContent>
    </Card>
  );
};

