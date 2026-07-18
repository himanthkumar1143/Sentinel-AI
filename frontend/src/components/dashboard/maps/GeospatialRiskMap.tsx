import React, { useState } from 'react';
import type { PlantZone } from '../../../types/industrial';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { MapPin, ShieldAlert, Cpu, Users, Thermometer, Gauge, Wind, CheckCircle2, AlertTriangle, Flame } from 'lucide-react';

interface GeospatialRiskMapProps {
  zones: PlantZone[];
}

export const GeospatialRiskMap: React.FC<GeospatialRiskMapProps> = ({ zones }) => {
  const [selectedZoneId, setSelectedZoneId] = useState<string>(zones[0]?.id || 'zone-a');

  const selectedZone = zones.find((z) => z.id === selectedZoneId) || zones[0];

  const getZoneBorderColor = (status: string) => {
    if (status === 'critical') return 'border-industrial-critical bg-industrial-critical/15 shadow-glow-critical animate-pulse';
    if (status === 'warning') return 'border-industrial-warning bg-industrial-warning/15 shadow-glow-warning';
    if (status === 'maintenance') return 'border-slateBlue-500 bg-slateBlue-800/40';
    return 'border-industrial-safe/40 bg-carbon-800/90 hover:border-industrial-safe';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'critical') return <Flame className="w-4 h-4 text-industrial-critical animate-bounce" />;
    if (status === 'warning') return <AlertTriangle className="w-4 h-4 text-industrial-warning" />;
    return <CheckCircle2 className="w-4 h-4 text-industrial-safe" />;
  };

  const getRiskColorClass = (risk: number) => {
    if (risk >= 85) return 'text-industrial-critical font-bold';
    if (risk >= 65) return 'text-industrial-warning font-bold';
    return 'text-industrial-safe font-semibold';
  };

  // Map zone layout into specific grid positions for realistic schematic feel
  const zoneGridSpan: Record<string, string> = {
    'zone-a': 'col-span-1 row-span-1',
    'zone-b': 'col-span-1 row-span-1',
    'zone-c': 'col-span-1 row-span-1',
    'zone-tank': 'col-span-1 sm:col-span-2 row-span-1',
    'zone-comp': 'col-span-1 row-span-1',
    'zone-react': 'col-span-1 sm:col-span-2 row-span-1',
    'zone-maint': 'col-span-1 row-span-1',
    'zone-work': 'col-span-1 sm:col-span-2 row-span-1'
  };

  return (
    <Card className="p-6 space-y-5 border-slateBlue-800/90 shadow-panel">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slateBlue-800 pb-3.5">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-industrial-cyan" />
          <span className="text-base font-semibold tracking-wide text-slate-100">
            Risk Map
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-slateBlue-300">
            <span className="w-2.5 h-2.5 rounded-full bg-industrial-safe inline-block shadow-glow-safe" /> Safe (&lt;35)
          </span>
          <span className="flex items-center gap-1.5 text-slateBlue-300">
            <span className="w-2.5 h-2.5 rounded-full bg-industrial-warning inline-block shadow-glow-warning" /> Warning (65)
          </span>
          <span className="flex items-center gap-1.5 text-slateBlue-300">
            <span className="w-2.5 h-2.5 rounded-full bg-industrial-critical inline-block animate-ping shadow-glow-critical" /> Critical (&gt;85)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* 2D Floor Plan Grid (Left / 8 Cols) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slateBlue-400 bg-carbon-900 px-3.5 py-2 rounded border border-slateBlue-800">
            <span className="font-semibold text-slate-300">Plant schematic grid</span>
            <span className="text-industrial-cyan font-semibold">Select zone to inspect</span>
          </div>

          <div className="grid grid-flow-dense grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-grid-pattern p-3 sm:p-4 rounded-xl border border-slateBlue-800/90 bg-carbon-900/70">
            {zones.map((zone) => {
              const isSelected = zone.id === selectedZoneId;
              return (
                <div
                  key={zone.id}
                  onClick={() => setSelectedZoneId(zone.id)}
                  className={`p-3 sm:p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    zoneGridSpan[zone.id] || 'col-span-1'
                  } ${getZoneBorderColor(zone.status)} ${
                    isSelected ? 'ring-2 ring-industrial-cyan shadow-xl scale-[1.01] border-industrial-cyan' : 'opacity-95 hover:opacity-100'
                  }`}
                >
                  {/* Zone Header */}
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-slateBlue-400 font-bold uppercase block">
                        [{zone.code}]
                      </span>
                      <h4 className="text-xs sm:text-sm font-mono font-extrabold text-slate-100 uppercase tracking-tight mt-1">
                        {zone.name}
                      </h4>
                    </div>
                    {getStatusIcon(zone.status)}
                  </div>

                  {/* Zone Telemetry Summary */}
                  <div className="mt-4 pt-2.5 border-t border-slateBlue-800/60 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slateBlue-400">Risk Index:</span>
                      <span className={getRiskColorClass(zone.riskIndex)}>
                        {zone.riskIndex} / 100
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slateBlue-400">State:</span>
                      <Badge
                        variant={
                          zone.equipmentState === 'Operational'
                            ? 'safe'
                            : zone.equipmentState === 'Degraded'
                            ? 'warning'
                            : 'critical'
                        }
                        className="font-mono text-[10px]"
                      >
                        {zone.equipmentState}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-slateBlue-400 pt-0.5">
                      <span className="flex items-center gap-1.5 font-medium text-slate-300">
                        <Users className="w-3.5 h-3.5 text-industrial-cyan" /> {zone.workersCount} Workers
                      </span>
                      <span className="uppercase text-[9px] px-1.5 py-0.5 rounded bg-slateBlue-900 text-slateBlue-300 border border-slateBlue-800 font-semibold">
                        {zone.type}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Zone Inspector Panel (Right / 4 Cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between rounded-xl border border-slateBlue-800 bg-carbon-900/90 p-5 space-y-5 shadow-panel">
          <div>
            <div className="flex items-center justify-between border-b border-slateBlue-800/80 pb-3">
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-industrial-cyan flex items-center gap-2">
                <Cpu className="w-4 h-4" /> Zone Details
              </span>
              <Badge variant={selectedZone.status === 'critical' ? 'critical' : selectedZone.status === 'warning' ? 'warning' : 'safe'} className="font-mono font-bold">
                {selectedZone.status.toUpperCase()}
              </Badge>
            </div>

            <div className="mt-4 space-y-1.5">
              <span className="text-xs font-mono text-slateBlue-500 font-semibold tracking-wider">
                Selected target:
              </span>
              <h3 className="text-base font-mono font-extrabold text-slate-100 uppercase">
                {selectedZone.name} ({selectedZone.code})
              </h3>
              <p className="text-xs sm:text-sm text-slateBlue-300 font-sans leading-relaxed pt-1">
                {selectedZone.details}
              </p>
            </div>

            {/* Diagnostic Metrics Matrix */}
            <div className="grid grid-cols-2 gap-3 mt-5">
              <div className="bg-carbon-800/80 p-3 rounded-lg border border-slateBlue-800">
                <span className="text-[11px] font-mono text-slateBlue-400 block flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-industrial-cyan" /> Risk index
                </span>
                <span className={`text-2xl font-mono font-extrabold pt-1 block ${getRiskColorClass(selectedZone.riskIndex)}`}>
                  {selectedZone.riskIndex} <span className="text-xs font-normal text-slateBlue-500">/ 100</span>
                </span>
              </div>

              <div className="bg-carbon-800/80 p-3 rounded-lg border border-slateBlue-800">
                <span className="text-[11px] font-mono text-slateBlue-400 block flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-industrial-cyan" /> Personnel
                </span>
                <span className="text-2xl font-mono font-extrabold pt-1 block text-slate-100">
                  {selectedZone.workersCount} <span className="text-xs font-normal text-slateBlue-500">Active</span>
                </span>
              </div>

              {selectedZone.temperature !== undefined && (
                <div className="bg-carbon-800/80 p-3 rounded-lg border border-slateBlue-800">
                  <span className="text-[11px] font-mono text-slateBlue-400 block flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-industrial-warning" /> Thermal
                  </span>
                  <span className="text-lg font-mono font-extrabold pt-1 block text-slate-100">
                    {selectedZone.temperature.toFixed(1)} °C
                  </span>
                </div>
              )}

              {selectedZone.pressure !== undefined && (
                <div className="bg-carbon-800/80 p-3 rounded-lg border border-slateBlue-800">
                  <span className="text-[11px] font-mono text-slateBlue-400 block flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-industrial-safe" /> Pressure
                  </span>
                  <span className="text-lg font-mono font-extrabold pt-1 block text-slate-100">
                    {selectedZone.pressure.toFixed(1)} Bar
                  </span>
                </div>
              )}

              {selectedZone.gasConcentration !== undefined && (
                <div className="col-span-2 bg-carbon-800/80 p-3.5 rounded-lg border border-slateBlue-800 flex items-center justify-between">
                  <span className="text-xs font-mono text-slateBlue-400 flex items-center gap-1.5">
                    <Wind className="w-4 h-4 text-industrial-cyan" /> Gas concentration (H₂S / VOC)
                  </span>
                  <span className={`text-lg font-mono font-extrabold ${selectedZone.gasConcentration > 10 ? 'text-industrial-critical' : 'text-slate-100'}`}>
                    {selectedZone.gasConcentration.toFixed(1)} PPM
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slateBlue-800/80 bg-carbon-800/40 -mx-5 -mb-5 p-3.5 rounded-b-xl">
            <div className="flex items-center justify-between text-xs font-mono text-slateBlue-400">
              <span>Future integration:</span>
              <span className="text-industrial-cyan font-semibold">AI Geospatial Engine (Stage 4)</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

