import { UnifiedPlantModel, RuleEvaluationResult } from '../types/pipeline';

export class MaintenanceRules {
  /**
   * Evaluates active maintenance work order rules against the Unified Plant Model.
   */
  public static evaluate(upm: UnifiedPlantModel): RuleEvaluationResult[] {
    const results: RuleEvaluationResult[] = [];
    const activeJobs = upm.maintenance.jobs.filter(j => j.status === 'In Progress' || j.status === 'Active');
    const emergencyJobs = activeJobs.filter(j => j.priority === 'Emergency' || j.priority === 'High');

    // MaintenanceRule-01: Active Maintenance Activity Check
    const isMaintenanceActive = activeJobs.length > 0;
    results.push({
      ruleId: 'MaintenanceRule-01',
      ruleName: 'Scheduled Maintenance Activity Tracking',
      category: 'Maintenance',
      purpose: 'Monitors ongoing equipment maintenance and overhaul jobs across active plant sectors.',
      condition: 'Active Maintenance Jobs > 0',
      threshold: '0 Jobs',
      currentValue: `${activeJobs.length} Active Jobs`,
      isTriggered: isMaintenanceActive,
      reason: isMaintenanceActive
        ? `There are currently ${activeJobs.length} active maintenance job(s) underway across process sectors.`
        : 'No active scheduled maintenance work orders currently in progress.',
      observationText: isMaintenanceActive ? 'Scheduled maintenance activity is underway.' : undefined,
      severity: emergencyJobs.length > 0 ? 'warning' : 'info',
      evidence: isMaintenanceActive ? [
        `SAP Maintenance Gateway reporting ${activeJobs.length} active work order(s)`,
        ...activeJobs.slice(0, 2).map(j => `Work Order #${j.id}: ${j.description} (${j.priority} Priority)`)
      ] : undefined,
      sourceSystem: 'SAP Maintenance Gateway',
      affectedZone: 'Plant-Wide Maintenance Sectors',
      correlationNodes: ['Maintenance Activity', 'Work Orders', 'Equipment Isolation'],
      dependencySteps: isMaintenanceActive ? [
        {
          sourceSystem: 'SAP Maintenance Gateway',
          actualValue: `${activeJobs.length} Active Jobs`,
          threshold: '0 Active Jobs',
          ruleName: 'MaintenanceRule-01 (Activity Tracking)'
        },
        {
          sourceSystem: 'Equipment Lockout/Tagout Registry',
          actualValue: `${activeJobs.length} Isolation Tags`,
          threshold: 'Mandatory Isolation Check',
          ruleName: 'LOTO Compliance Verification'
        }
      ] : undefined
    });

    // MaintenanceRule-02: High-Priority Emergency Maintenance Alert
    const hasEmergencyJobs = emergencyJobs.length > 0;
    results.push({
      ruleId: 'MaintenanceRule-02',
      ruleName: 'Emergency Equipment Overhaul Tracking',
      category: 'Maintenance',
      purpose: 'Identifies critical equipment under emergency or high-priority unscheduled maintenance.',
      condition: 'Emergency/High Priority Jobs > 0',
      threshold: '0 Emergency Jobs',
      currentValue: `${emergencyJobs.length} Emergency/High Jobs`,
      isTriggered: hasEmergencyJobs,
      reason: hasEmergencyJobs
        ? `High-priority equipment overhaul active on critical process units (${emergencyJobs.map(j => j.equipmentCode).join(', ')}).`
        : 'All active maintenance orders are routine baseline schedules.',
      observationText: hasEmergencyJobs ? 'Critical process equipment undergoing emergency maintenance overhaul.' : undefined,
      severity: 'warning',
      evidence: hasEmergencyJobs ? [
        `Emergency Work Orders active: ${emergencyJobs.map(j => `#${j.id} (${j.equipmentCode})`).join(', ')}`,
        'Process redundancy reduced in affected equipment sectors.'
      ] : undefined,
      sourceSystem: 'SAP Maintenance Gateway',
      affectedZone: 'Reactor & Compressor Sectors',
      correlationNodes: ['Emergency Overhaul', 'Process Redundancy', 'Operational Risk'],
      dependencySteps: hasEmergencyJobs ? [
        {
          sourceSystem: 'SAP Maintenance Gateway',
          actualValue: `${emergencyJobs.length} High-Priority Orders`,
          threshold: '0 Emergency Orders',
          ruleName: 'MaintenanceRule-02 (Emergency Tracking)'
        },
        {
          sourceSystem: 'Plant Redundancy Monitor',
          actualValue: 'Single-Point Contingency',
          threshold: 'Dual-Redundancy Required',
          ruleName: 'Redundancy Margin Check'
        }
      ] : undefined
    });

    return results;
  }
}
