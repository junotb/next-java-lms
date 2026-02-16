import { createAuthClient } from "better-auth/react";
import { AUTH_CLIENT_BASE_URL } from "@/constants/api";

/**
 * Better Auth 클라이언트.
 * useSession, signIn, signUp, signOut 등 제공.
 */
export const authClient = createAuthClient({
  baseURL: AUTH_CLIENT_BASE_URL,
});