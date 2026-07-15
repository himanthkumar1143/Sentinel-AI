import React from 'react';
import { Radio, ShieldAlert } from 'lucide-react';

interface RadarScannerProps {
  scenario?: string;
  statusText?: string;
  isProcessing?: boolean;
  isFinishing?: boolean;
}

export const RadarScanner: React.FC<RadarScannerProps> = ({
  scenario = 'normal',
  statusText = 'Acquiring Industrial Telemetry...',
  isProcessing = true,
  isFinishing = false
}) => {
  const getThemeColor = () => {
    if (scenario === 'critical') return 'text-industrial-critical border-industrial-critical/40 bg-industrial-critical/5 shadow-[0_0_30px_rgba(244,63,94,0.3)]';
    if (scenario === 'warning') return 'text-industrial-warning border-industrial-warning/40 bg-industrial-warning/5 shadow-[0_0_30px_rgba(245,158,11,0.3)]';
    return 'text-industrial-cyan border-industrial-cyan/40 bg-industrial-cyan/5 shadow-[0_0_30px_rgba(6,182,212,0.3)]';
  };

  const getSweepColor = () => {
    if (scenario === 'critical') return 'from-industrial-critical/40 to-transparent';
    if (scenario === 'warning') return 'from-industrial-warning/40 to-transparent';
    return 'from-industrial-cyan/40 to-transparent';
  };

  const getBlipColor = () => {
    if (scenario === 'critical') return 'bg-industrial-critical shadow-[0_0_8px_#f43f5e]';
    if (scenario === 'warning') return 'bg-industrial-warning shadow-[0_0_8px_#f59e0b]';
    return 'bg-industrial-cyan shadow-[0_0_8px_#06b6d4]';
  };

  return (
    <div className={`flex flex-col items-center justify-center p-6 bg-carbon-950/95 border border-slateBlue-800 rounded-2xl relative overflow-hidden backdrop-blur-md transition-all duration-500 ${
      isFinishing ? 'opacity-80 scale-95' : 'animate-in fade-in zoom-in-95 duration-300'
    }`}>
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      {/* Header status */}
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-8 h-8 rounded-lg bg-carbon-800 border border-slateBlue-700 flex items-center justify-center">
          <Radio className={`w-4 h-4 animate-ping ${
            scenario === 'critical' ? 'text-industrial-critical' : scenario === 'warning' ? 'text-industrial-warning' : 'text-industrial-cyan'
          }`} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-mono font-bold text-slate-100 tracking-wider uppercase flex items-center gap-2">
            <span>Active Telemetry Sweep</span>
            {isFinishing && <span className="text-[10px] text-industrial-safe font-normal animate-pulse">(Finalizing...)</span>}
          </span>
          <span className={`text-[11px] font-mono tracking-wide ${
            scenario === 'critical' ? 'text-industrial-critical' : scenario === 'warning' ? 'text-industrial-warning' : 'text-industrial-cyan animate-pulse'
          }`}>
            {statusText}
          </span>
        </div>
      </div>

      {/* Circular Rotating Scanner */}
      <div className={`w-56 h-56 rounded-full border-2 relative flex items-center justify-center transition-all duration-700 ${getThemeColor()} ${
        isProcessing && !isFinishing ? 'scale-105 shadow-[0_0_40px_rgba(6,182,212,0.4)]' : ''
      }`}>
        {/* Concentric Circles with pulsing (PART 8) */}
        <div className={`absolute w-40 h-40 rounded-full border border-current/30 ${isProcessing && !isFinishing ? 'animate-[pulse_1.5s_ease-in-out_infinite]' : ''}`} />
        <div className={`absolute w-24 h-24 rounded-full border border-current/30 ${isProcessing && !isFinishing ? 'animate-[pulse_1.2s_ease-in-out_infinite]' : ''}`} />
        <div className="absolute w-8 h-8 rounded-full border border-current/50 bg-current/10" />

        {/* Crosshair lines */}
        <div className="absolute inset-x-0 top-1/2 h-px bg-current/30" />
        <div className="absolute inset-y-0 left-1/2 w-px bg-current/30" />

        {/* Diagonal lines */}
        <div className="absolute inset-0 rounded-full border border-current/10 rotate-45" style={{ backgroundImage: 'linear-gradient(45deg, transparent 49.5%, currentColor 49.5%, currentColor 50.5%, transparent 50.5%)' }} />
        <div className="absolute inset-0 rounded-full border border-current/10 -rotate-45" style={{ backgroundImage: 'linear-gradient(-45deg, transparent 49.5%, currentColor 49.5%, currentColor 50.5%, transparent 50.5%)' }} />

        {/* Rotating Sweep Beam (PART 8: accelerates during processing, slows when finishing) */}
        <div className={`absolute inset-0 rounded-full pointer-events-none overflow-hidden ${
          isFinishing ? 'animate-[spin_3s_linear_infinite]' : isProcessing ? 'animate-[spin_1.2s_linear_infinite]' : 'animate-[spin_2s_linear_infinite]'
        }`}>
          <div className={`w-1/2 h-1/2 bg-gradient-to-br ${getSweepColor()} origin-bottom-right rounded-tl-full`} />
        </div>

        {/* Radar Blips (Edge sensors reporting) */}
        <div className={`absolute top-10 left-16 w-2 h-2 rounded-full animate-ping ${getBlipColor()}`} style={{ animationDelay: '200ms' }} />
        <div className={`absolute bottom-12 right-14 w-2 h-2 rounded-full animate-ping ${getBlipColor()}`} style={{ animationDelay: '800ms' }} />
        <div className={`absolute top-20 right-16 w-2.5 h-2.5 rounded-full animate-ping ${getBlipColor()}`} style={{ animationDelay: '1400ms' }} />
        <div className={`absolute bottom-16 left-20 w-1.5 h-1.5 rounded-full animate-ping ${getBlipColor()}`} style={{ animationDelay: '1800ms' }} />

        {/* Center Target Icon */}
        <ShieldAlert className="w-4 h-4 opacity-70 relative z-10" />
      </div>

      {/* Footer Readout */}
      <div className="mt-6 flex items-center justify-between w-full max-w-xs text-[10px] font-mono text-slateBlue-400 border-t border-slateBlue-800/80 pt-3">
        <span>FREQUENCY: 5.8 GHz</span>
        <span className="text-slate-200">SECTOR ARRAY: 8 ZONES</span>
      </div>
    </div>
  );
};

export default RadarScanner;
