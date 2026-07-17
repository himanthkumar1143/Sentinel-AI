import React, { useState } from 'react';
import {
  Gauge,
  Database,
  ShieldCheck,
  Cpu,
  Layers,
  BrainCircuit,
  Flame,
  Activity,
  CheckCircle2,
  Lock,
  Play,
  RotateCcw,
  ChevronRight,
  Shield,
  FileCode2,
  Sparkles,
  X
} from 'lucide-react';
import { Badge } from '../../ui/badge';
import { RadarScanner } from './RadarScanner';
import type { ScenarioType } from '../../../types/industrial';

interface PipelineInspectorProps {
  scenario: ScenarioType;
  onSimulationComplete?: () => void;
  onSimulationStart?: () => void;
}

type StageStatus = 'idle' | 'running' | 'completed';

interface StageDefinition {
  id: number;
  code: string;
  title: string;
  subtitle: string;
  purpose: string;
  description: string;
  phase: string;
  isLocked?: boolean;
  icon: React.ReactNode;
  samplePayload: string;
}

export const InteractivePipelineInspector: React.FC<PipelineInspectorProps> = ({
  scenario,
  onSimulationComplete,
  onSimulationStart
}) => {
  const [selectedStage, setSelectedStage] = useState<number>(5); // Default to UPM
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isFinishing, setIsFinishing] = useState<boolean>(false);
  const [showSummaryCard, setShowSummaryCard] = useState<boolean>(false);
  const [stageStatuses, setStageStatuses] = useState<Record<number, StageStatus>>({
    1: 'idle', 2: 'idle', 3: 'idle', 4: 'idle', 5: 'idle', 6: 'idle', 7: 'idle', 8: 'idle'
  });
  
  // PART 2: Enterprise processing status right above pipeline
  const [activeStatusMessage, setActiveStatusMessage] = useState<string>('Ready');

  // PART 4: Live Industrial Metrics counters
  const [packetsCount, setPacketsCount] = useState<number>(0);
  const [sourcesConnected, setSourcesConnected] = useState<number>(0);
  const [validationProgress, setValidationProgress] = useState<number>(0);

  // Validation, UPM, and Phase 3 Rule execution items (PART 1 & PART 2)
  const [checkedValidationItems, setCheckedValidationItems] = useState<string[]>([]);
  const [upmLoadedBars, setUpmLoadedBars] = useState<string[]>([]);
  const [evaluatedRuleChecks, setEvaluatedRuleChecks] = useState<string[]>([]);

  const stages: StageDefinition[] = [
    {
      id: 1,
      code: 'ST-01',
      title: 'Industrial Sources',
      subtitle: 'SCADA / Gas / Temp / Pressure / Humidity',
      purpose: 'Raw edge telemetry ingestion across 8 plant sectors.',
      description: 'Continuous real-time collection from edge SCADA sensors, pressure manifolds, thermal arrays, and SAP workforce management systems.',
      phase: 'Phase 2 Source',
      icon: <Gauge className="w-5 h-5" />,
      samplePayload: `{ "sensor_id": "scada-gas-101", "reading_ppm": 1.4, "status_flag": "NORMAL", "timestamp": "${new Date().toISOString()}" }`
    },
    {
      id: 2,
      code: 'ST-02',
      title: 'Data Collection',
      subtitle: 'Multi-Source Ingestion Gateway',
      purpose: 'Centralized protocol gateway and packet aggregation.',
      description: 'Aggregates disparate industrial payloads (OPC-UA, MQTT, REST) into a standardized collection envelope with exact arrival timestamps.',
      phase: 'Phase 2 Collector',
      icon: <Database className="w-5 h-5" />,
      samplePayload: `{ "collectionTimestamp": "${new Date().toISOString()}", "sourcesCount": 8, "packetBuffer": "HEALTHY", "sources": { "gas": [...], "maintenance": {...} } }`
    },
    {
      id: 3,
      code: 'ST-03',
      title: 'Validation',
      subtitle: 'Rule-Engine & Quality Assurance',
      purpose: 'Strict business rule validation and anomaly rejection.',
      description: 'Executes strict quality checks to reject negative gas concentrations, out-of-range sensor timestamps, missing IDs, or non-integer crew counts.',
      phase: 'Phase 2 Validator',
      icon: <ShieldCheck className="w-5 h-5" />,
      samplePayload: `{ "isValid": true, "totalChecked": 42, "errorCount": 0, "warningCount": 0, "issues": [], "validationRulesApplied": ["NON_NEGATIVE_GAS", "VALID_SHIFT_ROSTER"] }`
    },
    {
      id: 4,
      code: 'ST-04',
      title: 'Normalization',
      subtitle: 'Standardized Units & Schema Alignment',
      purpose: 'Universal schema alignment and metric standard conversions.',
      description: 'Converts legacy sensor units to enterprise standards (e.g., gas_ppm -> gasConcentration) and aligns schema names across SAP and SCADA systems.',
      phase: 'Phase 2 Normalizer',
      icon: <Cpu className="w-5 h-5" />,
      samplePayload: `{ "sensors": [{ "id": "scada-gas-101", "currentValue": 1.4, "unit": "PPM", "status": "safe" }], "operational": { "workersPresent": 142, "shiftCode": "SHIFT-A" } }`
    },
    {
      id: 5,
      code: 'ST-05',
      title: 'Unified Plant Model',
      subtitle: 'Single Enterprise Data Backbone',
      purpose: 'Synthesizes all domain records into one master enterprise object.',
      description: 'Creates the singular source of truth (`UnifiedPlantModel`) that powers all downstream intelligence, risk maps, and control room visualizations.',
      phase: 'Phase 2 Model',
      icon: <Layers className="w-5 h-5" />,
      samplePayload: `{ "plant": { "code": "SIPC-A", "overallStatus": "ONLINE - NORMAL" }, "worker": { "workersPresent": 142 }, "sensor": { "totalSensors": 1420 } }`
    },
    {
      id: 6,
      code: 'ST-06',
      title: 'Operational Context',
      subtitle: 'Spatial Activity Correlation',
      purpose: 'Correlates physical work permits with equipment maintenance arrays.',
      description: 'Cross-references active high-risk work permits with maintenance overhauls and ambient gas readings using 52 deterministic engineering rules to establish true explainable operational context.',
      phase: 'Phase 3 Active Engine',
      isLocked: false,
      icon: <BrainCircuit className="w-5 h-5" />,
      samplePayload: `{ "contextId": "CTX-CRITICAL-L92K", "scenario": "${scenario}", "confidence": 99, "rulesEvaluated": 52, "rulesTriggered": 11, "compoundRules": 4, "observationsCount": 8, "status": "CRITICAL ALERT - HIGH RISK" }`
    },
    {
      id: 7,
      code: 'ST-07',
      title: 'Compound Risk Intelligence',
      subtitle: 'AI Cascading Failure Prediction',
      purpose: 'Predicts multi-variable cascading risk escalation probabilities.',
      description: 'Computes compound risk scores using multi-domain correlation matrices, triggering automated safety recommendations across plant zones.',
      phase: 'Phase 4 Locked',
      isLocked: true,
      icon: <Flame className="w-5 h-5" />,
      samplePayload: `[RESERVED FOR PHASE 4: AI predictive probability vectors & automated containment triggers]`
    },
    {
      id: 8,
      code: 'ST-08',
      title: 'Industrial Dashboard',
      subtitle: 'Control Room Telemetry UI',
      purpose: 'Sub-second visual presentation for enterprise operators and judges.',
      description: 'Delivers explainable, real-time industrial intelligence to control room operators through maps, sensor grids, and compound risk charts.',
      phase: 'Phase 1 Active UI',
      icon: <Activity className="w-5 h-5" />,
      samplePayload: `{ "currentView": "DashboardView", "selectedScenario": "${scenario}", "synchronizationStatus": "VERIFIED", "latency": "12ms" }`
    }
  ];

  const handleRunSimulation = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setIsFinishing(false);
    setShowSummaryCard(false);
    onSimulationStart?.();

    setCheckedValidationItems([]);
    setUpmLoadedBars([]);
    setEvaluatedRuleChecks([]);
    setPacketsCount(0);
    setSourcesConnected(0);
    setValidationProgress(0);

    setStageStatuses({
      1: 'idle', 2: 'idle', 3: 'idle', 4: 'idle', 5: 'idle', 6: 'idle', 7: 'idle', 8: 'idle'
    });

    // PART 3: Natural timings (0.4s -> 0.7s -> 1.0s -> 0.5s -> 1.2s -> 0.8s -> 0.6s -> 0.6s = 5.8s total)
    const timers: ReturnType<typeof setTimeout>[] = [];

    // ST-01: Industrial Sources (0ms to 400ms)
    timers.push(setTimeout(() => {
      setStageStatuses(prev => ({ ...prev, 1: 'running' }));
      setActiveStatusMessage('Receiving Industrial Telemetry...');
      setPacketsCount(126);
      setSourcesConnected(2);
      setSelectedStage(1);
    }, 50));

    // ST-02: Collection (400ms to 1100ms)
    timers.push(setTimeout(() => {
      setStageStatuses(prev => ({ ...prev, 1: 'completed', 2: 'running' }));
      setActiveStatusMessage('Collecting Industrial Sources...');
      setPacketsCount(382);
      setSourcesConnected(4);
      setSelectedStage(2);
    }, 400));

    // ST-03: Validation (1100ms to 2100ms)
    timers.push(setTimeout(() => {
      setStageStatuses(prev => ({ ...prev, 2: 'completed', 3: 'running' }));
      setActiveStatusMessage('Running Validation Engine...');
      setPacketsCount(764);
      setSourcesConnected(8);
      setSelectedStage(3);
    }, 1100));

    // Validation items inside 1.0s window (PART 8 & PART 4 counters)
    const valItems = ['Gas Sensors', 'Pressure Arrays', 'Temperature Core', 'Humidity Probes', 'SAP Maintenance', 'Worker Roster', 'Work Permits'];
    valItems.forEach((item, index) => {
      timers.push(setTimeout(() => {
        setCheckedValidationItems(prev => [...prev, item]);
        setValidationProgress(Math.min(100, Math.round(((index + 1) / valItems.length) * 100)));
      }, 1200 + index * 125));
    });

    // ST-04: Normalization (2100ms to 2600ms)
    timers.push(setTimeout(() => {
      setStageStatuses(prev => ({ ...prev, 3: 'completed', 4: 'running' }));
      setActiveStatusMessage('Normalizing Data & Standardizing Units...');
      setPacketsCount(1280);
      setValidationProgress(100);
      setSelectedStage(4);
    }, 2100));

    // ST-05: Unified Plant Model (2600ms to 3800ms)
    timers.push(setTimeout(() => {
      setStageStatuses(prev => ({ ...prev, 4: 'completed', 5: 'running' }));
      setActiveStatusMessage('Building Unified Plant Model...');
      setSelectedStage(5);
    }, 2600));

    // UPM bars inside 1.2s window (PART 9)
    const upmBars = ['Plant Core', 'Operational Shift', 'Maintenance Management', 'Worker Distribution', 'Sensor Telemetry Array'];
    upmBars.forEach((bar, index) => {
      timers.push(setTimeout(() => {
        setUpmLoadedBars(prev => [...prev, bar]);
      }, 2750 + index * 180));
    });

    // ST-06: Operational Context (3800ms to 4800ms) - PART 1 & PART 2
    timers.push(setTimeout(() => {
      setStageStatuses(prev => ({ ...prev, 5: 'completed', 6: 'running' }));
      setActiveStatusMessage('Reading Sensor Telemetry...');
      setSelectedStage(6);
    }, 3800));

    // PART 2 Progress Stages alongside PART 1 Rule Visualizations
    const stage6Steps = [
      { progress: 'Checking Maintenance Activities...', rule: '✓ GasRule-01' },
      { progress: 'Validating Work Permits...', rule: '✓ PressureRule-02' },
      { progress: 'Analyzing Workforce Distribution...', rule: '✓ TemperatureRule-01' },
      { progress: 'Evaluating Environmental Conditions...', rule: '✓ HumidityRule-01' },
      { progress: 'Executing Compound Rules...', rule: '✓ MaintenanceRule-01' },
      { progress: 'Generating Operational Context...', rule: '✓ WorkerRule-01' },
      { progress: 'Generating Operational Context...', rule: '✓ CompoundRule-03' },
      { progress: 'Completed', rule: '✓ CompoundRule-05' }
    ];

    stage6Steps.forEach((item, index) => {
      timers.push(setTimeout(() => {
        setActiveStatusMessage(item.progress);
        setEvaluatedRuleChecks(prev => [...prev, item.rule]);
      }, 3880 + index * 115));
    });

    // ST-07: Compound Risk Intelligence (4800ms to 5400ms)
    timers.push(setTimeout(() => {
      setStageStatuses(prev => ({ ...prev, 6: 'completed', 7: 'running' }));
      setActiveStatusMessage('Verifying Compound Risk Probability Vectors (Phase 4)...');
      setPacketsCount(1420);
      setSelectedStage(7);
    }, 4800));

    // ST-08: Industrial Dashboard (5400ms to 6000ms)
    timers.push(setTimeout(() => {
      setStageStatuses(prev => ({ ...prev, 7: 'completed', 8: 'running' }));
      setActiveStatusMessage('Synchronizing Dashboard with Verified Telemetry...');
      setIsFinishing(true);
      setSelectedStage(8);
    }, 5400));

    // Simulation complete! (6000ms)
    timers.push(setTimeout(() => {
      setStageStatuses(prev => ({ ...prev, 8: 'completed' }));
      setActiveStatusMessage('Ready');
      setIsProcessing(false);
      setIsFinishing(false);
      setShowSummaryCard(true);
      onSimulationComplete?.();
    }, 6000));

    // Auto fade summary card after 10 seconds
    timers.push(setTimeout(() => {
      setShowSummaryCard(false);
    }, 15800));
  };

  const activeStageObj = stages.find(s => s.id === selectedStage) || stages[4];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header & Simulation Trigger Control */}
      <div className="bg-carbon-900 border border-slateBlue-800 rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-panel relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-industrial-cyan animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-industrial-cyan">
              ENTERPRISE ENGINEERING WORKSPACE
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-mono font-extrabold text-slate-100 tracking-tight">
            Data Integration Pipeline Inspector
          </h2>
          <p className="text-sm text-slateBlue-300 font-sans max-w-2xl">
            Examine real-time data flows, natural timing synchronization, and enterprise schema construction across the 8-stage architecture.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto relative z-10">
          <button
            onClick={handleRunSimulation}
            disabled={isProcessing}
            className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-300 shadow-lg ${
              isProcessing
                ? 'bg-slateBlue-800 text-slateBlue-400 border border-slateBlue-700 cursor-wait'
                : 'bg-gradient-to-r from-industrial-cyan to-cyan-500 text-carbon-950 hover:brightness-110 shadow-glow-safe/40 scale-[1.02]'
            }`}
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-carbon-950 border-t-transparent animate-spin" />
                <span>Running Pipeline ({activeStatusMessage.slice(0, 18)}...)</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Run Simulation</span>
              </>
            )}
          </button>

          {Object.values(stageStatuses).some(s => s === 'completed') && !isProcessing && (
            <button
              onClick={() => {
                setStageStatuses({ 1: 'idle', 2: 'idle', 3: 'idle', 4: 'idle', 5: 'idle', 6: 'idle', 7: 'idle', 8: 'idle' });
                setCheckedValidationItems([]);
                setUpmLoadedBars([]);
                setPacketsCount(0);
                setSourcesConnected(0);
                setValidationProgress(0);
                setShowSummaryCard(false);
                setActiveStatusMessage('Ready');
              }}
              className="px-4 py-3.5 rounded-xl bg-carbon-800 hover:bg-slateBlue-800 border border-slateBlue-700 text-slateBlue-300 hover:text-slate-100 font-mono text-xs flex items-center justify-center gap-2 transition-all"
              title="Reset Stage Indicators"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* =========================================================
          PART 2 & PART 4: LIVE PIPELINE STATUS & METRICS COUNTERS
      ========================================================= */}
      {isProcessing && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 animate-in fade-in zoom-in-95 duration-300">
          {/* Status Message Pill (PART 2) */}
          <div className="lg:col-span-1 bg-carbon-900 border border-industrial-cyan/50 rounded-2xl p-5 flex flex-col justify-between shadow-glow-safe/10">
            <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase text-industrial-cyan">
              <span className="w-2 h-2 rounded-full bg-industrial-cyan animate-ping" />
              <span>ACTIVE STAGE STATUS</span>
            </div>
            <div className="py-2 text-sm font-mono font-extrabold text-slate-100 tracking-wide animate-pulse">
              {activeStatusMessage}
            </div>
            <div className="text-[10px] font-mono text-slateBlue-400">
              {isFinishing ? 'FINALIZING PIPELINE SWEEP' : 'SIEMENS / HONEYWELL PROTOCOL'}
            </div>
          </div>

          {/* Metric 1: Packets Processed (PART 4) */}
          <div className="bg-carbon-900 border border-slateBlue-800 rounded-2xl p-5 flex flex-col justify-between shadow-inner">
            <span className="text-[11px] font-mono text-slateBlue-400 font-bold uppercase">Packets Processed</span>
            <div className="text-2xl sm:text-3xl font-mono font-extrabold text-cyan-300 tracking-tight transition-all duration-300">
              {packetsCount.toLocaleString()}
            </div>
            <span className="text-[10px] font-mono text-industrial-safe flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-industrial-safe" /> STREAMING ACTIVE
            </span>
          </div>

          {/* Metric 2: Sources Connected (PART 4) */}
          <div className="bg-carbon-900 border border-slateBlue-800 rounded-2xl p-5 flex flex-col justify-between shadow-inner">
            <span className="text-[11px] font-mono text-slateBlue-400 font-bold uppercase">Sources Connected</span>
            <div className="text-2xl sm:text-3xl font-mono font-extrabold text-slate-100 tracking-tight transition-all duration-300">
              {sourcesConnected} <span className="text-base text-slateBlue-500">/ 8</span>
            </div>
            <span className="text-[10px] font-mono text-slateBlue-400">
              SCADA / SAP Gateways
            </span>
          </div>

          {/* Metric 3: Validation Progress (PART 4) */}
          <div className="bg-carbon-900 border border-slateBlue-800 rounded-2xl p-5 flex flex-col justify-between shadow-inner">
            <span className="text-[11px] font-mono text-slateBlue-400 font-bold uppercase">Validation Progress</span>
            <div className="text-2xl sm:text-3xl font-mono font-extrabold text-industrial-safe tracking-tight transition-all duration-300">
              {validationProgress}%
            </div>
            <div className="w-full h-1 rounded-full bg-carbon-950 overflow-hidden border border-slateBlue-800 mt-1">
              <div className="h-full bg-industrial-safe transition-all duration-300" style={{ width: `${validationProgress}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          RADAR SCANNER & SUB-STEP VISUALIZER BOX
      ========================================================= */}
      {isProcessing && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="lg:col-span-1">
            <RadarScanner scenario={scenario} statusText={activeStatusMessage} isProcessing={isProcessing} isFinishing={isFinishing} />
          </div>

          <div className="lg:col-span-2 bg-carbon-900 border border-slateBlue-800 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden shadow-panel">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slateBlue-800/80 pb-3">
                <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-slate-100">
                  <span className="w-2 h-2 rounded-full bg-industrial-cyan animate-ping" />
                  <span>Pipeline Stage Deep Execution Log</span>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono border-slateBlue-700 text-slateBlue-300">
                  {stageStatuses[3] === 'running' ? 'STAGE 03: VALIDATION' : stageStatuses[5] === 'running' ? 'STAGE 05: UPM BUILD' : 'IN PROGRESS'}
                </Badge>
              </div>

              {/* Validation Sequential Checklist */}
              {stageStatuses[3] === 'running' || checkedValidationItems.length > 0 ? (
                <div className="space-y-2">
                  <div className="text-xs font-mono text-slateBlue-400 font-semibold uppercase">
                    Validation QA Check Sequence:
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {['Gas Sensors', 'Pressure Arrays', 'Temperature Core', 'Humidity Probes', 'SAP Maintenance', 'Worker Roster', 'Work Permits'].map((item) => {
                      const isChecked = checkedValidationItems.includes(item);
                      return (
                        <div
                          key={item}
                          className={`p-2.5 rounded-lg border text-xs font-mono flex items-center gap-2 transition-all duration-300 ${
                            isChecked
                              ? 'bg-industrial-safe/10 border-industrial-safe/50 text-industrial-safe font-semibold scale-[1.02]'
                              : 'bg-carbon-950/60 border-slateBlue-800/80 text-slateBlue-500'
                          }`}
                        >
                          {isChecked ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-industrial-safe shrink-0 animate-in zoom-in" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-slateBlue-700 shrink-0" />
                          )}
                          <span className="truncate">{isChecked ? `✓ ${item}` : item}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {/* Unified Plant Model Construction Bars */}
              {stageStatuses[5] === 'running' || upmLoadedBars.length > 0 ? (
                <div className="space-y-3 pt-2">
                  <div className="text-xs font-mono text-slateBlue-400 font-semibold uppercase flex items-center justify-between">
                    <span>Synthesizing Enterprise Model Domains:</span>
                    {upmLoadedBars.length === 5 && (
                      <span className="text-industrial-safe font-bold animate-pulse">Unified Plant Model Ready ✓</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    {['Plant Core', 'Operational Shift', 'Maintenance Management', 'Worker Distribution', 'Sensor Telemetry Array'].map((domain) => {
                      const isLoaded = upmLoadedBars.includes(domain);
                      return (
                        <div key={domain} className="space-y-1">
                          <div className="flex justify-between text-[11px] font-mono">
                            <span className={isLoaded ? 'text-cyan-300 font-semibold' : 'text-slateBlue-500'}>{domain}</span>
                            <span className={isLoaded ? 'text-industrial-safe' : 'text-slateBlue-600'}>{isLoaded ? '100% SYNTHESIZED ✓' : 'STANDBY...'}</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-carbon-950 overflow-hidden border border-slateBlue-800/60">
                            <div
                              className={`h-full transition-all duration-500 ${
                                isLoaded ? 'w-full bg-gradient-to-r from-industrial-cyan to-industrial-safe shadow-[0_0_8px_#10b981]' : 'w-0'
                              }`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {!stageStatuses[3] && !stageStatuses[5] && checkedValidationItems.length === 0 && upmLoadedBars.length === 0 && (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 font-mono text-xs text-slateBlue-400">
                  <div className="w-8 h-8 rounded-full border-2 border-industrial-cyan border-t-transparent animate-spin" />
                  <span>{activeStatusMessage}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slateBlue-800/80 flex items-center justify-between text-[11px] font-mono text-slateBlue-400">
              <span>SIMULATION ENGINE: SIEMENS / HONEYWELL COMPLIANT</span>
              <span className="text-industrial-cyan font-semibold">LATENCY: &lt; 12ms</span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          PART 6: PIPELINE COMPLETION SUMMARY CARD (DISMISSIBLE / FADE)
      ========================================================= */}
      {showSummaryCard && (
        <div className="bg-gradient-to-r from-carbon-900 via-carbon-850 to-carbon-900 border-2 border-industrial-safe rounded-2xl p-6 shadow-[0_0_30px_rgba(16,185,129,0.2)] flex flex-col sm:flex-row items-center justify-between gap-6 animate-in fade-in zoom-in-95 duration-500 relative">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-industrial-safe/20 border border-industrial-safe flex items-center justify-center text-industrial-safe shrink-0 shadow-glow-safe/30">
              <CheckCircle2 className="w-6 h-6 animate-in zoom-in" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-mono font-extrabold text-slate-100 uppercase tracking-wide">
                  Pipeline Completed &amp; Dashboard Synchronized
                </h4>
                <Badge variant="safe" className="font-mono text-[10px]">VERIFIED ✓</Badge>
              </div>
              <p className="text-xs text-slateBlue-300 font-sans mt-0.5">
                All 8 industrial telemetry stages verified. Control room widgets have visibly synchronized with master model.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full sm:w-auto text-center border-t sm:border-t-0 sm:border-l border-slateBlue-800 pt-3 sm:pt-0 sm:pl-6 font-mono">
            <div>
              <span className="text-[10px] text-slateBlue-400 block uppercase font-bold">Sources</span>
              <span className="text-sm font-extrabold text-slate-100">8 Processed</span>
            </div>
            <div>
              <span className="text-[10px] text-slateBlue-400 block uppercase font-bold">Validation</span>
              <span className="text-sm font-extrabold text-industrial-safe">Passed ✓</span>
            </div>
            <div>
              <span className="text-[10px] text-slateBlue-400 block uppercase font-bold">Normalized</span>
              <span className="text-sm font-extrabold text-cyan-300">100% Schema</span>
            </div>
            <div>
              <span className="text-[10px] text-slateBlue-400 block uppercase font-bold">Time Consumed</span>
              <span className="text-sm font-extrabold text-industrial-cyan">5.8 sec</span>
            </div>
          </div>

          <button
            onClick={() => setShowSummaryCard(false)}
            className="absolute top-3 right-3 text-slateBlue-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slateBlue-800/60 transition-colors"
            title="Dismiss Summary Card"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* =========================================================
          PART 7 & PART 9: REFINED METALLIC PIPELINE (8 NODES)
      ========================================================= */}
      <div className="bg-carbon-900 border border-slateBlue-800 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slateBlue-800/80 pb-5 mb-8">
          <div>
            <span className="text-[11px] font-mono font-bold text-slateBlue-400 uppercase tracking-wider block">
              Enterprise Topology Array
            </span>
            <h3 className="text-lg sm:text-xl font-mono font-extrabold text-slate-100 mt-0.5">
              8-Stage Industrial Data Backbone
            </h3>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-slateBlue-400">
              <span className="w-2.5 h-2.5 rounded-full bg-slateBlue-700" /> Idle
            </span>
            <span className="flex items-center gap-1.5 text-industrial-cyan">
              <span className="w-2.5 h-2.5 rounded-full bg-industrial-cyan animate-ping" /> Running
            </span>
            <span className="flex items-center gap-1.5 text-industrial-safe">
              <span className="w-2.5 h-2.5 rounded-full bg-industrial-safe" /> Completed
            </span>
          </div>
        </div>

        {/* 2x4 Grid with Metallic Pipes and Grouped Packets (PART 7 & PART 9) */}
        <div className="space-y-8 relative z-10">
          
          {/* ROW 1: Stages 1 -> 2 -> 3 -> 4 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative">
            {stages.slice(0, 4).map((stage, idx) => {
              const status = stageStatuses[stage.id];
              const isSelected = stage.id === selectedStage;

              return (
                <div key={stage.id} className="relative flex flex-col h-full">
                  {/* PART 7 & PART 9: Metallic Industrial Pipe with Grouped Packets & Glow Trail */}
                  {idx < 3 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-5 translate-x-1/2 -translate-y-1/2 z-20 items-center justify-center pointer-events-none w-10">
                      <div className="w-full h-2 bg-gradient-to-r from-slateBlue-900 via-carbon-950 to-slateBlue-900 border border-slateBlue-700/80 rounded-full relative overflow-hidden flex items-center justify-between px-1 shadow-inner">
                        {/* Grouped traveling packets with varied speeds & trail */}
                        <div className="flex items-center gap-1">
                          <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                            status === 'running' || isProcessing
                              ? 'bg-cyan-300 shadow-[0_0_10px_#06b6d4,0_0_20px_#06b6d4] animate-[shimmer_0.6s_infinite_linear]'
                              : 'bg-slateBlue-700'
                          }`} />
                          <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                            status === 'running' || isProcessing
                              ? 'bg-industrial-cyan shadow-[0_0_8px_#06b6d4] animate-[shimmer_0.9s_infinite_linear]'
                              : 'bg-slateBlue-800'
                          }`} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Stage Node Button */}
                  <button
                    onClick={() => setSelectedStage(stage.id)}
                    className={`text-left p-5 rounded-xl border transition-all duration-300 flex flex-col justify-between h-full relative group ${
                      isSelected
                        ? 'bg-carbon-800 border-industrial-cyan shadow-[0_0_25px_rgba(6,182,212,0.28)] scale-[1.02]'
                        : status === 'running'
                        ? 'bg-carbon-800/90 border-industrial-cyan animate-pulse shadow-[0_0_18px_rgba(6,182,212,0.22)]'
                        : status === 'completed'
                        ? 'bg-carbon-900/95 border-industrial-safe/60 shadow-[0_0_12px_rgba(16,185,129,0.18)]'
                        : 'bg-carbon-900/90 border-slateBlue-800 hover:border-slateBlue-600 hover:bg-carbon-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-colors ${
                          status === 'running' || isSelected
                            ? 'bg-industrial-cyan/20 border-industrial-cyan text-industrial-cyan'
                            : status === 'completed'
                            ? 'bg-industrial-safe/20 border-industrial-safe text-industrial-safe'
                            : 'bg-carbon-800 border-slateBlue-700 text-slateBlue-400 group-hover:border-slateBlue-500'
                        }`}>
                          {stage.icon}
                        </div>
                        <span className="text-xs font-mono font-bold text-slateBlue-400">
                          {stage.code}
                        </span>
                      </div>

                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        status === 'running'
                          ? 'bg-industrial-cyan/20 text-industrial-cyan border border-industrial-cyan animate-pulse'
                          : status === 'completed'
                          ? 'bg-industrial-safe/20 text-industrial-safe border border-industrial-safe flex items-center gap-1'
                          : 'bg-slateBlue-800/80 text-slateBlue-400 border border-slateBlue-700'
                      }`}>
                        {status === 'completed' ? (
                          <><span>Done</span><CheckCircle2 className="w-3 h-3" /></>
                        ) : status === 'running' ? (
                          'Active'
                        ) : (
                          stage.phase.split(' ')[1] || 'Idle'
                        )}
                      </span>
                    </div>

                    <div className="space-y-1 mb-4">
                      <h4 className={`text-sm font-mono font-bold uppercase tracking-wide transition-colors ${
                        status === 'running' || isSelected ? 'text-industrial-cyan' : status === 'completed' ? 'text-industrial-safe' : 'text-slate-100 group-hover:text-cyan-200'
                      }`}>
                        {stage.title}
                      </h4>
                      <p className="text-xs font-mono text-slateBlue-400 line-clamp-2 leading-relaxed">
                        {stage.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slateBlue-800/60 flex items-center justify-between text-[10px] font-mono text-slateBlue-500">
                      <span>{stage.subtitle.split(' ')[0]}</span>
                      <span className="text-cyan-400 group-hover:underline flex items-center gap-1">
                        Inspect <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          {/* CONNECTING METALLIC TRUNK BETWEEN ROW 1 AND ROW 2 (PART 7 & PART 9) */}
          <div className="hidden lg:flex items-center justify-center py-2">
            <div className="w-full max-w-4xl border border-slateBlue-700/80 rounded-xl h-11 flex items-center justify-between px-6 bg-gradient-to-r from-carbon-900 via-carbon-800 to-carbon-900 relative overflow-hidden shadow-inner">
              <div className="absolute top-0 bottom-0 w-36 bg-gradient-to-r from-transparent via-industrial-cyan/35 to-transparent animate-[shimmer_1.8s_infinite_linear]" />
              <div className="flex items-center gap-3 text-xs font-mono text-industrial-cyan font-bold tracking-wide">
                <span className="w-2.5 h-2.5 rounded-full bg-industrial-cyan animate-ping" />
                <span>●──○──○──○──▶ METALLIC TELEMETRY TRUNK FLOWING TO ENTERPRISE BACKBONE</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-slateBlue-300">
                <span>PROTOCOL: OPC-UA / MQTT</span>
                <span className="text-industrial-safe font-semibold">VALIDATION PASS ✓</span>
              </div>
            </div>
          </div>

          {/* ROW 2: Stages 5 -> 6 -> 7 -> 8 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative">
            {stages.slice(4, 8).map((stage, idx) => {
              const status = stageStatuses[stage.id];
              const isSelected = stage.id === selectedStage;
              const isLocked = stage.isLocked;

              return (
                <div key={stage.id} className="relative flex flex-col h-full">
                  {/* Metallic Pipe */}
                  {idx < 3 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-5 translate-x-1/2 -translate-y-1/2 z-20 items-center justify-center pointer-events-none w-10">
                      <div className="w-full h-2 bg-gradient-to-r from-slateBlue-900 via-carbon-950 to-slateBlue-900 border border-slateBlue-700/80 rounded-full relative overflow-hidden flex items-center justify-between px-1 shadow-inner">
                        <div className="flex items-center gap-1">
                          <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                            status === 'running' || isProcessing
                              ? isLocked ? 'bg-amber-300 shadow-[0_0_10px_#f59e0b] animate-[shimmer_0.6s_infinite_linear]' : 'bg-cyan-300 shadow-[0_0_10px_#06b6d4] animate-[shimmer_0.6s_infinite_linear]'
                              : 'bg-slateBlue-700'
                          }`} />
                          <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                            status === 'running' || isProcessing
                              ? isLocked ? 'bg-industrial-warning shadow-[0_0_8px_#f59e0b] animate-[shimmer_0.9s_infinite_linear]' : 'bg-industrial-cyan shadow-[0_0_8px_#06b6d4] animate-[shimmer_0.9s_infinite_linear]'
                              : 'bg-slateBlue-800'
                          }`} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Stage Node Button */}
                  <button
                    onClick={() => setSelectedStage(stage.id)}
                    className={`text-left p-5 rounded-xl border transition-all duration-300 flex flex-col justify-between h-full relative group ${
                      isSelected
                        ? isLocked
                          ? 'bg-carbon-800 border-industrial-warning shadow-[0_0_25px_rgba(245,158,11,0.28)] scale-[1.02]'
                          : 'bg-carbon-800 border-industrial-cyan shadow-[0_0_25px_rgba(6,182,212,0.28)] scale-[1.02]'
                        : status === 'running'
                        ? isLocked
                          ? 'bg-carbon-800/90 border-industrial-warning animate-pulse shadow-[0_0_18px_rgba(245,158,11,0.22)]'
                          : 'bg-carbon-800/90 border-industrial-cyan animate-pulse shadow-[0_0_18px_rgba(6,182,212,0.22)]'
                        : status === 'completed'
                        ? isLocked
                          ? 'bg-carbon-900/95 border-industrial-warning/50 shadow-[0_0_12px_rgba(245,158,11,0.18)]'
                          : 'bg-carbon-900/95 border-industrial-safe/60 shadow-[0_0_12px_rgba(16,185,129,0.18)]'
                        : 'bg-carbon-900/90 border-slateBlue-800 hover:border-slateBlue-600 hover:bg-carbon-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-colors ${
                          status === 'running' || isSelected
                            ? isLocked ? 'bg-industrial-warning/20 border-industrial-warning text-industrial-warning' : 'bg-industrial-cyan/20 border-industrial-cyan text-industrial-cyan'
                            : status === 'completed'
                            ? isLocked ? 'bg-industrial-warning/20 border-industrial-warning text-industrial-warning' : 'bg-industrial-safe/20 border-industrial-safe text-industrial-safe'
                            : 'bg-carbon-800 border-slateBlue-700 text-slateBlue-400 group-hover:border-slateBlue-500'
                        }`}>
                          {stage.icon}
                        </div>
                        <span className="text-xs font-mono font-bold text-slateBlue-400">
                          {stage.code}
                        </span>
                      </div>

                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase flex items-center gap-1 ${
                        status === 'running'
                          ? isLocked ? 'bg-industrial-warning/20 text-industrial-warning border border-industrial-warning animate-pulse' : 'bg-industrial-cyan/20 text-industrial-cyan border border-industrial-cyan animate-pulse'
                          : status === 'completed'
                          ? isLocked ? 'bg-industrial-warning/20 text-industrial-warning border border-industrial-warning' : 'bg-industrial-safe/20 text-industrial-safe border border-industrial-safe'
                          : isLocked
                          ? 'bg-slateBlue-800/80 text-industrial-warning border border-slateBlue-700'
                          : 'bg-slateBlue-800/80 text-slateBlue-400 border border-slateBlue-700'
                      }`}>
                        {status === 'completed' ? (
                          isLocked ? <><span>Reserved</span><Lock className="w-3 h-3" /></> : <><span>Done</span><CheckCircle2 className="w-3 h-3" /></>
                        ) : isLocked ? (
                          <><span>Locked</span><Lock className="w-3 h-3" /></>
                        ) : status === 'running' ? (
                          'Active'
                        ) : (
                          'Ready'
                        )}
                      </span>
                    </div>

                    <div className="space-y-1 mb-4">
                      <h4 className={`text-sm font-mono font-bold uppercase tracking-wide transition-colors ${
                        status === 'running' || isSelected ? (isLocked ? 'text-industrial-warning' : 'text-industrial-cyan') : status === 'completed' ? (isLocked ? 'text-industrial-warning' : 'text-industrial-safe') : 'text-slate-100 group-hover:text-cyan-200'
                      }`}>
                        {stage.title}
                      </h4>
                      <p className="text-xs font-mono text-slateBlue-400 line-clamp-2 leading-relaxed">
                        {stage.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slateBlue-800/60 flex items-center justify-between text-[10px] font-mono text-slateBlue-500">
                      <span>{isLocked ? 'AI Intelligence Layer' : 'Enterprise Backbone'}</span>
                      <span className={`${isLocked ? 'text-amber-400' : 'text-cyan-400'} group-hover:underline flex items-center gap-1`}>
                        Inspect <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* =========================================================
          PART 10: POLISHED NODE INSPECTOR PANEL & JSON TERMINAL
      ========================================================= */}
      <div className="bg-carbon-950/90 border border-slateBlue-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-inner animate-in fade-in duration-300">
        {/* Polished Inspector Header Bar (Stage Name, Purpose, Current Status, Pipeline Position) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slateBlue-800/80 pb-5">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-carbon-800 border flex items-center justify-center shrink-0 ${
              activeStageObj.isLocked ? 'border-industrial-warning/50 text-industrial-warning shadow-glow-warning/20' : 'border-industrial-cyan/50 text-industrial-cyan shadow-glow-safe/20'
            }`}>
              {activeStageObj.icon}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-xs font-mono font-bold text-slateBlue-400 uppercase">
                  Stage {activeStageObj.id} of 8
                </span>
                <span className="text-slateBlue-600">|</span>
                <h4 className="text-lg font-mono font-extrabold text-slate-100 uppercase tracking-wide">
                  {activeStageObj.code}: {activeStageObj.title}
                </h4>
                <Badge variant="outline" className={`text-[10px] font-mono ${
                  activeStageObj.isLocked ? 'border-industrial-warning/40 text-industrial-warning' : 'border-industrial-cyan/40 text-industrial-cyan'
                }`}>
                  {activeStageObj.phase}
                </Badge>
              </div>
              <p className="text-xs font-mono text-cyan-400 font-semibold mt-1">
                PURPOSE: {activeStageObj.purpose}
              </p>
            </div>
          </div>

          {/* Current Status pill */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-3.5 py-2 rounded-xl bg-carbon-900 border border-slateBlue-800 flex items-center gap-2 font-mono text-xs">
              <span className="text-slateBlue-400 uppercase font-semibold">Status:</span>
              <span className={`font-bold uppercase ${
                stageStatuses[activeStageObj.id] === 'running'
                  ? 'text-industrial-cyan animate-pulse'
                  : stageStatuses[activeStageObj.id] === 'completed'
                  ? 'text-industrial-safe'
                  : activeStageObj.isLocked
                  ? 'text-industrial-warning'
                  : 'text-slateBlue-300'
              }`}>
                {stageStatuses[activeStageObj.id] === 'completed' ? 'Completed ✓' : stageStatuses[activeStageObj.id] === 'running' ? 'Running / Active' : activeStageObj.isLocked ? 'Reserved / Locked' : 'Idle / Standby'}
              </span>
            </div>
          </div>
        </div>

        {/* Stage Description & Metadata grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="md:col-span-2 space-y-2 bg-carbon-900/60 p-4 rounded-xl border border-slateBlue-800/80">
            <span className="font-mono font-bold uppercase text-slateBlue-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-industrial-cyan" /> Architectural Specification &amp; Business Rules
            </span>
            <p className="text-slateBlue-300 font-sans leading-relaxed">
              {activeStageObj.description}
            </p>
          </div>

          <div className="space-y-2 bg-carbon-900/60 p-4 rounded-xl border border-slateBlue-800/80 font-mono">
            <span className="font-bold uppercase text-slateBlue-300 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-industrial-safe" /> Compliance Spec
            </span>
            <div className="space-y-1 text-[11px] text-slateBlue-400">
              <div className="flex justify-between"><span>Protocol:</span><span className="text-slate-200">OPC-UA / MQTT v5</span></div>
              <div className="flex justify-between"><span>Throughput:</span><span className="text-slate-200">1,420 Nodes/sec</span></div>
              <div className="flex justify-between"><span>Isolation:</span><span className="text-industrial-safe">Level 4 SCADA</span></div>
            </div>
          </div>
        </div>

        {/* PART 1: LIVE RULE EXECUTION VISUALIZATION (STAGE 6 ST-06) */}
        {selectedStage === 6 && (
          <div className="space-y-3 bg-carbon-900/90 border border-industrial-cyan/40 rounded-xl p-5 shadow-inner animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-slateBlue-800/80 pb-3">
              <span className="font-mono text-xs font-bold uppercase tracking-wide text-industrial-cyan flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-industrial-cyan animate-pulse" />
                Deterministic Engineering Rule Evaluation (Phase 3 Active Engine)
              </span>
              <span className="text-[11px] font-mono text-slateBlue-400">
                {evaluatedRuleChecks.length > 0 ? `${evaluatedRuleChecks.length} / 8 Rules Evaluated` : 'Click "Run Complete Simulation" to watch live execution'}
              </span>
            </div>
            {evaluatedRuleChecks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
                {evaluatedRuleChecks.map((check, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-carbon-950 border border-industrial-safe/40 flex items-center justify-between text-xs font-mono text-industrial-safe animate-in fade-in slide-in-from-left-2 duration-200"
                  >
                    <span className="font-semibold">{check}</span>
                    <span className="w-2 h-2 rounded-full bg-industrial-safe animate-ping" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1 opacity-60">
                {['GasRule-01', 'PressureRule-02', 'TemperatureRule-01', 'HumidityRule-01', 'MaintenanceRule-01', 'WorkerRule-01', 'CompoundRule-03', 'CompoundRule-05'].map((r, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-carbon-950/60 border border-slateBlue-800 flex items-center justify-between text-xs font-mono text-slateBlue-400">
                    <span>○ {r}</span>
                    <span className="text-[10px] uppercase text-slateBlue-600">Standby</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* JSON Code Box (Exactly preserved with improved presentation) */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between text-xs font-mono text-slateBlue-400 px-1">
            <span className="flex items-center gap-2 font-bold text-slate-200">
              <FileCode2 className="w-4 h-4 text-industrial-cyan" />
              <span>TELEMETRY PAYLOAD SNAPSHOT ({activeStageObj.code})</span>
            </span>
            <span className="text-[11px] text-cyan-400">SCHEMA: SIEMENS SIPC-A / HONEYWELL COMPLIANT</span>
          </div>
          <pre className="bg-carbon-900 border border-slateBlue-800 rounded-xl p-4 sm:p-5 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed shadow-inner selection:bg-cyan-500 selection:text-carbon-950">
            <code>{activeStageObj.samplePayload}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default InteractivePipelineInspector;
