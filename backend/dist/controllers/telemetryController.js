"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulateCustomScenario = exports.getFullScenarioPayload = exports.getScenariosList = exports.getPlantStatusData = exports.getSensorsData = exports.getDashboardOverview = void 0;
const mockData_1 = require("../data/mockData");
const pipelineService_1 = require("../services/pipelineService");
const ContextEngine_1 = require("../context/ContextEngine");
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
const simulateCustomScenario = async (req, res) => {
    try {
        const upm = req.body.unifiedPlantModel || req.body;
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
        const operationalContext = ContextEngine_1.ContextEngine.execute(upm, scenarioKey);
        upm.operationalContext = operationalContext;
        // Build synchronized dashboard overview & payload (PART 10)
        const overallRisk = upm.plant.statusColor || 'safe';
        const baseMock = overallRisk === 'critical'
            ? mockData_1.SCENARIOS_DATA.critical
            : overallRisk === 'warning'
                ? mockData_1.SCENARIOS_DATA.warning
                : mockData_1.SCENARIOS_DATA.normal;
        const customPayload = {
            ...baseMock,
            scenario: {
                id: 'custom',
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
            sensors: upm.sensor.list.map((s) => ({
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
    }
    catch (err) {
        console.error('[Phase 5: Scenario Builder] Simulation execution error:', err);
        res.status(500).json({
            success: false,
            error: 'Simulation execution failed',
            message: err.message
        });
    }
};
exports.simulateCustomScenario = simulateCustomScenario;
