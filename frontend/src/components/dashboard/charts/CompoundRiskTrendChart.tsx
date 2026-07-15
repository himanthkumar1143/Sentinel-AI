import React from 'react';
import type { RiskTrendPoint } from '../../../types/industrial';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Activity, TrendingUp, ShieldAlert } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from 'recharts';

interface CompoundRiskTrendChartProps {
  data: RiskTrendPoint[];
}

export const CompoundRiskTrendChart: React.FC<CompoundRiskTrendChartProps> = ({ data }) => {
  // Determine if max value touches critical
  const maxRisk = Math.max(...data.map((d) => d.riskIndex));
  const glowType = maxRisk >= 85 ? 'critical' : maxRisk >= 65 ? 'warning' : 'none';

  return (
    <Card glow={glowType} className="p-6 space-y-5 border-slateBlue-800/90 shadow-panel">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slateBlue-800 pb-3.5">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-industrial-cyan" />
          <span className="text-base font-semibold tracking-wide text-slate-100">
            Risk Trend
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="font-mono text-xs flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-industrial-cyan" /> 24h index vs thresholds
          </Badge>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-[280px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.6} />
            <XAxis
              dataKey="time"
              stroke="#64748B"
              fontSize={11}
              fontFamily="JetBrains Mono, monospace"
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              stroke="#64748B"
              fontSize={11}
              fontFamily="JetBrains Mono, monospace"
              tickLine={false}
              unit="/100"
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const val = payload[0].value as number;
                  return (
                    <div className="bg-carbon-900 border border-slateBlue-700 p-2.5 rounded shadow-xl text-xs font-mono">
                      <div className="text-slateBlue-400 border-b border-slateBlue-800 pb-1 mb-1.5 flex items-center justify-between gap-4">
                        <span>Time: <strong className="text-slate-200">{label}</strong></span>
                        <ShieldAlert className="w-3.5 h-3.5 text-industrial-cyan" />
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-slate-200">Compound Risk Index:</span>
                        <span className={`font-extrabold ${val >= 85 ? 'text-industrial-critical' : val >= 65 ? 'text-industrial-warning' : 'text-industrial-safe'}`}>
                          {val} / 100
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Threshold Reference Lines */}
            <ReferenceLine
              y={35}
              stroke="#10B981"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: 'Safety (35)',
                position: 'insideRight',
                fill: '#10B981',
                fontSize: 10,
                fontFamily: 'JetBrains Mono, monospace'
              }}
            />
            <ReferenceLine
              y={65}
              stroke="#F59E0B"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: 'Warning (65)',
                position: 'insideRight',
                fill: '#F59E0B',
                fontSize: 10,
                fontFamily: 'JetBrains Mono, monospace'
              }}
            />
            <ReferenceLine
              y={85}
              stroke="#F43F5E"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: 'Critical (85)',
                position: 'insideRight',
                fill: '#F43F5E',
                fontSize: 10,
                fontFamily: 'JetBrains Mono, monospace'
              }}
            />

            {/* Main Area Series */}
            <Area
              type="monotone"
              dataKey="riskIndex"
              stroke="#06B6D4"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#riskGrad)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slateBlue-800/60 text-[11px] font-mono text-slateBlue-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-industrial-safe font-medium">
            <span className="w-2 h-0.5 bg-industrial-safe inline-block" /> Nominal region
          </span>
          <span className="flex items-center gap-1.5 text-industrial-warning font-medium">
            <span className="w-2 h-0.5 bg-industrial-warning inline-block" /> Elevated excursion
          </span>
          <span className="flex items-center gap-1.5 text-industrial-critical font-medium">
            <span className="w-2 h-0.5 bg-industrial-critical inline-block" /> Critical action
          </span>
        </div>
        <span className="text-slateBlue-500">24-hour historical progression</span>
      </div>
    </Card>
  );
};
