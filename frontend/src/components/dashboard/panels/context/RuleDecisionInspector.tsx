import React, { useState } from 'react';
import { Card, CardContent } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { Search, Cpu } from 'lucide-react';
import type { RuleEvaluationResult } from './ContextTypes';

interface RuleDecisionInspectorProps {
  ruleEvaluations: RuleEvaluationResult[];
}

export const RuleDecisionInspector: React.FC<RuleDecisionInspectorProps> = ({ ruleEvaluations }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterTriggered, setFilterTriggered] = useState<string>('all'); // 'all', 'triggered', 'safe'

  const filteredRules = ruleEvaluations.filter(rule => {
    const matchesSearch = rule.ruleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          rule.ruleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          rule.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          rule.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (filterTriggered === 'triggered') return rule.isTriggered;
    if (filterTriggered === 'safe') return !rule.isTriggered;
    return true;
  });

  return (
    <Card className="bg-carbon-900/80 border-slateBlue-800 backdrop-blur-md shadow-panel relative overflow-hidden">
      <CardContent className="p-5 sm:p-6 space-y-4 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slateBlue-800/80 pb-3">
          <div className="flex items-center gap-2 text-sm font-mono font-bold text-slate-100 uppercase tracking-wide">
            <Cpu className="w-4 h-4 text-industrial-cyan" />
            <span>Live Engineering Rule Decision Inspector</span>
          </div>
          <span className="text-xs font-mono text-slateBlue-400">
            Showing {filteredRules.length} of {ruleEvaluations.length} Evaluated Rules
          </span>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slateBlue-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by rule ID, domain, condition..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-carbon-950 border border-slateBlue-800 text-xs font-mono text-slate-100 placeholder:text-slateBlue-500 focus:outline-none focus:border-industrial-cyan transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <button
              onClick={() => setFilterTriggered('all')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                filterTriggered === 'all'
                  ? 'bg-industrial-cyan/20 border border-industrial-cyan text-industrial-cyan'
                  : 'bg-carbon-950 border border-slateBlue-800 text-slateBlue-400 hover:text-slate-200'
              }`}
            >
              All ({ruleEvaluations.length})
            </button>
            <button
              onClick={() => setFilterTriggered('triggered')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                filterTriggered === 'triggered'
                  ? 'bg-industrial-warning/20 border border-industrial-warning text-industrial-warning'
                  : 'bg-carbon-950 border border-slateBlue-800 text-slateBlue-400 hover:text-slate-200'
              }`}
            >
              Triggered ({ruleEvaluations.filter(r => r.isTriggered).length})
            </button>
            <button
              onClick={() => setFilterTriggered('safe')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                filterTriggered === 'safe'
                  ? 'bg-industrial-safe/20 border border-industrial-safe text-industrial-safe'
                  : 'bg-carbon-950 border border-slateBlue-800 text-slateBlue-400 hover:text-slate-200'
              }`}
            >
              Nominal / Safe ({ruleEvaluations.filter(r => !r.isTriggered).length})
            </button>
          </div>
        </div>

        {/* Rule Evaluations Table / Grid */}
        <div className="max-h-[480px] overflow-y-auto pr-1 space-y-2.5">
          {filteredRules.map((rule) => (
            <div
              key={rule.ruleId}
              className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs ${
                rule.isTriggered
                  ? 'bg-carbon-950 border-industrial-warning/60 shadow-[0_0_15px_rgba(245,158,11,0.12)]'
                  : 'bg-carbon-950/70 border-slateBlue-800/80 hover:border-slateBlue-600'
              }`}
            >
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className={`text-[10px] font-bold uppercase ${
                    rule.isTriggered ? 'border-industrial-warning text-industrial-warning bg-industrial-warning/10' : 'border-industrial-safe text-industrial-safe bg-industrial-safe/10'
                  }`}>
                    {rule.isTriggered ? 'TRIGGERED ✓' : 'PASS / SAFE'}
                  </Badge>
                  <span className="font-extrabold text-cyan-300">{rule.ruleId}</span>
                  <span className="text-slateBlue-600">|</span>
                  <span className="font-bold text-slate-100">{rule.ruleName}</span>
                  <Badge variant="outline" className="border-slateBlue-700 text-slateBlue-400 text-[10px]">
                    {rule.category}
                  </Badge>
                </div>
                <p className="text-slateBlue-400 text-[11px]">
                  Purpose: {rule.purpose}
                </p>
                <div className="text-[11px] text-slateBlue-300 pt-0.5">
                  Reason: <strong className={rule.isTriggered ? 'text-industrial-warning' : 'text-slate-200'}>{rule.reason}</strong>
                </div>
              </div>

              {/* Condition & Threshold comparison pill */}
              <div className="shrink-0 bg-carbon-900 border border-slateBlue-800 rounded-lg p-2.5 px-3 space-y-1 text-right self-stretch sm:self-auto flex flex-col justify-center min-w-[200px]">
                <div className="text-[10px] text-slateBlue-400 uppercase">Evaluated Condition</div>
                <div className="font-bold text-cyan-300">{rule.condition}</div>
                <div className="text-[10px] text-slateBlue-400 pt-0.5">
                  Threshold: <strong className="text-slate-200">{rule.threshold ?? 'N/A'}</strong> | Current: <strong className={rule.isTriggered ? 'text-industrial-warning font-black' : 'text-industrial-safe font-black'}>{rule.currentValue}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
