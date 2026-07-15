import { RawIndustrialData, NormalizedSensorItem } from '../types/pipeline';

export class SensorNormalizer {
  public static normalize(raw: RawIndustrialData): NormalizedSensorItem[] {
    const normalized: NormalizedSensorItem[] = [];

    // 1. Gas sensors (reading_ppm -> currentValue, status_flag -> status)
    if (Array.isArray(raw.sources.gas)) {
      for (const g of raw.sources.gas) {
        let status: 'safe' | 'warning' | 'critical' = 'safe';
        if (g.status_flag?.includes('HIGH') || g.reading_ppm >= 25.0) status = 'critical';
        else if (g.status_flag?.includes('WARN') || g.reading_ppm >= 10.0) status = 'warning';

        let trend: 'up' | 'down' | 'stable' = 'stable';
        if (status === 'critical' || status === 'warning') trend = 'up';

        normalized.push({
          id: g.sensor_id || 'gas-unknown',
          name: 'Gas Concentration (H₂S / CH₄)',
          category: 'gas',
          currentValue: Number(g.reading_ppm?.toFixed(2)) || 0,
          unit: 'PPM',
          status,
          trend,
          timestamp: new Date(g.timestamp_epoch || Date.now()).toISOString()
        });
      }
    }

    // 2. Pressure sensors (press_bar -> currentValue)
    if (Array.isArray(raw.sources.pressure)) {
      for (const p of raw.sources.pressure) {
        let status: 'safe' | 'warning' | 'critical' = 'safe';
        if (p.press_bar >= 20.0) status = 'critical';
        else if (p.press_bar >= 16.0 || p.is_error) status = 'warning';

        let trend: 'up' | 'down' | 'stable' = 'stable';
        if (status !== 'safe') trend = 'up';

        normalized.push({
          id: p.deviceCode || 'press-unknown',
          name: `${p.manifold_name || 'Compressor Manifold'} Pressure`,
          category: 'pressure',
          currentValue: Number(p.press_bar?.toFixed(2)) || 0,
          unit: 'Bar',
          status,
          trend,
          timestamp: new Date(p.read_time || Date.now()).toISOString()
        });
      }
    }

    // 3. Temperature sensors (temp_celsius -> currentValue)
    if (Array.isArray(raw.sources.temperature)) {
      for (const t of raw.sources.temperature) {
        let status: 'safe' | 'warning' | 'critical' = 'safe';
        if (t.alert_level === 3 || t.temp_celsius >= 105.0) status = 'critical';
        else if (t.alert_level === 2 || t.temp_celsius >= 85.0) status = 'warning';

        let trend: 'up' | 'down' | 'stable' = 'stable';
        if (status !== 'safe') trend = 'up';

        normalized.push({
          id: t.unit_tag || 'temp-unknown',
          name: `${t.core_section || 'Reactor Core'} Temp`,
          category: 'temperature',
          currentValue: Number(t.temp_celsius?.toFixed(2)) || 0,
          unit: '°C',
          status,
          trend,
          timestamp: new Date(t.timestamp || Date.now()).toISOString()
        });
      }
    }

    // 4. Humidity sensors (rh_percent -> currentValue)
    if (Array.isArray(raw.sources.humidity)) {
      for (const h of raw.sources.humidity) {
        let status: 'safe' | 'warning' | 'critical' = 'safe';
        if (h.rh_percent >= 80.0) status = 'critical';
        else if (h.rh_percent >= 65.0) status = 'warning';

        let trend: 'up' | 'down' | 'stable' = 'stable';
        if (status !== 'safe') trend = 'up';

        normalized.push({
          id: h.probe_id || 'hum-unknown',
          name: `${h.location || 'Scrubber'} Humidity`,
          category: 'humidity',
          currentValue: Number(h.rh_percent?.toFixed(2)) || 0,
          unit: '% RH',
          status,
          trend,
          timestamp: new Date(h.time_recorded || Date.now()).toISOString()
        });
      }
    }

    return normalized;
  }
}

export default SensorNormalizer;
