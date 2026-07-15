import React from 'react';
import type { OperationalStatus } from '../../../types/industrial';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Wrench, ShieldCheck, Clock, Gauge, Users, CheckCircle } from 'lucide-react';

interface OperationalStatusPanelProps {
  status: OperationalStatus;
}

export const OperationalStatusPanel: React.FC<OperationalStatusPanelProps> = ({ status }) => {
  return (
    <Card className="h-full flex flex-col justify-between border-slateBlue-800/90 shadow-panel">
      <CardContent className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slateBlue-800 pb-3">
          <div className="flex items-center gap-2 text-base font-semibold tracking-wide text-slate-100">
            <Wrench className="w-5 h-5 text-industrial-cyan" />
            <span>Operations</span>
          </div>
          <Badge variant="outline" className="font-mono text-xs">Telemetry</Badge>
        </div>

        {/* 4 Informational Status Blocks */}
        <div className="grid grid-cols-1 gap-3.5 pt-1">
          {/* Maintenance Status */}
          <div className="bg-carbon-900/80 p-3.5 rounded-lg border border-slateBlue-800/80 flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="text-xs font-mono text-slateBlue-400 flex items-center gap-1.5 font-medium">
                <Wrench className="w-3.5 h-3.5 text-industrial-warning" /> Maintenance status
              </span>
              <p className="text-xs sm:text-sm font-mono text-slate-100 font-semibold">
                {status.maintenanceStatus}
              </p>
            </div>
            <Badge variant="maintenance" className="font-mono text-[10px]">Logged</Badge>
          </div>

          {/* Permit Status */}
          <div className="bg-carbon-900/80 p-3.5 rounded-lg border border-slateBlue-800/80 flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="text-xs font-mono text-slateBlue-400 flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-industrial-safe" /> Safety permits
              </span>
              <p className="text-xs sm:text-sm font-mono text-slate-100 font-semibold">
                {status.permitStatus}
              </p>
            </div>
            <Badge variant="safe" className="font-mono text-[10px]">Verified</Badge>
          </div>

          {/* Current Shift */}
          <div className="bg-carbon-900/80 p-3.5 rounded-lg border border-slateBlue-800/80 flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="text-xs font-mono text-slateBlue-400 flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-industrial-cyan" /> Current shift
              </span>
              <p className="text-xs sm:text-sm font-mono text-slate-100 font-semibold">
                {status.currentShift}
              </p>
            </div>
            <Badge variant="info" className="font-mono text-[10px]">Active</Badge>
          </div>

          {/* Equipment Operational Readiness & Headcount */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="bg-carbon-900/80 p-3.5 rounded-lg border border-slateBlue-800/80">
              <span className="text-xs font-mono text-slateBlue-400 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-industrial-safe" /> Equipment readiness
              </span>
              <span className="text-2xl font-mono font-extrabold text-industrial-safe pt-1 block">
                {status.equipmentOperationalPct}% <span className="text-xs font-normal text-slateBlue-500">Online</span>
              </span>
            </div>

            <div className="bg-carbon-900/80 p-3.5 rounded-lg border border-slateBlue-800/80">
              <span className="text-xs font-mono text-slateBlue-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-industrial-cyan" /> Active personnel
              </span>
              <span className="text-2xl font-mono font-extrabold text-slate-100 pt-1 block">
                {status.workersPresent} <span className="text-xs font-normal text-slateBlue-500">Workers</span>
              </span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-slateBlue-800/60 flex items-center justify-between text-xs font-mono text-slateBlue-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-industrial-safe" /> {status.activeChecklists} Checklists synced
          </span>
          <span className="text-slateBlue-500">Informational</span>
        </div>
      </CardContent>
    </Card>
  );
};
