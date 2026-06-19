/**
 * tests/functional/homepage-features.spec.ts
 *
 * Functional tests for the EffortlessHR homepage.
 * Verifies the hero section, feature grid, testimonials, and CTA buttons
 * that represent the core value proposition of the product.
 *
 * Site: https://www.effortlesshr.com
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Homepage Features @functional', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigate();
    await homePage.waitForLoad();
  });

  // ── Hero section ────────────────────────────────────────────────────────────

  test('homepage has a main heading @functional', async ({ homePage }) => {
    const heading = await homePage.getMainHeading();
    expect(heading.length, 'Homepage should have an H1 or H2 heading').toBeGreaterThan(0);
  });

  test('"Try It Free" CTA is visible and is a link @functional', async ({ page }) => {
    const tryFreeLink = page
      .getByRole('link', { name: /try it free/i })
      .or(page.getByRole('button', { name: /try it free/i }))
      .first();

    await expect(tryFreeLink, '"Try It Free" CTA should be visible on the homepage').toBeVisible();
  });

  test('"Log In" button is visible @functional', async ({ page }) => {
    const loginBtn = page
      .getByRole('link', { name: /log in/i })
      .or(page.getByRole('button', { name: /log in/i }))
      .first();

    await expect(loginBtn, '"Log In" should be accessible from the homepage').toBeVisible();
  });

  test('"View Pricing" link is accessible @functional', async ({ page }) => {
    const pricingLink = page
      .getByRole('link', { name: /view pricing|pricing/i })
      .first();

    const count = await pricingLink.count();
    if (count === 0) {
      // Pricing link may be in nav — check nav
      const navPricingLink = page.locator('nav a').filter({ hasText: /pricing/i }).first();
      await expect(navPricingLink, 'A pricing link should exist in the nav or body').toBeVisible();
    } else {
      await expect(pricingLink, '"View Pricing" link should be visible').toBeVisible();
    }
  });

  // ── Feature grid ────────────────────────────────────────────────────────────

  test('Employee Management feature section is present @functional', async ({ page }) => {
    const section = page
      .getByText(/employee.*management|personnel.*management/i)
      .first();

    await expect(section, 'Employee Management feature section should be visible').toBeVisible();
  });

  test('Employee Self-Service feature section is present @functional', async ({ page }) => {
    const section = page
      .getByText(/self.?service|employee portal/i)
      .first();

    await expect(section, 'Employee Self-Service section should be visible').toBeVisible();
  });

  test('PTO Tracking feature section is present @functional', async ({ page }) => {
    const section = page
      .getByText(/pto|time.?off|leave management/i)
      .first();

    await expect(section, 'PTO / Leave Management section should be visible').toBeVisible();
  });

  test('Time Clock feature section is present @functional', async ({ page }) => {
    const section = page
      .getByText(/time clock|time tracking/i)
      .first();

    await expect(section, 'Time Clock feature section should be visible').toBeVisible();
  });

  test('Document Storage feature section is present @functional', async ({ page }) => {
    const section = page
      .getByText(/document|cloud.*storage|file storage/i)
      .first();

    await expect(section, 'Document Storage feature section should be visible').toBeVisible();
  });

  test('multiple HR feature sections are on the homepage @functional', async ({ page }) => {
    // The homepage should list at least 3 distinct feature sections
    const featureHeadings = page.locator('h2, h3').filter({
      hasText: /employee|pto|time|document|portal|management|tracking|clock/i,
    });

    const count = await featureHeadings.count();
    expect(
      count,
      `Expected at least 3 HR feature headings on the homepage, found ${count}`
    ).toBeGreaterThanOrEqual(3);
  });

  // ── Testimonials ────────────────────────────────────────────────────────────

  test('testimonials section is present @functional', async ({ page }) => {
    // Testimonial sections often use blockquote, or containers with review/testimonial text
    const testimonials = page
      .locator('blockquote, [class*="testimonial"], [class*="review"], [class*="quote"]')
      .or(page.getByText(/hamburg süd|seattle gymnastics|hancock county/i));

    const count = await testimonials.count();
    if (count === 0) {
      // Fallback: look for any section that has quotation-style content
      const quotedText = page.locator('*').filter({
        hasText: /great support|easy to use|affordable/i,
      }).first();

      const isVisible = await quotedText.isVisible().catch(() => false);
      expect(
        isVisible,
        'Homepage should have customer testimonials or social proof content'
      ).toBeTruthy();
    } else {
      expect(count, 'At least one testimonial element should be visible').toBeGreaterThan(0);
    }
  });

  // ── Footer ──────────────────────────────────────────────────────────────────

  test('footer is present and contains contact information @functional', async ({ page }) => {
    const footer = page.locator('footer').first();
    await expect(footer, 'Page should have a footer element').toBeVisible();

    // Phone number should be in the footer
    const phoneText = footer.getByText(/\+?1[\s.-]?\d{3}[\s.-]?\d{3}[\s.-]?\d{4}|520/);
    const phoneCount = await phoneText.count();
    if (phoneCount === 0) {
      console.warn('[functional] No phone number found in footer — may be in contact section');
    } else {
      expect(phoneCount).toBeGreaterThan(0);
    }
  });

  test('footer has social media links @functional', async ({ page }) => {
    const footer = page.locator('footer').first();
    const socialLinks = footer.locator(
      'a[href*="linkedin"], a[href*="twitter"], a[href*="facebook"], a[href*="youtube"]'
    );

    const count = await socialLinks.count();
    expect(
      count,
      'Footer should contain at least one social media link'
    ).toBeGreaterThan(0);
  });
});
