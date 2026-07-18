import { Request, Response } from 'express';
import geminiService from './geminiService';
import { generateDeterministicAIReport } from './responseParser';
import { PipelineService } from '../services/pipelineService';
import { ContextFormatter } from '../context/ContextFormatter';
import { buildAIPrompt } from './promptBuilder';
// Copilot function removed

export const analyzeOperationalContext = async (req: Request, res: Response): Promise<void> => {
  try {
    const incomingSizeKB = Number((Buffer.byteLength(JSON.stringify(req.body || {}), 'utf8') / 1024).toFixed(2));

    console.log(`\n--------------------------------------------------------------------`);
    console.log(`AI Controller Executed`);
    console.log(`[AI Diagnostics] AI Route Matched & Controller Executing (${new Date().toISOString()}):`);
    console.log(`Incoming Request: ${req.method} ${req.originalUrl}`);
    console.log(`Matched Route: YES (analyzeOperationalContext)`);
    console.log(`--------------------------------------------------------------------\n`);

    let context = req.body.context || req.body.operationalContext || req.body;
    const scenario = typeof context?.scenario === 'string'
      ? context.scenario
      : typeof req.query.scenario === 'string'
      ? req.query.scenario
      : typeof req.body.scenario === 'string'
      ? req.body.scenario
      : 'normal';

    // PART 4 — Backend Owns Operational Context: Retrieve single-source-of-truth context if minimal/missing
    if (!context || !context.observations || !context.generatedObservations || !context.domainStats || Object.keys(context).length <= 10 || (!context.generatedObservations && !context.observations)) {
      console.log(`[AIController] Retrieving single source of truth Operational Context on backend for scenario: "${scenario}"`);
      const pipelineResult = await PipelineService.runIntegrationPipeline(scenario as any);
      if (pipelineResult && pipelineResult.operationalContext) {
        context = ContextFormatter.formatApiResponse(pipelineResult.operationalContext);
      }
    }

    if (!context || (!context.contextId && !context.scenario && !context.generatedObservations && !context.observations)) {
      res.status(400).json({
        success: false,
        error: 'Invalid request payload',
        message: 'Structured Operational Context JSON or scenario ID is required.'
      });
      return;
    }

    // PART 5 — Add Payload Diagnostics right before every AI request
    const contextSizeKB = Number((Buffer.byteLength(JSON.stringify(context || {}), 'utf8') / 1024).toFixed(2));
    const prompt = buildAIPrompt(context);
    const promptSizeChars = prompt.length;
    const jsonPayloadObj = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1,
        topP: 0.8,
        maxOutputTokens: 3000,
        responseMimeType: 'application/json'
      }
    };
    const geminiPayloadSizeKB = Number((Buffer.byteLength(JSON.stringify(jsonPayloadObj), 'utf8') / 1024).toFixed(2));

    console.log(`[AI Diagnostics]`);
    console.log(`Incoming HTTP Body: ${incomingSizeKB} KB`);
    console.log(`Express JSON Limit: 5mb`);
    console.log(`Operational Context: ${contextSizeKB} KB`);
    console.log(`Gemini Prompt: ${promptSizeChars} chars`);
    console.log(`Gemini Payload: ${geminiPayloadSizeKB} KB`);

    const forceRefresh = req.query.force === 'true' || req.body.forceRefresh === true;
    const useFallback = req.query.fallback === 'true' || req.body.fallback === true;

    if (useFallback) {
      const fallbackReport = generateDeterministicAIReport(context);
      res.status(200).json({
        success: true,
        report: fallbackReport,
        cached: false,
        mode: 'deterministic-fallback',
        timestamp: new Date().toISOString()
      });
      return;
    }

    const result = await geminiService.analyzeContext(context, forceRefresh);

    res.status(200).json({
      success: true,
      report: result.report,
      cached: result.cached,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('[AIController] Error processing AI risk analysis:', err);
    // Return 503 so frontend displays PART 9 enterprise error panel: "AI Analysis Unavailable [Retry]"
    res.status(503).json({
      success: false,
      error: 'AI Analysis Unavailable',
      message: err.message || 'Google Gemini AI intelligence service temporarily unavailable.'
    });
  }
};

export const clearAICache = async (_req: Request, res: Response): Promise<void> => {
  try {
    geminiService.clearCache();
    res.status(200).json({
      success: true,
      message: 'AI analysis cache cleared successfully.'
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to clear AI cache'
    });
  }
};
