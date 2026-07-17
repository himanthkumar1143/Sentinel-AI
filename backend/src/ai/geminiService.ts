import env from '../config/env';
import { buildAIPrompt } from './promptBuilder';
import { validateAndParseResponse, generateDeterministicAIReport } from './responseParser';
import { AIAnalysisReport } from './types';

// In-memory cache for PART 11 performance requirement
const analysisCache = new Map<string, AIAnalysisReport>();

export class GeminiService {
  /**
   * Analyzes structured Operational Context JSON using Google Gemini
   * Caches response by contextId / scenario to avoid redundant API calls
   */
  public async analyzeContext(context: any, forceRefresh = false): Promise<{ report: AIAnalysisReport; cached: boolean }> {
    if (!context) {
      throw new Error('Operational Context JSON is required for AI risk analysis.');
    }

    const cacheKey = `${context.scenario || 'normal'}_${context.contextId || 'default'}`;

    if (!forceRefresh && analysisCache.has(cacheKey)) {
      const cachedReport = analysisCache.get(cacheKey)!;
      return { report: cachedReport, cached: true };
    }

    const prompt = buildAIPrompt(context);
    const contextSizeKB = (Buffer.byteLength(JSON.stringify(context || {}), 'utf8') / 1024).toFixed(2);
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
    const payloadSizeKB = (Buffer.byteLength(JSON.stringify(jsonPayloadObj), 'utf8') / 1024).toFixed(2);

    console.log(`[GeminiService] Operational Context Size: ${contextSizeKB} KB`);
    console.log(`[GeminiService] Gemini Prompt Size: ${promptSizeChars} Characters`);
    console.log(`[GeminiService] JSON Payload Size: ${payloadSizeKB} KB`);

    const apiKey = env.GEMINI_API_KEY;
    const isMockKey = !apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '';

    // If no valid API key is set or in demo/test environment where key is placeholder,
    // generate deterministic enterprise intelligence synthesis
    if (isMockKey) {
      console.log('[GeminiService] Using deterministic synthesis engine (API key placeholder/offline)');
      const fallbackReport = generateDeterministicAIReport(context);
      analysisCache.set(cacheKey, fallbackReport);
      return { report: fallbackReport, cached: false };
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonPayloadObj)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`[GeminiService] Google API Error (${response.status}): ${errorText}. Falling back to deterministic enterprise synthesis engine.`);
        const fallbackReport = generateDeterministicAIReport(context);
        analysisCache.set(cacheKey, fallbackReport);
        return { report: fallbackReport, cached: false };
      }

      const data: any = await response.json();
      const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!candidateText) {
        throw new Error('Gemini API returned empty text payload.');
      }

      const parsedReport = validateAndParseResponse(candidateText, context);
      analysisCache.set(cacheKey, parsedReport);
      return { report: parsedReport, cached: false };
    } catch (err: any) {
      console.warn(`[GeminiService] AI analysis fetch encountered error (${err.message}). Falling back to deterministic synthesis engine.`);
      const fallbackReport = generateDeterministicAIReport(context);
      analysisCache.set(cacheKey, fallbackReport);
      return { report: fallbackReport, cached: false };
    }
  }

  /**
   * Clears analysis cache upon scenario change or new pipeline run
   */
  public clearCache(cacheKey?: string): void {
    if (cacheKey) {
      analysisCache.delete(cacheKey);
    } else {
      analysisCache.clear();
    }
  }
}

export const geminiService = new GeminiService();
export default geminiService;
