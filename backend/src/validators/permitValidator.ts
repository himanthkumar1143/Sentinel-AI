import { RawIndustrialData, ValidationIssue } from '../types/pipeline';

export class PermitValidator {
  public static validate(raw: RawIndustrialData): { issues: ValidationIssue[]; checkedCount: number } {
    const issues: ValidationIssue[] = [];
    let checkedCount = 0;

    // 1. Permits Validation
    const permits = raw.sources.permits;
    if (!permits || typeof permits !== 'object') {
      issues.push({
        source: 'Permit_System',
        field: 'sources.permits',
        value: permits,
        rule: 'NOT_NULL_OBJECT',
        severity: 'error',
        message: 'Permits payload is null or missing.'
      });
    } else {
      checkedCount++;
      if (!permits.system_status || typeof permits.system_status !== 'string') {
        issues.push({
          source: 'Permit_System',
          field: 'system_status',
          value: permits.system_status,
          rule: 'REQUIRED_STRING',
          severity: 'error',
          message: 'Missing permit status string in Permit System header.'
        });
      }
      if (!Array.isArray(permits.active_permits)) {
        issues.push({
          source: 'Permit_System',
          field: 'active_permits',
          value: permits.active_permits,
          rule: 'NOT_NULL_ARRAY',
          severity: 'error',
          message: 'active_permits is not a valid array.'
        });
      } else {
        for (const p of permits.active_permits) {
          checkedCount++;
          if (!p.permit_no || typeof p.permit_no !== 'string') {
            issues.push({
              source: 'Permit_System',
              field: 'permit_no',
              value: p.permit_no,
              rule: 'REQUIRED_STRING_ID',
              severity: 'error',
              message: 'Permit item missing permit_no identifier.'
            });
          }
          if (!p.status || !['ACTIVE', 'SUSPENDED', 'REVOKED', 'CLOSED'].includes(p.status)) {
            issues.push({
              source: 'Permit_System',
              field: 'status',
              value: p.status,
              rule: 'VALID_PERMIT_STATUS',
              severity: 'error',
              message: `Invalid or missing status ('${p.status}') for permit ${p.permit_no}.`
            });
          }
        }
      }
    }

    // 2. Workforce Shift System Validation
    const workforce = raw.sources.workforce;
    if (!workforce || typeof workforce !== 'object') {
      issues.push({
        source: 'Worker_Shift_System',
        field: 'sources.workforce',
        value: workforce,
        rule: 'NOT_NULL_OBJECT',
        severity: 'error',
        message: 'Workforce shift payload is null or missing.'
      });
    } else {
      checkedCount++;
      if (workforce.total_headcount === null || workforce.total_headcount === undefined || typeof workforce.total_headcount !== 'number') {
        issues.push({
          source: 'Worker_Shift_System',
          field: 'total_headcount',
          value: workforce.total_headcount,
          rule: 'REQUIRED_NUMBER',
          severity: 'error',
          message: 'Missing or non-numeric worker count in shift system.'
        });
      } else if (workforce.total_headcount < 0 || !Number.isInteger(workforce.total_headcount)) {
        issues.push({
          source: 'Worker_Shift_System',
          field: 'total_headcount',
          value: workforce.total_headcount,
          rule: 'NON_NEGATIVE_INTEGER',
          severity: 'error',
          message: `Invalid worker count (${workforce.total_headcount}). Must be a positive integer.`
        });
      }

      if (Array.isArray(workforce.zones_roster)) {
        for (const z of workforce.zones_roster) {
          checkedCount++;
          if (z.personnel_count < 0 || !Number.isInteger(z.personnel_count)) {
            issues.push({
              source: 'Worker_Shift_System',
              field: 'personnel_count',
              value: z.personnel_count,
              rule: 'NON_NEGATIVE_INTEGER',
              severity: 'error',
              message: `Invalid zone worker count (${z.personnel_count}) in zone ${z.zone_code}.`
            });
          }
        }
      }
    }

    // 3. Weather System Validation
    const weather = raw.sources.weather;
    if (!weather || typeof weather !== 'object') {
      issues.push({
        source: 'Weather_System',
        field: 'sources.weather',
        value: weather,
        rule: 'NOT_NULL_OBJECT',
        severity: 'error',
        message: 'Weather system payload is null or missing.'
      });
    } else {
      checkedCount++;
      if (typeof weather.ambient_temp !== 'number' || typeof weather.wind_speed_kmh !== 'number') {
        issues.push({
          source: 'Weather_System',
          field: 'ambient_temp/wind_speed_kmh',
          value: `${weather.ambient_temp} / ${weather.wind_speed_kmh}`,
          rule: 'REQUIRED_NUMBER',
          severity: 'error',
          message: 'Weather station metrics contain non-numeric data.'
        });
      }
    }

    return { issues, checkedCount };
  }
}

export default PermitValidator;
