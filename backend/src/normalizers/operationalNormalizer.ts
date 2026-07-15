import {
  RawIndustrialData,
  NormalizedOperationalData,
  NormalizedMaintenanceJob,
  NormalizedPermitItem,
  NormalizedZoneWorkforce
} from '../types/pipeline';

export class OperationalNormalizer {
  public static normalize(raw: RawIndustrialData): NormalizedOperationalData {
    // 1. Standardize maintenance jobs
    const maintenanceJobsList: NormalizedMaintenanceJob[] = [];
    let activeMaintenanceJobs = 0;

    if (raw.sources.maintenance && Array.isArray(raw.sources.maintenance.job_list)) {
      for (const j of raw.sources.maintenance.job_list) {
        if (j.active) activeMaintenanceJobs++;
        let priority: 'Routine' | 'High' | 'Emergency' = 'Routine';
        if (j.priority_level === 'EMERGENCY') priority = 'Emergency';
        else if (j.priority_level === 'HIGH') priority = 'High';

        maintenanceJobsList.push({
          id: j.ticket_id || 'WO-UNKNOWN',
          equipmentCode: j.equipment_code || 'N/A',
          description: j.job_description || 'Standard maintenance procedure',
          priority,
          isActive: Boolean(j.active),
          assignedCrewCount: Number(j.assigned_crew) || 0
        });
      }
    }

    // 2. Standardize active permits
    const permitsList: NormalizedPermitItem[] = [];
    let activePermitsCount = 0;

    if (raw.sources.permits && Array.isArray(raw.sources.permits.active_permits)) {
      for (const p of raw.sources.permits.active_permits) {
        if (p.status === 'ACTIVE') activePermitsCount++;
        permitsList.push({
          id: p.permit_no || 'PRM-UNKNOWN',
          workType: p.work_type || 'HOT_WORK',
          zone: p.area_sector || 'General Area',
          status: p.status || 'CLOSED',
          validUntil: new Date(p.valid_until || Date.now()).toISOString()
        });
      }
    }

    // 3. Standardize worker roster & shift headcount (workerCount / total_headcount -> workersPresent)
    const workersPresent = Number(raw.sources.workforce?.total_headcount) || 0;
    const currentShift = raw.sources.workforce?.shift_code || 'SHIFT-STANDARD';
    const zonesWorkforce: NormalizedZoneWorkforce[] = [];

    if (raw.sources.workforce && Array.isArray(raw.sources.workforce.zones_roster)) {
      for (const z of raw.sources.workforce.zones_roster) {
        zonesWorkforce.push({
          zoneCode: z.zone_code || 'GENERAL',
          workersCount: Number(z.personnel_count) || 0,
          warden: z.emergency_warden || 'Assigned Officer'
        });
      }
    }

    // 4. Standardize weather / environmental
    const weather = raw.sources.weather || {
      ambient_temp: 25.0,
      wind_speed_kmh: 10.0,
      wind_direction: 'NW',
      barometric_pressure_hpa: 1013.25,
      precipitation_mm: 0.0,
      condition: 'Nominal'
    };

    return {
      workersPresent,
      currentShift,
      activeMaintenanceJobs,
      maintenanceJobsList,
      activePermitsCount,
      permitsList,
      zonesWorkforce,
      environmental: {
        ambientTemperature: Number(weather.ambient_temp) || 25.0,
        windSpeedKmh: Number(weather.wind_speed_kmh) || 0.0,
        windDirection: weather.wind_direction || 'N',
        pressureHpa: Number(weather.barometric_pressure_hpa) || 1013.25,
        precipitationMm: Number(weather.precipitation_mm) || 0.0,
        condition: weather.condition || 'Nominal'
      }
    };
  }
}

export default OperationalNormalizer;
