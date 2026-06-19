# AGENTS.md — AI Agent Reference

This file documents the AI agents, coding rules, and conventions used in this repository. It is read by AI coding tools including Claude Code, GitHub Copilot, Cursor, and similar assistants.

> Claude Code reads `CLAUDE.md` (not this file directly). `CLAUDE.md` imports the relevant sections and adds Claude-specific instructions.

---

## Repository Context

**What this repo does:** Playwright + TypeScript regression test suite for [EffortlessHR](https://www.effortlesshr.com/), a B2B SaaS HR platform for small businesses.

**Architecture:** Page Object Model (POM) with OOP principles. Tests never submit forms or create accounts.

**Target site:** Configured in `site.config.json` — always read this file before generating selectors or test code.

---

## Coding Rules for AI Agents

These rules apply to all AI-generated code in this repository.

### TypeScript
- Strict mode is enabled — no implicit `any`
- All variables and return types must be explicitly typed
- Run `npx tsc --noEmit` to verify after generating code
- Use `async/await`, not `.then()` chains

### Page Objects (`src/pages/`)
- Every page class extends `BasePage` from `./base.page`
- Locators are `readonly Locator` properties declared in the constructor
- Methods represent user actions — never put `expect()` inside page objects
- Use semantic selectors: role > ARIA label > text content > CSS class
- Never use `nth-child`, fragile auto-generated IDs, or deeply-nested combinators

### Tests (`tests/**/*.spec.ts`)
- Import `test` and `expect` from `@fixtures/site.fixture`, not `@playwright/test`
- Every test must have at least one tag in its title: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`, or `@custom`
- Never hardcode URLs — use `siteConfig.url` from the fixture
- Never use `page.waitForTimeout()` with a value > 500ms
- Never submit forms or enter real credentials

### Selectors
- Run `WebFetch` against the live site to get real DOM structure before writing selectors
- Do not invent or guess class names — verify against actual HTML
- Prefer resilient selectors that survive minor redesigns (roles, text, ARIA)

---

## Registered Subagents

These agents are defined in `.claude/agents/` and can be invoked by Claude Code automatically or via the `Agent` tool.

### `site-analyzer`

**Purpose:** Crawls a live website and produces a populated `site.config.json`.

**When Claude uses it:**
- When asked to analyze a site or check if `site.config.json` is up to date
- When running `/analyze-site`
- When onboarding a new site to the framework

**Key behaviors:**
- Follows redirects to find the canonical URL
- Dismisses cookie banners before inspecting DOM
- Extracts nav links, forms, and industry from page content
- Does not authenticate — marks auth-gated sites with `auth.required: true`

**Inputs:** `url` (required), `companyName` (optional override)

**Output:** A complete `site.config.json` JSON block + issues list + confidence rating

---

### `test-generator`

**Purpose:** Generates site-specific Playwright TypeScript test files for features not covered by the generic suites.

**When Claude uses it:**
- When a site has unique functionality (pricing calculator, multi-step flow, etc.)
- When asked to write tests for a specific page or scenario
- When writing regression tests for a discovered bug

**Key behaviors:**
- Reads `site.config.json` before generating anything
- Uses `WebFetch` to inspect live page HTML for real selectors
- Writes files to `tests/custom/<name>.spec.ts`
- Adds new page objects to `src/pages/` when needed
- Tags all tests appropriately

**Inputs:** `siteConfig` (required), `testScenarios` (optional), `pagesToTest` (optional)

**Output:** TypeScript test file(s) + any new page object additions

---

## Creating a New Agent

To add a new Claude Code subagent, create a file at `.claude/agents/<name>.md` with this frontmatter:

```yaml
---
name: agent-slug
description: One or two sentences describing WHEN Claude should use this agent.
             Be specific — this is what triggers auto-delegation.
model: claude-sonnet-4-6      # optional, defaults to current session model
tools:                         # optional, limits available tools
  - Read
  - Write
  - WebFetch
---
```

Then write the agent's role, instructions, inputs/outputs, and edge-case handling below the frontmatter in markdown.

**Naming convention:** `<purpose>-agent.md` or `<noun>-<verb>.md` in kebab-case.

---

## Available Slash Commands (Skills)

See [Skills.md](./Skills.md) for the full reference. Quick list:

| Command | When to use |
|---------|-------------|
| `/generate-full-suite` | Build a complete test suite for the current site |
| `/analyze-site` | Inspect the site and update `site.config.json` |
| `/run-smoke` | Run smoke tests and report |
| `/update-baseline` | Refresh visual regression snapshots |
| `/generate-report` | Summarize the most recent test results |

---

## Site-Specific Context

**Target:** EffortlessHR (`https://www.effortlesshr.com`)
**Industry:** HR SaaS — small business (1–100 employees)
**Key pages:** Homepage, About Us (`/about-us`), Partners, Solutions, College Instructors
**Nav items:** Pricing, Customers, Partners, Solutions, College Instructors, About Us
**Has contact form:** Yes (on homepage or discoverable via nav)
**Auth required:** No
**Do not:** Register for a trial, click "Log In", or submit any form
