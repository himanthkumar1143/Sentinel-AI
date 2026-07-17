export interface DependencyNode {
  step?: number;
  label?: string;
  type?: 'Sensor' | 'Workforce' | 'Maintenance' | 'Permit' | 'Rule' | 'Observation' | 'Compound' | string;
  value?: string | number;
  description?: string;
  sourceSystem?: string;
  actualValue?: string | number;
  threshold?: string | number;
  ruleName?: string;
}

export interface Observation {
  id: string;
  timestamp: string;
  category: 'Safety' | 'Operations' | 'Maintenance' | 'Environmental' | 'Compound' | 'Personnel';
  severity: 'critical' | 'warning' | 'info' | 'safe';
  title: string;
  observation?: string;
  summary: string;
  explanation?: string;
  affectedZones: string[];
  affectedZone?: string;
  triggeringRuleId: string;
  triggeredRule?: string;
  triggeringRuleName: string;
  correlationNodes: string[];
  dependencyChain: DependencyNode[];
  dependencies?: DependencyNode[];
  supportingEvidence?: string[];
  evidence?: string[];
  relatedRules?: string[];
  tags?: string[];
  impactedAssets?: string[];
  sourceSystem?: string;
}

export interface RuleEvaluationResult {
  ruleId: string;
  ruleName: string;
  category: 'Safety' | 'Operations' | 'Maintenance' | 'Environmental' | 'Compound' | 'Personnel';
  purpose: string;
  condition: string;
  threshold?: string | number;
  currentValue: string | number;
  isTriggered: boolean;
  reason: string;
  observationText?: string;
}

export interface OperationalContextPayload {
  contextId: string;
  timestamp: string;
  scenario: string;
  overallStatus: string;
  executiveSummary: string | any;
  statistics?: {
    rulesLoaded: number;
    rulesTriggered: number;
    compoundRulesTriggered: number;
    observationsGenerated: number;
    executionTimeMs: number;
    contextConfidence: number;
  };
  executionTimeMs?: number;
  kpiSummary: {
    overallConfidence: number;
    activeRulesCount: number;
    triggeredAlertsCount: number;
    compoundRiskLevel: 'SAFE' | 'WARNING' | 'CRITICAL';
    processingTimeMs: number;
    [key: string]: any;
  };
  domainStats: {
    safetyCount: number;
    operationsCount: number;
    maintenanceCount: number;
    environmentalCount: number;
    compoundCount: number;
    [key: string]: any;
  };
  generatedObservations: Observation[];
  ruleEvaluations: RuleEvaluationResult[];
  ruleCoverage: {
    rulesDefined: number;
    rulesEvaluated: number;
    coveragePercentage: number;
    categoriesEvaluated: string[];
  };
  spatialCorrelations: {
    nodeId: string;
    nodeName: string;
    nodeType: 'Reactor' | 'Storage' | 'Piping' | 'Control' | 'Utility' | 'Zone';
    status: 'NORMAL' | 'WARNING' | 'CRITICAL';
    activePermits: number;
    activeMaintenance: number;
    gasConcentrationPpm: number;
    temperatureC: number;
    pressureBar: number;
    connectedNodes: string[];
  }[];
  timelineActivity: {
    timestamp: string;
    domain: string;
    eventTitle: string;
    description: string;
    severity: 'critical' | 'warning' | 'info' | 'safe';
  }[];
  [key: string]: any;
}
