/**
 * Type guard utilities for runtime type checking
 */

import type { Student, Teacher, Staff, Parent, Contractor, Application } from '../types';

/**
 * Type guard to check if a value is a valid Student object
 */
export const isStudent = (value: unknown): value is Student => {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.studentId === 'string' &&
    typeof obj.name === 'string'
  );
};

/**
 * Type guard to check if a value is a valid Teacher object
 */
export const isTeacher = (value: unknown): value is Teacher => {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.teacherId === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.subject === 'string'
  );
};

/**
 * Type guard to check if a value is a valid Staff object
 */
export const isStaff = (value: unknown): value is Staff => {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.staffId === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.role === 'string'
  );
};

/**
 * Type guard to check if a value is a valid Parent object
 */
export const isParent = (value: unknown): value is Parent => {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.parentId === 'string' &&
    typeof obj.name === 'string' &&
    Array.isArray(obj.childrenIds)
  );
};

/**
 * Type guard to check if a value is a valid Contractor object
 */
export const isContractor = (value: unknown): value is Contractor => {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.contractorId === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.service === 'string'
  );
};

/**
 * Type guard to check if a value is a valid Application object
 */
export const isApplication = (value: unknown): value is Application => {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.applicantName === 'string' &&
    typeof obj.status === 'string'
  );
};

/**
 * Type guard to check if value is a non-null object
 */
export const isObject = (value: unknown): value is Record<string, unknown> => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

/**
 * Type guard to check if value is an array
 */
export const isArray = (value: unknown): value is unknown[] => {
  return Array.isArray(value);
};
