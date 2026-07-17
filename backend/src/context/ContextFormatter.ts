import { OperationalContext, Observation, RuleEvaluationResult } from '../types/pipeline';

export class ContextFormatter {
  /**
   * Formats the OperationalContext for REST API responses and enterprise reporting.
   */
  public static formatApiResponse(context: OperationalContext) {
    return {
      status: 'success',
      ...context,
      timestamp: context.generatedAt || context.timestamp,
      scenario: context.scenario,
      confidence: context.contextConfidence,
      executionTimeMs: context.executionTimeMs,
      operationalContext: context,
      summary: context.executiveSummary,
      kpis: context.kpiSummary || context.executiveKpiSummary,
      statistics: context.statistics,
      coverage: context.ruleCoverage,
      distribution: context.ruleDistribution,
      domainStats: context.domainStats || {
        safetyCount: context.generatedObservations.filter(o => o.category === 'Safety').length || 0,
        operationsCount: context.generatedObservations.filter(o => o.category === 'Operations').length || 0,
        maintenanceCount: context.generatedObservations.filter(o => o.category === 'Maintenance').length || 0,
        environmentalCount: context.generatedObservations.filter(o => o.category === 'Environmental').length || 0,
        compoundCount: context.generatedObservations.filter(o => o.category === 'Compound').length || 0
      },
      timeline: context.timeline || [],
      timelineActivity: context.timelineActivity || [],
      spatialCorrelations: context.spatialCorrelations || [],
      triggeredRules: (context.ruleDecisions || []).filter(r => r && r.isTriggered),
      allRuleDecisions: context.ruleDecisions || [],
      ruleEvaluations: context.ruleEvaluations || context.ruleDecisions || [],
      observations: context.generatedObservations || (context as any).observations || [],
      generatedObservations: context.generatedObservations || (context as any).observations || [],
      evidence: context.supportingEvidence || [],
      affectedAreas: context.affectedAreas || []
    };
  }

  /**
   * Generates a compact summary string for logging or quick operator briefings.
   */
  public static toBriefingString(context: OperationalContext): string {
    return `[${context.overallOperationalStatus}] ${context.executiveSummary.overallPlantStatus} (${context.generatedObservations.length} observations | ${context.statistics.rulesTriggered}/${context.statistics.rulesLoaded} rules triggered | ${context.contextConfidence}% confidence)`;
  }
}
