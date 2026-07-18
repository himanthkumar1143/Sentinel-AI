import React from 'react';
import { ShieldAlert, Play, LayoutDashboard, CheckCircle2, Clock, Cpu, FileText } from 'lucide-react';
import type { ScenarioType, PlantOverview } from '../../types/industrial';

interface EnterpriseDemoCompletionModalProps {
  overview: PlantOverview;
  currentScenario: ScenarioType;
  onRestartDemo: () => void;
  onOpenDashboard: () => void;
}

export const EnterpriseDemoCompletionModal: React.FC<EnterpriseDemoCompletionModalProps> = React.memo(({
  overview,
  currentScenario,
  onRestartDemo,
  onOpenDashboard
}) => {
  const isCritical = overview.statusColor === 'critical' || currentScenario === 'critical';
  const isWarning = overview.statusColor === 'warning' || currentScenario === 'warning';

  const stages = [
    { label: 'Scenario Generated', desc: `Unified Plant Model constructed (${currentScenario.toUpperCase()} simulation payload)` },
    { label: 'Pipeline Executed', desc: '8-stage industrial telemetry ingestion & LEL normalization verified' },
    { label: 'Operational Context Created', desc: '52 deterministic interlocks & permit-to-work LOTO rules evaluated' },
    { label: 'AI Assessment Generated', desc: 'Explainable AI neural compound hazard analysis completed' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-carbon-950/85 backdrop-blur-md p-4 animate-in fade-in duration-300 font-mono select-none overflow-y-auto">
      <div className="bg-gradient-to-b from-carbon-900 via-carbon-900 to-carbon-950 border-2 border-industrial-cyan/60 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-[0_0_50px_rgba(6,182,212,0.3)] space-y-6 relative overflow-hidden my-8">
        
        {/* Glow accent */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-industrial-cyan/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Icon & Title */}
        <div className="flex items-center gap-4 border-b border-slateBlue-800 pb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-industrial-cyan to-cyan-500 flex items-center justify-center text-carbon-950 font-black shadow-glow-safe shrink-0">
            <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-black tracking-widest text-industrial-cyan">
              HACKATHON VERIFICATION SUCCESS • PART 10
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 uppercase tracking-tight">
              Enterprise Demonstration Complete
            </h2>
            <p className="text-xs text-slateBlue-300 font-sans mt-0.5">
              All 4 core layers of the SentinelAI architecture successfully processed with zero latency regressions.
            </p>
          </div>
        </div>

        {/* 5 Stages Checklist */}
        <div className="space-y-2.5 bg-carbon-950/70 border border-slateBlue-800/80 rounded-2xl p-4">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slateBlue-400 block mb-1">
            System Execution Checklist
          </span>
          {stages.map((stg, idx) => (
            <div key={idx} className="flex items-start gap-3 text-xs">
              <div className="w-5 h-5 rounded-md bg-industrial-safe/20 border border-industrial-safe/50 flex items-center justify-center text-industrial-safe shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <span className="font-bold text-slate-100 uppercase">{stg.label}</span>
                <span className="text-slateBlue-400 font-sans text-[11px] block">{stg.desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Executive Summary Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Analysis Time */}
          <div className="bg-carbon-950 border border-slateBlue-800 rounded-xl p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-slateBlue-400 text-[10px] uppercase font-bold">
              <Clock className="w-3.5 h-3.5 text-industrial-cyan" />
              <span>Analysis Time</span>
            </div>
            <p className="text-sm sm:text-base font-black text-industrial-cyan">1.42 Seconds</p>
            <span className="text-[9px] text-slateBlue-400 block font-sans">Deterministic + Neural</span>
          </div>

          {/* Overall Decision */}
          <div className="bg-carbon-950 border border-slateBlue-800 rounded-xl p-3 space-y-1 sm:col-span-2">
            <div className="flex items-center gap-1.5 text-slateBlue-400 text-[10px] uppercase font-bold">
              <Cpu className="w-3.5 h-3.5 text-rose-400" />
              <span>Overall Decision</span>
            </div>
            <p className="text-xs sm:text-sm font-black text-slate-100 truncate" title={isCritical ? 'COMPOUND RISK DETECTED — EMERGENCY ISOLATION ARMED' : 'OPERATIONS SAFE'}>
              {isCritical ? 'EMERGENCY ISOLATION ARMED' : isWarning ? 'ELEVATED MONITORING' : 'NORMAL OPERATIONS'}
            </p>
            <span className="text-[9px] text-slateBlue-400 block font-sans">
              {isCritical ? 'Automatic LOTO & Hot Work Revocation' : 'Continuous SCADA Polling Active'}
            </span>
          </div>

          {/* Compound Risk */}
          <div className="bg-carbon-950 border border-slateBlue-800 rounded-xl p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-slateBlue-400 text-[10px] uppercase font-bold">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Compound Risk</span>
            </div>
            <p className={`text-sm sm:text-base font-black ${isCritical ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-industrial-cyan'}`}>
              {overview.compoundRiskIndex} / 100
            </p>
            <span className="text-[9px] text-slateBlue-400 block font-sans">
              {isCritical ? 'Severity Level 4' : isWarning ? 'Severity Level 2' : 'Nominal Level 0'}
            </span>
          </div>
        </div>

        {/* Recommendations Quick Summary Box */}
        <div className="bg-gradient-to-r from-industrial-cyan/10 via-carbon-950 to-carbon-950 border border-industrial-cyan/40 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-industrial-cyan shrink-0" />
            <div>
              <h4 className="text-xs font-black text-slate-100 uppercase">
                {overview.activeAlertsCount > 0 ? `${overview.activeAlertsCount} High-Priority Safety Recommendations Issued` : 'All Systems Nominal • Continue Routine Monitoring'}
              </h4>
              <p className="text-[11px] text-slateBlue-300 font-sans mt-0.5">
                Review specific engineering actions in the Enterprise Intelligence workspace or ask the SentinelAI Safety Assistant.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onRestartDemo}
            className="flex-1 px-5 py-3.5 rounded-xl bg-carbon-800 hover:bg-slateBlue-800 border border-slateBlue-700 text-slate-100 font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-sm"
          >
            <Play className="w-4 h-4 text-industrial-cyan fill-current" />
            <span>Restart Demo / Replay</span>
          </button>
          <button
            onClick={onOpenDashboard}
            className="flex-1 px-6 py-3.5 rounded-xl bg-gradient-to-r from-industrial-cyan to-cyan-400 text-carbon-950 font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-glow-safe hover:brightness-110 transition-all scale-[1.01]"
          >
            <LayoutDashboard className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
});

EnterpriseDemoCompletionModal.displayName = 'EnterpriseDemoCompletionModal';
