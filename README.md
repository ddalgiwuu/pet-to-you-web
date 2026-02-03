# Pet to You - Admin Dashboards

Modern Next.js dashboards for Pet to You platform with smooth animations and beautiful UI.

## 📦 Project Structure

```
pet-to-you-web/
├── apps/
│   ├── hospital-dashboard/     # Hospital/Provider Dashboard (Port 3000)
│   └── admin-dashboard/        # Platform Admin Dashboard (Port 3001)
└── packages/
    └── ui/                     # Shared UI components
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```bash
# Install pnpm if you haven't
npm install -g pnpm

# Install dependencies
pnpm install

# Run both dashboards in dev mode
pnpm dev

# Or run individually
pnpm dev:hospital  # Port 3000
pnpm dev:admin     # Port 3001
```

### Build for Production

```bash
# Build all apps
pnpm build

# Build specific app
pnpm --filter hospital-dashboard build
pnpm --filter admin-dashboard build
```

## 🏥 Hospital Dashboard Features

**Port:** http://localhost:3000

### Pages
1. **Dashboard** (`/`) - Overview with stats, charts, and today's bookings
2. **Bookings** (`/bookings`) - Manage all appointments
3. **Patients** (`/patients`) - Patient and pet management
4. **Schedule** (`/schedule`) - Operating hours management
5. **Revenue** (`/revenue`) - Financial analytics
6. **Reviews** (`/reviews`) - Review management with reply system
7. **Settings** (`/settings`) - Hospital profile and preferences

### Key Features
- Real-time booking management
- Patient records with pet profiles
- Revenue analytics with interactive charts
- Review management system
- Animated stats cards
- Responsive data tables

## 👑 Admin Dashboard Features

**Port:** http://localhost:3001

### Pages
1. **Platform Overview** (`/`) - MAU, revenue, growth metrics
2. **User Management** (`/users`) - Search, filter, and manage users
3. **Hospital Management** (`/hospitals`) - Hospital verification and approval
4. **Analytics** (`/analytics`) - Platform-wide metrics
5. **Compliance** (`/compliance`) - Audit logs and data exports
6. **Security** (`/security`) - Security monitoring and alerts

### Key Features
- Platform-wide metrics dashboard
- User and hospital management
- Advanced analytics with charts
- Security monitoring
- Compliance tracking

## 🎨 Design System

### Technologies
- **Next.js 16** - App Router with RSC
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Recharts** - Interactive charts
- **Radix UI** - Accessible components
- **Lucide Icons** - Beautiful icons

### Animation Specifications
- Page transitions: 200ms fade + slide
- Stats cards: Counter animations
- Charts: Progressive drawing (stagger)
- Tables: Row hover with scale
- Modals: Slide up from bottom

### Color Palette
- **Hospital Dashboard**: Blue gradient (`from-blue-600 to-cyan-600`)
- **Admin Dashboard**: Purple gradient (`from-purple-600 to-pink-600`)
- **Neutral**: Gray scale for backgrounds and text
- **Status Colors**: Green (success), Yellow (warning), Red (error)

## 🧩 Shared UI Components

Located in `packages/ui/src/`:

- **Button** - Variants: default, outline, ghost, destructive
- **Card** - With hover effects and gradient backgrounds
- **DataTable** - Animated tables with sorting
- **Badge** - Status indicators
- **Input** - Form inputs with focus states

### Using Shared Components

```tsx
import { Button, Card, DataTable } from "@pet-to-you/ui"

// All components support className prop for customization
<Button variant="default" size="lg">
  Click me
</Button>
```

## 📱 Responsive Design

- **Desktop-first** approach
- Breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`
- Sidebar collapses on mobile (future enhancement)
- Charts adapt to container width

## 🔧 Development

### File Structure Convention

```
src/
├── app/                    # Next.js App Router
│   ├── (dashboard)/       # Route group
│   │   ├── layout.tsx    # Shared layout
│   │   └── page.tsx      # Route page
│   └── globals.css       # Global styles
├── components/            # React components
│   ├── dashboard/        # Dashboard-specific
│   └── charts/           # Chart components
└── lib/                   # Utilities
    ├── types.ts          # TypeScript types
    └── mock-data.ts      # Mock data
```

### Adding New Pages

1. Create folder in `app/(dashboard)/[page-name]/`
2. Add `page.tsx` with default export
3. Update navigation in `components/Sidebar.tsx`

### Adding New Components

1. Create in `packages/ui/src/ComponentName.tsx`
2. Export from `packages/ui/src/index.ts`
3. Use across both dashboards

## 🎯 Performance

- **SSR** for initial page loads
- **Client Components** for interactivity
- **Code Splitting** automatic with Next.js
- **Image Optimization** with next/image
- **Font Optimization** with next/font

## 📊 Mock Data

Both dashboards use mock data from `lib/mock-data.ts`. Replace with real API calls:

```tsx
// Before
import { mockBookings } from "@/lib/mock-data"

// After
import { useQuery } from "@tanstack/react-query"

const { data: bookings } = useQuery({
  queryKey: ['bookings'],
  queryFn: () => fetch('/api/bookings').then(r => r.json())
})
```

## 🔐 Authentication

Authentication screens are not implemented. Add:

```tsx
// app/(auth)/login/page.tsx
export default function LoginPage() {
  return <div>Login form here</div>
}
```

## 🚧 Future Enhancements

- [ ] Real-time updates with WebSocket
- [ ] Dark mode support
- [ ] Mobile sidebar collapse
- [ ] Authentication system
- [ ] API integration
- [ ] E2E tests with Playwright
- [ ] Storybook for components
- [ ] i18n support

## 📝 Scripts

```bash
pnpm dev              # Run both dashboards
pnpm dev:hospital     # Hospital dashboard only
pnpm dev:admin        # Admin dashboard only
pnpm build            # Build all apps
pnpm lint             # Lint all apps
pnpm clean            # Clean build artifacts
```

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test both dashboards
4. Submit PR

## 📄 License

MIT
