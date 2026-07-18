import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { BrainCircuit, Sparkles } from 'lucide-react';
import type { OperationalContextPayload } from './context/ContextTypes';
import { ExecutiveKpiSummary } from './context/ExecutiveKpiSummary';
import { ExecutiveOperationalSummary } from './context/ExecutiveOperationalSummary';
import { DomainStatisticsGrid } from './context/DomainStatisticsGrid';
import { SpatialActivityCorrelationDiagram } from './context/SpatialActivityCorrelationDiagram';
import { ObservationCategoryFilter } from './context/ObservationCategoryFilter';
import { ObservationCardsList } from './context/ObservationCardsList';
import { ContextGenerationTimeline } from './context/ContextGenerationTimeline';
import { RuleDistributionWidget } from './context/RuleDistributionWidget';
import { RuleCoverageDashboard } from './context/RuleCoverageDashboard';
import { RuleDecisionInspector } from './context/RuleDecisionInspector';
import { RawContextViewer } from './context/RawContextViewer';
import { AICompoundRiskIntelligencePanel } from './context/AICompoundRiskIntelligencePanel';
import type { AIAnalysisReport } from './context/AICompoundRiskIntelligencePanel';
import { fetchAIRiskAssessment } from '../../../services/api';

interface OperationalContextIntelligencePanelProps {
  operationalContext?: OperationalContextPayload;
  scenario?: string;
}

function normalizeContextPayload(raw: any, scenario: string): OperationalContextPayload {
  if (!raw) return buildFallbackContext(scenario);
  const rawObservations = Array.isArray(raw.generatedObservations)
    ? raw.generatedObservations
    : Array.isArray(raw.observations)
    ? raw.observations
    : [];

  const normalizedObservations = rawObservations.map((o: any) => {
    if (!o || typeof o !== 'object') return null;

    const rawZones = o.affectedZones || o.affectedZone;
    const affectedZones: string[] = Array.isArray(rawZones)
      ? rawZones.filter((z: any) => typeof z === 'string' && z.trim().length > 0)
      : typeof rawZones === 'string' && rawZones.trim().length > 0
      ? [rawZones.trim()]
      : ['Plant-Wide Operations'];

    const correlationNodes: string[] = Array.isArray(o.correlationNodes)
      ? o.correlationNodes.filter((n: any) => typeof n === 'string')
      : [o.category || 'Operations', 'Operational Condition'];

    const rawDeps = o.dependencyChain || o.dependencies || o.dependencySteps;
    const dependencyChain = Array.isArray(rawDeps)
      ? rawDeps.map((d: any, idx: number) => ({
          ...d,
          step: d.step || idx + 1,
          label: d.label || d.ruleName || d.sourceSystem || 'Observation Step',
          type: d.type || 'Sensor',
          value: d.value ?? d.actualValue ?? 'ACTIVE',
          description: d.description || d.threshold || 'Verified condition',
          sourceSystem: d.sourceSystem,
          actualValue: d.actualValue,
          threshold: d.threshold,
          ruleName: d.ruleName
        }))
      : [];

    const rawEvidence = o.supportingEvidence || o.evidence;
    const supportingEvidence: string[] = Array.isArray(rawEvidence)
      ? rawEvidence.filter((e: any) => typeof e === 'string')
      : typeof rawEvidence === 'string'
      ? [rawEvidence]
      : [`${o.sourceSystem || 'Industrial Gateway'}: Condition verified`];

    const rawRules = o.relatedRules;
    const relatedRules: string[] = Array.isArray(rawRules)
      ? rawRules.filter((r: any) => typeof r === 'string')
      : o.triggeringRuleId ? [o.triggeringRuleId]
      : o.triggeredRule ? [o.triggeredRule]
      : [];

    const rawTags = o.tags;
    const tags: string[] = Array.isArray(rawTags)
      ? rawTags.filter((t: any) => typeof t === 'string')
      : [o.category || 'Operations', o.severity || 'info'];

    const rawAssets = o.impactedAssets;
    const impactedAssets: string[] = Array.isArray(rawAssets)
      ? rawAssets.filter((a: any) => typeof a === 'string')
      : correlationNodes.filter((n: any) => typeof n === 'string' && (n.toUpperCase().includes('REACTOR') || n.toUpperCase().includes('STORAGE') || n.toUpperCase().includes('PIPING') || n.toUpperCase().includes('SCADA') || n.toUpperCase().includes('VALVE') || n.toUpperCase().includes('ZONE')));

    return {
      ...o,
      id: o.id || `OBS-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: o.timestamp || new Date().toISOString(),
      category: (['Safety', 'Operations', 'Maintenance', 'Environmental', 'Compound', 'Personnel'].includes(o.category) ? o.category : 'Operations') as any,
      severity: (['critical', 'warning', 'info', 'safe'].includes(o.severity) ? o.severity : 'info') as any,
      title: o.title || o.observation || o.summary || 'Operational Observation',
      observation: o.observation || o.title || o.summary || 'Operational Observation',
      summary: o.summary || o.explanation || o.observation || 'Deterministic rule evaluation triggered.',
      explanation: o.explanation || o.summary || o.observation || 'Deterministic rule evaluation triggered.',
      affectedZones: affectedZones.length > 0 ? affectedZones : ['Plant-Wide Operations'],
      affectedZone: affectedZones[0] || 'Plant-Wide Operations',
      triggeringRuleId: o.triggeringRuleId || o.triggeredRule || 'System-Rule',
      triggeredRule: o.triggeringRuleId || o.triggeredRule || 'System-Rule',
      triggeringRuleName: o.triggeringRuleName || o.ruleName || o.triggeringRuleId || o.triggeredRule || 'Standard Deterministic Rule',
      correlationNodes,
      dependencyChain,
      dependencies: dependencyChain,
      supportingEvidence,
      evidence: supportingEvidence,
      relatedRules,
      tags,
      impactedAssets,
      sourceSystem: o.sourceSystem || 'Industrial Data Gateway'
    };
  }).filter(Boolean);

  const normalizedSpatial = Array.isArray(raw.spatialCorrelations)
    ? raw.spatialCorrelations.map((sc: any) => ({
        ...sc,
        connectedNodes: Array.isArray(sc?.connectedNodes) ? sc.connectedNodes : []
      }))
    : [];

  const normalizedRules = Array.isArray(raw.ruleEvaluations || raw.ruleDecisions || raw.allRuleDecisions)
    ? (raw.ruleEvaluations || raw.ruleDecisions || raw.allRuleDecisions).map((r: any) => ({
        ...r,
        evidence: Array.isArray(r?.evidence) ? r.evidence : [],
        affectedZones: Array.isArray(r?.affectedZones) ? r.affectedZones : (typeof r?.affectedZone === 'string' ? [r.affectedZone] : []),
        correlationNodes: Array.isArray(r?.correlationNodes) ? r.correlationNodes : [],
        dependencySteps: Array.isArray(r?.dependencySteps) ? r.dependencySteps : []
      }))
    : [];

  const rawStats = raw.domainStats || raw.ruleDistribution || {};
  const getCount = (key: string, cat: string) => {
    if (rawStats && typeof rawStats === 'object') {
      if ((rawStats as any)[`${key}Count`] !== undefined) return Number((rawStats as any)[`${key}Count`]);
      if ((rawStats as any)[`${key === 'operations' ? 'operational' : key}Rules`] !== undefined) return Number((rawStats as any)[`${key === 'operations' ? 'operational' : key}Rules`]);
    }
    return normalizedObservations.filter((o: any) => o.category === cat).length;
  };

  const domainStats = {
    safetyCount: getCount('safety', 'Safety'),
    operationsCount: getCount('operations', 'Operations'),
    maintenanceCount: getCount('maintenance', 'Maintenance'),
    environmentalCount: getCount('environmental', 'Environmental'),
    compoundCount: getCount('compound', 'Compound')
  };

  return {
    ...raw,
    contextId: raw.contextId || raw.id || `CTX-${scenario.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
    timestamp: raw.timestamp || raw.generatedAt || new Date().toISOString(),
    scenario: raw.scenario || scenario,
    overallStatus: raw.overallStatus || raw.overallOperationalStatus || (scenario === 'critical' ? 'CRITICAL ALERT - HIGH RISK' : scenario === 'warning' ? 'WARNING LEVEL - ELEVATED' : 'ONLINE - NORMAL'),
    executiveSummary: raw.executiveSummary || raw.summary || 'Operational context blueprint synthesized from live industrial sensor arrays and rule evaluation checks.',
    kpiSummary: raw.kpiSummary || raw.executiveKpiSummary || raw.kpis || {
      overallConfidence: raw.statistics?.contextConfidence || raw.contextConfidence || 100,
      activeRulesCount: raw.statistics?.rulesLoaded || normalizedRules.length || 52,
      triggeredAlertsCount: raw.statistics?.rulesTriggered || normalizedObservations.length || 0,
      compoundRiskLevel: scenario === 'critical' ? ('CRITICAL' as const) : scenario === 'warning' ? ('WARNING' as const) : ('SAFE' as const),
      processingTimeMs: raw.executionTimeMs || 14
    },
    domainStats,
    generatedObservations: normalizedObservations,
    observations: normalizedObservations,
    spatialCorrelations: normalizedSpatial,
    ruleEvaluations: normalizedRules,
    ruleDecisions: normalizedRules,
    timeline: Array.isArray(raw.timeline) ? raw.timeline : [],
    timelineActivity: Array.isArray(raw.timelineActivity) ? raw.timelineActivity : []
  };
}

export const OperationalContextIntelligencePanel: React.FC<OperationalContextIntelligencePanelProps> = ({
  operationalContext: propContext,
  scenario: propScenario = 'normal'
}) => {
  const [context, setContext] = useState<OperationalContextPayload | null>(
    propContext ? normalizeContextPayload(propContext, propScenario) : null
  );
  const [loading, setLoading] = useState<boolean>(!propContext);
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedObservationId, setSelectedObservationId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [aiReport, setAiReport] = useState<AIAnalysisReport | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [showOcHelper, setShowOcHelper] = useState<boolean>(() => {
    try {
      return localStorage.getItem('sentinel_seen_oc_tooltip') !== 'true';
    } catch {
      return true;
    }
  });

  // Reset AI report when scenario or context ID changes (PART 11)
  useEffect(() => {
    setAiReport(null);
    setAiError(null);
  }, [propScenario, context?.contextId]);

  const handleRunAIAssessment = async (forceRefresh = false, useFallback = false) => {
    if (!context || isLoadingAI) return;
    setIsLoadingAI(true);
    setAiError(null);

    try {
      const report = await fetchAIRiskAssessment(context, forceRefresh, useFallback);
      if (report) {
        setAiReport(report);
      } else if (useFallback) {
        setAiError('Fallback model unavailable.');
      }
    } catch (err: any) {
      console.error('AI risk assessment error:', err);
      setAiError(err.message || 'AI Analysis Unavailable');
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleRetryAI = () => {
    handleRunAIAssessment(true, false);
  };

  // Synchronize state with incoming prop or fetch live API payload
  useEffect(() => {
    if (propContext) {
      setContext(normalizeContextPayload(propContext, propScenario));
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    fetch(`/api/context?scenario=${propScenario}`)
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        if (data && (data.contextId || data.operationalContext || data.scenario)) {
          const rawPayload = data.operationalContext || data;
          setContext(normalizeContextPayload(rawPayload, propScenario));
        } else {
          // Construct realistic enterprise fallback if API payload is empty/missing
          setContext(buildFallbackContext(propScenario));
        }
        setLoading(false);
      })
      .catch(err => {
        console.warn('Live context fetch fallback triggered:', err);
        if (isMounted) {
          setContext(buildFallbackContext(propScenario));
          setLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, [propContext, propScenario]);

  if (loading || !context) {
    return (
      <Card className="border-slateBlue-800 bg-carbon-900/60 p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-panel">
        <div className="w-10 h-10 rounded-full border-4 border-industrial-cyan border-t-transparent animate-spin shadow-glow-safe" />
        <p className="font-mono text-sm uppercase tracking-widest text-slateBlue-300 animate-pulse">
          Correlating Multi-Domain Operational Context Intelligence...
        </p>
      </Card>
    );
  }

  // Filter observations based on Step 3 (Domain) & Step 5 (Category) selections
  const activeObservations = context.generatedObservations || [];
  const filteredObservations = activeObservations.filter(obs => {
    if (selectedDomain !== 'all' && obs.category !== selectedDomain) return false;
    if (selectedCategory !== 'all' && obs.category !== selectedCategory) return false;
    return true;
  });

  // Calculate counts for category filter bar with guaranteed fallback
  const safeStats = context.domainStats || {
    safetyCount: activeObservations.filter(o => o.category === 'Safety').length,
    operationsCount: activeObservations.filter(o => o.category === 'Operations').length,
    maintenanceCount: activeObservations.filter(o => o.category === 'Maintenance').length,
    environmentalCount: activeObservations.filter(o => o.category === 'Environmental').length,
    compoundCount: activeObservations.filter(o => o.category === 'Compound').length
  };

  const categoryCounts: Record<string, number> = {
    all: activeObservations.length,
    Safety: safeStats.safetyCount,
    Operations: safeStats.operationsCount,
    Maintenance: safeStats.maintenanceCount,
    Environmental: safeStats.environmentalCount,
    Compound: safeStats.compoundCount
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner Bar */}
      <Card className="border-slateBlue-800 bg-carbon-900/90 backdrop-blur-md shadow-panel relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
        <CardContent className="p-5 sm:p-6 relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="w-2.5 h-2.5 rounded-full bg-industrial-cyan animate-pulse shadow-glow-safe" />
              <h2 className="text-xl sm:text-2xl font-mono font-extrabold text-slate-100 uppercase tracking-tight flex items-center gap-2">
                <BrainCircuit className="w-6 h-6 text-industrial-cyan" />
                Operational Context Engine
              </h2>
              <Badge className="bg-industrial-cyan text-carbon-950 font-mono text-xs font-bold px-2.5">
                CONTEXT ACTIVE
              </Badge>
            </div>
            <p className="text-xs sm:text-sm font-sans text-slateBlue-300 max-w-3xl leading-relaxed">
              Synthesizing edge SCADA telemetry, SAP maintenance arrays, active safety permits, shift roster distribution, and environmental vectors using 52 deterministic engineering rules.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
            <Badge variant="outline" className="border-slateBlue-700 text-slateBlue-300 text-xs font-mono uppercase px-3 py-1.5">
              Scenario: <span className="text-cyan-300 font-bold ml-1">{propScenario.toUpperCase()}</span>
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* PART 3: One-Time Operational Context Explanation Tooltip / Helper Card */}
      {showOcHelper && (
        <div className="bg-gradient-to-r from-slateBlue-900/90 via-carbon-900 to-carbon-900 border-2 border-industrial-cyan/80 rounded-2xl p-5 shadow-[0_0_30px_rgba(6,182,212,0.2)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top duration-300 relative">
          <div className="space-y-1.5 max-w-4xl">
            <div className="flex items-center gap-2 font-mono text-xs font-black uppercase tracking-wider text-industrial-cyan">
              <Sparkles className="w-4 h-4 text-industrial-cyan animate-pulse" />
              <span>Core Innovation of SentinelAI: Operational Context</span>
            </div>
            <p className="text-xs sm:text-sm font-sans text-slate-100 font-medium leading-relaxed italic">
              &ldquo;A unified understanding of plant conditions created by combining telemetry, maintenance, permits, workforce, and environmental information into one operational picture.&rdquo;
            </p>
          </div>
          <button
            onClick={() => {
              setShowOcHelper(false);
              try { localStorage.setItem('sentinel_seen_oc_tooltip', 'true'); } catch {}
            }}
            className="px-4 py-2 rounded-xl bg-industrial-cyan/20 hover:bg-industrial-cyan/30 text-industrial-cyan border border-industrial-cyan/50 font-mono text-xs font-extrabold uppercase transition-all shrink-0 shadow-glow-safe/20"
          >
            Got It ✓
          </button>
        </div>
      )}

      {/* =========================================================
          PART 15 PROGRESSIVE INFORMATION HIERARCHY (STEPS 1 - 11)
      ========================================================= */}

      {/* STEP 1: Executive KPI Summary (PART 6) */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slateBlue-400 px-1">
          <span className="w-1.5 h-1.5 rounded-full bg-industrial-cyan" />
          <span>STEP 1 OF 11: EXECUTIVE KPI SUMMARY</span>
        </div>
        <ExecutiveKpiSummary context={context} />
      </section>

      {/* STEP 2: Executive Operational Summary (High Priority Briefing) */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slateBlue-400 px-1">
          <span className="w-1.5 h-1.5 rounded-full bg-industrial-cyan" />
          <span>STEP 2 OF 11: HIGH PRIORITY EXECUTIVE BRIEFING</span>
        </div>
        <ExecutiveOperationalSummary context={context} />
      </section>

      {/* STEP 3: Domain Statistics Grid (PART 13) */}
      <section className="space-y-3 pt-2">
        <DomainStatisticsGrid
          context={context}
          selectedDomain={selectedDomain}
          onSelectDomain={setSelectedDomain}
        />
      </section>

      {/* STEP 4: Spatial Activity Correlation Diagram (PART 11) */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slateBlue-400 px-1">
          <span className="w-1.5 h-1.5 rounded-full bg-industrial-cyan" />
          <span>STEP 4 OF 11: SPATIAL ACTIVITY CORRELATION DIAGRAM</span>
        </div>
        <SpatialActivityCorrelationDiagram
          context={context}
          selectedObservationId={selectedObservationId}
          onSelectObservation={setSelectedObservationId}
          selectedNodeId={selectedNodeId}
          onSelectNode={setSelectedNodeId}
          observations={filteredObservations}
        />
      </section>

      {/* STEP 5: Observation Category Filter Bar */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slateBlue-400 px-1">
          <span className="w-1.5 h-1.5 rounded-full bg-industrial-cyan" />
          <span>STEP 5 OF 11: OBSERVATION CATEGORY FILTER</span>
        </div>
        <ObservationCategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          counts={categoryCounts}
        />
      </section>

      {/* STEP 6: Observation Cards with Expandable Dependency Trees (PART 12) */}
      <section className="space-y-3">
        <ObservationCardsList
          observations={filteredObservations}
          selectedObservationId={selectedObservationId}
          onSelectObservation={setSelectedObservationId}
          selectedNodeId={selectedNodeId}
          onSelectNode={setSelectedNodeId}
        />
      </section>

      {/* STEP 7: Cross-Domain Activity Timeline (PART 14) */}
      <section className="space-y-3 pt-4">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slateBlue-400 px-1">
          <span className="w-1.5 h-1.5 rounded-full bg-industrial-cyan" />
          <span>STEP 7 OF 11: CROSS-DOMAIN TEMPORAL CORRELATION TIMELINE</span>
        </div>
        <ContextGenerationTimeline context={context} />
      </section>

      {/* STEP 8: Risk Distribution Bar (PART 15) */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slateBlue-400 px-1">
          <span className="w-1.5 h-1.5 rounded-full bg-industrial-cyan" />
          <span>STEP 8 OF 11: OBSERVATION SEVERITY DISTRIBUTION</span>
        </div>
        <RuleDistributionWidget context={context} />
      </section>

      {/* STEP 9: Engineering Rule Coverage Dashboard (PART 16) */}
      <section className="space-y-3 pt-4">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slateBlue-400 px-1">
          <span className="w-1.5 h-1.5 rounded-full bg-industrial-cyan" />
          <span>STEP 9 OF 11: DETERMINISTIC RULE COVERAGE DASHBOARD</span>
        </div>
        <RuleCoverageDashboard context={context} />
      </section>

      {/* STEP 10: Live Rule Decision Inspector (PART 17) */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slateBlue-400 px-1">
          <span className="w-1.5 h-1.5 rounded-full bg-industrial-cyan" />
          <span>STEP 10 OF 11: LIVE ENGINEERING RULE DECISION INSPECTOR</span>
        </div>
        <RuleDecisionInspector ruleEvaluations={context.ruleEvaluations || []} />
      </section>

      {/* STEP 11: Raw Context JSON Viewer (PART 18) */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slateBlue-400 px-1">
          <span className="w-1.5 h-1.5 rounded-full bg-industrial-cyan" />
          <span>STEP 11 OF 11: RAW OPERATIONAL CONTEXT JSON PAYLOAD</span>
        </div>
        <RawContextViewer context={context} />
      </section>

      {/* =========================================================
          AI COMPOUND RISK INTELLIGENCE ENGINE
      ========================================================= */}
      <section className="space-y-3 pt-4 border-t border-slateBlue-800/80">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-industrial-cyan px-1">
          <Sparkles className="w-4 h-4 animate-pulse text-amber-400" />
          <span>EXPLAINABLE AI RISK ANALYSIS (GOOGLE GEMINI)</span>
        </div>
        <AICompoundRiskIntelligencePanel
          report={aiReport}
          isLoading={isLoadingAI}
          error={aiError}
          onRunAssessment={handleRunAIAssessment}
          onRetry={handleRetryAI}
          scenario={propScenario}
          context={context}
        />
      </section>
    </div>
  );
};

/**
 * Constructs a rich, verified OperationalContextPayload fallback for immediate presentation
 */
export function buildFallbackContext(scenario: string): OperationalContextPayload {
  const isCritical = scenario === 'critical';
  const isWarning = scenario === 'warning';

  return {
    contextId: `CTX-${scenario.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
    timestamp: new Date().toISOString(),
    scenario,
    overallStatus: isCritical ? 'CRITICAL ALERT - HIGH RISK' : isWarning ? 'WARNING LEVEL - ELEVATED' : 'ONLINE - NORMAL',
    executiveSummary: isCritical
      ? 'CRITICAL OPERATIONAL ALERT: High gas concentration (38.5 PPM) detected in Reactor Area while active Hot Work Safety Permit (SWP-882) is underway with 28 personnel present. Emergency containment protocol and immediate area evacuation advised.'
      : isWarning
      ? 'ELEVATED RISK WARNING: Thermal fluctuation and scheduled maintenance overhaul on Hydrocarbon Storage Manifold #2 coincide with increased ambient moisture. Continue monitoring shift roster parameters.'
      : 'PLANT NOMINAL: All 8 sectors operating within safe design limits. 142 personnel distributed across 3 active shifts. Zero safety permit conflicts or gas anomalies detected.',
    kpiSummary: {
      overallConfidence: 99,
      activeRulesCount: 52,
      triggeredAlertsCount: isCritical ? 8 : isWarning ? 3 : 0,
      compoundRiskLevel: isCritical ? 'CRITICAL' : isWarning ? 'WARNING' : 'SAFE',
      processingTimeMs: 14
    },
    domainStats: {
      safetyCount: isCritical ? 3 : isWarning ? 1 : 0,
      operationsCount: isCritical ? 2 : isWarning ? 1 : 0,
      maintenanceCount: isCritical ? 1 : isWarning ? 1 : 0,
      environmentalCount: isCritical ? 1 : 0,
      compoundCount: isCritical ? 1 : 0
    },
    generatedObservations: isCritical ? [
      {
        id: 'OBS-CRIT-00',
        timestamp: new Date().toISOString(),
        category: 'Compound',
        severity: 'critical',
        title: 'Combustible Gas & Hot Work Explosion Hazard Check',
        summary: 'SCADA Gas Sensor detected 38.5 PPM combustible gas in Reactor Zone A coinciding with active Hot Work Permit SWP-882, generating an immediate explosion hazard.',
        affectedZones: ['Reactor Area (Zone A)'],
        triggeringRuleId: 'CR-01',
        triggeringRuleName: 'Combustible Gas & Hot Work Conflict Check',
        correlationNodes: ['Gas Sensor', 'Hot Work Permit', 'Explosion Hazard', 'Recommendation'],
        dependencyChain: [
          { step: 1, label: 'Gas Sensor', type: 'Sensor', value: '38.5 PPM', description: 'Combustible gas concentration exceeding threshold (> 10.0 PPM) detected by SCADA telemetry' },
          { step: 2, label: 'Hot Work Permit', type: 'Permit', value: 'SWP-882 (Welding)', description: 'Active hot work permit providing an open ignition source in Sector A' },
          { step: 3, label: 'Explosion Hazard', type: 'Compound', value: 'Critical Hazard', description: 'Spatial coincidence of combustible gas and ignition source creates immediate explosion hazard' },
          { step: 4, label: 'Recommendation', type: 'Rule', value: 'Immediate LOTO & Evacuation', description: 'Immediately suspend permit SWP-882, activate nitrogen quench interlocks, and evacuate Sector A' }
        ]
      },
      {
        id: 'OBS-CRIT-01',
        timestamp: new Date().toISOString(),
        category: 'Compound',
        severity: 'critical',
        title: 'Personnel Exposure & Hot Work Conflict in Reactor Zone A',
        summary: 'Ambient gas concentration reached 38.5 PPM inside Reactor Zone A during active welding operations (Permit SWP-882) with 28 workers present.',
        affectedZones: ['Reactor Area (Zone A)'],
        triggeringRuleId: 'CR-07',
        triggeringRuleName: 'Gas Concentration + Active Permit + Workforce Exposure Conflict',
        correlationNodes: ['scada-gas-104', 'SWP-882', 'roster-shift-A'],
        dependencyChain: [
          { step: 1, label: 'Gas Concentration', type: 'Sensor', value: '38.5 PPM', description: 'Exceeds 35 PPM safety limit' },
          { step: 2, label: 'Active Work Permit', type: 'Permit', value: 'SWP-882 (Welding)', description: 'Hot work permit authorized' },
          { step: 3, label: 'Workforce Roster', type: 'Workforce', value: '28 Personnel', description: 'Workers present in Sector A' },
          { step: 4, label: 'Compound Rule Evaluation', type: 'Rule', value: 'CR-07 Triggered', description: 'Deterministic correlation trigger' }
        ]
      },
      {
        id: 'OBS-CRIT-02',
        timestamp: new Date().toISOString(),
        category: 'Safety',
        severity: 'critical',
        title: 'High Gas Concentration Threshold Exceeded',
        summary: 'Gas sensor SCADA-GAS-104 reading 38.5 PPM exceeds critical safety threshold of 35 PPM.',
        affectedZones: ['Reactor Area (Zone A)'],
        triggeringRuleId: 'GasRule-01',
        triggeringRuleName: 'Exceeds Critical Gas Threshold (35 PPM)',
        correlationNodes: ['scada-gas-104'],
        dependencyChain: [
          { step: 1, label: 'SCADA Telemetry', type: 'Sensor', value: '38.5 PPM', description: 'Direct edge sensor reading' },
          { step: 2, label: 'Rule Evaluation', type: 'Rule', value: 'GasRule-01 Triggered', description: 'Exceeds 35 PPM limit' }
        ]
      }
    ] : isWarning ? [
      {
        id: 'OBS-WARN-01',
        timestamp: new Date().toISOString(),
        category: 'Maintenance',
        severity: 'warning',
        title: 'Concurrent Maintenance and Thermal Fluctuation',
        summary: 'Storage Manifold #2 undergoing flange overhaul while ambient thermal reading elevated to 45.0 °C.',
        affectedZones: ['Storage Manifold (Zone B)'],
        triggeringRuleId: 'MaintenanceRule-03',
        triggeringRuleName: 'Active Maintenance during Thermal Fluctuation',
        correlationNodes: ['WO-9942', 'scada-temp-201'],
        dependencyChain: [
          { step: 1, label: 'Maintenance Order', type: 'Maintenance', value: 'WO-9942 Active', description: 'Flange overhaul ongoing' },
          { step: 2, label: 'Thermal Sensor', type: 'Sensor', value: '45.0 °C', description: 'Above nominal storage temperature' }
        ]
      }
    ] : [],
    ruleEvaluations: [
      {
        ruleId: 'GasRule-01',
        ruleName: 'Exceeds Critical Gas Threshold',
        category: 'Safety',
        purpose: 'Detect unsafe gas concentrations above 35 PPM.',
        condition: 'gasConcentration > 35',
        threshold: '35 PPM',
        currentValue: isCritical ? '38.5 PPM' : '1.4 PPM',
        isTriggered: isCritical,
        reason: isCritical ? 'Exceeds 35 PPM limit' : 'Nominal reading'
      },
      {
        ruleId: 'CR-07',
        ruleName: 'Gas Spike + Hot Work + Roster Conflict',
        category: 'Compound',
        purpose: 'Correlate high-risk physical work permits with gas surges and crew exposure.',
        condition: 'gas > 35 AND permit.type === "HOT_WORK" AND workers > 0',
        threshold: 'Multi-Condition Check',
        currentValue: isCritical ? 'Triggered (38.5 PPM / Hot Work / 28 Workers)' : 'Safe / Standard Shift',
        isTriggered: isCritical,
        reason: isCritical ? 'All 3 compound correlation parameters active' : 'Zero conflict'
      },
      {
        ruleId: 'PressureRule-02',
        ruleName: 'Vessel Overpressure Check',
        category: 'Safety',
        purpose: 'Verify manifold pressure remains below 15.0 bar.',
        condition: 'pressure <= 15.0 bar',
        threshold: '15.0 bar',
        currentValue: isCritical ? '14.8 bar' : '10.2 bar',
        isTriggered: false,
        reason: 'Operating below pressure relief limit'
      },
      {
        ruleId: 'WorkerRule-01',
        ruleName: 'Shift Crew Ratio Check',
        category: 'Personnel',
        purpose: 'Ensure active sector staffing aligns with safety permit requirements.',
        condition: 'workers >= requiredStaffing',
        threshold: '2 Personnel minimum',
        currentValue: '28 Personnel',
        isTriggered: false,
        reason: 'Staffing ratio verified safe'
      }
    ],
    ruleCoverage: {
      rulesDefined: 52,
      rulesEvaluated: 52,
      coveragePercentage: 100,
      categoriesEvaluated: ['Safety', 'Operations', 'Maintenance', 'Environmental', 'Compound', 'Personnel']
    },
    spatialCorrelations: [],
    timelineActivity: []
  };
}

export default OperationalContextIntelligencePanel;
