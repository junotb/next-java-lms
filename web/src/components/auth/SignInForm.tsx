"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { BetterError } from "@/types/auth";
import type {
  SignInEmailFormValues,
  SignInEmailRequest,
} from "@/schemas/auth/auth";
import { SignInEmailRequestSchema } from "@/schemas/auth/auth";
import InputField from "@/components/common/InputField";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SignInFormProps {
  error: BetterError | null;
  onSubmit: (data: SignInEmailRequest) => void;
}

/**
 * 로그인 폼 컴포넌트
 * @param error - 서버/클라이언트 인증 오류 (표시용)
 * @param onSubmit - 유효한 폼 데이터로 제출 시 호출
 */
export default function SignInForm({ error, onSubmit }: SignInFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInEmailFormValues>({
    resolver: zodResolver(SignInEmailRequestSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  return (
    <form
      onSubmit={handleSubmit((values) => {
        const payload: SignInEmailRequest = {
          email: values.email.trim(),
          password: values.password.trim(),
        };

        onSubmit(payload);
      })}
      className="flex flex-col gap-4 items-center"
    >
      <h2 className="text-2xl font-bold text-center">로그인</h2>

      <InputField
        id="email"
        label="아이디"
        type="email"
        register={register}
        errors={errors}
        autoComplete="email"
      />

      <InputField
        id="password"
        label="비밀번호"
        type="password"
        register={register}
        errors={errors}
        autoComplete="current-password"
      />

      <Button
        type="submit"
        className={cn(
          "mt-4 w-full rounded-xl px-8 py-3 font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 disabled:shadow-none disabled:transform-none"
        )}
        disabled={isSubmitting}
      >
        {isSubmitting && (
          <span
            className="mr-2 inline-block size-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden
          />
        )}
        로그인
      </Button>
      {error && <p className="text-destructive text-sm">{error.message}</p>}
    </form>
  );
}
