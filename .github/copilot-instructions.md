# GitHub Copilot Instructions

This repository is a **Playwright + TypeScript regression test suite** for [EffortlessHR](https://www.effortlesshr.com/) using the **Page Object Model (POM)** design pattern.

---

## Architecture

- **Page objects** live in `src/pages/`. Every class extends `BasePage` from `./base.page`.
- **Tests** live in `tests/<category>/`. All tests import from `@fixtures/site.fixture`, not `@playwright/test` directly.
- **TypeScript strict mode** is enabled. No `any` without justification.
- The target URL and feature flags are in `site.config.json`.

---

## Rules for AI-generated code

### Page objects
```typescript
// CORRECT — locators as readonly properties, no assertions
export class ExamplePage extends BasePage {
  readonly heading: Locator;
  readonly ctaButton: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.heading = page.locator('h1').first();
    this.ctaButton = page.getByRole('link', { name: /try it free/i }).first();
  }

  async clickCta(): Promise<void> {
    await this.ctaButton.click();
    await this.waitForLoad();
  }
}
```

### Tests
```typescript
// CORRECT — fixture import, tagged test, no hardcoded URL
import { test, expect } from '@fixtures/site.fixture';

test('feature section is visible @functional', async ({ homePage, siteConfig }) => {
  const heading = await homePage.page.locator('h2').first().textContent();
  expect(heading?.trim().length, 'Feature heading should have text').toBeGreaterThan(0);
});
```

### Do not
- Use `page.locator()` directly in test bodies — use page object methods
- Hardcode URLs — use `siteConfig.url`
- Submit any form or enter real credentials
- Put `expect()` inside page object methods
- Use `page.waitForTimeout()` with values > 500ms
- Use generic types like `any` without explanation

### Selector priority
1. `page.getByRole()` — semantic, resilient
2. `page.getByLabel()` or `[aria-label]` — accessible names
3. `page.getByText()` or `.filter({ hasText: ... })` — visible text
4. CSS class — only when role/text don't work; avoid generated/obfuscated classes

---

## Test tags

Every test title must include one tag: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`, or `@custom`.

---

## Available npm scripts

```bash
npm test                    # All tests
npm run test:smoke          # @smoke only
npm run test:navigation     # @navigation only
npm run test:forms          # @forms only
npm run test:visual         # @visual only
npm run test:responsive     # @responsive only
npm run typecheck           # TypeScript compile check
npm run lint                # ESLint
npm run baseline            # Update visual snapshots
```
