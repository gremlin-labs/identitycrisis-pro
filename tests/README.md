# Testing & Validation for Tailwind Refactor

This folder contains configurations and scripts for comprehensive testing and validation of the Tailwind refactor.

## Test Categories

### 1. Visual Regression Testing
- Uses Storybook with snapshot tests.
- Run Storybook and visual tests to catch unintended UI changes.
- Command: `npm run test:visual`

### 2. Responsive Design Validation
- Uses Playwright to test key pages at multiple breakpoints (mobile, tablet, desktop).
- Validates layout correctness across screen sizes.
- Command: `npm run test:responsive`

### 3. Cross-Browser Testing
- Uses Playwright multi-browser testing (Chrome, Firefox, Safari).
- Verifies rendering consistency across browsers.
- Command: `npm run test:cross-browser`

### 4. Performance Benchmarking
- Uses Lighthouse CI to audit performance, accessibility, and best practices on the home page.
- Command: `npm run test:performance`

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Run tests using the commands above.

## Notes

- No application code is modified; tests and configs are added only.
- Ensure you have Node.js installed.
- For cross-browser testing, Playwright will download browser binaries on install.
- Lighthouse CI requires Chrome to be installed on your system.