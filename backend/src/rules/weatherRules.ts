import { UnifiedPlantModel, RuleEvaluationResult } from '../types/pipeline';

export class WeatherRules {
  /**
   * Evaluates environmental and atmospheric ventilation rules against the Unified Plant Model.
   */
  public static evaluate(upm: UnifiedPlantModel): RuleEvaluationResult[] {
    const results: RuleEvaluationResult[] = [];
    const windSpeed = upm.environmental.windSpeedKmh || 14.2;
    const isLowWind = windSpeed < 15.0;

    // WeatherRule-01: Low Wind Dispersion & Ventilation Check
    results.push({
      ruleId: 'WeatherRule-01',
      ruleName: 'Atmospheric Dispersion & Ventilation Check',
      category: 'Environmental',
      purpose: 'Evaluates ambient wind velocity to determine whether natural atmospheric dispersion is sufficient to disperse gas leaks.',
      condition: 'Wind Speed < 15.0 km/h',
      threshold: '15.0 km/h Minimum Dispersion Velocity',
      currentValue: `${windSpeed.toFixed(1)} km/h (${upm.environmental.windDirection || 'NE'})`,
      isTriggered: isLowWind,
      reason: isLowWind
        ? `Low ambient wind speed (${windSpeed.toFixed(1)} km/h) reduces natural atmospheric ventilation and gas dispersion.`
        : 'Ambient wind velocity sufficient for natural atmospheric dispersion.',
      observationText: isLowWind ? 'Reduced atmospheric ventilation detected due to low ambient wind velocity.' : undefined,
      severity: 'info',
      evidence: isLowWind ? [
        `Meteorological Station Alpha reading: Wind Speed ${windSpeed.toFixed(1)} km/h from ${upm.environmental.windDirection || 'NE'}`,
        `Barometric Pressure: ${upm.environmental.barometricPressureHpa || 1013.2} hPa (${upm.environmental.condition || 'Clear'})`
      ] : undefined,
      sourceSystem: 'Meteorological Station Alpha',
      affectedZone: 'Outdoor Process Manifolds & Tank Farm',
      correlationNodes: ['Ambient Wind Speed', 'Atmospheric Dispersion', 'Vapor Accumulation'],
      dependencySteps: isLowWind ? [
        {
          sourceSystem: 'Meteorological Station Alpha',
          actualValue: `${windSpeed.toFixed(1)} km/h`,
          threshold: '15.0 km/h Dispersion Limit',
          ruleName: 'WeatherRule-01 (Dispersion Check)'
        },
        {
          sourceSystem: 'Environmental Monitoring Gateway',
          actualValue: `${upm.environmental.barometricPressureHpa || 1013.2} hPa`,
          threshold: 'Stable Barometric Gradient',
          ruleName: 'Inversion Layer Verification'
        }
      ] : undefined
    });

    return results;
  }
}
