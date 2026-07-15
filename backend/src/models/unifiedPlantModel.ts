import { NormalizedIndustrialData, UnifiedPlantModel } from '../types/pipeline';
import { SCENARIOS_DATA } from '../data/mockData';

export class UnifiedPlantModelBuilder {
  /**
   * Generates the enterprise Unified Plant Model from normalized data.
   * Synthesizes Plant, Operational, Environmental, Maintenance, Permit, Worker, Sensor, and Zone objects.
   */
  public static build(normalized: NormalizedIndustrialData, scenario: string = 'normal'): UnifiedPlantModel {
    const nowIso = new Date().toISOString();
    const op = normalized.operational;
    const sensors = normalized.sensors;

    // Determine status colors and scores based on scenario and normalized values
    let overallStatus: 'ONLINE - NORMAL' | 'ELEVATED - WARNING' | 'CRITICAL ALERT - HIGH RISK' = 'ONLINE - NORMAL';
    let statusColor: 'safe' | 'warning' | 'critical' = 'safe';
    let compoundRiskIndex = 18;

    if (scenario === 'critical' || sensors.some((s: any) => s.status === 'critical')) {
      overallStatus = 'CRITICAL ALERT - HIGH RISK';
      statusColor = 'critical';
      compoundRiskIndex = 89;
    } else if (scenario === 'warning' || sensors.some((s: any) => s.status === 'warning')) {
      overallStatus = 'ELEVATED - WARNING';
      statusColor = 'warning';
      compoundRiskIndex = 64;
    }

    // Extract sensor category averages or values
    const gasItem = sensors.find((s: any) => s.category === 'gas');
    const tempItem = sensors.find((s: any) => s.category === 'temperature');
    const pressItem = sensors.find((s: any) => s.category === 'pressure');
    const humItem = sensors.find((s: any) => s.category === 'humidity');

    const gasConcentration = gasItem ? gasItem.currentValue : 1.4;
    const temperature = tempItem ? tempItem.currentValue : 68.4;
    const pressure = pressItem ? pressItem.currentValue : 12.4;
    const humidity = humItem ? humItem.currentValue : 42.8;

    // Get fallback scenario zones, timeline, and recommendations from mockData
    const mockRef = SCENARIOS_DATA[scenario as keyof typeof SCENARIOS_DATA] || SCENARIOS_DATA.normal;

    return {
      metadata: {
        modelId: `UPM-${scenario.toUpperCase()}-001`,
        generatedAt: nowIso,
        pipelineVersion: '2.0.0-PROD',
        scenario
      },
      plant: {
        id: 'PLANT-SENTINEL-ALPHA-01',
        name: 'SentinelAI Industrial Petrochemical Complex Alpha',
        code: 'SIPC-A',
        location: 'Enterprise Industrial Sector 4',
        lastUpdated: nowIso,
        overallStatus,
        statusColor,
        compoundRiskIndex
      },
      operational: {
        equipmentOperationalPct: statusColor === 'critical' ? 62.1 : statusColor === 'warning' ? 89.2 : 98.4,
        activeChecklistsCount: statusColor === 'critical' ? 34 : statusColor === 'warning' ? 22 : 14,
        currentShift: op.currentShift,
        overviewSummary: `Plant operating under ${overallStatus}. ${op.workersPresent} personnel on-site across 8 zones.`
      },
      environmental: {
        ambientTemperature: op.environmental.ambientTemperature,
        windSpeedKmh: op.environmental.windSpeedKmh,
        windDirection: op.environmental.windDirection,
        barometricPressureHpa: op.environmental.pressureHpa,
        humidityPct: humidity,
        condition: op.environmental.condition
      },
      maintenance: {
        totalActiveJobs: op.activeMaintenanceJobs,
        jobs: op.maintenanceJobsList.map((j: any) => ({
          id: j.id,
          equipmentCode: j.equipmentCode,
          description: j.description,
          priority: j.priority,
          status: j.isActive ? 'In Progress' : 'Pending'
        }))
      },
      permit: {
        hotWorkCount: op.permitsList.filter((p: any) => p.workType === 'HOT_WORK' && p.status === 'ACTIVE').length,
        confinedSpaceCount: op.permitsList.filter((p: any) => p.workType === 'CONFINED_SPACE' && p.status === 'ACTIVE').length,
        statusSummary: `${op.permitsList.length} Active Work Permits tracked via Industrial Safety Gateway`,
        permits: op.permitsList.map((p: any) => ({
          id: p.id,
          type: p.workType,
          zone: p.zone,
          status: p.status,
          validUntil: p.validUntil
        }))
      },
      worker: {
        workersPresent: op.workersPresent,
        shiftCode: op.currentShift,
        zoneDistribution: op.zonesWorkforce.map((z: any) => ({
          zoneCode: z.zoneCode,
          workerCount: z.workersCount,
          warden: z.warden
        }))
      },
      sensor: {
        totalActiveSensors: sensors.length * 355,
        gasConcentration,
        temperature,
        pressure,
        humidity,
        list: sensors.map((s: any) => ({
          id: s.id,
          name: s.name,
          category: s.category,
          value: s.currentValue,
          unit: s.unit,
          status: s.status,
          trend: s.trend
        }))
      },
      zones: (mockRef.zones || []).map((z: any) => ({
        id: z.id,
        name: z.name,
        code: z.code,
        type: z.type,
        status: z.status as 'safe' | 'warning' | 'critical',
        riskIndex: z.riskIndex,
        equipmentState: z.equipmentState,
        workersCount: z.workersCount,
        temperature: z.temperature,
        pressure: z.pressure,
        gasConcentration: z.gasConcentration,
        details: z.details
      })),
      timeline: (mockRef.timeline || []).map((t: any) => ({
        id: t.id,
        time: t.time,
        title: t.title,
        description: t.description,
        severity: t.severity as 'info' | 'warning' | 'critical',
        zone: t.zone
      })),
      recommendations: (mockRef.recommendations || []).map((r: any) => ({
        id: r.id,
        title: r.title,
        category: r.category,
        priority: r.priority,
        action: r.action,
        status: r.status
      }))
    };
  }
}

export default UnifiedPlantModelBuilder;
