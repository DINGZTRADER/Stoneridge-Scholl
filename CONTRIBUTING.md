# Contributing to Stoneridge School Administrative Agent

Thank you for your interest in contributing to the Stoneridge School Administrative Agent! This document provides guidelines and instructions for contributing to the project.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/DINGZTRADER/Stoneridge-Scholl.git
   cd Stoneridge-Scholl
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` and add your Gemini API key.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build the project:
   ```bash
   npm run build
   ```

## Code Style

This project uses ESLint and Prettier for code quality and formatting.

- Run linting: `npm run lint` (when configured)
- Format code: `npm run format` (when configured)

### Code Standards

- Use TypeScript for type safety
- Follow React best practices and hooks guidelines
- Write clear, descriptive variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Use functional components with hooks

## Project Structure

```
/
├── components/          # React components
│   ├── SchoolOps/      # School operations components
│   ├── shared/         # Reusable shared components
│   └── icons/          # Icon components
├── services/           # API and data services
│   ├── dataService.ts  # Local storage data management
│   ├── geminiService.ts # Gemini AI integration
│   └── importWorker.ts # Web worker for file imports
├── types.ts            # TypeScript type definitions
├── constants.ts        # Application constants
└── App.tsx             # Main application component
```

## Making Changes

### Branch Naming Convention

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions or modifications

### Commit Message Guidelines

Write clear, descriptive commit messages:

```
type: brief description

Detailed explanation if needed
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Pull Request Process

1. Create a new branch for your changes
2. Make your changes following the code standards
3. Test your changes thoroughly
4. Update documentation if needed
5. Submit a pull request with a clear description

## Data Management

- All data is stored in browser localStorage
- Use the transformer functions in `dataService.ts` for data consistency
- Support both camelCase and snake_case field names for backwards compatibility

## Testing

- Test your changes manually in the browser
- Verify that existing functionality still works
- Test with different data sets
- Check browser console for errors

## Accessibility

- Use semantic HTML elements
- Add ARIA labels where appropriate
- Ensure keyboard navigation works
- Test with screen readers when possible

## Security

- Never commit API keys or sensitive data
- Use environment variables for configuration
- Validate and sanitize user input
- Report security issues privately to the maintainers

## Questions?

If you have questions, please:
- Check existing issues and discussions
- Open a new issue with the question tag
- Contact the maintainers

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Focus on the code, not the person

Thank you for contributing!
