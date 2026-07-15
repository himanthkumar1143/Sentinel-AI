import { HumiditySensorRaw } from '../../types/pipeline';

export const getHumiditySensorsData = (scenario: string = 'normal'): HumiditySensorRaw[] => {
  const now = Date.now();

  if (scenario === 'critical') {
    return [
      {
        probe_id: 'PRB-HUM-SCRUBBER-1',
        rh_percent: 84.2,
        location: 'Scrubber Exhaust Unit 1',
        time_recorded: now,
        sensor_ok: true
      },
      {
        probe_id: 'PRB-HUM-AMB-2',
        rh_percent: 78.5,
        location: 'Ambient Storage Bay',
        time_recorded: now,
        sensor_ok: true
      }
    ];
  }

  if (scenario === 'warning') {
    return [
      {
        probe_id: 'PRB-HUM-SCRUBBER-1',
        rh_percent: 58.4,
        location: 'Scrubber Exhaust Unit 1',
        time_recorded: now,
        sensor_ok: true
      },
      {
        probe_id: 'PRB-HUM-AMB-2',
        rh_percent: 54.0,
        location: 'Ambient Storage Bay',
        time_recorded: now,
        sensor_ok: true
      }
    ];
  }

  // Normal
  return [
    {
      probe_id: 'PRB-HUM-SCRUBBER-1',
      rh_percent: 42.8,
      location: 'Scrubber Exhaust Unit 1',
      time_recorded: now,
      sensor_ok: true
    },
    {
      probe_id: 'PRB-HUM-AMB-2',
      rh_percent: 40.5,
      location: 'Ambient Storage Bay',
      time_recorded: now,
      sensor_ok: true
    }
  ];
};

export default getHumiditySensorsData;
