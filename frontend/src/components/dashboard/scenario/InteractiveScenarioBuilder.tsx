import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Sliders,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Activity,
  Flame,
  Wrench,
  Moon,
  AlertOctagon,
  Play,
  Save,
  FolderOpen,
  Copy,
  RotateCcw,
  Download,
  Upload,
  CheckCircle2,
  Layers,
  Cpu,
  Users,
  Wind,
  Gauge,
  Thermometer,
  Droplets,
  HardHat,
  ArrowRight
} from 'lucide-react';
import type { WorkspaceType } from '../../layout/TopBar';
import type { IndustrialScenarioPayload } from '../../../types/industrial';
import { simulateScenarioAPI } from '../../../services/api';

// PART 3: Exact State Interface for all 8 Industrial Input Categories
export interface ScenarioBuilderState {
  scenarioName: string;
  scenarioId: string;
  // 1. Gas Monitoring
  gasConcentration: number;
  gasType: 'H2S' | 'CH4' | 'CO' | 'NO2' | 'SO2' | 'NH3' | 'VOC' | 'Hydrocarbon Vapors';
  leakDetected: boolean;
  // 2. Temperature
  temperature: number;
  // 3. Pressure
  pressure: number;
  // 4. Humidity
  humidity: number;
  // 5. Maintenance
  maintenanceActive: boolean;
  equipmentUnderMaintenance: 'None' | 'Compressor Unit B' | 'Main Reactor Core A' | 'Distillation Column 4' | 'Scrubber System 2' | 'High-Pressure Manifold 09';
  // 6. Work Permit
  hotWorkPermit: boolean;
  electricalPermit: boolean;
  confinedSpacePermit: boolean;
  // 7. Workforce
  workersPresent: number;
  contractorCount: number;
  shift: 'Shift A (06:00 - 14:00)' | 'Shift B (14:00 - 22:00)' | 'Shift C - Night (22:00 - 06:00)';
  // 8. Environment
  windSpeed: number;
  ventilationStatus: 'Nominal 100%' | 'Degraded 65%' | 'Emergency Purge Active' | 'Offline / Damper Failure';
}

const DEFAULT_STATE: ScenarioBuilderState = {
  scenarioName: 'Custom Plant Operating Condition',
  scenarioId: `SIM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
  gasConcentration: 1.4,
  gasType: 'H2S',
  leakDetected: false,
  temperature: 68.4,
  pressure: 12.4,
  humidity: 42.8,
  maintenanceActive: false,
  equipmentUnderMaintenance: 'None',
  hotWorkPermit: false,
  electricalPermit: false,
  confinedSpacePermit: false,
  workersPresent: 142,
  contractorCount: 18,
  shift: 'Shift A (06:00 - 14:00)',
  windSpeed: 14.2,
  ventilationStatus: 'Nominal 100%'
};

interface InteractiveScenarioBuilderProps {
  onApplyCustomScenario?: (payload: IndustrialScenarioPayload) => void;
  onSelectWorkspace?: (ws: WorkspaceType) => void;
  autoLoadPreset?: string;
}

// PART 18: Performance optimization subcomponents using React.memo
const SliderField = React.memo(({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit,
  icon: Icon
}: {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
  icon: React.ElementType;
}) => {
  return (
    <div className="space-y-2 bg-carbon-950/80 p-3.5 rounded-xl border border-slateBlue-800/80 transition-all hover:border-slateBlue-700">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-slateBlue-300 font-bold flex items-center gap-2">
          <Icon className="w-3.5 h-3.5 text-industrial-cyan" /> {label}
        </span>
        <span className="text-slate-100 font-extrabold px-2 py-0.5 rounded bg-carbon-900 border border-slateBlue-700">
          {value} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-carbon-900 rounded-lg appearance-none cursor-pointer accent-industrial-cyan"
      />
    </div>
  );
});

const ToggleField = React.memo(({
  label,
  checked,
  onChange,
  activeColor = 'bg-industrial-cyan',
  icon: Icon = Sliders,
  activeLabel = 'ACTIVE',
  inactiveLabel = 'OFF',
  variant = 'cyan'
}: {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
  activeColor?: string;
  icon?: React.ElementType;
  activeLabel?: string;
  inactiveLabel?: string;
  variant?: string;
}) => {
  const badgeBg = variant === 'critical' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : variant === 'warning' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-industrial-cyan/20 text-industrial-cyan border-industrial-cyan/40';
  const toggleBg = variant === 'critical' ? 'bg-rose-500' : variant === 'warning' ? 'bg-amber-500' : activeColor;

  return (
    <div
      onClick={() => onChange(!checked)}
      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between font-mono text-xs ${
        checked
          ? 'bg-carbon-900/90 border-industrial-cyan text-slate-100 shadow-glow-safe/10'
          : 'bg-carbon-950/80 border-slateBlue-800/80 text-slateBlue-400 hover:border-slateBlue-700'
      }`}
    >
      <span className="flex items-center gap-2 font-bold">
        {Icon && <Icon className={`w-3.5 h-3.5 ${checked ? 'text-industrial-cyan' : 'text-slateBlue-500'}`} />}
        {label}
      </span>
      <div className="flex items-center gap-2">
        <span className={`text-[10px] uppercase font-black px-1.5 py-0.5 rounded border ${checked ? badgeBg : 'bg-carbon-900 text-slateBlue-500 border-transparent'}`}>
          {checked ? activeLabel : inactiveLabel}
        </span>
        <div className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 flex items-center ${checked ? toggleBg : 'bg-carbon-950 border border-slateBlue-700'}`}>
          <div className={`w-4 h-4 rounded-full bg-slate-100 shadow transform transition-transform duration-200 ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
        </div>
      </div>
    </div>
  );
});

export const InteractiveScenarioBuilder: React.FC<InteractiveScenarioBuilderProps> = ({
  onApplyCustomScenario,
  onSelectWorkspace,
  autoLoadPreset
}) => {
  const [state, setState] = useState<ScenarioBuilderState>(DEFAULT_STATE);
  const [savedPresets, setSavedPresets] = useState<ScenarioBuilderState[]>(() => {
    try {
      const stored = localStorage.getItem('sentinelai_custom_presets');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });
  const [activeTab, setActiveTab] = useState<'inputs' | 'presets'>('inputs');
  const [presetModalOpen, setPresetModalOpen] = useState<boolean>(false);
  const [newPresetName, setNewPresetName] = useState<string>('');
  const [notification, setNotification] = useState<string | null>(null);

  // PART 16: Progress Stepper during simulation
  const [simulating, setSimulating] = useState<boolean>(false);
  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [simulationComplete, setSimulationComplete] = useState<boolean>(false);

  const showToast = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3800);
  }, []);

  // PART 5 & PART 7: Deterministic Live Risk Calculation & Validation Engine
  const { liveScore, statusColor, validationErrors, validationWarnings, explainabilityFlow } = useMemo(() => {
    const errors: string[] = [];
    const warnings: string[] = [];
    let score = 15; // baseline

    // Validation Engine Check (PART 7)
    if (state.temperature < -50 || state.temperature > 250) {
      errors.push(`Impossible Temperature (${state.temperature}°C). Must be between -50°C and 250°C.`);
    }
    if (state.gasConcentration < 0) errors.push('Gas concentration cannot be negative.');
    if (state.pressure < 0 || state.pressure > 100) errors.push(`Manifold pressure (${state.pressure} Bar) exceeds safety bursting range [0-100 Bar].`);
    if (state.humidity < 0 || state.humidity > 100) errors.push('Relative humidity must be between 0% and 100%.');
    if (state.workersPresent < 0 || state.contractorCount < 0) errors.push('Headcount values cannot be negative.');
    if (state.contractorCount > 0 && state.workersPresent === 0) {
      errors.push('Safety Policy Violation: Contractors registered without supervising shift workers present.');
    }

    // Permit & Gas Conflict Validation
    if ((state.gasConcentration > 20 || state.leakDetected) && state.hotWorkPermit) {
      errors.push('CRITICAL EXPLOSION HAZARD: Active Hot Work Permit in elevated combustible/toxic gas atmosphere.');
    } else if (state.gasConcentration > 10 && state.hotWorkPermit) {
      warnings.push('HIGH RISK WARNING: Hot Work Permit active while combustible gas is above nominal baseline (10 PPM).');
    }

    if (state.maintenanceActive && (state.hotWorkPermit || state.confinedSpacePermit) && state.equipmentUnderMaintenance === 'None') {
      warnings.push('Maintenance active with permits but no specific equipment selected.');
    }

    // Deterministic Compound Score Math (PART 5)
    const flow: Array<{ title: string; detail: string; severity: 'safe' | 'warning' | 'critical' }> = [];

    // Gas factor
    if (state.gasConcentration > 25 || (state.leakDetected && state.gasConcentration > 15)) {
      score += 40;
      flow.push({ title: `Elevated ${state.gasType} Concentration (${state.gasConcentration} PPM)`, detail: 'Exceeded Lower Explosive Limit / Toxic threshold.', severity: 'critical' });
    } else if (state.gasConcentration > 10 || state.leakDetected) {
      score += 20;
      flow.push({ title: `${state.gasType} Gas Pre-Alarm (${state.gasConcentration} PPM)`, detail: 'Atmospheric monitoring frequency doubled.', severity: 'warning' });
    }

    // Temperature factor
    if (state.temperature > 130) {
      score += 30;
      flow.push({ title: `Core Thermal Excursion (${state.temperature}°C)`, detail: 'Reactor operating beyond safe jacket cooling capacity.', severity: 'critical' });
    } else if (state.temperature > 95) {
      score += 15;
      flow.push({ title: `Elevated Temperature (${state.temperature}°C)`, detail: 'Thermal dissipation margin degraded.', severity: 'warning' });
    }

    // Pressure factor
    if (state.pressure > 40) {
      score += 25;
      flow.push({ title: `High Manifold Pressure (${state.pressure} Bar)`, detail: 'Relief valves approaching burst threshold.', severity: 'critical' });
    } else if (state.pressure > 25) {
      score += 12;
      flow.push({ title: `Elevated Line Pressure (${state.pressure} Bar)`, detail: 'Discharge loop backpressure warning.', severity: 'warning' });
    }

    // Compound Conflicts
    if ((state.gasConcentration > 10 || state.leakDetected) && state.hotWorkPermit) {
      score += 35;
      flow.push({ title: 'Ignition Conflict (Hot Work + Gas)', detail: 'Permit #SWP-882 active directly inside combustible gas envelope.', severity: 'critical' });
    }

    if (state.maintenanceActive && state.confinedSpacePermit) {
      score += 15;
      flow.push({ title: `Confined Space Entry (${state.equipmentUnderMaintenance})`, detail: 'Workers entering vessel during active maintenance cycle.', severity: 'warning' });
    }

    if (state.ventilationStatus === 'Offline / Damper Failure') {
      score += 25;
      flow.push({ title: 'Ventilation Damper Failure', detail: 'Primary extraction fans tripped; toxic accumulation accelerated.', severity: 'critical' });
    } else if (state.ventilationStatus === 'Degraded 65%') {
      score += 10;
      flow.push({ title: 'Degraded Ventilation (65%)', detail: 'Air exchange rate reduced in process halls.', severity: 'warning' });
    }

    if (score > 100) score = 100;
    if (score < 5) score = 5;

    let color: 'safe' | 'warning' | 'critical' = 'safe';
    if (score >= 70 || errors.length > 0) color = 'critical';
    else if (score >= 40 || warnings.length > 0) color = 'warning';

    if (flow.length === 0) {
      flow.push({ title: 'Nominal Baseline Operating Parameters', detail: 'All 8 process zones and atmospheric sensors within safe tolerances.', severity: 'safe' });
    }

    return {
      liveScore: score,
      statusColor: color,
      validationErrors: errors,
      validationWarnings: warnings,
      explainabilityFlow: flow
    };
  }, [state]);

  // PART 8: Generate exact UnifiedPlantModel
  const generateUnifiedPlantModel = useCallback(() => {
    const nowIso = new Date().toISOString();
    const overallStatus = statusColor === 'critical' ? 'CRITICAL ALERT - HIGH RISK' : statusColor === 'warning' ? 'ELEVATED - WARNING' : 'ONLINE - NORMAL';

    return {
      metadata: {
        modelId: `UPM-${state.scenarioId}`,
        generatedAt: nowIso,
        pipelineVersion: '2.0.0-PROD',
        scenario: 'custom'
      },
      plant: {
        id: 'PLANT-SENTINEL-ALPHA-01',
        name: state.scenarioName,
        code: 'SIPC-A',
        location: 'Enterprise Industrial Sector 4',
        lastUpdated: nowIso,
        overallStatus,
        statusColor,
        compoundRiskIndex: liveScore
      },
      operational: {
        equipmentOperationalPct: statusColor === 'critical' ? 68.4 : statusColor === 'warning' ? 88.2 : 98.4,
        activeChecklistsCount: statusColor === 'critical' ? 32 : 14,
        currentShift: state.shift,
        overviewSummary: `Simulation "${state.scenarioName}" operating under ${overallStatus}. ${state.workersPresent + state.contractorCount} total personnel on-site across 8 zones.`
      },
      environmental: {
        ambientTemperature: state.temperature,
        windSpeedKmh: state.windSpeed,
        windDirection: 'NW',
        barometricPressureHpa: 1013,
        humidityPct: state.humidity,
        condition: state.windSpeed > 40 ? 'High Wind Warning' : 'Nominal Clear'
      },
      maintenance: {
        totalActiveJobs: state.maintenanceActive ? 3 : 0,
        jobs: state.maintenanceActive ? [
          {
            id: 'WO-SIM-01',
            equipmentCode: state.equipmentUnderMaintenance === 'None' ? 'Compressor Unit B' : state.equipmentUnderMaintenance,
            description: `Active maintenance inspection on ${state.equipmentUnderMaintenance}`,
            priority: statusColor === 'critical' ? 'Emergency' : 'High',
            status: 'In Progress'
          }
        ] : []
      },
      permit: {
        hotWorkCount: state.hotWorkPermit ? 1 : 0,
        confinedSpaceCount: state.confinedSpacePermit ? 1 : 0,
        statusSummary: `${[state.hotWorkPermit ? 'Hot Work (#SWP-882)' : null, state.electricalPermit ? 'Electrical (#ELEC-402)' : null, state.confinedSpacePermit ? 'Confined Space (#CONF-109)' : null].filter(Boolean).join(', ') || 'Nominal Routine Permits'}`,
        permits: [
          state.hotWorkPermit && { id: 'SWP-882', type: 'HOT_WORK', zone: 'Reactor Zone A', status: 'ACTIVE', validUntil: '2026-07-17T23:00:00Z' },
          state.electricalPermit && { id: 'ELEC-402', type: 'ELECTRICAL', zone: 'Compressor Hall', status: 'ACTIVE', validUntil: '2026-07-18T06:00:00Z' },
          state.confinedSpacePermit && { id: 'CONF-109', type: 'CONFINED_SPACE', zone: 'Tank 08 Bay', status: 'ACTIVE', validUntil: '2026-07-17T20:00:00Z' }
        ].filter(Boolean) as any[]
      },
      worker: {
        workersPresent: state.workersPresent + state.contractorCount,
        shiftCode: state.shift,
        zoneDistribution: [
          { zoneCode: 'RZ-ALPHA', workerCount: Math.round(state.workersPresent * 0.35), warden: 'J. Henderson' },
          { zoneCode: 'TF-WEST', workerCount: Math.round(state.workersPresent * 0.25), warden: 'M. Vance' },
          { zoneCode: 'COMP-HALL', workerCount: Math.round(state.workersPresent * 0.2), warden: 'S. Patel' },
          { zoneCode: 'DIST-04', workerCount: Math.round(state.workersPresent * 0.2), warden: 'D. Rossi' }
        ]
      },
      sensor: {
        totalActiveSensors: 2840,
        gasConcentration: state.gasConcentration,
        temperature: state.temperature,
        pressure: state.pressure,
        humidity: state.humidity,
        list: [
          {
            id: 'sens-gas-01',
            name: `Atmospheric ${state.gasType} Sensor Array`,
            category: 'gas' as const,
            value: state.gasConcentration,
            unit: 'PPM',
            status: state.gasConcentration > 25 || state.leakDetected ? 'critical' : state.gasConcentration > 10 ? 'warning' : 'safe',
            trend: state.gasConcentration > 15 ? 'up' : 'stable'
          },
          {
            id: 'sens-temp-01',
            name: 'Main Reactor Core Probe',
            category: 'temperature' as const,
            value: state.temperature,
            unit: '°C',
            status: state.temperature > 130 ? 'critical' : state.temperature > 95 ? 'warning' : 'safe',
            trend: state.temperature > 100 ? 'up' : 'stable'
          },
          {
            id: 'sens-press-01',
            name: 'High-Pressure Manifold Discharge',
            category: 'pressure' as const,
            value: state.pressure,
            unit: 'Bar',
            status: state.pressure > 40 ? 'critical' : state.pressure > 25 ? 'warning' : 'safe',
            trend: state.pressure > 30 ? 'up' : 'stable'
          },
          {
            id: 'sens-hum-01',
            name: 'Ambient Facility Humidity',
            category: 'humidity' as const,
            value: state.humidity,
            unit: '%',
            status: 'safe' as const,
            trend: 'stable' as const
          }
        ]
      },
      zones: [
        {
          id: 'zone-rz-a',
          name: 'Main Reactor Zone A & Fractionation Bay',
          code: 'RZ-ALPHA',
          type: 'process',
          status: statusColor,
          riskIndex: liveScore,
          equipmentState: state.maintenanceActive && state.equipmentUnderMaintenance === 'Main Reactor Core A' ? 'Under Inspection' : statusColor === 'critical' ? 'Degraded' : 'Operational',
          workersCount: Math.round(state.workersPresent * 0.35) + (state.hotWorkPermit ? 12 : 0),
          temperature: state.temperature,
          pressure: state.pressure,
          gasConcentration: state.gasConcentration,
          details: `Simulated custom conditions (${state.gasConcentration} PPM ${state.gasType}, ${state.temperature}°C). ${state.ventilationStatus}.`
        },
        {
          id: 'zone-comp-b',
          name: 'Compressor Hall & Turbine Bay #2',
          code: 'COMP-HALL',
          type: 'process',
          status: state.pressure > 30 || (state.maintenanceActive && state.equipmentUnderMaintenance === 'Compressor Unit B') ? 'warning' : 'safe',
          riskIndex: Math.min(100, Math.round(liveScore * 0.85)),
          equipmentState: state.maintenanceActive && state.equipmentUnderMaintenance === 'Compressor Unit B' ? 'Under Inspection' : 'Operational',
          workersCount: Math.round(state.workersPresent * 0.25),
          temperature: Math.round(state.temperature * 0.9),
          pressure: state.pressure,
          gasConcentration: Math.round(state.gasConcentration * 0.6 * 10) / 10,
          details: 'Discharge manifold monitoring and seal telemetry tracking active.'
        },
        {
          id: 'zone-tank-f',
          name: 'West Tank Farm & Storage Sector 5',
          code: 'TF-WEST',
          type: 'storage',
          status: state.confinedSpacePermit || state.leakDetected ? 'warning' : 'safe',
          riskIndex: Math.min(100, Math.round(liveScore * 0.7)),
          equipmentState: 'Operational',
          workersCount: Math.round(state.workersPresent * 0.2),
          temperature: Math.round(state.temperature * 0.75),
          pressure: 1.2,
          gasConcentration: state.leakDetected ? state.gasConcentration * 1.2 : 0.8,
          details: `Tank farm containment dike status nominal. Contractor headcount: ${state.contractorCount}.`
        },
        {
          id: 'zone-ctrl-r',
          name: 'Enterprise Command & Telemetry Center',
          code: 'CMD-CTR',
          type: 'personnel',
          status: 'safe',
          riskIndex: 12,
          equipmentState: 'Operational',
          workersCount: Math.max(10, Math.round(state.workersPresent * 0.2)),
          temperature: 22.4,
          pressure: 1.0,
          gasConcentration: 0.1,
          details: 'Positive air pressure scrubber active. Shift commanders monitoring simulated scenario.'
        }
      ],
      timeline: [
        {
          id: 'sim-tl-1',
          time: new Date(Date.now() - 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: 'Scenario Builder Simulation Initialized',
          description: `Custom condition "${state.scenarioName}" configured by user.`,
          severity: 'info' as const,
          zone: 'All Sectors'
        },
        state.gasConcentration > 15 && {
          id: 'sim-tl-2',
          time: new Date(Date.now() - 1800000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: `Atmospheric ${state.gasType} Spike (${state.gasConcentration} PPM)`,
          description: 'Combustible gas threshold crossed. Automated telemetry tracking frequency increased.',
          severity: (state.gasConcentration > 25 ? 'critical' : 'warning') as any,
          zone: 'Reactor Zone A'
        },
        state.hotWorkPermit && {
          id: 'sim-tl-3',
          time: new Date(Date.now() - 600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: 'Hot Work Permit Active (#SWP-882)',
          description: 'Welding and torch operations logged inside active process envelope.',
          severity: (state.gasConcentration > 10 ? 'critical' : 'warning') as any,
          zone: 'Reactor Zone A'
        },
        {
          id: 'sim-tl-4',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: `Compound Risk Index Evaluated: ${liveScore} (${overallStatus})`,
          description: 'ContextEngine synthesized custom scenario dependency trees and explainability graph.',
          severity: (statusColor === 'critical' ? 'critical' : statusColor === 'warning' ? 'warning' : 'info') as any,
          zone: 'Control Room'
        }
      ].filter(Boolean) as any[],
      recommendations: [
        state.gasConcentration > 15 && {
          id: 'sim-rec-1',
          title: `Evacuate Non-Essential Personnel from ${state.gasType} Perimeter`,
          category: 'Safety & Atmosphere',
          priority: 'High',
          action: `Deploy hazardous gas containment misting and verify positive air seals in Reactor Zone A (${state.gasConcentration} PPM detected).`,
          status: 'Action Required'
        },
        state.hotWorkPermit && state.gasConcentration > 10 && {
          id: 'sim-rec-2',
          title: 'Immediate Revocation of Hot Work Permit #SWP-882',
          category: 'Safety & Atmosphere',
          priority: 'High',
          action: 'Automatic safety interlock must suspend all welding and spark-producing equipment until gas drops below 5.0 PPM.',
          status: 'Action Required'
        },
        state.pressure > 30 && {
          id: 'sim-rec-3',
          title: 'Engage High-Pressure Manifold Bypass Loop',
          category: 'Mechanical & Maintenance',
          priority: 'High',
          action: `Manifold discharge backpressure (${state.pressure} Bar) exceeds nominal limits. Route discharge to auxiliary flash drum.`,
          status: 'Action Required'
        },
        {
          id: 'sim-rec-4',
          title: 'Synchronize Custom Telemetry with Shift Commanders',
          category: 'Personnel Protocol',
          priority: 'Routine',
          action: `Verify all ${state.workersPresent + state.contractorCount} personnel across ${state.shift} are accounted for via SCADA badges.`,
          status: 'Monitoring'
        }
      ].filter(Boolean) as any[]
    };
  }, [state, liveScore, statusColor]);

  // PART 9, 10 & 16: Pipeline Integration, Progress Stepper & Dashboard Synchronization
  const handleExecuteSimulation = async () => {
    if (validationErrors.length > 0) {
      showToast('Cannot run simulation: Please resolve all validation errors first.');
      return;
    }

    setSimulating(true);
    setSimulationStep(1);
    setSimulationComplete(false);

    const upm = generateUnifiedPlantModel();

    // Step 2: Pipeline running
    await new Promise(r => setTimeout(r, 450));
    setSimulationStep(2);

    // Step 3: Operational Context Intelligence Engine
    await new Promise(r => setTimeout(r, 450));
    setSimulationStep(3);

    // Call real backend simulation or fallback API
    const simulatedPayload = await simulateScenarioAPI(upm);

    // Step 4: AI & Synthesis
    await new Promise(r => setTimeout(r, 450));
    setSimulationStep(4);

    // Step 5: Dashboard Synchronized
    await new Promise(r => setTimeout(r, 350));
    setSimulationStep(5);
    setSimulating(false);
    setSimulationComplete(true);

    if (onApplyCustomScenario && simulatedPayload) {
      onApplyCustomScenario(simulatedPayload);
    }
    showToast(`Scenario "${state.scenarioName}" applied successfully to all enterprise dashboards!`);
  };

  // PART 14: Demo Presets
  const applyPreset = (presetType: string) => {
    switch (presetType) {
      case 'normal':
        setState({
          ...DEFAULT_STATE,
          scenarioName: 'Nominal Baseline Operation',
          scenarioId: 'PRESET-NORM-01',
          gasConcentration: 1.2,
          gasType: 'H2S',
          leakDetected: false,
          temperature: 68.4,
          pressure: 12.0,
          humidity: 43.0,
          maintenanceActive: false,
          equipmentUnderMaintenance: 'None',
          hotWorkPermit: false,
          electricalPermit: false,
          confinedSpacePermit: false,
          workersPresent: 142,
          contractorCount: 12,
          shift: 'Shift A (06:00 - 14:00)',
          windSpeed: 14.0,
          ventilationStatus: 'Nominal 100%'
        });
        showToast('Demo Preset Loaded: Normal Plant Operation');
        break;
      case 'gas-leak':
        setState({
          ...DEFAULT_STATE,
          scenarioName: 'Minor H2S Gas Excursion in Compressor Bay',
          scenarioId: 'PRESET-LEAK-02',
          gasConcentration: 18.5,
          gasType: 'H2S',
          leakDetected: true,
          temperature: 74.2,
          pressure: 18.4,
          humidity: 48.0,
          maintenanceActive: false,
          equipmentUnderMaintenance: 'None',
          hotWorkPermit: false,
          electricalPermit: false,
          confinedSpacePermit: false,
          workersPresent: 120,
          contractorCount: 15,
          shift: 'Shift A (06:00 - 14:00)',
          windSpeed: 8.5,
          ventilationStatus: 'Nominal 100%'
        });
        showToast('Demo Preset Loaded: Minor Gas Leak');
        break;
      case 'maintenance':
        setState({
          ...DEFAULT_STATE,
          scenarioName: 'Scheduled Overhaul of Compressor Unit B',
          scenarioId: 'PRESET-MAINT-03',
          gasConcentration: 2.1,
          gasType: 'CO',
          leakDetected: false,
          temperature: 45.0,
          pressure: 4.2,
          humidity: 38.0,
          maintenanceActive: true,
          equipmentUnderMaintenance: 'Compressor Unit B',
          hotWorkPermit: false,
          electricalPermit: true,
          confinedSpacePermit: true,
          workersPresent: 85,
          contractorCount: 42,
          shift: 'Shift B (14:00 - 22:00)',
          windSpeed: 12.0,
          ventilationStatus: 'Nominal 100%'
        });
        showToast('Demo Preset Loaded: Maintenance Shutdown');
        break;
      case 'critical-explosion':
        setState({
          ...DEFAULT_STATE,
          scenarioName: 'Critical Methane Excursion & Hot Work Ignition Risk',
          scenarioId: 'PRESET-CRIT-04',
          gasConcentration: 38.5,
          gasType: 'CH4',
          leakDetected: true,
          temperature: 145.0,
          pressure: 48.6,
          humidity: 55.0,
          maintenanceActive: false,
          equipmentUnderMaintenance: 'None',
          hotWorkPermit: true,
          electricalPermit: true,
          confinedSpacePermit: false,
          workersPresent: 180,
          contractorCount: 35,
          shift: 'Shift A (06:00 - 14:00)',
          windSpeed: 24.0,
          ventilationStatus: 'Offline / Damper Failure'
        });
        showToast('Demo Preset Loaded: Critical Explosion Risk');
        break;
      case 'night-shift':
        setState({
          ...DEFAULT_STATE,
          scenarioName: 'Night Shift Low-Headcount Monitoring',
          scenarioId: 'PRESET-NIGHT-05',
          gasConcentration: 3.4,
          gasType: 'VOC',
          leakDetected: false,
          temperature: 62.0,
          pressure: 14.0,
          humidity: 62.0,
          maintenanceActive: true,
          equipmentUnderMaintenance: 'Scrubber System 2',
          hotWorkPermit: false,
          electricalPermit: true,
          confinedSpacePermit: false,
          workersPresent: 45,
          contractorCount: 8,
          shift: 'Shift C - Night (22:00 - 06:00)',
          windSpeed: 18.0,
          ventilationStatus: 'Nominal 100%'
        });
        showToast('Demo Preset Loaded: Night Shift');
        break;
      case 'permit-conflict':
        setState({
          ...DEFAULT_STATE,
          scenarioName: 'Simultaneous Hot Work & Confined Space Permit Conflict',
          scenarioId: 'PRESET-CONF-06',
          gasConcentration: 14.0,
          gasType: 'Hydrocarbon Vapors',
          leakDetected: false,
          temperature: 88.0,
          pressure: 22.0,
          humidity: 50.0,
          maintenanceActive: true,
          equipmentUnderMaintenance: 'Main Reactor Core A',
          hotWorkPermit: true,
          electricalPermit: true,
          confinedSpacePermit: true,
          workersPresent: 110,
          contractorCount: 30,
          shift: 'Shift A (06:00 - 14:00)',
          windSpeed: 10.0,
          ventilationStatus: 'Degraded 65%'
        });
        showToast('Demo Preset Loaded: Permit Conflict');
        break;
    }
  };

  useEffect(() => {
    if (autoLoadPreset) {
      applyPreset(autoLoadPreset);
    }
  }, [autoLoadPreset]);

  // PART 11: Local Storage Presets management
  const handleSaveToLocalStorage = () => {
    if (!newPresetName.trim()) {
      showToast('Please enter a preset name before saving.');
      return;
    }
    const newPreset = {
      ...state,
      scenarioName: newPresetName.trim(),
      scenarioId: `USER-${Date.now().toString(36).toUpperCase()}`
    };
    const updated = [newPreset, ...savedPresets];
    setSavedPresets(updated);
    localStorage.setItem('sentinelai_custom_presets', JSON.stringify(updated));
    setNewPresetName('');
    setPresetModalOpen(false);
    showToast(`Preset "${newPreset.scenarioName}" saved to browser Local Storage.`);
  };

  const handleDeletePreset = (id: string) => {
    const updated = savedPresets.filter(p => p.scenarioId !== id);
    setSavedPresets(updated);
    localStorage.setItem('sentinelai_custom_presets', JSON.stringify(updated));
    showToast('Saved preset deleted.');
  };

  // PART 12: Export JSON
  const handleExportJson = () => {
    const upm = generateUnifiedPlantModel();
    const exportBundle = {
      generator: 'SentinelAI Enterprise Scenario Builder',
      exportedAt: new Date().toISOString(),
      scenarioState: state,
      unifiedPlantModel: upm
    };
    const blob = new Blob([JSON.stringify(exportBundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sentinelai_scenario_${state.scenarioId.toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Scenario exported to JSON file.');
  };

  // PART 13: Import JSON with schema validation
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const content = evt.target?.result as string;
        const parsed = JSON.parse(content);
        const importedState = parsed.scenarioState || parsed;

        // Schema validation check (PART 13)
        if (
          typeof importedState.gasConcentration === 'number' &&
          typeof importedState.temperature === 'number' &&
          typeof importedState.workersPresent === 'number'
        ) {
          setState({ ...DEFAULT_STATE, ...importedState });
          showToast('JSON Scenario successfully imported and validated.');
        } else {
          showToast('Validation Error: Invalid JSON schema format.');
        }
      } catch (err) {
        showToast('Error: Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6 text-slateBlue-300 select-none pb-12">
      {/* Toast Notification Bar */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-carbon-800 border border-industrial-cyan text-slate-100 px-4 py-3 rounded-xl shadow-glow-safe flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-industrial-cyan shrink-0" />
          <span className="text-xs font-mono font-medium">{notification}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-carbon-800/90 border border-slateBlue-800 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-industrial-cyan/10 via-transparent to-transparent pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="px-2 py-0.5 rounded-md bg-industrial-cyan/20 border border-industrial-cyan/50 text-industrial-cyan text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                <Sliders className="w-3 h-3" /> Enterprise Interactive Simulation
              </span>
              <span className="text-xs font-mono text-slateBlue-400">Deterministic Engine v2.0</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-100 font-mono uppercase">
              Interactive Industrial Scenario Builder
            </h2>
            <p className="text-xs text-slateBlue-300 max-w-3xl leading-relaxed">
              Design arbitrary operating parameters across all 8 industrial zones. The Scenario Builder deterministically constructs the single source of truth <code className="text-industrial-cyan font-mono">UnifiedPlantModel</code> and executes the Data Pipeline &amp; Operational Context Engine to refresh every enterprise dashboard widget automatically.
            </p>
          </div>

          {/* Quick Actions / Tab switch */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveTab(activeTab === 'inputs' ? 'presets' : 'inputs')}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 border ${
                activeTab === 'presets'
                  ? 'bg-industrial-cyan text-carbon-950 border-industrial-cyan shadow-glow-safe'
                  : 'bg-carbon-900 text-slateBlue-300 border-slateBlue-800 hover:text-slate-100 hover:border-slateBlue-700'
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              <span>Saved Presets ({savedPresets.length})</span>
            </button>

            <button
              onClick={() => setPresetModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-mono font-semibold uppercase bg-carbon-900 hover:bg-slateBlue-800 border border-slateBlue-800 text-slateBlue-300 hover:text-slate-100 flex items-center gap-2 transition-all"
              title="Save current configuration to Local Storage"
            >
              <Save className="w-4 h-4 text-industrial-cyan" />
              <span>Save Scenario</span>
            </button>

            <button
              onClick={() => setState({ ...state, scenarioName: `${state.scenarioName} (Copy)`, scenarioId: `SIM-2026-${Math.floor(1000 + Math.random() * 9000)}` })}
              className="px-3 py-2 rounded-xl text-xs font-mono font-semibold uppercase bg-carbon-900 hover:bg-slateBlue-800 border border-slateBlue-800 text-slateBlue-300 hover:text-slate-100 flex items-center gap-1.5 transition-all"
              title="Duplicate current configuration"
            >
              <Copy className="w-3.5 h-3.5 text-slateBlue-400" />
              <span>Duplicate</span>
            </button>

            <button
              onClick={() => setState(DEFAULT_STATE)}
              className="px-3 py-2 rounded-xl text-xs font-mono font-semibold uppercase bg-carbon-900 hover:bg-slateBlue-800 border border-slateBlue-800 text-slateBlue-400 hover:text-slate-200 flex items-center gap-1.5 transition-all"
              title="Reset to Normal Baseline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <div className="h-6 w-px bg-slateBlue-800 mx-1 hidden sm:block" />

            <button
              onClick={handleExportJson}
              className="px-3 py-2 rounded-xl text-xs font-mono font-semibold uppercase bg-carbon-900 hover:bg-slateBlue-800 border border-slateBlue-800 text-slateBlue-300 hover:text-slate-100 flex items-center gap-1.5 transition-all"
              title="Export Scenario as JSON file"
            >
              <Download className="w-3.5 h-3.5 text-industrial-cyan" />
              <span>Export</span>
            </button>

            <label className="px-3 py-2 rounded-xl text-xs font-mono font-semibold uppercase bg-carbon-900 hover:bg-slateBlue-800 border border-slateBlue-800 text-slateBlue-300 hover:text-slate-100 flex items-center gap-1.5 transition-all cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-industrial-cyan" />
              <span>Import</span>
              <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
            </label>
          </div>
        </div>

        {/* PART 14: Demo Presets Quick Buttons Bar */}
        <div className="mt-6 pt-5 border-t border-slateBlue-800/80">
          <div className="flex items-center gap-2 mb-3 text-xs font-mono uppercase text-slateBlue-400 font-semibold">
            <span>Quick Demo Presets (One-Click Auto-Fill):</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
            {[
              { id: 'normal', label: 'Preset 1: Safe Plant Operation', icon: ShieldCheck, color: 'text-industrial-safe border-industrial-safe/50 hover:border-industrial-safe hover:bg-industrial-safe/15 font-black' },
              { id: 'gas-leak', label: 'Preset 2: Equipment Failure', icon: Activity, color: 'text-industrial-warning border-industrial-warning/50 hover:border-industrial-warning hover:bg-industrial-warning/15 font-black' },
              { id: 'critical-explosion', label: 'Preset 3: Gas Leak + Hot Work', icon: Flame, color: 'text-industrial-critical border-industrial-critical/60 hover:border-industrial-critical hover:bg-industrial-critical/20 font-black animate-pulse shadow-glow-critical/30' },
              { id: 'maintenance', label: 'Maintenance Shutdown', icon: Wrench, color: 'text-industrial-cyan border-industrial-cyan/30 hover:border-industrial-cyan/80 hover:bg-industrial-cyan/10' },
              { id: 'night-shift', label: 'Night Shift', icon: Moon, color: 'text-purple-400 border-purple-500/30 hover:border-purple-500/80 hover:bg-purple-500/10' },
              { id: 'permit-conflict', label: 'Permit Conflict', icon: AlertOctagon, color: 'text-amber-400 border-amber-500/30 hover:border-amber-500/80 hover:bg-amber-500/10' }
            ].map(preset => {
              const Icon = preset.icon;
              return (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset.id)}
                  className={`px-3 py-2.5 rounded-xl border bg-carbon-900/80 text-xs font-mono font-bold uppercase flex items-center gap-2.5 transition-all duration-200 shadow-sm ${preset.color}`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{preset.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* PART 11: Saved Presets Modal */}
      {presetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-carbon-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-carbon-900 border border-slateBlue-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slateBlue-800 pb-3">
              <h3 className="text-sm font-mono font-bold uppercase text-slate-100 flex items-center gap-2">
                <Save className="w-4 h-4 text-industrial-cyan" /> Save Scenario Preset
              </h3>
              <button onClick={() => setPresetModalOpen(false)} className="text-slateBlue-400 hover:text-slate-100 text-xs font-mono">✕</button>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono text-slateBlue-300 uppercase">Preset Name:</label>
              <input
                type="text"
                placeholder="e.g. High Pressure Turbine Test Excursion"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-carbon-950 border border-slateBlue-700 text-xs font-mono text-slate-100 focus:outline-none focus:border-industrial-cyan"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setPresetModalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-mono bg-carbon-800 text-slateBlue-400 hover:text-slate-200">Cancel</button>
              <button onClick={handleSaveToLocalStorage} className="px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase bg-industrial-cyan text-carbon-950 shadow-glow-safe">Save Preset</button>
            </div>
          </div>
        </div>
      )}

      {/* Main Split Layout: Left (40%) Configuration vs Right (60%) Preview */}
      {activeTab === 'presets' ? (
        <div className="bg-carbon-800/80 border border-slateBlue-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-mono font-bold uppercase text-slate-100 flex items-center gap-2 border-b border-slateBlue-800 pb-3">
            <FolderOpen className="w-4 h-4 text-industrial-cyan" /> Saved Scenarios in Browser Local Storage
          </h3>
          {savedPresets.length === 0 ? (
            <div className="p-12 text-center text-slateBlue-400 font-mono text-xs uppercase bg-carbon-900/60 rounded-xl border border-slateBlue-800/60">
              No custom scenarios saved yet. Configure a scenario and click "Save Scenario" above.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedPresets.map((preset) => (
                <div key={preset.scenarioId} className="bg-carbon-900 p-4 rounded-xl border border-slateBlue-800 flex flex-col justify-between space-y-3 shadow-md hover:border-industrial-cyan/40 transition-all">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold uppercase text-slate-100">{preset.scenarioName}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-carbon-950 border border-slateBlue-800 text-industrial-cyan">{preset.scenarioId}</span>
                    </div>
                    <p className="text-[11px] text-slateBlue-400 font-mono">
                      Gas: {preset.gasConcentration} PPM ({preset.gasType}) | Temp: {preset.temperature}°C | Press: {preset.pressure} Bar | Workers: {preset.workersPresent}
                    </p>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slateBlue-800/80">
                    <button
                      onClick={() => handleDeletePreset(preset.scenarioId)}
                      className="px-2.5 py-1 rounded bg-carbon-950 text-slateBlue-400 hover:text-industrial-critical text-[10px] font-mono uppercase border border-slateBlue-800"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        setState(preset);
                        setActiveTab('inputs');
                        showToast(`Loaded scenario: "${preset.scenarioName}"`);
                      }}
                      className="px-3 py-1 rounded bg-industrial-cyan text-carbon-950 text-[10px] font-mono font-bold uppercase shadow-glow-safe hover:scale-105 transition-transform"
                    >
                      Load &amp; Simulate →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN (40% — col-span-5): Scenario Configuration Form */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-carbon-800/90 border border-slateBlue-800 rounded-2xl p-6 space-y-6 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-slateBlue-800 pb-4">
                <div>
                  <h3 className="text-sm font-mono font-extrabold uppercase text-slate-100 tracking-wider flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-industrial-cyan" /> Scenario Configuration
                  </h3>
                  <p className="text-[11px] text-slateBlue-400">Configure parameters for all 8 industrial categories.</p>
                </div>
              </div>

              {/* Editable Scenario Title & ID */}
              <div className="space-y-3 bg-carbon-900/80 p-3.5 rounded-xl border border-slateBlue-800">
                <div>
                  <label className="text-[10px] font-mono text-slateBlue-400 uppercase">Scenario Title / Name:</label>
                  <input
                    type="text"
                    value={state.scenarioName}
                    onChange={(e) => setState({ ...state, scenarioName: e.target.value })}
                    className="w-full mt-1 px-3 py-1.5 rounded-lg bg-carbon-950 border border-slateBlue-700 text-xs font-mono font-bold text-slate-100 focus:outline-none focus:border-industrial-cyan"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slateBlue-400 pt-1">
                  <span>Scenario ID: <strong className="text-industrial-cyan">{state.scenarioId}</strong></span>
                  <span>Target Area: <strong className="text-slate-200">SIPC-Alpha Sector 4</strong></span>
                </div>
              </div>

              {/* Category 1: Gas Monitoring */}
              <div className="space-y-3 pt-2 border-t border-slateBlue-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-slate-200 flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-industrial-cyan" /> 1. Gas Monitoring Array
                  </span>
                  <span className="text-[10px] font-mono text-slateBlue-400">SCADA Bridge Node-01</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slateBlue-400 uppercase">Gas Compound Type:</label>
                    <select
                      value={state.gasType}
                      onChange={(e) => setState({ ...state, gasType: e.target.value as any })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-carbon-900 border border-slateBlue-700 text-xs font-mono font-bold text-slate-100 focus:outline-none focus:border-industrial-cyan"
                    >
                      {['H2S', 'CH4', 'CO', 'NO2', 'SO2', 'NH3', 'VOC', 'Hydrocarbon Vapors'].map(t => (
                        <option key={t} value={t}>{t} ({t === 'H2S' ? 'Hydrogen Sulfide' : t === 'CH4' ? 'Combustible Methane' : t})</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slateBlue-400 uppercase">Atmospheric Status:</label>
                    <div className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase flex items-center justify-center border ${state.gasConcentration > 25 || state.leakDetected ? 'bg-industrial-critical/20 text-industrial-critical border-industrial-critical/50' : state.gasConcentration > 10 ? 'bg-industrial-warning/20 text-industrial-warning border-industrial-warning/50' : 'bg-industrial-safe/20 text-industrial-safe border-industrial-safe/50'}`}>
                      {state.gasConcentration > 25 || state.leakDetected ? 'HIGH EXCURSION' : state.gasConcentration > 10 ? 'PRE-ALARM' : 'NOMINAL SAFE'}
                    </div>
                  </div>
                </div>

                <SliderField
                  label={`Concentration (${state.gasType})`}
                  value={state.gasConcentration}
                  onChange={(val) => setState({ ...state, gasConcentration: val })}
                  min={0}
                  max={50}
                  step={0.5}
                  unit="PPM"
                  icon={Activity}
                />

                <ToggleField
                  label="Atmospheric Gas / Vapor Leak Detected"
                  checked={state.leakDetected}
                  onChange={(val) => setState({ ...state, leakDetected: val })}
                  activeLabel="LEAK DETECTED"
                  inactiveLabel="CONTAINED"
                  variant="critical"
                />
              </div>

              {/* Category 2 & 3: Temperature & Pressure */}
              <div className="space-y-3 pt-4 border-t border-slateBlue-800/80">
                <span className="text-xs font-mono font-bold uppercase text-slate-200 flex items-center gap-2">
                  <Thermometer className="w-3.5 h-3.5 text-industrial-cyan" /> 2 &amp; 3. Thermal &amp; Manifold Pressure
                </span>

                <SliderField
                  label="Main Reactor Core Temp"
                  value={state.temperature}
                  onChange={(val) => setState({ ...state, temperature: val })}
                  min={-50}
                  max={250}
                  step={1}
                  unit="°C"
                  icon={Thermometer}
                />

                <SliderField
                  label="Discharge Manifold Pressure"
                  value={state.pressure}
                  onChange={(val) => setState({ ...state, pressure: val })}
                  min={0}
                  max={100}
                  step={0.5}
                  unit="Bar"
                  icon={Gauge}
                />
              </div>

              {/* Category 4 & 8: Humidity & Environment */}
              <div className="space-y-3 pt-4 border-t border-slateBlue-800/80">
                <span className="text-xs font-mono font-bold uppercase text-slate-200 flex items-center gap-2">
                  <Wind className="w-3.5 h-3.5 text-industrial-cyan" /> 4 &amp; 8. Environmental &amp; Ventilation
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <SliderField
                    label="Relative Humidity"
                    value={state.humidity}
                    onChange={(val) => setState({ ...state, humidity: val })}
                    min={0}
                    max={100}
                    step={1}
                    unit="%"
                    icon={Droplets}
                  />

                  <SliderField
                    label="Surface Wind Speed"
                    value={state.windSpeed}
                    onChange={(val) => setState({ ...state, windSpeed: val })}
                    min={0}
                    max={150}
                    step={1}
                    unit="km/h"
                    icon={Wind}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slateBlue-400 uppercase">Process Hall Ventilation Status:</label>
                  <select
                    value={state.ventilationStatus}
                    onChange={(e) => setState({ ...state, ventilationStatus: e.target.value as any })}
                    className={`w-full px-3 py-2 rounded-xl bg-carbon-900 border text-xs font-mono font-bold focus:outline-none ${state.ventilationStatus === 'Offline / Damper Failure' ? 'text-industrial-critical border-industrial-critical/50 bg-industrial-critical/10' : 'text-slate-100 border-slateBlue-700'}`}
                  >
                    <option value="Nominal 100%">Nominal 100% (Full Air Exchange)</option>
                    <option value="Degraded 65%">Degraded 65% (Fan Unit #3 Offline)</option>
                    <option value="Emergency Purge Active">Emergency Purge Active (Nitrogen Blanket)</option>
                    <option value="Offline / Damper Failure">Offline / Damper Failure (CRITICAL RISK)</option>
                  </select>
                </div>
              </div>

              {/* Category 5: Maintenance */}
              <div className="space-y-3 pt-4 border-t border-slateBlue-800/80">
                <span className="text-xs font-mono font-bold uppercase text-slate-200 flex items-center gap-2">
                  <Wrench className="w-3.5 h-3.5 text-industrial-cyan" /> 5. Maintenance Operations
                </span>

                <ToggleField
                  label="Active Mechanical Maintenance Cycle"
                  checked={state.maintenanceActive}
                  onChange={(val) => setState({ ...state, maintenanceActive: val })}
                  activeLabel="MAINTENANCE ACTIVE"
                  inactiveLabel="NOMINAL OPERATION"
                  variant="warning"
                />

                {state.maintenanceActive && (
                  <div className="space-y-1 pl-4 border-l-2 border-industrial-warning animate-in fade-in duration-200">
                    <label className="text-[10px] font-mono text-slateBlue-300 uppercase font-semibold">Equipment Under Maintenance:</label>
                    <select
                      value={state.equipmentUnderMaintenance}
                      onChange={(e) => setState({ ...state, equipmentUnderMaintenance: e.target.value as any })}
                      className="w-full px-3 py-1.5 rounded-lg bg-carbon-900 border border-slateBlue-700 text-xs font-mono font-bold text-slate-100 focus:outline-none focus:border-industrial-cyan"
                    >
                      {['Compressor Unit B', 'Main Reactor Core A', 'Distillation Column 4', 'Scrubber System 2', 'High-Pressure Manifold 09', 'None'].map(eq => (
                        <option key={eq} value={eq}>{eq}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Category 6: Work Permit */}
              <div className="space-y-3 pt-4 border-t border-slateBlue-800/80">
                <span className="text-xs font-mono font-bold uppercase text-slate-200 flex items-center gap-2">
                  <Flame className="w-3.5 h-3.5 text-industrial-cyan" /> 6. Safety Work Permits
                </span>

                <div className="space-y-2">
                  <ToggleField
                    label="Hot Work Permit (Welding / Open Torch)"
                    checked={state.hotWorkPermit}
                    onChange={(val) => setState({ ...state, hotWorkPermit: val })}
                    activeLabel="HOT WORK ACTIVE (#SWP-882)"
                    inactiveLabel="NO HOT WORK"
                    variant="critical"
                  />

                  <ToggleField
                    label="Electrical Safety Permit"
                    checked={state.electricalPermit}
                    onChange={(val) => setState({ ...state, electricalPermit: val })}
                    activeLabel="ELECTRICAL PERMIT (#ELEC-402)"
                    inactiveLabel="NOMINAL ROUTINE"
                    variant="cyan"
                  />

                  <ToggleField
                    label="Confined Space Entry Permit"
                    checked={state.confinedSpacePermit}
                    onChange={(val) => setState({ ...state, confinedSpacePermit: val })}
                    activeLabel="CONFINED SPACE (#CONF-109)"
                    inactiveLabel="NO ENTRY"
                    variant="warning"
                  />
                </div>
              </div>

              {/* Category 7: Workforce */}
              <div className="space-y-3 pt-4 border-t border-slateBlue-800/80">
                <span className="text-xs font-mono font-bold uppercase text-slate-200 flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-industrial-cyan" /> 7. Workforce Exposure &amp; Shift Roster
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <SliderField
                    label="Shift Workers Present"
                    value={state.workersPresent}
                    onChange={(val) => setState({ ...state, workersPresent: val })}
                    min={0}
                    max={500}
                    step={5}
                    unit="Workers"
                    icon={HardHat}
                  />

                  <SliderField
                    label="Contractor Crew Count"
                    value={state.contractorCount}
                    onChange={(val) => setState({ ...state, contractorCount: val })}
                    min={0}
                    max={200}
                    step={2}
                    unit="Contractors"
                    icon={Users}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slateBlue-400 uppercase">Current Operational Shift:</label>
                  <select
                    value={state.shift}
                    onChange={(e) => setState({ ...state, shift: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-carbon-900 border border-slateBlue-700 text-xs font-mono font-bold text-slate-100 focus:outline-none focus:border-industrial-cyan"
                  >
                    <option value="Shift A (06:00 - 14:00)">Shift A — Morning Operations Team (06:00 - 14:00)</option>
                    <option value="Shift B (14:00 - 22:00)">Shift B — Afternoon Operations Team (14:00 - 22:00)</option>
                    <option value="Shift C - Night (22:00 - 06:00)">Shift C — Night Shift Low-Headcount Roster (22:00 - 06:00)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (60% — col-span-7): Live Scenario Preview & Action Center */}
          <div className="lg:col-span-7 space-y-6 sticky top-20">
            {/* PART 7: Validation Engine Banner */}
            {(validationErrors.length > 0 || validationWarnings.length > 0) && (
              <div className={`p-4 rounded-2xl border space-y-2 shadow-lg transition-all ${validationErrors.length > 0 ? 'bg-industrial-critical/10 border-industrial-critical/70 text-industrial-critical' : 'bg-industrial-warning/10 border-industrial-warning/70 text-industrial-warning'}`}>
                <div className="flex items-center gap-2.5 font-mono font-extrabold uppercase text-xs">
                  {validationErrors.length > 0 ? <ShieldAlert className="w-5 h-5 animate-bounce" /> : <AlertTriangle className="w-5 h-5" />}
                  <span>{validationErrors.length > 0 ? `Enterprise Validation Engine: ${validationErrors.length} Error(s) Detected` : `Safety Advisory: ${validationWarnings.length} Warning(s) Detected`}</span>
                </div>
                <ul className="text-xs space-y-1 font-mono list-disc pl-5 text-slate-200">
                  {validationErrors.map((err, idx) => (
                    <li key={`err-${idx}`} className="text-industrial-critical font-semibold">{err}</li>
                  ))}
                  {validationWarnings.map((warn, idx) => (
                    <li key={`warn-${idx}`} className="text-industrial-warning font-medium">{warn}</li>
                  ))}
                </ul>
                {validationErrors.length > 0 && (
                  <p className="text-[10px] font-mono tracking-wide uppercase text-slateBlue-300 border-t border-industrial-critical/30 pt-2 mt-2">
                    Validation Engine Lockout: Simulation execution is disabled until all critical errors are corrected.
                  </p>
                )}
              </div>
            )}

            {/* PART 5 & PART 6: Live Risk Meter & Scenario Summary */}
            <div className="bg-carbon-800/90 border border-slateBlue-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slateBlue-800 pb-6">
                {/* Radial / Bar Risk Gauge */}
                <div className="flex items-center gap-6 shrink-0">
                  <div className={`w-28 h-28 rounded-2xl flex flex-col items-center justify-center border-2 shadow-2xl relative overflow-hidden transition-all duration-500 ${
                    statusColor === 'critical'
                      ? 'bg-gradient-to-br from-industrial-critical/30 to-carbon-950 border-industrial-critical shadow-[0_0_30px_rgba(239,68,68,0.4)]'
                      : statusColor === 'warning'
                      ? 'bg-gradient-to-br from-industrial-warning/30 to-carbon-950 border-industrial-warning shadow-[0_0_25px_rgba(245,158,11,0.3)]'
                      : 'bg-gradient-to-br from-industrial-safe/30 to-carbon-950 border-industrial-safe shadow-[0_0_25px_rgba(16,185,129,0.3)]'
                  }`}>
                    <span className="text-[10px] font-mono uppercase text-slateBlue-300 font-bold tracking-wider">Live Risk</span>
                    <span className={`text-4xl font-black font-mono tracking-tighter ${statusColor === 'critical' ? 'text-industrial-critical animate-pulse' : statusColor === 'warning' ? 'text-industrial-warning' : 'text-industrial-safe'}`}>
                      {liveScore}
                    </span>
                    <span className="text-[9px] font-mono uppercase text-slateBlue-400">Index (0-100)</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-md font-mono font-extrabold uppercase text-xs tracking-wider border ${
                        statusColor === 'critical'
                          ? 'bg-industrial-critical text-carbon-950 border-industrial-critical shadow-glow-critical'
                          : statusColor === 'warning'
                          ? 'bg-industrial-warning text-carbon-950 border-industrial-warning'
                          : 'bg-industrial-safe text-carbon-950 border-industrial-safe'
                      }`}>
                        {statusColor === 'critical' ? 'CRITICAL ALERT - HIGH RISK' : statusColor === 'warning' ? 'ELEVATED - WARNING' : 'ONLINE - NORMAL SAFE'}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-slateBlue-300">
                      Deterministic Evaluation: <strong className="text-slate-100">{explainabilityFlow.length} Active Contributing Factors</strong>
                    </p>
                    <p className="text-[11px] text-slateBlue-400 max-w-sm">
                      {statusColor === 'critical'
                        ? 'Compound risk excursion threshold crossed. Immediate automated safety interlocks will trigger upon generation.'
                        : statusColor === 'warning'
                        ? 'Pre-alarm threshold exceeded. Operational Context Engine will synthesize advisory trees.'
                        : 'Nominal atmospheric and process baseline parameters across all units.'}
                    </p>
                  </div>
                </div>

                {/* Scenario Summary Metrics Panel */}
                <div className="grid grid-cols-2 gap-3 bg-carbon-900/90 p-4 rounded-xl border border-slateBlue-800 w-full md:w-auto shrink-0">
                  <div className="space-y-0.5 border-r border-slateBlue-800 pr-3">
                    <span className="text-[10px] font-mono uppercase text-slateBlue-400">Total Personnel:</span>
                    <p className="text-base font-mono font-black text-slate-100">{state.workersPresent + state.contractorCount}</p>
                    <span className="text-[9px] font-mono text-industrial-cyan">{state.workersPresent} shift / {state.contractorCount} contr.</span>
                  </div>
                  <div className="space-y-0.5 pl-1">
                    <span className="text-[10px] font-mono uppercase text-slateBlue-400">Completeness:</span>
                    <p className="text-base font-mono font-black text-industrial-safe flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-industrial-safe" /> 100%
                    </p>
                    <span className="text-[9px] font-mono text-slateBlue-400">All 8 categories checked</span>
                  </div>
                </div>
              </div>

              {/* PART 15: Explainability — Deterministic Live Contribution Tree */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold uppercase text-slate-200 flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-industrial-cyan" /> Deterministic Risk Contribution Tree
                  </h4>
                  <span className="text-[10px] font-mono text-slateBlue-400">Rule Engine v2.0 Live Evaluation</span>
                </div>

                <div className="bg-carbon-900/80 p-4 rounded-xl border border-slateBlue-800 space-y-2.5 font-mono text-xs">
                  {explainabilityFlow.map((item, idx) => (
                    <React.Fragment key={`flow-${idx}`}>
                      <div className={`p-2.5 rounded-lg border flex items-start justify-between gap-3 ${
                        item.severity === 'critical'
                          ? 'bg-industrial-critical/15 border-industrial-critical/60 text-slate-100'
                          : item.severity === 'warning'
                          ? 'bg-industrial-warning/15 border-industrial-warning/60 text-slate-100'
                          : 'bg-carbon-950 border-slateBlue-800 text-slateBlue-300'
                      }`}>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2 font-bold">
                            <span className={`px-1.5 py-0.2 text-[9px] rounded uppercase ${item.severity === 'critical' ? 'bg-industrial-critical text-carbon-950 font-black' : item.severity === 'warning' ? 'bg-industrial-warning text-carbon-950 font-black' : 'bg-industrial-safe text-carbon-950'}`}>
                              {item.severity.toUpperCase()}
                            </span>
                            <span>{item.title}</span>
                          </div>
                          <p className="text-[11px] text-slateBlue-300 font-sans">{item.detail}</p>
                        </div>
                      </div>
                      {idx < explainabilityFlow.length - 1 && (
                        <div className="flex justify-center -my-1 text-industrial-cyan/60">
                          ↓
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* PART 16: Progress Stepper during simulation */}
              {simulating && (
                <div className="mt-6 p-5 rounded-2xl bg-carbon-900 border border-industrial-cyan shadow-glow-safe space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-slateBlue-800 pb-3">
                    <span className="text-xs font-mono font-extrabold uppercase text-industrial-cyan flex items-center gap-2 animate-pulse">
                      <Cpu className="w-4 h-4 animate-spin" /> Executing Enterprise Industrial Simulation...
                    </span>
                    <span className="text-[10px] font-mono text-slateBlue-400">Step {simulationStep} of 5</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 font-mono text-[11px]">
                    {[
                      { step: 1, label: '1. Scenario Created', detail: `UPM-${state.scenarioId}` },
                      { step: 2, label: '2. Pipeline Running', detail: 'Collection & Normalization' },
                      { step: 3, label: '3. Context Engine', detail: '52 Engineering Rules' },
                      { step: 4, label: '4. AI Assessment', detail: 'Explainable Synthesis' },
                      { step: 5, label: '5. Dashboard Synced', detail: '10 Widgets Refreshed' }
                    ].map(st => {
                      const isDone = simulationStep > st.step;
                      const isCurr = simulationStep === st.step;
                      return (
                        <div key={st.step} className={`p-2.5 rounded-xl border flex flex-col justify-between transition-all ${
                          isDone
                            ? 'bg-industrial-safe/20 border-industrial-safe/60 text-slate-100 font-bold'
                            : isCurr
                            ? 'bg-industrial-cyan/20 border-industrial-cyan text-industrial-cyan shadow-glow-safe font-extrabold scale-105'
                            : 'bg-carbon-950 border-slateBlue-800/80 text-slateBlue-500 opacity-60'
                        }`}>
                          <div className="flex items-center justify-between">
                            <span>{st.label}</span>
                            {isDone ? <CheckCircle2 className="w-3.5 h-3.5 text-industrial-safe" /> : isCurr ? <span className="w-2 h-2 rounded-full bg-industrial-cyan animate-ping" /> : null}
                          </div>
                          <span className="text-[9px] text-slateBlue-400 mt-1">{st.detail}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Simulation Complete Success Banner & Navigation Actions */}
              {simulationComplete && !simulating && (
                <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-industrial-safe/20 via-carbon-900 to-industrial-cyan/20 border border-industrial-safe/60 shadow-xl space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-slate-100 font-mono font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-industrial-safe animate-bounce" />
                      <span>Scenario "{state.scenarioName}" Successfully Generated &amp; Synchronized!</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-industrial-safe text-carbon-950 font-black uppercase">
                      ACTIVE SINGLE SOURCE OF TRUTH
                    </span>
                  </div>
                  <p className="text-xs text-slateBlue-200">
                    The <code className="text-industrial-cyan font-mono">UnifiedPlantModel</code> was generated and executed through the Data Pipeline &amp; Operational Context Engine. All 10 enterprise dashboard workspaces are now populated with your custom simulated telemetry.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <button
                      onClick={() => onSelectWorkspace && onSelectWorkspace('overview')}
                      className="px-3.5 py-1.5 rounded-lg bg-industrial-cyan text-carbon-950 text-xs font-mono font-extrabold uppercase shadow-glow-safe hover:scale-105 transition-all flex items-center gap-1.5"
                    >
                      <span>View Control Room Overview</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onSelectWorkspace && onSelectWorkspace('operations')}
                      className="px-3 py-1.5 rounded-lg bg-carbon-800 hover:bg-slateBlue-800 text-slate-100 text-xs font-mono font-bold uppercase border border-slateBlue-700 transition-all flex items-center gap-1.5"
                    >
                      <span>Operations &amp; Timeline</span>
                    </button>
                    <button
                      onClick={() => onSelectWorkspace && onSelectWorkspace('intelligence')}
                      className="px-3 py-1.5 rounded-lg bg-carbon-800 hover:bg-slateBlue-800 text-slate-100 text-xs font-mono font-bold uppercase border border-slateBlue-700 transition-all flex items-center gap-1.5"
                    >
                      <span>Explainable AI Dashboard</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Primary Action Button: PART 8, 9 & 10 */}
              <div className="mt-6 pt-5 border-t border-slateBlue-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs font-mono text-slateBlue-400">
                  <span>Target Pipeline: <strong className="text-slate-200">Data Pipeline → Operational Context → AI</strong></span>
                </div>
                <button
                  onClick={handleExecuteSimulation}
                  disabled={validationErrors.length > 0 || simulating}
                  className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-mono font-black uppercase text-sm tracking-wider flex items-center justify-center gap-3 transition-all duration-300 ${
                    validationErrors.length > 0
                      ? 'bg-carbon-950 text-slateBlue-600 border border-slateBlue-800/80 cursor-not-allowed opacity-60'
                      : simulating
                      ? 'bg-industrial-cyan/50 text-carbon-950 cursor-wait shadow-glow-safe'
                      : 'bg-gradient-to-r from-industrial-cyan to-industrial-safe text-carbon-950 shadow-glow-safe hover:scale-105 hover:shadow-[0_0_35px_rgba(6,182,212,0.6)]'
                  }`}
                >
                  <Play className={`w-5 h-5 fill-current ${simulating ? 'animate-spin' : ''}`} />
                  <span>{simulating ? 'Simulating Pipeline & Refreshing Dashboards...' : 'Generate Scenario & Sync Dashboard'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveScenarioBuilder;
