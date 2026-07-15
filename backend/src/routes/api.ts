import { Router } from 'express';
import {
  getDashboardOverview,
  getSensorsData,
  getPlantStatusData,
  getScenariosList,
  getFullScenarioPayload
} from '../controllers/telemetryController';
import pipelineRoutes from './pipeline';

const router = Router();

router.use('/pipeline', pipelineRoutes);

router.get('/dashboard', getDashboardOverview);
router.get('/sensors', getSensorsData);
router.get('/plant-status', getPlantStatusData);
router.get('/scenarios', getScenariosList);
router.get('/payload', getFullScenarioPayload);

export default router;
