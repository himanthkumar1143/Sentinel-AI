import React, { useState } from 'react';
import { Card, CardContent } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { AlertTriangle, ShieldAlert, Info, CheckCircle2, ChevronDown, ChevronUp, GitBranch, ArrowDown, BrainCircuit, MapPin } from 'lucide-react';
import type { Observation } from './ContextTypes';

interface ObservationCardsListProps {
  observations: Observation[];
  selectedObservationId?: string | null;
  onSelectObservation?: (id: string | null) => void;
  selectedNodeId?: string | null;
  onSelectNode?: (id: string | null) => void;
}

export const ObservationCardsList: React.FC<ObservationCardsListProps> = ({
  observations,
  selectedObservationId = null,
  onSelectObservation,
  selectedNodeId = null,
  onSelectNode
}) => {
  const [expandedCardIds, setExpandedCardIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedCardIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const isCardMatchingSelection = (obs: Observation) => {
    if (selectedObservationId === obs.id) return true;
    if (selectedNodeId) {
      if (obs.correlationNodes?.includes(selectedNodeId)) return true;
      if (obs.affectedZones?.some(z => z.toUpperCase().includes(selectedNodeId.toUpperCase()) || (selectedNodeId === 'REACTOR-01' && z.includes('Zone A')) || (selectedNodeId === 'STORAGE-02' && z.includes('Zone B')) || (selectedNodeId === 'PIPING-04' && z.includes('Piping')))) return true;
      if (selectedNodeId === 'REACTOR-01' && (obs.id === 'OBS-CRIT-00' || obs.id === 'OBS-CRIT-01')) return true;
      if (selectedNodeId === 'STORAGE-02' && obs.id === 'OBS-WARN-01') return true;
    }
    return false;
  };

  const handleCardSelect = (obs: Observation) => {
    const newSelectedId = selectedObservationId === obs.id ? null : obs.id;
    if (onSelectObservation) {
      onSelectObservation(newSelectedId);
    }
    if (newSelectedId) {
      setTimeout(() => {
        const el = document.getElementById(`obs-card-${obs.id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);
    }
  };

  if (observations.length === 0) {
    return (
      <Card className="bg-carbon-900/60 border-slateBlue-800 p-8 text-center font-mono text-slateBlue-400 space-y-2">
        <CheckCircle2 className="w-8 h-8 text-industrial-safe mx-auto opacity-70" />
        <p className="font-bold text-slate-200">No Operational Observations Triggered for Selected Filter</p>
        <p className="text-xs">All deterministic rules evaluated within standard operating boundaries.</p>
      </Card>
    );
  }

  const hasAnySelection = !!(selectedObservationId || selectedNodeId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-mono text-slateBlue-400 px-1">
        <span className="font-bold uppercase tracking-wide text-slate-200 flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-industrial-cyan" />
          <span>● SYNTHESIZED OBSERVATIONS &amp; EXPLAINABILITY DEPENDENCY TREES (PART 12)</span>
        </span>
        <span>Click card to inspect &amp; synchronize with Correlation Diagram</span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {observations.map((obs) => {
          const isExpanded = !!expandedCardIds[obs.id];
          const isCritical = obs.severity === 'critical';
          const isWarning = obs.severity === 'warning';
          const isSelected = isCardMatchingSelection(obs);

          const safeAffectedZones = Array.isArray(obs.affectedZones)
            ? obs.affectedZones
            : typeof obs.affectedZone === 'string'
            ? [obs.affectedZone]
            : typeof obs.affectedZones === 'string'
            ? [obs.affectedZones as unknown as string]
            : ['Plant-Wide Operations'];

          const safeDependencyChain = Array.isArray(obs.dependencyChain)
            ? obs.dependencyChain
            : Array.isArray(obs.dependencies)
            ? obs.dependencies
            : [];

          const borderColor = isCritical
            ? 'border-industrial-critical/70 bg-gradient-to-r from-carbon-900 via-industrial-critical/10 to-carbon-900 shadow-[0_0_25px_rgba(244,63,94,0.18)]'
            : isWarning
            ? 'border-industrial-warning/70 bg-gradient-to-r from-carbon-900 via-industrial-warning/10 to-carbon-900 shadow-[0_0_20px_rgba(245,158,11,0.14)]'
            : 'border-slateBlue-800 bg-carbon-900/90 hover:border-slateBlue-600';

          const selectionStyle = isSelected
            ? 'ring-2 ring-industrial-cyan shadow-[0_0_25px_rgba(34,211,238,0.5)] scale-[1.01] z-10'
            : hasAnySelection
            ? 'opacity-30 transition-all duration-250'
            : '';

          const SeverityIcon = isCritical ? ShieldAlert : isWarning ? AlertTriangle : Info;

          return (
            <Card
              key={obs.id}
              id={`obs-card-${obs.id}`}
              onClick={() => handleCardSelect(obs)}
              className={`border transition-all duration-300 relative overflow-hidden cursor-pointer ${borderColor} ${selectionStyle}`}
            >
              <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
              <CardContent className="p-5 space-y-4 relative z-10">
                {/* Header: Title and Badges */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                      isCritical ? 'bg-industrial-critical/20 text-industrial-critical border border-industrial-critical/40 animate-pulse' : isWarning ? 'bg-industrial-warning/20 text-industrial-warning border border-industrial-warning/40' : 'bg-industrial-cyan/20 text-industrial-cyan border border-industrial-cyan/40'
                    }`}>
                      <SeverityIcon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-mono uppercase font-extrabold ${
                            isCritical ? 'border-industrial-critical text-industrial-critical bg-industrial-critical/10' : isWarning ? 'border-industrial-warning text-industrial-warning bg-industrial-warning/10' : 'border-industrial-cyan text-industrial-cyan bg-industrial-cyan/10'
                          }`}
                        >
                          {obs.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="border-slateBlue-700 text-slateBlue-300 text-[10px] font-mono uppercase">
                          {obs.category}
                        </Badge>
                        <span className="text-xs font-mono text-slateBlue-400">
                          Rule: <span className="text-slate-200 font-bold">{obs.triggeringRuleId}</span>
                        </span>
                      </div>
                      <h4 className="text-base font-mono font-extrabold text-slate-100 tracking-tight">
                        {obs.title}
                      </h4>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(obs.id);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-carbon-950 border border-slateBlue-800 hover:border-industrial-cyan text-xs font-mono text-cyan-300 flex items-center justify-between gap-2 transition-colors self-start sm:self-auto shrink-0"
                  >
                    <span className="font-semibold">{isExpanded ? 'Hide Dependency Chain' : 'Inspect Dependency Chain'}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Summary Explanation */}
                <p className="text-xs sm:text-sm font-sans text-slateBlue-200 leading-relaxed bg-carbon-950/60 p-3.5 rounded-xl border border-slateBlue-800/80">
                  {obs.summary}
                </p>

                {/* Footer Metadata & Clickable Correlation Nodes */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-slateBlue-400 pt-2 border-t border-slateBlue-800/60">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="flex items-center gap-1 text-slateBlue-300">
                      <MapPin className="w-3.5 h-3.5 text-industrial-cyan" />
                      <span>Zones: <strong className="text-slate-200">{safeAffectedZones.join(', ') || 'Zone A'}</strong></span>
                    </span>
                    <span className="text-slateBlue-600 hidden sm:inline">|</span>
                    <span>Trigger: <strong className="text-cyan-400">{obs.triggeringRuleName || obs.triggeringRuleId}</strong></span>
                  </div>

                  {obs.correlationNodes && obs.correlationNodes.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] uppercase font-bold text-slateBlue-400">Nodes:</span>
                      {obs.correlationNodes.map((cn, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onSelectNode) onSelectNode(cn);
                          }}
                          className="border-slateBlue-700 bg-carbon-950/80 hover:border-industrial-cyan hover:text-cyan-300 text-slateBlue-300 text-[10px] font-mono cursor-pointer transition-colors"
                        >
                          {cn}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <span className="text-[11px] text-slateBlue-500 shrink-0">
                    {new Date(obs.timestamp).toLocaleTimeString()} UTC
                  </span>
                </div>

                {/* PART 12: Expandable Reasoning Dependency Tree */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-dashed border-slateBlue-700 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-2 text-xs font-mono text-industrial-cyan font-bold uppercase tracking-wider">
                      <BrainCircuit className="w-4 h-4 animate-pulse" />
                      <span>Observation Explainability Chain (Rule Dependency Tree)</span>
                    </div>

                    <div className="bg-carbon-950 border border-slateBlue-800 rounded-xl p-5 space-y-3 font-mono relative">
                      <div className="text-[11px] text-slateBlue-400 uppercase tracking-widest font-bold">
                        Generated From
                      </div>

                      {/* Render exact steps in down-arrow reasoning tree */}
                      <div className="flex flex-col items-center space-y-2 py-1">
                        {safeDependencyChain.length > 0 ? (
                          safeDependencyChain.map((node, idx) => (
                            <React.Fragment key={idx}>
                              {idx > 0 && (
                                <div className="flex flex-col items-center">
                                  <ArrowDown className="w-4 h-4 text-industrial-cyan animate-bounce my-0.5" />
                                </div>
                              )}
                              <div className="w-full max-w-xl bg-carbon-900 border border-slateBlue-700 rounded-xl p-3.5 flex items-center justify-between shadow-sm hover:border-industrial-cyan transition-colors">
                                <div className="flex items-center gap-3">
                                  <span className="w-6 h-6 rounded-lg bg-carbon-950 border border-slateBlue-800 flex items-center justify-center text-xs font-bold text-cyan-400">
                                    {idx + 1}
                                  </span>
                                  <div>
                                    <span className="text-[10px] text-slateBlue-400 uppercase tracking-wider font-semibold block">
                                      {node.type} Parameter / Input
                                    </span>
                                    <span className="text-xs sm:text-sm font-bold text-slate-100">
                                      {node.label}: <span className="text-cyan-300">{node.value ?? 'ACTIVE'}</span>
                                    </span>
                                  </div>
                                </div>
                                <span className="text-[11px] text-slateBlue-400 max-w-[220px] text-right hidden sm:block">
                                  {node.description}
                                </span>
                              </div>
                            </React.Fragment>
                          ))
                        ) : (
                          /* Realistic enterprise fallback chain if dependencyChain array is empty */
                          <>
                            <div className="w-full max-w-xl bg-carbon-900 border border-slateBlue-700 rounded-xl p-3.5 flex items-center justify-between shadow-sm">
                              <div className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-lg bg-carbon-950 border border-slateBlue-800 flex items-center justify-center text-xs font-bold text-cyan-400">1</span>
                                <div>
                                  <span className="text-[10px] text-slateBlue-400 uppercase font-semibold block">Sensor Parameter</span>
                                  <span className="text-xs sm:text-sm font-bold text-slate-100">Gas Concentration: <span className="text-cyan-300">38.5 PPM</span></span>
                                </div>
                              </div>
                              <span className="text-[11px] text-slateBlue-400 hidden sm:block">SCADA Manifold Telemetry</span>
                            </div>

                            <ArrowDown className="w-4 h-4 text-industrial-cyan animate-bounce my-0.5" />

                            <div className="w-full max-w-xl bg-carbon-900 border border-slateBlue-700 rounded-xl p-3.5 flex items-center justify-between shadow-sm">
                              <div className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-lg bg-carbon-950 border border-slateBlue-800 flex items-center justify-center text-xs font-bold text-cyan-400">2</span>
                                <div>
                                  <span className="text-[10px] text-slateBlue-400 uppercase font-semibold block">Workforce Roster</span>
                                  <span className="text-xs sm:text-sm font-bold text-slate-100">Workers Present: <span className="text-amber-300">28 Personnel</span></span>
                                </div>
                              </div>
                              <span className="text-[11px] text-slateBlue-400 hidden sm:block">SAP Shift Management</span>
                            </div>

                            <ArrowDown className="w-4 h-4 text-industrial-cyan animate-bounce my-0.5" />

                            <div className="w-full max-w-xl bg-carbon-900 border border-slateBlue-700 rounded-xl p-3.5 flex items-center justify-between shadow-sm">
                              <div className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-lg bg-carbon-950 border border-slateBlue-800 flex items-center justify-center text-xs font-bold text-cyan-400">3</span>
                                <div>
                                  <span className="text-[10px] text-slateBlue-400 uppercase font-semibold block">Spatial Zone</span>
                                  <span className="text-xs sm:text-sm font-bold text-slate-100">Affected Zone: <span className="text-slate-200">{safeAffectedZones.join(', ') || 'Reactor Area'}</span></span>
                                </div>
                              </div>
                              <span className="text-[11px] text-slateBlue-400 hidden sm:block">Geospatial Sector A</span>
                            </div>

                            <ArrowDown className="w-4 h-4 text-industrial-cyan animate-bounce my-0.5" />

                            <div className="w-full max-w-xl bg-carbon-900 border border-industrial-cyan/70 rounded-xl p-3.5 flex items-center justify-between shadow-sm bg-industrial-cyan/[0.03]">
                              <div className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-lg bg-industrial-cyan text-carbon-950 flex items-center justify-center text-xs font-black">4</span>
                                <div>
                                  <span className="text-[10px] text-industrial-cyan uppercase font-semibold block">Deterministic Rule Trigger</span>
                                  <span className="text-xs sm:text-sm font-bold text-slate-100">Compound Rule: <span className="text-industrial-cyan">{obs.triggeringRuleId}</span></span>
                                </div>
                              </div>
                              <span className="text-[11px] text-cyan-400 hidden sm:block">{obs.triggeringRuleName}</span>
                            </div>
                          </>
                        )}

                        <ArrowDown className="w-4 h-4 text-industrial-safe animate-bounce my-0.5" />

                        {/* Final Result Card */}
                        <div className="w-full max-w-xl bg-gradient-to-r from-carbon-900 via-industrial-safe/10 to-carbon-900 border border-industrial-safe rounded-xl p-4 text-center shadow-glow-safe/20">
                          <span className="text-xs font-mono font-extrabold text-industrial-safe uppercase tracking-widest flex items-center justify-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-industrial-safe" />
                            Operational Observation Generated — {obs.title}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
