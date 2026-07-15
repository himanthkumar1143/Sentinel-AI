import { RawIndustrialData, ValidationIssue } from '../types/pipeline';

export class MaintenanceValidator {
  public static validate(raw: RawIndustrialData): { issues: ValidationIssue[]; checkedCount: number } {
    const issues: ValidationIssue[] = [];
    let checkedCount = 0;

    const maintenance = raw.sources.maintenance;
    if (!maintenance || typeof maintenance !== 'object') {
      issues.push({
        source: 'Maintenance_Management_System',
        field: 'sources.maintenance',
        value: maintenance,
        rule: 'NOT_NULL_OBJECT',
        severity: 'error',
        message: 'Maintenance management data is missing or null.'
      });
      return { issues, checkedCount };
    }

    checkedCount++;
    if (!maintenance.system_id || typeof maintenance.system_id !== 'string') {
      issues.push({
        source: 'Maintenance_Management_System',
        field: 'system_id',
        value: maintenance.system_id,
        rule: 'REQUIRED_STRING',
        severity: 'error',
        message: 'Missing system_id in maintenance management payload.'
      });
    }

    if (!Array.isArray(maintenance.job_list)) {
      issues.push({
        source: 'Maintenance_Management_System',
        field: 'job_list',
        value: maintenance.job_list,
        rule: 'NOT_NULL_ARRAY',
        severity: 'error',
        message: 'job_list inside maintenance payload is not an array.'
      });
    } else {
      for (const job of maintenance.job_list) {
        checkedCount++;
        if (!job.ticket_id || typeof job.ticket_id !== 'string') {
          issues.push({
            source: 'Maintenance_Management_System',
            field: 'ticket_id',
            value: job.ticket_id,
            rule: 'REQUIRED_STRING_ID',
            severity: 'error',
            message: 'Maintenance job record missing valid ticket_id.'
          });
        }
        if (!job.equipment_code || typeof job.equipment_code !== 'string') {
          issues.push({
            source: 'Maintenance_Management_System',
            field: 'equipment_code',
            value: job.equipment_code,
            rule: 'REQUIRED_STRING',
            severity: 'warning',
            message: `Maintenance job ${job.ticket_id || 'UNKNOWN'} has missing equipment_code.`
          });
        }
        if (job.assigned_crew !== undefined && (typeof job.assigned_crew !== 'number' || job.assigned_crew < 0)) {
          issues.push({
            source: 'Maintenance_Management_System',
            field: 'assigned_crew',
            value: job.assigned_crew,
            rule: 'NON_NEGATIVE_INTEGER',
            severity: 'error',
            message: `Invalid crew count (${job.assigned_crew}) on maintenance ticket ${job.ticket_id}.`
          });
        }
      }
    }

    return { issues, checkedCount };
  }
}

export default MaintenanceValidator;
