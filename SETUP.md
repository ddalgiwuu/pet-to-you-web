# Setup Guide - Pet to You Dashboards

## ✅ What's Been Created

### Project Structure
```
pet-to-you-web/
├── apps/
│   ├── hospital-dashboard/        # Hospital Dashboard (Port 3000)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (dashboard)/
│   │   │   │   │   ├── page.tsx             # Overview
│   │   │   │   │   ├── bookings/page.tsx   # Booking management
│   │   │   │   │   ├── patients/page.tsx   # Patient management
│   │   │   │   │   └── reviews/page.tsx    # Review management
│   │   │   │   └── layout.tsx
│   │   │   ├── components/
│   │   │   │   ├── dashboard/              # Sidebar, Header, StatsCard, BookingTable
│   │   │   │   └── charts/                 # RevenueChart
│   │   │   └── lib/
│   │   │       ├── types.ts                # TypeScript interfaces
│   │   │       └── mock-data.ts            # Mock data
│   │   └── package.json
│   │
│   └── admin-dashboard/           # Admin Dashboard (Port 3001)
│       ├── src/
│       │   ├── app/
│       │   │   ├── (dashboard)/
│       │   │   │   └── page.tsx            # Platform overview
│       │   │   └── layout.tsx
│       │   └── components/
│       │       └── Sidebar.tsx
│       └── package.json
│
└── packages/
    └── ui/                        # Shared UI Components
        ├── src/
        │   ├── Button.tsx         ✅ Created
        │   ├── Card.tsx           ✅ Created
        │   ├── DataTable.tsx      ✅ Created
        │   ├── Badge.tsx          ✅ Created
        │   ├── Input.tsx          ✅ Created
        │   ├── lib/utils.ts       ✅ Created
        │   └── index.ts           ✅ Created
        └── package.json
```

### Completed Features

#### Hospital Dashboard ✅
- ✅ Dashboard layout with Sidebar + Header
- ✅ Overview page with animated stats cards
- ✅ Revenue chart (Recharts with animations)
- ✅ Bookings table with status badges
- ✅ Bookings management page
- ✅ Patients management page
- ✅ Reviews page with rating system
- ✅ Mock data for testing

#### Admin Dashboard ✅
- ✅ Admin layout with purple theme
- ✅ Platform overview with metrics
- ✅ Revenue and user growth charts
- ✅ Animated stats cards
- ✅ Sidebar navigation
- ✅ Header with search

#### Shared UI Package ✅
- ✅ Button component (6 variants)
- ✅ Card component (with hover animations)
- ✅ DataTable component (animated rows)
- ✅ Badge component (status indicators)
- ✅ Input component
- ✅ Utility functions (cn, formatCurrency, formatDate)

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Run Development Servers
```bash
# Run both dashboards
pnpm dev

# Or run individually
pnpm dev:hospital  # http://localhost:3000
pnpm dev:admin     # http://localhost:3001
```

### 3. Open Browsers
- **Hospital Dashboard**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3001

## 📋 Next Steps

### Immediate Tasks

1. **Complete Missing Pages** (Hospital Dashboard)
   - `/schedule` - Operating hours management
   - `/revenue` - Detailed financial analytics
   - `/settings` - Hospital profile settings

2. **Complete Missing Pages** (Admin Dashboard)
   - `/users` - User management table
   - `/hospitals` - Hospital verification
   - `/analytics` - Detailed analytics
   - `/compliance` - Audit logs
   - `/security` - Security monitoring

3. **Add More Charts**
   - Booking trends (Line chart)
   - Pet type distribution (Pie chart)
   - Service popularity (Bar chart)
   - Rating breakdown (Bar chart)

4. **Authentication**
   - Create login page
   - Add protected routes
   - Session management

### Enhancement Ideas

1. **Real-time Features**
   - WebSocket integration
   - Live booking updates
   - Notification system

2. **Advanced UI**
   - Dark mode toggle
   - Mobile responsive sidebar
   - Loading skeletons
   - Empty states

3. **Data Integration**
   - Replace mock data with API
   - Add React Query for data fetching
   - Error boundary components

4. **Testing**
   - Unit tests for components
   - E2E tests with Playwright
   - Storybook for UI components

## 🎨 Design System

### Colors
```tsx
// Hospital Dashboard (Blue)
bg-blue-600, text-blue-600
from-blue-600 to-cyan-600

// Admin Dashboard (Purple)
bg-purple-600, text-purple-600
from-purple-600 to-pink-600

// Status Colors
success: green-600
warning: yellow-600
error: red-600
```

### Typography
```tsx
// Headings
text-3xl font-bold  // Page titles
text-xl font-bold   // Logo
text-lg font-semibold  // Card titles

// Body
text-sm font-medium  // Nav items
text-xs text-gray-500  // Helper text
```

### Spacing
```tsx
// Layouts
p-8   // Main content padding
p-6   // Card padding
p-4   // Nav items padding
gap-6 // Grid gaps
```

## 🔧 Configuration Files

### TypeScript Config
- Strict mode enabled
- Path aliases configured (`@/*`, `@pet-to-you/ui`)
- Next.js plugin included

### Tailwind Config
- Shared UI components included in content
- Custom animations (fade-in, slide-up, scale-in)
- Extended color palette

### Next.js Config
- React strict mode enabled
- Transpiles shared UI package
- Image optimization configured

## 📊 Mock Data Structure

```typescript
// Stats
{
  totalRevenue: number
  revenueChange: number  // Percentage
  totalBookings: number
  bookingsChange: number
  totalPatients: number
  patientsChange: number
  averageRating: number
  ratingChange: number
}

// Booking
{
  id: string
  patientName: string
  petName: string
  petType: string
  service: string
  date: string  // YYYY-MM-DD
  time: string  // HH:MM
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  amount: number
}
```

## 🎯 Performance Tips

1. **Code Splitting**: Already automatic with Next.js App Router
2. **Image Optimization**: Use `next/image` for images
3. **Font Optimization**: Already using `next/font`
4. **Lazy Loading**: Use dynamic imports for heavy components
5. **Memoization**: Use `React.memo` for expensive components

## 🐛 Common Issues

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
pnpm dev:hospital -- -p 3002
```

### Module Not Found
```bash
# Clear cache and reinstall
pnpm clean
rm -rf node_modules
pnpm install
```

### TypeScript Errors
```bash
# Generate type definitions
cd apps/hospital-dashboard
pnpm build  # This generates .next/types
```

## 📝 Code Examples

### Creating New Page
```tsx
// apps/hospital-dashboard/src/app/(dashboard)/new-page/page.tsx
"use client"

import { Card } from "@pet-to-you/ui"

export default function NewPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">New Page</h1>
      <Card>Content here</Card>
    </div>
  )
}
```

### Using Shared Components
```tsx
import { Button, Card, Badge } from "@pet-to-you/ui"

<Button variant="default" size="lg">
  Click me
</Button>

<Badge variant="success">Active</Badge>
```

### Adding Animation
```tsx
import { motion } from "framer-motion"

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

## 🎓 Learning Resources

- [Next.js App Router](https://nextjs.org/docs/app)
- [Framer Motion](https://www.framer.com/motion/)
- [Recharts](https://recharts.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)

## ✨ What Makes This Special

1. **Monorepo Setup**: Shared components across dashboards
2. **Smooth Animations**: Framer Motion for delightful UX
3. **Type Safety**: Full TypeScript coverage
4. **Modern Stack**: Next.js 16 with App Router
5. **Beautiful UI**: Toss-inspired design system
6. **Production Ready**: Proper project structure

Ready to develop! 🚀
