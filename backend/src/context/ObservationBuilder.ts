import { RuleEvaluationResult, Observation, DependencyNode } from '../types/pipeline';

export class ObservationBuilder {
  /**
   * Converts triggered engineering and compound rule evaluation results into standardized enterprise Observation objects.
   * Constructs the complete explainability reasoning chain (PART 12) and correlation graph nodes (PART 5).
   */
  public static build(triggeredRules: RuleEvaluationResult[], generatedAt: string): Observation[] {
    return triggeredRules.map((rule, index) => {
      const codePrefix = rule.category === 'Compound' ? 'CMP'
        : rule.category === 'Safety' ? 'SAF'
        : rule.category === 'Operations' ? 'OPS'
        : rule.category === 'Maintenance' ? 'MNT'
        : rule.category === 'Environmental' ? 'ENV'
        : 'PER';

      const obsId = `OBS-${codePrefix}-${String(index + 1).padStart(3, '0')}`;
      const observationTitle = rule.observationText || rule.ruleName;

      // Construct PART 12 dependency chain reasoning if not already defined
      const dependencyChain: DependencyNode[] = rule.dependencySteps || [
        {
          sourceSystem: rule.sourceSystem || 'SCADA Telemetry Network',
          actualValue: String(rule.currentValue),
          threshold: rule.threshold || rule.condition,
          ruleName: `${rule.ruleId} (${rule.ruleName})`
        },
        {
          sourceSystem: 'Operational Context Intelligence Engine',
          actualValue: 'Deterministic Threshold Exceeded',
          threshold: 'Engineering Rule Evaluation',
          ruleName: 'Observation Generation Stage'
        }
      ];

      const affectedZoneStr = rule.affectedZone || 'Plant-Wide Operations';
      const affectedZonesArr: string[] = Array.isArray(rule.affectedZones)
        ? rule.affectedZones
        : Array.isArray(rule.affectedZone)
        ? rule.affectedZone
        : typeof rule.affectedZone === 'string'
        ? [rule.affectedZone]
        : ['Plant-Wide Operations'];

      const evidenceArr: string[] = rule.evidence && Array.isArray(rule.evidence) ? rule.evidence : [
        `${rule.sourceSystem || 'SCADA Network'}: ${rule.condition} verified (Value: ${rule.currentValue})`
      ];

      const correlationNodesArr: string[] = rule.correlationNodes && Array.isArray(rule.correlationNodes)
        ? rule.correlationNodes
        : [rule.category, 'Operational Condition', observationTitle.slice(0, 20)];

      return {
        id: obsId,
        timestamp: generatedAt,
        category: rule.category === 'Compound' ? 'Safety' : (rule.category as any),
        severity: rule.severity || 'info',
        title: observationTitle,
        observation: observationTitle,
        summary: rule.reason,
        explanation: rule.reason,
        affectedZones: affectedZonesArr,
        affectedZone: affectedZoneStr,
        triggeringRuleId: rule.ruleId,
        triggeredRule: rule.ruleId,
        triggeringRuleName: rule.ruleName || rule.ruleId,
        correlationNodes: correlationNodesArr,
        dependencyChain: dependencyChain || [],
        dependencies: dependencyChain || [],
        supportingEvidence: evidenceArr,
        evidence: evidenceArr,
        relatedRules: rule.ruleId ? [rule.ruleId] : [],
        tags: [rule.category || 'Operations', rule.severity || 'info'],
        impactedAssets: correlationNodesArr.filter(node => typeof node === 'string' && (node.toUpperCase().includes('REACTOR') || node.toUpperCase().includes('STORAGE') || node.toUpperCase().includes('PIPING') || node.toUpperCase().includes('SCADA') || node.toUpperCase().includes('VALVE') || node.toUpperCase().includes('ZONE'))),
        sourceSystem: rule.sourceSystem || 'Industrial Data Gateway'
      };
    });
  }
}
