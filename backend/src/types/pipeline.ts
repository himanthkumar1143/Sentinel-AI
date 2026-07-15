// ==========================================
// Raw Data Source Interfaces (Diverse Formats)
// ==========================================

export interface GasSensorRaw {
  sensor_id: string;
  timestamp_epoch: number;
  reading_ppm: number;
  gas_type: string;
  status_flag: string;
}

export interface PressureSensorRaw {
  deviceCode: string;
  press_bar: number;
  manifold_name: string;
  read_time: string;
  is_error: boolean;
}

export interface TempSensorRaw {
  unit_tag: string;
  temp_celsius: number;
  core_section: string;
  timestamp: string;
  alert_level: number;
}

export interface HumiditySensorRaw {
  probe_id: string;
  rh_percent: number;
  location: string;
  time_recorded: number;
  sensor_ok: boolean;
}

export interface MaintenanceJobRaw {
  ticket_id: string;
  equipment_code: string;
  job_description: string;
  priority_level: string;
  active: boolean;
  assigned_crew: number;
}

export interface MaintenanceRaw {
  system_id: string;
  query_time: string;
  job_list: MaintenanceJobRaw[];
}

export interface PermitItemRaw {
  permit_no: string;
  work_type: 'HOT_WORK' | 'CONFINED_SPACE' | 'ELECTRICAL' | 'EXCAVATION';
  area_sector: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'REVOKED' | 'CLOSED';
  valid_until: string;
}

export interface PermitRaw {
  system_status: string;
  total_active: number;
  active_permits: PermitItemRaw[];
}

export interface ZoneRosterRaw {
  zone_code: string;
  personnel_count: number;
  emergency_warden: string;
}

export interface WorkforceRaw {
  shift_code: string;
  total_headcount: number;
  last_badge_scan: string;
  zones_roster: ZoneRosterRaw[];
}

export interface WeatherRaw {
  station_id: string;
  ambient_temp: number;
  wind_speed_kmh: number;
  wind_direction: string;
  barometric_pressure_hpa: number;
  precipitation_mm: number;
  condition: string;
  recorded_at: string;
}

// ==========================================
// Merged Collector Output
// ==========================================

export interface RawIndustrialData {
  collectionTimestamp: string;
  scenario: string;
  sources: {
    gas: GasSensorRaw[];
    pressure: PressureSensorRaw[];
    temperature: TempSensorRaw[];
    humidity: HumiditySensorRaw[];
    maintenance: MaintenanceRaw;
    permits: PermitRaw;
    workforce: WorkforceRaw;
    weather: WeatherRaw;
  };
}

// ==========================================
// Validation Interfaces
// ==========================================

export interface ValidationIssue {
  source: string;
  field: string;
  value: any;
  rule: string;
  severity: 'error' | 'warning';
  message: string;
}

export interface ValidationReport {
  isValid: boolean;
  timestamp: string;
  totalChecked: number;
  errorCount: number;
  warningCount: number;
  issues: ValidationIssue[];
}

// ==========================================
// Normalized Interfaces
// ==========================================

export interface NormalizedSensorItem {
  id: string;
  name: string;
  category: 'gas' | 'temperature' | 'pressure' | 'humidity';
  currentValue: number;
  unit: string;
  status: 'safe' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  timestamp: string;
}

export interface NormalizedMaintenanceJob {
  id: string;
  equipmentCode: string;
  description: string;
  priority: 'Routine' | 'High' | 'Emergency';
  isActive: boolean;
  assignedCrewCount: number;
}

export interface NormalizedPermitItem {
  id: string;
  workType: string;
  zone: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'REVOKED' | 'CLOSED';
  validUntil: string;
}

export interface NormalizedZoneWorkforce {
  zoneCode: string;
  workersCount: number;
  warden: string;
}

export interface NormalizedOperationalData {
  workersPresent: number;
  currentShift: string;
  activeMaintenanceJobs: number;
  maintenanceJobsList: NormalizedMaintenanceJob[];
  activePermitsCount: number;
  permitsList: NormalizedPermitItem[];
  zonesWorkforce: NormalizedZoneWorkforce[];
  environmental: {
    ambientTemperature: number;
    windSpeedKmh: number;
    windDirection: string;
    pressureHpa: number;
    precipitationMm: number;
    condition: string;
  };
}

export interface NormalizedIndustrialData {
  normalizationTimestamp: string;
  scenario: string;
  sensors: NormalizedSensorItem[];
  operational: NormalizedOperationalData;
}

// ==========================================
// Unified Plant Model Interface
// ==========================================

export interface UnifiedPlantModel {
  metadata: {
    modelId: string;
    generatedAt: string;
    pipelineVersion: string;
    scenario: string;
  };
  plant: {
    id: string;
    name: string;
    code: string;
    location: string;
    lastUpdated: string;
    overallStatus: 'ONLINE - NORMAL' | 'ELEVATED - WARNING' | 'CRITICAL ALERT - HIGH RISK';
    statusColor: 'safe' | 'warning' | 'critical';
    compoundRiskIndex: number;
  };
  operational: {
    equipmentOperationalPct: number;
    activeChecklistsCount: number;
    currentShift: string;
    overviewSummary: string;
  };
  environmental: {
    ambientTemperature: number;
    windSpeedKmh: number;
    windDirection: string;
    barometricPressureHpa: number;
    humidityPct: number;
    condition: string;
  };
  maintenance: {
    totalActiveJobs: number;
    jobs: Array<{
      id: string;
      equipmentCode: string;
      description: string;
      priority: 'Routine' | 'High' | 'Emergency';
      status: string;
    }>;
  };
  permit: {
    hotWorkCount: number;
    confinedSpaceCount: number;
    statusSummary: string;
    permits: Array<{
      id: string;
      type: string;
      zone: string;
      status: string;
      validUntil: string;
    }>;
  };
  worker: {
    workersPresent: number;
    shiftCode: string;
    zoneDistribution: Array<{
      zoneCode: string;
      workerCount: number;
      warden: string;
    }>;
  };
  sensor: {
    totalActiveSensors: number;
    gasConcentration: number;
    temperature: number;
    pressure: number;
    humidity: number;
    list: Array<{
      id: string;
      name: string;
      category: 'gas' | 'temperature' | 'pressure' | 'humidity';
      value: number;
      unit: string;
      status: 'safe' | 'warning' | 'critical';
      trend: 'up' | 'down' | 'stable';
    }>;
  };
  zones: Array<{
    id: string;
    name: string;
    code: string;
    type: string;
    status: 'safe' | 'warning' | 'critical';
    riskIndex: number;
    equipmentState: string;
    workersCount: number;
    temperature: number;
    pressure: number;
    gasConcentration: number;
    details: string;
  }>;
  timeline: Array<{
    id: string;
    time: string;
    title: string;
    description: string;
    severity: 'info' | 'warning' | 'critical';
    zone: string;
  }>;
  recommendations: Array<{
    id: string;
    title: string;
    category: string;
    priority: string;
    action: string;
    status: string;
  }>;
}

// Pipeline API Response
export interface PipelineExecutionResult {
  pipelineExecutionId: string;
  executionTimeMs: number;
  timestamp: string;
  scenario: string;
  rawSources: RawIndustrialData;
  validationReport: ValidationReport;
  normalizedData: NormalizedIndustrialData;
  unifiedPlantModel: UnifiedPlantModel;
}
