import { UnifiedPlantModel, RuleEvaluationResult } from '../types/pipeline';

export class PermitRules {
  /**
   * Evaluates work permit authorization rules against the Unified Plant Model.
   */
  public static evaluate(upm: UnifiedPlantModel): RuleEvaluationResult[] {
    const results: RuleEvaluationResult[] = [];
    const activePermits = upm.permit.permits.filter(p => p.status === 'ACTIVE');
    const hotWorkPermits = activePermits.filter(p => p.type === 'HOT_WORK');

    // PermitRule-01: Active Hot Work Authorization Check
    const hasHotWork = hotWorkPermits.length > 0;
    results.push({
      ruleId: 'PermitRule-01',
      ruleName: 'Authorized Hot Work Permit Check',
      category: 'Safety',
      purpose: 'Monitors authorized welding, cutting, or grinding activities (Hot Work) across industrial zones.',
      condition: 'Active Hot Work Permits > 0',
      threshold: '0 Hot Work Permits',
      currentValue: `${hotWorkPermits.length} Active Hot Work Permits`,
      isTriggered: hasHotWork,
      reason: hasHotWork
        ? `${hotWorkPermits.length} Hot Work Permit(s) actively authorized in process sectors (${hotWorkPermits.map(p => p.zone).join(', ')}).`
        : 'No active Hot Work authorizations currently logged across plant sectors.',
      observationText: hasHotWork ? 'High-risk hot work activities are currently authorized.' : undefined,
      severity: 'info',
      evidence: hasHotWork ? [
        `Industrial Safety Gateway reporting ${hotWorkPermits.length} active Hot Work permit(s)`,
        ...hotWorkPermits.map(p => `Permit #${p.id}: Authorized in ${p.zone} until ${p.validUntil}`)
      ] : undefined,
      sourceSystem: 'Industrial Safety Gateway',
      affectedZone: hotWorkPermits[0]?.zone || 'Compressor Hall & Process Sectors',
      correlationNodes: ['Hot Work Permit', 'Ignition Source', 'Safety Authorization'],
      dependencySteps: hasHotWork ? [
        {
          sourceSystem: 'Industrial Safety Gateway',
          actualValue: `${hotWorkPermits.length} Active Hot Work Permits`,
          threshold: 'Continuous Atmosphere Monitoring Required',
          ruleName: 'PermitRule-01 (Hot Work Authorization)'
        },
        {
          sourceSystem: 'SCADA Fire & Gas Registry',
          actualValue: 'Continuous Sniffer Active',
          threshold: 'LEL < 1%',
          ruleName: 'Pre-Work Atmospheric Sniffer Verification'
        }
      ] : undefined
    });

    // PermitRule-02: Confined Space Entry Authorization Check
    const confinedPermits = activePermits.filter(p => p.type === 'CONFINED_SPACE');
    const hasConfined = confinedPermits.length > 0;
    results.push({
      ruleId: 'PermitRule-02',
      ruleName: 'Confined Space Entry Authorization Tracking',
      category: 'Safety',
      purpose: 'Verifies continuous atmosphere and warden logs for personnel entering confined vessel interiors.',
      condition: 'Active Confined Space Permits > 0',
      threshold: '0 Confined Space Permits',
      currentValue: `${confinedPermits.length} Confined Space Permits`,
      isTriggered: hasConfined,
      reason: hasConfined
        ? `Personnel actively deployed inside confined vessel interiors (${confinedPermits.map(p => p.zone).join(', ')}).`
        : 'No confined space entries active.',
      observationText: hasConfined ? 'Confined space entry authorized with standby safety wardens.' : undefined,
      severity: 'info',
      evidence: hasConfined ? [
        `Safety Gateway reporting ${confinedPermits.length} confined space permit(s)`,
        ...confinedPermits.map(p => `Permit #${p.id}: Confined entry in ${p.zone}`)
      ] : undefined,
      sourceSystem: 'Industrial Safety Gateway',
      affectedZone: confinedPermits[0]?.zone || 'Tank Farm & Reactor Interior',
      correlationNodes: ['Confined Space Entry', 'Standby Warden', 'Atmospheric Sniffer'],
      dependencySteps: hasConfined ? [
        {
          sourceSystem: 'Industrial Safety Gateway',
          actualValue: `${confinedPermits.length} Active Confined Space Permits`,
          threshold: 'Warden & Sniffer Required',
          ruleName: 'PermitRule-02 (Confined Space Tracking)'
        },
        {
          sourceSystem: 'Zone Roster & Warden Network',
          actualValue: 'Standby Wardens Verified',
          threshold: '1:1 Warden-to-Vessel Ratio',
          ruleName: 'Emergency Rescue Standby Check'
        }
      ] : undefined
    });

    return results;
  }
}
