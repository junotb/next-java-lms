"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { BetterError } from "@/types/auth";
import type {
  SignUpEmailFormValues,
  SignUpEmailRequest,
} from "@/schema/auth/auth";
import { SignUpEmailRequestSchema } from "@/schema/auth/auth";
import InputField from "@/component/common/InputField";
import { Button } from "@/component/ui/button";
import { cn } from "@/lib/utils";

interface SignUpFormProps {
  error: BetterError | null;
  onSubmit: (data: SignUpEmailRequest) => void;
}

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
        // 공백 제거
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
      />

      <InputField
        id="password"
        label="비밀번호"
        type="password"
        register={register}
        errors={errors}
      />

      <InputField
        id="name"
        label="이름"
        type="text"
        register={register}
        errors={errors}
      />

      <Button
        type="submit"
        className={cn(
          "mt-4 w-full rounded-xl px-8 py-3 font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 disabled:shadow-none disabled:transform-none"
        )}
        disabled={isSubmitting}
      >
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
