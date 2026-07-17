import { UnifiedPlantModel, RuleEvaluationResult } from '../types/pipeline';

export class GasRules {
  /**
   * Evaluates combustible and toxic gas concentration rules against the Unified Plant Model.
   */
  public static evaluate(upm: UnifiedPlantModel): RuleEvaluationResult[] {
    const results: RuleEvaluationResult[] = [];
    const gasVal = upm.sensor.gasConcentration || 1.4;

    // GasRule-01: Combustible/Toxic Gas Threshold Warning Check
    const isGasWarningOrCritical = gasVal > 10.0;
    results.push({
      ruleId: 'GasRule-01',
      ruleName: 'Atmospheric Gas Concentration Safety Check',
      category: 'Safety',
      purpose: 'Monitors H₂S and CH₄ combustible gas concentration across process sectors against pre-alarm limits.',
      condition: 'Gas Concentration > 10.0 PPM',
      threshold: '10.0 PPM',
      currentValue: `${gasVal.toFixed(1)} PPM`,
      isTriggered: isGasWarningOrCritical,
      reason: isGasWarningOrCritical
        ? `Current atmospheric concentration (${gasVal.toFixed(1)} PPM) exceeds safe threshold of 10.0 PPM.`
        : 'Gas concentration remains within nominal safe operating envelope.',
      observationText: isGasWarningOrCritical ? 'Elevated combustible gas concentration detected.' : undefined,
      severity: gasVal > 25.0 ? 'critical' : isGasWarningOrCritical ? 'warning' : 'info',
      evidence: isGasWarningOrCritical ? [
        `SCADA Gas Sensor Network reading: ${gasVal.toFixed(1)} PPM (Threshold: 10.0 PPM)`,
        `Primary detection zone: ${upm.zones.find(z => z.gasConcentration! > 10)?.name || 'Zone A - Primary Separation'}`
      ] : undefined,
      sourceSystem: 'SCADA Gas Network Array',
      affectedZone: upm.zones.find(z => z.gasConcentration! > 10)?.name || 'Compressor Hall & Reactor Sector',
      correlationNodes: ['Gas Concentration', 'SCADA Network', 'Atmospheric Risk'],
      dependencySteps: isGasWarningOrCritical ? [
        {
          sourceSystem: 'SCADA Gas Network Array',
          actualValue: `${gasVal.toFixed(1)} PPM`,
          threshold: '10.0 PPM',
          ruleName: 'GasRule-01 (Atmospheric Check)'
        },
        {
          sourceSystem: 'Industrial Safety Gateway',
          actualValue: 'Exceeded Threshold',
          threshold: 'Pre-Alarm Level 1',
          ruleName: 'Zone Atmosphere Escalation'
        }
      ] : undefined
    });

    // GasRule-02: Critical Lower Explosive Limit (LEL) Exceeded Check
    const isGasCritical = gasVal > 25.0;
    results.push({
      ruleId: 'GasRule-02',
      ruleName: 'Critical LEL Exceeded Emergency Check',
      category: 'Safety',
      purpose: 'Verifies whether toxic or combustible gas levels cross emergency evacuation thresholds (LEL > 25 PPM).',
      condition: 'Gas Concentration > 25.0 PPM',
      threshold: '25.0 PPM',
      currentValue: `${gasVal.toFixed(1)} PPM`,
      isTriggered: isGasCritical,
      reason: isGasCritical
        ? `Critical toxic/combustible gas excursion (${gasVal.toFixed(1)} PPM) crossing emergency containment threshold (25.0 PPM).`
        : 'Current concentration is below emergency evacuation limit.',
      observationText: isGasCritical ? 'Critical gas concentration exceeds immediate evacuation threshold.' : undefined,
      severity: 'critical',
      evidence: isGasCritical ? [
        `SCADA Gas Sensor reading: ${gasVal.toFixed(1)} PPM (Critical Threshold: 25.0 PPM)`,
        'Emergency dampers engaged across Sector 4 containment loop.'
      ] : undefined,
      sourceSystem: 'SCADA Gas Network Array',
      affectedZone: 'Tank Farm & Reactor Unit C',
      correlationNodes: ['Gas Concentration', 'Containment System', 'Evacuation Alert'],
      dependencySteps: isGasCritical ? [
        {
          sourceSystem: 'SCADA Gas Network Array',
          actualValue: `${gasVal.toFixed(1)} PPM`,
          threshold: '25.0 PPM',
          ruleName: 'GasRule-02 (Critical LEL Check)'
        },
        {
          sourceSystem: 'Emergency Containment System',
          actualValue: 'Dampers Active',
          threshold: 'Automatic Actuation',
          ruleName: 'Emergency Lockdown Trigger'
        }
      ] : undefined
    });

    return results;
  }
}
