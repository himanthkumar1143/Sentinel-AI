import { Request, Response } from 'express';
import { SCENARIOS_DATA, SCENARIO_INFOS } from '../data/mockData';
import { ScenarioType } from '../types/industrial';
import { PipelineService } from '../services/pipelineService';


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

