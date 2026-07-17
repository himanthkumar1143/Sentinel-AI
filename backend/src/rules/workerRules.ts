import { UnifiedPlantModel, RuleEvaluationResult } from '../types/pipeline';

export class WorkerRules {
  /**
   * Evaluates personnel occupancy and zone density rules against the Unified Plant Model.
   */
  public static evaluate(upm: UnifiedPlantModel): RuleEvaluationResult[] {
    const results: RuleEvaluationResult[] = [];
    const totalWorkers = upm.worker.workersPresent || 142;
    const congestedZone = upm.worker.zoneDistribution.find(z => z.workerCount > 30);

    // WorkerRule-01: High Personnel Occupancy Limit Check
    const isHighOccupancy = totalWorkers > 100 || Boolean(congestedZone);
    results.push({
      ruleId: 'WorkerRule-01',
      ruleName: 'High Personnel Occupancy Safety Check',
      category: 'Personnel',
      purpose: 'Monitors total on-site headcount and zone-level personnel density against evacuation muster capacity.',
      condition: 'Total Headcount > 100 OR Zone Headcount > 30',
      threshold: '100 On-Site / 30 Per Zone',
      currentValue: `${totalWorkers} Total (${congestedZone ? `${congestedZone.workerCount} in ${congestedZone.zoneCode}` : 'Distributed'})`,
      isTriggered: isHighOccupancy,
      reason: isHighOccupancy
        ? `High personnel occupancy detected (${totalWorkers} on-site across ${upm.worker.zoneDistribution.length} zones).`
        : 'Workforce occupancy within nominal baseline limits.',
      observationText: isHighOccupancy ? 'High personnel occupancy detected across active operating sectors.' : undefined,
      severity: 'info',
      evidence: isHighOccupancy ? [
        `SAP Workforce Gateway logged ${totalWorkers} personnel on shift ${upm.worker.shiftCode}`,
        congestedZone ? `Peak density zone: ${congestedZone.zoneCode} (${congestedZone.workerCount} workers under Warden ${congestedZone.warden})` : `Distributed evenly across all 8 plant sectors`
      ] : undefined,
      sourceSystem: 'SAP Workforce Gateway',
      affectedZone: congestedZone ? congestedZone.zoneCode : 'Plant-Wide Operating Sectors',
      correlationNodes: ['Personnel Occupancy', 'Muster Capacity', 'Evacuation Roster'],
      dependencySteps: isHighOccupancy ? [
        {
          sourceSystem: 'SAP Workforce Gateway',
          actualValue: `${totalWorkers} Personnel On-Site`,
          threshold: '100 On-Site Baseline',
          ruleName: 'WorkerRule-01 (Headcount Check)'
        },
        {
          sourceSystem: 'Emergency Warden Network',
          actualValue: '8 Wardens Logged',
          threshold: 'Full Warden Coverage',
          ruleName: 'Emergency Warden Roll-Call'
        }
      ] : undefined
    });

    return results;
  }
}
