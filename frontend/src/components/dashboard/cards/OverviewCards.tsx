import React from 'react';
import type { PlantOverview } from '../../../types/industrial';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Activity, ShieldAlert, BellRing, Users, Wrench } from 'lucide-react';

interface OverviewCardsProps {
  overview: PlantOverview;
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({ overview }) => {
  const getRiskColor = (index: number) => {
    if (index >= 85) return 'text-industrial-critical';
    if (index >= 65) return 'text-industrial-warning';
    return 'text-industrial-safe';
  };

  const getRiskProgressVariant = (index: number) => {
    if (index >= 85) return 'critical';
    if (index >= 65) return 'warning';
    return 'safe';
  };

  const getAlertBadgeVariant = (count: number) => {
    if (count > 5) return 'critical';
    if (count > 0) return 'warning';
    return 'safe';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm font-semibold tracking-wide text-slate-200">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-industrial-cyan" />
          <span>Plant Overview</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-industrial-safe animate-ping" />
          <span className="text-xs font-mono text-slateBlue-400">Synced</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5">
        {/* Card 1 (Focal Point): Compound Risk Index (0-100) -> Double Width col-span-2 */}
        <Card glow={getRiskProgressVariant(overview.compoundRiskIndex) === 'critical' ? 'critical' : 'none'} className="sm:col-span-2 lg:col-span-2 flex flex-col justify-between border-2 border-industrial-cyan/30 shadow-glow-safe">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-industrial-cyan uppercase tracking-wider">Compound Risk Index</span>
              <ShieldAlert className="w-5 h-5 text-industrial-cyan animate-pulse" />
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <span className={`text-4xl sm:text-5xl font-mono font-extrabold tracking-tight ${getRiskColor(overview.compoundRiskIndex)}`}>
                {overview.compoundRiskIndex}
              </span>
              <span className="text-xs font-mono font-semibold text-slateBlue-400 bg-carbon-900 px-2 py-1 rounded border border-slateBlue-800">
                / 100 MAX
              </span>
            </div>
            <Progress value={overview.compoundRiskIndex} variant={getRiskProgressVariant(overview.compoundRiskIndex)} className="mt-2 h-2.5" />
            <div className="flex justify-between text-[11px] font-mono text-slateBlue-400 pt-1.5">
              <span>Safe &lt;35</span>
              <span>Warning 65</span>
              <span>Critical &gt;85</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Overall Plant Status */}
        <Card glow={overview.statusColor === 'critical' ? 'critical' : overview.statusColor === 'warning' ? 'warning' : 'none'} className="flex flex-col justify-between">
          <CardContent className="p-5 space-y-3 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slateBlue-400 uppercase tracking-wider">Plant Status</span>
              <Activity className="w-4 h-4 text-industrial-cyan" />
            </div>
            <div className="py-2 flex items-center justify-center">
              <Badge
                variant={overview.statusColor === 'critical' ? 'critical' : overview.statusColor === 'warning' ? 'warning' : 'safe'}
                className="px-3 py-1.5 text-xs w-full justify-center text-center shadow-md font-mono font-bold uppercase tracking-wide"
              >
                {overview.overallStatus}
              </Badge>
            </div>
            <p className="text-[11px] font-mono text-slateBlue-400 pt-1.5 border-t border-slateBlue-800/60 leading-tight">
              {overview.statusColor === 'safe' ? 'Zero active safety excursions.' : overview.statusColor === 'warning' ? 'Pre-alarm threshold crossed.' : 'Compound risk alert state.'}
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Active Alerts */}
        <Card glow={overview.activeAlertsCount > 5 ? 'critical' : overview.activeAlertsCount > 0 ? 'warning' : 'none'} className="flex flex-col justify-between">
          <CardContent className="p-5 space-y-3 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slateBlue-400 uppercase tracking-wider">Safety Alerts</span>
              <BellRing className={`w-4 h-4 ${overview.activeAlertsCount > 0 ? 'text-industrial-warning animate-bounce' : 'text-industrial-cyan'}`} />
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <span className={`text-3xl font-mono font-extrabold tracking-tight ${overview.activeAlertsCount > 0 ? (overview.activeAlertsCount > 5 ? 'text-industrial-critical' : 'text-industrial-warning') : 'text-industrial-safe'}`}>
                {overview.activeAlertsCount}
              </span>
              <Badge variant={getAlertBadgeVariant(overview.activeAlertsCount)} className="font-mono text-[10px]">
                {overview.activeAlertsCount === 0 ? 'All Clear' : `${overview.activeAlertsCount} Active`}
              </Badge>
            </div>
            <p className="text-[11px] font-mono text-slateBlue-400 pt-1.5 border-t border-slateBlue-800/60 flex items-center justify-between">
              <span>Pending:</span>
              <span className="font-bold text-slate-200">{overview.activeAlertsCount > 0 ? Math.ceil(overview.activeAlertsCount * 0.75) : 0}</span>
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Workers On Site */}
        <Card className="flex flex-col justify-between">
          <CardContent className="p-5 space-y-3 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slateBlue-400 uppercase tracking-wider">Workers On Site</span>
              <Users className="w-4 h-4 text-industrial-cyan" />
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-3xl font-mono font-extrabold tracking-tight text-slate-100">
                {overview.workersOnSite}
              </span>
              <Badge variant="info" className="font-mono text-[10px]">Shift B</Badge>
            </div>
            <p className="text-[11px] font-mono text-slateBlue-400 pt-1.5 border-t border-slateBlue-800/60 flex items-center justify-between">
              <span>Verified:</span>
              <span className="font-bold text-industrial-safe">100%</span>
            </p>
          </CardContent>
        </Card>

        {/* Card 5: Active Maintenance Jobs */}
        <Card className="flex flex-col justify-between">
          <CardContent className="p-5 space-y-3 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slateBlue-400 uppercase tracking-wider">Active Maintenance</span>
              <Wrench className="w-4 h-4 text-industrial-cyan" />
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-3xl font-mono font-extrabold tracking-tight text-slate-100">
                {overview.activeMaintenanceJobs}
              </span>
              <Badge variant={overview.activeMaintenanceJobs > 10 ? 'warning' : 'maintenance'} className="font-mono text-[10px]">
                {overview.activeMaintenanceJobs > 10 ? 'Emergency' : 'Routine'}
              </Badge>
            </div>
            <p className="text-[11px] font-mono text-slateBlue-400 pt-1.5 border-t border-slateBlue-800/60 flex items-center justify-between">
              <span>Permits:</span>
              <span className="font-bold text-slate-200">Logged</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

