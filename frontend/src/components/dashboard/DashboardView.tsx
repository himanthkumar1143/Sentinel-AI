import React, { useState, useEffect } from 'react';
import type { IndustrialScenarioPayload, ScenarioType } from '../../types/industrial';
import type { WorkspaceType } from '../layout/TopBar';
import { ScenarioSelector } from './ScenarioSelector';
import { OverviewCards } from './cards/OverviewCards';
import { LiveSensorMonitoring } from './sensors/LiveSensorMonitoring';
import { GeospatialRiskMap } from './maps/GeospatialRiskMap';
import { CompoundRiskTrendChart } from './charts/CompoundRiskTrendChart';
import { OperationalStatusPanel } from './panels/OperationalStatusPanel';
const IndustrialEventTimeline = React.lazy(() => import('./timeline/IndustrialEventTimeline').then(module => ({ default: module.IndustrialEventTimeline })));
const OperationalContextIntelligencePanel = React.lazy(() => import('./panels/OperationalContextIntelligencePanel').then(module => ({ default: module.OperationalContextIntelligencePanel })));
const CompoundRiskIntelligencePanel = React.lazy(() => import('./panels/CompoundRiskIntelligencePanel').then(module => ({ default: module.CompoundRiskIntelligencePanel })));
import { RecommendationsPanel } from './panels/RecommendationsPanel';
const InteractivePipelineInspector = React.lazy(() => import('./pipeline/InteractivePipelineInspector').then(module => ({ default: module.InteractivePipelineInspector })));
const InteractiveScenarioBuilder = React.lazy(() => import('./scenario/InteractiveScenarioBuilder').then(module => ({ default: module.InteractiveScenarioBuilder })));
import { WorkflowHeaderBar } from '../layout/WorkflowHeaderBar';
import { WorkspaceSkeleton } from './WorkspaceSkeleton';
import { Play, Square, Sparkles } from 'lucide-react';
import { ExecutiveStatusSummary } from './cards/ExecutiveStatusSummary';
import { PlantHealthSummaryCard } from './cards/PlantHealthSummaryCard';
import { EnterpriseLoadingScreen } from './EnterpriseLoadingScreen';
import { EnterpriseDemoCompletionModal } from './EnterpriseDemoCompletionModal';
import { GuidedDemoPresentationOverlay } from './GuidedDemoPresentationOverlay';

interface DashboardViewProps {
  data: IndustrialScenarioPayload;
  currentScenario: ScenarioType;
  onSelectScenario: (scenario: ScenarioType) => void;
  onApplyCustomScenario?: (payload: IndustrialScenarioPayload) => void;
  onSelectWorkspace?: (ws: WorkspaceType) => void;
  loading: boolean;
  activeWorkspace?: WorkspaceType;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  data,
  currentScenario,
  onSelectScenario,
  onApplyCustomScenario,
  onSelectWorkspace,
  loading,
  activeWorkspace = 'overview'
}) => {
  // PART 1 & PART 5: Dashboard Update Synchronization & Subtle Glow Highlight
  const [isRecentlySynced, setIsRecentlySynced] = useState<boolean>(false);
  const [autoRunPipeline, setAutoRunPipeline] = useState<boolean>(false);

  // PART 17 & PART 10: Guided Hackathon Demo State & Sequence Timer & Completion Screen
  const [guidedDemoStep, setGuidedDemoStep] = useState<number>(0);
  const [autoLoadPreset, setAutoLoadPreset] = useState<string | undefined>(undefined);
  const [showDemoCompletion, setShowDemoCompletion] = useState<boolean>(false);
  const [isReplaying, setIsReplaying] = useState<boolean>(false);

  useEffect(() => {
    if (guidedDemoStep === 0) {
      setAutoLoadPreset(undefined);
      return;
    }

    let timer: any;
    if (guidedDemoStep === 1) {
      if (onSelectWorkspace) onSelectWorkspace('overview');
      timer = setTimeout(() => {
        setGuidedDemoStep(2);
      }, 4000);
    } else if (guidedDemoStep === 2) {
      if (onSelectWorkspace) onSelectWorkspace('scenario-builder');
      setAutoLoadPreset('critical-explosion');
      timer = setTimeout(() => {
        setGuidedDemoStep(3);
      }, 4500);
    } else if (guidedDemoStep === 3) {
      if (onSelectWorkspace) onSelectWorkspace('pipeline');
      setAutoRunPipeline(true);
    } else if (guidedDemoStep === 4) {
      if (onSelectWorkspace) onSelectWorkspace('operations');
      timer = setTimeout(() => {
        setGuidedDemoStep(5);
      }, 5000);
    } else if (guidedDemoStep === 5) {
      if (onSelectWorkspace) onSelectWorkspace('operational-context');
      timer = setTimeout(() => {
        setGuidedDemoStep(6);
      }, 5000);
    } else if (guidedDemoStep === 6) {
      if (onSelectWorkspace) onSelectWorkspace('intelligence');
      timer = setTimeout(() => {
        setGuidedDemoStep(0);
        setShowDemoCompletion(true);
      }, 7500);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [guidedDemoStep, onSelectWorkspace]);

  // PART 4: Guided Demo Auto Scroll
  useEffect(() => {
    if (guidedDemoStep > 0 || activeWorkspace) {
      const scrollTimer = setTimeout(() => {
        let targetId = 'overview-content';
        if (guidedDemoStep === 1 || activeWorkspace === 'overview') targetId = 'overview-content';
        if (guidedDemoStep === 2 || activeWorkspace === 'scenario-builder') targetId = 'scenario-controls';
        if (guidedDemoStep === 3 || activeWorkspace === 'pipeline') targetId = 'pipeline-execution';
        if (guidedDemoStep === 4 || activeWorkspace === 'operations') targetId = 'operations-timeline';
        if (guidedDemoStep === 5 || activeWorkspace === 'operational-context') targetId = 'generated-observations';
        if (guidedDemoStep === 6 || activeWorkspace === 'intelligence') targetId = 'risk-analysis';

        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 250);
      return () => clearTimeout(scrollTimer);
    }
  }, [guidedDemoStep, activeWorkspace]);

  const handleStartGuidedDemo = () => {
    setShowDemoCompletion(false);
    setGuidedDemoStep(1);
  };

  const handleStopGuidedDemo = () => {
    setGuidedDemoStep(0);
    setAutoRunPipeline(false);
    setAutoLoadPreset(undefined);
  };

  const handleReplayIncident = () => {
    setIsReplaying(true);
    setTimeout(() => {
      setIsReplaying(false);
      setShowDemoCompletion(true);
    }, 2400);
  };

  const getDemoStepDescription = (step: number) => {
    switch (step) {
      case 1: return 'Inspecting Control Room Dashboard & Live Telemetry Widgets...';
      case 2: return 'Loading Preset 3 (Gas Leak + Hot Work) into Scenario Builder...';
      case 3: return 'Auto-running 4-Stage Plant Intelligence Pipeline...';
      case 4: return 'Reviewing Operations & Timeline Event Sequence...';
      case 5: return 'Verifying 52 Deterministic Rules inside Operational Context Engine...';
      case 6: return 'Reviewing Explainable AI Compound Risk Report...';
      case 7: return 'Interacting with SentinelAI Safety Assistant & Live UPM Telemetry...';
      default: return 'Enterprise Guided Demonstration Active';
    }
  };

  const handleSimulationComplete = () => {
    setIsRecentlySynced(true);
    setTimeout(() => {
      setIsRecentlySynced(false);
    }, 12000); // Keep sync notification visible for 12 seconds
  };

  // PART 7: Guided Demo Focus Mode helper
  const getFocusClass = (stepNum: number) => {
    if (guidedDemoStep === 0) return '';
    if (guidedDemoStep === stepNum) {
      return 'ring-2 ring-industrial-cyan shadow-[0_0_30px_rgba(6,182,212,0.25)] opacity-100 rounded-2xl p-2 transition-all duration-500';
    }
    return 'opacity-45 hover:opacity-100 transition-opacity duration-500';
  };

  // PART 3: Meaningful Enterprise Loading Screen
  if (loading || isReplaying) {
    return <EnterpriseLoadingScreen />;
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

        {/* PART 6 & PART 17: Guided Demonstration Visual Overlay Banner */}
        {guidedDemoStep > 0 && (
          <>
            <GuidedDemoPresentationOverlay
              step={guidedDemoStep}
              onStopDemo={handleStopGuidedDemo}
            />
            <div className="bg-gradient-to-r from-carbon-900 via-amber-950/40 to-carbon-900 border-2 border-amber-400 rounded-2xl p-4 sm:p-5 shadow-[0_0_35px_rgba(251,191,36,0.25)] flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top duration-300 font-mono">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400 flex items-center justify-center text-amber-400 shrink-0 shadow-glow-warning/40 animate-pulse">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/50 text-[10px] font-black uppercase tracking-wider">
                      DEMO ACTIVE • STEP {guidedDemoStep} OF 7
                    </span>
                    <span className="text-xs sm:text-sm font-black text-slate-100 uppercase tracking-tight">
                      {getDemoStepDescription(guidedDemoStep)}
                    </span>
                  </div>
                  <p className="text-xs text-slateBlue-300 font-sans mt-1">
                    Automating sequential demonstration across all 7 enterprise intelligence layers. Sit back or click Exit Demo to resume manual control.
                  </p>
                </div>
              </div>
              <button
                onClick={handleStopGuidedDemo}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500 text-rose-200 font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shrink-0 transition-all shadow-glow-critical/20"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Pause / Exit Demo</span>
              </button>
            </div>
          </>
        )}

        <WorkflowHeaderBar
          activeWorkspace={activeWorkspace}
          onSelectWorkspace={onSelectWorkspace}
          onStartGuidedDemo={handleStartGuidedDemo}
          guidedDemoStep={guidedDemoStep}
          onStopGuidedDemo={handleStopGuidedDemo}
          onReplayIncident={handleReplayIncident}
        />
      </section>

      {/* PART 10: Guided Hackathon Demonstration / Incident Replay Completion Screen */}
      {showDemoCompletion && (
        <EnterpriseDemoCompletionModal
          overview={data.overview}
          currentScenario={currentScenario}
          onRestartDemo={() => {
            setShowDemoCompletion(false);
            handleStartGuidedDemo();
          }}
          onOpenDashboard={() => {
            setShowDemoCompletion(false);
            if (onSelectWorkspace) onSelectWorkspace('overview');
          }}
        />
      )}

      {/* PART 11 & PART 13: Live Enterprise Toast / Top Notification Banner upon Pipeline Completion */}
      {isRecentlySynced && activeWorkspace === 'overview' && guidedDemoStep === 0 && (
        <div className="bg-gradient-to-r from-carbon-900 via-carbon-850 to-carbon-900 border-2 border-industrial-safe rounded-2xl p-5 sm:p-6 shadow-[0_0_35px_rgba(16,185,129,0.25)] flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top duration-500 font-mono">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-industrial-safe/20 border border-industrial-safe flex items-center justify-center text-industrial-safe shrink-0 shadow-glow-safe/30">
              <span className="text-lg font-black">✓</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-extrabold text-slate-100 uppercase tracking-wide">
                  Scenario Successfully Processed Through Integration Pipeline
                </span>
                <span className="px-2 py-0.5 rounded bg-industrial-safe/20 text-industrial-safe border border-industrial-safe/40 text-[10px] font-bold">
                  VERIFIED
                </span>
              </div>
              <p className="text-xs text-slateBlue-300 font-sans mt-0.5">
                All 8 industrial telemetry stages complete. Control room status and risk metrics synchronized with the master model.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsRecentlySynced(false);
              if (onSelectWorkspace) onSelectWorkspace('intelligence');
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-industrial-cyan to-cyan-500 text-carbon-950 font-mono text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-safe/30 hover:brightness-110 transition-all scale-[1.02] shrink-0"
          >
            <span>Open AI Risk Analysis</span>
            <span>→</span>
          </button>
        </div>
      )}

      {/* Workspace 1 — Control Room Dashboard */}
      {activeWorkspace === 'overview' && (
        <div id="overview-content" className={`space-y-10 animate-in fade-in-50 slide-in-from-bottom-2 duration-300 ${getFocusClass(1)}`}>
          {guidedDemoStep === 0 && (
            <div className="bg-gradient-to-r from-carbon-900 via-slateBlue-900/40 to-carbon-900 border border-industrial-cyan/50 rounded-2xl p-5 sm:p-6 shadow-[0_0_30px_rgba(6,182,212,0.18)] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-industrial-cyan/20 border border-industrial-cyan flex items-center justify-center text-industrial-cyan shrink-0 shadow-glow-safe/40">
                  <Play className="w-6 h-6 fill-current" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-industrial-cyan/20 text-industrial-cyan font-bold text-[10px] uppercase tracking-wider border border-industrial-cyan/40">
                      ENTERPRISE GUIDED DEMONSTRATION
                    </span>
                    <span className="text-xs text-slateBlue-400">Interactive Product Walkthrough</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-100 uppercase tracking-tight">
                    Start Guided Enterprise Demonstration
                  </h3>
                  <p className="text-xs font-sans text-slateBlue-300 max-w-2xl leading-relaxed">
                    Trigger a seamless 7-step automated sequence across Control Room → Scenario Builder → Pipeline → Timeline → Context Engine → Risk Report → Safety Assistant.
                  </p>
                </div>
              </div>
              <button
                onClick={handleStartGuidedDemo}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-industrial-cyan to-cyan-400 text-carbon-950 font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.7)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shrink-0"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Guided Demo</span>
              </button>
            </div>
          )}

          <div className="space-y-6">
            <ExecutiveStatusSummary
              overview={data.overview}
              operationalStatus={data.operationalStatus}
              sensorsCount={data.sensors?.length || 24}
              recommendationsCount={data.recommendations?.length || 4}
            />
            <PlantHealthSummaryCard
              overview={data.overview}
              operationalStatus={data.operationalStatus}
            />
          </div>

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
          </div>
          <div className="space-y-8 pt-2">
            <div className={`transition-all duration-700 ${isRecentlySynced ? 'p-1.5 rounded-2xl border border-industrial-cyan/60 shadow-[0_0_25px_rgba(6,182,212,0.28)] bg-industrial-cyan/[0.02]' : ''}`}>
              <CompoundRiskTrendChart data={data.riskTrend} />
            </div>
          </div>
        </div>
      )}

      {/* Workspace 2 — STEP 2: Scenario Builder */}
      {activeWorkspace === 'scenario-builder' && (
        <div id="scenario-controls" className={`animate-in fade-in-50 slide-in-from-bottom-2 duration-300 ${getFocusClass(2)}`}>
          <React.Suspense fallback={<WorkspaceSkeleton />}>
            <InteractiveScenarioBuilder
              onApplyCustomScenario={(payload) => {
                if (onApplyCustomScenario) {
                  onApplyCustomScenario(payload);
                }
                setAutoRunPipeline(true);
                if (onSelectWorkspace) {
                  onSelectWorkspace('pipeline');
                }
              }}
              onSelectWorkspace={onSelectWorkspace}
              autoLoadPreset={autoLoadPreset}
            />
          </React.Suspense>
        </div>
      )}

      {/* Workspace 3 — STEP 3: Pipeline Inspector */}
      {activeWorkspace === 'pipeline' && (
        <div id="pipeline-execution" className={`animate-in fade-in-50 slide-in-from-bottom-2 duration-300 ${getFocusClass(3)}`}>
          <React.Suspense fallback={<WorkspaceSkeleton />}>
            <InteractivePipelineInspector
              scenario={currentScenario}
              autoRun={autoRunPipeline}
              onSimulationComplete={() => {
                handleSimulationComplete();
                if (guidedDemoStep === 3) {
                  setAutoRunPipeline(false);
                  setTimeout(() => {
                    setGuidedDemoStep(4);
                  }, 1400);
                } else if (autoRunPipeline) {
                  setAutoRunPipeline(false);
                  setTimeout(() => {
                    if (onSelectWorkspace) {
                      onSelectWorkspace('overview');
                    }
                  }, 1400);
                }
              }}
            />
          </React.Suspense>
        </div>
      )}

      {/* Workspace 4 — STEP 4: Operations Timeline */}
      {activeWorkspace === 'operations' && (
        <div id="operations-timeline" className={`space-y-8 animate-in fade-in-50 slide-in-from-bottom-2 duration-300 ${getFocusClass(4)}`}>
          <React.Suspense fallback={<WorkspaceSkeleton />}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className={`lg:col-span-8 transition-all duration-700 ${isRecentlySynced ? 'p-1.5 rounded-2xl border border-industrial-cyan/60 shadow-[0_0_25px_rgba(6,182,212,0.28)] bg-industrial-cyan/[0.02]' : ''}`}>
                <OperationalStatusPanel status={data.operationalStatus} />
              </div>
              <div className={`lg:col-span-4 transition-all duration-700 ${isRecentlySynced ? 'p-1.5 rounded-2xl border border-industrial-cyan/60 shadow-[0_0_25px_rgba(6,182,212,0.28)] bg-industrial-cyan/[0.02]' : ''}`}>
                <IndustrialEventTimeline timeline={data.timeline} />
              </div>
            </div>
          </React.Suspense>
        </div>
      )}

      {/* Workspace 5 — STEP 5: Operational Context */}
      {activeWorkspace === 'operational-context' && (
        <div id="generated-observations" className={`space-y-8 animate-in fade-in-50 slide-in-from-bottom-2 duration-300 ${getFocusClass(5)}`}>
          <React.Suspense fallback={<WorkspaceSkeleton />}>
            <div className={`transition-all duration-700 ${isRecentlySynced ? 'p-1.5 rounded-2xl border border-industrial-cyan/60 shadow-[0_0_25px_rgba(6,182,212,0.28)] bg-industrial-cyan/[0.02]' : ''}`}>
              <OperationalContextIntelligencePanel
                operationalContext={(data as any).operationalContext}
                scenario={currentScenario}
              />
            </div>
            <div className={`transition-all duration-700 ${isRecentlySynced ? 'p-1.5 rounded-2xl border border-industrial-cyan/60 shadow-[0_0_25px_rgba(6,182,212,0.28)] bg-industrial-cyan/[0.02]' : ''}`}>
              <RecommendationsPanel recommendations={data.recommendations} />
            </div>
          </React.Suspense>
        </div>
      )}

      {/* Workspace 6 — STEP 6: Compound Risk Intelligence */}
      {activeWorkspace === 'intelligence' && (
        <div id="risk-analysis" className={`space-y-8 animate-in fade-in-50 slide-in-from-bottom-2 duration-300 ${getFocusClass(6)}`}>
          <React.Suspense fallback={<WorkspaceSkeleton />}>
            <div className={`transition-all duration-700 ${isRecentlySynced ? 'p-1.5 rounded-2xl border border-industrial-cyan/60 shadow-[0_0_25px_rgba(6,182,212,0.28)] bg-industrial-cyan/[0.02]' : ''}`}>
              <CompoundRiskIntelligencePanel
                operationalContext={(data as any).operationalContext}
                scenario={currentScenario}
              />
            </div>
          </React.Suspense>
        </div>
      )}

    </div>
  );
};

export default DashboardView;
