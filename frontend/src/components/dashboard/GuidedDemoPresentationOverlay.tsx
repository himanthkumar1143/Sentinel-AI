import React from 'react';
import { Sparkles, Square, LayoutDashboard, Sliders, Layers, Factory, FileCheck, BrainCircuit } from 'lucide-react';

interface GuidedDemoPresentationOverlayProps {
  step: number;
  onStopDemo: () => void;
}

export const GuidedDemoPresentationOverlay: React.FC<GuidedDemoPresentationOverlayProps> = React.memo(({
  step,
  onStopDemo
}) => {
  if (step === 0) return null;

  const getStepData = (s: number) => {
    switch (s) {
      case 1:
        return {
          stepNum: 'STEP 1',
          title: 'Control Room Dashboard',
          status: 'Synchronizing SCADA Telemetry & Executive Status Card...',
          progressBars: '■■■■■■■■ 100%',
          icon: LayoutDashboard,
          color: 'border-industrial-cyan text-industrial-cyan bg-industrial-cyan/15'
        };
      case 2:
        return {
          stepNum: 'STEP 2',
          title: 'Scenario Builder',
          status: 'Loading Preset 3 (Gas Leak + Unventilated Hot Work Interlock)...',
          progressBars: '■■■■■■□□ 75%',
          icon: Sliders,
          color: 'border-amber-400 text-amber-400 bg-amber-400/15'
        };
      case 3:
        return {
          stepNum: 'STEP 3',
          title: 'Pipeline Inspector',
          status: 'Collecting Industrial Telemetry & Executing 4-Stage Pipeline...',
          progressBars: '■■■■■■■□ 88%',
          icon: Layers,
          color: 'border-blue-400 text-blue-400 bg-blue-400/15'
        };
      case 4:
        return {
          stepNum: 'STEP 4',
          title: 'Operations Timeline',
          status: 'Displaying industrial event sequence & alarms in Sector Alpha...',
          progressBars: '■■■■■■■■ 100%',
          icon: Factory,
          color: 'border-purple-400 text-purple-400 bg-purple-400/15'
        };
      case 5:
        return {
          stepNum: 'STEP 5',
          title: 'Operational Context Engine',
          status: 'Evaluating 52 Deterministic Safety Rules (Single Source of Truth)...',
          progressBars: '■■■■■■■■ 100%',
          icon: FileCheck,
          color: 'border-emerald-400 text-emerald-400 bg-emerald-400/15'
        };
      case 6:
        return {
          stepNum: 'STEP 6',
          title: 'AI Safety Intelligence',
          status: 'Synthesizing Explainable AI Root Cause Report (Confidence: 98.4%)...',
          progressBars: '■■■■■■■■ 100%',
          icon: BrainCircuit,
          color: 'border-rose-400 text-rose-400 bg-rose-400/15'
        };
      default:
        return {
          stepNum: `STEP ${s}`,
          title: 'Guided Demonstration Active',
          status: 'Processing industrial simulation state...',
          progressBars: '■■■■■■□□ 80%',
          icon: Sparkles,
          color: 'border-industrial-cyan text-industrial-cyan bg-industrial-cyan/15'
        };
    }
  };

  const info = getStepData(step);
  const Icon = info.icon;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm sm:max-w-md w-[calc(100%-3rem)] bg-carbon-950/95 border-2 border-industrial-cyan rounded-2xl p-4 shadow-[0_0_40px_rgba(6,182,212,0.35)] backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300 font-mono select-none">
      <div className="flex items-start justify-between gap-3 border-b border-slateBlue-800/80 pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 shadow-glow-safe ${info.color}`}>
            <Icon className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-industrial-cyan/20 text-industrial-cyan font-black text-[10px] tracking-widest uppercase border border-industrial-cyan/40">
                NOW DEMONSTRATING
              </span>
              <span className="text-[11px] font-extrabold text-slate-100 uppercase tracking-tight">
                {info.stepNum}
              </span>
            </div>
            <h4 className="text-sm font-black text-slate-100 uppercase tracking-tight mt-0.5">
              {info.title}
            </h4>
          </div>
        </div>
        <button
          onClick={onStopDemo}
          className="px-2.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/70 text-rose-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all shrink-0"
          title="Pause / Exit Demo Mode"
        >
          <Square className="w-3 h-3 fill-current" />
          <span>Exit</span>
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slateBlue-300 font-sans font-medium">{info.status}</span>
        </div>
        <div className="bg-carbon-900 border border-slateBlue-800 rounded-lg p-2 flex items-center justify-between text-xs text-industrial-cyan font-bold tracking-widest">
          <span>{info.progressBars}</span>
          <span className="text-[10px] text-slate-100 font-mono uppercase bg-carbon-950 px-2 py-0.5 rounded border border-slateBlue-800">
            Automated Flow
          </span>
        </div>
      </div>
    </div>
  );
});

GuidedDemoPresentationOverlay.displayName = 'GuidedDemoPresentationOverlay';
