import React, { useState } from 'react';
import type { ScenarioType } from '../../types/industrial';
import { SimplifiedArchitectureOverview } from './SimplifiedArchitectureOverview';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import {
  Activity,
  ShieldAlert,
  Gauge,
  Wrench,
  Flame,
  BrainCircuit,
  Cpu,
  CheckCircle2,
  Layers,
  ArrowRight,
  Shield,
  Terminal,
  MapPin,
  History,
  Sliders,
  Play,
  Server,
  Code2,
  Cloud,
  ChevronRight
} from 'lucide-react';

interface LandingPageProps {
  onLaunchDashboard: (initialScenario?: ScenarioType) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchDashboard }) => {
  const [selectedDemoScenario, setSelectedDemoScenario] = useState<ScenarioType>('normal');

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-carbon-900 text-slateBlue-300 font-sans selection:bg-industrial-cyan selection:text-carbon-900 relative overflow-x-hidden">
      {/* Subtle Background Grid & Telemetry Lines */}
      <div className="fixed inset-0 bg-grid-pattern opacity-30 pointer-events-none z-0" />
      <div className="fixed top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-slateBlue-800/40 to-transparent pointer-events-none z-0" />
      <div className="fixed top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-slateBlue-800/40 to-transparent pointer-events-none z-0" />

      {/* ==================================================
          STICKY TOP NAVIGATION
      ================================================== */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-carbon-900/90 border-b border-slateBlue-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-carbon-800 border border-industrial-cyan/50 flex items-center justify-center shadow-glow-safe">
              <Activity className="w-5 h-5 text-industrial-cyan animate-pulse" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-mono font-extrabold tracking-wider text-slate-100 uppercase">
                Sentinel<span className="text-industrial-cyan">AI</span>
              </span>
              <Badge variant="outline" className="hidden sm:inline-flex text-[9px] border-industrial-cyan/40 text-industrial-cyan font-mono">
                ENTERPRISE v1.0
              </Badge>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wider uppercase text-slateBlue-400">
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-industrial-cyan transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('architecture')}
              className="hover:text-industrial-cyan transition-colors"
            >
              Architecture
            </button>
            <button
              onClick={() => scrollToSection('technology')}
              className="hover:text-industrial-cyan transition-colors"
            >
              Technology
            </button>
            <button
              onClick={() => scrollToSection('simulation')}
              className="hover:text-industrial-cyan transition-colors"
            >
              Simulation
            </button>
          </nav>

          <button
            onClick={() => onLaunchDashboard()}
            className="bg-industrial-cyan text-carbon-900 font-mono font-bold text-xs uppercase px-4 py-2 rounded shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:bg-cyan-300 hover:scale-105 transition-all duration-200 flex items-center gap-2"
          >
            <span>Launch Dashboard</span>
            <Play className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 space-y-24 sm:space-y-32 py-12 sm:py-20">
        
        {/* ==================================================
            SECTION 1: HERO
        ================================================== */}
        <section className="text-center flex flex-col items-center justify-center pt-8 sm:pt-16 pb-6 space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-carbon-800 border border-slateBlue-700/80 shadow-md">
            <span className="w-2 h-2 rounded-full bg-industrial-cyan animate-ping" />
            <span className="text-xs font-mono tracking-widest text-slate-200 uppercase font-semibold">
              Industrial Compound Risk Intelligence Platform
            </span>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-mono font-extrabold text-slate-100 tracking-tight leading-tight">
              Predict Compound Industrial Risks <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-industrial-cyan via-cyan-200 to-slate-200">
                Before They Become Incidents.
              </span>
            </h1>
            <p className="text-base sm:text-xl text-slateBlue-300 max-w-3xl mx-auto font-sans leading-relaxed pt-2">
              SentinelAI combines industrial telemetry, operational activities, and contextual intelligence to identify complex safety risks that traditional monitoring systems often miss.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full sm:w-auto">
            <button
              onClick={() => onLaunchDashboard()}
              className="w-full sm:w-auto bg-industrial-cyan text-carbon-900 font-mono font-bold text-sm px-8 py-4 rounded-lg shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:bg-cyan-300 hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3 group"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => scrollToSection('architecture')}
              className="w-full sm:w-auto bg-carbon-800 border border-slateBlue-700 text-slate-200 font-mono text-sm px-8 py-4 rounded-lg hover:border-slateBlue-500 hover:bg-carbon-700 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Layers className="w-4 h-4 text-industrial-cyan" />
              <span>View Architecture</span>
            </button>
          </div>

          {/* Minimal Telemetry Line Accents below hero buttons */}
          <div className="w-full max-w-3xl mx-auto pt-10 opacity-70">
            <div className="border border-slateBlue-800/80 bg-carbon-800/50 rounded-lg p-3 flex items-center justify-between text-xs font-mono text-slateBlue-400">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-industrial-cyan" />
                <span className="text-slate-300">SYSTEM STATUS:</span>
                <span className="text-industrial-safe font-semibold">ALL TELEMETRY PIPELINES ONLINE</span>
              </div>
              <div className="hidden sm:flex items-center gap-6">
                <span>GATEWAYS: 4/4 ACTIVE</span>
                <span>SCADA SYNC: 12ms</span>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            SECTION 2: THE PROBLEM (THE CHALLENGE)
        ================================================== */}
        <section className="space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <Badge variant="outline" className="font-mono text-xs">THE CHALLENGE</Badge>
            <h2 className="text-2xl sm:text-4xl font-mono font-bold text-slate-100 tracking-tight">
              Why Traditional Monitoring Systems Are Insufficient
            </h2>
            <p className="text-sm sm:text-base text-slateBlue-400 font-sans">
              Modern industrial operations face multi-variable safety threats that slip through isolated alarm thresholds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-4 border-slateBlue-800/80 bg-carbon-800/60 hover:border-slateBlue-700 transition-all">
              <div className="w-12 h-12 rounded-lg bg-carbon-900 border border-slateBlue-700 flex items-center justify-center">
                <Gauge className="w-6 h-6 text-industrial-warning" />
              </div>
              <h3 className="text-lg font-mono font-bold text-slate-100 uppercase tracking-wide">
                Isolated Sensor Thresholds
              </h3>
              <p className="text-sm text-slateBlue-300 font-sans leading-relaxed">
                Traditional monitoring relies on isolated sensor thresholds. When sensors are evaluated independently, warning signs are ignored until a critical single-sensor excursion triggers an emergency alarm.
              </p>
            </Card>

            <Card className="p-6 space-y-4 border-slateBlue-800/80 bg-carbon-800/60 hover:border-slateBlue-700 transition-all">
              <div className="w-12 h-12 rounded-lg bg-carbon-900 border border-slateBlue-700 flex items-center justify-center">
                <Wrench className="w-6 h-6 text-slateBlue-300" />
              </div>
              <h3 className="text-lg font-mono font-bold text-slate-100 uppercase tracking-wide">
                Siloed Operational Data
              </h3>
              <p className="text-sm text-slateBlue-300 font-sans leading-relaxed">
                Operational events such as maintenance, permits and workforce activities are analyzed separately from SCADA telemetry, leaving control room operators blind to human activities inside high-risk sectors.
              </p>
            </Card>

            <Card glow="critical" className="p-6 space-y-4 border-industrial-critical/40 bg-carbon-800/80 hover:border-industrial-critical/60 transition-all">
              <div className="w-12 h-12 rounded-lg bg-carbon-900 border border-industrial-critical/50 flex items-center justify-center shadow-glow-critical">
                <Flame className="w-6 h-6 text-industrial-critical animate-pulse" />
              </div>
              <h3 className="text-lg font-mono font-bold text-slate-100 uppercase tracking-wide">
                Compound Risk Emergence
              </h3>
              <p className="text-sm text-slateBlue-300 font-sans leading-relaxed">
                Dangerous compound risks emerge when multiple low-risk events occur simultaneously. Without contextual correlation, minor pressure spikes coupled with active hot-work permits escalate unnoticed.
              </p>
            </Card>
          </div>
        </section>

        {/* ==================================================
            SECTION 3: OUR SOLUTION (THE SENTINELAI APPROACH)
        ================================================== */}
        <section className="space-y-10 pt-4">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <Badge variant="info" className="font-mono text-xs">OUR SOLUTION</Badge>
            <h2 className="text-2xl sm:text-4xl font-mono font-bold text-slate-100 tracking-tight">
              The SentinelAI Approach
            </h2>
            <p className="text-sm sm:text-base text-slateBlue-400 font-sans">
              Synthesizing multi-modal telemetry with operational intelligence to detect compound hazards before critical thresholds are breached.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card glow="safe" className="p-6 flex flex-col justify-between border-industrial-safe/40 bg-carbon-800/90 hover:border-industrial-safe/60 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-slateBlue-900/80 border border-slateBlue-700 flex items-center justify-center shadow-glow-safe">
                  <BrainCircuit className="w-6 h-6 text-industrial-cyan" />
                </div>
                <h3 className="text-lg font-mono font-bold text-slate-100 uppercase tracking-wide">
                  Operational Context Intelligence
                </h3>
                <p className="text-sm text-slateBlue-300 font-sans leading-relaxed">
                  Combines maintenance activities, permits, workforce movements and live telemetry into a unified operational picture.
                </p>
              </div>
              <div className="pt-6 border-t border-slateBlue-800/60 mt-6 flex items-center justify-between text-xs font-mono">
                <span className="text-slateBlue-400">Roadmap Status</span>
                <Badge variant="safe">
                  Phase 3 Active ✓
                </Badge>
              </div>
            </Card>

            <Card className="p-6 flex flex-col justify-between border-slateBlue-800/90 bg-carbon-800/80 hover:border-industrial-warning/50 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-slateBlue-900/80 border border-slateBlue-700 flex items-center justify-center shadow-glow-warning">
                  <Cpu className="w-6 h-6 text-industrial-warning" />
                </div>
                <h3 className="text-lg font-mono font-bold text-slate-100 uppercase tracking-wide">
                  Compound Risk Intelligence
                </h3>
                <p className="text-sm text-slateBlue-300 font-sans leading-relaxed">
                  Analyzes multiple operational conditions together instead of relying on isolated alarms, calculating real-time compound risk progression.
                </p>
              </div>
              <div className="pt-6 border-t border-slateBlue-800/60 mt-6 flex items-center justify-between text-xs font-mono">
                <span className="text-slateBlue-400">Roadmap Status</span>
                <Badge variant="outline" className="border-industrial-warning/40 text-industrial-warning">
                  Phase 4 Implementation
                </Badge>
              </div>
            </Card>

            <Card glow="safe" className="p-6 flex flex-col justify-between border-industrial-safe/40 bg-carbon-800/90 hover:border-industrial-safe/60 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-carbon-900 border border-industrial-safe/50 flex items-center justify-center shadow-glow-safe">
                  <CheckCircle2 className="w-6 h-6 text-industrial-safe" />
                </div>
                <h3 className="text-lg font-mono font-bold text-slate-100 uppercase tracking-wide">
                  Explainable Recommendations
                </h3>
                <p className="text-sm text-slateBlue-300 font-sans leading-relaxed">
                  Provides prioritized safety recommendations with transparent reasoning, guiding operators directly to the root cause of risk excursions.
                </p>
              </div>
              <div className="pt-6 border-t border-slateBlue-800/60 mt-6 flex items-center justify-between text-xs font-mono">
                <span className="text-slateBlue-400">Roadmap Status</span>
                <Badge variant="safe">
                  Phase 1 Active
                </Badge>
              </div>
            </Card>
          </div>

          <div className="bg-carbon-800/50 border border-slateBlue-800/80 rounded-lg p-4 text-center max-w-3xl mx-auto">
            <p className="text-xs font-mono text-slateBlue-400">
              <strong className="text-slate-200">NOTE ON PLATFORM ROADMAP:</strong> Phase 1 provides the complete visualization, telemetry monitoring, and recommendation foundation. Operational Context (Phase 3) and AI Compound Risk (Phase 4) engines are introduced sequentially in upcoming implementation phases.
            </p>
          </div>
        </section>

        {/* ==================================================
            SECTION 4: PLATFORM ARCHITECTURE
        ================================================== */}
        {/* ==================================================
            SECTION 4: PLATFORM ARCHITECTURE (HIGH-LEVEL OVERVIEW)
        ================================================== */}
        <section id="architecture" className="space-y-10 pt-4 scroll-mt-24">
          <SimplifiedArchitectureOverview />
        </section>

        {/* ==================================================
            SECTION 5: KEY PLATFORM FEATURES
        ================================================== */}
        <section id="features" className="space-y-10 pt-4 scroll-mt-24">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <Badge variant="info" className="font-mono text-xs">CAPABILITIES SUITE</Badge>
            <h2 className="text-2xl sm:text-4xl font-mono font-bold text-slate-100 tracking-tight">
              Key Platform Features
            </h2>
            <p className="text-sm sm:text-base text-slateBlue-400 font-sans">
              Comprehensive telemetry control room modules available now and in scheduled expansion phases.
            </p>
          </div>

          {/* Group 1: Live Industrial Dashboard (Deployment Ready) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slateBlue-800 pb-2">
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Activity className="w-4 h-4 text-industrial-cyan" />
                <span>Live Industrial Dashboard Suite</span>
              </h3>
              <Badge variant="safe" className="font-mono text-xs">Deployment Ready</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <Card className="p-5 space-y-2.5 bg-carbon-800/70 border-slateBlue-800/90">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-industrial-cyan font-mono font-bold text-sm">
                    <Gauge className="w-4 h-4" />
                    <span>Live Sensor Monitoring</span>
                  </div>
                  <Badge variant="safe">Ready</Badge>
                </div>
                <p className="text-xs text-slateBlue-300 font-sans leading-relaxed">
                  Real-time 4-channel telemetry monitoring array capturing precision readouts for pressure, temperature, gas, and ambient humidity.
                </p>
              </Card>

              <Card className="p-5 space-y-2.5 bg-carbon-800/70 border-slateBlue-800/90">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-industrial-cyan font-mono font-bold text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>Geospatial Risk Mapping</span>
                  </div>
                  <Badge variant="safe">Ready</Badge>
                </div>
                <p className="text-xs text-slateBlue-300 font-sans leading-relaxed">
                  2D interactive plant schematic providing zone-by-zone spatial risk visualization and telemetry inspector deep-dives across Sector Alpha and Terminal.
                </p>
              </Card>

              <Card className="p-5 space-y-2.5 bg-carbon-800/70 border-slateBlue-800/90">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-industrial-cyan font-mono font-bold text-sm">
                    <History className="w-4 h-4" />
                    <span>Industrial Event Timeline</span>
                  </div>
                  <Badge variant="safe">Ready</Badge>
                </div>
                <p className="text-xs text-slateBlue-300 font-sans leading-relaxed">
                  Live synchronized event feed logging and chronicling all plant excursions, maintenance actions, and safety checklists in chronological order.
                </p>
              </Card>

              <Card className="p-5 space-y-2.5 bg-carbon-800/70 border-slateBlue-800/90">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-industrial-cyan font-mono font-bold text-sm">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Compound Risk Index</span>
                  </div>
                  <Badge variant="safe">Ready</Badge>
                </div>
                <p className="text-xs text-slateBlue-300 font-sans leading-relaxed">
                  Real-time composite metric aggregating multi-channel telemetry into a unified 0–100 risk score with dynamic threshold reference bands.
                </p>
              </Card>

              <Card className="p-5 space-y-2.5 bg-carbon-800/70 border-slateBlue-800/90">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-industrial-cyan font-mono font-bold text-sm">
                    <Sliders className="w-4 h-4" />
                    <span>Scenario Simulation</span>
                  </div>
                  <Badge variant="safe">Ready</Badge>
                </div>
                <p className="text-xs text-slateBlue-300 font-sans leading-relaxed">
                  Interactive state injection allowing judges to instantly toggle between Normal Operation, Warning Excursion, and Critical Compound Risk modes.
                </p>
              </Card>

              <Card className="p-5 space-y-2.5 bg-carbon-800/70 border-slateBlue-800/90">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-industrial-cyan font-mono font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Explainable Recommendations</span>
                  </div>
                  <Badge variant="safe">Ready</Badge>
                </div>
                <p className="text-xs text-slateBlue-300 font-sans leading-relaxed">
                  Actionable safety protocol list delivering prioritized mitigation steps synchronized directly with live telemetry threshold triggers.
                </p>
              </Card>
            </div>
          </div>

          {/* Group 2: Future Capabilities */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between border-b border-slateBlue-800 pb-2">
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-industrial-warning" />
                <span>Future Capabilities (Advanced Intelligence Pipelines)</span>
              </h3>
              <Badge variant="outline" className="font-mono text-xs text-slateBlue-400">Scheduled Expansion</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Card className="p-5 space-y-2.5 bg-carbon-900/60 border-slateBlue-800/80 hover:border-slateBlue-700 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-200 font-mono font-bold text-sm">
                    <Layers className="w-4 h-4 text-industrial-cyan opacity-80" />
                    <span>Operational Context Intelligence Engine</span>
                  </div>
                  <Badge variant="outline" className="border-industrial-cyan/40 text-industrial-cyan font-mono text-xs">
                    Phase 3
                  </Badge>
                </div>
                <p className="text-xs text-slateBlue-300 font-sans leading-relaxed">
                  Synthesizes live telemetry with maintenance schedules, hot-work permits, and RFID worker rosters to build contextual operational blueprints.
                </p>
              </Card>

              <Card className="p-5 space-y-2.5 bg-carbon-900/60 border-slateBlue-800/80 hover:border-slateBlue-700 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-200 font-mono font-bold text-sm">
                    <Cpu className="w-4 h-4 text-industrial-warning opacity-80" />
                    <span>Compound Risk Intelligence Engine</span>
                  </div>
                  <Badge variant="outline" className="border-industrial-warning/40 text-industrial-warning font-mono text-xs">
                    Phase 4
                  </Badge>
                </div>
                <p className="text-xs text-slateBlue-300 font-sans leading-relaxed">
                  AI predictive engine computing cascading failure probabilities across interacting variables and generating automated containment protocols.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* ==================================================
            SECTION 6: TECHNOLOGY STACK
        ================================================== */}
        <section id="technology" className="space-y-8 pt-4 scroll-mt-24">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <Badge variant="outline" className="font-mono text-xs">INFRASTRUCTURE</Badge>
            <h2 className="text-2xl sm:text-3xl font-mono font-bold text-slate-100 tracking-tight">
              Technology Stack
            </h2>
            <p className="text-xs sm:text-sm text-slateBlue-400 font-sans">
              Precision-engineered modern web stack designed for sub-second telemetry rendering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="p-5 space-y-4 bg-carbon-800/60 border-slateBlue-800">
              <div className="flex items-center gap-2.5 border-b border-slateBlue-800/60 pb-3 text-industrial-cyan font-mono font-bold text-sm">
                <Code2 className="w-4 h-4" />
                <span>Frontend Architecture</span>
              </div>
              <ul className="space-y-2.5 text-xs font-mono text-slate-200">
                <li className="flex items-center justify-between">
                  <span>React 18</span>
                  <Badge variant="outline" className="text-[9px]">UI Library</Badge>
                </li>
                <li className="flex items-center justify-between">
                  <span>TypeScript</span>
                  <Badge variant="outline" className="text-[9px]">Strict Typing</Badge>
                </li>
                <li className="flex items-center justify-between">
                  <span>Tailwind CSS</span>
                  <Badge variant="outline" className="text-[9px]">Design System</Badge>
                </li>
                <li className="flex items-center justify-between">
                  <span>Vite</span>
                  <Badge variant="outline" className="text-[9px]">Build Tool</Badge>
                </li>
              </ul>
            </Card>

            <Card className="p-5 space-y-4 bg-carbon-800/60 border-slateBlue-800">
              <div className="flex items-center gap-2.5 border-b border-slateBlue-800/60 pb-3 text-industrial-safe font-mono font-bold text-sm">
                <Server className="w-4 h-4" />
                <span>Backend Telemetry</span>
              </div>
              <ul className="space-y-2.5 text-xs font-mono text-slate-200">
                <li className="flex items-center justify-between">
                  <span>Node.js</span>
                  <Badge variant="outline" className="text-[9px]">Runtime</Badge>
                </li>
                <li className="flex items-center justify-between">
                  <span>Express</span>
                  <Badge variant="outline" className="text-[9px]">REST API</Badge>
                </li>
                <li className="flex items-center justify-between">
                  <span>TypeScript</span>
                  <Badge variant="outline" className="text-[9px]">Schema Safety</Badge>
                </li>
                <li className="flex items-center justify-between">
                  <span>Mock Gateway</span>
                  <Badge variant="outline" className="text-[9px]">SCADA Sync</Badge>
                </li>
              </ul>
            </Card>

            <Card className="p-5 space-y-4 bg-carbon-800/60 border-slateBlue-800">
              <div className="flex items-center gap-2.5 border-b border-slateBlue-800/60 pb-3 text-industrial-warning font-mono font-bold text-sm">
                <Cloud className="w-4 h-4" />
                <span>Enterprise Deployment</span>
              </div>
              <ul className="space-y-2.5 text-xs font-mono text-slate-200">
                <li className="flex items-center justify-between">
                  <span>Vercel</span>
                  <Badge variant="outline" className="text-[9px]">Frontend Edge</Badge>
                </li>
                <li className="flex items-center justify-between">
                  <span>Render</span>
                  <Badge variant="outline" className="text-[9px]">Backend Services</Badge>
                </li>
                <li className="flex items-center justify-between">
                  <span>CI/CD Pipeline</span>
                  <Badge variant="outline" className="text-[9px]">Automated</Badge>
                </li>
                <li className="flex items-center justify-between">
                  <span>TLS 1.3 / SSL</span>
                  <Badge variant="outline" className="text-[9px]">Secure Edge</Badge>
                </li>
              </ul>
            </Card>
          </div>
        </section>

        {/* ==================================================
            SECTION 7: DEMO SIMULATION (INTERACTIVE SIMULATION)
        ================================================== */}
        <section id="simulation" className="space-y-8 pt-4 pb-12 scroll-mt-24">
          <Card glow="safe" className="p-8 sm:p-12 border-industrial-cyan/50 bg-gradient-to-br from-carbon-800 via-carbon-900 to-slateBlue-900/40 relative overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.15)]">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none hidden lg:block">
              <Activity className="w-64 h-64 text-industrial-cyan" />
            </div>

            <div className="max-w-3xl space-y-6 relative z-10">
              <div className="flex items-center gap-3">
                <Badge variant="info" className="font-mono text-xs">INTERACTIVE TEST SUITE</Badge>
                <span className="text-xs font-mono text-slateBlue-400">CONTROL ROOM TELEMETRY SIMULATION</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-mono font-bold text-slate-100 tracking-tight">
                Interactive Industrial Simulation
              </h2>

              <p className="text-sm sm:text-base text-slateBlue-300 font-sans leading-relaxed">
                The Phase 1 dashboard includes three active simulation modes: <strong className="text-industrial-safe">Normal Operation</strong>, <strong className="text-industrial-warning">Warning State</strong>, and <strong className="text-industrial-critical">Critical Compound Risk</strong>.
              </p>

              <p className="text-xs sm:text-sm text-slateBlue-400 font-sans leading-relaxed">
                Judges can switch scenarios right inside the control room header to observe immediate synchronized changes across live telemetry sensors, spatial plant status, chronological timeline feeds, and prioritized safety recommendations.
              </p>

              {/* Scenario Quick Selector buttons to launch directly */}
              <div className="pt-2 space-y-3">
                <span className="text-xs font-mono font-bold uppercase text-slate-200 block tracking-wider">
                  Select Initial Scenario Mode to Launch:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
                  <button
                    onClick={() => setSelectedDemoScenario('normal')}
                    className={`p-3 rounded border text-left font-mono text-xs transition-all flex items-center justify-between ${
                      selectedDemoScenario === 'normal'
                        ? 'bg-industrial-safe/20 border-industrial-safe text-industrial-safe font-bold shadow-glow-safe'
                        : 'bg-carbon-900/80 border-slateBlue-800 text-slateBlue-300 hover:border-slateBlue-600'
                    }`}
                  >
                    <span>Normal Operation</span>
                    {selectedDemoScenario === 'normal' && <CheckCircle2 className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setSelectedDemoScenario('warning')}
                    className={`p-3 rounded border text-left font-mono text-xs transition-all flex items-center justify-between ${
                      selectedDemoScenario === 'warning'
                        ? 'bg-industrial-warning/20 border-industrial-warning text-industrial-warning font-bold shadow-glow-warning'
                        : 'bg-carbon-900/80 border-slateBlue-800 text-slateBlue-300 hover:border-slateBlue-600'
                    }`}
                  >
                    <span>Warning State</span>
                    {selectedDemoScenario === 'warning' && <CheckCircle2 className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setSelectedDemoScenario('critical')}
                    className={`p-3 rounded border text-left font-mono text-xs transition-all flex items-center justify-between ${
                      selectedDemoScenario === 'critical'
                        ? 'bg-industrial-critical/20 border-industrial-critical text-industrial-critical font-bold shadow-glow-critical'
                        : 'bg-carbon-900/80 border-slateBlue-800 text-slateBlue-300 hover:border-slateBlue-600'
                    }`}
                  >
                    <span>Critical Risk</span>
                    {selectedDemoScenario === 'critical' && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={() => onLaunchDashboard(selectedDemoScenario)}
                  className="bg-industrial-cyan text-carbon-900 font-mono font-extrabold text-sm px-8 py-4 rounded-lg shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:bg-cyan-300 hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3 group"
                >
                  <span>Launch Dashboard ({selectedDemoScenario.toUpperCase()})</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </Card>
        </section>

      </main>

      {/* ==================================================
          FOOTER
      ================================================== */}
      <footer className="relative z-10 border-t border-slateBlue-800/80 bg-carbon-900/95 py-10 px-6 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slateBlue-400">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-carbon-800 border border-industrial-cyan/50 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-industrial-cyan" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <span className="font-bold text-slate-200 tracking-wider">SentinelAI</span>
              <span className="hidden sm:inline text-slateBlue-700">|</span>
              <span>Industrial Compound Risk Intelligence Platform</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slateBlue-500">
            <Badge variant="outline" className="text-[10px] border-slateBlue-700">
              Hackathon Prototype
            </Badge>
            <span>2026 Enterprise SCADA Core</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
