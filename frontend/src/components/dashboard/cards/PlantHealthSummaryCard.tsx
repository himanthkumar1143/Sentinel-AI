import React from 'react';
import type { PlantOverview, OperationalStatus } from '../../../types/industrial';
import { Users, Factory, Wrench, Shield, FileCheck, Activity, AlertOctagon, Clock } from 'lucide-react';

interface PlantHealthSummaryCardProps {
  overview: PlantOverview;
  operationalStatus: OperationalStatus;
}

export const PlantHealthSummaryCard: React.FC<PlantHealthSummaryCardProps> = React.memo(({
  overview,
  operationalStatus
}) => {
  const isCritical = overview.statusColor === 'critical';
  const isWarning = overview.statusColor === 'warning';

  const getEmergencyBadge = () => {
    if (isCritical) return { label: 'ARMED (LEVEL 4)', style: 'bg-rose-500 text-carbon-950 font-black shadow-glow-critical' };
    if (isWarning) return { label: 'STANDBY (LEVEL 2)', style: 'bg-amber-400 text-carbon-950 font-extrabold' };
    return { label: 'NORMAL (LEVEL 0)', style: 'bg-industrial-safe/20 text-industrial-safe border border-industrial-safe/40' };
  };

  const emergency = getEmergencyBadge();

  return (
    <div className={`bg-carbon-900 border border-slateBlue-800 rounded-2xl p-6 shadow-panel font-mono select-none transition-all duration-300`}>
      <div className="flex items-center justify-between border-b border-slateBlue-800/80 pb-3 mb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-industrial-steel/30 border border-slateBlue-700 flex items-center justify-center text-slate-200 shrink-0">
            <Factory className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slateBlue-400">
              PLANT OPERATIONAL HEALTH
            </span>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-100 uppercase tracking-tight">
              5-Second Plant Health Summary
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slateBlue-300">
          <span className="w-2 h-2 rounded-full bg-industrial-safe animate-pulse" />
          <span className="hidden sm:inline">All Zones Reporting</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* 1. Workers */}
        <div className="bg-carbon-950/60 border border-slateBlue-800/70 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slateBlue-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Workers</span>
            <Users className="w-3.5 h-3.5 text-industrial-cyan" />
          </div>
          <div className="mt-1.5">
            <span className="text-base sm:text-lg font-black text-slate-100">{overview.workersOnSite || operationalStatus.workersPresent || 142}</span>
            <span className="text-[10px] text-slateBlue-400 ml-1">On-Site</span>
          </div>
        </div>

        {/* 2. Production Status */}
        <div className="bg-carbon-950/60 border border-slateBlue-800/70 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slateBlue-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Production</span>
            <Activity className="w-3.5 h-3.5 text-industrial-safe" />
          </div>
          <div className="mt-1.5">
            <span className="text-sm font-extrabold text-industrial-safe">ONLINE</span>
            <span className="text-[10px] text-slateBlue-400 ml-1">(94% Load)</span>
          </div>
        </div>

        {/* 3. Maintenance Jobs */}
        <div className="bg-carbon-950/60 border border-slateBlue-800/70 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slateBlue-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Maintenance</span>
            <Wrench className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="mt-1.5">
            <span className="text-base sm:text-lg font-black text-slate-100">{overview.activeMaintenanceJobs || 3}</span>
            <span className="text-[10px] text-slateBlue-400 ml-1">Active Jobs</span>
          </div>
        </div>

        {/* 4. Safety Officers */}
        <div className="bg-carbon-950/60 border border-slateBlue-800/70 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slateBlue-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Safety Officers</span>
            <Shield className="w-3.5 h-3.5 text-industrial-cyan" />
          </div>
          <div className="mt-1.5">
            <span className="text-base sm:text-lg font-black text-slate-100">8</span>
            <span className="text-[10px] text-slateBlue-400 ml-1">On Duty</span>
          </div>
        </div>

        {/* 5. Permits */}
        <div className="bg-carbon-950/60 border border-slateBlue-800/70 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slateBlue-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Permits</span>
            <FileCheck className="w-3.5 h-3.5 text-slateBlue-300" />
          </div>
          <div className="mt-1.5 truncate" title={operationalStatus.permitStatus || 'Hot Work LOTO Active'}>
            <span className="text-xs font-extrabold text-slate-200 truncate">{operationalStatus.permitStatus || 'Active LOTO'}</span>
          </div>
        </div>

        {/* 6. Equipment Health */}
        <div className="bg-carbon-950/60 border border-slateBlue-800/70 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slateBlue-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Equip Health</span>
            <Activity className="w-3.5 h-3.5 text-industrial-safe" />
          </div>
          <div className="mt-1.5">
            <span className="text-base sm:text-lg font-black text-industrial-safe">{operationalStatus.equipmentOperationalPct || 98.2}%</span>
          </div>
        </div>

        {/* 7. Emergency Status */}
        <div className="bg-carbon-950/60 border border-slateBlue-800/70 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slateBlue-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Emergency</span>
            <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="mt-1.5">
            <span className={`text-[11px] px-1.5 py-0.5 rounded ${emergency.style} truncate block text-center font-bold`}>
              {emergency.label}
            </span>
          </div>
        </div>

        {/* 8. Current Shift */}
        <div className="bg-carbon-950/60 border border-slateBlue-800/70 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slateBlue-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Shift</span>
            <Clock className="w-3.5 h-3.5 text-slateBlue-400" />
          </div>
          <div className="mt-1.5 truncate" title={operationalStatus.currentShift || 'Day Shift A (06:00-18:00)'}>
            <span className="text-xs font-extrabold text-slate-200 truncate">{operationalStatus.currentShift || 'Day Shift A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

PlantHealthSummaryCard.displayName = 'PlantHealthSummaryCard';
