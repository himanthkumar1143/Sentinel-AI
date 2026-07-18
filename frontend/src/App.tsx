import React, { useState, useEffect } from 'react';
import type { ScenarioType, IndustrialScenarioPayload } from './types/industrial';
import { fetchTelemetryScenario } from './services/api';
import { TopBar, type WorkspaceType } from './components/layout/TopBar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { LandingPage } from './components/landing/LandingPage';

export const App: React.FC = () => {
  const [currentScenario, setCurrentScenario] = useState<ScenarioType>('normal');
  const [data, setData] = useState<IndustrialScenarioPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceType>('overview');

  useEffect(() => {
    let isMounted = true;
    const loadScenarioData = async () => {
      setLoading(true);
      const res = await fetchTelemetryScenario(currentScenario);
      if (isMounted && res) {
        setData(res);
        setLoading(false);
      }
    };
    loadScenarioData();
    return () => {
      isMounted = false;
    };
  }, [currentScenario]);

  const handleSelectScenario = (newScenario: ScenarioType) => {
    if (newScenario === currentScenario) return;
    setCurrentScenario(newScenario);
  };

  const handleApplyCustomScenario = (customData: IndustrialScenarioPayload) => {
    setData(customData);
    setCurrentScenario('custom');
  };

  const handleLaunchDashboard = (initialScenario?: ScenarioType) => {
    if (initialScenario && initialScenario !== currentScenario) {
      setCurrentScenario(initialScenario);
    }
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView('dashboard');
      setIsTransitioning(false);
    }, 180);
  };

  const handleBackToOverview = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView('landing');
      setIsTransitioning(false);
    }, 180);
  };

  if (currentView === 'landing') {
    return (
      <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        <LandingPage onLaunchDashboard={handleLaunchDashboard} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-carbon-900 text-slateBlue-300 flex flex-col font-sans selection:bg-industrial-steel selection:text-carbon-900 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'} text-[1.05em] leading-relaxed`}>
      {/* Top Bar with Live Telemetry Clock, Plant Status Pill & Presentation Mode Toggle */}
      {data && (
        <TopBar
          overview={data.overview}
          activeWorkspace={activeWorkspace}
          onSelectWorkspace={setActiveWorkspace}
          onBackToOverview={handleBackToOverview}
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeWorkspace={activeWorkspace}
          onSelectWorkspace={setActiveWorkspace}
        />

        {/* Main Dashboard Control Room Container */}
        {data ? (
          <DashboardView
            data={data}
            currentScenario={currentScenario}
            onSelectScenario={handleSelectScenario}
            onApplyCustomScenario={handleApplyCustomScenario}
            onSelectWorkspace={setActiveWorkspace}
            loading={loading}
            activeWorkspace={activeWorkspace}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-mono text-xs uppercase text-slateBlue-400 bg-carbon-900">
            Initial Telemetry Handshake...
          </div>
        )}
      </div>
    </div>
  );
};


export default App;

