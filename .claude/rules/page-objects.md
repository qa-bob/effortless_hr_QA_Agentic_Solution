---
paths:
  - "src/pages/**/*.ts"
---

# Page Object Rules

All page object classes under `src/pages/` must follow these rules:

## Class structure
- Extend `BasePage` from `./base.page`
- Import `Page` and `Locator` from `@playwright/test`
- All element references are `readonly Locator` properties declared on the class

## Locators
- Define all locators in the constructor, not inline in methods
- Use semantic selectors in priority order: role > test ID > aria-label > text > CSS class
- Avoid fragile selectors: no `nth-child`, no deeply nested combinators, no auto-generated IDs
- Resilient fallback: if class-based fails, try text-based with `.filter({ hasText: ... })`

## Methods
- Methods represent user actions: `clickPrimaryNav()`, `openMobileMenu()`, `fillEmailField()`
- Never put `expect()` assertions inside page object methods
- Return `Promise<void>` for actions, `Promise<string>` or `Promise<boolean>` for queries
- Use `await this.waitForLoad()` after navigation actions

## TypeScript
- No `any` types without explicit justification comment
- All method return types must be explicitly declared
- Strict null checks apply — handle `| null` returns explicitly
