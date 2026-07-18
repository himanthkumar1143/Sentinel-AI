import { Request, Response } from 'express';
import { SCENARIOS_DATA, SCENARIO_INFOS } from '../data/mockData';
import { ScenarioType } from '../types/industrial';
import { PipelineService } from '../services/pipelineService';


import { ContextEngine } from '../context/ContextEngine';
import { UnifiedPlantModel } from '../types/pipeline';

function getScenarioKey(req: Request): ScenarioType {
  const queryScenario = req.query.scenario as string;
  if (queryScenario === 'warning' || queryScenario === 'critical' || queryScenario === 'normal') {
    return queryScenario;
  }
  return 'normal';
}

export const getDashboardOverview = (req: Request, res: Response) => {
  const scenario = getScenarioKey(req);
  const data = SCENARIOS_DATA[scenario];
  res.json({
    scenario: data.scenario,
    overview: data.overview,
    riskTrend: data.riskTrend,
    timestamp: new Date().toISOString()
  });
};

export const getSensorsData = (req: Request, res: Response) => {
  const scenario = getScenarioKey(req);
  const data = SCENARIOS_DATA[scenario];
  res.json({
    scenario: data.scenario.id,
    sensors: data.sensors,
    timestamp: new Date().toISOString()
  });
};

export const getPlantStatusData = (req: Request, res: Response) => {
  const scenario = getScenarioKey(req);
  const data = SCENARIOS_DATA[scenario];
  res.json({
    scenario: data.scenario.id,
    operationalStatus: data.operationalStatus,
    zones: data.zones,
    timeline: data.timeline,
    recommendations: data.recommendations,
    timestamp: new Date().toISOString()
  });
};

export const getScenariosList = (_req: Request, res: Response) => {
  res.json({
    scenarios: Object.values(SCENARIO_INFOS),
    defaultScenario: 'normal',
    timestamp: new Date().toISOString()
  });
};

export const getFullScenarioPayload = async (req: Request, res: Response) => {
  const scenario = getScenarioKey(req);
  const data = { ...SCENARIOS_DATA[scenario] };
  try {
    const pipelineResult = await PipelineService.runIntegrationPipeline(scenario);
    if (pipelineResult.operationalContext) {
      (data as any).operationalContext = pipelineResult.operationalContext;
    }
  } catch (err) {
    console.error('Error attaching operationalContext to payload:', err);
  }
  res.json(data);
};

export const simulateCustomScenario = async (req: Request, res: Response): Promise<void> => {
  try {
    const upm: UnifiedPlantModel = req.body.unifiedPlantModel || req.body;
    if (!upm || !upm.plant || !upm.sensor) {
      res.status(400).json({
        success: false,
        error: 'Invalid UnifiedPlantModel schema',
        message: 'Must provide a valid UnifiedPlantModel conforming to Phase 2/3 specification.'
      });
      return;
    }

    const scenarioKey = upm.metadata?.scenario || 'custom';
    console.log(`[Phase 5: Scenario Builder] Running simulation for custom model ID: ${upm.metadata?.modelId || 'CUSTOM'}`);

    // Execute Phase 3 Operational Context Intelligence Engine
    const operationalContext = ContextEngine.execute(upm, scenarioKey);
    upm.operationalContext = operationalContext;

    // Build synchronized dashboard overview & payload (PART 10)
    const overallRisk = upm.plant.statusColor || 'safe';
    const baseMock = overallRisk === 'critical'
      ? SCENARIOS_DATA.critical
      : overallRisk === 'warning'
      ? SCENARIOS_DATA.warning
      : SCENARIOS_DATA.normal;

    const customPayload = {
      ...baseMock,
      scenario: {
        id: 'custom' as any,
        name: upm.plant.name || 'Custom Scenario Simulation',
        badge: upm.plant.overallStatus || 'CUSTOM SIMULATION',
        description: `User-generated industrial simulation (${upm.sensor.list.length} sensors active, ${upm.worker.workersPresent} personnel on-site).`,
        simulationNotes: `Active simulation running through ContextEngine (Score: ${upm.plant.compoundRiskIndex}).`
      },
      overview: {
        overallStatus: upm.plant.overallStatus,
        statusColor: upm.plant.statusColor,
        compoundRiskIndex: upm.plant.compoundRiskIndex,
        activeAlertsCount: (operationalContext?.observations || []).length,
        workersOnSite: upm.worker.workersPresent,
        activeMaintenanceJobs: upm.maintenance.totalActiveJobs,
        lastUpdated: new Date().toISOString()
      },
      sensors: upm.sensor.list.map((s: any) => ({
        id: s.id,
        name: s.name,
        category: s.category,
        currentValue: s.value,
        unit: s.unit,
        status: s.status,
        trend: s.trend,
        trendLabel: `${s.status.toUpperCase()} (${s.value} ${s.unit})`,
        history: [Number((s.value * 0.9).toFixed(1)), Number((s.value * 0.95).toFixed(1)), s.value, Number((s.value * 1.02).toFixed(1)), Number((s.value * 0.98).toFixed(1)), s.value],
        thresholds: { warning: Number((s.value * 1.2).toFixed(1)), critical: Number((s.value * 1.5).toFixed(1)) }
      })),
      zones: upm.zones,
      operationalStatus: {
        maintenanceStatus: upm.maintenance.totalActiveJobs > 0 ? `${upm.maintenance.totalActiveJobs} Active Jobs` : 'Nominal Maintenance',
        permitStatus: upm.permit.statusSummary,
        currentShift: upm.worker.shiftCode,
        equipmentOperationalPct: upm.operational.equipmentOperationalPct,
        workersPresent: upm.worker.workersPresent,
        activeChecklists: upm.operational.activeChecklistsCount
      },
      timeline: upm.timeline || baseMock.timeline,
      recommendations: upm.recommendations || baseMock.recommendations,
      operationalContext,
      unifiedPlantModel: upm,
      timestamp: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      data: customPayload,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('[Phase 5: Scenario Builder] Simulation execution error:', err);
    res.status(500).json({
      success: false,
      error: 'Simulation execution failed',
      message: err.message
    });
  }
};

