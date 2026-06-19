---
name: Bug Report — Test Failure
about: Report a flaky, broken, or incorrect test in this suite
title: '[BUG] <test name> — <short description>'
labels: bug, tests
assignees: ''
---

## Failing test

**File:** `tests/<category>/<file>.spec.ts`
**Test name:** (exact test title from the output)
**Tag:** `@smoke` / `@navigation` / `@forms` / `@functional` / `@visual` / `@responsive`

## What happened

<!-- Paste the Playwright error output here -->

```
Error: ...
```

## What was expected

<!-- What should the test have done? -->

## Is this flaky or consistently failing?

- [ ] Consistently fails every run
- [ ] Flaky — fails occasionally (~___% of runs)
- [ ] Started failing after a site change (date: ____)

## Steps to reproduce

```bash
npm run test:smoke  # or whichever npm script triggers the failure
```

## Environment

- OS:
- Node.js version: `node --version`
- Playwright version: `npx playwright --version`
- Branch:

## Possible cause

<!-- If you suspect the cause (e.g., site DOM changed, selector broke), describe it here -->

## Screenshot / trace

<!-- Attach the Playwright trace or screenshot from `test-results/` if available -->
