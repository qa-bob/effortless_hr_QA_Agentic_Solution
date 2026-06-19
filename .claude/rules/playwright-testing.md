---
paths:
  - "tests/**/*.spec.ts"
  - "tests/**/*.test.ts"
---

# Playwright Test Rules

All test files under `tests/` must follow these rules:

## Imports
- Import `test` and `expect` from `@fixtures/site.fixture`, never from `@playwright/test` directly
- Use path aliases (`@fixtures/`, `@pages/`, `@utils/`) not relative paths

## Tags
- Every `test()` call must include at least one tag: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`, or `@custom`
- Tags go in the test title string, e.g., `test('nav loads @navigation', ...)`

## URLs
- Never hardcode URLs — use `siteConfig.url` from the fixture
- Build subpaths: `siteConfig.url.replace(/\/$/, '') + '/path'`

## Waits and timeouts
- Never use `page.waitForTimeout()` with values > 500ms
- Prefer `waitForSelector`, `waitForLoadState`, or Playwright's built-in auto-waiting
- The 500ms exception in visual tests (animation settle) is allowed

## Forms
- Never submit any form — test field presence, validation attributes, and labels only
- Never enter real credentials

## Assertions
- Put all `expect()` calls in test files, never in page object methods
- Use descriptive failure messages: `expect(value, 'What this means if it fails').toBe(expected)`

## Test independence
- Each test must be able to run in isolation
- Use `test.beforeEach` for shared navigation, not `test.beforeAll`
- Do not share mutable state between tests
