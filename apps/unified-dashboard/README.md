# Unified Dashboard - Pet to You

A unified dashboard application that combines hospital and business dashboards with role-based routing and modern glassmorphism UI.

## Features

### Role-Based Access Control
- **Hospital Roles**: HOSPITAL_ADMIN, HOSPITAL_STAFF, HOSPITAL_VET
- **Business Roles**: BUSINESS_ADMIN, BUSINESS_STAFF, BUSINESS_GROOMER

### Pages

#### Shared Pages (All Roles)
- **Dashboard Home**: Overview with stats and quick actions
- **Bookings**: Manage appointments and reservations
- **Revenue**: Financial analytics and trends
- **Reviews**: Customer feedback management
- **Settings**: Account and preferences

#### Hospital-Specific Pages
- **Patients**: Patient records and medical history
- **Schedule**: Appointments and calendar view

#### Business-Specific Pages
- **Customers**: Customer relationship management
- **Services**: Service offerings and pricing

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + TailwindCSS 4
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Getting Started

### Install Dependencies
```bash
pnpm install
```

### Development
```bash
pnpm dev
```

The app will run on http://localhost:3002

### Build
```bash
pnpm build
```

### Production
```bash
pnpm start
```

## Architecture

### Directory Structure
```
src/
├── app/
│   ├── (dashboard)/          # Dashboard pages
│   │   ├── page.tsx          # Home
│   │   ├── bookings/         # Bookings page
│   │   ├── customers/        # Customers page (Business)
│   │   ├── patients/         # Patients page (Hospital)
│   │   ├── revenue/          # Revenue analytics
│   │   ├── reviews/          # Reviews management
│   │   ├── schedule/         # Schedule page (Hospital)
│   │   ├── services/         # Services page (Business)
│   │   ├── settings/         # Settings
│   │   └── layout.tsx        # Dashboard layout
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Landing/redirect page
│   ├── providers.tsx         # React Query provider
│   └── globals.css           # Global styles
├── components/
│   ├── Header.tsx            # Dashboard header
│   └── Sidebar.tsx           # Navigation sidebar
├── hooks/
│   └── useDashboardData.ts   # Custom hooks for data fetching
├── lib/
│   ├── api.ts                # API client and interceptors
│   ├── menu.ts               # Role-based menu system
│   └── store.ts              # Zustand store
└── types/
    └── index.ts              # TypeScript types

```

## Role-Based Routing

The menu system automatically filters navigation items based on the user's role:

```typescript
// Example: Hospital Admin sees
- Dashboard
- Patients ✓
- Schedule ✓
- Bookings
- Revenue
- Reviews
- Settings

// Example: Business Admin sees
- Dashboard
- Customers ✓
- Services ✓
- Bookings
- Revenue
- Reviews
- Settings
```

## API Integration

The app uses a role-based endpoint selector:

```typescript
// Hospital roles → /hospital/*
// Business roles → /business/*

// Example:
getEndpoint('HOSPITAL_ADMIN', 'bookings') // → /hospital/bookings
getEndpoint('BUSINESS_ADMIN', 'bookings') // → /business/bookings
```

## Modern UI Features

### Glassmorphism Design
- Frosted glass effects with backdrop blur
- Semi-transparent cards and surfaces
- Smooth shadows and borders

### Animations
- Fade-in animations on page load
- Slide-up animations for cards and lists
- Smooth transitions on interactions
- Staggered animations for multiple items

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interactions

### Color System
- Purple-pink gradient primary colors
- Role-based accent colors
- Status-based color coding

## Mock User

For development, the app uses a mock user (can be changed in `src/lib/store.ts`):

```typescript
{
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'HOSPITAL_ADMIN', // Change this to test different roles
  avatar: '...'
}
```

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Future Enhancements

- [ ] Authentication integration
- [ ] Real-time notifications
- [ ] Advanced search and filters
- [ ] Export functionality
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Mobile app integration
