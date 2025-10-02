/**
 * Basic tests for validation utilities
 * To run tests, you'll need to install a test framework like Jest or Vitest
 * 
 * Example setup:
 * npm install --save-dev vitest
 * Add to package.json: "test": "vitest"
 */

import { isValidEmail, isValidPhone, sanitizeString, isPositiveNumber } from '../utils/validation';

// Example test structure (uncomment when test framework is installed)
/*
describe('Validation Utilities', () => {
  describe('isValidEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.ug')).toBe(true);
    });

    it('should return false for invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('should return true for valid Uganda phone numbers', () => {
      expect(isValidPhone('0701234567')).toBe(true);
      expect(isValidPhone('0771234567')).toBe(true);
      expect(isValidPhone('+256701234567')).toBe(true);
    });

    it('should return false for invalid phone numbers', () => {
      expect(isValidPhone('123')).toBe(false);
      expect(isValidPhone('abcdefghij')).toBe(false);
    });
  });

  describe('sanitizeString', () => {
    it('should remove potentially harmful characters', () => {
      expect(sanitizeString('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
      expect(sanitizeString('Normal text')).toBe('Normal text');
    });

    it('should trim whitespace', () => {
      expect(sanitizeString('  text  ')).toBe('text');
    });
  });

  describe('isPositiveNumber', () => {
    it('should return true for positive numbers', () => {
      expect(isPositiveNumber(0)).toBe(true);
      expect(isPositiveNumber(1)).toBe(true);
      expect(isPositiveNumber(100.5)).toBe(true);
    });

    it('should return false for negative numbers and NaN', () => {
      expect(isPositiveNumber(-1)).toBe(false);
      expect(isPositiveNumber(NaN)).toBe(false);
    });
  });
});
*/

// Manual verification functions (can be run directly in Node.js)
export const runManualTests = () => {
  console.log('Running manual validation tests...\n');

  // Email tests
  console.log('Email validation tests:');
  console.log('test@example.com:', isValidEmail('test@example.com') ? 'PASS' : 'FAIL');
  console.log('invalid:', isValidEmail('invalid') ? 'FAIL' : 'PASS');

  // Phone tests
  console.log('\nPhone validation tests:');
  console.log('0701234567:', isValidPhone('0701234567') ? 'PASS' : 'FAIL');
  console.log('123:', isValidPhone('123') ? 'FAIL' : 'PASS');

  // Sanitize tests
  console.log('\nSanitization tests:');
  console.log('Normal text:', sanitizeString('Normal text') === 'Normal text' ? 'PASS' : 'FAIL');
  console.log('With spaces:', sanitizeString('  text  ') === 'text' ? 'PASS' : 'FAIL');

  // Number tests
  console.log('\nNumber validation tests:');
  console.log('0:', isPositiveNumber(0) ? 'PASS' : 'FAIL');
  console.log('-1:', isPositiveNumber(-1) ? 'FAIL' : 'PASS');

  console.log('\nAll manual tests completed!');
};

// Uncomment to run manual tests
// runManualTests();
