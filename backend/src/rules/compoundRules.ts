import { UnifiedPlantModel, RuleEvaluationResult } from '../types/pipeline';

export class CompoundRules {
  /**
   * Evaluates multi-domain compound rules correlating sensors, permits, maintenance, personnel, and weather.
   * This is the core innovation of Phase 3, bridging domain silos deterministically.
   */
  public static evaluate(upm: UnifiedPlantModel): RuleEvaluationResult[] {
    const results: RuleEvaluationResult[] = [];

    const gasVal = upm.sensor.gasConcentration || 1.4;
    const tempVal = upm.sensor.temperature || 68.4;
    const pressVal = upm.sensor.pressure || 12.4;
    const windSpeed = upm.environmental.windSpeedKmh || 14.2;
    const activePermits = upm.permit.permits.filter(p => p.status === 'ACTIVE');
    const hotWorkPermits = activePermits.filter(p => p.type === 'HOT_WORK');
    const activeJobs = upm.maintenance.jobs.filter(j => j.status === 'In Progress' || j.status === 'Active');
    const totalWorkers = upm.worker.workersPresent || 142;

    const isGasElevated = gasVal > 10.0;
    const isGasCritical = gasVal > 25.0;
    const isTempElevated = tempVal > 85.0;
    const isPressElevated = pressVal > 16.0;

    // CompoundRule-01 (CR-01): Combustible Gas AND Active Hot Work Authorization
    const cr01Triggered = isGasElevated && hotWorkPermits.length > 0;
    results.push({
      ruleId: 'CompoundRule-01',
      ruleName: 'Combustible Gas & Hot Work Conflict Check',
      category: 'Compound',
      purpose: 'Correlates atmospheric combustible gas concentration with active ignition sources (Hot Work permits) across plant sectors.',
      condition: 'Gas > 10.0 PPM AND Active Hot Work Permits > 0',
      threshold: 'Gas <= 10.0 PPM OR Zero Hot Work',
      currentValue: `Gas: ${gasVal.toFixed(1)} PPM | Hot Work Permits: ${hotWorkPermits.length}`,
      isTriggered: cr01Triggered,
      reason: cr01Triggered
        ? `Combustible gas concentration (${gasVal.toFixed(1)} PPM) coincides with active Hot Work permit #${hotWorkPermits[0]?.id || 'HW-101'} in ${hotWorkPermits[0]?.zone || 'Compressor Hall'}.`
        : 'No simultaneous occurrence of combustible gas excursion and active hot work authorization.',
      observationText: cr01Triggered ? 'Combustible gas detected while hot work is authorized.' : undefined,
      severity: isGasCritical ? 'critical' : cr01Triggered ? 'warning' : 'info',
      evidence: cr01Triggered ? [
        `SCADA Gas Sensor Network reading: ${gasVal.toFixed(1)} PPM (Threshold: 10.0 PPM)`,
        `Safety Gateway: Active Hot Work Permit #${hotWorkPermits[0]?.id || 'HW-101'} (${hotWorkPermits[0]?.zone || 'Compressor Hall'})`
      ] : undefined,
      sourceSystem: 'SCADA Gas & Industrial Safety Gateway',
      affectedZone: hotWorkPermits[0]?.zone || 'Compressor Hall & Reactor Sector',
      correlationNodes: ['Gas Sensor', 'Hot Work Permit', 'Explosion Hazard', 'Recommendation'],
      dependencySteps: cr01Triggered ? [
        {
          step: 1,
          label: 'Gas Sensor',
          type: 'Sensor',
          value: `${gasVal.toFixed(1)} PPM`,
          description: 'Combustible gas concentration (> 10.0 PPM) detected by SCADA manifold telemetry.',
          sourceSystem: 'SCADA Gas Sensor Network',
          actualValue: `${gasVal.toFixed(1)} PPM`,
          threshold: '10.0 PPM Combustible Limit',
          ruleName: 'Gas Sensor Monitoring'
        },
        {
          step: 2,
          label: 'Hot Work Permit',
          type: 'Permit',
          value: `Permit #${hotWorkPermits[0]?.id || 'HW-101'} Active`,
          description: `Authorized welding/cutting operations active in ${hotWorkPermits[0]?.zone || 'Compressor Hall'} providing an active ignition source.`,
          sourceSystem: 'Industrial Safety Gateway',
          actualValue: `Permit #${hotWorkPermits[0]?.id || 'HW-101'} Active`,
          threshold: 'Ignition Source Check',
          ruleName: 'Hot Work Authorization Verification'
        },
        {
          step: 3,
          label: 'Explosion Hazard',
          type: 'Compound',
          value: 'Critical Hazard Confirmed',
          description: 'Spatial coincidence of combustible gas and an active ignition source creates an immediate explosion hazard.',
          sourceSystem: 'Operational Context Engine',
          actualValue: 'Spatial Conflict Confirmed',
          threshold: 'Compound Risk Evaluation',
          ruleName: 'Explosion Hazard Correlation'
        },
        {
          step: 4,
          label: 'Recommendation',
          type: 'Rule',
          value: 'Immediate LOTO & Evacuation',
          description: `Immediately suspend all Hot Work permits (#${hotWorkPermits[0]?.id || 'HW-101'}), activate nitrogen quench interlocks, and evacuate ${hotWorkPermits[0]?.zone || 'Compressor Hall'}.`,
          sourceSystem: 'Enterprise Safety Interlock System',
          actualValue: 'Permit Suspension Issued',
          threshold: 'Mandatory Emergency Protocol',
          ruleName: 'Recommendation Protocol (CR-01)'
        }
      ] : undefined
    });

    // CompoundRule-02 (CR-02 / CR-07): Elevated Gas AND Personnel Occupancy
    const cr02Triggered = isGasElevated && totalWorkers > 20;
    results.push({
      ruleId: 'CompoundRule-02',
      ruleName: 'Toxic Gas Personnel Exposure Correlation',
      category: 'Compound',
      purpose: 'Correlates toxic gas excursions with workforce roster density in affected operating sectors.',
      condition: 'Gas > 10.0 PPM AND Personnel Present > 20',
      threshold: 'Gas <= 10.0 PPM OR Evacuated Sector',
      currentValue: `Gas: ${gasVal.toFixed(1)} PPM | Personnel: ${totalWorkers} On-Site`,
      isTriggered: cr02Triggered,
      reason: cr02Triggered
        ? `Toxic gas excursion (${gasVal.toFixed(1)} PPM) elevates personnel exposure risk for ${totalWorkers} workers operating across plant zones.`
        : 'No personnel exposure risk from atmospheric gas concentrations.',
      observationText: cr02Triggered ? 'Personnel exposure risk increased.' : undefined,
      severity: isGasCritical ? 'critical' : cr02Triggered ? 'warning' : 'info',
      evidence: cr02Triggered ? [
        `SCADA Gas Sensor reading: ${gasVal.toFixed(1)} PPM (Threshold: 10.0 PPM)`,
        `SAP Workforce Gateway reporting ${totalWorkers} personnel logged on shift ${upm.worker.shiftCode}`
      ] : undefined,
      sourceSystem: 'SCADA Gas Network & SAP Workforce Gateway',
      affectedZone: 'Reactor Core & Separation Sectors',
      correlationNodes: ['Gas Concentration', 'Personnel Occupancy', 'Exposure Risk'],
      dependencySteps: cr02Triggered ? [
        {
          sourceSystem: 'SCADA Gas Sensor Network',
          actualValue: `${gasVal.toFixed(1)} PPM`,
          threshold: '10.0 PPM Safety Boundary',
          ruleName: 'Gas Excursion Evaluation'
        },
        {
          sourceSystem: 'SAP Workforce Gateway',
          actualValue: `${totalWorkers} Personnel On-Site`,
          threshold: 'Sector Roster Check',
          ruleName: 'Workforce Density Tracking'
        },
        {
          sourceSystem: 'Operational Context Engine',
          actualValue: 'High Personnel Risk',
          threshold: 'Mandatory Headcount Alert',
          ruleName: 'CompoundRule-02 (CR-07)'
        }
      ] : undefined
    });

    // CompoundRule-03 (CR-03): Simultaneous Pressure Rising AND Temperature Rising
    const cr03Triggered = isPressElevated && isTempElevated;
    results.push({
      ruleId: 'CompoundRule-03',
      ruleName: 'Multi-Variable Process Instability Correlation',
      category: 'Compound',
      purpose: 'Identifies simultaneous thermal excursions and hydraulic backpressure indicators of process instability.',
      condition: 'Pressure > 16.0 Bar AND Temperature > 85.0 °C',
      threshold: 'Pressure <= 16.0 Bar AND Temp <= 85.0 °C',
      currentValue: `Pressure: ${pressVal.toFixed(1)} Bar | Temp: ${tempVal.toFixed(1)} °C`,
      isTriggered: cr03Triggered,
      reason: cr03Triggered
        ? `Simultaneous manifold pressure rise (${pressVal.toFixed(1)} Bar) and reactor thermal buildup (${tempVal.toFixed(1)} °C) indicate cascading process instability.`
        : 'Process thermodynamic and hydraulic equilibrium stable across all loops.',
      observationText: cr03Triggered ? 'Process instability indicators detected.' : undefined,
      severity: (pressVal > 20.0 || tempVal > 105.0) ? 'critical' : cr03Triggered ? 'warning' : 'info',
      evidence: cr03Triggered ? [
        `Pressure Manifold Array: ${pressVal.toFixed(1)} Bar (Warning: 16.0 Bar)`,
        `Thermal Core Array: ${tempVal.toFixed(1)} °C (Warning: 85.0 °C)`
      ] : undefined,
      sourceSystem: 'Pressure Manifold & Thermal Core Arrays',
      affectedZone: 'Main Reactor Core & Compressor Hall',
      correlationNodes: ['Manifold Pressure', 'Reactor Temperature', 'Process Instability'],
      dependencySteps: cr03Triggered ? [
        {
          sourceSystem: 'Pressure Manifold Array',
          actualValue: `${pressVal.toFixed(1)} Bar`,
          threshold: '16.0 Bar Hydraulic Limit',
          ruleName: 'Manifold Pressure Evaluation'
        },
        {
          sourceSystem: 'Thermal Core Array',
          actualValue: `${tempVal.toFixed(1)} °C`,
          threshold: '85.0 °C Thermal Equilibrium',
          ruleName: 'Core Thermal Evaluation'
        },
        {
          sourceSystem: 'Operational Context Engine',
          actualValue: 'Coupled Instability',
          threshold: 'Automatic Feed Reduction',
          ruleName: 'CompoundRule-03 (CR-03)'
        }
      ] : undefined
    });

    // CompoundRule-04 (CR-04): Maintenance Active AND Permit Expiring Soon
    const cr04Triggered = activeJobs.length > 0 && activePermits.length > 0;
    results.push({
      ruleId: 'CompoundRule-04',
      ruleName: 'Maintenance & Permit Expiration Dependency Check',
      category: 'Compound',
      purpose: 'Correlates ongoing equipment overhauls with active work permit validity windows.',
      condition: 'Active Maintenance Jobs > 0 AND Active Permits > 0',
      threshold: 'Synchronized Work Schedule',
      currentValue: `Active Jobs: ${activeJobs.length} | Active Permits: ${activePermits.length}`,
      isTriggered: cr04Triggered,
      reason: cr04Triggered
        ? `Ongoing maintenance on equipment ${activeJobs[0]?.equipmentCode || 'EQ-402'} depends on work permit #${activePermits[0]?.id || 'PR-201'} approaching expiration window.`
        : 'No maintenance tasks scheduled against expiring permit authorization windows.',
      observationText: cr04Triggered ? 'Maintenance depends on permit approaching expiration.' : undefined,
      severity: 'info',
      evidence: cr04Triggered ? [
        `SAP Maintenance: Work Order #${activeJobs[0]?.id || 'WO-501'} active (${activeJobs[0]?.description || 'Overhaul'})`,
        `Safety Gateway: Permit #${activePermits[0]?.id || 'PR-201'} valid until ${activePermits[0]?.validUntil || '23:59'}`
      ] : undefined,
      sourceSystem: 'SAP Maintenance & Safety Gateways',
      affectedZone: activePermits[0]?.zone || 'Zone A - Primary Separation',
      correlationNodes: ['Maintenance Overhaul', 'Work Permit Validity', 'Schedule Compliance'],
      dependencySteps: cr04Triggered ? [
        {
          sourceSystem: 'SAP Maintenance Gateway',
          actualValue: `Work Order #${activeJobs[0]?.id || 'WO-501'} Active`,
          threshold: 'Overhaul Schedule Check',
          ruleName: 'Active Maintenance Tracking'
        },
        {
          sourceSystem: 'Industrial Safety Gateway',
          actualValue: `Permit #${activePermits[0]?.id || 'PR-201'} Expiring`,
          threshold: 'Permit Window Compliance',
          ruleName: 'Permit Expiration Monitoring'
        },
        {
          sourceSystem: 'Operational Context Engine',
          actualValue: 'Extension Required',
          threshold: 'Mandatory Re-Authorization',
          ruleName: 'CompoundRule-04 (CR-04)'
        }
      ] : undefined
    });

    // CompoundRule-05 (CR-05): Low Wind Velocity AND Gas Excursion
    const cr05Triggered = windSpeed < 15.0 && isGasElevated;
    results.push({
      ruleId: 'CompoundRule-05',
      ruleName: 'Meteorological & Gas Accumulation Correlation',
      category: 'Compound',
      purpose: 'Correlates low atmospheric ventilation (low wind speed) with localized combustible/toxic gas leaks.',
      condition: 'Wind Speed < 15.0 km/h AND Gas > 10.0 PPM',
      threshold: 'Wind >= 15.0 km/h OR Gas <= 10.0 PPM',
      currentValue: `Wind: ${windSpeed.toFixed(1)} km/h | Gas: ${gasVal.toFixed(1)} PPM`,
      isTriggered: cr05Triggered,
      reason: cr05Triggered
        ? `Reduced atmospheric ventilation (${windSpeed.toFixed(1)} km/h wind) coincides with gas leak (${gasVal.toFixed(1)} PPM), increasing danger of local vapor cloud accumulation.`
        : 'Atmospheric dispersion rates adequate relative to ambient gas sensor readings.',
      observationText: cr05Triggered ? 'Reduced ventilation may increase gas accumulation.' : undefined,
      severity: isGasCritical ? 'critical' : cr05Triggered ? 'warning' : 'info',
      evidence: cr05Triggered ? [
        `Meteorological Station Alpha: Wind Speed ${windSpeed.toFixed(1)} km/h from ${upm.environmental.windDirection || 'NE'}`,
        `SCADA Gas Sensor Network reading: ${gasVal.toFixed(1)} PPM (Threshold: 10.0 PPM)`
      ] : undefined,
      sourceSystem: 'Meteorological Station & SCADA Gas Network',
      affectedZone: 'Outdoor Process Manifolds & Tank Farm',
      correlationNodes: ['Low Wind Speed', 'Gas Concentration', 'Vapor Accumulation'],
      dependencySteps: cr05Triggered ? [
        {
          sourceSystem: 'Meteorological Station Alpha',
          actualValue: `${windSpeed.toFixed(1)} km/h`,
          threshold: '15.0 km/h Minimum Dispersion Limit',
          ruleName: 'Atmospheric Dispersion Check'
        },
        {
          sourceSystem: 'SCADA Gas Sensor Network',
          actualValue: `${gasVal.toFixed(1)} PPM`,
          threshold: '10.0 PPM Baseline',
          ruleName: 'Localized Leak Detection'
        },
        {
          sourceSystem: 'Operational Context Engine',
          actualValue: 'Vapor Cloud Risk',
          threshold: 'Engage Auxiliary Scrubbers',
          ruleName: 'CompoundRule-05 (CR-05)'
        }
      ] : undefined
    });

    return results;
  }
}
