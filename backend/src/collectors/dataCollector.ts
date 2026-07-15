import { RawIndustrialData } from '../types/pipeline';
import { getGasSensorsData } from '../datasources/sensors/gas';
import { getPressureSensorsData } from '../datasources/sensors/pressure';
import { getTemperatureSensorsData } from '../datasources/sensors/temperature';
import { getHumiditySensorsData } from '../datasources/sensors/humidity';
import { getMaintenanceData } from '../datasources/maintenance/maintenance';
import { getPermitsData } from '../datasources/permits/permits';
import { getWorkforceData } from '../datasources/workforce/workers';
import { getWeatherData } from '../datasources/weather/weather';

export class DataCollector {
  /**
   * Fetches data from all independent industrial mock sources
   * and merges them into a single raw temporary object before validation.
   */
  public static collect(scenario: string = 'normal'): RawIndustrialData {
    const gas = getGasSensorsData(scenario);
    const pressure = getPressureSensorsData(scenario);
    const temperature = getTemperatureSensorsData(scenario);
    const humidity = getHumiditySensorsData(scenario);
    const maintenance = getMaintenanceData(scenario);
    const permits = getPermitsData(scenario);
    const workforce = getWorkforceData(scenario);
    const weather = getWeatherData(scenario);

    return {
      collectionTimestamp: new Date().toISOString(),
      scenario,
      sources: {
        gas,
        pressure,
        temperature,
        humidity,
        maintenance,
        permits,
        workforce,
        weather
      }
    };
  }
}

export default DataCollector;
