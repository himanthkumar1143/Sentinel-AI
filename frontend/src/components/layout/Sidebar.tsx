import React from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  Factory, 
  BrainCircuit, 
  ClipboardCheck, 
  Settings, 
  ChevronRight,
  Info,
  Layers,
  Sliders,
  Lock
} from 'lucide-react';
import type { WorkspaceType } from './TopBar';

interface SidebarProps {
  activeWorkspace?: WorkspaceType;
  onSelectWorkspace?: (ws: WorkspaceType) => void;
}

interface NavItem {
  id: string;
  workspaceId?: WorkspaceType;
  label: string;
  icon: React.ElementType;
  active?: boolean;
  comingSoon?: boolean;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeWorkspace = 'overview',
  onSelectWorkspace
}) => {
  const navItems: NavItem[] = [
    { id: 'overview', workspaceId: 'overview', label: 'Control Room Overview', icon: LayoutDashboard },
    { id: 'operations', workspaceId: 'operations', label: 'Operations & Timeline', icon: Factory },
    { id: 'pipeline', workspaceId: 'pipeline', label: 'Pipeline Inspector', icon: Layers },
    { id: 'intelligence', workspaceId: 'intelligence', label: 'Enterprise Intelligence', icon: BrainCircuit },
    { id: 'advanced-sim', label: 'Advanced Simulation', icon: Sliders, comingSoon: true, badge: 'Phase 5' },
    { id: 'sensors', label: 'Raw Telemetry Array', icon: Activity, comingSoon: true, badge: 'Soon' },
    { id: 'recommendations', label: 'Action & Safety Rules', icon: ClipboardCheck, comingSoon: true, badge: 'Soon' },
    { id: 'settings', label: 'System Settings', icon: Settings, comingSoon: true, badge: 'Soon' }
  ];

  return (
    <aside className="w-64 border-r border-slateBlue-800 bg-carbon-900/95 flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none shadow-md">
      <div className="p-4 space-y-1">
        <div className="px-3 py-2 text-[11px] font-mono tracking-wider uppercase text-slateBlue-400 font-semibold flex items-center justify-between">
          <span>Enterprise Workspaces</span>
          <span className="w-1.5 h-1.5 rounded-full bg-industrial-cyan animate-pulse" />
        </div>

        <nav className="space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isSelected = item.workspaceId ? activeWorkspace === item.workspaceId : false;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (!item.comingSoon && item.workspaceId && onSelectWorkspace) {
                    onSelectWorkspace(item.workspaceId);
                  }
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group ${
                  isSelected
                    ? 'bg-industrial-cyan/15 text-industrial-cyan border border-industrial-cyan/40 shadow-glow-safe font-bold scale-[1.02]'
                    : item.comingSoon
                    ? 'text-slateBlue-500 hover:bg-slateBlue-900/30 cursor-default opacity-70'
                    : 'text-slateBlue-300 hover:bg-slateBlue-900/60 hover:text-slate-100 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${isSelected ? 'text-industrial-cyan' : 'text-slateBlue-400 group-hover:text-slate-200'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.comingSoon ? (
                  <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded flex items-center gap-0.5 border ${
                    item.badge === 'Phase 5'
                      ? 'bg-slateBlue-900 text-slateBlue-400 border-slateBlue-700 font-bold'
                      : 'bg-slateBlue-800/80 text-slateBlue-400 border-slateBlue-700/60'
                  }`}>
                    {item.badge === 'Phase 5' && <Lock className="w-2.5 h-2.5" />}
                    <span>{item.badge || 'Soon'}</span>
                  </span>
                ) : (
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-industrial-cyan translate-x-0.5' : 'opacity-60 group-hover:translate-x-0.5'}`} />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Telemetry Summary */}
      <div className="p-4 border-t border-slateBlue-800/80 bg-carbon-800/40">
        <div className="rounded-xl border border-slateBlue-800/80 p-3.5 bg-carbon-900/80 space-y-2.5 shadow-inner">
          <div className="flex items-center justify-between text-[11px] font-mono text-slateBlue-300">
            <span className="flex items-center gap-1.5 font-bold">
              <Info className="w-3.5 h-3.5 text-industrial-cyan" /> Phase 2 Active
            </span>
            <span className="text-industrial-safe font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-industrial-safe animate-ping" /> Online
            </span>
          </div>
          <p className="text-[11px] text-slateBlue-400 font-sans leading-relaxed">
            Data Integration Pipeline &amp; 8-Stage Architecture verified. AI engines reserved for Phase 3/4.
          </p>
          <div className="flex justify-between items-center text-[10px] font-mono text-slateBlue-500 pt-1.5 border-t border-slateBlue-800/60">
            <span>UPM Backbone v2.0</span>
            <span>1,420 Nodes</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
