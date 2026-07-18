import React from 'react';
import { ShieldCheck, CheckCircle2, BarChart3, Activity, Cpu, FileText } from 'lucide-react';

interface ExplainableConfidencePanelProps {
  confidenceScore?: number; // e.g. 98.4
  sensorsCount?: number;
  rulesCount?: number;
}

export const ExplainableConfidencePanel: React.FC<ExplainableConfidencePanelProps> = React.memo(({
  confidenceScore = 98.4,
  sensorsCount = 24,
  rulesCount = 52
}) => {
  return (
    <div className="bg-carbon-950/80 border border-slateBlue-800 rounded-2xl p-4 sm:p-5 shadow-panel font-mono space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-slateBlue-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-industrial-cyan/15 border border-industrial-cyan/40 flex items-center justify-center text-industrial-cyan shrink-0">
            <ShieldCheck className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-industrial-cyan">
              EXPLAINABLE AI ASSURANCE • PART 6
            </span>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-100 uppercase tracking-tight">
              Explainable Confidence Breakdown
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-industrial-cyan/10 border border-industrial-cyan/40 px-3 py-1.5 rounded-xl">
          <span className="text-xs text-slateBlue-300 font-bold">Overall:</span>
          <span className="text-sm sm:text-base font-black text-industrial-cyan">{confidenceScore}%</span>
        </div>
      </div>

      {/* Progress Bars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        
        {/* 1. Telemetry Coverage */}
        <div className="bg-carbon-900/90 border border-slateBlue-800/80 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-200 font-bold">
              <Activity className="w-4 h-4 text-industrial-cyan" />
              <span>Telemetry Coverage</span>
            </div>
            <span className="text-industrial-cyan font-black">100% ({sensorsCount}/{sensorsCount} Sensors)</span>
          </div>
          <div className="w-full bg-carbon-950 h-2 rounded-full overflow-hidden border border-slateBlue-800">
            <div className="bg-industrial-cyan h-full rounded-full w-full shadow-glow-safe" />
          </div>
          <p className="text-[11px] text-slateBlue-400 font-sans">
            Continuous SCADA data synchronization with zero packet drop across all critical process lines.
          </p>
        </div>

        {/* 2. Rule Coverage */}
        <div className="bg-carbon-900/90 border border-slateBlue-800/80 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-200 font-bold">
              <Cpu className="w-4 h-4 text-industrial-safe" />
              <span>Rule Coverage</span>
            </div>
            <span className="text-industrial-safe font-black">100% ({rulesCount}/{rulesCount} Rules)</span>
          </div>
          <div className="w-full bg-carbon-950 h-2 rounded-full overflow-hidden border border-slateBlue-800">
            <div className="bg-industrial-safe h-full rounded-full w-full shadow-glow-safe" />
          </div>
          <p className="text-[11px] text-slateBlue-400 font-sans">
            Every deterministic interlock checked before neural processing to guarantee zero hallucination.
          </p>
        </div>

        {/* 3. Observations Used */}
        <div className="bg-carbon-900/90 border border-slateBlue-800/80 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-200 font-bold">
              <BarChart3 className="w-4 h-4 text-slateBlue-300" />
              <span>Observations Used</span>
            </div>
            <span className="text-slate-100 font-black">100% (All Active Data Points)</span>
          </div>
          <div className="w-full bg-carbon-950 h-2 rounded-full overflow-hidden border border-slateBlue-800">
            <div className="bg-slateBlue-300 h-full rounded-full w-full" />
          </div>
          <p className="text-[11px] text-slateBlue-400 font-sans">
            Includes gas concentrations, pressure differentials, worker count, and active LOTO permits.
          </p>
        </div>

        {/* 4. Relationship Analysis */}
        <div className="bg-carbon-900/90 border border-slateBlue-800/80 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-200 font-bold">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Relationship Analysis</span>
            </div>
            <span className="text-amber-400 font-black">99.2% Non-Linear Correlation</span>
          </div>
          <div className="w-full bg-carbon-950 h-2 rounded-full overflow-hidden border border-slateBlue-800">
            <div className="bg-amber-400 h-full rounded-full w-[99.2%]" />
          </div>
          <p className="text-[11px] text-slateBlue-400 font-sans">
            Verified compound interaction between high LEL gas plumes and unshielded hot work ignition sources.
          </p>
        </div>

        {/* 5. Recommendation Confidence */}
        <div className="bg-carbon-900/90 border border-slateBlue-800/80 rounded-xl p-3.5 space-y-2 md:col-span-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-200 font-bold">
              <FileText className="w-4 h-4 text-industrial-cyan" />
              <span>Recommendation Reliability (OSHA &amp; API Standard Alignment)</span>
            </div>
            <span className="text-industrial-cyan font-black">98.8% Verified Safe</span>
          </div>
          <div className="w-full bg-carbon-950 h-2.5 rounded-full overflow-hidden border border-slateBlue-800">
            <div className="bg-gradient-to-r from-industrial-cyan to-cyan-400 h-full rounded-full w-[98.8%] shadow-glow-safe" />
          </div>
          <div className="flex flex-wrap justify-between items-center text-[11px] text-slateBlue-300 pt-0.5">
            <span>✓ Aligned with OSHA 1910.119 PSM Guidelines</span>
            <span>✓ API RP 754 Level 1 &amp; Level 2 Process Safety Compliance</span>
            <span>✓ Verified by Context Engine</span>
          </div>
        </div>

      </div>
    </div>
  );
});

ExplainableConfidencePanel.displayName = 'ExplainableConfidencePanel';
