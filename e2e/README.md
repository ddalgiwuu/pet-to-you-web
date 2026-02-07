# Hospital Dashboard E2E Testing Suite

Comprehensive test suite for quality assurance, accessibility, performance, and cross-browser compatibility.

## Test Structure

```
e2e/
├── fixtures/
│   └── accessibility.fixture.ts       # WCAG 2.1 AA testing utilities
├── hospital-dashboard/
│   ├── 01-loading.spec.ts            # Page load and bundle size tests
│   ├── 02-accessibility.spec.ts      # WCAG 2.1 AA compliance tests
│   ├── 03-performance.spec.ts        # Core Web Vitals and performance metrics
│   ├── 04-responsive.spec.ts         # Mobile-web responsive design tests
│   └── 05-cross-browser.spec.ts      # Chrome, Firefox, Safari, Edge compatibility
├── playwright.config.ts              # Playwright configuration
└── README.md                          # This file
```

## Running Tests

### Install Dependencies
```bash
pnpm install
pnpm add -D @playwright/test axe-playwright
```

### Run All Tests
```bash
pnpm exec playwright test
```

### Run Specific Test Suite
```bash
# Loading and bundle size tests
pnpm exec playwright test 01-loading.spec.ts

# Accessibility tests
pnpm exec playwright test 02-accessibility.spec.ts

# Performance tests
pnpm exec playwright test 03-performance.spec.ts

# Responsive design tests
pnpm exec playwright test 04-responsive.spec.ts

# Cross-browser tests
pnpm exec playwright test 05-cross-browser.spec.ts
```

### Run in Specific Browser
```bash
pnpm exec playwright test --project=chromium
pnpm exec playwright test --project=firefox
pnpm exec playwright test --project=webkit
pnpm exec playwright test --project="Mobile Chrome"
pnpm exec playwright test --project="Mobile Safari"
```

### Watch Mode
```bash
pnpm exec playwright test --watch
```

### Debug Mode
```bash
pnpm exec playwright test --debug
```

### View Test Report
```bash
pnpm exec playwright show-report
```

## Test Coverage

### 1. Page Loading (01-loading.spec.ts)
- ✅ Homepage loads without errors
- ✅ Network throttling (slow 3G)
- ✅ Mobile responsiveness
- ✅ Performance metrics <3s FCP
- ✅ CSP violation detection
- ✅ Bundle size verification (<200KB)

**Acceptance Criteria:**
- No console errors on initial load
- FCP < 3 seconds on slow 3G
- Bundle size < 200KB
- No CSP violations
- Mobile viewport works without errors

### 2. Accessibility (02-accessibility.spec.ts)
Compliance with WCAG 2.1 Level AA standards:

- ✅ Keyboard navigation (Tab, Enter, Esc)
- ✅ ARIA labels on interactive elements
- ✅ Color contrast ratios (4.5:1 minimum)
- ✅ Focus management
- ✅ Form input labeling
- ✅ Heading hierarchy (H1 > H2 > H3...)
- ✅ Alt text on images
- ✅ Lang attribute on HTML
- ✅ Page structure and landmarks

**Acceptance Criteria:**
- All interactive elements keyboard accessible
- All buttons/links have aria-labels or text content
- No color contrast violations
- Proper heading hierarchy
- All images have alt text
- Form inputs properly labeled
- Page has lang attribute

### 3. Performance (03-performance.spec.ts)
Core Web Vitals and performance metrics:

- ✅ LCP (Largest Contentful Paint) < 2.5s
- ✅ FCP (First Contentful Paint) < 1.8s
- ✅ CLS (Cumulative Layout Shift) < 0.1
- ✅ Bundle size analysis (JS, CSS, images)
- ✅ Memory usage stability
- ✅ Lighthouse score indicators
- ✅ Layout thrashing detection

**Acceptance Criteria:**
- LCP < 2.5 seconds
- FCP < 1.8 seconds
- CLS < 0.1
- JavaScript < 200KB
- CSS < 50KB
- Memory growth < 50MB
- No excessive reflows

### 4. Responsive Design (04-responsive.spec.ts)
Mobile and web design consistency:

- ✅ Mobile Small (320x568)
- ✅ Mobile Standard (375x667)
- ✅ Mobile Large (414x896)
- ✅ Tablet (768x1024)
- ✅ Desktop (1280x800)
- ✅ Desktop XL (1920x1080)
- ✅ Touch targets (min 44x44px)
- ✅ No horizontal scroll on mobile
- ✅ Image scaling
- ✅ Form usability

**Acceptance Criteria:**
- Renders correctly on all viewport sizes
- Text is readable at all sizes
- No horizontal scroll on mobile
- Touch targets ≥44x44px
- Images scale appropriately
- Mobile menu accessible
- Forms usable on mobile

### 5. Cross-Browser Compatibility (05-cross-browser.spec.ts)
Testing across Chrome, Firefox, Safari, Edge:

- ✅ No console errors
- ✅ Navigation works
- ✅ Forms submit
- ✅ CSS features (flex, grid, transform, gradients, variables)
- ✅ JavaScript features (fetch, Promise, async/await)
- ✅ localStorage support
- ✅ Event listeners
- ✅ Animations
- ✅ Font loading
- ✅ Media queries
- ✅ Content visibility

**Acceptance Criteria:**
- No critical errors in any browser
- All navigation works consistently
- Forms functional in all browsers
- Modern CSS/JS features work
- Content visible and readable

## Quality Gates

### Pass Criteria
- ✅ 100% of loading tests pass
- ✅ 100% of accessibility tests pass
- ✅ 100% of performance tests pass
- ✅ 100% of responsive tests pass
- ✅ 100% of cross-browser tests pass

### Performance Targets
| Metric | Target | Status |
|--------|--------|--------|
| FCP | < 1.8s | ⏳ Pending |
| LCP | < 2.5s | ⏳ Pending |
| CLS | < 0.1 | ⏳ Pending |
| JS Bundle | < 200KB | ⏳ Pending |
| CSS Bundle | < 50KB | ⏳ Pending |
| Lighthouse | > 90 | ⏳ Pending |

### Accessibility Score
| Category | Target | Status |
|----------|--------|--------|
| Keyboard Nav | 100% | ⏳ Pending |
| ARIA Labels | 100% | ⏳ Pending |
| Color Contrast | 100% | ⏳ Pending |
| Alt Text | 100% | ⏳ Pending |
| Form Labels | 100% | ⏳ Pending |

## Configuration

### Playwright Config (playwright.config.ts)
- **Test Directory**: `./e2e`
- **Base URL**: `http://localhost:3000`
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Retries**: 2 (in CI), 0 (local)
- **Workers**: Parallel by default
- **Screenshots**: On failure only
- **Videos**: On failure only
- **Traces**: On first retry

### Environment Setup
```bash
# Install dependencies
pnpm install

# Start development server
pnpm --filter hospital-dashboard dev

# In another terminal, run tests
pnpm exec playwright test
```

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Install Playwright Browsers
  run: pnpm exec playwright install --with-deps

- name: Run E2E tests
  run: pnpm exec playwright test

- name: Upload Report
  uses: actions/upload-artifact@v4
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

## Known Issues & Notes

- Tests expect hospital dashboard to be running on http://localhost:3000
- Some tests are baseline/template and need integration with actual components
- Accessibility tests are simplified and recommend using Axe DevTools for comprehensive scanning
- Performance tests use browser API estimates (not as accurate as Lighthouse)

## Next Steps

1. **Integrate with CI/CD**: Add test runs to GitHub Actions
2. **Screenshot Comparison**: Implement visual regression testing
3. **Performance Budgets**: Set and track performance thresholds
4. **Accessibility Scanning**: Integrate axe-core for comprehensive WCAG checks
5. **Mobile Testing**: Test on actual devices via BrowserStack/Sauce Labs
6. **API Testing**: Add tests for dashboard API endpoints
7. **Form Testing**: Comprehensive form validation and submission tests
8. **Chart Testing**: Verify chart rendering and interactions
9. **Data Table Testing**: Test sorting, filtering, pagination

## Related Documentation

- **UI Library**: `/packages/ui/USAGE_EXAMPLES.md`
- **Design System**: `../INTEGRATED_DESIGN_SYSTEM.md` (Task #3)
- **Hospital Dashboard**: `/apps/hospital-dashboard`
- **Playwright Docs**: https://playwright.dev
- **WCAG 2.1**: https://www.w3.org/WAI/WCAG21/quickref/
- **Web Vitals**: https://web.dev/vitals/
