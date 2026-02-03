# 🚀 Quick Start Guide

## ⚡ 30 Second Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Start both dashboards
pnpm dev

# 3. Open browsers
# Hospital: http://localhost:3000
# Admin: http://localhost:3001
```

## 📱 What You'll See

### Hospital Dashboard (Blue Theme)
```
Port: 3000
Theme: Blue gradient

Pages:
✅ / - Dashboard with stats, charts, bookings
✅ /bookings - Full booking management
✅ /patients - Patient & pet management
✅ /reviews - Review management with replies
⏳ /schedule - Coming soon
⏳ /revenue - Coming soon
⏳ /settings - Coming soon
```

### Admin Dashboard (Purple Theme)
```
Port: 3001
Theme: Purple gradient

Pages:
✅ / - Platform metrics with charts
⏳ /users - Coming soon
⏳ /hospitals - Coming soon
⏳ /analytics - Coming soon
⏳ /compliance - Coming soon
⏳ /security - Coming soon
```

## 🎨 Key Features Implemented

### ✅ Animations
- Smooth page transitions (200ms)
- Stats counter animations
- Card hover effects
- Table row stagger animations
- Chart progressive drawing

### ✅ Components
- Reusable Button (6 variants)
- Animated Cards
- DataTable with animations
- Status Badges
- Search Inputs
- Revenue Charts (Recharts)
- Sidebar with active states

### ✅ Design
- Toss-inspired UI
- Gradient backgrounds
- Glassmorphism effects
- Smooth shadows
- Professional typography
- Consistent spacing

## 📂 Project Structure

```
apps/
├── hospital-dashboard/    # Blue theme, hospital-specific
└── admin-dashboard/       # Purple theme, platform-wide

packages/
└── ui/                    # Shared components library
```

## 🔧 Quick Commands

```bash
# Development
pnpm dev              # Both dashboards
pnpm dev:hospital     # Hospital only
pnpm dev:admin        # Admin only

# Build
pnpm build            # Build all

# Clean
pnpm clean            # Remove build artifacts
```

## 📊 Mock Data

All pages use realistic mock data:
- Stats with trend indicators
- 4 booking samples
- 2 patient samples
- 2 review samples
- 7-day revenue data

## 🎯 Technologies

- **Next.js 16** - App Router + RSC
- **TypeScript** - Full type safety
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Recharts** - Interactive charts
- **Radix UI** - Accessible primitives
- **Lucide Icons** - Beautiful icons
- **pnpm** - Fast package manager

## 💡 Tips

1. **Hot reload** - Changes auto-refresh
2. **Type safety** - TypeScript errors show in terminal
3. **Shared components** - Edit once, use everywhere
4. **Mock data** - In `lib/mock-data.ts`
5. **Animations** - Framer Motion for smooth UX

## 📖 Documentation

- `README.md` - Complete overview
- `SETUP.md` - Detailed setup guide
- `FEATURES.md` - Feature documentation
- This file - Quick reference

## 🎨 Customization

### Change Colors
```tsx
// Hospital: Blue → Green
from-blue-600 to-cyan-600
→ from-green-600 to-emerald-600

// Admin: Purple → Orange
from-purple-600 to-pink-600
→ from-orange-600 to-red-600
```

### Add New Page
```tsx
// 1. Create file
apps/hospital-dashboard/src/app/(dashboard)/new-page/page.tsx

// 2. Add to navigation
components/dashboard/Sidebar.tsx

// 3. Done!
```

## ✨ What's Special

1. **Monorepo** - Shared UI components
2. **Modern Stack** - Latest Next.js features
3. **Smooth Animations** - Framer Motion
4. **Type Safe** - Full TypeScript
5. **Production Ready** - Proper structure
6. **Beautiful UI** - Professional design

## 🐛 Common Issues

**Port in use?**
```bash
lsof -ti:3000 | xargs kill -9
```

**Module errors?**
```bash
rm -rf node_modules .next
pnpm install
```

**Type errors?**
```bash
cd apps/hospital-dashboard
pnpm build  # Generates types
```

## 📚 Learn More

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Recharts](https://recharts.org/)

## 🎉 You're Ready!

Everything is set up and ready to use. Start developing with:

```bash
pnpm dev
```

Then open:
- http://localhost:3000 (Hospital Dashboard)
- http://localhost:3001 (Admin Dashboard)

Happy coding! 🚀
