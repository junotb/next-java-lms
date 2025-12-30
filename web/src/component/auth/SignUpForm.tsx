"use client";

import { useForm } from "react-hook-form";
import { BetterError, SignUpEmailFormValues, SignUpEmailRequest } from "@/schema/auth";

interface SignUpFormProps {
  error: BetterError | null;
  onSubmit: (data: SignUpEmailRequest) => void;
}

export default function SignUpForm({ error, onSubmit }: SignUpFormProps) {
  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<SignUpEmailFormValues>({
    defaultValues: {
      email: "",
      password: "",
      name: "",
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

      <div className="flex flex-col gap-2 w-full">
        <label
          htmlFor="email"
          className="w-16 text-left text-sm font-medium text-gray-500"
        >
          이메일
        </label>
        <input
          type="text"
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
            minLength: {
              value: 8,
              message: "비밀번호는 최소 8자 이상이어야 합니다.",
            },
          })}
        />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <label
          htmlFor="name"
          className="w-16 text-left text-sm font-medium text-gray-500"
        >
          이름
        </label>
        <input
          type="text"
          className="border px-2 lg:px-4 py-2 w-full text-sm focus:border-blue-500 focus:ring-blue-500 rounded-md"
          {...register("name", {
            required: "이름을 입력하세요.",
            validate: (value) => value.trim().length > 0 || "이름을 입력하세요.",
          })}
        />
      </div>

      <button
        type="submit"
        className="mx-auto px-8 py-2 bg-blue-600 text-white rounded"
        disabled={isSubmitting}
      >
        회원가입
      </button>
      {error && (
        <p className="text-red-500 text-sm mt-2">
          {error.message || "회원가입 중 오류가 발생했습니다."}
        </p>
      )}
    </form>
  );
}