import { Router, Request, Response } from 'express';
import { PipelineService } from '../services/pipelineService';

const router = Router();

/**
 * GET /api/pipeline
 * Returns full execution report:
 * Raw Sources -> Validation Report -> Normalized Data -> Unified Plant Model
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const scenario = typeof req.query.scenario === 'string' ? req.query.scenario : 'normal';
    const result = await PipelineService.runIntegrationPipeline(scenario);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({
      error: 'Pipeline execution failed',
      message: error?.message || 'Unknown error occurred inside integration pipeline'
    });
  }
});

export default router;
