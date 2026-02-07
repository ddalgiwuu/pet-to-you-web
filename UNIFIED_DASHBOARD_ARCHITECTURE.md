# 🎨 Pet-to-You Unified Dashboard Architecture

**Version**: 1.0.0
**Created**: February 8, 2026
**Status**: Architecture Design Complete ✅

---

## 📋 Executive Summary

This document defines the architecture for a **single unified dashboard** that serves both hospital and business users through role-based dynamic UI. The design incorporates 2026's latest UI trends including glassmorphism, smooth gradients, micro-interactions, and OKLCH color space.

### Key Objectives
- ✅ Merge hospital & business dashboards into ONE Next.js app
- ✅ Role-based dynamic UI with intelligent routing
- ✅ 2026 trendy design with glassmorphism & gradients
- ✅ 60fps smooth animations with Framer Motion
- ✅ Modern tech stack (Next.js 16, React 19, Tailwind v4)
- ✅ Mobile-first responsive design

---

## 🏗️ System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                   Unified Dashboard App                      │
│                    (Next.js 16 + React 19)                  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ├─► Auth System (NextAuth 5)
                            │   └─► Role Detection (HOSPITAL | BUSINESS)
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
    HOSPITAL                                BUSINESS
    USER FLOW                               USER FLOW
        │                                       │
        ├─► Hospital Layout                    ├─► Business Layout
        ├─► Hospital Sidebar                   ├─► Business Sidebar
        ├─► Hospital Routes                    ├─► Business Routes
        └─► Hospital Components                └─► Business Components
                            │
        ┌───────────────────┴───────────────────┐
        │           Shared Components            │
        ├─► Dashboard Home (role-aware)         │
        ├─► Calendar/Schedule (unified)         │
        ├─► Revenue Analytics (unified)         │
        ├─► Reviews Management (unified)        │
        ├─► Settings (role-specific)            │
        └─► UI Library (@pet-to-you/ui)        │
        └─────────────────────────────────────────┘
```

---

## 🎨 2026 UI Design Trends

### Research Insights

Based on comprehensive research of [2026 UI trends](https://www.bookmarkify.io/blog/inspiration-ui-design), the design incorporates:

#### 1. Glassmorphism (透明カード効果)

**Definition**: Frosted-glass effect using transparency, blurring, and subtle layering inspired by [Apple's Liquid Glass design system](https://www.designstudiouiux.com/blog/what-is-glassmorphism-ui-trend/).

**Key Characteristics**:
- Frosted glass transparency effects
- Background blur (backdrop-filter)
- Subtle borders on translucent elements
- Multi-layered interface with depth
- Light refraction and reflection effects

**CSS Implementation**:
```css
.glass-card {
  background: oklch(from white l c h / 0.1);
  backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid oklch(from white l c h / 0.2);
  box-shadow: 0 8px 32px oklch(0 0 0 / 0.1);
}
```

**Best Practices**:
- ✅ Place glass elements over vivid gradients or layered illustrations
- ✅ Ensure sufficient contrast for text readability (WCAG AA minimum)
- ⚠️ Optimize blur effects for less powerful devices
- ⚠️ Test accessibility with transparency

#### 2. Modern Gradients

Based on [gradient evolution in 2026](https://medium.com/@alekswebnet/defining-colors-in-modern-css-why-its-time-to-switch-to-oklch-c6b972d98520), modern gradients are:
- Subtle, sophisticated, and purposeful
- Add depth without overwhelming content
- Support wide-gamut displays (P3 color space)

**Gradient Strategies**:
```css
/* Smooth OKLCH gradients with perceptual uniformity */
.gradient-bg {
  background: linear-gradient(
    135deg,
    oklch(0.75 0.15 250) 0%,
    oklch(0.65 0.20 280) 50%,
    oklch(0.55 0.18 310) 100%
  );
}

/* Multi-stop vibrant gradient */
.vibrant-gradient {
  background: linear-gradient(
    to bottom right,
    oklch(0.80 0.25 340),
    oklch(0.70 0.20 280),
    oklch(0.60 0.22 240)
  );
}
```

#### 3. OKLCH Color Space

**Why OKLCH in 2026?** ([OKLCH advantages](https://oklch.org/))

- ✅ **Perceptual Uniformity**: Equal value changes = equal visual differences
- ✅ **Wide Gamut Support**: Access full P3 range (35% more colors than sRGB)
- ✅ **Browser Support**: 93% compatibility across major browsers
- ✅ **Better Color Systems**: Single hue variable for instant theme variants

**OKLCH Format**: `oklch(L C H / A)`
- **L** (Lightness): 0-1 (0 = black, 1 = white)
- **C** (Chroma): 0-0.4+ (color intensity)
- **H** (Hue): 0-360 (color wheel angle)
- **A** (Alpha): 0-1 (transparency)

**Color Palette Strategy**:
```css
/* Base theme colors using OKLCH */
:root {
  --primary: oklch(0.65 0.22 250);    /* Blue */
  --secondary: oklch(0.70 0.18 180);  /* Teal */
  --accent: oklch(0.75 0.20 340);     /* Pink */
  --success: oklch(0.70 0.20 140);    /* Green */
  --warning: oklch(0.75 0.20 80);     /* Yellow */
  --danger: oklch(0.65 0.25 25);      /* Red */

  /* Glass effect backgrounds */
  --glass-bg: oklch(from white l c h / 0.1);
  --glass-border: oklch(from white l c h / 0.2);
}

/* Dark mode variants */
@media (prefers-color-scheme: dark) {
  :root {
    --primary: oklch(0.70 0.20 250);
    --glass-bg: oklch(from black l c h / 0.3);
  }
}
```

#### 4. Framer Motion Micro-Interactions

Based on [Framer Motion best practices](https://medium.com/@sofia_marques/i-built-animations-with-framer-motion-and-im-not-going-back-72e1756d20f5):

**Animation Timing Guidelines**:
- **150-250ms**: Micro UI changes (buttons, toggles)
- **250-400ms**: Large context switches (page transitions)
- **300-500ms**: Intro animations only

**Performance Best Practices**:
- ✅ Use `transform` and `opacity` (hardware-accelerated)
- ✅ Leverage `layout` prop for smooth layout animations
- ✅ Lazy load animations with `useInView`
- ⚠️ Avoid animating `width`, `height`, `top`, `left` (unless using FLIP)
- ⚠️ Honor `prefers-reduced-motion`

**Atomic Animation Technique**:
```tsx
// Break animations into smallest meaningful units
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' }
  }
};

const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delay: 0.1, duration: 0.2 }
  }
};
```

---

## 🏛️ Application Structure

### Directory Structure

```
apps/unified-dashboard/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── error/
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx              # Role-aware layout wrapper
│   │   │   ├── page.tsx                # Unified dashboard home
│   │   │   ├── hospital/
│   │   │   │   ├── appointments/
│   │   │   │   ├── patients/
│   │   │   │   └── medical-records/
│   │   │   └── business/
│   │   │       ├── bookings/
│   │   │       ├── customers/
│   │   │       └── services/
│   │   ├── shared/
│   │   │   ├── calendar/               # Unified schedule
│   │   │   ├── revenue/                # Unified analytics
│   │   │   ├── reviews/                # Unified reviews
│   │   │   └── settings/               # Role-specific settings
│   │   ├── layout.tsx                  # Root layout
│   │   └── providers.tsx               # Global providers
│   ├── components/
│   │   ├── layouts/
│   │   │   ├── HospitalLayout.tsx      # Hospital-specific layout
│   │   │   ├── BusinessLayout.tsx      # Business-specific layout
│   │   │   └── SharedLayout.tsx        # Common layout elements
│   │   ├── navigation/
│   │   │   ├── HospitalSidebar.tsx     # Hospital navigation
│   │   │   ├── BusinessSidebar.tsx     # Business navigation
│   │   │   └── UnifiedHeader.tsx       # Shared header
│   │   ├── dashboard/
│   │   │   ├── HospitalDashboard.tsx   # Hospital dashboard view
│   │   │   ├── BusinessDashboard.tsx   # Business dashboard view
│   │   │   └── SharedWidgets/          # Common dashboard widgets
│   │   └── ui/                         # Glass UI components
│   ├── lib/
│   │   ├── auth/
│   │   │   ├── config.ts               # NextAuth config
│   │   │   └── role-guard.ts           # Role-based access control
│   │   ├── theme/
│   │   │   ├── colors.ts               # OKLCH color system
│   │   │   └── animations.ts           # Framer Motion presets
│   │   └── utils/
│   │       └── role-router.ts          # Dynamic routing logic
│   └── styles/
│       ├── globals.css                 # Global styles + OKLCH vars
│       └── glassmorphism.css           # Glass effect utilities
├── public/
│   └── assets/
├── tailwind.config.ts                  # Tailwind v4 config
├── postcss.config.js
├── next.config.js
└── package.json
```

---

## 🔐 Role-Based Architecture

### User Roles & Access

```typescript
// types/auth.ts
export type UserRole = 'HOSPITAL' | 'BUSINESS';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  hospitalId?: string;  // For HOSPITAL users
  businessId?: string;  // For BUSINESS users
}
```

### Role Detection Flow

```typescript
// lib/auth/role-guard.ts
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export async function requireRole(allowedRoles: UserRole[]) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect('/login');
  }

  if (!allowedRoles.includes(session.user.role)) {
    redirect('/unauthorized');
  }

  return session.user;
}

// Usage in server components
const user = await requireRole(['HOSPITAL']);
```

### Dynamic Routing Strategy

```typescript
// lib/utils/role-router.ts
export const ROLE_ROUTES = {
  HOSPITAL: {
    home: '/dashboard',
    appointments: '/hospital/appointments',
    patients: '/hospital/patients',
    medicalRecords: '/hospital/medical-records',
    revenue: '/shared/revenue',
    reviews: '/shared/reviews',
    settings: '/shared/settings',
  },
  BUSINESS: {
    home: '/dashboard',
    bookings: '/business/bookings',
    customers: '/business/customers',
    services: '/business/services',
    revenue: '/shared/revenue',
    reviews: '/shared/reviews',
    settings: '/shared/settings',
  },
} as const;

export function getRouteForRole(role: UserRole, routeKey: string) {
  return ROLE_ROUTES[role][routeKey];
}
```

---

## 🎨 Component Wireframes (Text-Based)

### 1. Unified Dashboard Home (Role-Aware)

```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo]  Pet-to-You Dashboard          [🔔] [👤] [User Menu]   │ Glass Header
└─────────────────────────────────────────────────────────────────┘
┌────┬────────────────────────────────────────────────────────────┐
│    │  📊 Dashboard Overview                     [This Week ▼]   │
│ 🏥 │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     │
│ 📅 │  │ Glass Card   │ │ Glass Card   │ │ Glass Card   │     │ Glass Cards
│ 💰 │  │ Today's Apps │ │ New Patients │ │ Revenue      │     │ with Stats
│ ⭐ │  │    24 📈     │ │     12 📈    │ │  $5,400 📈  │     │
│ ⚙️ │  └──────────────┘ └──────────────┘ └──────────────┘     │
│    │                                                            │
│    │  📈 Revenue Trends (Last 7 Days)                         │
│    │  ┌────────────────────────────────────────────────────┐  │ Glass Chart
│    │  │ [Smooth gradient area chart with glassmorphism]    │  │ Container
│    │  │ [Interactive tooltips on hover]                    │  │
│    │  └────────────────────────────────────────────────────┘  │
│    │                                                            │
│    │  📋 Recent Activity                                       │
│    │  ┌────────────────────────────────────────────────────┐  │ Glass Table
│    │  │ [Patient Name] | [Service] | [Status] | [Time]     │  │ with hover
│    │  │ [Smooth row hover effects with micro-animations]   │  │ effects
│    │  └────────────────────────────────────────────────────┘  │
└────┴────────────────────────────────────────────────────────────┘
 Sidebar (role-based menus with smooth transitions)
```

### 2. Hospital Sidebar (Glassmorphism)

```
┌────────────────┐
│                │ Glass Sidebar
│  🏥 Hospital   │ with backdrop blur
│  Dashboard     │
│                │
│  📊 Dashboard  │ ← Active (gradient bg)
│  📅 Appts      │
│  👥 Patients   │
│  📋 Records    │
│  💰 Revenue    │
│  ⭐ Reviews    │
│  ⚙️ Settings   │
│                │
│  [Dark Mode 🌙]│ Theme toggle
└────────────────┘
```

### 3. Business Sidebar (Glassmorphism)

```
┌────────────────┐
│                │ Glass Sidebar
│  🏪 Business   │ with backdrop blur
│  Dashboard     │
│                │
│  📊 Dashboard  │ ← Active (gradient bg)
│  📅 Bookings   │
│  👥 Customers  │
│  🛠️ Services   │
│  💰 Revenue    │
│  ⭐ Reviews    │
│  ⚙️ Settings   │
│                │
│  [Dark Mode 🌙]│ Theme toggle
└────────────────┘
```

### 4. Glass Card Component (Reusable)

```
┌────────────────────────────────────┐
│  [Icon] Title          [Action ⋮] │ Glass Header
│  ────────────────────────────────  │
│                                    │ Frosted background
│  Primary Metric: 1,234            │ with gradient overlay
│  Secondary Info: +12% ↗           │
│                                    │
│  [Mini Chart/Visual Element]      │ Smooth animations
│                                    │ on hover/interaction
└────────────────────────────────────┘
  Subtle border + shadow + backdrop-blur
```

---

## 🎨 Design System Specifications

### Color System (OKLCH-Based)

```typescript
// lib/theme/colors.ts
export const colors = {
  // Primary palette (Hospital theme)
  hospital: {
    primary: 'oklch(0.65 0.22 250)',      // Medical blue
    secondary: 'oklch(0.70 0.18 180)',    // Teal
    accent: 'oklch(0.75 0.20 340)',       // Pink accent
  },

  // Primary palette (Business theme)
  business: {
    primary: 'oklch(0.60 0.25 280)',      // Purple
    secondary: 'oklch(0.65 0.20 210)',    // Blue
    accent: 'oklch(0.70 0.22 160)',       // Cyan accent
  },

  // Semantic colors (shared)
  semantic: {
    success: 'oklch(0.70 0.20 140)',      // Green
    warning: 'oklch(0.75 0.20 80)',       // Yellow
    danger: 'oklch(0.65 0.25 25)',        // Red
    info: 'oklch(0.70 0.18 240)',         // Blue
  },

  // Glass effect colors
  glass: {
    light: {
      background: 'oklch(from white l c h / 0.1)',
      border: 'oklch(from white l c h / 0.2)',
      shadow: 'oklch(0 0 0 / 0.1)',
    },
    dark: {
      background: 'oklch(from black l c h / 0.3)',
      border: 'oklch(from white l c h / 0.1)',
      shadow: 'oklch(0 0 0 / 0.3)',
    },
  },

  // Gradient backgrounds
  gradients: {
    hospital: 'linear-gradient(135deg, oklch(0.75 0.15 250), oklch(0.65 0.20 280))',
    business: 'linear-gradient(135deg, oklch(0.70 0.20 280), oklch(0.60 0.25 240))',
    vibrant: 'linear-gradient(to bottom right, oklch(0.80 0.25 340), oklch(0.70 0.20 280), oklch(0.60 0.22 240))',
  },
} as const;
```

### Typography Scale

```css
/* globals.css */
:root {
  /* Font families */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'Fira Code', monospace;

  /* Type scale (fluid typography) */
  --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --text-sm: clamp(0.875rem, 0.825rem + 0.25vw, 1rem);
  --text-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  --text-lg: clamp(1.125rem, 1.05rem + 0.375vw, 1.25rem);
  --text-xl: clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem);
  --text-2xl: clamp(1.5rem, 1.35rem + 0.75vw, 2rem);
  --text-3xl: clamp(1.875rem, 1.65rem + 1.125vw, 2.5rem);
  --text-4xl: clamp(2.25rem, 1.95rem + 1.5vw, 3rem);

  /* Line heights */
  --leading-tight: 1.2;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;

  /* Letter spacing */
  --tracking-tighter: -0.05em;
  --tracking-tight: -0.025em;
  --tracking-normal: 0;
  --tracking-wide: 0.025em;
  --tracking-wider: 0.05em;
}
```

### Spacing System

```typescript
// Tailwind config spacing scale
export const spacing = {
  0: '0',
  1: '0.25rem',    // 4px
  2: '0.5rem',     // 8px
  3: '0.75rem',    // 12px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  8: '2rem',       // 32px
  10: '2.5rem',    // 40px
  12: '3rem',      // 48px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
  32: '8rem',      // 128px
};
```

### Glassmorphism Utilities

```css
/* styles/glassmorphism.css */

/* Base glass effect */
.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid var(--glass-border);
  box-shadow: 0 8px 32px var(--glass-shadow);
}

/* Glass card with hover effect */
.glass-card {
  @apply glass rounded-2xl p-6;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-card:hover {
  backdrop-filter: blur(16px) saturate(200%);
  box-shadow: 0 12px 48px var(--glass-shadow);
  transform: translateY(-2px);
}

/* Glass with gradient overlay */
.glass-gradient {
  @apply glass;
  position: relative;
}

.glass-gradient::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(
    135deg,
    oklch(from white l c h / 0.1),
    oklch(from black l c h / 0.05)
  );
  pointer-events: none;
}

/* Glass sidebar */
.glass-sidebar {
  @apply glass;
  backdrop-filter: blur(20px) saturate(200%);
}

/* Glass header */
.glass-header {
  @apply glass;
  backdrop-filter: blur(8px) saturate(150%);
  border-bottom: 1px solid var(--glass-border);
}
```

---

## ⚡ Animation Strategy (Framer Motion)

### Animation Presets

```typescript
// lib/theme/animations.ts
import { Variants } from 'framer-motion';

// Page transition variants
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2, ease: 'easeIn' }
  },
};

// Card entrance animation
export const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  },
};

// Staggered children animation
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Sidebar navigation item
export const navItemVariants: Variants = {
  rest: { scale: 1, x: 0 },
  hover: {
    scale: 1.05,
    x: 4,
    transition: { duration: 0.2 }
  },
  tap: { scale: 0.98 },
};

// Glass card hover effect
export const glassHoverVariants: Variants = {
  rest: {
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
  },
  hover: {
    scale: 1.02,
    y: -4,
    filter: 'blur(0px)',
    transition: { duration: 0.3, ease: 'easeOut' }
  },
};

// Loading skeleton pulse
export const pulseVariants: Variants = {
  initial: { opacity: 0.6 },
  animate: {
    opacity: 1,
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: 'reverse',
    },
  },
};

// Toast notification slide-in
export const toastVariants: Variants = {
  initial: { opacity: 0, x: 100, scale: 0.8 },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
  },
  exit: {
    opacity: 0,
    x: 100,
    scale: 0.8,
    transition: { duration: 0.2, ease: 'easeIn' }
  },
};

// Accessibility: Respect prefers-reduced-motion
export const reduceMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};
```

### Animation Usage Examples

```tsx
// Page component with animations
'use client';

import { motion } from 'framer-motion';
import { pageVariants, cardVariants, staggerContainer } from '@/lib/theme/animations';

export default function DashboardPage() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.id}
            variants={cardVariants}
            className="glass-card"
          >
            {/* Card content */}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
```

---

## 🧩 Component Specifications

### 1. UnifiedDashboardLayout Component

```tsx
// components/layouts/UnifiedDashboardLayout.tsx
'use client';

import { useSession } from 'next-auth/react';
import { HospitalSidebar } from '@/components/navigation/HospitalSidebar';
import { BusinessSidebar } from '@/components/navigation/BusinessSidebar';
import { UnifiedHeader } from '@/components/navigation/UnifiedHeader';
import { motion } from 'framer-motion';
import { pageVariants } from '@/lib/theme/animations';

export function UnifiedDashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  const Sidebar = userRole === 'HOSPITAL' ? HospitalSidebar : BusinessSidebar;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[oklch(0.95_0.02_250)] to-[oklch(0.90_0.03_280)]">
      {/* Glass Header */}
      <UnifiedHeader />

      <div className="flex">
        {/* Glass Sidebar (role-based) */}
        <Sidebar />

        {/* Main Content */}
        <motion.main
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex-1 p-8"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
```

### 2. GlassCard Component

```tsx
// components/ui/GlassCard.tsx
'use client';

import { motion } from 'framer-motion';
import { glassHoverVariants } from '@/lib/theme/animations';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  gradient?: boolean;
}

export function GlassCard({
  children,
  className,
  hoverable = true,
  gradient = false
}: GlassCardProps) {
  const Component = hoverable ? motion.div : 'div';

  return (
    <Component
      variants={hoverable ? glassHoverVariants : undefined}
      initial="rest"
      whileHover="hover"
      className={cn(
        'glass-card',
        gradient && 'glass-gradient',
        className
      )}
    >
      {children}
    </Component>
  );
}
```

### 3. RoleBasedSidebar Component

```tsx
// components/navigation/HospitalSidebar.tsx
'use client';

import { motion } from 'framer-motion';
import { navItemVariants } from '@/lib/theme/animations';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  DollarSign,
  Star,
  Settings
} from 'lucide-react';

const hospitalMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Calendar, label: 'Appointments', href: '/hospital/appointments' },
  { icon: Users, label: 'Patients', href: '/hospital/patients' },
  { icon: FileText, label: 'Medical Records', href: '/hospital/medical-records' },
  { icon: DollarSign, label: 'Revenue', href: '/shared/revenue' },
  { icon: Star, label: 'Reviews', href: '/shared/reviews' },
  { icon: Settings, label: 'Settings', href: '/shared/settings' },
];

export function HospitalSidebar() {
  const pathname = usePathname();

  return (
    <aside className="glass-sidebar w-64 h-screen sticky top-0 p-6">
      <div className="mb-8">
        <h1 className="text-xl font-bold bg-gradient-to-r from-[oklch(0.65_0.22_250)] to-[oklch(0.70_0.18_180)] bg-clip-text text-transparent">
          🏥 Hospital Dashboard
        </h1>
      </div>

      <nav className="space-y-2">
        {hospitalMenuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <motion.div
              key={item.href}
              variants={navItemVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
            >
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-[oklch(0.65_0.22_250)] to-[oklch(0.70_0.18_180)] text-white shadow-lg'
                    : 'text-gray-700 hover:bg-white/30'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </aside>
  );
}
```

### 4. StatCard Component (with Glassmorphism)

```tsx
// components/dashboard/StatCard.tsx
'use client';

import { motion } from 'framer-motion';
import { cardVariants } from '@/lib/theme/animations';
import { LucideIcon } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down';
}

export function StatCard({ icon: Icon, title, value, change, trend }: StatCardProps) {
  return (
    <motion.div variants={cardVariants}>
      <GlassCard gradient>
        <div className="flex items-start justify-between">
          <div className="p-3 bg-gradient-to-br from-[oklch(0.65_0.22_250)] to-[oklch(0.70_0.18_180)] rounded-xl">
            <Icon className="w-6 h-6 text-white" />
          </div>

          <div className={cn(
            'text-sm font-semibold',
            trend === 'up' ? 'text-green-500' : 'text-red-500'
          )}>
            {change}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
      </GlassCard>
    </motion.div>
  );
}
```

---

## 🛣️ Routing Strategy

### Route Structure

```
/
├── (auth)/
│   ├── login
│   └── error
├── (dashboard)/                 # Protected routes
│   ├── page                     # Unified dashboard home (role-aware)
│   ├── hospital/               # Hospital-specific routes
│   │   ├── appointments
│   │   ├── patients
│   │   └── medical-records
│   ├── business/               # Business-specific routes
│   │   ├── bookings
│   │   ├── customers
│   │   └── services
│   └── shared/                 # Shared routes
│       ├── calendar
│       ├── revenue
│       ├── reviews
│       └── settings
└── api/
    └── auth/
        └── [...nextauth]
```

### Middleware for Role-Based Access

```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Hospital-only routes
    if (path.startsWith('/hospital/') && token?.role !== 'HOSPITAL') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    // Business-only routes
    if (path.startsWith('/business/') && token?.role !== 'BUSINESS') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/hospital/:path*', '/business/:path*', '/shared/:path*'],
};
```

---

## 📱 Responsive Design Strategy

### Breakpoint System

```typescript
// Tailwind config breakpoints
export const screens = {
  'sm': '640px',   // Mobile landscape
  'md': '768px',   // Tablet
  'lg': '1024px',  // Desktop
  'xl': '1280px',  // Large desktop
  '2xl': '1536px', // Extra large desktop
};
```

### Mobile-First Approach

```tsx
// Example: Responsive Sidebar
export function ResponsiveSidebar() {
  return (
    <>
      {/* Mobile: Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass-header lg:hidden">
        {/* Mobile nav items */}
      </nav>

      {/* Desktop: Side navigation */}
      <aside className="hidden lg:block glass-sidebar w-64">
        {/* Desktop nav items */}
      </aside>
    </>
  );
}
```

### Responsive Glass Effects

```css
/* Optimize glass blur for mobile performance */
@media (max-width: 768px) {
  .glass {
    backdrop-filter: blur(8px) saturate(150%);
  }

  .glass-sidebar {
    backdrop-filter: blur(12px) saturate(180%);
  }
}

@media (min-width: 769px) {
  .glass {
    backdrop-filter: blur(12px) saturate(180%);
  }

  .glass-sidebar {
    backdrop-filter: blur(20px) saturate(200%);
  }
}
```

---

## 🎯 Tech Stack

### Core Technologies

```json
{
  "framework": "Next.js 16",
  "runtime": "React 19",
  "language": "TypeScript 5.9",
  "styling": "Tailwind CSS v4",
  "animations": "Framer Motion 12",
  "ui-components": "shadcn/ui + Radix UI",
  "auth": "NextAuth 5",
  "state": "Zustand 5",
  "data-fetching": "TanStack Query 5",
  "charts": "Recharts 3",
  "icons": "Lucide React",
  "forms": "React Hook Form + Zod",
  "notifications": "Sonner"
}
```

### Package.json

```json
{
  "name": "unified-dashboard",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@pet-to-you/ui": "workspace:*",
    "@tanstack/react-query": "^5.90.18",
    "axios": "^1.13.2",
    "framer-motion": "^12.26.2",
    "lucide-react": "^0.562.0",
    "next": "^16.1.3",
    "next-auth": "5.0.0-beta.30",
    "react": "^19.2.3",
    "react-dom": "^19.2.3",
    "recharts": "^3.6.0",
    "zod": "^3.25.76",
    "zustand": "^5.0.10"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.1.18",
    "@types/node": "^22.10.5",
    "@types/react": "^19.2.8",
    "@types/react-dom": "^19.2.3",
    "autoprefixer": "^10.4.23",
    "postcss": "^8.5.6",
    "tailwindcss": "^4.1.18",
    "typescript": "^5.9.3"
  }
}
```

---

## 🔄 Migration Strategy

### Phase 1: Setup Unified App (Week 1)

**Tasks**:
- ✅ Create `/apps/unified-dashboard` directory
- ✅ Set up Next.js 16 + React 19 + Tailwind v4
- ✅ Configure NextAuth with role-based auth
- ✅ Implement OKLCH color system
- ✅ Set up glassmorphism utilities
- ✅ Configure Framer Motion presets

### Phase 2: Core Components (Week 2)

**Tasks**:
- ✅ Build UnifiedDashboardLayout
- ✅ Implement HospitalSidebar & BusinessSidebar
- ✅ Create GlassCard component library
- ✅ Build UnifiedHeader component
- ✅ Set up role-based routing middleware

### Phase 3: Dashboard Views (Week 3)

**Tasks**:
- ✅ Migrate Hospital Dashboard view
- ✅ Migrate Business Dashboard view
- ✅ Implement shared dashboard widgets
- ✅ Add smooth animations and transitions
- ✅ Test role-based access control

### Phase 4: Feature Pages (Week 4-5)

**Tasks**:
- ✅ Migrate hospital-specific pages
- ✅ Migrate business-specific pages
- ✅ Implement shared pages (revenue, reviews, settings)
- ✅ Add micro-interactions and polish
- ✅ Performance optimization

### Phase 5: Testing & Launch (Week 6)

**Tasks**:
- ✅ E2E testing with Playwright
- ✅ Accessibility audit (WCAG AA)
- ✅ Performance testing (Core Web Vitals)
- ✅ Mobile responsiveness testing
- ✅ Production deployment

---

## ✅ Quality Gates

### Performance Targets

- ✅ **LCP** (Largest Contentful Paint): < 2.5s
- ✅ **FID** (First Input Delay): < 100ms
- ✅ **CLS** (Cumulative Layout Shift): < 0.1
- ✅ **FCP** (First Contentful Paint): < 1.8s
- ✅ **60fps** smooth animations on all interactions

### Accessibility Standards

- ✅ WCAG 2.1 AA compliance (minimum)
- ✅ Keyboard navigation support
- ✅ Screen reader compatibility
- ✅ Color contrast ratio: 4.5:1 (text), 3:1 (UI components)
- ✅ `prefers-reduced-motion` support

### Browser Compatibility

- ✅ Chrome 120+
- ✅ Firefox 121+
- ✅ Safari 17+
- ✅ Edge 120+
- ⚠️ OKLCH fallbacks for older browsers

### Mobile Support

- ✅ iOS Safari 17+
- ✅ Chrome Mobile 120+
- ✅ Samsung Internet 23+
- ✅ Touch-optimized UI (44px minimum tap targets)
- ✅ Optimized glass blur for mobile performance

---

## 📚 Resources & References

### 2026 UI Trends
- [UI Trends: Glassmorphism Overview](https://www.cccreative.design/blogs/differences-in-ui-design-trends-neumorphism-glassmorphism-and-neubrutalism)
- [Top UI Design Trends & Inspiration for 2026](https://www.bookmarkify.io/blog/inspiration-ui-design)
- [What is Glassmorphism? UI Design Trend 2026](https://www.designstudiouiux.com/blog/what-is-glassmorphism-ui-trend/)

### OKLCH Color Space
- [OKLCH in CSS: Why We Moved from RGB and HSL](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl)
- [OKLCH Color Picker](https://oklch.org/)
- [OKLCH: The Modern CSS Color Space](https://medium.com/@alexdev82/oklch-the-modern-css-color-space-you-should-be-using-in-2025-52dd1a4aa9d0)

### Framer Motion
- [Mastering Framer Motion](https://medium.com/@pareekpnt/mastering-framer-motion-a-deep-dive-into-modern-animation-for-react-0e71d86ffdf6)
- [Best Practices with Framer Motion](https://www.ruixen.com/blog/react-anim-framer-spring)
- [Micro Animations in React](https://jcofman.de/blog/micro-animations)

### Technical Documentation
- [Next.js 16 Documentation](https://nextjs.org/docs)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://motion.dev)
- [shadcn/ui Components](https://ui.shadcn.com)

---

## 🎉 Conclusion

This architecture provides a **comprehensive blueprint** for building a modern, unified dashboard that serves both hospital and business users through intelligent role-based routing and 2026's latest UI design trends.

**Key Highlights**:
- ✅ Single codebase with role-based dynamic UI
- ✅ Glassmorphism + OKLCH colors + smooth animations
- ✅ 60fps performance with Framer Motion
- ✅ Mobile-first responsive design
- ✅ Production-ready tech stack (Next.js 16 + React 19)

**Next Steps**: Task #2 (Implement trendy UI components) & Task #3 (Build unified dashboard)

---

**Document Version**: 1.0.0
**Last Updated**: February 8, 2026
**Author**: UI/UX Architect
**Status**: ✅ Architecture Complete
