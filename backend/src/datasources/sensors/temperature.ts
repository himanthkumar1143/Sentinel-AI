import { TempSensorRaw } from '../../types/pipeline';

export const getTemperatureSensorsData = (scenario: string = 'normal'): TempSensorRaw[] => {
  const timeFormatted = new Date().toUTCString();

  if (scenario === 'critical') {
    return [
      {
        unit_tag: 'TAG-CORE-REACTOR-A',
        temp_celsius: 118.2,
        core_section: 'Reactor Core Unit Alpha',
        timestamp: timeFormatted,
        alert_level: 3
      },
      {
        unit_tag: 'TAG-FRAC-COLUMN-C',
        temp_celsius: 112.0,
        core_section: 'Distillation Column Top',
        timestamp: timeFormatted,
        alert_level: 3
      }
    ];
  }

  if (scenario === 'warning') {
    return [
      {
        unit_tag: 'TAG-CORE-REACTOR-A',
        temp_celsius: 91.2,
        core_section: 'Reactor Core Unit Alpha',
        timestamp: timeFormatted,
        alert_level: 2
      },
      {
        unit_tag: 'TAG-FRAC-COLUMN-C',
        temp_celsius: 89.2,
        core_section: 'Distillation Column Top',
        timestamp: timeFormatted,
        alert_level: 2
      }
    ];
  }

  // Normal
  return [
    {
      unit_tag: 'TAG-CORE-REACTOR-A',
      temp_celsius: 68.4,
      core_section: 'Reactor Core Unit Alpha',
      timestamp: timeFormatted,
      alert_level: 0
    },
    {
      unit_tag: 'TAG-FRAC-COLUMN-C',
      temp_celsius: 71.0,
      core_section: 'Distillation Column Top',
      timestamp: timeFormatted,
      alert_level: 0
    }
  ];
};

export default getTemperatureSensorsData;
