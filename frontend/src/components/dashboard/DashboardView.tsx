import React from 'react';
import type { IndustrialScenarioPayload, ScenarioType } from '../../types/industrial';
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

interface DashboardViewProps {
  data: IndustrialScenarioPayload;
  currentScenario: ScenarioType;
  onSelectScenario: (scenario: ScenarioType) => void;
  loading: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  data,
  currentScenario,
  onSelectScenario,
  loading
}) => {
  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4 min-h-[600px]">
        <div className="w-12 h-12 rounded-full border-4 border-industrial-cyan border-t-transparent animate-spin" />
        <p className="text-sm font-mono tracking-widest text-slateBlue-300 uppercase animate-pulse">
          Synchronizing with Telemetry Gateway &amp; SCADA Nodes...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 sm:p-8 space-y-8 sm:space-y-10 overflow-y-auto max-h-[calc(100vh-4rem)] bg-carbon-900">
      {/* Highest Priority Layer: Scenario Selector & Plant Overview */}
      <section className="space-y-6">
        <ScenarioSelector
          currentScenario={currentScenario}
          scenarioInfo={data.scenario}
          onSelectScenario={onSelectScenario}
        />
        <OverviewCards overview={data.overview} />
      </section>

      {/* Second Priority Layer: Geospatial Risk Map, Live Sensors & Trend */}
      <section className="space-y-6 pt-2">
        <GeospatialRiskMap zones={data.zones} />
        <LiveSensorMonitoring sensors={data.sensors} />
        <CompoundRiskTrendChart data={data.riskTrend} />
      </section>

      {/* Third Priority Layer: Operations, Timeline & Recommendations */}
      <section className="space-y-6 pt-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <OperationalStatusPanel status={data.operationalStatus} />
          <IndustrialEventTimeline timeline={data.timeline} />
        </div>
        <RecommendationsPanel recommendations={data.recommendations} />
      </section>

      {/* Lowest Priority Layer: Phase 3 & 4 Enterprise Placeholders */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 opacity-80 hover:opacity-100 transition-opacity">
        <OperationalContextIntelligencePanel />
        <CompoundRiskIntelligencePanel />
      </section>
    </div>
  );
};

