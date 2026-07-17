import React, { useState } from 'react';
import { Card, CardContent } from '../../../ui/card';
import { Copy, Check, ChevronDown, ChevronUp, Terminal } from 'lucide-react';
import type { OperationalContextPayload } from './ContextTypes';

interface RawContextViewerProps {
  context: OperationalContextPayload;
}

export const RawContextViewer: React.FC<RawContextViewerProps> = ({ context }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const jsonString = JSON.stringify(context, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="bg-carbon-900/80 border-slateBlue-800 backdrop-blur-md shadow-panel relative overflow-hidden">
      <CardContent className="p-5 sm:p-6 space-y-4 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slateBlue-800/80 pb-3">
          <div className="flex items-center gap-2 text-sm font-mono font-bold text-slate-100 uppercase tracking-wide">
            <Terminal className="w-4 h-4 text-industrial-cyan" />
            <span>Raw Operational Context JSON Payload (Part 18)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-carbon-950 border border-slateBlue-800 hover:border-slateBlue-600 text-xs font-mono text-slateBlue-300 flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-industrial-safe" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Payload!' : 'Copy JSON'}</span>
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-3 py-1.5 rounded-lg bg-industrial-cyan/20 border border-industrial-cyan text-xs font-mono font-bold text-industrial-cyan flex items-center gap-1.5 transition-colors"
            >
              <span>{isExpanded ? 'Collapse Payload' : 'Inspect Raw JSON'}</span>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between text-[11px] font-mono text-slateBlue-400 px-1">
              <span>SCHEMA: SENTINEL-AI PHASE 3 OPERATIONAL CONTEXT INTELLIGENCE ENGINE</span>
              <span className="text-cyan-400 font-semibold">{jsonString.length.toLocaleString()} BYTES</span>
            </div>
            <pre className="bg-carbon-950 border border-slateBlue-800 rounded-xl p-4 sm:p-5 text-xs font-mono text-cyan-300 overflow-x-auto max-h-[520px] leading-relaxed shadow-inner selection:bg-cyan-500 selection:text-carbon-950">
              <code>{jsonString}</code>
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
