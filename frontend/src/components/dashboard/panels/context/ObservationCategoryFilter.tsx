import React from 'react';
import { Filter, ShieldAlert, Activity, Wrench, CloudRain, Flame, Layers } from 'lucide-react';

interface ObservationCategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  counts: Record<string, number>;
}

export const ObservationCategoryFilter: React.FC<ObservationCategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  counts
}) => {
  const categories = [
    { id: 'all', label: 'All Observations', icon: <Layers className="w-3.5 h-3.5" />, count: counts['all'] || 0 },
    { id: 'Safety', label: 'Safety Proximity', icon: <ShieldAlert className="w-3.5 h-3.5 text-industrial-critical" />, count: counts['Safety'] || 0 },
    { id: 'Operations', label: 'Operations & Shift', icon: <Activity className="w-3.5 h-3.5 text-industrial-safe" />, count: counts['Operations'] || 0 },
    { id: 'Maintenance', label: 'SAP Maintenance', icon: <Wrench className="w-3.5 h-3.5 text-industrial-warning" />, count: counts['Maintenance'] || 0 },
    { id: 'Environmental', label: 'Environmental Conditions', icon: <CloudRain className="w-3.5 h-3.5 text-industrial-steel" />, count: counts['Environmental'] || 0 },
    { id: 'Compound', label: 'Compound & Multi-Domain', icon: <Flame className="w-3.5 h-3.5 text-amber-400" />, count: counts['Compound'] || 0 }
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 border-y border-slateBlue-800/80 py-3 px-1">
      <div className="flex items-center gap-1.5 text-xs font-mono text-slateBlue-400 mr-2">
        <Filter className="w-3.5 h-3.5 text-industrial-cyan" />
        <span className="uppercase font-semibold">Filter Hierarchy:</span>
      </div>
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              isSelected
                ? 'bg-industrial-cyan/20 border border-industrial-cyan text-industrial-cyan shadow-sm'
                : 'bg-carbon-900 border border-slateBlue-800 text-slateBlue-300 hover:border-slateBlue-600 hover:text-slate-100'
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] ${isSelected ? 'bg-industrial-cyan text-carbon-950' : 'bg-carbon-950 text-slateBlue-400'}`}>
              {cat.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
