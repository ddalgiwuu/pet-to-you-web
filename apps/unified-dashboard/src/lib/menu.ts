import type { MenuItem, UserRole } from '@/types'

export const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'LayoutDashboard',
    roles: [
      'HOSPITAL_ADMIN',
      'HOSPITAL_STAFF',
      'HOSPITAL_VET',
      'BUSINESS_ADMIN',
      'BUSINESS_STAFF',
      'BUSINESS_GROOMER',
    ],
  },
  // Hospital-specific pages
  {
    label: 'Patients',
    href: '/dashboard/patients',
    icon: 'Heart',
    roles: ['HOSPITAL_ADMIN', 'HOSPITAL_STAFF', 'HOSPITAL_VET'],
  },
  {
    label: 'Schedule',
    href: '/dashboard/schedule',
    icon: 'Calendar',
    roles: ['HOSPITAL_ADMIN', 'HOSPITAL_STAFF', 'HOSPITAL_VET'],
  },
  // Business-specific pages
  {
    label: 'Customers',
    href: '/dashboard/customers',
    icon: 'Users',
    roles: ['BUSINESS_ADMIN', 'BUSINESS_STAFF', 'BUSINESS_GROOMER'],
  },
  {
    label: 'Services',
    href: '/dashboard/services',
    icon: 'Briefcase',
    roles: ['BUSINESS_ADMIN', 'BUSINESS_STAFF'],
  },
  // Shared pages
  {
    label: 'Bookings',
    href: '/dashboard/bookings',
    icon: 'Calendar',
    roles: [
      'HOSPITAL_ADMIN',
      'HOSPITAL_STAFF',
      'HOSPITAL_VET',
      'BUSINESS_ADMIN',
      'BUSINESS_STAFF',
      'BUSINESS_GROOMER',
    ],
  },
  {
    label: 'Revenue',
    href: '/dashboard/revenue',
    icon: 'DollarSign',
    roles: ['HOSPITAL_ADMIN', 'BUSINESS_ADMIN'],
  },
  {
    label: 'Reviews',
    href: '/dashboard/reviews',
    icon: 'Star',
    roles: [
      'HOSPITAL_ADMIN',
      'HOSPITAL_STAFF',
      'BUSINESS_ADMIN',
      'BUSINESS_STAFF',
    ],
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: 'Settings',
    roles: [
      'HOSPITAL_ADMIN',
      'HOSPITAL_STAFF',
      'HOSPITAL_VET',
      'BUSINESS_ADMIN',
      'BUSINESS_STAFF',
      'BUSINESS_GROOMER',
    ],
  },
]

export const getMenuItemsForRole = (role: UserRole): MenuItem[] => {
  return menuItems.filter((item) => item.roles.includes(role))
}

export const isHospitalRole = (role: UserRole): boolean => {
  return role.startsWith('HOSPITAL')
}

export const isBusinessRole = (role: UserRole): boolean => {
  return role.startsWith('BUSINESS')
}

export const getRoleName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    HOSPITAL_ADMIN: 'Hospital Administrator',
    HOSPITAL_STAFF: 'Hospital Staff',
    HOSPITAL_VET: 'Veterinarian',
    BUSINESS_ADMIN: 'Business Owner',
    BUSINESS_STAFF: 'Business Staff',
    BUSINESS_GROOMER: 'Pet Groomer',
  }
  return roleNames[role]
}
