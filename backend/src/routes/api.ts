import { Router } from 'express';
import {
  getDashboardOverview,
  getSensorsData,
  getPlantStatusData,
  getScenariosList,
  getFullScenarioPayload
} from '../controllers/telemetryController';
import { getOperationalContext } from '../controllers/contextController';
import pipelineRoutes from './pipeline';
import aiRoutes from '../ai/aiRoutes';

const router = Router();

router.use('/pipeline', pipelineRoutes);
router.use('/ai', aiRoutes);

router.get('/dashboard', getDashboardOverview);
router.get('/sensors', getSensorsData);
router.get('/plant-status', getPlantStatusData);
router.get('/scenarios', getScenariosList);
router.get('/payload', getFullScenarioPayload);
router.get('/context', getOperationalContext);

export default router;

