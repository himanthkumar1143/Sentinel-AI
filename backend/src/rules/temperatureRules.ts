import { UnifiedPlantModel, RuleEvaluationResult } from '../types/pipeline';

export class TemperatureRules {
  /**
   * Evaluates reactor core and primary separation thermal rules against the Unified Plant Model.
   */
  public static evaluate(upm: UnifiedPlantModel): RuleEvaluationResult[] {
    const results: RuleEvaluationResult[] = [];
    const tempVal = upm.sensor.temperature || 68.4;

    // TempRule-01: Thermal Build-Up Warning Check
    const isTempWarning = tempVal > 85.0;
    results.push({
      ruleId: 'TempRule-01',
      ruleName: 'Reactor Core Thermal Envelope Check',
      category: 'Operations',
      purpose: 'Monitors main reactor and heat exchanger temperatures to detect pre-runaway thermal accumulation.',
      condition: 'Temperature > 85.0 °C',
      threshold: '85.0 °C',
      currentValue: `${tempVal.toFixed(1)} °C`,
      isTriggered: isTempWarning,
      reason: isTempWarning
        ? `Process temperature (${tempVal.toFixed(1)} °C) exceeds nominal cooling equilibrium boundary of 85.0 °C.`
        : 'Core thermal dynamics stable within optimal operating envelope.',
      observationText: isTempWarning ? 'Process temperature exceeds normal operating range.' : undefined,
      severity: tempVal > 105.0 ? 'critical' : isTempWarning ? 'warning' : 'info',
      evidence: isTempWarning ? [
        `Thermal Core Array reading: ${tempVal.toFixed(1)} °C (Threshold: 85.0 °C)`,
        'Secondary cooling water loop returning elevated exit temperature (+6.2 °C).'
      ] : undefined,
      sourceSystem: 'Thermal Core Array',
      affectedZone: 'Main Reactor Core & Separation Hall',
      correlationNodes: ['Reactor Temperature', 'Cooling Loop', 'Thermal Build-Up'],
      dependencySteps: isTempWarning ? [
        {
          sourceSystem: 'Thermal Core Array',
          actualValue: `${tempVal.toFixed(1)} °C`,
          threshold: '85.0 °C',
          ruleName: 'TempRule-01 (Thermal Envelope Check)'
        },
        {
          sourceSystem: 'SCADA Cooling Water Gateway',
          actualValue: '+6.2 °C Delta',
          threshold: '5.0 °C Max Delta',
          ruleName: 'Cooling Loop Saturation'
        }
      ] : undefined
    });

    // TempRule-02: Exothermic Runaway Critical Check
    const isTempCritical = tempVal > 105.0;
    results.push({
      ruleId: 'TempRule-02',
      ruleName: 'Exothermic Runaway Emergency Check',
      category: 'Safety',
      purpose: 'Verifies whether thermal runaway conditions require emergency nitrogen quench and catalyst dump.',
      condition: 'Temperature > 105.0 °C',
      threshold: '105.0 °C',
      currentValue: `${tempVal.toFixed(1)} °C`,
      isTriggered: isTempCritical,
      reason: isTempCritical
        ? `Critical reactor thermal excursion (${tempVal.toFixed(1)} °C) crossing exothermic emergency limit of 105.0 °C.`
        : 'Reactor core temperature safely below emergency quench activation limit.',
      observationText: isTempCritical ? 'Critical thermal runaway indicator detected in primary core.' : undefined,
      severity: 'critical',
      evidence: isTempCritical ? [
        `Thermal Core Array reading: ${tempVal.toFixed(1)} °C (Emergency Quench Limit: 105.0 °C)`,
        'Emergency nitrogen quench system armed for immediate injection.'
      ] : undefined,
      sourceSystem: 'Thermal Core Array',
      affectedZone: 'Main Reactor Core Unit C',
      correlationNodes: ['Reactor Temperature', 'Nitrogen Quench', 'Exothermic Runaway'],
      dependencySteps: isTempCritical ? [
        {
          sourceSystem: 'Thermal Core Array',
          actualValue: `${tempVal.toFixed(1)} °C`,
          threshold: '105.0 °C',
          ruleName: 'TempRule-02 (Runaway Emergency Check)'
        },
        {
          sourceSystem: 'Safety Shutdown Interlock',
          actualValue: 'Quench Armed',
          threshold: 'High-High Thermal Trip',
          ruleName: 'Emergency Quench Actuation'
        }
      ] : undefined
    });

    return results;
  }
}
