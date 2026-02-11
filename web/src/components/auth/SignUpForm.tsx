"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { BetterError } from "@/types/auth";
import type {
  SignUpEmailFormValues,
  SignUpEmailRequest,
} from "@/schemas/auth/auth";
import { SignUpEmailRequestSchema } from "@/schemas/auth/auth";
import InputField from "@/components/common/InputField";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SignUpFormProps {
  error: BetterError | null;
  onSubmit: (data: SignUpEmailRequest) => void;
}

/**
 * 회원가입 폼 컴포넌트
 * @param error - 서버/클라이언트 가입 오류 (표시용)
 * @param onSubmit - 유효한 폼 데이터로 제출 시 호출
 */
export default function SignUpForm({ error, onSubmit }: SignUpFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpEmailFormValues>({
    resolver: zodResolver(SignUpEmailRequestSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      role: "STUDENT",
      status: "ACTIVE",
    },
    mode: "onSubmit",
  });

  return (
    <form
      onSubmit={handleSubmit((values) => {
        const payload: SignUpEmailRequest = {
          email: values.email.trim(),
          password: values.password.trim(),
          name: values.name.trim(),
          role: "STUDENT",
          status: "ACTIVE",
        };

        onSubmit(payload);
      })}
      className="flex flex-col gap-4 items-center"
    >
      <h2 className="text-2xl font-bold text-center">회원가입</h2>

      <InputField
        id="email"
        label="이메일"
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
        autoComplete="new-password"
      />

      <InputField
        id="name"
        label="이름"
        type="text"
        register={register}
        errors={errors}
        autoComplete="name"
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
        회원가입
      </Button>
      {error && (
        <p className="text-destructive text-sm mt-2">
          {error.message || "회원가입 중 오류가 발생했습니다."}
        </p>
      )}
    </form>
  );
}
