# WCAG 2.1 Level AA Accessibility Audit Checklist

**Target**: Hospital Dashboard & Business Dashboard
**Standard**: WCAG 2.1 Level AA
**Status**: ⏳ Awaiting test execution

---

## 1. Perceivable - Users must be able to perceive the content

### 1.1 Text Alternatives

- [ ] **1.1.1 Non-text Content (Level A)**
  - [ ] All images have descriptive alt text
  - [ ] Decorative images have empty alt text (`alt=""`)
  - [ ] Complex images have long descriptions
  - [ ] Charts/graphs have text alternatives
  - [ ] Icons have accessible labels

**Tool**: Automated + manual review
**Status**: ⏳ Pending

### 1.2 Time-based Media
- [ ] **1.2.1 Audio-only and Video-only (Level A)**
  - [ ] Pre-recorded audio has transcript
  - [ ] Pre-recorded video has captions or audio description

- [ ] **1.2.2 Captions (Level A)**
  - [ ] All video has captions
  - [ ] Captions are accurate and complete

- [ ] **1.2.3 Audio Description (Level A)**
  - [ ] Video has audio description track
  - [ ] Description is clear and synchronized

**Status**: ⏳ Pending

### 1.3 Adaptable - Content must be adaptable

- [ ] **1.3.1 Info and Relationships (Level A)**
  - [ ] Proper semantic HTML (h1-h6, nav, main, etc.)
  - [ ] Form labels associated with inputs
  - [ ] List items properly marked
  - [ ] Table headers properly associated
  - [ ] Logical reading order

- [ ] **1.3.2 Meaningful Sequence (Level A)**
  - [ ] Content in logical reading order
  - [ ] Visual order matches logical order
  - [ ] No content hidden in CSS before meaningful content

- [ ] **1.3.3 Sensory Characteristics (Level A)**
  - [ ] Instructions don't rely on shape/color alone
  - [ ] Instructions don't rely on size/location alone
  - [ ] Color + text labels for all elements

- [ ] **1.3.4 Orientation (Level AA)**
  - [ ] Content works in portrait and landscape
  - [ ] No forced orientation lock (unless essential)

- [ ] **1.3.5 Identify Input Purpose (Level AA)**
  - [ ] Form inputs have clear labels
  - [ ] Purpose is identifiable programmatically
  - [ ] Autocomplete attributes used when appropriate

**Status**: ⏳ Pending

### 1.4 Distinguishable - Users must be able to distinguish content

- [ ] **1.4.1 Use of Color (Level A)**
  - [ ] Color not the only means to convey information
  - [ ] Status/state conveyed by text + color
  - [ ] Error messages use color + text

- [ ] **1.4.2 Audio Control (Level A)**
  - [ ] Audio doesn't autoplay
  - [ ] If autoplay exists, has visible mute button
  - [ ] No audio plays on top of other content

- [ ] **1.4.3 Contrast (Minimum) (Level AA)**
  - [ ] Text has 4.5:1 contrast ratio (normal text)
  - [ ] Large text (≥18pt) has 3:1 contrast ratio
  - [ ] UI components have 3:1 contrast ratio
  - [ ] Focus indicators have 3:1 contrast

  **Verification**:
  - [ ] Check all text colors against background
  - [ ] Check button colors (active/hover states)
  - [ ] Check link colors
  - [ ] Check focus indicators
  - [ ] Use contrast checker tool

- [ ] **1.4.4 Resize Text (Level AA)**
  - [ ] Text can be resized up to 200%
  - [ ] Content doesn't lose functionality at 200%
  - [ ] No horizontal scrolling required at 200%

- [ ] **1.4.5 Images of Text (Level AA)**
  - [ ] Real text used instead of images of text
  - [ ] If images of text used, have alt text equivalent
  - [ ] Text in images is readable at 200% zoom

- [ ] **1.4.10 Reflow (Level AA)**
  - [ ] Content reflows without horizontal scroll
  - [ ] Works at 320px width (mobile)
  - [ ] Works with text zoomed to 200%

- [ ] **1.4.11 Non-text Contrast (Level AA)**
  - [ ] UI components have 3:1 contrast
  - [ ] Graphical elements distinguishable
  - [ ] Focus indicators visible

- [ ] **1.4.12 Text Spacing (Level AA)**
  - [ ] Content readable with adjusted spacing
  - [ ] Line height ≥1.5x font size
  - [ ] Letter spacing ≥0.12x font size
  - [ ] Word spacing ≥0.16x font size
  - [ ] Paragraph spacing ≥2x font size

**Status**: ⏳ Pending

---

## 2. Operable - Users must be able to operate the interface

### 2.1 Keyboard Accessible

- [ ] **2.1.1 Keyboard (Level A)**
  - [ ] All functionality available from keyboard
  - [ ] No keyboard trap (unless intentional)
  - [ ] Focus visible and manageable

  **Test**:
  - [ ] Can navigate with Tab key
  - [ ] Can activate buttons with Enter/Space
  - [ ] Can close dialogs with Escape
  - [ ] Can navigate menus with arrow keys

- [ ] **2.1.2 No Keyboard Trap (Level A)**
  - [ ] No elements that trap focus
  - [ ] Can exit any element with Tab
  - [ ] Escape key closes modals/menus

- [ ] **2.1.4 Character Key Shortcuts (Level A)**
  - [ ] Single-character shortcuts can be disabled
  - [ ] Or remappable
  - [ ] Or only active when in focus

- [ ] **2.1.3 Keyboard (No Exception) (Level AAA - Exceeds AA)**
  - [ ] All functionality available without pointing device
  - [ ] Full keyboard support throughout

**Status**: ⏳ Pending

### 2.2 Enough Time

- [ ] **2.2.1 Timing Adjustable (Level A)**
  - [ ] No strict time limits
  - [ ] If time limit exists:
    - [ ] User can turn it off
    - [ ] User can extend it
    - [ ] User warned before expiration

- [ ] **2.2.2 Pause, Stop, Hide (Level A)**
  - [ ] No auto-updating content without control
  - [ ] If auto-updates, user can pause/stop
  - [ ] Animations can be paused
  - [ ] No blinking content > 3 seconds

**Status**: ⏳ Pending

### 2.3 Seizures and Physical Reactions

- [ ] **2.3.1 Three Flashes or Below Threshold (Level A)**
  - [ ] No content flashes > 3 times/second
  - [ ] No content with flashing red pattern
  - [ ] Animated GIFs reviewed for flashing

**Status**: ⏳ Pending

### 2.4 Navigable

- [ ] **2.4.1 Bypass Blocks (Level A)**
  - [ ] Skip to main content link available
  - [ ] Page has clear structure
  - [ ] Can bypass repetitive navigation

- [ ] **2.4.2 Page Titled (Level A)**
  - [ ] Page has descriptive title
  - [ ] Title identifies page purpose
  - [ ] Title is unique within site

- [ ] **2.4.3 Focus Order (Level A)**
  - [ ] Focus order is logical
  - [ ] Focus order matches visual order
  - [ ] No focus order that confuses

- [ ] **2.4.4 Link Purpose (In Context) (Level A)**
  - [ ] Link text describes purpose
  - [ ] Or aria-label describes purpose
  - [ ] Or surrounding context describes purpose

  **Examples**:
  - ❌ "Click here" (bad)
  - ✅ "View hospital details" (good)
  - ✅ "More about dog vaccination" (good)

- [ ] **2.4.5 Multiple Ways (Level AA)**
  - [ ] Multiple ways to find content
  - [ ] Search functionality available
  - [ ] Site map available
  - [ ] Navigation menu clear

- [ ] **2.4.6 Headings and Labels (Level AA)**
  - [ ] Headings describe content
  - [ ] Labels describe input purpose
  - [ ] Headings and labels are clear

- [ ] **2.4.7 Focus Visible (Level AA)**
  - [ ] Focus indicator visible on all elements
  - [ ] Focus indicator has sufficient contrast
  - [ ] Focus indicator doesn't obscure content

- [ ] **2.4.8 Location (Level AAA - Exceeds AA)**
  - [ ] User location in site is indicated
  - [ ] Breadcrumbs or similar navigation
  - [ ] "You are here" indicators

**Status**: ⏳ Pending

---

## 3. Understandable - Users must be able to understand content

### 3.1 Readable

- [ ] **3.1.1 Language of Page (Level A)**
  - [ ] Page has lang attribute (`<html lang="en">`)
  - [ ] Language is correctly identified

- [ ] **3.1.2 Language of Parts (Level AA)**
  - [ ] Parts in different language marked
  - [ ] Foreign phrases have lang attribute

- [ ] **3.1.3 Unusual Words (Level AAA - Exceeds AA)**
  - [ ] Unusual words explained
  - [ ] Abbreviations explained first use
  - [ ] Pronunciation provided when needed

**Status**: ⏳ Pending

### 3.2 Predictable

- [ ] **3.2.1 On Focus (Level A)**
  - [ ] No unexpected context change on focus
  - [ ] Focusing element doesn't change page
  - [ ] No surprise navigation

- [ ] **3.2.2 On Input (Level A)**
  - [ ] Changing input doesn't change context
  - [ ] Form doesn't auto-submit on input
  - [ ] No unexpected navigation on input

- [ ] **3.2.3 Consistent Navigation (Level AA)**
  - [ ] Navigation is consistent across pages
  - [ ] Menus appear in same location
  - [ ] Navigation has consistent order

- [ ] **3.2.4 Consistent Identification (Level AA)**
  - [ ] Components with same function identified consistently
  - [ ] Icons look the same across site
  - [ ] Button labels consistent
  - [ ] Form field labels consistent

**Status**: ⏳ Pending

### 3.3 Input Assistance

- [ ] **3.3.1 Error Identification (Level A)**
  - [ ] Errors identified clearly
  - [ ] Errors described in text
  - [ ] Error messages helpful

- [ ] **3.3.2 Labels or Instructions (Level A)**
  - [ ] All form inputs have labels
  - [ ] Labels are close to inputs
  - [ ] Instructions provided when needed

- [ ] **3.3.3 Error Suggestion (Level AA)**
  - [ ] Error suggestions provided
  - [ ] Suggestions are helpful
  - [ ] User can correct and resubmit

- [ ] **3.3.4 Error Prevention (Level AA)**
  - [ ] Form checks for errors before submit
  - [ ] Legal/financial transactions have confirmation
  - [ ] Important data can be recovered

**Status**: ⏳ Pending

---

## 4. Robust - Content must be robust enough to be interpreted by various technologies

### 4.1 Compatible

- [ ] **4.1.1 Parsing (Level A)**
  - [ ] Valid HTML (no duplicate IDs)
  - [ ] Proper nesting of elements
  - [ ] All opening tags have closing tags
  - [ ] Attributes don't have duplicate values

- [ ] **4.1.2 Name, Role, Value (Level A)**
  - [ ] All UI components have accessible name
  - [ ] All components have proper role
  - [ ] Value is updated and announced
  - [ ] State is reflected properly

- [ ] **4.1.3 Status Messages (Level AA)**
  - [ ] Status messages are announced to assistive tech
  - [ ] No need for user to refocus
  - [ ] Real-time updates announced

**Status**: ⏳ Pending

---

## Testing Procedures

### Keyboard Navigation Test
```
1. Tab through entire page
2. Verify focus order is logical
3. Verify focus indicator is visible
4. Test Shift+Tab (reverse navigation)
5. Test special keys (Enter, Space, Escape, Arrows)
6. Verify no keyboard traps
```

### Screen Reader Test
```
1. Start NVDA/JAWS
2. Navigate page with arrow keys
3. Check:
   - Page title announced
   - Headings announced
   - Link text clear
   - Form labels announced
   - Images described
   - Buttons labeled
   - Errors announced
```

### Contrast Test
```
1. Use WebAIM contrast checker
2. Test text vs background
3. Test buttons vs background
4. Test focus indicators
5. Test UI components
6. Verify 4.5:1 for normal text
7. Verify 3:1 for large text
```

### Responsive Test
```
1. Test at 320px (mobile)
2. Test at 768px (tablet)
3. Test at 1024px (desktop)
4. Test at 1920px (4K)
5. Verify no horizontal scroll
6. Test with 200% zoom
```

---

## Automated Tools

### Tools to Use
- [ ] **WAVE (WebAIM)**: Browser extension, automated issues
- [ ] **Axe DevTools**: Browser extension, detailed checks
- [ ] **Lighthouse**: Chrome DevTools, accessibility score
- [ ] **NVDA**: Screen reader for testing
- [ ] **WebAIM Contrast Checker**: Color contrast verification

### Running Axe in Tests
```bash
pnpm exec playwright test 02-accessibility.spec.ts
```

---

## Accessibility Score Tracking

| Category | Target | Baseline | Current | Trend |
|----------|--------|----------|---------|-------|
| Keyboard Navigation | 100% | ⏳ | ⏳ | → |
| ARIA Labels | 100% | ⏳ | ⏳ | → |
| Color Contrast | 100% | ⏳ | ⏳ | → |
| Alt Text | 100% | ⏳ | ⏳ | → |
| Form Labels | 100% | ⏳ | ⏳ | → |
| **Overall WCAG 2.1 AA** | **100%** | **⏳** | **⏳** | **→** |

---

## Issues Found

### Critical Issues (Blocks Release)
🚨 None yet - Testing pending

### High Priority (Should Fix)
⚠️ Pending test execution

### Medium Priority (Nice to Have)
📌 Pending test execution

---

## Sign-Off

- [ ] All checklist items reviewed
- [ ] All tests executed
- [ ] Issues documented and prioritized
- [ ] Fixes implemented and verified
- [ ] WCAG 2.1 AA compliance verified

**Auditor**: qa-specialist
**Date**: ⏳ Pending
**Status**: ⏳ In Progress
**Next Review**: Upon task completion

---

## References

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM](https://webaim.org)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [Deque University](https://dequeuniversity.com/)
