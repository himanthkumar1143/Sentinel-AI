import { Request, Response } from 'express';
import { PipelineService } from '../services/pipelineService';
import { ContextFormatter } from '../context/ContextFormatter';

export const getOperationalContext = async (req: Request, res: Response) => {
  try {
    const scenario = typeof req.query.scenario === 'string' ? req.query.scenario : 'normal';
    const pipelineResult = await PipelineService.runIntegrationPipeline(scenario);

    if (!pipelineResult.operationalContext) {
      return res.status(500).json({
        status: 'error',
        message: 'Operational Context Engine did not produce context output.'
      });
    }

    const formattedResponse = ContextFormatter.formatApiResponse(pipelineResult.operationalContext);
    return res.status(200).json(formattedResponse);
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      message: error?.message || 'Failed to generate Operational Context'
    });
  }
};
