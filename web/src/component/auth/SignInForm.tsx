"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { BetterError } from "@/types/auth";
import type {
  SignInEmailFormValues,
  SignInEmailRequest,
} from "@/schema/auth/auth";
import { SignInEmailRequestSchema } from "@/schema/auth/auth";
import InputField from "@/component/common/InputField";
import { Button } from "@/component/ui/button";
import { cn } from "@/lib/utils";

interface SignInFormProps {
  error: BetterError | null;
  onSubmit: (data: SignInEmailRequest) => void;
}

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
        // 공백 제거
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
      />

      <InputField
        id="password"
        label="비밀번호"
        type="password"
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
        로그인
      </Button>
      {error && <p className="text-destructive text-sm">{error.message}</p>}
    </form>
  );
}
