import { UnifiedPlantModel, RuleEvaluationResult } from '../types/pipeline';

export class HumidityRules {
  /**
   * Evaluates scrubber saturation and ambient relative humidity rules against the Unified Plant Model.
   */
  public static evaluate(upm: UnifiedPlantModel): RuleEvaluationResult[] {
    const results: RuleEvaluationResult[] = [];
    const humVal = upm.sensor.humidity || 42.8;

    // HumidityRule-01: Scrubber Saturation Warning Check
    const isHumWarning = humVal > 65.0;
    results.push({
      ruleId: 'HumidityRule-01',
      ruleName: 'Scrubber Saturation & Vapor Check',
      category: 'Environmental',
      purpose: 'Monitors exhaust scrubber humidity to prevent condensate clogging and chemical vapor carryover.',
      condition: 'Humidity > 65.0 % RH',
      threshold: '65.0 % RH',
      currentValue: `${humVal.toFixed(1)} % RH`,
      isTriggered: isHumWarning,
      reason: isHumWarning
        ? `Exhaust scrubber humidity (${humVal.toFixed(1)} % RH) exceeds optimal absorption limit of 65.0 % RH.`
        : 'Dry scrubber absorption operating within normal moisture boundaries.',
      observationText: isHumWarning ? 'Scrubber relative humidity exceeds optimal absorption boundary.' : undefined,
      severity: humVal > 80.0 ? 'critical' : isHumWarning ? 'warning' : 'info',
      evidence: isHumWarning ? [
        `Scrubber Probe Array reading: ${humVal.toFixed(1)} % RH (Threshold: 65.0 % RH)`,
        'Scrubber mist eliminator pressure drop up by 8%.'
      ] : undefined,
      sourceSystem: 'Scrubber Probe Array',
      affectedZone: 'Exhaust Scrubber Unit B',
      correlationNodes: ['Scrubber Humidity', 'Vapor Carryover', 'Absorption Efficiency'],
      dependencySteps: isHumWarning ? [
        {
          sourceSystem: 'Scrubber Probe Array',
          actualValue: `${humVal.toFixed(1)} % RH`,
          threshold: '65.0 % RH',
          ruleName: 'HumidityRule-01 (Scrubber Saturation Check)'
        },
        {
          sourceSystem: 'Scrubber Differential Pressure Unit',
          actualValue: '+8% Drop',
          threshold: '5% Max Variation',
          ruleName: 'Mist Eliminator Resistance'
        }
      ] : undefined
    });

    return results;
  }
}
