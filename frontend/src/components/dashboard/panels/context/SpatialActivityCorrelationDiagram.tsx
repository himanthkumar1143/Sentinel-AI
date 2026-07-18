import React from 'react';
import { Card, CardContent } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { Share2 } from 'lucide-react';
import type { OperationalContextPayload, Observation } from './ContextTypes';

interface SpatialActivityCorrelationDiagramProps {
  context: OperationalContextPayload;
  selectedObservationId?: string | null;
  onSelectObservation?: (id: string | null) => void;
  selectedNodeId?: string | null;
  onSelectNode?: (id: string | null) => void;
  observations?: Observation[];
}

export const SpatialActivityCorrelationDiagram: React.FC<SpatialActivityCorrelationDiagramProps> = ({
  context,
  selectedObservationId = null,
  onSelectObservation,
  selectedNodeId = null,
  onSelectNode,
  observations = []
}) => {
  const { spatialCorrelations } = context;

  const nodes = spatialCorrelations && spatialCorrelations.length > 0 ? spatialCorrelations : [
    {
      nodeId: 'REACTOR-01',
      nodeName: 'Primary Synthesis Reactor Area (Zone A)',
      nodeType: 'Reactor' as const,
      status: context.scenario === 'critical' ? ('CRITICAL' as const) : context.scenario === 'warning' ? ('WARNING' as const) : ('NORMAL' as const),
      activePermits: context.scenario === 'critical' ? 4 : 2,
      activeMaintenance: context.scenario === 'critical' ? 2 : 1,
      gasConcentrationPpm: context.scenario === 'critical' ? 42.5 : context.scenario === 'warning' ? 18.2 : 1.4,
      temperatureC: context.scenario === 'critical' ? 385.2 : 312.0,
      pressureBar: context.scenario === 'critical' ? 14.8 : 10.2,
      connectedNodes: ['STORAGE-02', 'PIPING-04']
    },
    {
      nodeId: 'STORAGE-02',
      nodeName: 'Hydrocarbon Storage Manifold (Zone B)',
      nodeType: 'Storage' as const,
      status: context.scenario === 'critical' ? ('WARNING' as const) : ('NORMAL' as const),
      activePermits: 2,
      activeMaintenance: 1,
      gasConcentrationPpm: context.scenario === 'critical' ? 14.1 : 0.8,
      temperatureC: 45.0,
      pressureBar: 6.2,
      connectedNodes: ['REACTOR-01', 'UTILITY-05']
    },
    {
      nodeId: 'PIPING-04',
      nodeName: 'High-Pressure Steam & Feed Piping Network',
      nodeType: 'Piping' as const,
      status: context.scenario === 'critical' ? ('CRITICAL' as const) : ('NORMAL' as const),
      activePermits: 3,
      activeMaintenance: 2,
      gasConcentrationPpm: context.scenario === 'critical' ? 28.4 : 1.1,
      temperatureC: 220.5,
      pressureBar: 18.5,
      connectedNodes: ['REACTOR-01', 'CTRL-ROOM']
    },
    {
      nodeId: 'UTILITY-05',
      nodeName: 'Auxiliary Power & Cooling Tower Array',
      nodeType: 'Utility' as const,
      status: ('NORMAL' as const),
      activePermits: 1,
      activeMaintenance: 0,
      gasConcentrationPpm: 0.5,
      temperatureC: 32.0,
      pressureBar: 4.0,
      connectedNodes: ['STORAGE-02', 'CTRL-ROOM']
    },
    {
      nodeId: 'CTRL-ROOM',
      nodeName: 'Enterprise SCADA & Safety Command Center',
      nodeType: 'Control' as const,
      status: ('NORMAL' as const),
      activePermits: 0,
      activeMaintenance: 0,
      gasConcentrationPpm: 0.2,
      temperatureC: 22.0,
      pressureBar: 1.0,
      connectedNodes: ['REACTOR-01', 'PIPING-04', 'UTILITY-05']
    }
  ];

  const handleNodeClick = (node: any) => {
    const newSelectedNodeId = selectedNodeId === node.nodeId ? null : node.nodeId;
    if (onSelectNode) {
      onSelectNode(newSelectedNodeId);
    }
    if (newSelectedNodeId && observations && observations.length > 0) {
      const matchingObs = observations.find(obs => 
        obs.correlationNodes?.includes(newSelectedNodeId) ||
        obs.affectedZones?.some(z => z.toUpperCase().includes(newSelectedNodeId.toUpperCase()) || (newSelectedNodeId === 'REACTOR-01' && z.includes('Zone A')) || (newSelectedNodeId === 'STORAGE-02' && z.includes('Zone B')) || (newSelectedNodeId === 'PIPING-04' && z.includes('Piping'))) ||
        (newSelectedNodeId === 'REACTOR-01' && (obs.id === 'OBS-CRIT-00' || obs.id === 'OBS-CRIT-01')) ||
        (newSelectedNodeId === 'STORAGE-02' && obs.id === 'OBS-WARN-01')
      );
      if (matchingObs && onSelectObservation) {
        onSelectObservation(matchingObs.id);
        setTimeout(() => {
          const el = document.getElementById(`obs-card-${matchingObs.id}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    } else if (!newSelectedNodeId && onSelectObservation) {
      onSelectObservation(null);
    }
  };

  const isNodeHighlighted = (node: any) => {
    if (selectedNodeId === node.nodeId) return true;
    if (selectedNodeId) {
      const selected = nodes.find(n => n.nodeId === selectedNodeId);
      if (selected?.connectedNodes?.includes(node.nodeId) || node.connectedNodes?.includes(selectedNodeId)) return true;
    }
    if (selectedObservationId && observations) {
      const activeObs = observations.find(o => o.id === selectedObservationId);
      if (activeObs) {
        if (activeObs.correlationNodes?.includes(node.nodeId)) return true;
        if (activeObs.correlationNodes?.some(cn => cn.toUpperCase().includes(node.nodeType.toUpperCase()) || node.nodeName.toUpperCase().includes(cn.toUpperCase()) || node.nodeId.toUpperCase().includes(cn.toUpperCase()))) return true;
        if (activeObs.affectedZones?.some(z => z.toUpperCase().includes(node.nodeType.toUpperCase()) || node.nodeName.toUpperCase().includes(z.toUpperCase()) || (z.includes('Zone A') && node.nodeId === 'REACTOR-01') || (z.includes('Zone B') && node.nodeId === 'STORAGE-02') || (z.includes('Piping') && node.nodeId === 'PIPING-04'))) return true;
        if ((activeObs.id === 'OBS-CRIT-00' || activeObs.id === 'OBS-CRIT-01') && (node.nodeId === 'REACTOR-01' || node.nodeId === 'STORAGE-02' || node.nodeId === 'PIPING-04')) return true;
        if (activeObs.id === 'OBS-WARN-01' && (node.nodeId === 'STORAGE-02' || node.nodeId === 'UTILITY-05')) return true;
      }
    }
    return false;
  };

  return (
    <Card className="bg-carbon-900/80 border-slateBlue-800 backdrop-blur-md shadow-panel relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />
      <CardContent className="p-5 sm:p-6 space-y-5 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slateBlue-800/80 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-industrial-cyan animate-pulse" />
              <h3 className="text-base font-mono font-extrabold text-slate-100 uppercase tracking-wide">
                Area Relationships
              </h3>
            </div>
            <p className="text-xs font-mono text-slateBlue-400">
              Real-time cross-referencing of active high-risk work permits against equipment maintenance arrays across physical plant zones.
            </p>
          </div>
          <Badge variant="outline" className="border-industrial-cyan/40 text-industrial-cyan font-mono text-xs shrink-0 self-start sm:self-auto">
            {nodes.length} Correlated Nodes Active
          </Badge>
        </div>

        {/* Spatial Node Grid with Connecting Arrows */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative pt-2">
          {nodes.map((node) => {
            const isCritical = node.status === 'CRITICAL';
            const isWarning = node.status === 'WARNING';
            const connectedNodes = Array.isArray(node.connectedNodes) ? node.connectedNodes : [];
            const isHighlighted = isNodeHighlighted(node);

            const statusColor = isCritical
              ? 'border-industrial-critical bg-carbon-950/90 shadow-[0_0_20px_rgba(244,63,94,0.2)]'
              : isWarning
              ? 'border-industrial-warning bg-carbon-950/90 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
              : 'border-slateBlue-800 bg-carbon-950/80 hover:border-slateBlue-600';

            const selectionClasses = isHighlighted
              ? 'ring-1 ring-industrial-cyan shadow-md z-10'
              : '';

            return (
              <div
                key={node.nodeId}
                onClick={() => handleNodeClick(node)}
                className={`p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between space-y-4 relative cursor-pointer ${statusColor} ${selectionClasses}`}
              >
                {/* Header with Type badge and status */}
                <div className="flex items-start justify-between gap-2 border-b border-slateBlue-800/60 pb-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slateBlue-400">
                      [{node.nodeType}] • {node.nodeId}
                    </span>
                    <h4 className="text-xs sm:text-sm font-mono font-bold text-slate-100 leading-snug">
                      {node.nodeName}
                    </h4>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-mono shrink-0 uppercase font-bold ${
                      isCritical
                        ? 'border-industrial-critical/50 text-industrial-critical bg-industrial-critical/10 animate-pulse'
                        : isWarning
                        ? 'border-industrial-warning/50 text-industrial-warning bg-industrial-warning/10'
                        : 'border-industrial-safe/40 text-industrial-safe bg-industrial-safe/10'
                    }`}
                  >
                    {node.status}
                  </Badge>
                </div>

                {/* Telemetry Metrics */}
                <div className="grid grid-cols-3 gap-2 py-1 bg-carbon-900/60 rounded-lg p-2.5 border border-slateBlue-800/50 text-[11px] font-mono">
                  <div>
                    <span className="text-slateBlue-400 block text-[10px]">Gas Concentration</span>
                    <span className={`font-bold ${node.gasConcentrationPpm > 25 ? 'text-industrial-critical' : node.gasConcentrationPpm > 10 ? 'text-industrial-warning' : 'text-slate-200'}`}>
                      {node.gasConcentrationPpm} PPM
                    </span>
                  </div>
                  <div>
                    <span className="text-slateBlue-400 block text-[10px]">Thermal Array</span>
                    <span className="font-bold text-slate-200">{node.temperatureC} °C</span>
                  </div>
                  <div>
                    <span className="text-slateBlue-400 block text-[10px]">Pressure</span>
                    <span className="font-bold text-slate-200">{node.pressureBar} bar</span>
                  </div>
                </div>

                {/* Operational Activity Badges & Spatial Flow Links */}
                <div className="flex items-center justify-between text-[11px] font-mono pt-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded border ${node.activePermits > 0 ? 'border-amber-500/40 text-amber-300 bg-amber-500/10' : 'border-slateBlue-800 text-slateBlue-500'}`}>
                      {node.activePermits} Permits
                    </span>
                    <span className={`px-2 py-0.5 rounded border ${node.activeMaintenance > 0 ? 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10' : 'border-slateBlue-800 text-slateBlue-500'}`}>
                      {node.activeMaintenance} Maint
                    </span>
                  </div>

                  <div className={`flex items-center gap-1 text-[10px] ${isHighlighted ? 'text-industrial-cyan font-bold animate-pulse' : 'text-slateBlue-400'}`} title={`Correlated links: ${connectedNodes.join(', ')}`}>
                    <Share2 className="w-3 h-3 text-industrial-cyan" />
                    <span>{connectedNodes.length} Links</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
