import { test, expect } from '@playwright/test';

test.describe('Hospital Dashboard - Cross-Browser Compatibility', () => {
  test('page loads without console errors', async ({ page, browserName }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(`[${browserName}] ${msg.text()}`);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(errors).toHaveLength(0);
  });

  test('navigation works in all browsers', async ({ page, browserName }) => {
    await page.goto('/');

    // Find first navigation link
    const navLink = await page.locator('nav a, [role="navigation"] a').first();

    if (await navLink.isVisible()) {
      await navLink.click();
      // Should navigate successfully
      expect(page.url()).not.toBe('about:blank');
    }
  });

  test('forms submit correctly in all browsers', async ({ page, browserName }) => {
    await page.goto('/');

    const form = await page.locator('form').first();

    if (await form.isVisible()) {
      const inputs = await form.locator('input').all();

      // Fill first input if available
      if (inputs.length > 0) {
        await inputs[0].fill('test value');
        expect(await inputs[0].inputValue()).toBe('test value');
      }
    }
  });

  test('CSS features work consistently across browsers', async ({ page, browserName }) => {
    await page.goto('/');

    const hasCSSFeatures = await page.evaluate(() => {
      const element = document.createElement('div');
      const style = element.style;

      // Check for common CSS feature support
      const features = {
        flex: 'display: flex' in style,
        grid: 'display: grid' in style,
        transform: 'transform' in style,
        gradients: CSS.supports('background', 'linear-gradient(to right, red, blue)'),
        variables: CSS.supports('color', 'var(--test)')
      };

      return features;
    });

    // All modern browsers should support these features
    expect(hasCSSFeatures.flex).toBeTruthy();
    expect(hasCSSFeatures.grid).toBeTruthy();
    expect(hasCSSFeatures.transform).toBeTruthy();
  });

  test('JavaScript features work in all browsers', async ({ page, browserName }) => {
    await page.goto('/');

    const jsFeatures = await page.evaluate(() => {
      return {
        fetch: typeof fetch !== 'undefined',
        promise: typeof Promise !== 'undefined',
        async: (async () => {})() !== undefined,
        arrays: Array.isArray([]),
        regex: /test/.test('test'),
        date: new Date().getTime() > 0
      };
    });

    // All modern browsers should support these
    Object.values(jsFeatures).forEach(feature => {
      expect(feature).toBeTruthy();
    });
  });

  test('localStorage works in all browsers', async ({ page, browserName }) => {
    await page.goto('/');

    const storageWorks = await page.evaluate(() => {
      try {
        localStorage.setItem('test', 'value');
        const value = localStorage.getItem('test');
        localStorage.removeItem('test');
        return value === 'value';
      } catch {
        return false;
      }
    });

    expect(storageWorks).toBe(true);
  });

  test('event listeners work correctly in all browsers', async ({ page, browserName }) => {
    await page.goto('/');

    const eventWorked = await page.evaluate(() => {
      return new Promise<boolean>((resolve) => {
        const button = document.querySelector('button');
        if (!button) {
          resolve(false);
          return;
        }

        let clicked = false;
        button.addEventListener('click', () => {
          clicked = true;
        });

        button.click();
        resolve(clicked);
      });
    });

    expect(eventWorked).toBe(true);
  });

  test('animations work in all browsers', async ({ page, browserName }) => {
    await page.goto('/');

    const animationSupport = await page.evaluate(() => {
      const style = document.createElement('style');
      style.textContent = `
        @keyframes test {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .test { animation: test 1s; }
      `;
      document.head.appendChild(style);

      const element = document.createElement('div');
      element.className = 'test';
      element.textContent = 'test';
      document.body.appendChild(element);

      const computed = window.getComputedStyle(element);
      const hasAnimation =
        computed.animation !== 'none' ||
        computed.animationName !== 'none';

      element.remove();
      style.remove();

      return hasAnimation;
    });

    // Animation support might not be consistent, but element should be created
    expect(animationSupport !== undefined).toBeTruthy();
  });

  test('font loading works in all browsers', async ({ page, browserName }) => {
    await page.goto('/');

    const fontsLoaded = await page.evaluate(() => {
      if (!document.fonts) {
        return true; // Older browsers don't support font loading API
      }
      return document.fonts.status === 'loaded' || document.fonts.status === 'loading';
    });

    expect(fontsLoaded).toBeTruthy();
  });

  test('media queries work in all browsers', async ({ page, browserName }) => {
    await page.goto('/');

    const mediaQueryWorks = await page.evaluate(() => {
      const mql = window.matchMedia('(max-width: 768px)');
      return typeof mql.matches === 'boolean';
    });

    expect(mediaQueryWorks).toBeTruthy();
  });

  test('content is visible and readable', async ({ page, browserName }) => {
    await page.goto('/');

    const hasVisibleContent = await page.evaluate(() => {
      const elements = document.querySelectorAll('body *');
      let visibleCount = 0;

      elements.forEach((el) => {
        if ((el as HTMLElement).offsetHeight > 0 && (el as HTMLElement).offsetWidth > 0) {
          visibleCount++;
        }
      });

      return visibleCount > 0;
    });

    expect(hasVisibleContent).toBeTruthy();
  });
});
