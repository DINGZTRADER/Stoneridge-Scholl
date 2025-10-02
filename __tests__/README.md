# Tests

This directory contains test files for the Stoneridge School Administrative Agent.

## Current Status

The test infrastructure is prepared but not yet fully implemented. Test files are included as examples to demonstrate the testing structure.

## Setting Up Tests

To add automated testing to this project:

1. **Install a test framework** (recommended: Vitest for Vite projects):
   ```bash
   npm install --save-dev vitest @vitest/ui
   ```

2. **Add test scripts** to `package.json`:
   ```json
   {
     "scripts": {
       "test": "vitest",
       "test:ui": "vitest --ui",
       "test:coverage": "vitest --coverage"
     }
   }
   ```

3. **Create vitest.config.ts**:
   ```typescript
   import { defineConfig } from 'vitest/config';
   import react from '@vitejs/plugin-react';
   
   export default defineConfig({
     plugins: [react()],
     test: {
       globals: true,
       environment: 'jsdom',
     },
   });
   ```

4. **Install additional dependencies** for React testing:
   ```bash
   npm install --save-dev @testing-library/react @testing-library/jest-dom jsdom
   ```

## Test Structure

```
__tests__/
├── validation.test.ts       # Validation utility tests
├── components/              # Component tests (to be added)
├── services/                # Service tests (to be added)
└── integration/             # Integration tests (to be added)
```

## Running Tests

Once the test framework is set up:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Writing Tests

Tests should follow these guidelines:

1. **Unit Tests**: Test individual functions and components
2. **Integration Tests**: Test how components work together
3. **Coverage**: Aim for at least 80% code coverage for critical paths
4. **Naming**: Use descriptive test names that explain what is being tested

### Example Test

```typescript
import { describe, it, expect } from 'vitest';
import { isValidEmail } from '../utils/validation';

describe('isValidEmail', () => {
  it('should return true for valid email', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
  });

  it('should return false for invalid email', () => {
    expect(isValidEmail('invalid')).toBe(false);
  });
});
```

## Manual Testing

For now, manual testing is recommended:

1. Test all features in the browser
2. Test with different data sets
3. Test edge cases and error conditions
4. Verify data persistence in localStorage
5. Test on different browsers (Chrome, Firefox, Safari)

## Future Improvements

- [ ] Add Vitest configuration
- [ ] Write unit tests for utility functions
- [ ] Add component tests with React Testing Library
- [ ] Set up end-to-end tests with Playwright or Cypress
- [ ] Add continuous integration tests
- [ ] Set up test coverage reporting
