import { z } from "zod";
import { UserRole, UserRoleSchema } from "@/schema/user/user-role";
import { UserStatus, UserStatusSchema } from "@/schema/user/user-status";

export type BetterError = {
  code?: string | undefined;
  message?: string | undefined;
  status: number;
  statusText: string;
};

// 이메일 로그인 요청 스키마
export const SignInEmailRequestSchema = z.object({
  email: z.string().email("유효한 이메일 주소를 입력하세요."),
  password: z.string().min(1, "비밀번호를 입력하세요."),
});

export type SignInEmailRequest = z.infer<typeof SignInEmailRequestSchema>;
export type SignInEmailFormValues = SignInEmailRequest;

// 이메일 회원가입 요청 스키마
export const SignUpEmailRequestSchema = z.object({
  email: z.string().email("유효한 이메일 주소를 입력하세요."),
  password: z.string().min(8, "비밀번호는 최소 8자 이상이어야 합니다."),
  name: z.string().min(1, "이름을 입력하세요."),
  role: UserRoleSchema,
  status: UserStatusSchema,
});

export type SignUpEmailRequest = z.infer<typeof SignUpEmailRequestSchema>;
export type SignUpEmailFormValues = SignUpEmailRequest;
