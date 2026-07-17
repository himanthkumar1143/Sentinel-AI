import {
  PipelineExecutionResult,
  ValidationReport,
  ValidationIssue
} from '../types/pipeline';
import { DataCollector } from '../collectors/dataCollector';
import { SensorValidator } from '../validators/sensorValidator';
import { MaintenanceValidator } from '../validators/maintenanceValidator';
import { PermitValidator } from '../validators/permitValidator';
import { SensorNormalizer } from '../normalizers/sensorNormalizer';
import { OperationalNormalizer } from '../normalizers/operationalNormalizer';
import { UnifiedPlantModelBuilder } from '../models/unifiedPlantModel';
import { ContextEngine } from '../context/ContextEngine';

export class PipelineEngine {
  /**
   * Executes the full Industrial Data Integration Pipeline:
   * Collection -> Validation -> Normalization -> Unified Plant Model -> Operational Context
   */
  public static execute(scenario: string = 'normal'): PipelineExecutionResult {
    const startTime = performance.now();
    const timestamp = new Date().toISOString();

    // 1. Collection
    const rawSources = DataCollector.collect(scenario);

    // 2. Validation
    const sensorVal = SensorValidator.validate(rawSources);
    const maintVal = MaintenanceValidator.validate(rawSources);
    const permitVal = PermitValidator.validate(rawSources);

    const issues: ValidationIssue[] = [
      ...sensorVal.issues,
      ...maintVal.issues,
      ...permitVal.issues
    ];

    const totalChecked = sensorVal.checkedCount + maintVal.checkedCount + permitVal.checkedCount;
    const errorCount = issues.filter(i => i.severity === 'error').length;
    const warningCount = issues.filter(i => i.severity === 'warning').length;

    const validationReport: ValidationReport = {
      isValid: errorCount === 0,
      timestamp,
      totalChecked,
      errorCount,
      warningCount,
      issues
    };

    // 3. Normalization
    const sensors = SensorNormalizer.normalize(rawSources);
    const operational = OperationalNormalizer.normalize(rawSources);

    const normalizedData = {
      normalizationTimestamp: timestamp,
      scenario,
      sensors,
      operational
    };

    // 4. Unified Plant Model Generation
    const unifiedPlantModel = UnifiedPlantModelBuilder.build(normalizedData, scenario);

    // 5. Phase 3: Operational Context Intelligence Engine Execution
    const operationalContext = ContextEngine.execute(unifiedPlantModel, scenario);
    unifiedPlantModel.operationalContext = operationalContext;

    const endTime = performance.now();
    const executionTimeMs = Number((endTime - startTime).toFixed(2));

    return {
      pipelineExecutionId: `PIPE-${scenario.toUpperCase()}-${Date.now().toString(36)}`,
      executionTimeMs,
      timestamp,
      scenario,
      rawSources,
      validationReport,
      normalizedData,
      unifiedPlantModel,
      operationalContext
    };
  }
}

export default PipelineEngine;
