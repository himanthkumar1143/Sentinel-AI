import { RawIndustrialData, ValidationIssue } from '../types/pipeline';

export class SensorValidator {
  public static validate(raw: RawIndustrialData): { issues: ValidationIssue[]; checkedCount: number } {
    const issues: ValidationIssue[] = [];
    let checkedCount = 0;

    // 1. Gas Sensors Validation
    if (!raw.sources.gas || !Array.isArray(raw.sources.gas)) {
      issues.push({
        source: 'SCADA_Gas_Sensors',
        field: 'sources.gas',
        value: raw.sources.gas,
        rule: 'NOT_NULL_ARRAY',
        severity: 'error',
        message: 'Gas sensor payload is null or not an array.'
      });
    } else {
      for (const s of raw.sources.gas) {
        checkedCount++;
        if (!s.sensor_id || typeof s.sensor_id !== 'string') {
          issues.push({
            source: 'SCADA_Gas_Sensors',
            field: 'sensor_id',
            value: s.sensor_id,
            rule: 'REQUIRED_STRING_ID',
            severity: 'error',
            message: 'Missing or invalid sensor_id in gas reading.'
          });
        }
        if (s.reading_ppm === null || s.reading_ppm === undefined || typeof s.reading_ppm !== 'number') {
          issues.push({
            source: 'SCADA_Gas_Sensors',
            field: 'reading_ppm',
            value: s.reading_ppm,
            rule: 'REQUIRED_NUMBER',
            severity: 'error',
            message: `Gas reading is null or invalid datatype for sensor ${s.sensor_id || 'UNKNOWN'}.`
          });
        } else if (s.reading_ppm < 0) {
          issues.push({
            source: 'SCADA_Gas_Sensors',
            field: 'reading_ppm',
            value: s.reading_ppm,
            rule: 'NON_NEGATIVE_VALUE',
            severity: 'error',
            message: `Rejected negative gas value (${s.reading_ppm} PPM) on sensor ${s.sensor_id}.`
          });
        }
        if (!s.timestamp_epoch || isNaN(new Date(s.timestamp_epoch).getTime())) {
          issues.push({
            source: 'SCADA_Gas_Sensors',
            field: 'timestamp_epoch',
            value: s.timestamp_epoch,
            rule: 'VALID_TIMESTAMP',
            severity: 'error',
            message: `Invalid timestamp_epoch on sensor ${s.sensor_id}.`
          });
        }
      }
    }

    // 2. Pressure Sensors Validation
    if (!raw.sources.pressure || !Array.isArray(raw.sources.pressure)) {
      issues.push({
        source: 'SCADA_Pressure_Sensors',
        field: 'sources.pressure',
        value: raw.sources.pressure,
        rule: 'NOT_NULL_ARRAY',
        severity: 'error',
        message: 'Pressure sensor payload is null or not an array.'
      });
    } else {
      for (const p of raw.sources.pressure) {
        checkedCount++;
        if (!p.deviceCode || typeof p.deviceCode !== 'string') {
          issues.push({
            source: 'SCADA_Pressure_Sensors',
            field: 'deviceCode',
            value: p.deviceCode,
            rule: 'REQUIRED_STRING_ID',
            severity: 'error',
            message: 'Missing deviceCode in pressure reading.'
          });
        }
        if (p.press_bar === null || p.press_bar === undefined || typeof p.press_bar !== 'number') {
          issues.push({
            source: 'SCADA_Pressure_Sensors',
            field: 'press_bar',
            value: p.press_bar,
            rule: 'REQUIRED_NUMBER',
            severity: 'error',
            message: `Pressure reading is null or wrong datatype on device ${p.deviceCode || 'UNKNOWN'}.`
          });
        } else if (p.press_bar < 0) {
          issues.push({
            source: 'SCADA_Pressure_Sensors',
            field: 'press_bar',
            value: p.press_bar,
            rule: 'NON_NEGATIVE_VALUE',
            severity: 'error',
            message: `Rejected negative pressure (${p.press_bar} Bar) on device ${p.deviceCode}.`
          });
        }
        if (!p.read_time || isNaN(new Date(p.read_time).getTime())) {
          issues.push({
            source: 'SCADA_Pressure_Sensors',
            field: 'read_time',
            value: p.read_time,
            rule: 'VALID_TIMESTAMP',
            severity: 'error',
            message: `Invalid timestamp read_time on device ${p.deviceCode}.`
          });
        }
      }
    }

    // 3. Temperature Sensors Validation
    if (!raw.sources.temperature || !Array.isArray(raw.sources.temperature)) {
      issues.push({
        source: 'SCADA_Temperature_Sensors',
        field: 'sources.temperature',
        value: raw.sources.temperature,
        rule: 'NOT_NULL_ARRAY',
        severity: 'error',
        message: 'Temperature sensor payload is null or not an array.'
      });
    } else {
      for (const t of raw.sources.temperature) {
        checkedCount++;
        if (!t.unit_tag || typeof t.unit_tag !== 'string') {
          issues.push({
            source: 'SCADA_Temperature_Sensors',
            field: 'unit_tag',
            value: t.unit_tag,
            rule: 'REQUIRED_STRING_ID',
            severity: 'error',
            message: 'Missing unit_tag in temperature sensor reading.'
          });
        }
        if (t.temp_celsius === null || t.temp_celsius === undefined || typeof t.temp_celsius !== 'number') {
          issues.push({
            source: 'SCADA_Temperature_Sensors',
            field: 'temp_celsius',
            value: t.temp_celsius,
            rule: 'REQUIRED_NUMBER',
            severity: 'error',
            message: `Temperature reading is null or invalid datatype on ${t.unit_tag || 'UNKNOWN'}.`
          });
        }
        if (!t.timestamp || isNaN(new Date(t.timestamp).getTime())) {
          issues.push({
            source: 'SCADA_Temperature_Sensors',
            field: 'timestamp',
            value: t.timestamp,
            rule: 'VALID_TIMESTAMP',
            severity: 'error',
            message: `Invalid timestamp string on temperature unit ${t.unit_tag}.`
          });
        }
      }
    }

    // 4. Humidity Sensors Validation
    if (!raw.sources.humidity || !Array.isArray(raw.sources.humidity)) {
      issues.push({
        source: 'SCADA_Humidity_Sensors',
        field: 'sources.humidity',
        value: raw.sources.humidity,
        rule: 'NOT_NULL_ARRAY',
        severity: 'error',
        message: 'Humidity sensor payload is null or not an array.'
      });
    } else {
      for (const h of raw.sources.humidity) {
        checkedCount++;
        if (!h.probe_id || typeof h.probe_id !== 'string') {
          issues.push({
            source: 'SCADA_Humidity_Sensors',
            field: 'probe_id',
            value: h.probe_id,
            rule: 'REQUIRED_STRING_ID',
            severity: 'error',
            message: 'Missing probe_id in humidity reading.'
          });
        }
        if (h.rh_percent === null || h.rh_percent === undefined || typeof h.rh_percent !== 'number') {
          issues.push({
            source: 'SCADA_Humidity_Sensors',
            field: 'rh_percent',
            value: h.rh_percent,
            rule: 'REQUIRED_NUMBER',
            severity: 'error',
            message: `Humidity reading is null or wrong datatype on probe ${h.probe_id || 'UNKNOWN'}.`
          });
        } else if (h.rh_percent < 0 || h.rh_percent > 100) {
          issues.push({
            source: 'SCADA_Humidity_Sensors',
            field: 'rh_percent',
            value: h.rh_percent,
            rule: 'RANGE_0_TO_100',
            severity: 'warning',
            message: `Relative humidity (${h.rh_percent}%) out of normal 0-100% bounds on probe ${h.probe_id}.`
          });
        }
      }
    }

    return { issues, checkedCount };
  }
}

export default SensorValidator;
