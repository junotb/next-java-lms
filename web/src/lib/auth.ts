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
  },
  session: {
    expiresIn: SESSION_EXPIRES_IN,
    cookieCache: {
      enabled: true,
      maxAge: COOKIE_CACHE_MAX_AGE,
      include: ["user.role"], // 캐시에 유저의 권한 정보 포함
    },
  },
  emailAndPassword: {
    enabled: true,
  },
});
