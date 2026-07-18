import React from 'react';
import type { WorkspaceType } from './TopBar';
import { LayoutDashboard, Sliders, Layers, Factory, BrainCircuit, ChevronRight, Play, Square, RotateCcw, FileCheck } from 'lucide-react';

interface WorkflowHeaderBarProps {
  activeWorkspace: WorkspaceType;
  onSelectWorkspace?: (ws: WorkspaceType) => void;
  onStartGuidedDemo?: () => void;
  guidedDemoStep?: number;
  onStopGuidedDemo?: () => void;
  onReplayIncident?: () => void;
}

export const WorkflowHeaderBar: React.FC<WorkflowHeaderBarProps> = ({
  activeWorkspace,
  onSelectWorkspace,
  onStartGuidedDemo,
  guidedDemoStep = 0,
  onStopGuidedDemo,
  onReplayIncident
}) => {
  // Exact Industrial Investigation Workflow (7 Steps)
  const steps = [
    { id: 'overview', stepNum: 'Overview', title: 'Control Room Dashboard', desc: 'Monitor live plant operations.', icon: LayoutDashboard },
    { id: 'scenario-builder', stepNum: 'Simulation', title: 'Scenario Builder', desc: 'Create custom industrial incidents.', icon: Sliders },
    { id: 'pipeline', stepNum: 'Processing', title: 'Pipeline Inspector', desc: 'Transform telemetry into operational context.', icon: Layers },
    { id: 'operations', stepNum: 'Operations', title: 'Operations Timeline', desc: 'Review operational events.', icon: Factory },
    { id: 'operational-context', stepNum: 'Context', title: 'Operational Context', desc: 'Single source of truth deterministic rules.', icon: FileCheck },
    { id: 'intelligence', stepNum: 'Intelligence', title: 'AI Safety Intelligence', desc: 'Enterprise Explainable AI Risk Analysis.', icon: BrainCircuit }
  ];

  const currentStepInfo = steps.find(s => s.id === activeWorkspace) || steps[0];

  return (
    <div className="space-y-4 mb-2 select-none">
      {/* Enterprise Workflow Progress Bar with ✓ Completed, ▶ Current, ○ Upcoming */}
      <div className="bg-carbon-900 border border-slateBlue-800 rounded-2xl p-3 sm:p-4 shadow-panel flex items-center justify-between gap-2 overflow-x-auto">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = activeWorkspace === step.id;
          const isPassed = steps.findIndex(s => s.id === activeWorkspace) > idx;
          const statusPrefix = isActive ? '▶ Current' : isPassed ? '✓ Completed' : '○ Upcoming';

          return (
            <React.Fragment key={step.id}>
              <button
                onClick={() => onSelectWorkspace?.(step.id as WorkspaceType)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all duration-300 ease-out font-mono text-xs shrink-0 ${isActive
                    ? 'bg-cyan-950 border border-cyan-400 text-white font-bold shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:scale-[1.01]'
                    : isPassed
                      ? 'bg-carbon-950/70 border border-industrial-safe/40 text-industrial-safe hover:bg-slateBlue-900/60 font-semibold hover:scale-[1.01]'
                      : 'bg-carbon-950/40 border border-slateBlue-800 text-slateBlue-400 hover:text-slate-200 hover:bg-slateBlue-900/40 hover:scale-[1.01]'
                  }`}
              >
                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${isActive ? 'bg-cyan-900/60 text-cyan-200' : isPassed ? 'bg-industrial-safe/20 text-industrial-safe' : 'bg-slateBlue-900 text-slateBlue-400'
                  }`}>
                  {statusPrefix} • {step.stepNum}
                </span>
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-cyan-400' : ''}`} />
                <span className="hidden sm:inline font-bold">{step.title}</span>
              </button>

              {idx < steps.length - 1 && (
                <div className="text-slateBlue-600 hidden md:flex items-center shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Workspace Header & Guided Demo Button */}
      <div className="bg-gradient-to-r from-carbon-900 via-carbon-850 to-carbon-900 border border-slateBlue-800/90 rounded-2xl px-5 py-4 shadow-inner flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-industrial-cyan/15 border border-industrial-cyan/40 flex items-center justify-center text-industrial-cyan shrink-0">
            {React.createElement(currentStepInfo.icon, { className: 'w-5 h-5' })}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-industrial-cyan">
                {currentStepInfo.stepNum}
              </span>
              <h3 className="text-base sm:text-lg font-mono font-extrabold text-slate-100 uppercase tracking-tight">
                {currentStepInfo.title}
              </h3>
            </div>
            <p className="text-xs sm:text-sm font-sans text-slateBlue-300 tracking-wide font-medium">
              {currentStepInfo.desc}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Incident Replay / Re-simulate Button */}
          {onReplayIncident && (
            <button
              onClick={onReplayIncident}
              className="px-3.5 py-2 rounded-xl bg-carbon-950 hover:bg-slateBlue-800 border border-slateBlue-700 text-slateBlue-200 hover:text-industrial-cyan font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm"
              title="Replay simulation flow without calling backend or modifying state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Replay Incident</span>
            </button>
          )}

          {guidedDemoStep > 0 ? (
            <button
              onClick={onStopGuidedDemo}
              className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/60 text-rose-300 font-mono text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-glow-critical/20"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Exit Demo Mode</span>
            </button>
          ) : (
            <button
              onClick={onStartGuidedDemo}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-industrial-cyan to-cyan-500 text-carbon-950 font-mono text-xs font-black uppercase tracking-wider flex items-center gap-2.5 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Guided Demo</span>
            </button>
          )}

          <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slateBlue-400 border border-slateBlue-800 bg-carbon-950 px-3 py-2 rounded-xl">
            <span className={`w-2 h-2 rounded-full ${guidedDemoStep > 0 ? 'bg-amber-400 shadow-glow-warning' : 'bg-industrial-safe'} animate-pulse`} />
            <span>{guidedDemoStep > 0 ? `Demo Step ${guidedDemoStep}/7` : 'Workflow Active'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
