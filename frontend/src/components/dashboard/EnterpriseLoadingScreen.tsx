import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cpu, Activity, Layers, BrainCircuit, CheckCircle2 } from 'lucide-react';

const stages = [
  { label: 'Loading Plant Telemetry...', icon: Activity, desc: 'Handshaking with SCADA Gateway Node-01' },
  { label: 'Collecting Sensor Data...', icon: Layers, desc: 'Synchronizing 24 high-frequency gas & pressure metrics' },
  { label: 'Building Operational Context...', icon: ShieldCheck, desc: 'Correlating active permits, LOTO status & workers on-site' },
  { label: 'Running Deterministic Rule Engine...', icon: Cpu, desc: 'Evaluating 52 non-linear industrial safety interlocks' },
  { label: 'Detecting Compound Risks...', icon: Activity, desc: 'Computing multi-hazard thermodynamic blast radius' },
  { label: 'Preparing AI Report...', icon: BrainCircuit, desc: 'Synthesizing explainable executive intelligence' }
];

export const EnterpriseLoadingScreen: React.FC = React.memo(() => {
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStageIdx((prev) => (prev < stages.length - 1 ? prev + 1 : prev));
    }, 320);

    return () => clearInterval(timer);
  }, []);

  const progressPct = Math.round(((currentStageIdx + 1) / stages.length) * 100);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12 text-center min-h-[600px] bg-carbon-900 font-mono select-none">
      <div className="max-w-md w-full space-y-6 bg-carbon-950/80 border border-slateBlue-800 rounded-3xl p-8 shadow-panel relative overflow-hidden">
        
        {/* Subtle background glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-industrial-cyan/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Spinning / Pulsing Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-industrial-cyan/20 to-slateBlue-900 border border-industrial-cyan/50 flex items-center justify-center text-industrial-cyan shadow-glow-safe relative">
            {React.createElement(stages[currentStageIdx].icon, { className: 'w-8 h-8 animate-pulse' })}
            <div className="absolute -inset-1 rounded-2xl border border-industrial-cyan/30 animate-ping opacity-30" />
          </div>
        </div>

        {/* Stage Label & Description */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-semibold tracking-wider text-cyan-400">
            STAGE {currentStageIdx + 1} OF {stages.length} • ENTERPRISE INITIALIZATION
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-100 uppercase min-h-[1.75rem] flex items-center justify-center">
            {stages[currentStageIdx].label}
          </h3>
          <p className="text-xs text-slateBlue-300 font-sans min-h-[2.5rem]">
            {stages[currentStageIdx].desc}
          </p>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="space-y-2 pt-2">
          <div className="w-full bg-carbon-900 h-2.5 rounded-full overflow-hidden border border-slateBlue-800">
            <div
              className="bg-gradient-to-r from-industrial-cyan to-cyan-400 h-full rounded-full transition-all duration-300 shadow-glow-safe"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-bold text-slateBlue-400">
            <span>SentinelAI Telemetry Gateway</span>
            <span className="text-industrial-cyan font-black">{progressPct}%</span>
          </div>
        </div>

        {/* Stages Checklist */}
        <div className="border-t border-slateBlue-800/80 pt-4 space-y-1.5 text-left max-h-44 overflow-y-auto pr-1">
          {stages.map((stg, idx) => {
            const isDone = idx < currentStageIdx;
            const isCurrent = idx === currentStageIdx;
            return (
              <div key={idx} className={`flex items-center gap-2 text-xs py-1 px-2 rounded-lg transition-all ${
                isCurrent ? 'bg-industrial-cyan/15 text-industrial-cyan font-bold border border-industrial-cyan/30' : isDone ? 'text-industrial-safe font-medium opacity-80' : 'text-slateBlue-500 opacity-50'
              }`}>
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-industrial-safe shrink-0" />
                ) : (
                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] border ${
                    isCurrent ? 'border-industrial-cyan text-industrial-cyan font-black animate-pulse' : 'border-slateBlue-600 text-slateBlue-500'
                  }`}>
                    {idx + 1}
                  </span>
                )}
                <span className="truncate">{stg.label}</span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
});

EnterpriseLoadingScreen.displayName = 'EnterpriseLoadingScreen';
