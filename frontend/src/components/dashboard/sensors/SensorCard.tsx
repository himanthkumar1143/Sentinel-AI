import React from 'react';
import type { SensorMetric } from '../../../types/industrial';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { TrendingUp, TrendingDown, Minus, Gauge, Wind, Thermometer, Droplets } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';

interface SensorCardProps {
  sensor: SensorMetric;
}

export const SensorCard: React.FC<SensorCardProps> = ({ sensor }) => {
  const getSensorIcon = (category: string) => {
    switch (category) {
      case 'gas':
        return <Wind className="w-4 h-4 text-industrial-cyan" />;
      case 'temperature':
        return <Thermometer className="w-4 h-4 text-industrial-warning" />;
      case 'pressure':
        return <Gauge className="w-4 h-4 text-industrial-safe" />;
      case 'humidity':
        return <Droplets className="w-4 h-4 text-slateBlue-400" />;
      default:
        return <Gauge className="w-4 h-4 text-industrial-cyan" />;
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'critical') return '#F43F5E';
    if (status === 'warning') return '#F59E0B';
    return '#10B981';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-3.5 h-3.5 text-industrial-warning" />;
    if (trend === 'down') return <TrendingDown className="w-3.5 h-3.5 text-industrial-safe" />;
    return <Minus className="w-3.5 h-3.5 text-slateBlue-400" />;
  };

  const chartData = sensor.history.map((val, idx) => ({
    time: `T-${(sensor.history.length - 1 - idx) * 2}m`,
    value: val
  }));

  const chartStrokeColor = getStatusColor(sensor.status);

  return (
    <Card glow={sensor.status === 'critical' ? 'critical' : sensor.status === 'warning' ? 'warning' : 'none'} className="flex flex-col justify-between">
      <CardContent className="p-5 space-y-3.5">
        {/* Header: Name & Icon */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getSensorIcon(sensor.category)}
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 truncate max-w-[170px]">
              {sensor.name}
            </span>
          </div>
          <Badge variant={sensor.status === 'critical' ? 'critical' : sensor.status === 'warning' ? 'warning' : 'safe'} className="font-mono font-bold">
            {sensor.status.toUpperCase()}
          </Badge>
        </div>

        {/* Value & Unit */}
        <div className="flex items-baseline justify-between pt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-mono font-extrabold tracking-tight text-slate-100">
              {sensor.currentValue.toFixed(1)}
            </span>
            <span className="text-sm font-mono text-slateBlue-400 font-semibold">{sensor.unit}</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-mono text-slateBlue-300 bg-carbon-900/80 px-2.5 py-1 rounded border border-slateBlue-800">
            {getTrendIcon(sensor.trend)}
            <span className="truncate max-w-[130px] font-medium">{sensor.trendLabel}</span>
          </div>
        </div>

        {/* Mini Recharts Sparkline */}
        <div className="h-16 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`grad-${sensor.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartStrokeColor} stopOpacity={0.45} />
                  <stop offset="95%" stopColor={chartStrokeColor} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-carbon-900 border border-slateBlue-700 px-2 py-1 rounded text-[10px] font-mono text-slate-200 shadow-xl">
                        <span>{payload[0].payload.time}: </span>
                        <span className="font-bold">{payload[0].value} {sensor.unit}</span>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={chartStrokeColor}
                strokeWidth={2.5}
                fillOpacity={1}
                fill={`url(#grad-${sensor.id})`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Footer Threshold Readouts */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slateBlue-400 pt-1.5 border-t border-slateBlue-800/60">
          <span>Warning: <strong className="text-slateBlue-300">{sensor.thresholds.warning} {sensor.unit}</strong></span>
          <span>Critical: <strong className="text-slateBlue-300">{sensor.thresholds.critical} {sensor.unit}</strong></span>
        </div>
      </CardContent>
    </Card>
  );
};
