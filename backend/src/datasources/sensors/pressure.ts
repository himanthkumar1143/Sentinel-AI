import { PressureSensorRaw } from '../../types/pipeline';

export const getPressureSensorsData = (scenario: string = 'normal'): PressureSensorRaw[] => {
  const nowStr = new Date().toISOString();

  if (scenario === 'critical') {
    return [
      {
        deviceCode: 'DEV-PRESS-M1',
        press_bar: 22.1,
        manifold_name: 'Compressor Manifold Alpha',
        read_time: nowStr,
        is_error: true
      },
      {
        deviceCode: 'DEV-PRESS-M2',
        press_bar: 21.8,
        manifold_name: 'Fractionation Column Manifold',
        read_time: nowStr,
        is_error: true
      }
    ];
  }

  if (scenario === 'warning') {
    return [
      {
        deviceCode: 'DEV-PRESS-M1',
        press_bar: 16.8,
        manifold_name: 'Compressor Manifold Alpha',
        read_time: nowStr,
        is_error: true
      },
      {
        deviceCode: 'DEV-PRESS-M2',
        press_bar: 16.4,
        manifold_name: 'Fractionation Column Manifold',
        read_time: nowStr,
        is_error: true
      }
    ];
  }

  // Normal
  return [
    {
      deviceCode: 'DEV-PRESS-M1',
      press_bar: 12.4,
      manifold_name: 'Compressor Manifold Alpha',
      read_time: nowStr,
      is_error: false
    },
    {
      deviceCode: 'DEV-PRESS-M2',
      press_bar: 13.1,
      manifold_name: 'Fractionation Column Manifold',
      read_time: nowStr,
      is_error: false
    }
  ];
};

export default getPressureSensorsData;
