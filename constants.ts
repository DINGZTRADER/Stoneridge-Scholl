// This file is for application-wide constants.

/**
 * School Information
 */
export const SCHOOL_NAME = 'The Stoneridge School';
export const SCHOOL_LOCATION = 'Kampala, Uganda';

/**
 * Data Storage Keys
 */
export const STORAGE_KEYS = {
  STUDENTS: 'stoneridge-students',
  TEACHERS: 'stoneridge-teachers',
  STAFF: 'stoneridge-staff',
  PARENTS: 'stoneridge-parents',
  CONTRACTORS: 'stoneridge-contractors',
  APPLICATIONS: 'stoneridge-applications',
  INVOICES: 'stoneridge-invoices',
  ATTENDANCE: 'stoneridge-attendance',
  ROUTES: 'stoneridge-routes',
  BROADCASTS: 'stoneridge-broadcasts',
  TASKS: 'stoneridge-tasks',
} as const;

/**
 * File Upload Limits
 */
export const MAX_FILE_SIZE_MB = 10;
export const ALLOWED_FILE_TYPES = ['application/json'];

/**
 * API Configuration
 */
export const API_RATE_LIMIT = {
  MAX_CALLS: 10,
  TIME_WINDOW_MS: 60000, // 1 minute
} as const;

/**
 * UI Configuration
 */
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

/**
 * Date Formats
 */
export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

/**
 * Validation Rules
 */
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  PHONE_REGEX: /^0[0-9]{9}$|^\+256[0-9]{9}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  STUDENT_ID_REGEX: /^STU\d{4,}$/,
} as const;

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_DATE: 'Please enter a valid date',
  REQUIRED_FIELD: 'This field is required',
  FILE_TOO_LARGE: `File size must be less than ${MAX_FILE_SIZE_MB}MB`,
  INVALID_FILE_TYPE: 'Invalid file type. Please upload a JSON file',
  NETWORK_ERROR: 'Network error. Please check your connection and try again',
  API_ERROR: 'An error occurred while processing your request',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later',
} as const;

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  DATA_SAVED: 'Data saved successfully',
  DATA_IMPORTED: 'Data imported successfully',
  DATA_EXPORTED: 'Data exported successfully',
  RECORD_CREATED: 'Record created successfully',
  RECORD_UPDATED: 'Record updated successfully',
  RECORD_DELETED: 'Record deleted successfully',
} as const;

