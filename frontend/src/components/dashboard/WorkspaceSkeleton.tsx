import React from 'react';
import { Card, CardContent } from '../ui/card';

export const WorkspaceSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 w-full h-full min-h-[400px]">
      <Card className="border-slateBlue-800 bg-carbon-900/90 backdrop-blur-md shadow-panel overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-4 border-b border-slateBlue-800/80 pb-4 mb-4">
            <div className="space-y-3 w-1/2">
              <div className="h-6 bg-slateBlue-800/40 rounded w-1/3 animate-pulse" />
              <div className="h-4 bg-slateBlue-900/40 rounded w-3/4 animate-pulse" />
            </div>
            <div className="h-8 bg-slateBlue-800/40 rounded w-24 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-[200px] bg-slateBlue-900/30 rounded-xl animate-pulse" />
              <div className="h-[100px] bg-slateBlue-900/20 rounded-xl animate-pulse" />
            </div>
            <div className="space-y-4">
              <div className="h-[80px] bg-slateBlue-900/30 rounded-xl animate-pulse" />
              <div className="h-[80px] bg-slateBlue-900/30 rounded-xl animate-pulse" />
              <div className="h-[120px] bg-slateBlue-900/20 rounded-xl animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
