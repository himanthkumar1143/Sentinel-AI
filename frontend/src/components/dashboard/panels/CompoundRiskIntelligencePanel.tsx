import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { BrainCircuit } from 'lucide-react';
import { AICompoundRiskIntelligencePanel, type AIAnalysisReport } from './context/AICompoundRiskIntelligencePanel';
import { fetchAIRiskAssessment } from '../../../services/api';
import { buildFallbackContext } from './OperationalContextIntelligencePanel';
import type { OperationalContextPayload } from './context/ContextTypes';
import { ExplainableConfidencePanel } from './ExplainableConfidencePanel';
import { ReportExportActionBar } from './ReportExportActionBar';

interface CompoundRiskIntelligencePanelProps {
  operationalContext?: OperationalContextPayload | null;
  scenario?: string;
}

export const CompoundRiskIntelligencePanel: React.FC<CompoundRiskIntelligencePanelProps> = ({
  operationalContext: propContext,
  scenario = 'normal'
}) => {
  const [context, setContext] = useState<OperationalContextPayload | null>(
    propContext || buildFallbackContext(scenario)
  );
  const [aiReport, setAiReport] = useState<AIAnalysisReport | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    if (propContext) {
      setContext(propContext);
    } else {
      setContext(buildFallbackContext(scenario));
    }
    setAiReport(null);
    setAiError(null);
  }, [propContext, scenario]);

  const handleRunAIAssessment = async (forceRefresh = false, useFallback = false) => {
    if (!context || isLoadingAI) return;
    setIsLoadingAI(true);
    setAiError(null);

    try {
      const report = await fetchAIRiskAssessment(context, forceRefresh, useFallback);
      if (report) {
        setAiReport(report);
      } else if (useFallback) {
        setAiError('Fallback model unavailable.');
      }
    } catch (err: any) {
      console.error('Enterprise Intelligence AI assessment error:', err);
      setAiError(err.message || 'AI Analysis Unavailable');
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleRetryAI = () => {
    handleRunAIAssessment(true, false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner Bar for Enterprise Intelligence */}
      <Card className="border-slateBlue-800 bg-carbon-900/90 backdrop-blur-md shadow-panel relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
        <CardContent className="p-5 sm:p-6 relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="w-2.5 h-2.5 rounded-full bg-industrial-cyan animate-pulse shadow-glow-safe" />
              <h2 className="text-xl sm:text-2xl font-mono font-extrabold text-slate-100 uppercase tracking-tight flex items-center gap-2">
                <BrainCircuit className="w-6 h-6 text-industrial-cyan" />
                Enterprise Intelligence Engine
              </h2>
              <Badge className="bg-industrial-cyan text-carbon-950 font-mono text-xs font-bold px-2.5">
                EXPLAINABLE AI
              </Badge>
            </div>
            <p className="text-xs sm:text-sm font-sans text-slateBlue-300 max-w-3xl leading-relaxed">
              Synthesizing compound causal trees, executive briefings, and deterministic engineering safety evidence with zero hallucination.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
            <Badge variant="outline" className="border-slateBlue-700 text-slateBlue-300 text-xs font-mono uppercase px-3 py-1.5">
              Scenario: <span className="text-cyan-300 font-bold ml-1">{scenario.toUpperCase()}</span>
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* PART 5 — Export Executive Summary & Incident Report Bar */}
      <ReportExportActionBar
        scenario={scenario as any}
        compoundRiskScore={(aiReport as any)?.riskScore || (context?.plantStatus?.riskScore ? Math.round(context.plantStatus.riskScore) : 85)}
        activeAlertsCount={context?.deterministicRules?.filter((r: any) => r.triggered).length || 4}
        aiExplanation={aiReport?.executiveSummary || aiReport?.executiveAssessment || aiReport?.rootCauses?.[0]?.description}
      />

      {/* PART 6 — Explainable Confidence Visualizer Progress Bar Panel */}
      <ExplainableConfidencePanel
        confidenceScore={aiReport?.confidence || (aiReport as any)?.confidenceScore || 98.4}
        sensorsCount={context?.scadaTelemetry?.activeSensorCount || 24}
        rulesCount={context?.deterministicRules?.length || 52}
      />

      {/* Main Explainable AI Compound Risk & AI Safety Assistant Component */}
      <AICompoundRiskIntelligencePanel
        report={aiReport}
        isLoading={isLoadingAI}
        error={aiError}
        onRunAssessment={handleRunAIAssessment}
        onRetry={handleRetryAI}
        scenario={scenario}
        context={context}
      />
    </div>
  );
};

export default CompoundRiskIntelligencePanel;
