"use client";

import { useForm } from "react-hook-form";
import { BetterError, SignInEmailFormValues, SignInEmailRequest } from "@/schema/auth";

interface SignInFormProps {
  error: BetterError | null;
  onSubmit: (data: SignInEmailRequest) => void;
}

export default function SignInForm({ error, onSubmit }: SignInFormProps) {
  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
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

      <div className="flex flex-col gap-2 w-full">
        <label
          htmlFor="username"
          className="w-16 text-left text-sm font-medium text-gray-500"
        >
          아이디
        </label>
        <input
          type="email"
          className="border px-2 lg:px-4 py-2 w-full text-sm focus:border-blue-500 focus:ring-blue-500 rounded-md"
          {...register("email", {
            required: "아이디를 입력하세요.",
            validate: (value) => value.trim().length > 0 || "아이디를 입력하세요.",
          })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">
            {errors.email.message}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2 w-full">
        <label
          htmlFor="password"
          className="w-16 text-left text-sm font-medium text-gray-500"
        >
          비밀번호
        </label>
        <input
          type="password"
          className="border px-2 lg:px-4 py-2 w-full text-sm focus:border-blue-500 focus:ring-blue-500 rounded-md"
          {...register("password", {
            required: "비밀번호를 입력하세요.",
            validate: (value) => value.trim().length > 0 || "비밀번호를 입력하세요.",
          })}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">
            {errors.password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="mx-auto px-8 py-2 bg-blue-600 text-white rounded"
        disabled={isSubmitting}
      >
        로그인
      </button>
      {error && (
        <p className="text-red-500 text-sm">
          {error.message}
        </p>
      )}
    </form>
  );
}