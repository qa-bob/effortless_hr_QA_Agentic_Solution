## Summary

<!-- What does this PR change? Link the issue or test scenario it addresses. -->

## Test files changed

<!-- List the spec files added or modified. -->

- [ ] `tests/smoke/`
- [ ] `tests/navigation/`
- [ ] `tests/forms/`
- [ ] `tests/functional/`
- [ ] `tests/visual/`
- [ ] `tests/responsive/`
- [ ] `tests/custom/`
- [ ] Page objects (`src/pages/`)
- [ ] Fixtures (`src/fixtures/`)
- [ ] Config / framework (`playwright.config.ts`, `site.config.json`, etc.)

## Pre-merge checklist

- [ ] `npm run typecheck` passes (zero TypeScript errors)
- [ ] `npm run lint` passes (zero ESLint warnings)
- [ ] All new tests are tagged (`@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`, or `@custom`)
- [ ] No hardcoded URLs — `siteConfig.url` is used from the fixture
- [ ] No `page.waitForTimeout()` calls with values > 500ms
- [ ] No form submissions — tests only validate field presence and attributes
- [ ] New page objects are registered in `src/fixtures/site.fixture.ts`
- [ ] Visual baselines updated if `@visual` tests changed (`npm run baseline`)
- [ ] `playwright-report/` and `test-results/` are NOT committed

## Selectors verified against live site?

- [ ] Yes — I used `WebFetch` or the Playwright inspector to confirm selectors match actual HTML
- [ ] N/A — no new selectors added

## Notes for reviewers

<!-- Anything the reviewer should know: edge cases, skipped tests, known flakiness, etc. -->
