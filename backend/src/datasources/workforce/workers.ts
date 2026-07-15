import { WorkforceRaw } from '../../types/pipeline';

export const getWorkforceData = (scenario: string = 'normal'): WorkforceRaw => {
  const scanTime = new Date().toISOString();

  if (scenario === 'critical') {
    return {
      shift_code: 'SHIFT-EMERGENCY-EVAC',
      total_headcount: 112,
      last_badge_scan: scanTime,
      zones_roster: [
        { zone_code: 'ZA-SEP', personnel_count: 12, emergency_warden: 'J. Miller' },
        { zone_code: 'ZB-HYD', personnel_count: 8, emergency_warden: 'R. Vance' },
        { zone_code: 'ZC-FRC', personnel_count: 4, emergency_warden: 'M. Chang' },
        { zone_code: 'TF-STR', personnel_count: 0, emergency_warden: 'EVACUATED' },
        { zone_code: 'CH-CMP', personnel_count: 6, emergency_warden: 'D. Rossi (HazMat Lead)' },
        { zone_code: 'RU-COR', personnel_count: 4, emergency_warden: 'S. Patel (Safety Officer)' },
        { zone_code: 'MW-MNT', personnel_count: 68, emergency_warden: 'L. Gomez (Muster Alpha)' },
        { zone_code: 'PC-CMD', personnel_count: 10, emergency_warden: 'Cmdr. H. Thorne' }
      ]
    };
  }

  if (scenario === 'warning') {
    return {
      shift_code: 'SHIFT-B-ELEVATED-MONITORING',
      total_headcount: 138,
      last_badge_scan: scanTime,
      zones_roster: [
        { zone_code: 'ZA-SEP', personnel_count: 20, emergency_warden: 'J. Miller' },
        { zone_code: 'ZB-HYD', personnel_count: 28, emergency_warden: 'R. Vance' },
        { zone_code: 'ZC-FRC', personnel_count: 14, emergency_warden: 'M. Chang' },
        { zone_code: 'TF-STR', personnel_count: 8, emergency_warden: 'T. Briggs' },
        { zone_code: 'CH-CMP', personnel_count: 22, emergency_warden: 'D. Rossi' },
        { zone_code: 'RU-COR', personnel_count: 12, emergency_warden: 'S. Patel' },
        { zone_code: 'MW-MNT', personnel_count: 24, emergency_warden: 'L. Gomez' },
        { zone_code: 'PC-CMD', personnel_count: 10, emergency_warden: 'Cmdr. H. Thorne' }
      ]
    };
  }

  // Normal
  return {
    shift_code: 'SHIFT-B-ROUTINE-ALPHA',
    total_headcount: 142,
    last_badge_scan: scanTime,
    zones_roster: [
      { zone_code: 'ZA-SEP', personnel_count: 24, emergency_warden: 'J. Miller' },
      { zone_code: 'ZB-HYD', personnel_count: 31, emergency_warden: 'R. Vance' },
      { zone_code: 'ZC-FRC', personnel_count: 18, emergency_warden: 'M. Chang' },
      { zone_code: 'TF-STR', personnel_count: 12, emergency_warden: 'T. Briggs' },
      { zone_code: 'CH-CMP', personnel_count: 16, emergency_warden: 'D. Rossi' },
      { zone_code: 'RU-COR', personnel_count: 9, emergency_warden: 'S. Patel' },
      { zone_code: 'MW-MNT', personnel_count: 22, emergency_warden: 'L. Gomez' },
      { zone_code: 'PC-CMD', personnel_count: 10, emergency_warden: 'Cmdr. H. Thorne' }
    ]
  };
};

export default getWorkforceData;
