import React from 'react';
import type { RecommendationItem } from '../../../types/industrial';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { ClipboardCheck, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';

interface RecommendationsPanelProps {
  recommendations: RecommendationItem[];
}

export const RecommendationsPanel: React.FC<RecommendationsPanelProps> = ({ recommendations }) => {
  const getPriorityBadgeVariant = (priority: string) => {
    if (priority === 'High') return 'critical';
    if (priority === 'Medium') return 'warning';
    return 'info';
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'High') return <ShieldAlert className="w-3.5 h-3.5 text-industrial-critical animate-pulse" />;
    if (priority === 'Medium') return <AlertCircle className="w-3.5 h-3.5 text-industrial-warning" />;
    return <CheckCircle2 className="w-3.5 h-3.5 text-industrial-cyan" />;
  };

  return (
    <Card className="h-full flex flex-col justify-between border-slateBlue-800/90 shadow-panel">
      <CardContent className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slateBlue-800 pb-3">
          <div className="flex items-center gap-2 text-base font-semibold tracking-wide text-slate-100">
            <ClipboardCheck className="w-5 h-5 text-industrial-cyan" />
            <span>Recommendations</span>
          </div>
          <Badge variant="outline" className="font-mono text-xs">Active checklist</Badge>
        </div>

        {/* Recommendations List */}
        <div className="space-y-3.5 pt-1 max-h-[380px] overflow-y-auto pr-1">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="bg-carbon-900/80 p-3.5 rounded-lg border border-slateBlue-800/80 flex flex-col justify-between gap-2 transition-all hover:border-slateBlue-700"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {getPriorityIcon(rec.priority)}
                  <h4 className="text-xs sm:text-sm font-mono font-bold text-slate-100 uppercase tracking-tight">
                    {rec.title}
                  </h4>
                </div>
                <Badge variant={getPriorityBadgeVariant(rec.priority)} className="font-mono text-[10px]">
                  {rec.priority.toUpperCase()} PRIORITY
                </Badge>
              </div>

              <p className="text-xs sm:text-sm font-sans text-slateBlue-300 leading-relaxed pl-5">
                {rec.action}
              </p>

              <div className="flex items-center justify-between text-xs font-mono text-slateBlue-400 pt-1 border-t border-slateBlue-800/50 pl-5">
                <span>Category: <strong className="text-slateBlue-300">{rec.category}</strong></span>
                <span className={`font-semibold ${rec.status === 'Action Required' ? 'text-industrial-warning' : 'text-industrial-safe'}`}>
                  [{rec.status}]
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-slateBlue-800/60 flex items-center justify-between text-xs font-mono text-slateBlue-400">
          <span>Action checklist</span>
          <span className="text-slateBlue-300 font-semibold">{recommendations.length} action items</span>
        </div>
      </CardContent>
    </Card>
  );
};
