# Effortless HR — QA Agentic Solution

Playwright + TypeScript regression test suite for [EffortlessHR](https://www.effortlesshr.com/) — an online HR software platform for small businesses. Built with the **Page Object Model (POM)** design pattern and **OOP** principles, with agentic test generation powered by Claude Code.

---

## Table of Contents

- [Project Purpose](#project-purpose)
- [Prerequisites](#prerequisites)
- [Dev Environment Setup](#dev-environment-setup)
- [Running Tests](#running-tests)
- [Project Architecture](#project-architecture)
- [Test Categories](#test-categories)
- [Claude Code Integration](#claude-code-integration)
- [Repository Structure](#repository-structure)
- [Contributor Rules](#contributor-rules)

---

## Project Purpose

This repository tests the public-facing website at `https://www.effortlesshr.com` without requiring account creation or form submission. It validates:

- **Site availability** — the homepage loads, is served over HTTPS, has no critical JS errors
- **Navigation** — all nav links resolve, mobile menu works, logo links home
- **Forms** — contact form fields, labels, and HTML5 validation (no submission)
- **Functional features** — hero section, feature grid, testimonials, CTA buttons
- **Visual regression** — pixel-level screenshot comparison across desktop/mobile/tablet
- **Responsive layout** — no horizontal overflow, readable font sizes, proper viewport meta

The site under test is configured in `site.config.json`. To point the suite at a different URL, update that file — no test code changes required.

---

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| [Node.js](https://nodejs.org/) | 18 LTS or later | Required for npm and Playwright |
| [npm](https://npmjs.com/) | Included with Node.js | Package manager |
| [Git](https://git-scm.com/) | Any recent | Version control |
| [Claude Code](https://code.claude.com/) | Latest | AI-assisted test generation (optional) |

Playwright downloads its own browser binaries — no system Chrome/Firefox installation needed.

---

## Dev Environment Setup

```bash
# 1. Clone the repository
git clone https://github.com/<org>/effortless_hr_QA_Agentic_Solution.git
cd effortless_hr_QA_Agentic_Solution

# 2. Install Node.js dependencies
npm install

# 3. Install Playwright browser binaries
npx playwright install

# 4. (Optional) Install only Chromium to save disk space
npx playwright install chromium

# 5. Verify the setup compiles cleanly
npm run typecheck

# 6. Run smoke tests to confirm the site is reachable
npm run test:smoke
```

### Environment variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `SITE_URL` | Value from `site.config.json` | Override the target URL without editing the config |
| `CI` | unset | Set to `1` in CI pipelines — enables retries, caps workers, forbids `.only` |

Copy `.env.example` to `.env.local` for local overrides (this file is gitignored).

---

## Running Tests

```bash
# Run the full suite (all browsers, all tags)
npm test

# Run by tag
npm run test:smoke          # Availability — fastest, run first in CI
npm run test:navigation     # Nav links, mobile menu, logo
npm run test:forms          # Form structure and validation (no submission)
npm run test:visual         # Screenshot regression
npm run test:responsive     # Mobile/tablet layout

# Run with a headed browser (useful for local debugging)
npm run test:headed

# Open the HTML report after a run
npm run report

# Update visual baselines after an intentional design change
npm run baseline

# Static checks
npm run typecheck            # TypeScript — must pass before merging
npm run lint                 # ESLint
```

### Playwright UI mode (recommended for local development)

```bash
npx playwright test --ui
```

This opens a browser-based interactive runner where you can watch tests step-by-step, re-run individual tests, and inspect locators.

---

## Project Architecture

### Page Object Model (POM)

Every page or major section of the site has its own TypeScript class in `src/pages/`. These classes follow OOP principles:

- **Encapsulation** — element locators are `readonly` properties; interaction details stay inside the class
- **Inheritance** — all page classes extend `BasePage`, which provides shared navigation, screenshot, and layout-check methods
- **Single Responsibility** — each class models one page or section
- **No assertions inside page objects** — methods represent user actions and return data; `expect()` belongs in tests

```typescript
// Example page object structure
export class HomePage extends BasePage {
  readonly heroHeading: Locator;
  readonly tryFreeButton: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.heroHeading = page.locator('h1').first();
    this.tryFreeButton = page.getByRole('link', { name: /try it free/i }).first();
  }

  async clickTryFree(): Promise<void> {
    await this.tryFreeButton.click();
    await this.waitForLoad();
  }
}
```

### Custom Fixtures

Tests import from `@fixtures/site.fixture` which extends Playwright's base `test` with:
- `siteConfig` — the parsed `site.config.json`
- `homePage` — a pre-navigated `HomePage` instance
- `navigationPage` — a `NavigationPage` instance
- `contactPage` — a `ContactFormPage` instance

This keeps test files clean — they receive ready-to-use page objects instead of constructing them manually.

### TypeScript strict mode

`tsconfig.json` enables `strict: true`. Run `npm run typecheck` before every PR. No `any` types without a justification comment.

---

## Test Categories

| Tag | Folder | Purpose |
|-----|--------|---------|
| `@smoke` | `tests/smoke/` | Site up, HTTPS, title, no JS errors |
| `@navigation` | `tests/navigation/` | Nav links, mobile menu, logo link |
| `@forms` | `tests/forms/` | Contact form structure, labels, HTML5 validation |
| `@functional` | `tests/functional/` | Business features: hero, feature grid, testimonials |
| `@visual` | `tests/visual/` | Screenshot regression via `toHaveScreenshot()` |
| `@responsive` | `tests/responsive/` | Viewport layout, alt attributes, font sizes |
| `@custom` | `tests/custom/` | Site-specific, AI-generated tests |

---

## Claude Code Integration

This repo is structured for agentic execution by [Claude Code](https://code.claude.com/). Claude reads `CLAUDE.md` at session start for project context.

### Slash Commands (Skills)

| Command | What it does |
|---------|-------------|
| `/generate-full-suite` | Analyze the site and generate a complete POM + test suite |
| `/analyze-site` | Crawl the site and update `site.config.json` |
| `/run-smoke` | Run `@smoke` tests and report results |
| `/update-baseline` | Refresh visual regression baselines |
| `/generate-report` | Generate a human-readable test results summary |

See [Skills.md](./Skills.md) for detailed usage documentation.

### Subagents

| Agent | Purpose |
|-------|---------|
| `site-analyzer` | Crawls a site and produces a populated `site.config.json` |
| `test-generator` | Generates site-specific test files for unique functionality |

See [AGENTS.md](./AGENTS.md) for details on each agent's capabilities and inputs.

### CLAUDE.md

`CLAUDE.md` in the project root contains persistent instructions for Claude Code: architecture rules, test tagging conventions, TypeScript requirements, and when to use WebFetch to inspect the live site before writing selectors.

### `.claude/rules/`

Path-scoped rules that load on demand:
- `playwright-testing.md` — applies to `tests/**/*.spec.ts`: import rules, tag requirements, form constraints
- `page-objects.md` — applies to `src/pages/**/*.ts`: locator strategies, method conventions, TypeScript rules

---

## Repository Structure

```
effortless_hr_QA_Agentic_Solution/
├── CLAUDE.md                    # Claude Code persistent instructions
├── AGENTS.md                    # AI agent reference for contributors
├── Skills.md                    # Slash command reference for contributors
├── site.config.json             # Target site URL, flags, and expected nav
├── playwright.config.ts         # Playwright projects (desktop/mobile/tablet)
├── global-setup.ts              # Pre-suite reachability check
├── tsconfig.json                # TypeScript strict config
├── package.json                 # npm scripts and devDependencies
│
├── src/
│   ├── pages/
│   │   ├── base.page.ts         # BasePage — shared methods for all pages
│   │   ├── home.page.ts         # HomePage
│   │   ├── navigation.page.ts   # NavigationPage
│   │   ├── contact.page.ts      # ContactFormPage
│   │   └── *.page.ts            # One class per additional page
│   ├── fixtures/
│   │   └── site.fixture.ts      # Custom test fixtures
│   ├── utils/
│   │   ├── link-checker.ts      # HTTP link-checking utility
│   │   └── visual-helper.ts     # Screenshot / cookie-banner helpers
│   └── types/
│       └── site-config.types.ts # SiteConfig interface + loader
│
├── tests/
│   ├── smoke/                   # @smoke — availability checks
│   ├── navigation/              # @navigation — nav link and menu tests
│   ├── forms/                   # @forms — form structure and validation
│   ├── functional/              # @functional — business feature tests
│   ├── visual/                  # @visual — screenshot regression
│   ├── responsive/              # @responsive — viewport layout tests
│   └── custom/                  # @custom — site-specific generated tests
│
├── .claude/
│   ├── agents/                  # Claude Code subagent definitions
│   ├── commands/                # Slash command implementations
│   ├── hooks/                   # Shell hooks (pre-test reachability check)
│   └── rules/                   # Path-scoped instruction files
│
├── .github/
│   ├── workflows/               # GitHub Actions CI pipeline
│   ├── ISSUE_TEMPLATE/          # Bug report and test request templates
│   ├── PULL_REQUEST_TEMPLATE.md # PR checklist
│   ├── CODEOWNERS               # Code ownership
│   └── copilot-instructions.md  # GitHub Copilot instructions
│
├── __snapshots__/               # Visual regression baselines (committed)
├── playwright-report/           # HTML report (gitignored)
└── test-results/                # Test artifacts (gitignored)
```

---

## Contributor Rules

### Before you start

1. Read `site.config.json` to confirm the target URL
2. Run `npm run test:smoke` to verify the site is up
3. Use `npx playwright test --ui` for interactive development

### Writing tests

- **Use page objects** — never call `page.locator()` directly in test bodies
- **Use real selectors** — run the test against the live site, not guessed selectors
- **Tag every test** — omitting a tag means the test won't run in tag-filtered CI jobs
- **Never submit forms** — validate field structure and HTML5 attributes only
- **No hardcoded URLs** — always use `siteConfig.url` from the fixture
- **No `page.waitForTimeout()` > 500ms** — use Playwright's auto-waiting

### Page object conventions

- Extend `BasePage` for every new page class
- Declare all locators as `readonly Locator` properties in the constructor
- Methods do actions; they do not make assertions
- Follow the selector priority: role → ARIA label → text → CSS class

### Pull request checklist

- `npm run typecheck` passes with zero errors
- `npm run lint` passes with zero warnings
- All new tests have at least one `@tag`
- New page objects added to `src/fixtures/site.fixture.ts`
- Visual baselines updated if visual tests changed (`npm run baseline`)
- PR description links to the test file and explains what scenario is covered

### Do not

- Submit any form or create accounts
- Hardcode the target URL in test code
- Put `expect()` inside page object methods
- Commit `playwright-report/` or `test-results/` directories
- Commit `.env.local` or any credentials
- Use `any` type without a comment explaining why

---

*This repository is part of the Phoenix Startup QA Agentic Solutions project.*
