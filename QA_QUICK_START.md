# QA Quick Start Guide

**Purpose**: Fast-track guide to running quality assurance tests
**Audience**: Developers, QA, Team Lead
**Time**: ~15 minutes to run full suite

---

## 🚀 Quick Start (5 steps)

### Step 1: Install Dependencies
```bash
cd /Users/ryansong/Desktop/DEV/Pet_to_You/pet-to-you-web
pnpm install
pnpm add -D @playwright/test axe-playwright
pnpm exec playwright install
```

### Step 2: Start Hospital Dashboard
```bash
# In terminal 1
pnpm --filter hospital-dashboard dev
# Wait for: "✓ ready in XXXms"
```

### Step 3: Run All Tests
```bash
# In terminal 2
cd /Users/ryansong/Desktop/DEV/Pet_to_You/pet-to-you-web
pnpm exec playwright test
```

### Step 4: View Results
```bash
pnpm exec playwright show-report
```

### Step 5: Check Report
Open `playwright-report/index.html` in browser

---

## 📋 Test Suites Overview

| Suite | Time | Tests | Coverage |
|-------|------|-------|----------|
| Loading | 5-10m | 6 | Page load, bundle size, performance |
| Accessibility | 10-15m | 11 | WCAG 2.1 AA, keyboard nav, ARIA |
| Performance | 10-15m | 8 | Core Web Vitals, memory, reflows |
| Responsive | 15-20m | 9 | Mobile, tablet, desktop viewports |
| Cross-Browser | 30-40m | 11 | Chrome, Firefox, Safari, Edge, Mobile |
| **Total** | **90-120m** | **45** | **All aspects** |

---

## ⚡ Quick Commands

### Run Everything
```bash
pnpm exec playwright test
```

### Run Specific Suite
```bash
# Just loading tests
pnpm exec playwright test 01-loading.spec.ts

# Just accessibility tests
pnpm exec playwright test 02-accessibility.spec.ts

# Just performance tests
pnpm exec playwright test 03-performance.spec.ts

# Just responsive tests
pnpm exec playwright test 04-responsive.spec.ts

# Just cross-browser tests
pnpm exec playwright test 05-cross-browser.spec.ts
```

### Run Specific Browser
```bash
pnpm exec playwright test --project=chromium
pnpm exec playwright test --project=firefox
pnpm exec playwright test --project=webkit
pnpm exec playwright test --project="Mobile Chrome"
pnpm exec playwright test --project="Mobile Safari"
```

### Debug & Inspect
```bash
# Open test debugger
pnpm exec playwright test --debug

# Watch mode (re-run on changes)
pnpm exec playwright test --watch

# Show test UI
pnpm exec playwright test --ui

# View HTML report
pnpm exec playwright show-report

# Run with headed browser (see what's happening)
pnpm exec playwright test --headed
```

### Filter Tests
```bash
# Run only tests matching pattern
pnpm exec playwright test --grep "keyboard"
pnpm exec playwright test --grep "contrast"
pnpm exec playwright test --grep "bundle"
```

---

## 🎯 Key Metrics to Check

### Performance (Phase 3)
- ✅ FCP < 1.8s (First Contentful Paint)
- ✅ LCP < 2.5s (Largest Contentful Paint)
- ✅ CLS < 0.1 (Cumulative Layout Shift)
- ✅ JS Bundle < 200KB
- ✅ CSS Bundle < 50KB

### Accessibility (Phase 2)
- ✅ 100% keyboard navigable
- ✅ 100% ARIA labeled
- ✅ 4.5:1 contrast ratio
- ✅ All images have alt text
- ✅ Proper heading hierarchy

### Responsive (Phase 4)
- ✅ Mobile: 320px-414px
- ✅ Tablet: 768px
- ✅ Desktop: 1024px-1920px
- ✅ No horizontal scroll
- ✅ 44x44px touch targets

### Cross-Browser (Phase 5)
- ✅ Chrome ✓
- ✅ Firefox ✓
- ✅ Safari ✓
- ✅ Edge ✓
- ✅ Mobile ✓

---

## 📊 Understanding Results

### Green ✅
```
✓ test name
```
Test passed - no issues found

### Red ❌
```
✗ test name
  Error: expected 1234 to be less than 1000
```
Test failed - needs investigation

### Skipped ⊘
```
⊘ test name
```
Test skipped - check configuration

---

## 🐛 Troubleshooting

### Server Not Starting
```bash
# Make sure port 3000 is free
lsof -i :3000

# Kill process if needed
kill -9 <PID>

# Or use different port
pnpm --filter hospital-dashboard dev -p 3001
# Update playwright.config.ts baseURL
```

### Tests Timing Out
```bash
# Increase timeout in playwright.config.ts
timeout: 60000 // 60 seconds
```

### Memory Issues
```bash
# Run with fewer workers
pnpm exec playwright test --workers=1
```

### Screenshot/Video Issues
```bash
# Check if directories exist
mkdir -p playwright-report
mkdir -p test-results
```

### Browser Not Found
```bash
# Install all browser binaries
pnpm exec playwright install --with-deps
```

---

## 📈 Reading the Report

### HTML Report
1. Open `playwright-report/index.html`
2. See test results in real time
3. View failure details
4. Check screenshots/videos
5. Review duration and stats

### JSON Report
```bash
cat test-results/results.json | jq .
```

### XML Report (for CI/CD)
```bash
cat test-results/results.xml
```

---

## 🔄 Continuous Integration

### GitHub Actions
```yaml
- name: Install Playwright
  run: pnpm exec playwright install --with-deps

- name: Run Tests
  run: pnpm exec playwright test

- name: Upload Report
  uses: actions/upload-artifact@v4
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

---

## 📝 Common Tasks

### Create Bug Report
```bash
# From test failure
1. Note test name
2. Note browser/viewport
3. Include screenshot/video
4. Create GitHub issue with:
   - Title: [QA] Test name failed on [Browser]
   - Body: Include steps, expected, actual
```

### Add New Test
```bash
# 1. Create new file in e2e/hospital-dashboard/
# 2. Follow existing test pattern
# 3. Run test
pnpm exec playwright test <filename>
```

### Debug Specific Test
```bash
pnpm exec playwright test <filename> --debug
```

---

## ⏱️ Time Estimates

| Activity | Time |
|----------|------|
| Install dependencies | 2-3 min |
| Start server | 1-2 min |
| Run all tests | 90-120 min |
| Review results | 10-15 min |
| **Total** | **120-150 min** |

**For quick validation** (just loading + accessibility):
```bash
pnpm exec playwright test 01-loading.spec.ts 02-accessibility.spec.ts
# ~15-20 minutes
```

---

## 🎓 Learn More

- **Full Documentation**: See `e2e/README.md`
- **Quality Report Template**: `QA_QUALITY_REPORT_TEMPLATE.md`
- **Accessibility Checklist**: `ACCESSIBILITY_AUDIT_CHECKLIST.md`
- **Implementation Guide**: `QA_IMPLEMENTATION_CHECKLIST.md`
- **Playwright Docs**: https://playwright.dev
- **WCAG 2.1**: https://www.w3.org/WAI/WCAG21/quickref/

---

## ✅ Pre-Test Checklist

Before running tests:
- [ ] Hospital dashboard code exists and runs
- [ ] Port 3000 is available
- [ ] Dependencies installed (`pnpm install`)
- [ ] Playwright browsers installed (`pnpm exec playwright install`)
- [ ] Network connection stable
- [ ] No other services using port 3000
- [ ] 2 terminal windows open (1 for server, 1 for tests)

---

## 🚨 If Something Goes Wrong

### Test Fails
1. Check screenshot in `playwright-report/`
2. Check video in `test-results/`
3. Read error message carefully
4. Check if it's a timing issue (increase timeout)
5. Check if it's a selector issue (inspect HTML)
6. Run single test with `--debug` flag

### Browser Won't Start
1. Clear browser cache: `rm -rf ~/.cache/ms-playwright`
2. Reinstall: `pnpm exec playwright install --with-deps`
3. Check system resources

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>
```

---

## 📞 Support

**Questions?** Check:
- `e2e/README.md` - Full documentation
- Test files - See real examples
- Playwright docs - https://playwright.dev

**Issues?** Create GitHub issue with:
- Test name
- Browser/viewport
- Error message
- Screenshot if applicable

---

**Ready to test?** → Run: `pnpm exec playwright test`

Last updated: 2026-02-08
