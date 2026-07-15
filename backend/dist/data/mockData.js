"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SCENARIOS_DATA = exports.SCENARIO_INFOS = void 0;
exports.SCENARIO_INFOS = {
    normal: {
        id: 'normal',
        name: 'Normal Operation',
        badge: 'ONLINE - NORMAL',
        description: 'All industrial process units operating within nominal baseline parameters. Telemetry gateway steady.',
        simulationNotes: 'Nominal process throughput across all 8 zones. Atmospheric composition and pressure nominal.'
    },
    warning: {
        id: 'warning',
        name: 'Warning State',
        badge: 'ELEVATED - WARNING',
        description: 'Elevated gas concentration detected near Compressor Unit B coupled with rising exhaust line pressure.',
        simulationNotes: 'Pre-alarm threshold crossed for H2S and turbine back-pressure. Automated monitoring frequency doubled.'
    },
    critical: {
        id: 'critical',
        name: 'Critical Compound Risk',
        badge: 'CRITICAL ALERT - HIGH RISK',
        description: 'Simultaneous thermal excursion and gas leak across Tank Farm & Reactor Unit C. Compound risk threshold exceeded.',
        simulationNotes: 'High-severity compound risk state. Containment dampers engaged; hot work permits automatically revoked.'
    }
};
exports.SCENARIOS_DATA = {
    normal: {
        scenario: exports.SCENARIO_INFOS.normal,
        overview: {
            overallStatus: 'ONLINE - NORMAL',
            statusColor: 'safe',
            compoundRiskIndex: 18,
            activeAlertsCount: 0,
            workersOnSite: 142,
            activeMaintenanceJobs: 6,
            lastUpdated: new Date().toISOString()
        },
        sensors: [
            {
                id: 'sens-gas-01',
                name: 'Gas Concentration (H₂S / CH₄)',
                category: 'gas',
                currentValue: 1.4,
                unit: 'PPM',
                status: 'safe',
                trend: 'stable',
                trendLabel: 'Nominal Baseline (+0.1 PPM/hr)',
                history: [1.2, 1.3, 1.2, 1.4, 1.3, 1.4, 1.4, 1.3, 1.4, 1.4],
                thresholds: { warning: 10.0, critical: 25.0 }
            },
            {
                id: 'sens-temp-01',
                name: 'Main Reactor Core Temp',
                category: 'temperature',
                currentValue: 68.4,
                unit: '°C',
                status: 'safe',
                trend: 'stable',
                trendLabel: 'Optimal Thermal Equilibrium',
                history: [68.1, 68.2, 68.5, 68.3, 68.4, 68.6, 68.4, 68.3, 68.5, 68.4],
                thresholds: { warning: 85.0, critical: 105.0 }
            },
            {
                id: 'sens-press-01',
                name: 'Compressor Manifold Pressure',
                category: 'pressure',
                currentValue: 12.4,
                unit: 'Bar',
                status: 'safe',
                trend: 'stable',
                trendLabel: 'Balanced Hydraulic Flow',
                history: [12.2, 12.3, 12.4, 12.4, 12.3, 12.5, 12.4, 12.4, 12.3, 12.4],
                thresholds: { warning: 16.0, critical: 20.0 }
            },
            {
                id: 'sens-hum-01',
                name: 'Scrubber & Ambient Humidity',
                category: 'humidity',
                currentValue: 42.8,
                unit: '% RH',
                status: 'safe',
                trend: 'stable',
                trendLabel: 'Dry Scrubber Operating Nominal',
                history: [43.1, 42.9, 42.8, 42.7, 43.0, 42.8, 42.6, 42.9, 42.8, 42.8],
                thresholds: { warning: 65.0, critical: 80.0 }
            }
        ],
        zones: [
            {
                id: 'zone-a',
                name: 'Zone A - Primary Separation',
                code: 'ZA-SEP',
                type: 'process',
                status: 'safe',
                riskIndex: 12,
                equipmentState: 'Operational',
                workersCount: 24,
                temperature: 64.2,
                pressure: 11.8,
                gasConcentration: 1.1,
                details: 'Centrifugal separators operating at 99.4% mechanical efficiency. No anomalies.'
            },
            {
                id: 'zone-b',
                name: 'Zone B - Hydro-Processing',
                code: 'ZB-HYD',
                type: 'process',
                status: 'safe',
                riskIndex: 16,
                equipmentState: 'Operational',
                workersCount: 31,
                temperature: 68.4,
                pressure: 12.4,
                gasConcentration: 1.4,
                details: 'Catalytic beds steady. Scheduled filter check completed at 07:30.'
            },
            {
                id: 'zone-c',
                name: 'Zone C - Fractionation Column',
                code: 'ZC-FRC',
                type: 'process',
                status: 'safe',
                riskIndex: 19,
                equipmentState: 'Operational',
                workersCount: 18,
                temperature: 71.0,
                pressure: 13.1,
                gasConcentration: 1.3,
                details: 'Thermal reflux stabilized. Automatic distillation controllers engaged.'
            },
            {
                id: 'zone-tank',
                name: 'Tank Farm & Storage Yard',
                code: 'TF-STR',
                type: 'storage',
                status: 'safe',
                riskIndex: 14,
                equipmentState: 'Operational',
                workersCount: 12,
                temperature: 31.5,
                pressure: 1.2,
                gasConcentration: 0.8,
                details: 'Vapor recovery units active. Secondary containment integrity verified 100%.'
            },
            {
                id: 'zone-comp',
                name: 'Compressor Hall',
                code: 'CH-CMP',
                type: 'utility',
                status: 'safe',
                riskIndex: 22,
                equipmentState: 'Operational',
                workersCount: 16,
                temperature: 74.2,
                pressure: 14.2,
                gasConcentration: 1.5,
                details: 'Turbine generators 1 & 2 synchronized. Vibration sensors within green limits.'
            },
            {
                id: 'zone-react',
                name: 'Reactor Unit Core',
                code: 'RU-COR',
                type: 'process',
                status: 'safe',
                riskIndex: 24,
                equipmentState: 'Operational',
                workersCount: 9,
                temperature: 82.1,
                pressure: 14.8,
                gasConcentration: 1.6,
                details: 'Exothermic reaction cycle perfectly regulated by cooling loop Alpha.'
            },
            {
                id: 'zone-maint',
                name: 'Maintenance & Workshop Area',
                code: 'MW-MNT',
                type: 'maintenance',
                status: 'safe',
                riskIndex: 8,
                equipmentState: 'Operational',
                workersCount: 22,
                temperature: 24.0,
                pressure: 1.0,
                gasConcentration: 0.2,
                details: 'Routine pump overhaul underway. Standard PPE protocol enforced.'
            },
            {
                id: 'zone-work',
                name: 'Personnel & Command Center',
                code: 'PC-CMD',
                type: 'personnel',
                status: 'safe',
                riskIndex: 4,
                equipmentState: 'Operational',
                workersCount: 10,
                temperature: 22.5,
                pressure: 1.0,
                gasConcentration: 0.1,
                details: 'Control room shift B active. All environmental HVAC loops nominal.'
            }
        ],
        operationalStatus: {
            maintenanceStatus: '6 Active Routine Jobs (No Process Interruptions)',
            permitStatus: 'Hot Work (2 Active - Sector 8), Confined Space (0 Active)',
            currentShift: 'Shift B — Operations Team Alpha (08:00 - 20:00)',
            equipmentOperationalPct: 98.4,
            workersPresent: 142,
            activeChecklists: 14
        },
        timeline: [
            {
                id: 'tl-1',
                time: '08:00',
                title: 'Shift Handover Completed',
                description: 'Shift A to Shift B transition logged. All safety sign-offs verified.',
                severity: 'info',
                zone: 'Personnel & Command Center'
            },
            {
                id: 'tl-2',
                time: '08:30',
                title: 'Morning Safety Audit Passed',
                description: 'Automated telemetry health check confirming 1,420 sensors online.',
                severity: 'info',
                zone: 'Entire Facility'
            },
            {
                id: 'tl-3',
                time: '09:00',
                title: 'Plant Operating Normally',
                description: 'Production yield at 101.2% capacity. No safety or environmental alarms.',
                severity: 'info',
                zone: 'Process Sectors A, B, C'
            },
            {
                id: 'tl-4',
                time: '09:45',
                title: 'Routine Maintenance Started',
                description: 'Preventive lubrication initiated on Secondary Cooling Pump #4.',
                severity: 'info',
                zone: 'Maintenance & Workshop Area'
            }
        ],
        recommendations: [
            {
                id: 'rec-1',
                title: 'Continue Routine Telemetry Polling',
                category: 'Operational Process',
                priority: 'Routine',
                action: 'Maintain standard 5-second polling interval across SCADA gateway bridge.',
                status: 'Monitoring'
            },
            {
                id: 'rec-2',
                title: 'Verify Afternoon Shift Roster',
                category: 'Personnel Protocol',
                priority: 'Routine',
                action: 'Confirm emergency warden designations for Shift C prior to 19:30 briefing.',
                status: 'Monitoring'
            },
            {
                id: 'rec-3',
                title: 'Review Scrubber Filter Differential',
                category: 'Mechanical & Maintenance',
                priority: 'Routine',
                action: 'Perform weekly differential pressure check on Unit 3 scrubber pack during next break.',
                status: 'Monitoring'
            }
        ],
        riskTrend: [
            { time: '00:00', riskIndex: 16, safetyThreshold: 35, warningThreshold: 65, criticalThreshold: 85 },
            { time: '02:00', riskIndex: 15, safetyThreshold: 35, warningThreshold: 65, criticalThreshold: 85 },
            { time: '04:00', riskIndex: 17, safetyThreshold: 35, warningThreshold: 65, criticalThreshold: 85 },
            { time: '06:00', riskIndex: 18, safetyThreshold: 35, warningThreshold: 65, criticalThreshold: 85 },
            { time: '08:00', riskIndex: 16, safetyThreshold: 35, warningThreshold: 65, criticalThreshold: 85 },
            { time: '10:00', riskIndex: 19, safetyThreshold: 35, warningThreshold: 65, criticalThreshold: 85 },
            { time: '12:00', riskIndex: 18, safetyThreshold: 35, warningThreshold: 65, criticalThreshold: 85 },
            { time: '14:00', riskIndex: 17, safetyThreshold: 35, warningThreshold: 65, criticalThreshold: 85 },
            { time: '16:00', riskIndex: 18, safetyThreshold: 35, warningThreshold: 65, criticalThreshold: 85 },
            { time: '18:00', riskIndex: 19, safetyThreshold: 35, warningThreshold: 65, criticalThreshold: 85 },
            { time: '20:00', riskIndex: 17, safetyThreshold: 35, warningThreshold: 65, criticalThreshold: 85 },
            { time: '22:00', riskIndex: 18, safetyThreshold: 35, warningThreshold: 65, criticalThreshold: 85 }
        ]
    },
    warning: {
        scenario: exports.SCENARIO_INFOS.warning,
        overview: {
            overallStatus: 'ELEVATED - WARNING',
            statusColor: 'warning',
            compoundRiskIndex: 64,
            activeAlertsCount: 4,
            workersOnSite: 138,
            activeMaintenanceJobs: 9,
            lastUpdated: new Date().toISOString()
        },
        sensors: [
            {
                id: 'sens-gas-01',
                name: 'Gas Concentration (H₂S / CH₄)',
                category: 'gas',
                currentValue: 14.8,
                unit: 'PPM',
                status: 'warning',
                trend: 'up',
                trendLabel: 'Elevated Gas (+2.4 PPM/30m)',
                history: [1.4, 2.1, 3.8, 6.5, 9.2, 11.4, 12.8, 13.9, 14.5, 14.8],
                thresholds: { warning: 10.0, critical: 25.0 }
            },
            {
                id: 'sens-temp-01',
                name: 'Main Reactor Core Temp',
                category: 'temperature',
                currentValue: 91.2,
                unit: '°C',
                status: 'warning',
                trend: 'up',
                trendLabel: 'Thermal Build-Up Detected',
                history: [68.4, 71.2, 75.6, 79.8, 83.4, 86.2, 88.5, 89.9, 90.8, 91.2],
                thresholds: { warning: 85.0, critical: 105.0 }
            },
            {
                id: 'sens-press-01',
                name: 'Compressor Manifold Pressure',
                category: 'pressure',
                currentValue: 16.8,
                unit: 'Bar',
                status: 'warning',
                trend: 'up',
                trendLabel: 'Backpressure Exceeding Nominal',
                history: [12.4, 12.9, 13.6, 14.4, 15.1, 15.8, 16.2, 16.5, 16.7, 16.8],
                thresholds: { warning: 16.0, critical: 20.0 }
            },
            {
                id: 'sens-hum-01',
                name: 'Scrubber & Ambient Humidity',
                category: 'humidity',
                currentValue: 58.4,
                unit: '% RH',
                status: 'safe',
                trend: 'up',
                trendLabel: 'Scrubber Vapor Rising',
                history: [42.8, 44.5, 47.2, 50.1, 52.8, 55.0, 56.5, 57.4, 58.1, 58.4],
                thresholds: { warning: 65.0, critical: 80.0 }
            }
        ],
        zones: [
            {
                id: 'zone-a',
                name: 'Zone A - Primary Separation',
                code: 'ZA-SEP',
                type: 'process',
                status: 'safe',
                riskIndex: 28,
                equipmentState: 'Operational',
                workersCount: 20,
                temperature: 68.0,
                pressure: 13.2,
                gasConcentration: 2.4,
                details: 'Separation rate slightly reduced to accommodate elevated downstream pressure.'
            },
            {
                id: 'zone-b',
                name: 'Zone B - Hydro-Processing',
                code: 'ZB-HYD',
                type: 'process',
                status: 'safe',
                riskIndex: 34,
                equipmentState: 'Operational',
                workersCount: 28,
                temperature: 74.5,
                pressure: 14.8,
                gasConcentration: 4.2,
                details: 'Catalytic beds experiencing higher thermal load. Auxiliary fans active.'
            },
            {
                id: 'zone-c',
                name: 'Zone C - Fractionation Column',
                code: 'ZC-FRC',
                type: 'process',
                status: 'warning',
                riskIndex: 66,
                equipmentState: 'Degraded',
                workersCount: 14,
                temperature: 89.2,
                pressure: 16.4,
                gasConcentration: 11.2,
                details: 'Fractionation column showing pressure fluctuation. Pre-alarm triggered.'
            },
            {
                id: 'zone-tank',
                name: 'Tank Farm & Storage Yard',
                code: 'TF-STR',
                type: 'storage',
                status: 'safe',
                riskIndex: 24,
                equipmentState: 'Operational',
                workersCount: 8,
                temperature: 34.2,
                pressure: 1.4,
                gasConcentration: 1.8,
                details: 'Vapor recovery units at 80% duty cycle. Tank pressures stable.'
            },
            {
                id: 'zone-comp',
                name: 'Compressor Hall',
                code: 'CH-CMP',
                type: 'utility',
                status: 'warning',
                riskIndex: 78,
                equipmentState: 'Degraded',
                workersCount: 22,
                temperature: 92.4,
                pressure: 16.8,
                gasConcentration: 14.8,
                details: 'Turbine Unit #2 seal degradation detected. Elevated H₂S concentration.'
            },
            {
                id: 'zone-react',
                name: 'Reactor Unit Core',
                code: 'RU-COR',
                type: 'process',
                status: 'warning',
                riskIndex: 72,
                equipmentState: 'Degraded',
                workersCount: 12,
                temperature: 91.2,
                pressure: 16.1,
                gasConcentration: 8.6,
                details: 'Cooling loop Beta activated to counter thermal rise. Manual inspection dispatched.'
            },
            {
                id: 'zone-maint',
                name: 'Maintenance & Workshop Area',
                code: 'MW-MNT',
                type: 'maintenance',
                status: 'safe',
                riskIndex: 14,
                equipmentState: 'Operational',
                workersCount: 24,
                temperature: 24.5,
                pressure: 1.0,
                gasConcentration: 0.5,
                details: 'Emergency repair kits prepped for Compressor Hall dispatch.'
            },
            {
                id: 'zone-work',
                name: 'Personnel & Command Center',
                code: 'PC-CMD',
                type: 'personnel',
                status: 'safe',
                riskIndex: 10,
                equipmentState: 'Operational',
                workersCount: 10,
                temperature: 22.8,
                pressure: 1.0,
                gasConcentration: 0.2,
                details: 'Control room monitoring pre-alarm state. Safety teams placed on standby.'
            }
        ],
        operationalStatus: {
            maintenanceStatus: '9 Active Jobs (Emergency Seal Inspection in Compressor Hall)',
            permitStatus: 'Hot Work (Suspended in Sector 4 & 5), Confined Space (1 Active - Tank 08)',
            currentShift: 'Shift B — Operations Team Alpha + Emergency Response Unit On Standby',
            equipmentOperationalPct: 89.2,
            workersPresent: 138,
            activeChecklists: 22
        },
        timeline: [
            {
                id: 'tl-1',
                time: '09:00',
                title: 'Plant Operating Normally',
                description: 'All process metrics within standard baseline boundaries.',
                severity: 'info',
                zone: 'Entire Facility'
            },
            {
                id: 'tl-2',
                time: '09:05',
                title: 'Maintenance Started on Compressor #2',
                description: 'Scheduled seal inspection and vibration dampening calibration initiated.',
                severity: 'info',
                zone: 'Compressor Hall'
            },
            {
                id: 'tl-3',
                time: '09:08',
                title: 'Gas Concentration Increasing',
                description: 'H₂S sensors in Compressor Hall detected rise from 1.4 PPM to 8.5 PPM.',
                severity: 'warning',
                zone: 'Compressor Hall'
            },
            {
                id: 'tl-4',
                time: '09:10',
                title: 'Hot Work Permit Suspended',
                description: 'Safety automation suspended all active hot work permits within 100m perimeter.',
                severity: 'warning',
                zone: 'Zone C & Compressor Hall'
            },
            {
                id: 'tl-5',
                time: '09:12',
                title: 'Rapid Response Team Alerted',
                description: 'Vibration spike on Turbine #2 confirmed. Operations initiated load reduction.',
                severity: 'warning',
                zone: 'Compressor Hall & Reactor Core'
            }
        ],
        recommendations: [
            {
                id: 'rec-1',
                title: 'Monitor Gas Concentration in Sector 4-B',
                category: 'Safety & Atmosphere',
                priority: 'High',
                action: 'Deploy portable multi-gas detectors around Compressor Hall perimeter immediately.',
                status: 'Action Required'
            },
            {
                id: 'rec-2',
                title: 'Verify Maintenance Checklist for Turbine Unit #2',
                category: 'Mechanical & Maintenance',
                priority: 'High',
                action: 'Inspect high-pressure mechanical seals and confirm backup lube pump pressure.',
                status: 'Action Required'
            },
            {
                id: 'rec-3',
                title: 'Continue Pressure Monitoring on Manifold Alpha',
                category: 'Operational Process',
                priority: 'Medium',
                action: 'Prepare bypass discharge loop if manifold backpressure exceeds 17.5 Bar.',
                status: 'Monitoring'
            },
            {
                id: 'rec-4',
                title: 'Restrict Non-Essential Personnel Entry',
                category: 'Personnel Protocol',
                priority: 'Medium',
                action: 'Enforce yellow safety perimeter around Zone C Fractionation and Compressor Hall.',
                status: 'Monitoring'
            }
        ],
        riskTrend: [
            { time: '00:00', riskIndex: 18, safetyThreshold: 35, warningThreshold: 65, criticalThreshold: 85 },
            { time: '02:00', riskIndex: 17, safetyThreshold: 35, warningThreshold: 65, criticalThreshold: 85 },
            { time: '04:00', riskIndex: 19, safetyThreshold: 35, warningThreshold: 65, criticalThreshold: 85 },
            { time: '06:00', riskIndex: 18, safetyThreshold: 35, warningThreshold: 65, criticalThreshold: 85 },
            { time: '08:00', riskIndex: 22, safetyThreshold: 35, warningThreshold: 65, criticalThreshold: 85 },
            { time: '10:00', riskIndex: 48, safetyThreshold: 35, warningThreshold: 65, criticalThreshold: 85 },
            { time: '12:00', riskIndex: 58, safetyThreshold: 35, warningThreshold: 65, criticalThreshold: 85 },
            { time: '14:00', riskIndex: 64, safetyThreshold: 35, warningThreshold: 65, criticalThreshold: 85 },
            { time: '16:00', riskIndex: 62, safetyThreshold: 35, warningThreshold: 65, criticalThreshold: 85 },
            { time: '18:00', riskIndex: 65, safetyThreshold: 35, warningThreshold: 65, criticalThreshold: 85 },
            { time: '20:00', riskIndex: 63, safetyThreshold: 35, warningThreshold: 65, criticalThreshold: 85 },
            { time: '22:00', riskIndex: 64, safetyThreshold: 35, warningThreshold: 65, criticalThreshold: 85 }
        ]
    },
    critical: {
        scenario: exports.SCENARIO_INFOS.critical,
        overview: {
            overallStatus: 'CRITICAL ALERT - HIGH RISK',
            statusColor: 'critical',
            compoundRiskIndex: 89,
            activeAlertsCount: 12,
            workersOnSite: 112,
            activeMaintenanceJobs: 14,
            lastUpdated: new Date().toISOString()
        },
        sensors: [
            {
                id: 'sens-gas-01',
                name: 'Gas Concentration (H₂S / CH₄)',
                category: 'gas',
                currentValue: 38.5,
                unit: 'PPM',
                status: 'critical',
                trend: 'up',
                trendLabel: 'CRITICAL GAS EXCURSION (+12.4 PPM/10m)',
                history: [14.8, 18.2, 23.4, 28.1, 31.5, 34.2, 36.1, 37.4, 38.1, 38.5],
                thresholds: { warning: 10.0, critical: 25.0 }
            },
            {
                id: 'sens-temp-01',
                name: 'Main Reactor Core Temp',
                category: 'temperature',
                currentValue: 118.2,
                unit: '°C',
                status: 'critical',
                trend: 'up',
                trendLabel: 'EXOTHERMIC RUNAWAY ALERT',
                history: [91.2, 95.8, 101.4, 106.2, 109.8, 112.5, 115.1, 116.8, 117.6, 118.2],
                thresholds: { warning: 85.0, critical: 105.0 }
            },
            {
                id: 'sens-press-01',
                name: 'Compressor Manifold Pressure',
                category: 'pressure',
                currentValue: 22.1,
                unit: 'Bar',
                status: 'critical',
                trend: 'up',
                trendLabel: 'RELIEF VALVE THRESHOLD CROSSED',
                history: [16.8, 17.6, 18.8, 19.9, 20.6, 21.2, 21.6, 21.9, 22.0, 22.1],
                thresholds: { warning: 16.0, critical: 20.0 }
            },
            {
                id: 'sens-hum-01',
                name: 'Scrubber & Ambient Humidity',
                category: 'humidity',
                currentValue: 84.2,
                unit: '% RH',
                status: 'critical',
                trend: 'up',
                trendLabel: 'Scrubber Saturation Exceeded',
                history: [58.4, 63.2, 68.9, 74.1, 78.5, 80.8, 82.1, 83.4, 83.9, 84.2],
                thresholds: { warning: 65.0, critical: 80.0 }
            }
        ],
        zones: [
            {
                id: 'zone-a',
                name: 'Zone A - Primary Separation',
                code: 'ZA-SEP',
                type: 'process',
                status: 'warning',
                riskIndex: 58,
                equipmentState: 'Degraded',
                workersCount: 12,
                temperature: 78.4,
                pressure: 16.1,
                gasConcentration: 8.4,
                details: 'Emergency containment dampers partially sealed. Emergency vents opened.'
            },
            {
                id: 'zone-b',
                name: 'Zone B - Hydro-Processing',
                code: 'ZB-HYD',
                type: 'process',
                status: 'critical',
                riskIndex: 84,
                equipmentState: 'Degraded',
                workersCount: 8,
                temperature: 98.2,
                pressure: 19.4,
                gasConcentration: 24.8,
                details: 'Emergency nitrogen purge initiated. Personnel evacuating to muster station Alpha.'
            },
            {
                id: 'zone-c',
                name: 'Zone C - Fractionation Column',
                code: 'ZC-FRC',
                type: 'process',
                status: 'critical',
                riskIndex: 92,
                equipmentState: 'Degraded',
                workersCount: 4,
                temperature: 112.0,
                pressure: 21.8,
                gasConcentration: 34.2,
                details: 'Distillation column pressure critical. Relief flares operating at maximum capacity.'
            },
            {
                id: 'zone-tank',
                name: 'Tank Farm & Storage Yard',
                code: 'TF-STR',
                type: 'storage',
                status: 'critical',
                riskIndex: 88,
                equipmentState: 'Offline',
                workersCount: 0,
                temperature: 62.4,
                pressure: 3.8,
                gasConcentration: 38.5,
                details: 'Vapor cloud warning near Tank 12. Automated foam suppression system armed.'
            },
            {
                id: 'zone-comp',
                name: 'Compressor Hall',
                code: 'CH-CMP',
                type: 'utility',
                status: 'critical',
                riskIndex: 95,
                equipmentState: 'Offline',
                workersCount: 6,
                temperature: 114.8,
                pressure: 22.1,
                gasConcentration: 36.8,
                details: 'Emergency trip actuated on Turbine #1 & #2. Mechanical seal failure confirmed.'
            },
            {
                id: 'zone-react',
                name: 'Reactor Unit Core',
                code: 'RU-COR',
                type: 'process',
                status: 'critical',
                riskIndex: 96,
                equipmentState: 'Degraded',
                workersCount: 4,
                temperature: 118.2,
                pressure: 21.4,
                gasConcentration: 28.4,
                details: 'Core thermal excursion. Auxiliary deluge and emergency quenching sequence initiated.'
            },
            {
                id: 'zone-maint',
                name: 'Maintenance & Workshop Area',
                code: 'MW-MNT',
                type: 'maintenance',
                status: 'warning',
                riskIndex: 42,
                equipmentState: 'Operational',
                workersCount: 68,
                temperature: 26.0,
                pressure: 1.0,
                gasConcentration: 2.1,
                details: 'Converted into active staging area for Emergency Response & HazMat units.'
            },
            {
                id: 'zone-work',
                name: 'Personnel & Command Center',
                code: 'PC-CMD',
                type: 'personnel',
                status: 'safe',
                riskIndex: 18,
                equipmentState: 'Operational',
                workersCount: 10,
                temperature: 23.0,
                pressure: 1.0,
                gasConcentration: 0.4,
                details: 'Emergency Command active. Positive pressure air filtration running at 100%.'
            }
        ],
        operationalStatus: {
            maintenanceStatus: 'EMERGENCY CONTAINMENT ACTIVE (All routine jobs aborted)',
            permitStatus: 'ALL PERMITS REVOKED — Emergency Access Controlled via Incident Commander',
            currentShift: 'EMERGENCY LOCKDOWN — Non-essential personnel evacuated to Muster Stations',
            equipmentOperationalPct: 62.1,
            workersPresent: 112,
            activeChecklists: 34
        },
        timeline: [
            {
                id: 'tl-1',
                time: '09:08',
                title: 'Gas Concentration Increasing',
                description: 'Compressor Hall H₂S concentration exceeded 10 PPM warning threshold.',
                severity: 'warning',
                zone: 'Compressor Hall'
            },
            {
                id: 'tl-2',
                time: '09:12',
                title: 'Vibration & Pressure Surge Detected',
                description: 'High-pressure discharge line backpressure reached 19.8 Bar.',
                severity: 'warning',
                zone: 'Compressor Hall & Reactor Core'
            },
            {
                id: 'tl-3',
                time: '09:15',
                title: 'Compound Risk Excursion Triggered',
                description: 'Simultaneous H₂S spike and thermal excursion crossed compound safety threshold.',
                severity: 'critical',
                zone: 'Tank Farm, Compressor, Reactor'
            },
            {
                id: 'tl-4',
                time: '09:16',
                title: 'Automated Emergency Shutdown (ESD)',
                description: 'Turbine generators tripped. Emergency flare header opened automatically.',
                severity: 'critical',
                zone: 'Compressor & Fractionation'
            },
            {
                id: 'tl-5',
                time: '09:18',
                title: 'Evacuation Order Issued',
                description: 'Siren activated for Zones B, C, and Tank Farm. 30 personnel evacuating.',
                severity: 'critical',
                zone: 'Process & Storage Sectors'
            },
            {
                id: 'tl-6',
                time: '09:20',
                title: 'HazMat & Containment Teams Deployed',
                description: 'Emergency response units deploying water curtain and nitrogen quenching.',
                severity: 'critical',
                zone: 'Reactor Unit Core & Tank Farm'
            }
        ],
        recommendations: [
            {
                id: 'rec-1',
                title: 'EVACUATE NON-ESSENTIAL PERSONNEL FROM ZONES B & C',
                category: 'Safety & Atmosphere',
                priority: 'High',
                action: 'Immediate mandatory headcount at Muster Stations Alpha and Beta via RFID roll call.',
                status: 'Action Required'
            },
            {
                id: 'rec-2',
                title: 'Engage Emergency Quenching Loop on Reactor #1',
                category: 'Operational Process',
                priority: 'High',
                action: 'Confirm manual valve actuation for emergency nitrogen injection line.',
                status: 'Action Required'
            },
            {
                id: 'rec-3',
                title: 'Inspect Tank Farm Perimeter & Containment Dikes',
                category: 'Mechanical & Maintenance',
                priority: 'High',
                action: 'Deploy HazMat drone reconnaissance over Tank 12 vapor cloud to verify dike integrity.',
                status: 'Action Required'
            },
            {
                id: 'rec-4',
                title: 'Maintain Positive Pressure in Command Center',
                category: 'Personnel Protocol',
                priority: 'High',
                action: 'Verify secondary carbon scrubber filters on Control Room air intake are sealed.',
                status: 'Monitoring'
            },
            {
                id: 'rec-5',
                title: 'Notify Municipal Emergency Services & SCADA Gateway',
                category: 'Safety & Atmosphere',
                priority: 'High',
                action: 'Transmit automated Level-3 industrial alert payload to Regional Safety Telemetry Bridge.',
                status: 'Action Required'
            }
        ],
        riskTrend: [
            { time: '00:00', riskIndex: 18, safetyThreshold: 35, warningThreshold: 65, criticalThreshold: 85 },
            { time: '02:00', riskIndex: 19, safetyThreshold: 35, warningThreshold: 65, criticalThreshold: 85 },
            { time: '04:00', riskIndex: 18, safetyThreshold: 35, warningThreshold: 65, criticalThreshold: 85 },
            { time: '06:00', riskIndex: 20, safetyThreshold: 35, warningThreshold: 65, criticalThreshold: 85 },
            { time: '08:00', riskIndex: 25, safetyThreshold: 35, warningThreshold: 65, criticalThreshold: 85 },
            { time: '10:00', riskIndex: 52, safetyThreshold: 35, warningThreshold: 65, criticalThreshold: 85 },
            { time: '12:00', riskIndex: 68, safetyThreshold: 35, warningThreshold: 65, criticalThreshold: 85 },
            { time: '14:00', riskIndex: 79, safetyThreshold: 35, warningThreshold: 65, criticalThreshold: 85 },
            { time: '16:00', riskIndex: 86, safetyThreshold: 35, warningThreshold: 65, criticalThreshold: 85 },
            { time: '18:00', riskIndex: 89, safetyThreshold: 35, warningThreshold: 65, criticalThreshold: 85 },
            { time: '20:00', riskIndex: 88, safetyThreshold: 35, warningThreshold: 65, criticalThreshold: 85 },
            { time: '22:00', riskIndex: 89, safetyThreshold: 35, warningThreshold: 65, criticalThreshold: 85 }
        ]
    }
};
