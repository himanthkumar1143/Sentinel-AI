import React from 'react';
import type { SensorMetric } from '../../../types/industrial';
import { SensorCard } from './SensorCard';
import { Activity } from 'lucide-react';

interface LiveSensorMonitoringProps {
  sensors: SensorMetric[];
}

export const LiveSensorMonitoring: React.FC<LiveSensorMonitoringProps> = ({ sensors }) => {
  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between text-base font-semibold tracking-wide text-slate-100 border-b border-slateBlue-800 pb-2.5">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-industrial-cyan" />
          <span>Live Sensors</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slateBlue-300">
          <span className="w-2 h-2 rounded-full bg-industrial-safe animate-ping" />
          <span>All sensors online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {sensors.map((sensor) => (
          <SensorCard key={sensor.id} sensor={sensor} />
        ))}
      </div>
    </div>
  );
};
