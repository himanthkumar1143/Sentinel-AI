export interface AICompoundRisk {
  title: string;
  severity: 'Critical' | 'Warning' | 'Info' | 'Safe' | string;
  reason: string;
  affectedSystems: string[];
  probability: string | number;
  impact: string;
}

export interface AIRootCause {
  title: string;
  description: string;
  category: string;
  likelihood: string;
  chain: string[];
}

export interface AICascadingEvent {
  step: number;
  title: string;
  timebox: string;
  description: string;
  probability: string | number;
  affectedZone: string;
}

export interface AIRecommendedAction {
  id: string;
  priority: 'Immediate' | 'Short Term' | 'Long Term' | string;
  action: string;
  rationale: string;
  targetSystem: string;
  owner: string;
}

export interface AIMonitoringPriority {
  id: string;
  metric: string;
  zone: string;
  frequency: string;
  threshold: string;
  status: 'Active' | 'Elevated' | 'Normal' | string;
}

export interface AIAnalysisReport {
  overallRisk: 'Safe' | 'Warning' | 'Critical';
  confidence: number;
  executiveAssessment: string;
  compoundRisks: AICompoundRisk[];
  rootCauses: AIRootCause[];
  cascadingEvents: AICascadingEvent[];
  recommendedActions: AIRecommendedAction[];
  monitoringPriorities: AIMonitoringPriority[];
  executiveSummary: string;
  generatedAt: string;
  scenario?: string;
  contextId?: string;
}
