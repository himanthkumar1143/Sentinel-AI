"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const telemetryController_1 = require("../controllers/telemetryController");
const contextController_1 = require("../controllers/contextController");
const pipeline_1 = __importDefault(require("./pipeline"));
const aiRoutes_1 = __importDefault(require("../ai/aiRoutes"));
const router = (0, express_1.Router)();
router.use('/pipeline', pipeline_1.default);
router.use('/ai', aiRoutes_1.default);
router.get('/dashboard', telemetryController_1.getDashboardOverview);
router.get('/sensors', telemetryController_1.getSensorsData);
router.get('/plant-status', telemetryController_1.getPlantStatusData);
router.get('/scenarios', telemetryController_1.getScenariosList);
router.get('/payload', telemetryController_1.getFullScenarioPayload);
router.get('/context', contextController_1.getOperationalContext);
// PART 9: Phase 5 Interactive Scenario Builder Simulation routes
router.post('/simulate', telemetryController_1.simulateCustomScenario);
router.post('/pipeline/simulate', telemetryController_1.simulateCustomScenario);
exports.default = router;
