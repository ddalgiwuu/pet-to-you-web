import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import type { UserRole, OrganizationType, Permission } from "@/types/auth";

// Mock user database (replace with actual database in production)
const MOCK_USERS = [
  {
    id: "1",
    email: "admin@hospital.com",
    password: "admin123", // In production: use bcrypt hash
    name: "Hospital Admin",
    role: "HOSPITAL_ADMIN" as UserRole,
    organizationId: "hosp-001",
    organizationType: "HOSPITAL" as OrganizationType,
    isActive: true,
  },
  {
    id: "2",
    email: "staff@hospital.com",
    password: "staff123",
    name: "Hospital Staff",
    role: "HOSPITAL_STAFF" as UserRole,
    organizationId: "hosp-001",
    organizationType: "HOSPITAL" as OrganizationType,
    isActive: true,
  },
  {
    id: "3",
    email: "vet@hospital.com",
    password: "vet123",
    name: "Dr. Kim",
    role: "HOSPITAL_VET" as UserRole,
    organizationId: "hosp-001",
    organizationType: "HOSPITAL" as OrganizationType,
    isActive: true,
  },
];

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
      const isOnLogin = nextUrl.pathname.startsWith("/login");

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      }

      if (isLoggedIn && isOnLogin) {
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
        token.sessionId = crypto.randomUUID();
      }

      // Session update
      if (trigger === "update" && session) {
        token.permissions = session.permissions;
      }

      return token;
    },

    // Session Creation
    async session({ session, token }) {
      if (token && session.user) {
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
          console.error("Invalid credentials format");
          return null;
        }

        const { email, password, organizationType } = parsedCredentials.data;

        // Find user in mock database
        const user = MOCK_USERS.find(
          (u) =>
            u.email === email &&
            u.organizationType === organizationType &&
            u.isActive
        );

        if (!user) {
          console.error("User not found");
          return null;
        }

        // Verify password (simplified - use bcrypt in production)
        if (user.password !== password) {
          console.error("Invalid password");
          return null;
        }

        // Get permissions from ROLE_PERMISSIONS
        const { ROLE_PERMISSIONS } = await import("@/lib/permissions");
        const permissions = ROLE_PERMISSIONS[user.role] || [];

        console.log("✅ User authenticated:", {
          email: user.email,
          role: user.role,
          organizationType: user.organizationType,
        });

        // Return user with permissions
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          organizationId: user.organizationId,
          organizationType: user.organizationType,
          permissions,
        };
      },
    }),
  ],
};
