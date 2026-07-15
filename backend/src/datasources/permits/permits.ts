import { PermitRaw } from '../../types/pipeline';

export const getPermitsData = (scenario: string = 'normal'): PermitRaw => {
  const nextHour = new Date(Date.now() + 3600000).toISOString();

  if (scenario === 'critical') {
    return {
      system_status: 'EMERGENCY_LOCKDOWN',
      total_active: 0,
      active_permits: [
        {
          permit_no: 'PRM-2026-0891',
          work_type: 'HOT_WORK',
          area_sector: 'Sector 4 - Compressor Hall',
          status: 'REVOKED',
          valid_until: nextHour
        },
        {
          permit_no: 'PRM-2026-0892',
          work_type: 'CONFINED_SPACE',
          area_sector: 'Tank 12 Storage Yard',
          status: 'REVOKED',
          valid_until: nextHour
        }
      ]
    };
  }

  if (scenario === 'warning') {
    return {
      system_status: 'RESTRICTED_OPS',
      total_active: 1,
      active_permits: [
        {
          permit_no: 'PRM-2026-0891',
          work_type: 'HOT_WORK',
          area_sector: 'Sector 4 - Compressor Hall',
          status: 'SUSPENDED',
          valid_until: nextHour
        },
        {
          permit_no: 'PRM-2026-0892',
          work_type: 'CONFINED_SPACE',
          area_sector: 'Tank 08 Storage Yard',
          status: 'ACTIVE',
          valid_until: nextHour
        }
      ]
    };
  }

  // Normal
  return {
    system_status: 'NORMAL_OPS',
    total_active: 2,
    active_permits: [
      {
        permit_no: 'PRM-2026-0810',
        work_type: 'HOT_WORK',
        area_sector: 'Sector 8 - Maintenance Yard',
        status: 'ACTIVE',
        valid_until: nextHour
      },
      {
        permit_no: 'PRM-2026-0811',
        work_type: 'ELECTRICAL',
        area_sector: 'Sector 2 - Substation Alpha',
        status: 'ACTIVE',
        valid_until: nextHour
      }
    ]
  };
};

export default getPermitsData;
