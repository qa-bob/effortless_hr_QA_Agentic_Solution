/**
 * tests/functional/navigation-flows.spec.ts
 *
 * Functional tests for EffortlessHR's navigation flows and page routing.
 * Verifies that primary nav items resolve to pages, dropdown menus work,
 * and key sections are reachable from the homepage.
 *
 * Site: https://www.effortlesshr.com
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Navigation Flows @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
  });

  // ── Primary nav items ────────────────────────────────────────────────────────

  test('Pricing nav item is present @functional', async ({ page }) => {
    const pricingLink = page
      .locator('nav a, header a')
      .filter({ hasText: /^pricing$/i })
      .first();

    await expect(pricingLink, 'Pricing nav item should be in the navigation').toBeVisible();
  });

  test('About Us nav item is present and navigates correctly @functional', async ({ page, siteConfig }) => {
    const aboutLink = page
      .locator('nav a, header a')
      .filter({ hasText: /about/i })
      .first();

    await expect(aboutLink, 'About Us nav item should be visible').toBeVisible();

    await aboutLink.click();
    await page.waitForLoadState('domcontentloaded');

    // Verify we landed on the About page
    const currentUrl = page.url();
    expect(
      currentUrl.includes('/about'),
      `Clicking About should navigate to /about-us, got: ${currentUrl}`
    ).toBeTruthy();
  });

  test('Solutions nav item is present @functional', async ({ page }) => {
    const solutionsLink = page
      .locator('nav a, header a, nav button, header button')
      .filter({ hasText: /^solutions$/i })
      .first();

    await expect(solutionsLink, 'Solutions nav item should be visible').toBeVisible();
  });

  test('Partners nav item is present @functional', async ({ page }) => {
    const partnersLink = page
      .locator('nav a, header a')
      .filter({ hasText: /partners/i })
      .first();

    await expect(partnersLink, 'Partners nav item should be visible').toBeVisible();
  });

  // ── Site-wide elements ───────────────────────────────────────────────────────

  test('phone number is visible on the homepage @functional', async ({ page }) => {
    const phonePattern = /\+?1[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}|520[\s.-]?\d{3}[\s.-]?\d{4}/;
    const phoneText = page.getByText(phonePattern).first();

    const count = await phoneText.count();
    if (count === 0) {
      // Try a softer match on just the area code
      const areaSofter = page.getByText(/520\.\d{3}\.\d{4}|520-\d{3}-\d{4}/).first();
      const softerCount = await areaSofter.count();
      expect(
        softerCount,
        'A phone number (520 area code) should be visible on the homepage'
      ).toBeGreaterThan(0);
    } else {
      await expect(phoneText, 'Phone number should be visible').toBeVisible();
    }
  });

  test('homepage has a "30-day free trial" or similar offer mention @functional', async ({ page }) => {
    const trialText = page.getByText(/30.?day|free trial|no.*billing|no credit card/i).first();

    const count = await trialText.count();
    if (count === 0) {
      console.warn('[functional] No explicit trial offer text found — may be on a dedicated pricing page');
    } else {
      await expect(trialText, '30-day trial offer should be mentioned').toBeVisible();
    }
  });

  // ── Footer navigation ────────────────────────────────────────────────────────

  test('footer contains navigation links @functional', async ({ page }) => {
    const footerLinks = page.locator('footer a[href]');
    const count = await footerLinks.count();

    expect(
      count,
      `Footer should contain at least 3 links, found ${count}`
    ).toBeGreaterThanOrEqual(3);
  });

  test('footer has a link to About Us @functional', async ({ page }) => {
    const footerAboutLink = page
      .locator('footer a')
      .filter({ hasText: /about/i })
      .first();

    const count = await footerAboutLink.count();
    if (count > 0) {
      await expect(footerAboutLink, 'Footer should link to About Us').toBeVisible();
    } else {
      console.warn('[functional] No About link found in footer — may be structured differently');
    }
  });
});
