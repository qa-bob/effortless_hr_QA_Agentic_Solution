# Skills.md — Slash Command Reference

This document describes the Claude Code slash commands (skills) available in this repository. Skills are defined as markdown files in `.claude/commands/` and are invoked with a `/` prefix inside a Claude Code session.

---

## What Are Skills?

In Claude Code, a **skill** (slash command) is a reusable, parameterized workflow that Claude executes when invoked. Unlike one-off prompts, skills:

- Load only when invoked — they don't consume context at session start
- Package repeatable, multi-step workflows in a single command
- Can be shared with the team by committing the `.claude/commands/` file

To invoke a skill, type `/skill-name` in Claude Code (CLI, VS Code extension, or Desktop app).

---

## Available Skills

### `/generate-full-suite`

**File:** `.claude/commands/generate-full-suite.md`

**Purpose:** Analyze the target website from scratch and build a complete, production-quality Playwright + TypeScript regression test suite using POM.

**What it does (6 steps):**
1. Reads `site.config.json` for the URL and configuration flags
2. Uses `WebFetch` to discover pages, forms, nav items, and interactive elements
3. Plans page object classes (one per discovered page/section)
4. Writes page object files with real selectors from the live site
5. Writes test files across all categories: smoke, navigation, forms, functional, visual, responsive
6. Updates `site.config.json` with discovered metadata and runs `npx tsc --noEmit`

**When to use:**
- Setting up tests for a newly onboarded site
- Rebuilding the suite after a major site redesign
- When the existing tests need a complete refresh

**Output:** New/updated files in `src/pages/`, `tests/`, and `site.config.json`. Summary of pages analyzed, classes created, and test count.

**Prerequisites:** `site.config.json` must have a valid `url` field.

---

### `/analyze-site`

**File:** `.claude/commands/analyze-site.md`

**Purpose:** Inspect the live website and produce a fully-populated `site.config.json`. Does not write test files.

**Usage:**
```
/analyze-site
/analyze-site https://www.effortlesshr.com
```

**What it does:**
1. Navigates to the site URL (or the URL from `site.config.json` if not provided)
2. Extracts: title, meta description, nav links, forms, H1, CTA text, HTTPS status
3. Tries `/contact`, `/contact-us`, `/get-in-touch` to find the contact form
4. Checks for horizontal overflow at 390px viewport
5. Outputs a completed `site.config.json` + issues list

**When to use:**
- Before `/generate-full-suite` to populate config first
- After a site redesign to verify nav items are still correct
- To audit a site for basic issues (missing meta description, broken links, etc.)

**Output:** JSON block ready to paste into `site.config.json` + a checklist of issues found.

---

### `/run-smoke`

**File:** `.claude/commands/run-smoke.md`

**Purpose:** Execute the `@smoke` test suite and report results in human-readable form.

**What it does:**
1. Runs `npm run test:smoke` (all smoke tests across configured viewports)
2. Parses the JSON results from `test-results/results.json`
3. Reports: pass/fail counts, failed test names with error messages, duration

**When to use:**
- Before starting a test authoring session (confirm site is up)
- In CI gating — if smoke fails, deeper tests won't run
- Quick sanity check after deploying a site change

**Output:** Formatted pass/fail report with error details for any failing tests.

---

### `/update-baseline`

**File:** `.claude/commands/update-baseline.md`

**Purpose:** Refresh the visual regression baseline screenshots after an intentional design change.

**What it does:**
1. Runs `npm run baseline` (equivalent to `playwright test --grep @visual --update-snapshots`)
2. Overwrites existing snapshots in `__snapshots__/`
3. Reports which snapshots were updated

**When to use:**
- After a confirmed intentional UI change (rebrand, layout update, new component)
- When onboarding a new viewport configuration
- When visual tests are failing due to a planned change, not a regression

**Caution:** This overwrites baselines. Only run after visually confirming the new design is correct. Commit the updated snapshots in a dedicated PR with a clear explanation.

**Output:** List of updated snapshot files + diff summary.

---

### `/generate-report`

**File:** `.claude/commands/generate-report.md`

**Purpose:** Parse the most recent test run results and produce a human-readable summary.

**What it does:**
1. Reads `test-results/results.json` (produced by the last `npm test` run)
2. Summarizes: total tests, passed, failed, skipped, duration
3. Lists all failed tests with their error messages
4. Highlights any `@smoke` failures (site availability issues)
5. Suggests next steps based on failure patterns

**When to use:**
- After a CI run to understand what failed and why
- To generate a status report for stakeholders
- Before a sprint review to summarize test coverage

**Output:** A formatted markdown report. Save it with `/generate-report > report.md` if needed.

---

## Creating a New Skill

To add a new slash command:

1. Create `.claude/commands/<name>.md`
2. Write the skill as a first-person instruction set (Claude will execute it)
3. Include: purpose, step-by-step instructions, inputs, outputs, and edge cases
4. Test it by running `/<name>` in a Claude Code session

**Naming conventions:**
- Use kebab-case: `my-command.md` → `/my-command`
- Name reflects the action: `check-accessibility`, `update-nav-items`, `add-functional-test`

**Best practices:**
- Start with "Read `site.config.json`" to get the current URL
- Use `WebFetch` to inspect the live site before generating selectors
- End with a verification step (`npx tsc --noEmit` or a test run)
- Document what output to expect

---

## Skill vs. Agent: When to Use Each

| Use a **Skill** when... | Use an **Agent** when... |
|------------------------|--------------------------|
| The workflow is user-triggered | Claude should delegate automatically |
| Steps are linear and well-defined | The task requires independent decision-making |
| You need a specific sequence of tool calls | You want to isolate context (long research, bulk file reads) |
| Team needs to invoke it explicitly | Claude can infer when to use it from context |

Skills are invoked by you. Agents are invoked by Claude (or by you with "use the site-analyzer agent").
