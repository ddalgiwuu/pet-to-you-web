# UI Library Expansion Plan
## @pet-to-you/ui Package Enhancement

**Last Updated:** 2026-02-07
**Owner:** UI Library Team
**Status:** Planning

---

## 1. Current State Analysis

### ✅ Existing Components (7 components)

**Foundation Components:**
- ✅ **Button** - Full CVA variants (default, destructive, outline, secondary, ghost, link), size variants, asChild support
- ✅ **Input** - Basic text input with focus states
- ✅ **Badge** - Status badges (default, success, warning, error, secondary, outline)

**Layout Components:**
- ✅ **Card** - With gradient/hover support, framer-motion animations
  - CardHeader, CardTitle, CardDescription, CardContent
- ✅ **DataTable** - Basic table structure with animations
  - TableHeader, TableBody, TableRow, TableHead, TableCell

**Utilities:**
- ✅ `cn()` - Tailwind merge utility
- ✅ `formatCurrency()` - Korean won formatting
- ✅ `formatDate()` / `formatDateTime()` - Date helpers

### 📦 Current Dependencies

```json
{
  "dependencies": {
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-slot": "^1.1.1",
    "@radix-ui/react-tabs": "^1.1.2",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "framer-motion": "^12.26.2",
    "lucide-react": "^0.562.0",
    "tailwind-merge": "^3.4.0"
  }
}
```

### ❌ Missing Critical Components

**Data & Forms:**
- ❌ Advanced DataTable (sorting, filtering, pagination, row selection)
- ❌ Form components (Select, Checkbox, Radio, Textarea, DatePicker)
- ❌ Form validation integration (React Hook Form + Zod)

**Charts & Visualization:**
- ❌ Chart wrappers (RevenueChart, StatsChart, DonutChart)
- ❌ Currently duplicated in hospital-dashboard

**UI Patterns:**
- ❌ Modal/Dialog wrapper
- ❌ Search & Filter components
- ❌ Loading states (Skeleton, Spinner)
- ❌ Empty states
- ❌ Toast notifications
- ❌ Dropdown menus (beyond Radix)

---

## 2. Required Components - Priority Matrix

### 🔴 HIGH PRIORITY (Week 1-2)

#### 2.1 Advanced DataTable System
**Purpose:** Reusable table with sorting, filtering, pagination, and row selection

**API Design:**
```typescript
// packages/ui/src/components/data-table/DataTable.tsx
import { ColumnDef } from "@tanstack/react-table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  // Features
  enableSorting?: boolean
  enableFiltering?: boolean
  enablePagination?: boolean
  enableRowSelection?: boolean
  // Pagination
  pageSize?: number
  pageSizeOptions?: number[]
  // Callbacks
  onRowSelectionChange?: (selectedRows: TData[]) => void
  onSortingChange?: (sorting: SortingState) => void
  // Styling
  className?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  enableSorting = true,
  enableFiltering = false,
  enablePagination = true,
  enableRowSelection = false,
  pageSize = 10,
  pageSizeOptions = [10, 20, 30, 50],
  onRowSelectionChange,
  onSortingChange,
  className,
}: DataTableProps<TData, TValue>) {
  // Implementation using @tanstack/react-table
}
```

**Usage Example:**
```tsx
// In dashboard
import { DataTable } from "@pet-to-you/ui"

const columns: ColumnDef<Booking>[] = [
  {
    accessorKey: "petName",
    header: "반려동물",
    cell: ({ row }) => <div>{row.getValue("petName")}</div>,
  },
  // ... more columns
]

<DataTable
  columns={columns}
  data={bookings}
  enableSorting
  enableRowSelection
  pageSize={20}
  onRowSelectionChange={(selected) => console.log(selected)}
/>
```

**Dependencies:**
- Add: `@tanstack/react-table@^8.20.6`

---

#### 2.2 Chart Components (Recharts Wrappers)
**Purpose:** Consistent chart styling across all dashboards

**Components:**

**a) RevenueChart**
```typescript
// packages/ui/src/components/charts/RevenueChart.tsx
interface RevenueChartProps {
  data: { date: string; amount: number }[]
  height?: number
  color?: string
  showGrid?: boolean
  formatValue?: (value: number) => string
}

export function RevenueChart({
  data,
  height = 300,
  color = "#3b82f6",
  showGrid = true,
  formatValue = (v) => `${v.toLocaleString()}원`,
}: RevenueChartProps) {
  // AreaChart with consistent styling
}
```

**b) StatsChart**
```typescript
// packages/ui/src/components/charts/StatsChart.tsx
interface StatsChartProps {
  data: { name: string; value: number }[]
  type?: "bar" | "line"
  height?: number
  color?: string
}

export function StatsChart({
  data,
  type = "bar",
  height = 200,
  color = "#3b82f6",
}: StatsChartProps) {
  // BarChart or LineChart
}
```

**c) DonutChart**
```typescript
// packages/ui/src/components/charts/DonutChart.tsx
interface DonutChartProps {
  data: { name: string; value: number; color?: string }[]
  centerText?: string
  size?: number
}

export function DonutChart({
  data,
  centerText,
  size = 200,
}: DonutChartProps) {
  // PieChart with donut configuration
}
```

**Dependencies:**
- Add: `recharts@^3.6.0` (peer dependency)

---

#### 2.3 Form Components (React Hook Form + Zod)
**Purpose:** Type-safe form handling with validation

**a) Form Wrapper**
```typescript
// packages/ui/src/components/forms/Form.tsx
import { useForm, FieldValues, UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

interface FormProps<T extends FieldValues> {
  schema: z.ZodType<T>
  onSubmit: (data: T) => void | Promise<void>
  defaultValues?: Partial<T>
  children: (methods: UseFormReturn<T>) => React.ReactNode
  className?: string
}

export function Form<T extends FieldValues>({
  schema,
  onSubmit,
  defaultValues,
  children,
  className,
}: FormProps<T>) {
  const methods = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  return (
    <form onSubmit={methods.handleSubmit(onSubmit)} className={className}>
      {children(methods)}
    </form>
  )
}
```

**b) FormField**
```typescript
// packages/ui/src/components/forms/FormField.tsx
interface FormFieldProps {
  name: string
  label: string
  description?: string
  required?: boolean
  children: React.ReactNode
}

export function FormField({
  name,
  label,
  description,
  required,
  children,
}: FormFieldProps) {
  // Wrapper with label, error display
}
```

**c) Select Component**
```typescript
// packages/ui/src/components/forms/Select.tsx
import * as SelectPrimitive from "@radix-ui/react-select"

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  options: { value: string; label: string }[]
  disabled?: boolean
}

export function Select({
  value,
  onValueChange,
  placeholder,
  options,
  disabled,
}: SelectProps) {
  // Styled Radix Select
}
```

**d) DatePicker**
```typescript
// packages/ui/src/components/forms/DatePicker.tsx
import { Calendar } from "@radix-ui/react-calendar"

interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
}

export function DatePicker({
  value,
  onChange,
  placeholder = "날짜 선택",
  disabled,
  minDate,
  maxDate,
}: DatePickerProps) {
  // Popover + Calendar
}
```

**e) Textarea**
```typescript
// packages/ui/src/components/forms/Textarea.tsx
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    // Styled textarea with error state
  }
)
```

**f) Checkbox & Radio**
```typescript
// packages/ui/src/components/forms/Checkbox.tsx
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"

interface CheckboxProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: string
  disabled?: boolean
}

// packages/ui/src/components/forms/Radio.tsx
import * as RadioPrimitive from "@radix-ui/react-radio-group"

interface RadioGroupProps {
  value?: string
  onValueChange?: (value: string) => void
  options: { value: string; label: string }[]
  disabled?: boolean
}
```

**Usage Example:**
```tsx
import { Form, FormField, Input, Select, DatePicker } from "@pet-to-you/ui"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1, "이름은 필수입니다"),
  category: z.string(),
  date: z.date(),
})

<Form schema={schema} onSubmit={handleSubmit}>
  {({ register, formState: { errors } }) => (
    <>
      <FormField name="name" label="이름" required>
        <Input {...register("name")} error={errors.name?.message} />
      </FormField>

      <FormField name="category" label="카테고리">
        <Select
          options={categories}
          {...register("category")}
        />
      </FormField>

      <FormField name="date" label="날짜">
        <DatePicker {...register("date")} />
      </FormField>
    </>
  )}
</Form>
```

**Dependencies:**
- Add: `react-hook-form@^7.54.2`
- Add: `@hookform/resolvers@^3.10.0`
- Add: `zod@^3.24.1`
- Add: `@radix-ui/react-checkbox@^1.1.6`
- Add: `@radix-ui/react-radio-group@^1.2.7`
- Add: `react-day-picker@^9.7.3` (for DatePicker)

---

#### 2.4 Enhanced Card Components
**Purpose:** Specialized card variants for common use cases

**a) StatsCard**
```typescript
// packages/ui/src/components/cards/StatsCard.tsx
import { LucideIcon } from "lucide-react"
import { Card } from "../Card"

interface StatsCardProps {
  title: string
  value: string | number
  change?: number
  icon?: LucideIcon
  trend?: "up" | "down" | "neutral"
  className?: string
}

export function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  trend = "neutral",
  className,
}: StatsCardProps) {
  // Animated stats card with icon and trend indicator
}
```

**b) InfoCard**
```typescript
// packages/ui/src/components/cards/InfoCard.tsx
interface InfoCardProps {
  title: string
  description?: string
  footer?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function InfoCard({
  title,
  description,
  footer,
  children,
  className,
}: InfoCardProps) {
  // Standard info card with header/content/footer
}
```

**c) ActionCard**
```typescript
// packages/ui/src/components/cards/ActionCard.tsx
interface ActionCardProps {
  title: string
  description?: string
  icon?: LucideIcon
  action: {
    label: string
    onClick: () => void
    variant?: "default" | "outline"
  }
  className?: string
}

export function ActionCard({
  title,
  description,
  icon: Icon,
  action,
  className,
}: ActionCardProps) {
  // Card with prominent action button
}
```

---

#### 2.5 Modal/Dialog Component
**Purpose:** Accessible dialog wrapper

```typescript
// packages/ui/src/components/dialog/Dialog.tsx
import * as DialogPrimitive from "@radix-ui/react-dialog"

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl"
}

export function Dialog({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  footer,
  size = "md",
}: DialogProps) {
  // Styled Radix Dialog with overlay
}
```

---

### 🟡 MEDIUM PRIORITY (Week 3-4)

#### 2.6 Search & Filter Components

**a) SearchBar**
```typescript
// packages/ui/src/components/search/SearchBar.tsx
interface SearchBarProps {
  value?: string
  onChange?: (value: string) => void
  onSearch?: (value: string) => void
  placeholder?: string
  debounceMs?: number
  showButton?: boolean
  className?: string
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "검색...",
  debounceMs = 300,
  showButton = false,
  className,
}: SearchBarProps) {
  // Input with search icon, optional button, debounced onChange
}
```

**b) FilterBar**
```typescript
// packages/ui/src/components/search/FilterBar.tsx
interface Filter {
  id: string
  label: string
  type: "select" | "date-range" | "checkbox"
  options?: { value: string; label: string }[]
}

interface FilterBarProps {
  filters: Filter[]
  values: Record<string, any>
  onChange: (filterId: string, value: any) => void
  onReset: () => void
  className?: string
}

export function FilterBar({
  filters,
  values,
  onChange,
  onReset,
  className,
}: FilterBarProps) {
  // Horizontal filter controls with reset button
}
```

---

#### 2.7 Date Components

**a) DateRangePicker**
```typescript
// packages/ui/src/components/date/DateRangePicker.tsx
interface DateRange {
  from: Date
  to: Date
}

interface DateRangePickerProps {
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
  presets?: { label: string; range: DateRange }[]
  placeholder?: string
  disabled?: boolean
}

export function DateRangePicker({
  value,
  onChange,
  presets = [
    { label: "오늘", range: { from: today, to: today } },
    { label: "이번 주", range: { from: weekStart, to: today } },
    { label: "이번 달", range: { from: monthStart, to: today } },
  ],
  placeholder = "날짜 범위 선택",
  disabled,
}: DateRangePickerProps) {
  // Popover with calendar and preset buttons
}
```

---

#### 2.8 Status Components

**a) StatusBadge** (Enhanced Badge)
```typescript
// packages/ui/src/components/status/StatusBadge.tsx
interface StatusBadgeProps {
  status: "active" | "pending" | "completed" | "cancelled" | "error"
  label?: string
  size?: "sm" | "md" | "lg"
  withDot?: boolean
}

export function StatusBadge({
  status,
  label,
  size = "md",
  withDot = false,
}: StatusBadgeProps) {
  // Badge with predefined status colors and optional animated dot
}
```

---

#### 2.9 Loading States

**a) Skeleton**
```typescript
// packages/ui/src/components/loading/Skeleton.tsx
interface SkeletonProps {
  variant?: "text" | "circular" | "rectangular"
  width?: string | number
  height?: string | number
  className?: string
}

export function Skeleton({
  variant = "rectangular",
  width,
  height,
  className,
}: SkeletonProps) {
  // Animated skeleton with shimmer effect
}
```

**b) Spinner**
```typescript
// packages/ui/src/components/loading/Spinner.tsx
interface SpinnerProps {
  size?: "sm" | "md" | "lg"
  color?: string
  className?: string
}

export function Spinner({
  size = "md",
  color = "text-blue-600",
  className,
}: SpinnerProps) {
  // Spinning loader icon
}
```

**c) Loading Overlay**
```typescript
// packages/ui/src/components/loading/LoadingOverlay.tsx
interface LoadingOverlayProps {
  show: boolean
  message?: string
  className?: string
}

export function LoadingOverlay({
  show,
  message = "로딩 중...",
  className,
}: LoadingOverlayProps) {
  // Full-screen or container overlay with spinner
}
```

---

#### 2.10 Empty States

```typescript
// packages/ui/src/components/empty/EmptyState.tsx
interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  // Centered empty state with optional action
}
```

---

### 🟢 LOW PRIORITY (Week 5+)

#### 2.11 Toast Notifications

```typescript
// packages/ui/src/components/toast/Toast.tsx
interface ToastProps {
  title: string
  description?: string
  variant?: "default" | "success" | "error" | "warning"
  duration?: number
}

// Hook-based API
export function useToast() {
  return {
    toast: (props: ToastProps) => void
    dismiss: (toastId: string) => void
  }
}

// Usage
const { toast } = useToast()
toast({
  title: "성공",
  description: "저장되었습니다",
  variant: "success",
  duration: 3000,
})
```

**Dependencies:**
- Add: `sonner@^2.4.5` or implement custom toast

---

#### 2.12 Dropdown Components

```typescript
// packages/ui/src/components/dropdown/Dropdown.tsx
import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu"

interface DropdownProps {
  trigger: React.ReactNode
  items: {
    label: string
    icon?: LucideIcon
    onClick: () => void
    variant?: "default" | "destructive"
  }[]
  align?: "start" | "center" | "end"
}

export function Dropdown({
  trigger,
  items,
  align = "end",
}: DropdownProps) {
  // Styled Radix DropdownMenu
}
```

---

#### 2.13 Tabs Component

```typescript
// packages/ui/src/components/tabs/Tabs.tsx
import * as TabsPrimitive from "@radix-ui/react-tabs"

interface Tab {
  value: string
  label: string
  icon?: LucideIcon
  content: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultValue?: string
  orientation?: "horizontal" | "vertical"
}

export function Tabs({
  tabs,
  defaultValue,
  orientation = "horizontal",
}: TabsProps) {
  // Styled Radix Tabs
}
```

---

#### 2.14 Breadcrumbs

```typescript
// packages/ui/src/components/navigation/Breadcrumbs.tsx
interface BreadcrumbItem {
  label: string
  href?: string
  onClick?: () => void
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
  className?: string
}

export function Breadcrumbs({
  items,
  separator = "/",
  className,
}: BreadcrumbsProps) {
  // Breadcrumb navigation
}
```

---

## 3. shadcn/ui Integration Strategy

### Why shadcn/ui?

1. **Copy-paste components** - No runtime dependency overhead
2. **Radix UI primitives** - Already using Radix (@radix-ui/react-dialog, etc.)
3. **Tailwind CSS** - Matches our styling approach
4. **Customizable** - Easy to modify for Pet-to-You branding

### Integration Approach

**Option A: Manual Cherry-picking** ✅ RECOMMENDED
- Copy shadcn/ui component source code
- Customize styling for Pet-to-You brand
- Maintain control over implementation

**Option B: shadcn CLI**
```bash
cd packages/ui
npx shadcn@latest init

# Add specific components
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add select
npx shadcn@latest add calendar
npx shadcn@latest add popover
npx shadcn@latest add skeleton
```

### Components to Add from shadcn/ui

**High Priority:**
- ✅ Dialog (already have Radix, need styling)
- ✅ Select (already have Radix, need styling)
- ✅ Calendar (for DatePicker)
- ✅ Popover (for DatePicker, Select dropdowns)
- ✅ Checkbox
- ✅ Radio Group

**Medium Priority:**
- ⏳ Skeleton
- ⏳ Toast (Sonner integration)
- ⏳ Dropdown Menu (already have Radix, need styling)

**Low Priority:**
- ⏳ Tabs (already have Radix, need styling)
- ⏳ Command (for search)
- ⏳ Breadcrumb

### Theme Configuration

```typescript
// packages/ui/tailwind.config.ts
import type { Config } from "tailwindcss"

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Pet-to-You brand colors
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6", // Main brand blue
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        // ... other colors
      },
      borderRadius: {
        lg: "0.75rem", // 12px
        md: "0.5rem",  // 8px
        sm: "0.375rem", // 6px
      },
    },
  },
  plugins: [],
} satisfies Config
```

---

## 4. Component API Design Patterns

### TypeScript Best Practices

**1. Generic Props for Flexibility**
```typescript
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}
```

**2. Discriminated Unions**
```typescript
type CardVariant =
  | { variant: "default" }
  | { variant: "gradient"; gradientFrom: string; gradientTo: string }
  | { variant: "image"; imageSrc: string }
```

**3. Composition Over Configuration**
```typescript
// Good: Composable
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// Avoid: Prop drilling
<Card title="Title" content="Content" />
```

**4. Ref Forwarding**
```typescript
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => <input ref={ref} {...props} />
)
```

**5. Controlled/Uncontrolled Support**
```typescript
interface SelectProps {
  // Controlled
  value?: string
  onChange?: (value: string) => void
  // Uncontrolled
  defaultValue?: string
}
```

---

## 5. Implementation Plan

### Phase 1: Foundation (Week 1) - Jan 27-31
**Goal:** Essential components for dashboards

**Tasks:**
1. ✅ Set up Storybook for component development
2. ✅ Add React Hook Form + Zod dependencies
3. ✅ Add @tanstack/react-table dependency
4. ✅ Implement Select component (shadcn/ui styled)
5. ✅ Implement Checkbox & Radio components
6. ✅ Implement Textarea component
7. ✅ Create Form wrapper & FormField
8. ✅ Implement DatePicker with Calendar
9. ✅ Create advanced DataTable with sorting/pagination

**Deliverables:**
- Form components with validation
- DataTable with basic features
- Storybook documentation

---

### Phase 2: Visualization (Week 2) - Feb 3-7
**Goal:** Chart components and specialized cards

**Tasks:**
1. ✅ Add Recharts as peer dependency
2. ✅ Implement RevenueChart wrapper
3. ✅ Implement StatsChart wrapper
4. ✅ Implement DonutChart wrapper
5. ✅ Create StatsCard component
6. ✅ Create InfoCard component
7. ✅ Create ActionCard component
8. ✅ Migrate hospital-dashboard charts to use @pet-to-you/ui

**Deliverables:**
- 3 chart components (Revenue, Stats, Donut)
- 3 card variants (Stats, Info, Action)
- Migration guide for existing dashboards

---

### Phase 3: Interaction (Week 3) - Feb 10-14
**Goal:** Modals, search, and filters

**Tasks:**
1. ✅ Implement Dialog/Modal component
2. ✅ Implement SearchBar with debounce
3. ✅ Implement FilterBar component
4. ✅ Implement DateRangePicker
5. ✅ Implement StatusBadge
6. ✅ Create Dropdown component (shadcn/ui styled)

**Deliverables:**
- Dialog system
- Search & filter components
- Date range selection
- Status indicators

---

### Phase 4: Feedback & States (Week 4) - Feb 17-21
**Goal:** Loading and empty states

**Tasks:**
1. ✅ Implement Skeleton loader
2. ✅ Implement Spinner component
3. ✅ Implement LoadingOverlay
4. ✅ Implement EmptyState component
5. ✅ Implement Toast notifications (Sonner)
6. ✅ Create useToast hook

**Deliverables:**
- Loading components
- Empty state patterns
- Toast notification system

---

### Phase 5: Navigation & Polish (Week 5+) - Feb 24+
**Goal:** Final components and optimization

**Tasks:**
1. ✅ Implement Tabs component (shadcn/ui styled)
2. ✅ Implement Breadcrumbs component
3. ✅ Add Command component for search
4. ✅ Performance optimization
5. ✅ Accessibility audit (WCAG 2.1 AA)
6. ✅ Documentation completion
7. ✅ Testing coverage >80%

**Deliverables:**
- Complete component library
- Full Storybook documentation
- Testing suite
- Migration guide

---

## 6. File Structure

```
packages/ui/
├── src/
│   ├── components/
│   │   ├── forms/
│   │   │   ├── Form.tsx
│   │   │   ├── FormField.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── DatePicker.tsx
│   │   │   ├── Textarea.tsx
│   │   │   ├── Checkbox.tsx
│   │   │   ├── Radio.tsx
│   │   │   └── index.ts
│   │   ├── data-table/
│   │   │   ├── DataTable.tsx
│   │   │   ├── DataTablePagination.tsx
│   │   │   ├── DataTableToolbar.tsx
│   │   │   └── index.ts
│   │   ├── charts/
│   │   │   ├── RevenueChart.tsx
│   │   │   ├── StatsChart.tsx
│   │   │   ├── DonutChart.tsx
│   │   │   └── index.ts
│   │   ├── cards/
│   │   │   ├── StatsCard.tsx
│   │   │   ├── InfoCard.tsx
│   │   │   ├── ActionCard.tsx
│   │   │   └── index.ts
│   │   ├── dialog/
│   │   │   ├── Dialog.tsx
│   │   │   └── index.ts
│   │   ├── search/
│   │   │   ├── SearchBar.tsx
│   │   │   ├── FilterBar.tsx
│   │   │   └── index.ts
│   │   ├── date/
│   │   │   ├── DateRangePicker.tsx
│   │   │   ├── Calendar.tsx (from shadcn)
│   │   │   └── index.ts
│   │   ├── status/
│   │   │   ├── StatusBadge.tsx
│   │   │   └── index.ts
│   │   ├── loading/
│   │   │   ├── Skeleton.tsx
│   │   │   ├── Spinner.tsx
│   │   │   ├── LoadingOverlay.tsx
│   │   │   └── index.ts
│   │   ├── empty/
│   │   │   ├── EmptyState.tsx
│   │   │   └── index.ts
│   │   ├── toast/
│   │   │   ├── Toast.tsx
│   │   │   ├── Toaster.tsx
│   │   │   ├── useToast.ts
│   │   │   └── index.ts
│   │   ├── dropdown/
│   │   │   ├── Dropdown.tsx
│   │   │   └── index.ts
│   │   ├── tabs/
│   │   │   ├── Tabs.tsx
│   │   │   └── index.ts
│   │   └── navigation/
│   │       ├── Breadcrumbs.tsx
│   │       └── index.ts
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   ├── useMediaQuery.ts
│   │   ├── useLocalStorage.ts
│   │   └── index.ts
│   ├── lib/
│   │   └── utils.ts (cn, formatters)
│   ├── index.ts (main export)
│   └── styles.css
├── .storybook/
│   ├── main.ts
│   ├── preview.ts
│   └── manager.ts
├── stories/
│   ├── forms/
│   ├── data-table/
│   ├── charts/
│   └── ...
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 7. Testing Strategy

### Unit Testing (Vitest + Testing Library)

```typescript
// packages/ui/src/components/forms/__tests__/Form.test.tsx
import { render, screen, fireEvent } from "@testing-library/react"
import { Form, FormField, Input } from "../"
import { z } from "zod"

describe("Form", () => {
  it("should validate on submit", async () => {
    const schema = z.object({
      name: z.string().min(1, "Required"),
    })

    const onSubmit = vi.fn()

    render(
      <Form schema={schema} onSubmit={onSubmit}>
        {({ register }) => (
          <FormField name="name" label="Name">
            <Input {...register("name")} />
          </FormField>
        )}
      </Form>
    )

    const submit = screen.getByRole("button")
    fireEvent.click(submit)

    await screen.findByText("Required")
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
```

### Visual Testing (Storybook + Chromatic)

```typescript
// packages/ui/stories/Button.stories.tsx
import type { Meta, StoryObj } from "@storybook/react"
import { Button } from "../src"

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: {
    children: "Button",
  },
}

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Delete",
  },
}
```

### Accessibility Testing

```typescript
// packages/ui/src/components/Button/__tests__/Button.a11y.test.tsx
import { axe, toHaveNoViolations } from "jest-axe"
import { render } from "@testing-library/react"
import { Button } from "../Button"

expect.extend(toHaveNoViolations)

describe("Button - Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<Button>Click me</Button>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
```

---

## 8. Documentation Approach

### Component Documentation Template

```markdown
# ComponentName

## Description
Brief description of the component's purpose.

## Usage

\`\`\`tsx
import { ComponentName } from "@pet-to-you/ui"

<ComponentName prop="value" />
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| prop1 | string | - | Description |
| prop2 | boolean | false | Description |

## Examples

### Basic Example
\`\`\`tsx
<ComponentName />
\`\`\`

### Advanced Example
\`\`\`tsx
<ComponentName
  prop1="value"
  prop2={true}
/>
\`\`\`

## Accessibility
- ARIA roles and labels
- Keyboard navigation support
- Screen reader compatibility

## Related Components
- [OtherComponent](./OtherComponent.md)
```

### Storybook Documentation

```typescript
// Use CSF3 format with inline documentation
export default {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A versatile button component with multiple variants.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
      description: "The visual style of the button",
    },
    size: {
      control: "select",
      options: ["sm", "default", "lg", "icon"],
      description: "The size of the button",
    },
  },
}
```

---

## 9. Migration Guide for Existing Dashboards

### Step 1: Update package.json

```json
{
  "dependencies": {
    "@pet-to-you/ui": "workspace:*"
  }
}
```

### Step 2: Import Components

**Before:**
```tsx
// apps/hospital-dashboard/src/components/charts/RevenueChart.tsx
import { Card } from "@pet-to-you/ui"
import { AreaChart, ... } from "recharts"

export function RevenueChart({ data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>주간 수익</CardTitle>
      </CardHeader>
      <CardContent>
        <AreaChart data={data}>
          {/* Complex Recharts configuration */}
        </AreaChart>
      </CardContent>
    </Card>
  )
}
```

**After:**
```tsx
// apps/hospital-dashboard/src/app/page.tsx
import { RevenueChart } from "@pet-to-you/ui"

export default function Dashboard() {
  return (
    <RevenueChart
      data={revenueData}
      formatValue={(v) => `${v.toLocaleString()}원`}
    />
  )
}
```

### Step 3: Remove Duplicate Components

```bash
# Delete local components that now exist in @pet-to-you/ui
rm apps/hospital-dashboard/src/components/charts/RevenueChart.tsx
rm apps/hospital-dashboard/src/components/dashboard/StatsCard.tsx
```

### Step 4: Update Forms

**Before:**
```tsx
const [name, setName] = useState("")
const [errors, setErrors] = useState({})

const handleSubmit = () => {
  if (!name) {
    setErrors({ name: "Required" })
    return
  }
  // submit
}

return (
  <form onSubmit={handleSubmit}>
    <input value={name} onChange={(e) => setName(e.target.value)} />
    {errors.name && <span>{errors.name}</span>}
  </form>
)
```

**After:**
```tsx
import { Form, FormField, Input } from "@pet-to-you/ui"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1, "Required"),
})

return (
  <Form schema={schema} onSubmit={handleSubmit}>
    {({ register, formState: { errors } }) => (
      <FormField name="name" label="Name" required>
        <Input {...register("name")} error={errors.name?.message} />
      </FormField>
    )}
  </Form>
)
```

---

## 10. Performance Considerations

### Code Splitting

```typescript
// Lazy load heavy components
export const RevenueChart = lazy(() =>
  import("./charts/RevenueChart").then((m) => ({ default: m.RevenueChart }))
)
```

### Tree-Shaking

```typescript
// Use named exports for tree-shaking
export { Button } from "./Button"
export { Input } from "./Input"
// NOT: export * from "./Button"
```

### Bundle Size Targets

- **Core components** (Button, Input, Card): <10KB gzipped
- **Form components** (with RHF): <25KB gzipped
- **DataTable** (with Tanstack): <35KB gzipped
- **Charts** (with Recharts): <45KB gzipped
- **Total library**: <150KB gzipped

### Optimization Techniques

1. **Avoid unnecessary re-renders** - Use React.memo for expensive components
2. **Virtualization** - Use react-virtual for large lists
3. **Debouncing** - For search inputs and filters
4. **Lazy loading** - For modals and heavy components
5. **SVG optimization** - Compress icon assets

---

## 11. Dependencies Summary

### Required Dependencies

```json
{
  "dependencies": {
    // Existing
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-slot": "^1.1.1",
    "@radix-ui/react-tabs": "^1.1.2",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "framer-motion": "^12.26.2",
    "lucide-react": "^0.562.0",
    "tailwind-merge": "^3.4.0",

    // NEW - Forms
    "@radix-ui/react-checkbox": "^1.1.6",
    "@radix-ui/react-radio-group": "^1.2.7",
    "react-day-picker": "^9.7.3",
    "react-hook-form": "^7.54.2",
    "@hookform/resolvers": "^3.10.0",
    "zod": "^3.24.1",

    // NEW - Data Table
    "@tanstack/react-table": "^8.20.6",

    // NEW - Toast
    "sonner": "^2.4.5"
  },
  "peerDependencies": {
    "react": "^19.2.3",
    "react-dom": "^19.2.3",
    "recharts": "^3.6.0"
  }
}
```

### Optional Dependencies

```json
{
  "devDependencies": {
    "@storybook/react": "^8.5.7",
    "@storybook/addon-essentials": "^8.5.7",
    "chromatic": "^11.24.2",
    "@testing-library/react": "^16.1.3",
    "@testing-library/user-event": "^14.5.2",
    "vitest": "^3.4.3",
    "jest-axe": "^11.0.0"
  }
}
```

---

## 12. Success Metrics

### Week 1-2 Goals
- ✅ 10+ components implemented
- ✅ Form system with validation
- ✅ DataTable with sorting/pagination
- ✅ Charts migrated from hospital-dashboard

### Week 3-4 Goals
- ✅ 20+ components total
- ✅ Storybook documentation live
- ✅ All dashboards using @pet-to-you/ui

### Week 5+ Goals
- ✅ 30+ components total
- ✅ >80% test coverage
- ✅ WCAG 2.1 AA compliant
- ✅ <150KB bundle size

### Quality Targets
- **Accessibility:** WCAG 2.1 AA (all components)
- **Performance:** <100ms render time (95th percentile)
- **Bundle Size:** <150KB gzipped
- **Test Coverage:** >80% unit tests
- **Documentation:** 100% component coverage
- **TypeScript:** Strict mode, no `any` types

---

## 13. Next Steps

### Immediate Actions (This Week)

1. **Create Storybook setup**
   ```bash
   cd packages/ui
   npx storybook init
   ```

2. **Add dependencies**
   ```bash
   pnpm add react-hook-form @hookform/resolvers zod @tanstack/react-table
   pnpm add -D @storybook/react @testing-library/react vitest
   ```

3. **Start with forms** (highest impact)
   - Implement Form wrapper
   - Implement FormField
   - Implement Select component
   - Implement DatePicker

4. **Review with team**
   - Share plan with hospital-dashboard team
   - Get feedback on component APIs
   - Prioritize based on immediate needs

### Long-term Roadmap

**Q1 2026:**
- Complete HIGH PRIORITY components
- Migrate hospital-dashboard
- Set up CI/CD for component testing

**Q2 2026:**
- Complete MEDIUM PRIORITY components
- Migrate business-dashboard
- Migrate admin-dashboard

**Q3 2026:**
- Complete LOW PRIORITY components
- Performance optimization
- Accessibility audit

---

## 14. Resources & References

### Design Systems
- [shadcn/ui](https://ui.shadcn.com/) - Component inspiration
- [Radix UI](https://www.radix-ui.com/) - Primitives documentation
- [Tailwind CSS](https://tailwindcss.com/) - Styling reference

### Libraries
- [React Hook Form](https://react-hook-form.com/) - Form handling
- [Zod](https://zod.dev/) - Schema validation
- [TanStack Table](https://tanstack.com/table/) - Table features
- [Recharts](https://recharts.org/) - Charts documentation

### Testing
- [Testing Library](https://testing-library.com/) - Testing best practices
- [jest-axe](https://github.com/nickcolley/jest-axe) - Accessibility testing
- [Chromatic](https://www.chromatic.com/) - Visual regression testing

### Storybook
- [Storybook Docs](https://storybook.js.org/) - Component documentation
- [CSF3 Format](https://storybook.js.org/docs/react/api/csf) - Story syntax

---

## Conclusion

This plan provides a comprehensive roadmap for expanding the @pet-to-you/ui package from 7 basic components to a full-featured design system with 30+ components. The phased approach ensures:

1. **Immediate value** - High priority components deliver quick wins
2. **Consistency** - Shared components across all dashboards
3. **Maintainability** - Single source of truth for UI
4. **Scalability** - Extensible architecture for future needs
5. **Quality** - Testing, documentation, and accessibility built-in

**Estimated Timeline:** 5-6 weeks
**Team Size:** 2-3 developers
**Dependencies:** Design team for final styling review

---

**Document Owner:** UI Library Team
**Last Updated:** 2026-02-07
**Status:** ✅ Planning Complete - Ready for Implementation
