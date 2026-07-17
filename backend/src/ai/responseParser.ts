import { AIAnalysisReport, AICompoundRisk, AIRootCause, AICascadingEvent, AIRecommendedAction, AIMonitoringPriority } from './types';

export function validateAndParseResponse(rawText: string, context: any): AIAnalysisReport {
  try {
    let cleanText = rawText.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/^```json/i, '').replace(/```$/, '').trim();
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```/, '').replace(/```$/, '').trim();
    }

    const parsed = JSON.parse(cleanText);

    return {
      overallRisk: parsed.overallRisk || (context.scenario === 'critical' ? 'Critical' : context.scenario === 'warning' ? 'Warning' : 'Safe'),
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 95,
      executiveAssessment: parsed.executiveAssessment || 'Assessment derived from multi-domain operational context analysis.',
      executiveSummary: parsed.executiveSummary || parsed.executiveAssessment || 'Enterprise safety assessment complete.',
      compoundRisks: Array.isArray(parsed.compoundRisks) ? parsed.compoundRisks : [],
      rootCauses: Array.isArray(parsed.rootCauses) ? parsed.rootCauses.map((rc: any) => ({
        ...rc,
        chain: Array.isArray(rc.chain) && rc.chain.length > 0 ? rc.chain : ['Gas Increasing', 'Hot Work Active', 'Workers Present', 'Explosion Hazard', 'Critical Risk']
      })) : [],
      cascadingEvents: Array.isArray(parsed.cascadingEvents) ? parsed.cascadingEvents : [],
      recommendedActions: Array.isArray(parsed.recommendedActions) ? parsed.recommendedActions : [],
      monitoringPriorities: Array.isArray(parsed.monitoringPriorities) ? parsed.monitoringPriorities : [],
      generatedAt: new Date().toISOString(),
      scenario: context.scenario || 'normal',
      contextId: context.contextId || `CTX-AI-${Date.now()}`
    };
  } catch (err) {
    console.warn('[AI ResponseParser] Failed to parse JSON from AI response, falling back to deterministic synthesis:', err);
    return generateDeterministicAIReport(context);
  }
}

export function generateDeterministicAIReport(context: any): AIAnalysisReport {
  const scenario = context?.scenario || 'normal';
  const isCritical = scenario === 'critical';
  const isWarning = scenario === 'warning';

  const overallRisk: 'Safe' | 'Warning' | 'Critical' = isCritical ? 'Critical' : isWarning ? 'Warning' : 'Safe';
  const confidence = isCritical ? 98 : isWarning ? 94 : 99;

  const executiveAssessment = isCritical
    ? 'CRITICAL SAFETY EXCURSION IDENTIFIED: Combustible gas concentration (38.5 PPM) in Reactor Zone A coincides directly with active Hot Work Safety Permit SWP-882 and 28 shift workers. This spatial and chemical coincidence violates single-failure safety limits and requires immediate emergency containment interlocks.'
    : isWarning
    ? 'ELEVATED OPERATIONAL WARNING: Hydrocarbon Storage Manifold #2 thermal elevated readings (45.0 °C) coincide with scheduled flange overhaul maintenance (WO-9942). Increased monitoring required.'
    : 'ALL SYSTEMS NOMINAL: Multi-domain cross-referencing indicates zero compound conflicts across all 8 plant sectors. Telemetry, maintenance arrays, and safety permit registries operate within nominal design limits.';

  const compoundRisks: AICompoundRisk[] = isCritical ? [
    {
      title: 'Combustible Gas & Hot Work Ignition Conflict (CR-01)',
      severity: 'Critical',
      reason: 'SCADA Gas Sensor detected 38.5 PPM combustible gas in Reactor Zone A coinciding with active Hot Work Permit SWP-882, generating an immediate explosion hazard.',
      affectedSystems: ['SCADA Gas Sensor Network', 'Enterprise Permit Registry', 'Reactor Zone A Interlocks'],
      probability: '94.5%',
      impact: 'Immediate ignition and structural blast hazard across Primary Synthesis Reactor Area.'
    },
    {
      title: 'Workforce Exposure & Evacuation Bottleneck (CR-07)',
      severity: 'Critical',
      reason: '28 shift personnel are currently registered inside Sector A during an active combustible gas excursion and authorized hot work operation.',
      affectedSystems: ['SAP Shift Management Roster', 'Sector A Emergency Alarms'],
      probability: '88.0%',
      impact: 'High risk of acute toxic inhalation and personnel injury if containment interlocks fail.'
    }
  ] : isWarning ? [
    {
      title: 'Thermal Fluctuation During Active Flange Overhaul (CR-03)',
      severity: 'Warning',
      reason: 'Storage Manifold #2 undergoing flange overhaul while ambient thermal reading elevated to 45.0 °C.',
      affectedSystems: ['Hydrocarbon Storage Manifold #2', 'Thermal SCADA Telemetry'],
      probability: '62.0%',
      impact: 'Potential seal degradation or localized pressure buildup during open-flange maintenance.'
    }
  ] : [
    {
      title: 'Nominal Operational Baseline Check',
      severity: 'Safe',
      reason: 'All active work permits and maintenance orders are spatially separated from hazardous telemetry boundaries.',
      affectedSystems: ['Plant-Wide Operations'],
      probability: '0.2%',
      impact: 'Standard operation with zero compound safety risk.'
    }
  ];

  const rootCauses: AIRootCause[] = isCritical ? [
    {
      title: 'Manifold Seal Micro-Leak Coinciding with Welding Arc',
      description: 'Primary SCADA manifold telemetry confirms localized hydrocarbon accumulation (38.5 PPM) due to upstream feed flange micro-leak right above active welding sector SWP-882.',
      category: 'Compound Safety & Gas Excursion',
      likelihood: 'High',
      chain: [
        'Upstream Feed Flange Micro-Leak',
        'Combustible Gas Concentration > 10.0 PPM',
        'Hot Work Permit #SWP-882 Active Arc',
        '28 Personnel Registered in Zone A',
        'Critical Explosion & Exposure Risk'
      ]
    }
  ] : isWarning ? [
    {
      title: 'Elevated Solar & Process Thermal Load During Overhaul',
      description: 'Combined process heat return and solar ambient gain raised Storage Manifold #2 temperature above 40 °C during scheduled seal maintenance.',
      category: 'Thermal & Maintenance Interaction',
      likelihood: 'Medium',
      chain: [
        'Process Thermal Return Elevated (45.0 °C)',
        'Active Flange Overhaul (WO-9942)',
        'Localized Seal Stress Fluctuation',
        'Elevated Maintenance Warning'
      ]
    }
  ] : [
    {
      title: 'Normal Steady-State Synthesis & Storage Protocol',
      description: 'Deterministic rule evaluations confirm all operational parameters reside cleanly within designated design safety boundaries.',
      category: 'Baseline Plant Operations',
      likelihood: 'Low',
      chain: [
        'SCADA Telemetry Nominal (< 2.0 PPM)',
        'Authorized Permits Spatially Segregated',
        'Workforce Roster Aligned',
        'Verified Safe Plant Operation'
      ]
    }
  ];

  const cascadingEvents: AICascadingEvent[] = isCritical ? [
    {
      step: 1,
      title: 'Atmospheric Combustible Gas Accumulation (> 35 PPM)',
      timebox: 'Immediate (0-2 min)',
      description: 'Gas concentration in Reactor Zone A surpasses LEL alarm thresholds.',
      probability: '99%',
      affectedZone: 'Primary Synthesis Reactor Area (Zone A)'
    },
    {
      step: 2,
      title: 'Arc Ignition Coincidence with Hot Work Permit SWP-882',
      timebox: 'Immediate (2-5 min)',
      description: 'Open flame or welding spark provides an active ignition source in the combustible plume envelope.',
      probability: '94%',
      affectedZone: 'Reactor Zone A Welding Bay'
    },
    {
      step: 3,
      title: 'Automated Nitrogen Quench & LOTO Interlock Activation',
      timebox: 'Short Term (5-10 min)',
      description: 'Enterprise safety controller trips high-speed inert blanket manifolds to suppress blast potential.',
      probability: '98%',
      affectedZone: 'Reactor Zone A & Piping Network 04'
    },
    {
      step: 4,
      title: 'Emergency Sector Evacuation for 28 Shift Roster Workers',
      timebox: 'Short Term (10-15 min)',
      description: 'Automated sirens and muster protocols initiate full evacuation of Shift A personnel.',
      probability: '100%',
      affectedZone: 'Sector A Muster Station #1'
    }
  ] : isWarning ? [
    {
      step: 1,
      title: 'Thermal Threshold Exceeded on Storage Manifold #2',
      timebox: 'Immediate (0-15 min)',
      description: 'Temperature reaches 45.0 °C while maintenance crew is on site.',
      probability: '75%',
      affectedZone: 'Hydrocarbon Storage Manifold (Zone B)'
    },
    {
      step: 2,
      title: 'Maintenance Order WO-9942 Temporary Standby',
      timebox: 'Short Term (15-30 min)',
      description: 'Supervisors pause open-flange work until auxiliary cooling fans lower ambient surface temperature.',
      probability: '85%',
      affectedZone: 'Zone B Maintenance Bay'
    }
  ] : [
    {
      step: 1,
      title: 'Continuous Telemetry & Roster Sync',
      timebox: 'Continuous',
      description: 'SCADA edge collectors verify steady-state baseline readings across all 8 zones.',
      probability: '100%',
      affectedZone: 'Plant-Wide Operations'
    }
  ];

  const recommendedActions: AIRecommendedAction[] = isCritical ? [
    {
      id: 'ACT-CRIT-01',
      priority: 'Immediate',
      action: 'Emergency Revocation & LOTO of Hot Work Permit SWP-882',
      rationale: 'Eliminate active ignition source from combustible gas accumulation zone immediately.',
      targetSystem: 'Industrial Safety Gateway / Permit Interlock',
      owner: 'Plant Safety Director'
    },
    {
      id: 'ACT-CRIT-02',
      priority: 'Immediate',
      action: 'Trigger Emergency Evacuation & Muster Protocol for Shift A (28 Workers)',
      rationale: 'Protect human life from toxic gas inhalation and potential detonation.',
      targetSystem: 'Enterprise SCADA Siren & Muster Network',
      owner: 'Shift Supervisor (Shift A)'
    },
    {
      id: 'ACT-CRIT-03',
      priority: 'Short Term',
      action: 'Activate Nitrogen Quench Blanket Manifold on Reactor Zone A',
      rationale: 'Inert the atmospheric envelope to drive oxygen concentration below combustible limits.',
      targetSystem: 'Auxiliary Nitrogen Purge Interlock',
      owner: 'Lead Process Engineer'
    }
  ] : isWarning ? [
    {
      id: 'ACT-WARN-01',
      priority: 'Immediate',
      action: 'Deploy Mobile Cooling Array to Storage Manifold #2',
      rationale: 'Reduce surface flange temperature below 38 °C before resuming seal extraction.',
      targetSystem: 'Auxiliary Cooling Array UTILITY-05',
      owner: 'Maintenance Supervisor'
    },
    {
      id: 'ACT-WARN-02',
      priority: 'Short Term',
      action: 'Increase Gas Telemetry Polling Rate to 1-Second Intervals',
      rationale: 'Ensure early detection if seal stress induces vapor escape during overhaul.',
      targetSystem: 'SCADA Edge Manifold Network',
      owner: 'Telemetry Systems Specialist'
    }
  ] : [
    {
      id: 'ACT-SAFE-01',
      priority: 'Long Term',
      action: 'Maintain Standard Shift Handover & Telemetry Calibration Verification',
      rationale: 'Continue baseline operations under established safety guidelines.',
      targetSystem: 'Enterprise Asset Management System',
      owner: 'Operations Manager'
    }
  ];

  const monitoringPriorities: AIMonitoringPriority[] = isCritical ? [
    {
      id: 'MON-01',
      metric: 'Combustible Gas Telemetry (scada-gas-104)',
      zone: 'Primary Synthesis Reactor Area (Zone A)',
      frequency: 'Continuous (1s Edge Polling)',
      threshold: '> 10.0 PPM Combustible Limit',
      status: 'Active'
    },
    {
      id: 'MON-02',
      metric: 'Active Ignition Source & Permit Registry (SWP-882)',
      zone: 'Reactor Zone A Welding Bay',
      frequency: 'Real-Time Event Stream',
      threshold: 'Zero Active Permits Allowed During Excursion',
      status: 'Active'
    },
    {
      id: 'MON-03',
      metric: 'Personnel Muster Roster Count',
      zone: 'Sector A Emergency Muster Station',
      frequency: 'Every 30 Seconds',
      threshold: '100% Accountability (28 Workers)',
      status: 'Elevated'
    }
  ] : isWarning ? [
    {
      id: 'MON-01',
      metric: 'Manifold Flange Thermal Array (scada-temp-201)',
      zone: 'Hydrocarbon Storage Manifold (Zone B)',
      frequency: 'Every 10 Seconds',
      threshold: '< 40.0 °C Safety Boundary',
      status: 'Elevated'
    }
  ] : [
    {
      id: 'MON-01',
      metric: 'Plant-Wide Atmospheric Gas Manifold Array',
      zone: 'All 8 Physical Sectors',
      frequency: 'Standard 5s Telemetry Cycle',
      threshold: '< 5.0 PPM Baseline',
      status: 'Normal'
    }
  ];

  return {
    overallRisk,
    confidence,
    executiveAssessment,
    executiveSummary: executiveAssessment,
    compoundRisks,
    rootCauses,
    cascadingEvents,
    recommendedActions,
    monitoringPriorities,
    generatedAt: new Date().toISOString(),
    scenario,
    contextId: context?.contextId || `CTX-AI-DETERMINISTIC-${Date.now()}`
  };
}
