import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Factory, 
  BrainCircuit, 
  ChevronRight,
  Layers,
  Sliders,
  PanelLeftClose,
  PanelLeftOpen,
  FileCheck
} from 'lucide-react';
import type { WorkspaceType } from './TopBar';

interface SidebarProps {
  activeWorkspace?: WorkspaceType;
  onSelectWorkspace?: (ws: WorkspaceType) => void;
}

interface NavItem {
  id: string;
  workspaceId: WorkspaceType;
  label: string;
  subtitle: string;
  icon: React.ElementType;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeWorkspace = 'overview',
  onSelectWorkspace
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('sentinelai_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleCollapse = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    try {
      localStorage.setItem('sentinelai_sidebar_collapsed', String(nextState));
    } catch {
      // Ignore storage errors
    }
  };

  const navItems: NavItem[] = [
    { id: 'overview', workspaceId: 'overview', label: 'Control Room Dashboard', subtitle: 'Monitor live plant operations', icon: LayoutDashboard },
    { id: 'scenario-builder', workspaceId: 'scenario-builder', label: 'Scenario Builder', subtitle: 'Configure industrial scenarios', icon: Sliders },
    { id: 'pipeline', workspaceId: 'pipeline', label: 'Pipeline Inspector', subtitle: 'Validate industrial telemetry', icon: Layers },
    { id: 'operations', workspaceId: 'operations', label: 'Operations Timeline', subtitle: 'Review operational events', icon: Factory },
    { id: 'operational-context', workspaceId: 'operational-context', label: 'Operational Context', subtitle: 'Build contextual intelligence', icon: FileCheck },
    { id: 'intelligence', workspaceId: 'intelligence', label: 'AI Safety Intelligence', subtitle: 'Analyze compound hazards', icon: BrainCircuit }
  ];

  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-72'} border-r border-slateBlue-800 bg-carbon-900/95 flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none shadow-md transition-all duration-300 z-40`}>
      <div className="p-3 space-y-1">
        {/* Header / Collapse Toggle */}
        <div className={`px-2 py-2 text-[11px] font-mono tracking-wider uppercase text-slateBlue-400 font-semibold flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && <span>Workspaces</span>}
          <button
            onClick={toggleCollapse}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            className="p-1 rounded-lg hover:bg-slateBlue-800/80 text-slateBlue-400 hover:text-industrial-cyan transition-colors"
          >
            {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeWorkspace === item.workspaceId;

            return (
              <button
                key={item.id}
                onClick={() => onSelectWorkspace?.(item.workspaceId)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2 py-3' : 'justify-between px-3.5 py-2.5'} rounded-xl transition-all duration-200 group ${
                  isSelected
                    ? 'bg-industrial-cyan/15 border border-industrial-cyan/40 shadow-glow-safe scale-[1.02]'
                    : 'hover:bg-slateBlue-900/60 border border-transparent'
                }`}
              >
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 min-w-0'}`}>
                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${isSelected ? 'text-industrial-cyan' : 'text-slateBlue-400 group-hover:text-slate-200'}`} />
                  {!isCollapsed && (
                    <div className="flex flex-col items-start min-w-0 text-left">
                      <span className={`text-[13px] font-semibold truncate ${isSelected ? 'text-industrial-cyan' : 'text-slate-200 group-hover:text-white'}`}>{item.label}</span>
                      <span className={`text-[10px] truncate w-full ${isSelected ? 'text-industrial-cyan/80' : 'text-slateBlue-400 group-hover:text-slateBlue-300'}`}>{item.subtitle}</span>
                    </div>
                  )}
                </div>

                {!isCollapsed && (
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${isSelected ? 'text-industrial-cyan translate-x-0.5' : 'text-slateBlue-500 opacity-60 group-hover:text-slateBlue-300 group-hover:translate-x-0.5'}`} />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Status Indicator (Simple non-intrusive status without Phase 2 card) */}
      <div className="p-3 border-t border-slateBlue-800/80 bg-carbon-800/40">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-2'} text-[11px] font-mono text-slateBlue-400`}>
          {!isCollapsed && <span className="font-semibold text-slateBlue-300">System Ready</span>}
          <span className="text-industrial-safe font-bold flex items-center gap-1.5" title="All Systems Nominal">
            <span className="w-2 h-2 rounded-full bg-industrial-safe animate-ping" />
            {!isCollapsed && <span>Live</span>}
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
