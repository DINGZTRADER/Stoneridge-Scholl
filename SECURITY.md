# Security Policy

## Supported Versions

This project is currently in active development. Security updates will be applied to the latest version.

| Version | Supported          |
| ------- | ------------------ |
| latest  | :white_check_mark: |

## Reporting a Vulnerability

We take the security of the Stoneridge School Administrative Agent seriously. If you discover a security vulnerability, please follow these steps:

### How to Report

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via:
1. Email to the repository maintainers (check GitHub profiles)
2. GitHub Security Advisory (preferred)

### What to Include

Please include the following information in your report:
- Type of vulnerability
- Full path(s) of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability
- Suggested fix (if available)

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 5 business days
- **Fix Timeline**: Depends on severity and complexity

### Security Best Practices for Users

1. **API Keys**: Never commit your Gemini API key to version control
   - Always use `.env.local` file
   - Keep `.env.local` in `.gitignore`
   - Rotate keys regularly

2. **Data Storage**: This application uses browser localStorage
   - Data is not encrypted at rest
   - Do not store highly sensitive information
   - Regular backups recommended

3. **Deployment**:
   - Use HTTPS in production
   - Implement proper access controls
   - Consider using a backend server for multi-user scenarios

4. **Dependencies**:
   - Run `npm audit` regularly
   - Keep dependencies up to date
   - Review security advisories

### Known Security Considerations

1. **Client-Side Storage**: 
   - All data is stored in browser localStorage
   - Data is accessible to JavaScript on the same origin
   - Not suitable for highly sensitive information

2. **API Key Exposure**:
   - API keys are embedded in the client-side code
   - Use API key restrictions in Google Cloud Console
   - Consider backend proxy for production use

3. **Input Validation**:
   - User input is processed by AI models
   - Implement rate limiting to prevent abuse
   - Validate file uploads carefully

### Secure Development Practices

- All code changes should be reviewed
- Dependencies are regularly audited
- Security patches are prioritized
- Environment variables are never committed

## Disclosure Policy

When we receive a security report:
1. We confirm the issue and determine severity
2. We develop and test a fix
3. We prepare a security advisory
4. We release the fix
5. We publicly disclose the vulnerability after users have had time to update

## Contact

For security concerns, please contact the repository maintainers through GitHub.

---

Thank you for helping keep Stoneridge School Administrative Agent secure!
