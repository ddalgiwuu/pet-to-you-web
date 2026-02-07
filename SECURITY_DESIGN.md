# Security Design - Pet-to-You Dashboard Platform

## Executive Summary

Enterprise-grade authentication and authorization system for Pet-to-You dashboards with HIPAA-aware security, zero-trust architecture, and role-based access control (RBAC).

**Stack**: Next.js 16 (App Router) + NextAuth.js v5 (Auth.js) + JWT + PostgreSQL
**Security Level**: Enterprise (HIPAA-aware)
**Compliance**: OWASP Top 10, Zero Trust Architecture

---

## 1. NextAuth.js v5 Configuration

### 1.1 Core Authentication Strategy

```typescript
// auth.config.ts
import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },

  // JWT Strategy (Stateless)
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8, // 8 hours
    updateAge: 60 * 15, // Update every 15 minutes
  },

  // Security Callbacks
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      }

      if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      return true;
    },

    // JWT Token Creation/Update
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.organizationId = user.organizationId;
        token.organizationType = user.organizationType;
        token.permissions = user.permissions;
        token.sessionId = generateSessionId();
      }

      // Session update
      if (trigger === "update" && session) {
        token.permissions = session.permissions;
      }

      return token;
    },

    // Session Creation
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.organizationId = token.organizationId as string;
        session.user.organizationType = token.organizationType as OrganizationType;
        session.user.permissions = token.permissions as Permission[];
        session.user.sessionId = token.sessionId as string;
      }
      return session;
    },
  },

  // Providers
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        organizationType: { label: "Organization Type", type: "text" },
      },

      async authorize(credentials) {
        // Input Validation with Zod
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(8),
            organizationType: z.enum(["HOSPITAL", "BUSINESS"]),
          })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password, organizationType } = parsedCredentials.data;

        // Fetch user from database
        const user = await prisma.user.findUnique({
          where: {
            email,
            organizationType,
            isActive: true, // Only active users
          },
          include: {
            organization: true,
            rolePermissions: {
              include: {
                permissions: true,
              },
            },
          },
        });

        if (!user) {
          // Generic error to prevent user enumeration
          return null;
        }

        // Rate limiting check (implement with Redis)
        const rateLimitKey = `login:${email}`;
        const attempts = await redis.get(rateLimitKey);
        if (attempts && parseInt(attempts) >= 5) {
          throw new Error("TOO_MANY_ATTEMPTS");
        }

        // Password verification
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
          // Increment failed attempts
          await redis.incr(rateLimitKey);
          await redis.expire(rateLimitKey, 900); // 15 minutes
          return null;
        }

        // Clear rate limit on successful login
        await redis.del(rateLimitKey);

        // Audit log
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: "LOGIN_SUCCESS",
            ipAddress: req.headers.get("x-forwarded-for") || "unknown",
            userAgent: req.headers.get("user-agent") || "unknown",
          },
        });

        // Return user with permissions
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          organizationId: user.organizationId,
          organizationType: user.organizationType,
          permissions: user.rolePermissions.flatMap(rp =>
            rp.permissions.map(p => p.code)
          ),
        };
      },
    }),
  ],
};

// Helper function for session ID generation
function generateSessionId(): string {
  return crypto.randomUUID();
}
```

### 1.2 JWT Configuration

```typescript
// auth.ts
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update: updateSession,
} = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),

  // JWT Settings
  jwt: {
    maxAge: 60 * 60 * 8, // 8 hours

    // Custom JWT encoding/decoding for security
    encode: async ({ token, secret }) => {
      // Add custom claims
      const payload = {
        ...token,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 8), // 8 hours
      };

      return await jose.SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("8h")
        .sign(new TextEncoder().encode(secret));
    },

    decode: async ({ token, secret }) => {
      const { payload } = await jose.jwtVerify(
        token!,
        new TextEncoder().encode(secret)
      );
      return payload;
    },
  },

  // Cookie Settings (httpOnly, secure, sameSite)
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        domain: process.env.COOKIE_DOMAIN, // .pet-to-you.com
      },
    },
    csrfToken: {
      name: `__Host-next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
  },

  // Security Events
  events: {
    async signIn({ user, account, isNewUser }) {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: isNewUser ? "USER_REGISTERED" : "LOGIN_SUCCESS",
          metadata: { accountType: account?.type },
        },
      });
    },

    async signOut({ token }) {
      // Invalidate session
      await redis.del(`session:${token.sessionId}`);

      await prisma.auditLog.create({
        data: {
          userId: token.id as string,
          action: "LOGOUT",
        },
      });
    },

    async session({ session, token }) {
      // Track active sessions for security monitoring
      await redis.set(
        `session:${token.sessionId}`,
        JSON.stringify(session),
        "EX",
        60 * 60 * 8 // 8 hours
      );
    },
  },

  // Debug mode (only in development)
  debug: process.env.NODE_ENV === "development",
});
```

### 1.3 Token Refresh Mechanism

```typescript
// middleware.ts - Auto token refresh
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function middleware(request: Request) {
  const session = await auth();

  if (session?.user) {
    const token = session.user;
    const now = Math.floor(Date.now() / 1000);
    const tokenExp = token.exp as number;

    // Refresh if token expires in less than 15 minutes
    if (tokenExp - now < 900) {
      // Trigger silent refresh
      await updateSession({
        expires: new Date(Date.now() + 8 * 60 * 60 * 1000),
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
```

### 1.4 Logout Handling

```typescript
// app/api/auth/logout/route.ts
import { auth, signOut } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  // Invalidate all user sessions (optional - for security)
  await redis.del(`session:${session.user.sessionId}`);

  // Clear refresh token if using
  await prisma.refreshToken.deleteMany({
    where: { userId: session.user.id },
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "LOGOUT",
      ipAddress: request.headers.get("x-forwarded-for") || "unknown",
    },
  });

  // Sign out
  await signOut({ redirect: false });

  return NextResponse.json({ success: true });
}
```

---

## 2. RBAC Schema & Permissions

### 2.1 Role Definitions

```typescript
// types/auth.ts

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
```

### 2.2 Permissions Matrix

```typescript
// config/permissions.ts

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
```

### 2.3 Resource-Based Access Control

```typescript
// lib/rbac.ts

export interface ResourceContext {
  organizationId: string;
  organizationType: OrganizationType;
  resourceOwnerId?: string;
  resourceType?: string;
}

export class RBACService {
  /**
   * Check if user has permission
   */
  static hasPermission(
    userRole: UserRole,
    permission: Permission
  ): boolean {
    const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
    return rolePermissions.includes(permission);
  }

  /**
   * Check if user can access resource (organization-level)
   */
  static canAccessResource(
    user: SessionUser,
    resource: ResourceContext
  ): boolean {
    // Platform admins can access everything
    if (user.role === UserRole.PLATFORM_ADMIN) {
      return true;
    }

    // Organization type must match
    if (user.organizationType !== resource.organizationType) {
      return false;
    }

    // Must be same organization
    if (user.organizationId !== resource.organizationId) {
      return false;
    }

    return true;
  }

  /**
   * Check if user owns resource
   */
  static isResourceOwner(
    userId: string,
    resource: ResourceContext
  ): boolean {
    return userId === resource.resourceOwnerId;
  }

  /**
   * Advanced permission check with context
   */
  static async checkPermission(
    user: SessionUser,
    permission: Permission,
    resource?: ResourceContext
  ): Promise<boolean> {
    // Basic permission check
    if (!this.hasPermission(user.role, permission)) {
      return false;
    }

    // Resource-level check
    if (resource) {
      if (!this.canAccessResource(user, resource)) {
        return false;
      }

      // Some permissions require ownership
      const ownershipRequiredPermissions: Permission[] = [
        "patient:delete",
        "booking:delete",
        "staff:delete",
      ];

      if (ownershipRequiredPermissions.includes(permission)) {
        // Admins bypass ownership check
        if (
          user.role === UserRole.HOSPITAL_ADMIN ||
          user.role === UserRole.BUSINESS_OWNER ||
          user.role === UserRole.PLATFORM_ADMIN
        ) {
          return true;
        }

        // Check ownership
        return this.isResourceOwner(user.id, resource);
      }
    }

    return true;
  }

  /**
   * Get all permissions for user
   */
  static getUserPermissions(userRole: UserRole): Permission[] {
    const directPermissions = ROLE_PERMISSIONS[userRole] || [];
    const inheritedRoles = ROLE_HIERARCHY[userRole] || [];

    const inheritedPermissions = inheritedRoles.flatMap(
      role => ROLE_PERMISSIONS[role] || []
    );

    return Array.from(new Set([...directPermissions, ...inheritedPermissions]));
  }
}
```

---

## 3. Security Middleware

### 3.1 API Route Protection

```typescript
// middleware/auth.ts

import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function authMiddleware(request: NextRequest) {
  const session = await auth();

  // Check authentication
  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Attach user to request
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", session.user.id);
  requestHeaders.set("x-user-role", session.user.role);
  requestHeaders.set("x-org-id", session.user.organizationId);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Permission-based middleware
export function requirePermission(permission: Permission) {
  return async function middleware(request: NextRequest) {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const hasPermission = RBACService.hasPermission(
      session.user.role,
      permission
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    return NextResponse.next();
  };
}

// Organization-scoped middleware
export function requireOrganization(orgType: OrganizationType) {
  return async function middleware(request: NextRequest) {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.user.organizationType !== orgType) {
      return NextResponse.json(
        { error: "Forbidden - Wrong organization type" },
        { status: 403 }
      );
    }

    return NextResponse.next();
  };
}
```

### 3.2 API Route Example with Protection

```typescript
// app/api/bookings/route.ts

import { auth } from "@/auth";
import { RBACService } from "@/lib/rbac";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Check permission
  const canRead = await RBACService.checkPermission(
    session.user,
    "booking:read"
  );

  if (!canRead) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  // Filter by organization
  const bookings = await prisma.booking.findMany({
    where: {
      organizationId: session.user.organizationId,
    },
  });

  return NextResponse.json(bookings);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Check permission
  const canCreate = await RBACService.checkPermission(
    session.user,
    "booking:create"
  );

  if (!canCreate) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  const body = await request.json();

  // Validate input with Zod
  const validation = bookingSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: "Invalid input", details: validation.error },
      { status: 400 }
    );
  }

  // Create booking
  const booking = await prisma.booking.create({
    data: {
      ...validation.data,
      organizationId: session.user.organizationId,
      createdBy: session.user.id,
    },
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "BOOKING_CREATED",
      resourceType: "BOOKING",
      resourceId: booking.id,
    },
  });

  return NextResponse.json(booking, { status: 201 });
}
```

### 3.3 Server Component Auth

```typescript
// lib/auth-server.ts

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { RBACService } from "./rbac";

export async function requireAuth() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return session;
}

export async function requirePermission(permission: Permission) {
  const session = await requireAuth();

  const hasPermission = RBACService.hasPermission(
    session.user.role,
    permission
  );

  if (!hasPermission) {
    redirect("/unauthorized");
  }

  return session;
}

export async function requireRole(roles: UserRole[]) {
  const session = await requireAuth();

  if (!roles.includes(session.user.role)) {
    redirect("/unauthorized");
  }

  return session;
}

// Usage in Server Component
export default async function BookingsPage() {
  const session = await requirePermission("booking:read");

  const bookings = await prisma.booking.findMany({
    where: {
      organizationId: session.user.organizationId,
    },
  });

  return <BookingsList bookings={bookings} />;
}
```

### 3.4 Client Component Auth Hooks

```typescript
// hooks/useAuth.ts

"use client";

import { useSession } from "next-auth/react";
import { RBACService } from "@/lib/rbac";
import type { Permission } from "@/types/auth";

export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
  };
}

export function usePermission(permission: Permission) {
  const { user } = useAuth();

  if (!user) return false;

  return RBACService.hasPermission(user.role, permission);
}

export function usePermissions() {
  const { user } = useAuth();

  const hasPermission = (permission: Permission) => {
    if (!user) return false;
    return RBACService.hasPermission(user.role, permission);
  };

  const hasAnyPermission = (permissions: Permission[]) => {
    return permissions.some(hasPermission);
  };

  const hasAllPermissions = (permissions: Permission[]) => {
    return permissions.every(hasPermission);
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}

// Usage in Client Component
export function BookingActions({ bookingId }: { bookingId: string }) {
  const canUpdate = usePermission("booking:update");
  const canDelete = usePermission("booking:delete");

  return (
    <div>
      {canUpdate && <Button>Edit</Button>}
      {canDelete && <Button variant="destructive">Delete</Button>}
    </div>
  );
}
```

---

## 4. Security Headers & Configuration

### 4.1 Content Security Policy (CSP)

```typescript
// next.config.js

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live;
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https://*.cloudinary.com;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`;

module.exports = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\n/g, ""),
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};
```

### 4.2 CORS Configuration

```typescript
// middleware.ts - CORS handling

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const allowedOrigins = [
  "https://hospital.pet-to-you.com",
  "https://business.pet-to-you.com",
  "https://admin.pet-to-you.com",
  process.env.NODE_ENV === "development" ? "http://localhost:3000" : null,
  process.env.NODE_ENV === "development" ? "http://localhost:3001" : null,
].filter(Boolean) as string[];

export function corsMiddleware(request: NextRequest) {
  const origin = request.headers.get("origin");

  // Check if origin is allowed
  const isAllowedOrigin = origin && allowedOrigins.includes(origin);

  // Preflight request
  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 204 });

    if (isAllowedOrigin) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Credentials", "true");
      response.headers.set(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
      );
      response.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-CSRF-Token"
      );
      response.headers.set("Access-Control-Max-Age", "86400");
    }

    return response;
  }

  // Actual request
  const response = NextResponse.next();

  if (isAllowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }

  return response;
}
```

### 4.3 CSRF Protection

```typescript
// lib/csrf.ts

import { randomBytes } from "crypto";
import { cookies } from "next/headers";

const CSRF_TOKEN_LENGTH = 32;
const CSRF_COOKIE_NAME = "__Host-csrf-token";

export class CSRFProtection {
  static generateToken(): string {
    return randomBytes(CSRF_TOKEN_LENGTH).toString("hex");
  }

  static async setToken(): Promise<string> {
    const token = this.generateToken();

    cookies().set(CSRF_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
    });

    return token;
  }

  static async verifyToken(requestToken: string): Promise<boolean> {
    const cookieStore = cookies();
    const storedToken = cookieStore.get(CSRF_COOKIE_NAME)?.value;

    if (!storedToken || !requestToken) {
      return false;
    }

    // Constant-time comparison
    return timingSafeEqual(
      Buffer.from(storedToken),
      Buffer.from(requestToken)
    );
  }
}

// Middleware for CSRF protection
export async function csrfMiddleware(request: NextRequest) {
  // Skip for GET, HEAD, OPTIONS
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    return NextResponse.next();
  }

  const csrfToken = request.headers.get("x-csrf-token");

  if (!csrfToken) {
    return NextResponse.json(
      { error: "Missing CSRF token" },
      { status: 403 }
    );
  }

  const isValid = await CSRFProtection.verifyToken(csrfToken);

  if (!isValid) {
    return NextResponse.json(
      { error: "Invalid CSRF token" },
      { status: 403 }
    );
  }

  return NextResponse.next();
}

// Client-side CSRF hook
export function useCSRFToken() {
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    fetch("/api/csrf-token")
      .then(res => res.json())
      .then(data => setToken(data.token));
  }, []);

  return token;
}
```

### 4.4 XSS Prevention

```typescript
// lib/sanitization.ts

import DOMPurify from "isomorphic-dompurify";
import { z } from "zod";

export class InputSanitization {
  /**
   * Sanitize HTML content
   */
  static sanitizeHTML(dirty: string): string {
    return DOMPurify.sanitize(dirty, {
      ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br"],
      ALLOWED_ATTR: ["href", "target", "rel"],
    });
  }

  /**
   * Validate and sanitize with Zod
   */
  static createValidator<T extends z.ZodTypeAny>(schema: T) {
    return (data: unknown) => {
      const result = schema.safeParse(data);

      if (!result.success) {
        throw new ValidationError(result.error);
      }

      return result.data;
    };
  }

  /**
   * SQL injection prevention (via parameterized queries)
   * Always use Prisma with parameterized queries
   */
  static sanitizeSQL(input: string): string {
    // Never build raw SQL - use Prisma
    // This is a fallback for edge cases
    return input.replace(/['";\\]/g, "");
  }
}

// Zod schemas for common inputs
export const schemas = {
  email: z.string().email().toLowerCase().trim(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  name: z.string().min(1).max(100).trim(),
  password: z.string().min(8).max(128),
  url: z.string().url(),
};
```

---

## 5. Implementation Checklist

### 5.1 Dependencies

```json
{
  "dependencies": {
    "next": "^16.1.3",
    "next-auth": "^5.0.0-beta.20",
    "@auth/prisma-adapter": "^2.7.4",
    "@prisma/client": "^6.2.1",
    "bcryptjs": "^2.4.3",
    "jose": "^5.9.6",
    "zod": "^3.24.1",
    "redis": "^4.8.1",
    "isomorphic-dompurify": "^2.21.0"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "prisma": "^6.2.1"
  }
}
```

### 5.2 Environment Variables

```bash
# .env.local

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-min-32-chars-long-random

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/pet_to_you

# Redis (for rate limiting and sessions)
REDIS_URL=redis://localhost:6379

# Security
COOKIE_DOMAIN=.pet-to-you.com
ALLOWED_ORIGINS=https://hospital.pet-to-you.com,https://business.pet-to-you.com

# Optional: OAuth providers
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### 5.3 Database Schema (Prisma)

```prisma
// prisma/schema.prisma

model User {
  id                String            @id @default(cuid())
  email             String            @unique
  emailVerified     DateTime?
  name              String?
  passwordHash      String
  role              UserRole
  organizationId    String
  organizationType  OrganizationType
  isActive          Boolean           @default(true)
  lastLoginAt       DateTime?

  organization      Organization      @relation(fields: [organizationId], references: [id])
  sessions          Session[]
  refreshTokens     RefreshToken[]
  auditLogs         AuditLog[]

  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt

  @@index([email, organizationType])
  @@index([organizationId])
}

model Organization {
  id                String            @id @default(cuid())
  name              String
  type              OrganizationType
  isActive          Boolean           @default(true)

  users             User[]

  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt
}

model Session {
  id                String            @id @default(cuid())
  sessionToken      String            @unique
  userId            String
  expires           DateTime

  user              User              @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model RefreshToken {
  id                String            @id @default(cuid())
  token             String            @unique
  userId            String
  expiresAt         DateTime

  user              User              @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt         DateTime          @default(now())

  @@index([userId])
}

model AuditLog {
  id                String            @id @default(cuid())
  userId            String
  action            String
  resourceType      String?
  resourceId        String?
  ipAddress         String?
  userAgent         String?
  metadata          Json?

  user              User              @relation(fields: [userId], references: [id])

  createdAt         DateTime          @default(now())

  @@index([userId])
  @@index([action])
  @@index([createdAt])
}

enum UserRole {
  HOSPITAL_ADMIN
  HOSPITAL_STAFF
  HOSPITAL_VET
  BUSINESS_OWNER
  BUSINESS_STAFF
  BUSINESS_MANAGER
  PLATFORM_ADMIN
  PLATFORM_SUPPORT
}

enum OrganizationType {
  HOSPITAL
  BUSINESS
  PLATFORM
}
```

### 5.4 Code Examples

**Login Page**:
```typescript
// app/(auth)/login/page.tsx
"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      organizationType: formData.get("organizationType"),
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid credentials");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" required />
      <input type="password" name="password" required />
      <select name="organizationType" required>
        <option value="HOSPITAL">Hospital</option>
        <option value="BUSINESS">Business</option>
      </select>
      {error && <p>{error}</p>}
      <button type="submit">Sign In</button>
    </form>
  );
}
```

### 5.5 Testing Strategy

**Unit Tests**:
- RBAC permission checks
- JWT token generation/validation
- Input sanitization
- CSRF token validation

**Integration Tests**:
- Authentication flow
- Session management
- API route protection
- Middleware chains

**Security Tests**:
- SQL injection prevention
- XSS prevention
- CSRF attack prevention
- Rate limiting
- Session hijacking prevention
- Privilege escalation attempts

**E2E Tests** (Playwright):
- Login flow
- Role-based UI rendering
- Protected route access
- Logout flow
- Session expiration

---

## 6. Security Best Practices Summary

✅ **Authentication**:
- JWT with httpOnly cookies
- 8-hour session expiration
- Automatic token refresh
- Secure password hashing (bcrypt)
- Rate limiting on login attempts

✅ **Authorization**:
- Role-based access control (RBAC)
- Resource-based access control
- Organization-scoped access
- Permission hierarchy
- Audit logging

✅ **Security Headers**:
- Content Security Policy (CSP)
- HSTS
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy

✅ **Input Validation**:
- Zod schema validation
- DOMPurify sanitization
- SQL injection prevention (Prisma)
- XSS prevention

✅ **CSRF Protection**:
- CSRF tokens on mutations
- SameSite cookies
- Origin validation

✅ **Monitoring**:
- Audit logs
- Failed login tracking
- Session monitoring
- Suspicious activity detection

---

## 7. Migration Path

### Phase 1: Setup (Week 1)
1. Install dependencies
2. Configure NextAuth.js
3. Set up database schema
4. Create RBAC system

### Phase 2: Implementation (Week 2)
1. Implement authentication flows
2. Add middleware protection
3. Create auth hooks
4. Set up security headers

### Phase 3: Testing (Week 3)
1. Write unit tests
2. Integration tests
3. Security audit
4. Penetration testing

### Phase 4: Deployment (Week 4)
1. Production configuration
2. Security monitoring setup
3. Documentation
4. Team training

---

## 8. Support & Maintenance

**Regular Security Audits**: Quarterly
**Dependency Updates**: Monthly
**Penetration Testing**: Bi-annually
**Compliance Review**: Annually

**Security Incident Response**:
1. Detect and isolate
2. Assess impact
3. Contain and remediate
4. Document and report
5. Post-mortem analysis

---

**Document Version**: 1.0
**Last Updated**: 2026-02-07
**Owner**: Security Team
**Classification**: Internal Use Only
