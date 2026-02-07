// Authentication and Authorization Types

export enum UserRole {
  // Hospital Roles
  HOSPITAL_ADMIN = "HOSPITAL_ADMIN",
  HOSPITAL_STAFF = "HOSPITAL_STAFF",
  HOSPITAL_VET = "HOSPITAL_VET",

  // Business Roles
  BUSINESS_OWNER = "BUSINESS_OWNER",
  BUSINESS_STAFF = "BUSINESS_STAFF",
  BUSINESS_MANAGER = "BUSINESS_MANAGER",

  // Platform Roles
  PLATFORM_ADMIN = "PLATFORM_ADMIN",
  PLATFORM_SUPPORT = "PLATFORM_SUPPORT",
}

export enum OrganizationType {
  HOSPITAL = "HOSPITAL",
  BUSINESS = "BUSINESS",
  PLATFORM = "PLATFORM",
}

export type Permission =
  // Booking Permissions
  | "booking:read"
  | "booking:create"
  | "booking:update"
  | "booking:delete"
  | "booking:approve"

  // Patient/Pet Permissions
  | "patient:read"
  | "patient:create"
  | "patient:update"
  | "patient:delete"
  | "patient:medical_records:read"
  | "patient:medical_records:write"

  // Medical Records (HIPAA-sensitive)
  | "medical:read"
  | "medical:write"
  | "medical:prescribe"
  | "medical:diagnosis"

  // Financial Permissions
  | "finance:read"
  | "finance:manage"
  | "finance:reports"

  // Staff Management
  | "staff:read"
  | "staff:create"
  | "staff:update"
  | "staff:delete"

  // Settings
  | "settings:read"
  | "settings:update"
  | "settings:security"

  // Reviews
  | "review:read"
  | "review:reply"
  | "review:moderate"

  // Analytics
  | "analytics:basic"
  | "analytics:advanced"
  | "analytics:export"

  // Platform Admin
  | "platform:admin"
  | "platform:manage_hospitals"
  | "platform:manage_businesses"
  | "platform:audit_logs";

export interface SessionUser {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  organizationId: string;
  organizationType: OrganizationType;
  permissions: Permission[];
  sessionId: string;
}

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: SessionUser;
  }

  interface User {
    id: string;
    email: string;
    name?: string;
    role: UserRole;
    organizationId: string;
    organizationType: OrganizationType;
    permissions: Permission[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    organizationId: string;
    organizationType: OrganizationType;
    permissions: Permission[];
    sessionId: string;
  }
}
