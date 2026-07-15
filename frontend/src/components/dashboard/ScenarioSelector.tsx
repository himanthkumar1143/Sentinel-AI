import React from 'react';
import type { ScenarioType, ScenarioInfo } from '../../types/industrial';
import { ShieldCheck, AlertTriangle, Flame, SlidersHorizontal } from 'lucide-react';

interface ScenarioSelectorProps {
  currentScenario: ScenarioType;
  scenarioInfo: ScenarioInfo;
  onSelectScenario: (scenario: ScenarioType) => void;
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  currentScenario,
  scenarioInfo,
  onSelectScenario,
}) => {
  const scenarios: { id: ScenarioType; label: string; icon: React.ElementType; color: string; activeStyle: string }[] = [
    {
      id: 'normal',
      label: 'Normal Operation',
      icon: ShieldCheck,
      color: 'text-industrial-safe',
      activeStyle: 'bg-industrial-safe/20 border-industrial-safe/60 text-industrial-safe shadow-glow-safe font-bold'
    },
    {
      id: 'warning',
      label: 'Warning State',
      icon: AlertTriangle,
      color: 'text-industrial-warning',
      activeStyle: 'bg-industrial-warning/20 border-industrial-warning/60 text-industrial-warning shadow-glow-warning font-bold'
    },
    {
      id: 'critical',
      label: 'Critical Compound Risk',
      icon: Flame,
      color: 'text-industrial-critical',
      activeStyle: 'bg-industrial-critical/25 border-industrial-critical/80 text-industrial-critical shadow-glow-critical font-bold animate-pulse'
    }
  ];

  const getConciseStatusMessage = (scenarioId: ScenarioType): string => {
    switch (scenarioId) {
      case 'normal':
        return 'All systems operating within nominal conditions.';
      case 'warning':
        return 'Elevated gas concentration and pressure detected in Compressor Hall.';
      case 'critical':
        return 'Compound risk threshold exceeded across Tank Farm & Reactor Core.';
      default:
        return scenarioInfo.description;
    }
  };

  return (
    <div className="rounded-lg border border-slateBlue-800 bg-carbon-800/95 p-5 shadow-panel">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title & Concise Description */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-slateBlue-400">
            <SlidersHorizontal className="w-4 h-4 text-industrial-cyan" />
            <span className="font-semibold text-slate-300">Simulation Status</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 pt-0.5">
            <span className="text-base font-mono font-bold text-slate-100 uppercase tracking-tight">
              {scenarioInfo.name}
            </span>
            <span className="text-slateBlue-600 hidden sm:inline font-mono">|</span>
            <p className="text-xs sm:text-sm text-slate-300 font-sans font-normal leading-relaxed">
              "{getConciseStatusMessage(currentScenario)}"
            </p>
          </div>
        </div>

        {/* 3 Scenario Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
          {scenarios.map((scen) => {
            const Icon = scen.icon;
            const isSelected = currentScenario === scen.id;

            return (
              <button
                key={scen.id}
                onClick={() => onSelectScenario(scen.id)}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-md border text-xs font-mono uppercase tracking-wide transition-all duration-200 ${
                  isSelected
                    ? scen.activeStyle
                    : 'border-slateBlue-800 bg-carbon-900/80 text-slateBlue-400 hover:border-slateBlue-700 hover:text-slate-200 hover:bg-slateBlue-900/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? '' : scen.color}`} />
                <span>{scen.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Simulation Banner Note */}
      <div className="mt-4 pt-3 border-t border-slateBlue-800/60 flex items-center justify-between text-[11px] font-mono text-slateBlue-400">
        <div className="flex items-center gap-2 truncate pr-4">
          <span className="w-1.5 h-1.5 rounded-full bg-industrial-cyan animate-ping shrink-0" />
          <span className="truncate text-slateBlue-300"><span className="text-slateBlue-500 font-semibold">Simulation notes:</span> {scenarioInfo.simulationNotes}</span>
        </div>
        <span className="text-industrial-cyan/90 font-semibold hidden sm:inline shrink-0">Simulation Active</span>
      </div>
    </div>
  );
};

