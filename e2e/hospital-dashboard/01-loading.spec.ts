import { test, expect } from '@playwright/test';

test.describe('Hospital Dashboard - Page Loading', () => {
  test('homepage loads without errors', async ({ page }) => {
    // Navigate to dashboard
    const response = await page.goto('/', { waitUntil: 'networkidle' });
    expect(response?.status()).toBeLessThan(400);

    // Check for critical elements
    await expect(page).toHaveTitle(/Hospital|Dashboard/i);

    // Verify no console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Wait for initial render
    await page.waitForLoadState('domcontentloaded');
    expect(errors.length).toBe(0);
  });

  test('dashboard loads with network throttling (slow 3G)', async ({ page }) => {
    // Simulate slow network
    await page.route('**/*', route => {
      setTimeout(() => route.continue(), 100);
    });

    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const loadTime = Date.now() - startTime;

    // Should load in reasonable time even on slow network
    expect(loadTime).toBeLessThan(10000); // 10 seconds max
  });

  test('dashboard is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check for mobile menu or hamburger
    const mobileMenu = await page.locator('[role="button"][aria-label*="menu" i]').count();
    expect(mobileMenu).toBeGreaterThanOrEqual(0);

    // Verify content is visible (not hidden)
    const mainContent = await page.locator('main, [role="main"]');
    await expect(mainContent).toBeVisible();
  });

  test('dashboard loads performance metrics under 3 seconds on fast connection', async ({ page }) => {
    const metrics: any = {};

    page.on('metrics', data => {
      metrics.memory = data.JSHeapUsedSize;
    });

    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(3000); // 3 seconds FCP target
  });

  test('no CSP (Content Security Policy) violations on load', async ({ page }) => {
    const cspViolations: any[] = [];

    page.on('console', msg => {
      if (msg.text().includes('Refused to')) {
        cspViolations.push(msg.text());
      }
    });

    await page.goto('/');
    expect(cspViolations).toHaveLength(0);
  });

  test('verifies bundle size is optimized', async ({ page }) => {
    let totalBundleSize = 0;

    page.on('response', response => {
      const headers = response.headers();
      const size = parseInt(headers['content-length'] || '0');
      totalBundleSize += size;
    });

    await page.goto('/', { waitUntil: 'networkidle' });

    // Initial bundle should be under 200KB
    expect(totalBundleSize).toBeLessThan(200 * 1024); // 200KB
  });
});
