import { GasSensorRaw } from '../../types/pipeline';

export const getGasSensorsData = (scenario: string = 'normal'): GasSensorRaw[] => {
  const now = Date.now();

  if (scenario === 'critical') {
    return [
      {
        sensor_id: 'scada-gas-101',
        timestamp_epoch: now,
        reading_ppm: 38.5,
        gas_type: 'H2S_CH4_MIX',
        status_flag: 'ERR_HIGH_EXCURSION'
      },
      {
        sensor_id: 'scada-gas-102',
        timestamp_epoch: now - 1500,
        reading_ppm: 34.2,
        gas_type: 'H2S_CH4_MIX',
        status_flag: 'ERR_HIGH_EXCURSION'
      }
    ];
  }

  if (scenario === 'warning') {
    return [
      {
        sensor_id: 'scada-gas-101',
        timestamp_epoch: now,
        reading_ppm: 14.8,
        gas_type: 'H2S_CH4_MIX',
        status_flag: 'WARN_ELEVATED'
      },
      {
        sensor_id: 'scada-gas-102',
        timestamp_epoch: now - 1500,
        reading_ppm: 11.2,
        gas_type: 'H2S_CH4_MIX',
        status_flag: 'WARN_ELEVATED'
      }
    ];
  }

  // Normal scenario
  return [
    {
      sensor_id: 'scada-gas-101',
      timestamp_epoch: now,
      reading_ppm: 1.4,
      gas_type: 'H2S_CH4_MIX',
      status_flag: 'OK_NOMINAL'
    },
    {
      sensor_id: 'scada-gas-102',
      timestamp_epoch: now - 1500,
      reading_ppm: 0.8,
      gas_type: 'H2S_CH4_MIX',
      status_flag: 'OK_NOMINAL'
    }
  ];
};

export default getGasSensorsData;
