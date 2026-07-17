import React from 'react';
import { ShieldAlert, Activity, Wrench, CloudRain, Flame } from 'lucide-react';
import type { OperationalContextPayload } from './ContextTypes';

interface DomainStatisticsGridProps {
  context: OperationalContextPayload;
  selectedDomain: string;
  onSelectDomain: (domain: string) => void;
}

export const DomainStatisticsGrid: React.FC<DomainStatisticsGridProps> = ({
  context,
  selectedDomain,
  onSelectDomain
}) => {
  const observations = context?.generatedObservations || [];
  const rawStats = context?.domainStats || (context as any)?.ruleDistribution || {};

  const getCount = (key: string, categoryName: string) => {
    if (rawStats && typeof rawStats === 'object') {
      if ((rawStats as any)[`${key}Count`] !== undefined) return Number((rawStats as any)[`${key}Count`]);
      if ((rawStats as any)[`${key === 'operations' ? 'operational' : key}Rules`] !== undefined) return Number((rawStats as any)[`${key === 'operations' ? 'operational' : key}Rules`]);
    }
    return observations.filter(o => o.category === categoryName).length;
  };

  const domainStats = {
    safetyCount: getCount('safety', 'Safety'),
    operationsCount: getCount('operations', 'Operations'),
    maintenanceCount: getCount('maintenance', 'Maintenance'),
    environmentalCount: getCount('environmental', 'Environmental'),
    compoundCount: getCount('compound', 'Compound')
  };

  const domains = [
    {
      id: 'all',
      title: 'All Domains',
      count: observations.length,
      icon: <Activity className="w-4 h-4 text-industrial-cyan" />,
      color: 'border-industrial-cyan text-industrial-cyan bg-industrial-cyan/10'
    },
    {
      id: 'Safety',
      title: 'Safety Domain',
      count: domainStats.safetyCount,
      icon: <ShieldAlert className="w-4 h-4 text-industrial-critical" />,
      color: 'border-industrial-critical text-industrial-critical bg-industrial-critical/10'
    },
    {
      id: 'Operations',
      title: 'Operations Domain',
      count: domainStats.operationsCount,
      icon: <Activity className="w-4 h-4 text-industrial-safe" />,
      color: 'border-industrial-safe text-industrial-safe bg-industrial-safe/10'
    },
    {
      id: 'Maintenance',
      title: 'Maintenance Domain',
      count: domainStats.maintenanceCount,
      icon: <Wrench className="w-4 h-4 text-industrial-warning" />,
      color: 'border-industrial-warning text-industrial-warning bg-industrial-warning/10'
    },
    {
      id: 'Environmental',
      title: 'Environmental Domain',
      count: domainStats.environmentalCount,
      icon: <CloudRain className="w-4 h-4 text-industrial-steel" />,
      color: 'border-industrial-steel text-industrial-steel bg-industrial-steel/10'
    },
    {
      id: 'Compound',
      title: 'Compound Intelligence',
      count: domainStats.compoundCount,
      icon: <Flame className="w-4 h-4 text-amber-400" />,
      color: 'border-amber-400 text-amber-400 bg-amber-400/10'
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-mono text-slateBlue-400 px-1">
        <span className="font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
          <span>● MULTI-DOMAIN OBSERVATION BREAKDOWN (PART 13)</span>
        </span>
        <span>Click domain tile to filter active observation cards</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {domains.map((dom) => {
          const isSelected = selectedDomain === dom.id;
          return (
            <button
              key={dom.id}
              onClick={() => onSelectDomain(dom.id)}
              className={`text-left p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between space-y-2 group ${
                isSelected
                  ? `${dom.color} shadow-lg scale-[1.02] font-semibold`
                  : 'bg-carbon-900/80 border-slateBlue-800 hover:border-slateBlue-600 text-slateBlue-300 hover:bg-carbon-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wide font-bold line-clamp-1">
                  {dom.title}
                </span>
                <div className={`p-1.5 rounded-lg border ${isSelected ? dom.color : 'bg-carbon-950 border-slateBlue-800'}`}>
                  {dom.icon}
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-mono font-black text-slate-100 group-hover:text-cyan-200 transition-colors">
                  {dom.count}
                </span>
                <span className="text-[10px] font-mono text-slateBlue-400 uppercase">
                  {dom.id === 'all' ? 'Total' : 'Alerts'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
