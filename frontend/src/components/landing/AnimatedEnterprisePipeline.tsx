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
  Terminal,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { Badge } from '../ui/badge';

interface PipelineStage {
  id: number;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  phase: string;
  status: 'active' | 'roadmap';
  icon: React.ReactNode;
  samplePayload: string;
}

export const AnimatedEnterprisePipeline: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<number>(5); // Default to Unified Plant Model

  const stages: PipelineStage[] = [
    {
      id: 1,
      code: 'ST-01',
      title: 'Industrial Sensors',
      subtitle: 'SCADA / Gas / Temp / Pressure / Humidity',
      description: 'Independent edge telemetry streams reporting raw physical metrics across 8 plant sectors.',
      phase: 'Phase 2 Source',
      status: 'active',
      icon: <Gauge className="w-5 h-5 text-industrial-cyan" />,
      samplePayload: `{ "sensor_id": "scada-gas-101", "reading_ppm": 1.4, "gas_type": "H2S_CH4_MIX" }`
    },
    {
      id: 2,
      code: 'ST-02',
      title: 'Data Collection',
      subtitle: 'Multi-Source Ingestion Gateway',
      description: 'Fetches every industrial source (SCADA, SAP maintenance, work permits, weather, and shift rosters) into a unified buffer.',
      phase: 'Phase 2 Collector',
      status: 'active',
      icon: <Database className="w-5 h-5 text-industrial-cyan" />,
      samplePayload: `{ "collectionTimestamp": "2026-07-15T15:30:00Z", "sources": { "gas": [...], "maintenance": {...} } }`
    },
    {
      id: 3,
      code: 'ST-03',
      title: 'Validation',
      subtitle: 'Rule-Engine Rejection & Quality Assurance',
      description: 'Strict rule enforcement rejecting negative gas/pressure, invalid timestamps, missing IDs, or non-integer worker counts.',
      phase: 'Phase 2 Validator',
      status: 'active',
      icon: <ShieldCheck className="w-5 h-5 text-industrial-safe" />,
      samplePayload: `{ "isValid": true, "totalChecked": 42, "errorCount": 0, "issues": [] }`
    },
    {
      id: 4,
      code: 'ST-04',
      title: 'Normalization',
      subtitle: 'Standardized Units & Schema Alignment',
      description: 'Normalizes field names and units (e.g., gas_ppm -> gasConcentration, workerCount -> workersPresent, temp -> temperature).',
      phase: 'Phase 2 Normalizer',
      status: 'active',
      icon: <Cpu className="w-5 h-5 text-industrial-cyan" />,
      samplePayload: `{ "sensors": [{ "id": "scada-gas-101", "currentValue": 1.4, "unit": "PPM", "status": "safe" }] }`
    },
    {
      id: 5,
      code: 'ST-05',
      title: 'Unified Plant Model',
      subtitle: 'Single Enterprise Data Backbone',
      description: 'Synthesizes Plant, Operational, Environmental, Maintenance, Permit, Worker, and Sensor domains into one master enterprise object.',
      phase: 'Phase 2 Model',
      status: 'active',
      icon: <Layers className="w-5 h-5 text-industrial-cyan animate-pulse" />,
      samplePayload: `{ "plant": { "code": "SIPC-A", "overallStatus": "ONLINE - NORMAL" }, "operational": { "workersPresent": 142 } }`
    },
    {
      id: 6,
      code: 'ST-06',
      title: 'Operational Context Intelligence',
      subtitle: 'Cross-Domain Activity Correlation',
      description: 'Analyzes spatial overlap between active hot-work permits, maintenance overhaul crews, and live sensor conditions.',
      phase: 'Phase 3 Engine',
      status: 'roadmap',
      icon: <BrainCircuit className="w-5 h-5 text-industrial-warning" />,
      samplePayload: `[RESERVED FOR PHASE 3: Contextual activity graph & spatial permit conflicts]`
    },
    {
      id: 7,
      code: 'ST-07',
      title: 'Compound Risk Intelligence',
      subtitle: 'AI Cascading Failure Prediction',
      description: 'Computes multi-variable compound risk progression beyond isolated single-sensor thresholds using advanced inference.',
      phase: 'Phase 4 AI Engine',
      status: 'roadmap',
      icon: <Flame className="w-5 h-5 text-industrial-critical" />,
      samplePayload: `[RESERVED FOR PHASE 4: AI predictive probability vectors & automated containment trigger]`
    },
    {
      id: 8,
      code: 'ST-08',
      title: 'Industrial Dashboard',
      subtitle: 'Control Room Telemetry UI',
      description: 'Sub-second real-time enterprise control center displaying live telemetry arrays, spatial maps, and explainable safety protocols.',
      phase: 'Phase 1 Active UI',
      status: 'active',
      icon: <Activity className="w-5 h-5 text-industrial-safe" />,
      samplePayload: `{ "currentView": "DashboardView", "selectedScenario": "normal", "latency": "12ms" }`
    }
  ];

  const activeStageObj = stages.find(s => s.id === selectedStage) || stages[4];

  return (
    <div className="bg-carbon-900 border border-slateBlue-800 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden selection:bg-industrial-cyan selection:text-carbon-900">
      {/* Subtle Blueprint Grid & Industrial Glow Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-industrial-cyan/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-industrial-safe/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slateBlue-800/80 pb-6 mb-8">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-industrial-cyan animate-ping" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-industrial-cyan">
              SIEMENS / HONEYWELL ARCHITECTURE SPEC
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-mono font-extrabold text-slate-100 tracking-tight">
            Enterprise Industrial Data Integration Pipeline
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-industrial-cyan/40 text-industrial-cyan font-mono text-xs px-3 py-1 bg-carbon-800/80">
            Phase 2 Backbone Online
          </Badge>
          <div className="hidden sm:flex items-center gap-2 bg-carbon-800 border border-slateBlue-800 px-3 py-1 rounded text-xs font-mono text-slateBlue-300">
            <Terminal className="w-3.5 h-3.5 text-industrial-safe" />
            <span>THROUGHPUT: 1,420 NODE/S</span>
          </div>
        </div>
      </div>

      {/* =========================================================
          ANIMATED PIPELINE DIAGRAM (2 ROWS OF 4 STAGES WITH SVG PIPES)
      ========================================================= */}
      <div className="relative z-10 space-y-6">
        
        {/* ROW 1: Stages 1 -> 2 -> 3 -> 4 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          {stages.slice(0, 4).map((stage, idx) => {
            const isSelected = stage.id === selectedStage;
            return (
              <div key={stage.id} className="relative flex flex-col h-full">
                {/* Connecting Arrow between cards on large screens */}
                {idx < 3 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-4 translate-x-1/2 -translate-y-1/2 z-20 items-center justify-center pointer-events-none">
                    <div className="w-8 h-0.5 bg-gradient-to-r from-industrial-cyan to-cyan-300 relative overflow-hidden">
                      {/* Animated traveling particle */}
                      <div className="absolute top-0 left-0 w-3 h-full bg-slate-100 shadow-[0_0_8px_#06b6d4] animate-[shimmer_1.5s_infinite_linear]" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-industrial-cyan -ml-1.5" />
                  </div>
                )}

                {/* Stage Card */}
                <button
                  onClick={() => setSelectedStage(stage.id)}
                  className={`text-left p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between h-full relative group ${
                    isSelected
                      ? 'bg-carbon-800 border-industrial-cyan shadow-[0_0_20px_rgba(6,182,212,0.25)] scale-[1.02]'
                      : 'bg-carbon-900/90 border-slateBlue-800/90 hover:border-slateBlue-600 hover:bg-carbon-800/50'
                  }`}
                >
                  {/* Top Header of Card */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${
                        isSelected ? 'bg-industrial-cyan/20 border-industrial-cyan' : 'bg-carbon-800 border-slateBlue-700 group-hover:border-slateBlue-500'
                      }`}>
                        {stage.icon}
                      </div>
                      <span className="text-[11px] font-mono font-bold text-slateBlue-400">
                        {stage.code}
                      </span>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                      stage.status === 'active'
                        ? 'bg-industrial-cyan/10 text-industrial-cyan border border-industrial-cyan/30'
                        : 'bg-slateBlue-800/80 text-slateBlue-400 border border-slateBlue-700'
                    }`}>
                      {stage.phase}
                    </span>
                  </div>

                  {/* Body of Card */}
                  <div className="space-y-1 mb-3">
                    <h4 className={`text-sm font-mono font-bold uppercase tracking-wide transition-colors ${
                      isSelected ? 'text-industrial-cyan' : 'text-slate-100 group-hover:text-cyan-200'
                    }`}>
                      {stage.title}
                    </h4>
                    <p className="text-[11px] font-mono text-slateBlue-400 line-clamp-1">
                      {stage.subtitle}
                    </p>
                  </div>

                  {/* Footer Indicator */}
                  <div className="pt-2 border-t border-slateBlue-800/60 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slateBlue-500">Telemetry Node</span>
                    <span className="text-industrial-safe flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-industrial-safe animate-ping" />
                      <span>LIVE</span>
                    </span>
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {/* CONNECTING MANIFOLD BETWEEN ROW 1 (ST-04) AND ROW 2 (ST-05) ON LARGE SCREENS */}
        <div className="hidden lg:flex items-center justify-center py-1">
          <div className="w-full max-w-4xl border-2 border-dashed border-industrial-cyan/40 rounded-xl h-10 flex items-center justify-between px-6 bg-carbon-800/40 relative overflow-hidden shadow-inner">
            {/* Animated glowing particle traveling across manifold */}
            <div className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-industrial-cyan/30 to-transparent animate-[pulse_2s_infinite]" />
            <div className="flex items-center gap-2 text-xs font-mono text-industrial-cyan font-semibold">
              <Activity className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
              <span>NORMALIZED DATA ENGINE → SYNTHESIZING ENTERPRISE PLANT MODEL</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono text-slateBlue-400">
              <span>VALIDATION: 100% PASSED</span>
              <span>SCHEMA: SIEMENS SIPC-A</span>
            </div>
          </div>
        </div>

        {/* ROW 2: Stages 5 -> 6 -> 7 -> 8 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          {stages.slice(4, 8).map((stage, idx) => {
            const isSelected = stage.id === selectedStage;
            const isRoadmap = stage.status === 'roadmap';
            return (
              <div key={stage.id} className="relative flex flex-col h-full">
                {/* Connecting Arrow */}
                {idx < 3 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-4 translate-x-1/2 -translate-y-1/2 z-20 items-center justify-center pointer-events-none">
                    <div className={`w-8 h-0.5 relative overflow-hidden ${
                      isRoadmap ? 'bg-gradient-to-r from-slateBlue-700 to-slateBlue-800' : 'bg-gradient-to-r from-industrial-cyan to-industrial-safe'
                    }`}>
                      {!isRoadmap && (
                        <div className="absolute top-0 left-0 w-3 h-full bg-slate-100 shadow-[0_0_8px_#10b981] animate-[shimmer_1.5s_infinite_linear]" />
                      )}
                    </div>
                    <ArrowRight className={`w-4 h-4 -ml-1.5 ${isRoadmap ? 'text-slateBlue-600' : 'text-industrial-safe'}`} />
                  </div>
                )}

                {/* Stage Card */}
                <button
                  onClick={() => setSelectedStage(stage.id)}
                  className={`text-left p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between h-full relative group ${
                    isSelected
                      ? isRoadmap
                        ? 'bg-carbon-800 border-industrial-warning shadow-[0_0_20px_rgba(245,158,11,0.2)] scale-[1.02]'
                        : 'bg-carbon-800 border-industrial-cyan shadow-[0_0_20px_rgba(6,182,212,0.25)] scale-[1.02]'
                      : 'bg-carbon-900/90 border-slateBlue-800/90 hover:border-slateBlue-600 hover:bg-carbon-800/50'
                  }`}
                >
                  {/* Top Header of Card */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${
                        isSelected
                          ? isRoadmap
                            ? 'bg-industrial-warning/20 border-industrial-warning'
                            : 'bg-industrial-cyan/20 border-industrial-cyan'
                          : 'bg-carbon-800 border-slateBlue-700 group-hover:border-slateBlue-500'
                      }`}>
                        {stage.icon}
                      </div>
                      <span className="text-[11px] font-mono font-bold text-slateBlue-400">
                        {stage.code}
                      </span>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                      isRoadmap
                        ? 'bg-industrial-warning/10 text-industrial-warning border border-industrial-warning/30'
                        : stage.id === 5
                        ? 'bg-industrial-cyan/10 text-industrial-cyan border border-industrial-cyan/30'
                        : 'bg-industrial-safe/10 text-industrial-safe border border-industrial-safe/30'
                    }`}>
                      {stage.phase}
                    </span>
                  </div>

                  {/* Body of Card */}
                  <div className="space-y-1 mb-3">
                    <h4 className={`text-sm font-mono font-bold uppercase tracking-wide transition-colors ${
                      isSelected
                        ? isRoadmap ? 'text-industrial-warning' : 'text-industrial-cyan'
                        : 'text-slate-100 group-hover:text-cyan-200'
                    }`}>
                      {stage.title}
                    </h4>
                    <p className="text-[11px] font-mono text-slateBlue-400 line-clamp-1">
                      {stage.subtitle}
                    </p>
                  </div>

                  {/* Footer Indicator */}
                  <div className="pt-2 border-t border-slateBlue-800/60 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slateBlue-500">
                      {isRoadmap ? 'Intelligence Layer' : 'Enterprise Core'}
                    </span>
                    {isRoadmap ? (
                      <span className="text-industrial-warning flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>SCHEDULED</span>
                      </span>
                    ) : (
                      <span className="text-industrial-safe flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>ONLINE</span>
                      </span>
                    )}
                  </div>
                </button>
              </div>
            );
          })}
        </div>

      </div>

      {/* =========================================================
          SELECTED STAGE INSPECTOR (TELEMETRY DEEP DIVE PANEL)
      ========================================================= */}
      <div className="relative z-10 mt-8 pt-6 border-t border-slateBlue-800/80">
        <div className="bg-carbon-950/80 border border-slateBlue-800 rounded-xl p-5 sm:p-6 space-y-4 shadow-inner">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slateBlue-800/60 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-carbon-800 border border-slateBlue-700 flex items-center justify-center">
                {activeStageObj.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-industrial-cyan uppercase">
                    {activeStageObj.code}: {activeStageObj.title}
                  </span>
                  <Badge variant="outline" className="text-[10px] font-mono border-slateBlue-700 text-slateBlue-300">
                    {activeStageObj.phase}
                  </Badge>
                </div>
                <p className="text-xs font-sans text-slateBlue-300 mt-0.5">
                  {activeStageObj.description}
                </p>
              </div>
            </div>

            <div className="text-right hidden sm:block font-mono text-xs text-slateBlue-400">
              <div>INSPECTOR MODE: <span className="text-slate-200">REAL-TIME TELEMETRY</span></div>
              <div className="text-[11px] text-slateBlue-500">CLICK ANY CARD ABOVE TO INSPECT</div>
            </div>
          </div>

          {/* Sample Payload Terminal Output */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono text-slateBlue-400">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-industrial-cyan" />
                <span>SAMPLE PIPELINE STAGE PAYLOAD OUTPUT</span>
              </span>
              <span>FORMAT: JSON / ENTERPRISE SPEC</span>
            </div>
            <pre className="bg-carbon-900 border border-slateBlue-800/80 rounded-lg p-3 sm:p-4 text-xs font-mono text-cyan-300 overflow-x-auto shadow-inner leading-relaxed">
              <code>{activeStageObj.samplePayload}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Footer System Status Bar */}
      <div className="relative z-10 mt-6 pt-4 border-t border-slateBlue-800/60 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slateBlue-400 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-industrial-safe animate-ping" />
          <span>INDUSTRIAL DATA PIPELINE STATUS:</span>
          <span className="text-slate-200 font-bold">ALL 8 ARCHITECTURAL STAGES REGISTERED</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>GET /api/pipeline</span>
          <span className="text-industrial-cyan">UNIFIED PLANT MODEL v2.0</span>
        </div>
      </div>
    </div>
  );
};

export default AnimatedEnterprisePipeline;
