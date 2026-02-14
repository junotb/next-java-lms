import { betterAuth } from "better-auth";
import { Pool } from "pg";
import {
  SESSION_EXPIRES_IN,
  COOKIE_CACHE_MAX_AGE,
  DEFAULT_USER_ROLE,
  DEFAULT_USER_STATUS,
  DATABASE_POOL_MAX,
} from "@/constants/auth";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
    max: DATABASE_POOL_MAX,
    ssl: { rejectUnauthorized: false },
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: DEFAULT_USER_ROLE,
      },
      status: {
        type: "string",
        defaultValue: DEFAULT_USER_STATUS,
      },
    },
    updateUser: {
      allowUserUpdate: async () => true,
    },
  },
  session: {
    expiresIn: SESSION_EXPIRES_IN,
    cookieCache: {
      enabled: true,
      maxAge: COOKIE_CACHE_MAX_AGE,
      include: ["user.role"],
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    },
    naver: {
      clientId: process.env.NAVER_CLIENT_ID ?? "",
      clientSecret: process.env.NAVER_CLIENT_SECRET ?? "",
    },
    kakao: {
      clientId: process.env.KAKAO_CLIENT_ID ?? "",
      clientSecret: process.env.KAKAO_CLIENT_SECRET ?? "",
    },
  },
});
