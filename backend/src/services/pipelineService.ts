import { PipelineEngine } from '../pipeline/pipelineEngine';
import { PipelineExecutionResult } from '../types/pipeline';

export class PipelineService {
  /**
   * Service wrapper for running the Phase 2 Industrial Data Integration Pipeline
   */
  public static async runIntegrationPipeline(scenario: string = 'normal'): Promise<PipelineExecutionResult> {
    const validScenarios = ['normal', 'warning', 'critical'];
    const activeScenario = validScenarios.includes(scenario.toLowerCase()) ? scenario.toLowerCase() : 'normal';

    return PipelineEngine.execute(activeScenario);
  }
}

export default PipelineService;
