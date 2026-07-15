import React from 'react';
import { Gauge, Layers, Cpu, Activity, ArrowRight, ShieldCheck, Terminal } from 'lucide-react';
import { Badge } from '../ui/badge';

export const SimplifiedArchitectureOverview: React.FC = () => {
  const steps = [
    {
      id: '01',
      title: 'Edge Telemetry Ingestion',
      subtitle: '8 Industrial Sectors',
      description: 'Continuous real-time collection from SCADA gas sensors, thermal cores, pressure manifolds, and SAP maintenance rosters.',
      icon: <Gauge className="w-5 h-5 text-industrial-cyan" />
    },
    {
      id: '02',
      title: 'Data Integration Pipeline',
      subtitle: 'Validation & Normalization',
      description: 'Strict rule enforcement and schema normalization that synthesizes disparate inputs into a single Unified Plant Model.',
      icon: <Layers className="w-5 h-5 text-industrial-cyan" />
    },
    {
      id: '03',
      title: 'Compound Risk Intelligence',
      subtitle: 'Multi-Variable Correlation',
      description: 'Cross-domain spatial overlap analysis connecting active work permits with physical sensor excursions across zones.',
      icon: <Cpu className="w-5 h-5 text-industrial-warning" />
    },
    {
      id: '04',
      title: 'Control Room Dashboard',
      subtitle: 'Sub-Second Actionable UI',
      description: 'Enterprise control center delivering explainable risk metrics, interactive pipelines, and automated safety checklists.',
      icon: <Activity className="w-5 h-5 text-industrial-safe" />
    }
  ];

  return (
    <div className="bg-carbon-900 border border-slateBlue-800 rounded-2xl p-6 sm:p-10 shadow-panel relative overflow-hidden">
      {/* Background blueprint grid styling */}
      <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />

      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto mb-10 relative z-10">
        <Badge variant="outline" className="font-mono text-xs border-industrial-cyan/40 text-industrial-cyan bg-carbon-800/80">
          HIGH-LEVEL ENTERPRISE TOPOLOGY
        </Badge>
        <h2 className="text-2xl sm:text-4xl font-mono font-bold text-slate-100 tracking-tight">
          Platform Architecture &amp; Data Flow
        </h2>
        <p className="text-sm sm:text-base text-slateBlue-400 font-sans">
          From edge industrial telemetry gateways to control room visualization. For detailed step-by-step telemetry inspection and live packet simulation, access the <span className="text-industrial-cyan font-semibold">Pipeline Inspector</span> inside the Dashboard.
        </p>
      </div>

      {/* 4-Step Simplified Flow */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {steps.map((step, idx) => (
          <div key={step.id} className="relative flex flex-col h-full">
            {/* Connecting arrow for large screens */}
            {idx < 3 && (
              <div className="hidden lg:flex absolute top-1/2 -right-4 translate-x-1/2 -translate-y-1/2 z-20 items-center justify-center pointer-events-none">
                <ArrowRight className="w-5 h-5 text-slateBlue-600" />
              </div>
            )}

            <div className="bg-carbon-950/80 border border-slateBlue-800/90 rounded-xl p-6 flex flex-col justify-between h-full hover:border-industrial-cyan/50 transition-all duration-200 shadow-inner group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-carbon-800 border border-slateBlue-700 flex items-center justify-center group-hover:border-industrial-cyan/40 transition-colors">
                    {step.icon}
                  </div>
                  <span className="text-xs font-mono font-extrabold text-slateBlue-500">
                    STAGE {step.id}
                  </span>
                </div>
                <h3 className="text-base font-mono font-bold text-slate-100 mb-1 group-hover:text-cyan-300 transition-colors">
                  {step.title}
                </h3>
                <span className="text-xs font-mono text-industrial-cyan block font-medium mb-3">
                  {step.subtitle}
                </span>
                <p className="text-xs text-slateBlue-400 font-sans leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slateBlue-800/60 flex items-center justify-between text-[10px] font-mono text-slateBlue-500">
                <span>VERIFIED BACKBONE</span>
                <span className="text-industrial-safe flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-industrial-safe" /> ONLINE
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Readout */}
      <div className="mt-10 pt-5 border-t border-slateBlue-800/80 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slateBlue-400 gap-3 relative z-10">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-industrial-cyan" />
          <span>FULL INTERACTIVE ENGINEERING PIPELINE AVAILABLE IN DASHBOARD WORKSPACE</span>
        </div>
        <span className="text-[11px] text-slateBlue-500">ARCHITECTURE SPECIFICATION: SIEMENS / HONEYWELL COMPLIANT</span>
      </div>
    </div>
  );
};

export default SimplifiedArchitectureOverview;
