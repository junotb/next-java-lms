import { createAuthClient } from "better-auth/react";
import { AUTH_CLIENT_BASE_URL } from "@/constants/api";

export const authClient = createAuthClient({
  baseURL: AUTH_CLIENT_BASE_URL,
});