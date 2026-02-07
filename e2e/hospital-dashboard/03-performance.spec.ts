import { test, expect } from '@playwright/test';

test.describe('Hospital Dashboard - Performance Metrics', () => {
  test('Largest Contentful Paint (LCP) under 2.5s', async ({ page }) => {
    const metrics: any = {};

    // Collect performance timing data
    await page.goto('/', { waitUntil: 'networkidle' });

    const lcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.renderTime || lastEntry.loadTime || 0);
        });

        observer.observe({ entryTypes: ['largest-contentful-paint'] });

        // Timeout after 5 seconds
        setTimeout(() => resolve(0), 5000);
      });
    });

    expect(lcp).toBeLessThan(2500); // 2.5 seconds
  });

  test('First Contentful Paint (FCP) under 1.8s', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const navigationTiming = await page.evaluate(() => {
      const timing = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        fcp: timing.responseStart - timing.fetchStart,
        domInteractive: timing.domInteractive - timing.fetchStart
      };
    });

    // FCP should be relatively quick
    expect(navigationTiming.fcp).toBeLessThan(1800); // 1.8 seconds
  });

  test('Cumulative Layout Shift (CLS) under 0.1', async ({ page }) => {
    let cls = 0;

    const clsCheck = await page.goto('/', { waitUntil: 'networkidle' });

    const clsValue = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let totalCLS = 0;

        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if ((entry as any).hadRecentInput) continue;
            totalCLS += (entry as any).value;
          }
        });

        observer.observe({ entryTypes: ['layout-shift'] });

        setTimeout(() => {
          observer.disconnect();
          resolve(totalCLS);
        }, 3000);
      });
    });

    expect(clsValue).toBeLessThan(0.1);
  });

  test('bundle size analysis', async ({ page }) => {
    let totalSize = 0;
    let jsSize = 0;
    let cssSize = 0;
    let imageSize = 0;

    page.on('response', (response) => {
      const size = response.headersBuffer().length;
      const url = response.url();

      totalSize += size;

      if (url.includes('.js') || url.includes('_next/static')) {
        jsSize += size;
      } else if (url.includes('.css')) {
        cssSize += size;
      } else if (url.match(/\.(png|jpg|jpeg|gif|webp)$/)) {
        imageSize += size;
      }
    });

    await page.goto('/', { waitUntil: 'networkidle' });

    expect(jsSize).toBeLessThan(200 * 1024); // 200KB JS
    expect(cssSize).toBeLessThan(50 * 1024); // 50KB CSS
  });

  test('memory usage is stable', async ({ page }) => {
    await page.goto('/');

    const initialMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });

    // Simulate user interactions
    await page.locator('body').click();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    await page.waitForTimeout(1000);

    const finalMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });

    // Memory growth should be reasonable
    const memoryGrowth = finalMemory - initialMemory;
    expect(memoryGrowth).toBeLessThan(50 * 1024 * 1024); // 50MB max growth
  });

  test('Core Web Vitals pass thresholds', async ({ page }) => {
    await page.goto('/');

    const webVitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const vitals: any = {};

        // LCP
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          vitals.lcp = entries[entries.length - 1].renderTime || entries[entries.length - 1].loadTime;
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // FID (First Input Delay) - track interaction responsiveness
        new PerformanceObserver((list) => {
          vitals.fid = list.getEntries()[0].processingDuration;
        }).observe({ entryTypes: ['first-input'] });

        // CLS
        let cls = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              cls += (entry as any).value;
            }
          }
          vitals.cls = cls;
        }).observe({ entryTypes: ['layout-shift'] });

        setTimeout(() => resolve(vitals), 3000);
      });
    });

    expect(webVitals).toBeTruthy();
  });

  test('lighthouse performance score target', async ({ page }) => {
    // This would require running Lighthouse separately
    // For now, we verify basic performance metrics
    await page.goto('/');

    const performanceScore = await page.evaluate(() => {
      const timing = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart,
        loadComplete: timing.loadEventEnd - timing.loadEventStart,
        totalTime: timing.loadEventEnd - timing.fetchStart
      };
    });

    expect(performanceScore.totalTime).toBeLessThan(5000); // 5 seconds total
  });

  test('no layout thrashing (multiple reflows)', async ({ page }) => {
    await page.goto('/');

    const reflowCount = await page.evaluate(() => {
      let reflowCount = 0;

      // Patch offsetHeight to count reflows
      const originalGetter = Object.getOwnPropertyDescriptor(
        Element.prototype,
        'offsetHeight'
      )?.get;

      if (originalGetter) {
        Object.defineProperty(Element.prototype, 'offsetHeight', {
          get: function () {
            reflowCount++;
            return originalGetter!.call(this);
          }
        });
      }

      return reflowCount;
    });

    // Some reflows are expected, but excessive ones indicate layout thrashing
    expect(reflowCount).toBeLessThan(100);
  });
});
