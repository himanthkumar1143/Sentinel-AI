export function buildAIPrompt(context: any): string {
  const scenario = context.scenario || 'normal';
  const overallStatus = context.overallStatus || 'ONLINE - ACTIVE';
  const executiveSummary = context.executiveSummary || 'No summary available.';
  const compoundRiskIndex = context.compoundRiskIndex || context.overallRiskScore || (scenario === 'critical' ? 89 : scenario === 'warning' ? 58 : 12);

  const observations = (context.generatedObservations || context.observations || []).slice(0, 15).map((o: any) => ({
    id: o.id,
    severity: o.severity,
    category: o.category,
    title: o.title,
    summary: o.summary,
    affectedZones: o.affectedZones || [o.affectedZone || 'Plant-Wide'],
    triggeringRuleId: o.triggeringRuleId
  }));

  const triggeredRules = (context.ruleEvaluations || context.ruleDecisions || context.triggeredRules || [])
    .filter((r: any) => r.isTriggered || r.status === 'Triggered' || r.triggeringRuleId)
    .slice(0, 20)
    .map((r: any) => ({
      ruleId: r.ruleId || r.id,
      ruleName: r.ruleName || r.name,
      category: r.category,
      currentValue: r.currentValue,
      threshold: r.threshold
    }));

  const stats = context.domainStats || context.statistics || {};

  const recommendations = (context.recommendations || []).slice(0, 10).map((rec: any) => ({
    id: rec.id,
    title: rec.title,
    category: rec.category,
    priority: rec.priority
  }));

  const structuredContextPayload = {
    currentScenario: scenario,
    overallStatus,
    compoundRiskIndex,
    executiveSummary,
    operationalObservations: observations,
    triggeredRules,
    statistics: stats,
    recommendations
  };

  return `You are an Industrial Safety Intelligence System.
Analyze ONLY the supplied Operational Context.
Never invent missing information.
Never assume unavailable data.
Explain every conclusion.
Return ONLY valid JSON.

Analyze the following structured Operational Context JSON:
${JSON.stringify(structuredContextPayload, null, 2)}

Return a JSON object conforming EXACTLY to the following schema with NO markdown code fences (like \`\`\`json), just the raw JSON object string:
{
  "overallRisk": "Safe" | "Warning" | "Critical",
  "confidence": number between 0 and 100,
  "executiveAssessment": "Concise paragraph assessing the overall plant risk based strictly on the observations and triggered rules",
  "executiveSummary": "Summary statement for executive briefing",
  "compoundRisks": [
    {
      "title": "Title of compound risk",
      "severity": "Critical" | "Warning" | "Info" | "Safe",
      "reason": "Clear explanation of why this compound risk exists based on the observations",
      "affectedSystems": ["System 1", "System 2"],
      "probability": "Percentage or quantitative estimate e.g. '85%'",
      "impact": "Detailed impact description"
    }
  ],
  "rootCauses": [
    {
      "title": "Root cause title",
      "description": "Detailed description of the root cause",
      "category": "Sensor | Permit | Workforce | Thermal | Gas",
      "likelihood": "High | Medium | Low",
      "chain": ["Step 1 e.g. Gas Increasing", "Step 2 e.g. Hot Work Active", "Step 3 e.g. Workers Present", "Step 4 e.g. Explosion Hazard", "Step 5 e.g. Critical Risk"]
    }
  ],
  "cascadingEvents": [
    {
      "step": 1,
      "title": "Initial trigger or cascading step",
      "timebox": "Immediate (0-5 min) | Short Term (15-30 min) | Long Term (>1 hr)",
      "description": "Cascading effect description",
      "probability": "e.g. 90%",
      "affectedZone": "Zone name"
    }
  ],
  "recommendedActions": [
    {
      "id": "ACT-01",
      "priority": "Immediate" | "Short Term" | "Long Term",
      "action": "Action title",
      "rationale": "Why this action is required",
      "targetSystem": "Target equipment or interlock",
      "owner": "Responsible role e.g. Safety Officer"
    }
  ],
  "monitoringPriorities": [
    {
      "id": "MON-01",
      "metric": "Telemetry metric e.g. Combustible Gas PPM",
      "zone": "Zone name",
      "frequency": "Continuous | Every 5 min | Hourly",
      "threshold": "Threshold limit e.g. > 10 PPM",
      "status": "Active | Elevated | Normal"
    }
  ]
}`;
}
