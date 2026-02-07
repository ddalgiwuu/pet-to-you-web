import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update: updateSession,
} = NextAuth({
  ...authConfig,

  // JWT Settings
  jwt: {
    maxAge: 60 * 60 * 8, // 8 hours
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
      },
    },
    csrfToken: {
      name: `__Host-next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  // Security Events
  events: {
    async signIn({ user }) {
      console.log("🔐 User signed in:", user.email);
    },

    async signOut() {
      console.log("🚪 User signed out");
    },
  },

  // Debug mode (only in development)
  debug: process.env.NODE_ENV === "development",
});
