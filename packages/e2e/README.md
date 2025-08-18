# Mota E2E Testing with Page Object Models

This document describes the improved E2E testing structure for Mota using Playwright and Page Object Models (POM).

## 🏗️ Architecture

Our E2E tests follow the [Playwright Page Object Model pattern](https://playwright.dev/docs/pom) for better maintainability and reusability.

### Structure

```
tests/
├── page-objects/           # Page Object Models
│   ├── MotaApplicationPage.ts    # Base application functionality
│   ├── WorkbenchPage.ts           # Workbench interface
│   ├── LogsPage.ts               # Logs functionality
│   ├── ApiHelpers.ts             # API testing helpers
│   └── index.ts                  # Exports
├── fixtures/               # Custom Playwright fixtures
│   └── motia-fixtures.ts
├── flows/                  # Flow execution tests
├── integration/            # Integration tests
├── workbench/             # Workbench-specific tests
├── cli/                   # CLI tests
└── utils/                 # Legacy utilities (deprecated)
```

## 🎯 Page Object Models

### MotaApplicationPage

Base class providing common application functionality:

- Navigation (`goto()`, `waitForApplication()`)
- Screenshot capture
- Console error collection
- Basic application verification

### WorkbenchPage

Extends MotaApplicationPage with workbench-specific functionality:

- Workbench navigation
- Flow management
- Interface verification
- Step verification

### LogsPage

Specialized for log functionality:

- Log entry waiting and verification
- Multiple log verification
- Flow completion tracking
- Log filtering and clearing

### ApiHelpers

API testing utilities:

- HTTP method helpers (`get()`, `post()`, `put()`, `delete()`)
- Response validation
- Endpoint verification
- Health check functionality

## 🔧 Custom Fixtures

We use Playwright's fixture system to automatically inject page objects:

```typescript
import { test, expect } from '../fixtures/motia-fixtures'

test('my test', async ({ motiaApp, workbench, logsPage, api }) => {
  // Page objects are automatically instantiated and available
  await motiaApp.goto('/')
  await workbench.verifyWorkbenchInterface()
})
```

## 📝 Test Writing Patterns

### 1. Use Page Object Methods

```typescript
// ✅ Good - Using page object methods
await workbench.navigateToLogs()
await logsPage.verifyLogEntry('Expected log message')

// ❌ Bad - Direct page manipulation
await page.locator('[data-testid="logs-link"]').click()
await page.locator('text=Expected log message').waitFor()
```

### 2. Use Test Steps for Organization

```typescript
test('flow execution', async ({ workbench, logsPage }) => {
  await test.step('Navigate to workbench', async () => {
    await workbench.open()
    await workbench.verifyWorkbenchInterface()
  })

  await test.step('Execute flow', async () => {
    await workbench.executeFlowAndNavigateToLogs('default')
  })

  await test.step('Verify results', async () => {
    await logsPage.verifyLogEntry('Flow completed')
  })
})
```

### 3. Leverage Custom Fixtures

```typescript
// ✅ Good - Using custom fixtures
test('integration test', async ({ motiaApp, api }) => {
  await motiaApp.goto('/')
  const response = await api.get('/health')
})

// ❌ Bad - Manual instantiation
test('integration test', async ({ page }) => {
  const motiaApp = new MotaApplicationPage(page)
  const api = new ApiHelpers(page)
  // ...
})
```

## 🚀 Running Tests

### Basic Commands

```bash
# Run all tests
pnpm test:e2e

# Run specific test file
pnpm test:e2e tests/smoke.spec.ts

# Run tests in headed mode
pnpm test:headed

# Run tests with UI mode
pnpm test:ui

# Run specific test pattern
pnpm test:e2e --grep "workbench"
```

### Test Categories

```bash
# Smoke tests (basic functionality)
pnpm test:e2e tests/smoke.spec.ts

# Workbench tests
pnpm test:e2e tests/workbench/

# Flow execution tests
pnpm test:e2e tests/flows/

# Integration tests
pnpm test:e2e tests/integration/
```

## 🎛️ Cross-Platform Testing

Our tests run on multiple platforms:

- **Ubuntu** (Linux)
- **Windows**
- **macOS**

Platform-specific considerations are handled automatically in the page objects and global setup/teardown scripts.

## 📊 Test Reports

### HTML Reports

Generated automatically in `playwright-report/` directory:

```bash
pnpm test:report
```

### CI Reports

In CI environments, we generate:

- HTML reports
- JUnit XML reports
- GitHub Actions annotations

## 🛠️ Best Practices

### 1. Locator Strategy

- Use `data-testid` attributes when possible
- Fallback to text content with flexible selectors
- Combine multiple selector strategies for robustness

### 2. Waiting Strategy

- Use Playwright's auto-waiting features
- Implement custom wait methods in page objects
- Handle dynamic content with appropriate timeouts

### 3. Error Handling

- Collect console errors automatically
- Take screenshots on failures
- Provide detailed error messages

### 4. Test Organization

- Group related tests in describe blocks
- Use meaningful test names
- Keep tests focused and independent

## 🔄 Migration from Legacy Tests

When updating existing tests:

1. **Replace direct page manipulation** with page object methods
2. **Use custom fixtures** instead of manual instantiation
3. **Organize with test.step()** for better reporting
4. **Leverage built-in assertions** from page objects

### Example Migration

Before:

```typescript
test('old test', async ({ page }) => {
  const helpers = new TestHelpers(page)
  await page.goto('/')
  await helpers.waitForMotaApplication()
  await page.locator('[data-testid="logs-link"]').click()
  await helpers.waitForLogEntry('message')
})
```

After:

```typescript
test('new test', async ({ workbench, logsPage }) => {
  await workbench.open()
  await workbench.navigateToLogs()
  await logsPage.verifyLogEntry('message')
})
```

## 🤝 Contributing

When adding new tests:

1. **Use existing page objects** when possible
2. **Extend page objects** for new functionality
3. **Follow naming conventions** for consistency
4. **Add JSDoc comments** for complex methods
5. **Test on multiple platforms** when applicable

For questions or improvements, refer to the [Playwright documentation](https://playwright.dev/docs/pom) or the existing test examples.
