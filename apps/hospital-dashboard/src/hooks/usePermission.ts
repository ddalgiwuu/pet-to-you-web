"use client";

import { useAuth } from "./useAuth";
import { ROLE_PERMISSIONS } from "@/lib/permissions";
import type { Permission } from "@/types/auth";

export function usePermission(permission: Permission): boolean {
  const { user } = useAuth();

  if (!user) return false;

  const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
  return rolePermissions.includes(permission);
}
