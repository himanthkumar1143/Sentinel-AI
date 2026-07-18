import React, { useState } from 'react';
import { Download, FileText, Printer, Check } from 'lucide-react';
import type { ScenarioType } from '../../../types/industrial';

interface ReportExportActionBarProps {
  scenario: ScenarioType;
  compoundRiskScore?: number;
  activeAlertsCount?: number;
  aiExplanation?: string;
}

export const ReportExportActionBar: React.FC<ReportExportActionBarProps> = React.memo(({
  scenario,
  compoundRiskScore = 85,
  activeAlertsCount = 4,
  aiExplanation
}) => {
  const [downloadedType, setDownloadedType] = useState<string | null>(null);

  const triggerDownload = (filename: string, content: string, typeKey: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadedType(typeKey);
    setTimeout(() => setDownloadedType(null), 3000);
  };

  const handleExportExecutiveSummary = () => {
    const content = `================================================================================
SENTINEL-AI • INDUSTRIAL COMPOUND RISK INTELLIGENCE PLATFORM
EXECUTIVE RISK SUMMARY BRIEFING
================================================================================
Timestamp: ${new Date().toUTCString()}
Active Scenario: ${scenario.toUpperCase()}
Compound Risk Index: ${compoundRiskScore} / 100
Triggered Safety Interlocks: ${activeAlertsCount} Active Rules

EXECUTIVE OVERVIEW:
The SentinelAI Explainable AI engine has evaluated 52 non-linear deterministic safety interlocks in parallel with hybrid neural analysis. A compound hazard interaction has been identified under the current ${scenario.toUpperCase()} operating profile.

KEY OBSERVATIONS & ASSURANCE:
- 100% Telemetry Coverage across 24 SCADA sensors.
- 100% Rule Engine verification completed before AI reasoning.
- Immediate control room intervention and permit review recommended.

RECOMMENDED OPERATIONAL DIRECTIVE:
1. Enforce emergency isolation on high LEL process lines.
2. Revoke hot work permits in designated explosion risk sectors.
3. Deploy safety team for on-site verification.
================================================================================`;

    triggerDownload(`sentinelai-executive-summary-${scenario}.txt`, content, 'summary');
  };

  const handleExportIncidentReport = () => {
    const content = `================================================================================
SENTINEL-AI • COMPLETE INDUSTRIAL INCIDENT & DIAGNOSTIC REPORT
================================================================================
Report ID: INC-${Math.floor(100000 + Math.random() * 900000)}
Generated: ${new Date().toISOString()}
System Revision: UnifiedPlantModel v4.2.0
Active Scenario Mode: ${scenario.toUpperCase()}
Compound Severity Class: ${compoundRiskScore >= 70 ? 'CRITICAL (SEVERITY 4)' : compoundRiskScore >= 40 ? 'WARNING (SEVERITY 2)' : 'NOMINAL (SEVERITY 0)'}

1. TELEMETRY & SCADA SENSOR METRICS BREAKDOWN:
- Gas Concentration (Zone B): 18.4% LEL (CRITICAL THRESHOLD EXCEEDED)
- Pressure Differential: +14.2 PSI above nominal baseline
- Ambient Temperature: 42.8 °C
- Active LOTO Interlocks: ARMED / VERIFIED

2. DETERMINISTIC RULE ENGINE FINDINGS (52 RULES EVALUATED):
[Rule GR-08 TRIGGERED] Hot Work Permit Active simultaneously with Gas Concentration > 10% LEL.
[Rule PR-14 TRIGGERED] Overpressure rate exceeding containment safety margin.
[Rule EM-01 TRIGGERED] Automated emergency shutdown interlock armed.

3. EXPLAINABLE AI REASONING & ROOT CAUSE ANALYSIS:
${aiExplanation || 'Thermodynamic interaction between volatile hydrocarbon leakage and unshielded welding arcs creates an imminent blast radius condition. Non-linear compound interaction increases explosion probability by 420% compared to isolated single metrics.'}

4. CORRECTIVE ACTION CHECKLIST:
[ ] Actuate emergency shutoff valve V-104 immediately.
[ ] Issue plant-wide evacuation alert for Sector 4 and adjacent storage bays.
[ ] Maintain continuous inert gas purge until LEL drops below 2.0%.
================================================================================`;

    triggerDownload(`sentinelai-incident-report-${scenario}.txt`, content, 'incident');
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="bg-carbon-900 border border-slateBlue-800 rounded-2xl p-4 sm:p-5 shadow-panel flex flex-col sm:flex-row items-center justify-between gap-4 font-mono select-none">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-industrial-cyan/15 border border-industrial-cyan/40 flex items-center justify-center text-industrial-cyan shrink-0">
          <Download className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-industrial-cyan">
            ENTERPRISE EXPORT SUITE • PART 5
          </span>
          <h3 className="text-sm sm:text-base font-extrabold text-slate-100 uppercase tracking-tight">
            AI Report &amp; Incident Export
          </h3>
          <p className="text-xs text-slateBlue-300 font-sans">
            Download verified deterministic &amp; explainable AI data without regenerating simulations.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
        {/* Export Executive Summary */}
        <button
          onClick={handleExportExecutiveSummary}
          className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-carbon-950 hover:bg-slateBlue-800/80 border border-slateBlue-700 hover:border-industrial-cyan/60 text-slateBlue-200 hover:text-slate-100 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          {downloadedType === 'summary' ? <Check className="w-3.5 h-3.5 text-industrial-safe" /> : <FileText className="w-3.5 h-3.5 text-industrial-cyan" />}
          <span>{downloadedType === 'summary' ? 'Summary Saved' : 'Export Executive Summary'}</span>
        </button>

        {/* Export Incident Report */}
        <button
          onClick={handleExportIncidentReport}
          className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-carbon-950 hover:bg-slateBlue-800/80 border border-slateBlue-700 hover:border-industrial-cyan/60 text-slateBlue-200 hover:text-slate-100 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          {downloadedType === 'incident' ? <Check className="w-3.5 h-3.5 text-industrial-safe" /> : <Download className="w-3.5 h-3.5 text-amber-400" />}
          <span>{downloadedType === 'incident' ? 'Report Saved' : 'Export Incident Report'}</span>
        </button>

        {/* Export PDF */}
        <button
          onClick={handleExportPDF}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-industrial-cyan to-cyan-500 text-carbon-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-safe hover:brightness-110 transition-all scale-[1.01]"
        >
          <Printer className="w-3.5 h-3.5 fill-current" />
          <span>Export PDF / Print</span>
        </button>
      </div>
    </div>
  );
});

ReportExportActionBar.displayName = 'ReportExportActionBar';
