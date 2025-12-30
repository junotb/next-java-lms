import { UserRole } from "@/schema/user/user-role";
import { UserStatus } from "@/schema/user/user-status";

export type BetterError = {
  code?: string | undefined;
  message?: string | undefined;
  status: number;
  statusText: string;
};

// 이메일 로그인 요청
export type SignInEmailRequest = {
  email: string;
  password: string;
};

export type SignInEmailFormValues = SignInEmailRequest;

// 이메일 회원가입 요청
export type SignUpEmailRequest = {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  status: UserStatus;
};

export type SignUpEmailFormValues = SignUpEmailRequest;