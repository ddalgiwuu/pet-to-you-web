import { test as base, Page, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

type A11yFixture = {
  a11y: {
    injectAxe: (page: Page) => Promise<void>;
    checkA11y: (page: Page, context?: string) => Promise<void>;
    getContrastRatios: (page: Page) => Promise<any[]>;
    checkKeyboardNav: (page: Page) => Promise<void>;
    checkAriaLabels: (page: Page) => Promise<any[]>;
  };
};

export const test = base.extend<A11yFixture>({
  a11y: async ({ page }, use) => {
    const a11y = {
      injectAxe: async (targetPage: Page = page) => {
        await injectAxe(targetPage);
      },
      checkA11y: async (targetPage: Page = page, context = '') => {
        await injectAxe(targetPage);
        await checkA11y(targetPage, context);
      },
      getContrastRatios: async (targetPage: Page = page) => {
        const results = await targetPage.evaluate(() => {
          const elements = document.querySelectorAll('*');
          const ratios: any[] = [];

          elements.forEach(el => {
            const text = el.textContent?.trim();
            if (!text || text.length === 0) return;

            const style = window.getComputedStyle(el);
            const color = style.color;
            const bgColor = style.backgroundColor;

            ratios.push({
              element: el.tagName,
              text: text.substring(0, 50),
              color,
              bgColor
            });
          });

          return ratios;
        });
        return results;
      },
      checkKeyboardNav: async (targetPage: Page = page) => {
        // Test Tab key navigation
        await targetPage.keyboard.press('Tab');
        const focusedElement = await targetPage.evaluate(() => {
          return document.activeElement?.tagName;
        });
        expect(focusedElement).toBeTruthy();

        // Test Shift+Tab for reverse navigation
        await targetPage.keyboard.press('Shift+Tab');
        const prevFocus = await targetPage.evaluate(() => {
          return document.activeElement?.tagName;
        });
        expect(prevFocus).toBeTruthy();
      },
      checkAriaLabels: async (targetPage: Page = page) => {
        const missing = await targetPage.evaluate(() => {
          const interactive = document.querySelectorAll('button, a, input, select, textarea');
          const issues: any[] = [];

          interactive.forEach(el => {
            const hasAriaLabel = el.getAttribute('aria-label');
            const hasAriaLabelledby = el.getAttribute('aria-labelledby');
            const hasTextContent = el.textContent?.trim();
            const hasLabel = el.querySelector('label');

            if (!hasAriaLabel && !hasAriaLabelledby && !hasTextContent && !hasLabel) {
              issues.push({
                element: el.tagName,
                class: el.className,
                id: el.id
              });
            }
          });

          return issues;
        });

        return missing;
      }
    };

    await use(a11y);
  }
});

export { expect };
