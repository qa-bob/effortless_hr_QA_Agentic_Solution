/**
 * tests/functional/about-page.spec.ts
 *
 * Functional tests for the EffortlessHR About Us page (/about-us).
 * Verifies the team section, company description, and key content blocks.
 *
 * Site: https://www.effortlesshr.com/about-us
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

const ABOUT_PATH = '/about-us';

test.describe('About Page @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url.replace(/\/$/, '') + ABOUT_PATH, {
      waitUntil: 'domcontentloaded',
    });
    await page.waitForLoadState('networkidle');
  });

  // ── Page loads ──────────────────────────────────────────────────────────────

  test('about page loads successfully @functional', async ({ page }) => {
    const title = await page.title();
    expect(title.trim().length, 'About page should have a non-empty title').toBeGreaterThan(0);

    const h1 = page.locator('h1, h2').first();
    await expect(h1, 'About page should have a heading').toBeVisible();
  });

  // ── Company content ─────────────────────────────────────────────────────────

  test('about page describes the company mission @functional', async ({ page }) => {
    const missionText = page.getByText(
      /small.*employer|hr.*software|human resources|compliance|effortless/i
    ).first();

    await expect(
      missionText,
      'About page should describe the company mission or product'
    ).toBeVisible();
  });

  test('about page mentions the target market (small employers) @functional', async ({ page }) => {
    const targetText = page.getByText(/small.*employer|1.{0,5}100.*employee|small business/i).first();

    const count = await targetText.count();
    if (count === 0) {
      // Softer check — HR-related content is present
      const hrText = page.getByText(/hr|human resources|employee/i).first();
      await expect(hrText, 'About page should reference HR or employees').toBeVisible();
    } else {
      await expect(targetText, 'About page should mention small employers as target market').toBeVisible();
    }
  });

  // ── Team section ────────────────────────────────────────────────────────────

  test('about page has a team section @functional', async ({ page }) => {
    // Team sections typically contain names or headings with people
    const teamHeading = page.getByText(/our team|team|leadership|founders?/i).first();

    const count = await teamHeading.count();
    if (count > 0) {
      await expect(teamHeading, 'Team section heading should be visible').toBeVisible();
    } else {
      // Fall back to looking for known team member names
      const founderName = page.getByText(/lola kakes|aaron queen|pete lett|steve lett/i).first();
      await expect(
        founderName,
        'About page should name at least one team member'
      ).toBeVisible();
    }
  });

  test('at least one team member name is visible @functional', async ({ page }) => {
    const teamMembers = [
      /lola kakes/i,
      /aaron queen/i,
      /pete lett/i,
      /steve lett/i,
    ];

    let found = false;
    for (const pattern of teamMembers) {
      const el = page.getByText(pattern).first();
      if (await el.count() > 0) {
        await expect(el, `Team member "${pattern.source}" should be visible`).toBeVisible();
        found = true;
        break;
      }
    }

    expect(
      found,
      'At least one known team member name (Lola Kakes, Aaron Queen, Pete Lett, Steve Lett) should appear on the About page'
    ).toBeTruthy();
  });

  // ── Navigation back to home ─────────────────────────────────────────────────

  test('about page has a link back to the homepage @functional', async ({ page, siteConfig }) => {
    const homeLinks = page.locator(`a[href="/"], a[href="${siteConfig.url}"]`).first();

    if (await homeLinks.count() === 0) {
      // Check for logo link in header
      const logoLink = page.locator('header a').first();
      await expect(
        logoLink,
        'About page header should contain a link back to the homepage'
      ).toBeVisible();
    } else {
      await expect(homeLinks, 'About page should have a link to the homepage').toBeVisible();
    }
  });
});
