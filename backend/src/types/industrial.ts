export type ScenarioType = 'normal' | 'warning' | 'critical';

export type StatusLevel = 'safe' | 'warning' | 'critical' | 'maintenance';
export type TrendDirection = 'up' | 'down' | 'stable';

export interface PlantOverview {
  overallStatus: 'ONLINE - NORMAL' | 'ELEVATED - WARNING' | 'CRITICAL ALERT - HIGH RISK';
  statusColor: StatusLevel;
  compoundRiskIndex: number; // 0-100
  activeAlertsCount: number;
  workersOnSite: number;
  activeMaintenanceJobs: number;
  lastUpdated: string;
}

export interface SensorMetric {
  id: string;
  name: string;
  category: 'gas' | 'temperature' | 'pressure' | 'humidity';
  currentValue: number;
  unit: string;
  status: StatusLevel;
  trend: TrendDirection;
  trendLabel: string;
  history: number[]; // For mini sparkline
  thresholds: {
    warning: number;
    critical: number;
  };
}

export interface PlantZone {
  id: string;
  name: string;
  code: string;
  type: 'process' | 'storage' | 'utility' | 'personnel' | 'maintenance';
  status: StatusLevel;
  riskIndex: number;
  equipmentState: 'Operational' | 'Degraded' | 'Offline' | 'Under Inspection';
  workersCount: number;
  temperature?: number;
  pressure?: number;
  gasConcentration?: number;
  details: string;
}

export interface OperationalStatus {
  maintenanceStatus: string;
  permitStatus: string;
  currentShift: string;
  equipmentOperationalPct: number;
  workersPresent: number;
  activeChecklists: number;
}

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  zone: string;
}

export interface RecommendationItem {
  id: string;
  title: string;
  category: 'Safety & Atmosphere' | 'Mechanical & Maintenance' | 'Operational Process' | 'Personnel Protocol';
  priority: 'High' | 'Medium' | 'Routine';
  action: string;
  status: 'Pending Verification' | 'Monitoring' | 'Action Required';
}

export interface RiskTrendPoint {
  time: string;
  riskIndex: number;
  safetyThreshold: number;
  warningThreshold: number;
  criticalThreshold: number;
}

export interface ScenarioInfo {
  id: ScenarioType;
  name: string;
  badge: string;
  description: string;
  simulationNotes: string;
}

export interface IndustrialScenarioPayload {
  scenario: ScenarioInfo;
  overview: PlantOverview;
  sensors: SensorMetric[];
  zones: PlantZone[];
  operationalStatus: OperationalStatus;
  timeline: TimelineEvent[];
  recommendations: RecommendationItem[];
  riskTrend: RiskTrendPoint[];
}
