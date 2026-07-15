import React, { useState } from 'react';
import type { IndustrialScenarioPayload, ScenarioType } from '../../types/industrial';
import type { WorkspaceType } from '../layout/TopBar';
import { ScenarioSelector } from './ScenarioSelector';
import { OverviewCards } from './cards/OverviewCards';
import { LiveSensorMonitoring } from './sensors/LiveSensorMonitoring';
import { GeospatialRiskMap } from './maps/GeospatialRiskMap';
import { CompoundRiskTrendChart } from './charts/CompoundRiskTrendChart';
import { OperationalStatusPanel } from './panels/OperationalStatusPanel';
import { IndustrialEventTimeline } from './timeline/IndustrialEventTimeline';
import { OperationalContextIntelligencePanel } from './panels/OperationalContextIntelligencePanel';
import { CompoundRiskIntelligencePanel } from './panels/CompoundRiskIntelligencePanel';
import { RecommendationsPanel } from './panels/RecommendationsPanel';
import { InteractivePipelineInspector } from './pipeline/InteractivePipelineInspector';

interface DashboardViewProps {
  data: IndustrialScenarioPayload;
  currentScenario: ScenarioType;
  onSelectScenario: (scenario: ScenarioType) => void;
  loading: boolean;
  activeWorkspace?: WorkspaceType;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  data,
  currentScenario,
  onSelectScenario,
  loading,
  activeWorkspace = 'overview'
}) => {
  // PART 1 & PART 5: Dashboard Update Synchronization & Subtle Glow Highlight
  const [isRecentlySynced, setIsRecentlySynced] = useState<boolean>(false);

  const handleSimulationComplete = () => {
    setIsRecentlySynced(true);
    setTimeout(() => {
      setIsRecentlySynced(false);
    }, 3800);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4 min-h-[600px] bg-carbon-900">
        <div className="w-12 h-12 rounded-full border-4 border-industrial-cyan border-t-transparent animate-spin shadow-glow-safe" />
        <p className="text-sm font-mono tracking-widest text-slateBlue-300 uppercase animate-pulse">
          Synchronizing with Telemetry Gateway &amp; SCADA Nodes...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-4rem)] bg-carbon-900 selection:bg-industrial-cyan selection:text-carbon-900">
      {/* Universal Scenario Selector bar accessible across every workspace */}
      <section className="space-y-6">
        <ScenarioSelector
          currentScenario={currentScenario}
          scenarioInfo={data.scenario}
          onSelectScenario={onSelectScenario}
        />
      </section>

      {/* PART 11: Workspace Transition Polish with slide & fade */}
      {/* Workspace 1 — Overview */}
      {activeWorkspace === 'overview' && (
        <div className="space-y-8 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
          <div className={`transition-all duration-700 ${isRecentlySynced ? 'p-1.5 rounded-2xl border border-industrial-cyan/60 shadow-[0_0_25px_rgba(6,182,212,0.28)] bg-industrial-cyan/[0.02]' : ''}`}>
            <OverviewCards overview={data.overview} />
          </div>
          <div className="space-y-8 pt-2">
            <div className={`transition-all duration-700 ${isRecentlySynced ? 'p-1.5 rounded-2xl border border-industrial-cyan/60 shadow-[0_0_25px_rgba(6,182,212,0.28)] bg-industrial-cyan/[0.02]' : ''}`}>
              <GeospatialRiskMap zones={data.zones} />
            </div>
            <div className={`transition-all duration-700 ${isRecentlySynced ? 'p-1.5 rounded-2xl border border-industrial-cyan/60 shadow-[0_0_25px_rgba(6,182,212,0.28)] bg-industrial-cyan/[0.02]' : ''}`}>
              <LiveSensorMonitoring sensors={data.sensors} />
            </div>
            <div className={`transition-all duration-700 ${isRecentlySynced ? 'p-1.5 rounded-2xl border border-industrial-cyan/60 shadow-[0_0_25px_rgba(6,182,212,0.28)] bg-industrial-cyan/[0.02]' : ''}`}>
              <CompoundRiskTrendChart data={data.riskTrend} />
            </div>
          </div>
        </div>
      )}

      {/* Workspace 2 — Operations */}
      {activeWorkspace === 'operations' && (
        <div className="space-y-8 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`transition-all duration-700 ${isRecentlySynced ? 'p-1.5 rounded-2xl border border-industrial-cyan/60 shadow-[0_0_25px_rgba(6,182,212,0.28)] bg-industrial-cyan/[0.02]' : ''}`}>
              <OperationalStatusPanel status={data.operationalStatus} />
            </div>
            <div className={`transition-all duration-700 ${isRecentlySynced ? 'p-1.5 rounded-2xl border border-industrial-cyan/60 shadow-[0_0_25px_rgba(6,182,212,0.28)] bg-industrial-cyan/[0.02]' : ''}`}>
              <IndustrialEventTimeline timeline={data.timeline} />
            </div>
          </div>
          <div className={`transition-all duration-700 ${isRecentlySynced ? 'p-1.5 rounded-2xl border border-industrial-cyan/60 shadow-[0_0_25px_rgba(6,182,212,0.28)] bg-industrial-cyan/[0.02]' : ''}`}>
            <RecommendationsPanel recommendations={data.recommendations} />
          </div>
        </div>
      )}

      {/* Workspace 3 — Intelligence */}
      {activeWorkspace === 'intelligence' && (
        <div className="space-y-8 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`transition-all duration-700 ${isRecentlySynced ? 'p-1.5 rounded-2xl border border-industrial-cyan/60 shadow-[0_0_25px_rgba(6,182,212,0.28)] bg-industrial-cyan/[0.02]' : ''}`}>
              <OperationalContextIntelligencePanel />
            </div>
            <div className={`transition-all duration-700 ${isRecentlySynced ? 'p-1.5 rounded-2xl border border-industrial-cyan/60 shadow-[0_0_25px_rgba(6,182,212,0.28)] bg-industrial-cyan/[0.02]' : ''}`}>
              <CompoundRiskIntelligencePanel />
            </div>
          </div>
        </div>
      )}

      {/* Workspace 4 — Pipeline Inspector (Engineering Workspace) */}
      {activeWorkspace === 'pipeline' && (
        <div className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
          <InteractivePipelineInspector
            scenario={currentScenario}
            onSimulationComplete={handleSimulationComplete}
          />
        </div>
      )}
    </div>
  );
};

export default DashboardView;
