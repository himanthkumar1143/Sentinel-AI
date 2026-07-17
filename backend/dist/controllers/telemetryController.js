"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFullScenarioPayload = exports.getScenariosList = exports.getPlantStatusData = exports.getSensorsData = exports.getDashboardOverview = void 0;
const mockData_1 = require("../data/mockData");
const pipelineService_1 = require("../services/pipelineService");
function getScenarioKey(req) {
    const queryScenario = req.query.scenario;
    if (queryScenario === 'warning' || queryScenario === 'critical' || queryScenario === 'normal') {
        return queryScenario;
    }
    return 'normal';
}
const getDashboardOverview = (req, res) => {
    const scenario = getScenarioKey(req);
    const data = mockData_1.SCENARIOS_DATA[scenario];
    res.json({
        scenario: data.scenario,
        overview: data.overview,
        riskTrend: data.riskTrend,
        timestamp: new Date().toISOString()
    });
};
exports.getDashboardOverview = getDashboardOverview;
const getSensorsData = (req, res) => {
    const scenario = getScenarioKey(req);
    const data = mockData_1.SCENARIOS_DATA[scenario];
    res.json({
        scenario: data.scenario.id,
        sensors: data.sensors,
        timestamp: new Date().toISOString()
    });
};
exports.getSensorsData = getSensorsData;
const getPlantStatusData = (req, res) => {
    const scenario = getScenarioKey(req);
    const data = mockData_1.SCENARIOS_DATA[scenario];
    res.json({
        scenario: data.scenario.id,
        operationalStatus: data.operationalStatus,
        zones: data.zones,
        timeline: data.timeline,
        recommendations: data.recommendations,
        timestamp: new Date().toISOString()
    });
};
exports.getPlantStatusData = getPlantStatusData;
const getScenariosList = (_req, res) => {
    res.json({
        scenarios: Object.values(mockData_1.SCENARIO_INFOS),
        defaultScenario: 'normal',
        timestamp: new Date().toISOString()
    });
};
exports.getScenariosList = getScenariosList;
const getFullScenarioPayload = async (req, res) => {
    const scenario = getScenarioKey(req);
    const data = { ...mockData_1.SCENARIOS_DATA[scenario] };
    try {
        const pipelineResult = await pipelineService_1.PipelineService.runIntegrationPipeline(scenario);
        if (pipelineResult.operationalContext) {
            data.operationalContext = pipelineResult.operationalContext;
        }
    }
    catch (err) {
        console.error('Error attaching operationalContext to payload:', err);
    }
    res.json(data);
};
exports.getFullScenarioPayload = getFullScenarioPayload;
