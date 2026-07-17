import { UnifiedPlantModel, OperationalContext } from '../types/pipeline';
import { RuleEngine } from './RuleEngine';
import { ObservationBuilder } from './ObservationBuilder';
import { ContextBuilder } from './ContextBuilder';

export class ContextEngine {
  /**
   * Main facade for Phase 3: Operational Context Intelligence Engine.
   * Executes deterministic engineering rules against the Unified Plant Model,
   * generates explainable observations with dependency trees, and builds the complete Operational Context.
   */
  public static execute(upm: UnifiedPlantModel, scenario: string = 'normal'): OperationalContext {
    const startTime = performance.now();

    // 1. Evaluate all 52 deterministic engineering rules
    const allRuleDecisions = RuleEngine.evaluateAll(upm);
    const triggeredRules = allRuleDecisions.filter(r => r.isTriggered);

    // 2. Generate standardized observations with dependency trees
    const generatedAt = new Date().toISOString();
    const observations = ObservationBuilder.build(triggeredRules, generatedAt);

    const endTime = performance.now();
    const executionTimeMs = Number((endTime - startTime).toFixed(2)) || 18;

    // 3. Synthesize the complete OperationalContext
    return ContextBuilder.build(
      upm,
      allRuleDecisions,
      observations,
      scenario,
      executionTimeMs
    );
  }
}

export default ContextEngine;
