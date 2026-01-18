import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    ssl: { rejectUnauthorized: false },
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "STUDENT",
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5분 동안 DB 조회 없이 쿠키로 세션 유지
      include: ["user.role"], // 캐시에 유저의 권한 정보 포함
    },
  },
  emailAndPassword: {
    enabled: true,
  },
});
