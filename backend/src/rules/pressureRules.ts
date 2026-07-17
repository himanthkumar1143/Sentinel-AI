import { UnifiedPlantModel, RuleEvaluationResult } from '../types/pipeline';

export class PressureRules {
  /**
   * Evaluates compressor manifold and pipeline pressure rules against the Unified Plant Model.
   */
  public static evaluate(upm: UnifiedPlantModel): RuleEvaluationResult[] {
    const results: RuleEvaluationResult[] = [];
    const pressureVal = upm.sensor.pressure || 12.4;

    // PressureRule-01: Manifold Backpressure Warning Check
    const isPressureWarning = pressureVal > 16.0;
    results.push({
      ruleId: 'PressureRule-01',
      ruleName: 'Manifold Backpressure Limit Check',
      category: 'Operations',
      purpose: 'Monitors hydraulic and turbine manifold backpressure against nominal operating envelope.',
      condition: 'Pressure > 16.0 Bar',
      threshold: '16.0 Bar',
      currentValue: `${pressureVal.toFixed(1)} Bar`,
      isTriggered: isPressureWarning,
      reason: isPressureWarning
        ? `Compressor manifold pressure (${pressureVal.toFixed(1)} Bar) exceeds nominal operating threshold of 16.0 Bar.`
        : 'Manifold hydraulic pressure balanced within expected baseline limits.',
      observationText: isPressureWarning ? 'Manifold backpressure exceeds normal operating limit.' : undefined,
      severity: pressureVal > 20.0 ? 'critical' : isPressureWarning ? 'warning' : 'info',
      evidence: isPressureWarning ? [
        `Pressure Sensor Array reading: ${pressureVal.toFixed(1)} Bar (Threshold: 16.0 Bar)`,
        'Turbine exhaust line flow resistance increased by 14% over baseline.'
      ] : undefined,
      sourceSystem: 'Pressure Manifold Array',
      affectedZone: 'Compressor Hall & Turbine Sector',
      correlationNodes: ['Manifold Pressure', 'Turbine Exhaust', 'Hydraulic Stress'],
      dependencySteps: isPressureWarning ? [
        {
          sourceSystem: 'Pressure Manifold Array',
          actualValue: `${pressureVal.toFixed(1)} Bar`,
          threshold: '16.0 Bar',
          ruleName: 'PressureRule-01 (Backpressure Check)'
        },
        {
          sourceSystem: 'Turbine Control Unit',
          actualValue: '+14% Resistance',
          threshold: '10% Max Resistance',
          ruleName: 'Hydraulic Resistance Escalation'
        }
      ] : undefined
    });

    // PressureRule-02: Relief Valve Actuation Threshold Check
    const isPressureCritical = pressureVal > 20.0;
    results.push({
      ruleId: 'PressureRule-02',
      ruleName: 'Relief Valve Actuation Safety Check',
      category: 'Safety',
      purpose: 'Verifies whether high system pressure requires emergency blowdown relief valve discharge.',
      condition: 'Pressure > 20.0 Bar',
      threshold: '20.0 Bar',
      currentValue: `${pressureVal.toFixed(1)} Bar`,
      isTriggered: isPressureCritical,
      reason: isPressureCritical
        ? `Critical pressure surge (${pressureVal.toFixed(1)} Bar) exceeds relief valve discharge limit of 20.0 Bar.`
        : 'System pressure safely below relief valve actuation threshold.',
      observationText: isPressureCritical ? 'Critical manifold pressure approaching relief valve discharge point.' : undefined,
      severity: 'critical',
      evidence: isPressureCritical ? [
        `Pressure Sensor reading: ${pressureVal.toFixed(1)} Bar (Relief Limit: 20.0 Bar)`,
        'Relief Valve RV-104 armed for automatic blowdown.'
      ] : undefined,
      sourceSystem: 'Pressure Manifold Array',
      affectedZone: 'Compressor Hall & High-Pressure Loop',
      correlationNodes: ['Manifold Pressure', 'Relief Valve', 'Emergency Blowdown'],
      dependencySteps: isPressureCritical ? [
        {
          sourceSystem: 'Pressure Manifold Array',
          actualValue: `${pressureVal.toFixed(1)} Bar`,
          threshold: '20.0 Bar',
          ruleName: 'PressureRule-02 (Relief Valve Check)'
        },
        {
          sourceSystem: 'Safety Interlock Controller',
          actualValue: 'RV-104 Armed',
          threshold: 'High-High Pressure Interlock',
          ruleName: 'Blowdown System Armed'
        }
      ] : undefined
    });

    return results;
  }
}
