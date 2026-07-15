import { MaintenanceRaw } from '../../types/pipeline';

export const getMaintenanceData = (scenario: string = 'normal'): MaintenanceRaw => {
  const queryTime = new Date().toISOString();

  if (scenario === 'critical') {
    return {
      system_id: 'SAP-PM-MOCK-700',
      query_time: queryTime,
      job_list: [
        {
          ticket_id: 'WO-99410-EMERG',
          equipment_code: 'COMP-TURB-01',
          job_description: 'EMERGENCY CONTAINMENT — Mechanical Seal Failure Isolation',
          priority_level: 'EMERGENCY',
          active: true,
          assigned_crew: 8
        },
        {
          ticket_id: 'WO-99412-EMERG',
          equipment_code: 'REACT-DELUGE-02',
          job_description: 'Auxiliary Water Deluge System Activation & Manual Quenching',
          priority_level: 'EMERGENCY',
          active: true,
          assigned_crew: 6
        }
      ]
    };
  }

  if (scenario === 'warning') {
    return {
      system_id: 'SAP-PM-MOCK-700',
      query_time: queryTime,
      job_list: [
        {
          ticket_id: 'WO-88204-HIGH',
          equipment_code: 'COMP-TURB-02',
          job_description: 'High-Priority Vibration Dampening & Seal Check on Turbine 2',
          priority_level: 'HIGH',
          active: true,
          assigned_crew: 5
        },
        {
          ticket_id: 'WO-88209-ROUTINE',
          equipment_code: 'PUMP-COOLING-B',
          job_description: 'Routine Inspection of Primary Cooling Loop Pump',
          priority_level: 'ROUTINE',
          active: true,
          assigned_crew: 4
        }
      ]
    };
  }

  // Normal
  return {
    system_id: 'SAP-PM-MOCK-700',
    query_time: queryTime,
    job_list: [
      {
        ticket_id: 'WO-10492-ROUTINE',
        equipment_code: 'SEP-CENTRIF-01',
        job_description: 'Preventive Bearing Lubrication and Filter Replacement',
        priority_level: 'ROUTINE',
        active: true,
        assigned_crew: 3
      },
      {
        ticket_id: 'WO-10495-ROUTINE',
        equipment_code: 'HVAC-EXHAUST-4',
        job_description: 'Standard Filter Pack Check on Scrubber Unit 3',
        priority_level: 'ROUTINE',
        active: true,
        assigned_crew: 3
      }
    ]
  };
};

export default getMaintenanceData;
