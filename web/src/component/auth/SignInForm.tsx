"use client";

import { useForm } from "react-hook-form";
import type {
  BetterError,
  SignInEmailFormValues,
  SignInEmailRequest,
} from "@/schema/auth";
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
        validation={{ required: "아이디를 입력하세요." }}
      />

      <InputField
        id="password"
        label="비밀번호"
        type="password"
        register={register}
        errors={errors}
        validation={{ required: "비밀번호를 입력하세요." }}
      />

      <Button
        type="submit"
        className={cn(
          "mt-4 w-full rounded-xl px-8 py-3 font-bold shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 disabled:shadow-none disabled:transform-none",
          "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"
        )}
        disabled={isSubmitting}
      >
        로그인
      </Button>
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </form>
  );
}
