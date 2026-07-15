import { WeatherRaw } from '../../types/pipeline';

export const getWeatherData = (scenario: string = 'normal'): WeatherRaw => {
  const recordedAt = new Date().toISOString();

  if (scenario === 'critical') {
    return {
      station_id: 'MET-STATION-SECTOR-1',
      ambient_temp: 34.8,
      wind_speed_kmh: 42.5,
      wind_direction: 'NE (Toward Storage Yards)',
      barometric_pressure_hpa: 1004.2,
      precipitation_mm: 0.0,
      condition: 'High Wind / Atmospheric Inversion Advisory',
      recorded_at: recordedAt
    };
  }

  if (scenario === 'warning') {
    return {
      station_id: 'MET-STATION-SECTOR-1',
      ambient_temp: 31.2,
      wind_speed_kmh: 28.0,
      wind_direction: 'NNE',
      barometric_pressure_hpa: 1011.5,
      precipitation_mm: 0.0,
      condition: 'Moderate Breeze / Dry',
      recorded_at: recordedAt
    };
  }

  // Normal
  return {
    station_id: 'MET-STATION-SECTOR-1',
    ambient_temp: 26.4,
    wind_speed_kmh: 14.2,
    wind_direction: 'NW',
    barometric_pressure_hpa: 1016.8,
    precipitation_mm: 0.0,
    condition: 'Nominal Clear Skies',
    recorded_at: recordedAt
  };
};

export default getWeatherData;
