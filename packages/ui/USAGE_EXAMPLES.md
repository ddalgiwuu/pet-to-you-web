# @pet-to-you/ui - Usage Examples

Complete usage examples for all HIGH PRIORITY components.

---

## 📝 Form Components

### Basic Form with Validation

```tsx
import { Form, FormField, Input, Select, DatePicker, Textarea, Button } from "@pet-to-you/ui"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1, "이름은 필수입니다"),
  email: z.string().email("올바른 이메일을 입력하세요"),
  category: z.string(),
  date: z.date(),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof schema>

function MyForm() {
  const handleSubmit = async (data: FormData) => {
    console.log(data)
    // API call here
  }

  return (
    <Form schema={schema} onSubmit={handleSubmit}>
      {({ register, formState: { errors } }) => (
        <div className="space-y-4">
          <FormField
            name="name"
            label="이름"
            required
            error={errors.name?.message}
          >
            <Input {...register("name")} placeholder="홍길동" />
          </FormField>

          <FormField
            name="email"
            label="이메일"
            required
            error={errors.email?.message}
          >
            <Input
              type="email"
              {...register("email")}
              placeholder="example@example.com"
            />
          </FormField>

          <FormField
            name="category"
            label="카테고리"
            error={errors.category?.message}
          >
            <Select
              {...register("category")}
              options={[
                { value: "cat", label: "고양이" },
                { value: "dog", label: "강아지" },
              ]}
              placeholder="선택하세요"
            />
          </FormField>

          <FormField
            name="date"
            label="날짜"
            error={errors.date?.message}
          >
            <DatePicker {...register("date")} />
          </FormField>

          <FormField name="notes" label="메모">
            <Textarea
              {...register("notes")}
              placeholder="추가 메모..."
              rows={4}
            />
          </FormField>

          <Button type="submit" className="w-full">
            제출
          </Button>
        </div>
      )}
    </Form>
  )
}
```

### Checkbox and Radio Groups

```tsx
import { FormField, Checkbox, RadioGroup } from "@pet-to-you/ui"

function PreferencesForm() {
  return (
    <>
      <FormField name="newsletter" label="구독">
        <Checkbox
          {...register("newsletter")}
          label="뉴스레터 구독"
        />
      </FormField>

      <FormField name="gender" label="성별">
        <RadioGroup
          {...register("gender")}
          options={[
            { value: "male", label: "남성" },
            { value: "female", label: "여성" },
            { value: "other", label: "기타" },
          ]}
        />
      </FormField>
    </>
  )
}
```

---

## 📊 Advanced DataTable

### Full-Featured Table

```tsx
import { AdvancedDataTable } from "@pet-to-you/ui"
import { ColumnDef } from "@tanstack/react-table"

interface Booking {
  id: string
  petName: string
  service: string
  date: string
  status: "pending" | "confirmed" | "completed"
  amount: number
}

function BookingsTable() {
  const columns: ColumnDef<Booking>[] = [
    {
      accessorKey: "petName",
      header: "반려동물",
    },
    {
      accessorKey: "service",
      header: "서비스",
    },
    {
      accessorKey: "date",
      header: "날짜",
    },
    {
      accessorKey: "status",
      header: "상태",
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.status === "completed"
              ? "success"
              : row.original.status === "confirmed"
              ? "default"
              : "warning"
          }
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "amount",
      header: "금액",
      cell: ({ row }) => `${row.original.amount.toLocaleString()}원`,
    },
  ]

  const data: Booking[] = [
    {
      id: "1",
      petName: "뽀삐",
      service: "미용",
      date: "2026-02-08",
      status: "confirmed",
      amount: 50000,
    },
    // ... more data
  ]

  return (
    <AdvancedDataTable
      columns={columns}
      data={data}
      enableSorting
      enablePagination
      pageSize={10}
      pageSizeOptions={[10, 20, 50]}
    />
  )
}
```

### Table with Row Selection

```tsx
function SelectableTable() {
  const handleSelectionChange = (selectedRows: Booking[]) => {
    console.log("Selected:", selectedRows)
  }

  return (
    <AdvancedDataTable
      columns={columns}
      data={data}
      enableRowSelection
      onRowSelectionChange={handleSelectionChange}
    />
  )
}
```

---

## 📈 Chart Components

### Revenue Chart

```tsx
import { RevenueChart } from "@pet-to-you/ui"

function DashboardRevenue() {
  const revenueData = [
    { date: "월", amount: 350000 },
    { date: "화", amount: 420000 },
    { date: "수", amount: 380000 },
    { date: "목", amount: 510000 },
    { date: "금", amount: 620000 },
    { date: "토", amount: 750000 },
    { date: "일", amount: 680000 },
  ]

  return (
    <RevenueChart
      data={revenueData}
      title="주간 수익"
      height={300}
      color="#3b82f6"
      formatValue={(v) => `${v.toLocaleString()}원`}
    />
  )
}
```

### Stats Chart (Bar/Line)

```tsx
import { StatsChart } from "@pet-to-you/ui"

function ServiceStats() {
  const statsData = [
    { name: "미용", value: 45 },
    { name: "진료", value: 32 },
    { name: "호텔", value: 18 },
    { name: "훈련", value: 12 },
  ]

  return (
    <>
      {/* Bar Chart */}
      <StatsChart
        data={statsData}
        title="서비스별 예약 수"
        type="bar"
        height={200}
        color="#10b981"
      />

      {/* Line Chart */}
      <StatsChart
        data={statsData}
        title="월별 추이"
        type="line"
        height={200}
        color="#3b82f6"
      />
    </>
  )
}
```

### Donut Chart

```tsx
import { DonutChart } from "@pet-to-you/ui"

function CategoryDistribution() {
  const donutData = [
    { name: "강아지", value: 65, color: "#3b82f6" },
    { name: "고양이", value: 30, color: "#10b981" },
    { name: "기타", value: 5, color: "#f59e0b" },
  ]

  return (
    <DonutChart
      data={donutData}
      title="반려동물 분포"
      size={200}
      centerText="총 100"
    />
  )
}
```

---

## 🎴 Card Components

### Stats Card

```tsx
import { StatsCard } from "@pet-to-you/ui"
import { TrendingUp, Users, Calendar, DollarSign } from "lucide-react"

function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="총 예약"
        value="124"
        change={12.5}
        icon={Calendar}
        index={0}
      />

      <StatsCard
        title="신규 고객"
        value="42"
        change={8.2}
        trend="up"
        icon={Users}
        index={1}
      />

      <StatsCard
        title="주간 수익"
        value="₩3,710,000"
        change={-2.4}
        trend="down"
        icon={DollarSign}
        index={2}
      />

      <StatsCard
        title="고객 만족도"
        value="4.8/5.0"
        icon={TrendingUp}
        index={3}
      />
    </div>
  )
}
```

### Info Card

```tsx
import { InfoCard, Button } from "@pet-to-you/ui"

function HospitalInfo() {
  return (
    <InfoCard
      title="병원 정보"
      description="기본 정보 및 영업 시간"
      footer={
        <Button variant="outline" size="sm">
          수정
        </Button>
      }
    >
      <div className="space-y-2 text-sm">
        <p><strong>주소:</strong> 서울시 강남구...</p>
        <p><strong>전화:</strong> 02-1234-5678</p>
        <p><strong>영업시간:</strong> 09:00 - 18:00</p>
      </div>
    </InfoCard>
  )
}
```

### Action Card

```tsx
import { ActionCard } from "@pet-to-you/ui"
import { Plus } from "lucide-react"

function QuickActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <ActionCard
        title="새 예약 등록"
        description="고객 예약을 빠르게 추가하세요"
        icon={Plus}
        action={{
          label: "예약 추가",
          onClick: () => console.log("Add booking"),
          variant: "default",
        }}
      />

      <ActionCard
        title="고객 관리"
        description="고객 정보를 확인하고 수정하세요"
        action={{
          label: "고객 보기",
          onClick: () => console.log("View customers"),
          variant: "outline",
        }}
      />
    </div>
  )
}
```

---

## 💬 Dialog Component

### Basic Dialog

```tsx
import { Dialog, Button } from "@pet-to-you/ui"
import { useState } from "react"

function DeleteConfirmDialog() {
  const [open, setOpen] = useState(false)

  const handleDelete = () => {
    console.log("Deleting...")
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button variant="destructive">삭제</Button>
      }
      title="정말 삭제하시겠습니까?"
      description="이 작업은 되돌릴 수 없습니다."
      footer={
        <>
          <Button variant="outline" onClick={() => setOpen(false)}>
            취소
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            삭제
          </Button>
        </>
      }
    >
      <p className="text-sm text-gray-600">
        선택한 항목이 영구적으로 삭제됩니다.
      </p>
    </Dialog>
  )
}
```

### Form Dialog

```tsx
function EditBookingDialog({ booking }: { booking: Booking }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      trigger={<Button size="sm">수정</Button>}
      title="예약 수정"
      description="예약 정보를 수정하세요"
      size="lg"
    >
      <Form
        schema={bookingSchema}
        onSubmit={async (data) => {
          await updateBooking(data)
          setOpen(false)
        }}
        defaultValues={booking}
      >
        {({ register, formState: { errors } }) => (
          <div className="space-y-4">
            <FormField name="service" label="서비스" error={errors.service?.message}>
              <Select
                {...register("service")}
                options={serviceOptions}
              />
            </FormField>

            <FormField name="date" label="날짜" error={errors.date?.message}>
              <DatePicker {...register("date")} />
            </FormField>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                취소
              </Button>
              <Button type="submit">
                저장
              </Button>
            </div>
          </div>
        )}
      </Form>
    </Dialog>
  )
}
```

---

## 🎨 Complete Dashboard Example

```tsx
import {
  StatsCard,
  RevenueChart,
  AdvancedDataTable,
  Dialog,
  Button,
  Badge,
} from "@pet-to-you/ui"
import { Calendar, Users, DollarSign, TrendingUp } from "lucide-react"

function DashboardPage() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">대시보드</h1>
        <Dialog
          trigger={<Button>새 예약</Button>}
          title="예약 추가"
          description="새 예약을 등록하세요"
        >
          {/* Form content */}
        </Dialog>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="총 예약"
          value="124"
          change={12.5}
          icon={Calendar}
          index={0}
        />
        <StatsCard
          title="신규 고객"
          value="42"
          change={8.2}
          icon={Users}
          index={1}
        />
        <StatsCard
          title="주간 수익"
          value="₩3,710,000"
          change={-2.4}
          icon={DollarSign}
          index={2}
        />
        <StatsCard
          title="고객 만족도"
          value="4.8/5.0"
          icon={TrendingUp}
          index={3}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart
          data={revenueData}
          title="주간 수익"
          height={300}
        />
        <StatsChart
          data={serviceStats}
          title="서비스별 예약 수"
          type="bar"
          height={300}
        />
      </div>

      {/* Bookings Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4">최근 예약</h2>
        <AdvancedDataTable
          columns={bookingColumns}
          data={bookings}
          enableSorting
          enablePagination
          pageSize={10}
        />
      </div>
    </div>
  )
}
```

---

## 🎯 TypeScript Tips

### Type-Safe Form Data

```tsx
// Define schema
const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  age: z.number().min(18),
})

// Infer type from schema
type UserFormData = z.infer<typeof userSchema>

// Use in form
function UserForm() {
  const handleSubmit = async (data: UserFormData) => {
    // data is fully typed!
    console.log(data.name) // string
    console.log(data.email) // string
    console.log(data.age) // number
  }

  return <Form schema={userSchema} onSubmit={handleSubmit}>...</Form>
}
```

### Generic DataTable Columns

```tsx
interface Product {
  id: string
  name: string
  price: number
  stock: number
}

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "상품명",
    // cell has full type safety
    cell: ({ row }) => row.original.name.toUpperCase(),
  },
  {
    accessorKey: "price",
    header: "가격",
    cell: ({ row }) => `${row.original.price.toLocaleString()}원`,
  },
]

<AdvancedDataTable<Product, any>
  columns={columns}
  data={products}
/>
```

---

## ♿ Accessibility Best Practices

All components follow WCAG 2.1 AA standards:

1. **Keyboard Navigation**: All interactive elements are keyboard accessible
2. **Screen Readers**: Proper ARIA labels and roles
3. **Focus Management**: Clear focus indicators
4. **Error Messages**: `role="alert"` for form errors
5. **Semantic HTML**: Proper heading hierarchy

### Example: Accessible Form

```tsx
<Form schema={schema} onSubmit={handleSubmit}>
  {({ register, formState: { errors } }) => (
    <>
      {/* Proper label association */}
      <FormField
        name="email"
        label="이메일"
        required
        error={errors.email?.message}
      >
        <Input
          {...register("email")}
          type="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
      </FormField>

      {/* Error with role="alert" */}
      {errors.email && (
        <p id="email-error" role="alert" className="text-red-500">
          {errors.email.message}
        </p>
      )}
    </>
  )}
</Form>
```

---

## 🚀 Performance Tips

1. **Lazy Load Heavy Components**:
   ```tsx
   const AdvancedDataTable = lazy(() =>
     import("@pet-to-you/ui").then((m) => ({ default: m.AdvancedDataTable }))
   )
   ```

2. **Memoize Expensive Columns**:
   ```tsx
   const columns = useMemo(() => [
     // column definitions
   ], [])
   ```

3. **Debounce Search Inputs**:
   ```tsx
   const debouncedSearch = useDebouncedValue(searchTerm, 300)
   ```

4. **Virtualize Large Tables**:
   ```tsx
   // For 1000+ rows, consider react-virtual
   import { useVirtual } from "react-virtual"
   ```

---

## 📦 Bundle Size Impact

Approximate gzipped sizes:

- **Forms**: ~18KB (with RHF + Zod)
- **AdvancedDataTable**: ~32KB (with TanStack Table)
- **Charts**: ~40KB (with Recharts, peer dependency)
- **Cards**: ~5KB
- **Dialog**: ~8KB
- **Total**: ~103KB (excluding Recharts peer dep)

**Target**: <150KB ✅

---

For more examples, see the Storybook documentation or check the component source code.
