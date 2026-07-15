import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  Factory, 
  BrainCircuit, 
  ShieldAlert, 
  ClipboardCheck, 
  Settings, 
  ChevronRight,
  Info
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  active?: boolean;
  comingSoon?: boolean;
}

export const Sidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Control Room Dashboard', icon: LayoutDashboard, active: true },
    { id: 'sensors', label: 'Telemetry Sensors Array', icon: Activity, comingSoon: true },
    { id: 'plant-status', label: 'Plant Status & Equipment', icon: Factory, comingSoon: true },
    { id: 'op-context', label: 'Operational Context Intelligence', icon: BrainCircuit, comingSoon: true },
    { id: 'risk-intel', label: 'Compound Risk Intelligence', icon: ShieldAlert, comingSoon: true },
    { id: 'recommendations', label: 'Action & Recommendations', icon: ClipboardCheck, comingSoon: true },
    { id: 'settings', label: 'System Settings', icon: Settings, comingSoon: true },
  ];

  return (
    <aside className="w-64 border-r border-slateBlue-800 bg-carbon-900/90 flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none">
      <div className="p-4 space-y-1">
        <div className="px-3 py-2 text-[11px] font-mono tracking-wider uppercase text-slateBlue-400 font-semibold">
          Navigation
        </div>

        <nav className="space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (!item.comingSoon) {
                    setActiveTab(item.id);
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-all group ${
                  isSelected && !item.comingSoon
                    ? 'bg-industrial-cyan/15 text-industrial-cyan border border-industrial-cyan/40 shadow-glow-safe font-semibold'
                    : item.comingSoon
                    ? 'text-slateBlue-500 hover:bg-slateBlue-900/40 cursor-default opacity-70'
                    : 'text-slateBlue-300 hover:bg-slateBlue-900/60 hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isSelected && !item.comingSoon ? 'text-industrial-cyan' : 'text-slateBlue-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.comingSoon ? (
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-slateBlue-800/80 text-slateBlue-400 border border-slateBlue-700/60">
                    Soon
                  </span>
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Telemetry Summary */}
      <div className="p-4 border-t border-slateBlue-800/80 bg-carbon-800/40">
        <div className="rounded border border-slateBlue-800/80 p-3 bg-carbon-900/60 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-slateBlue-300">
            <span className="flex items-center gap-1.5 font-semibold">
              <Info className="w-3.5 h-3.5 text-industrial-cyan" /> Phase 1 Scope
            </span>
            <span className="text-industrial-safe font-bold">Active</span>
          </div>
          <p className="text-[11px] text-slateBlue-400 font-sans leading-relaxed">
            Visualization Layer &amp; Mock Telemetry online. AI engines locked until Phase 3/4.
          </p>
          <div className="flex justify-between items-center text-[10px] font-mono text-slateBlue-500 pt-1 border-t border-slateBlue-800/40">
            <span>Gateway v1.0.4</span>
            <span>1,420 Sensors</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

