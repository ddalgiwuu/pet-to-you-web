// RBAC Permissions Configuration

import { UserRole, type Permission } from "@/types/auth";

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  // Hospital Admin - Full hospital access
  HOSPITAL_ADMIN: [
    "booking:read", "booking:create", "booking:update", "booking:delete", "booking:approve",
    "patient:read", "patient:create", "patient:update", "patient:delete",
    "patient:medical_records:read", "patient:medical_records:write",
    "medical:read", "medical:write", "medical:diagnosis",
    "finance:read", "finance:manage", "finance:reports",
    "staff:read", "staff:create", "staff:update", "staff:delete",
    "settings:read", "settings:update", "settings:security",
    "review:read", "review:reply", "review:moderate",
    "analytics:basic", "analytics:advanced", "analytics:export",
  ],

  // Hospital Staff - Limited access
  HOSPITAL_STAFF: [
    "booking:read", "booking:create", "booking:update",
    "patient:read", "patient:create", "patient:update",
    "patient:medical_records:read",
    "medical:read",
    "review:read",
    "analytics:basic",
  ],

  // Hospital Veterinarian - Medical focus
  HOSPITAL_VET: [
    "booking:read", "booking:update",
    "patient:read", "patient:update",
    "patient:medical_records:read", "patient:medical_records:write",
    "medical:read", "medical:write", "medical:prescribe", "medical:diagnosis",
    "review:read",
    "analytics:basic",
  ],

  // Business Owner - Full business access
  BUSINESS_OWNER: [
    "booking:read", "booking:create", "booking:update", "booking:delete",
    "patient:read", "patient:create", "patient:update",
    "finance:read", "finance:reports",
    "staff:read", "staff:create", "staff:update", "staff:delete",
    "settings:read", "settings:update",
    "review:read", "review:reply",
    "analytics:basic", "analytics:advanced", "analytics:export",
  ],

  // Business Manager - Management access
  BUSINESS_MANAGER: [
    "booking:read", "booking:create", "booking:update",
    "patient:read", "patient:create", "patient:update",
    "finance:read", "finance:reports",
    "staff:read",
    "settings:read",
    "review:read", "review:reply",
    "analytics:basic", "analytics:advanced",
  ],

  // Business Staff - Basic access
  BUSINESS_STAFF: [
    "booking:read", "booking:create",
    "patient:read", "patient:create",
    "review:read",
    "analytics:basic",
  ],

  // Platform Admin - God mode
  PLATFORM_ADMIN: [
    "platform:admin",
    "platform:manage_hospitals",
    "platform:manage_businesses",
    "platform:audit_logs",
    "analytics:basic", "analytics:advanced", "analytics:export",
    "settings:read", "settings:update", "settings:security",
  ],

  // Platform Support - Support access
  PLATFORM_SUPPORT: [
    "platform:manage_hospitals",
    "platform:manage_businesses",
    "platform:audit_logs",
    "analytics:basic",
  ],
};

// Role Hierarchy (for permission inheritance)
export const ROLE_HIERARCHY: Record<UserRole, UserRole[]> = {
  HOSPITAL_ADMIN: [UserRole.HOSPITAL_STAFF, UserRole.HOSPITAL_VET],
  HOSPITAL_VET: [],
  HOSPITAL_STAFF: [],

  BUSINESS_OWNER: [UserRole.BUSINESS_MANAGER, UserRole.BUSINESS_STAFF],
  BUSINESS_MANAGER: [UserRole.BUSINESS_STAFF],
  BUSINESS_STAFF: [],

  PLATFORM_ADMIN: [UserRole.PLATFORM_SUPPORT],
  PLATFORM_SUPPORT: [],
};
