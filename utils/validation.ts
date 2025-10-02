/**
 * Utility functions for input validation and sanitization
 */

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[-\s()]/g, '');
  return /^0[0-9]{9}$/.test(cleaned) || /^\+256[0-9]{9}$/.test(cleaned);
};

export const sanitizeString = (input: string): string => {
  return input.trim().replace(/[<>]/g, '').replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
};

export const isValidDateString = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date.getTime());
};

export const isPositiveNumber = (value: number): boolean => {
  return typeof value === 'number' && !isNaN(value) && value >= 0;
};

export const isNonEmptyString = (value: string): boolean => {
  return typeof value === 'string' && value.trim().length > 0;
};

export const isValidFileSize = (size: number, maxSizeMB: number = 10): boolean => {
  const maxBytes = maxSizeMB * 1024 * 1024;
  return size > 0 && size <= maxBytes;
};

export const formatUGX = (amount: number): string => {
  if (!isPositiveNumber(amount)) {
    return 'UGX 0';
  }
  return `UGX ${amount.toLocaleString('en-UG')}`;
};

export class RateLimiter {
  private lastCallTime: number = 0;
  private callCount: number = 0;
  private readonly maxCalls: number;
  private readonly timeWindow: number;

  constructor(maxCalls: number = 10, timeWindowMs: number = 60000) {
    this.maxCalls = maxCalls;
    this.timeWindow = timeWindowMs;
  }

  canMakeCall(): boolean {
    const now = Date.now();
    if (now - this.lastCallTime > this.timeWindow) {
      this.callCount = 0;
      this.lastCallTime = now;
    }
    return this.callCount < this.maxCalls;
  }

  recordCall(): void {
    this.callCount++;
    this.lastCallTime = Date.now();
  }

  getRemainingCalls(): number {
    return Math.max(0, this.maxCalls - this.callCount);
  }
}
