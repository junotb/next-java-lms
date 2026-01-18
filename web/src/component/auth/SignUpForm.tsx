"use client";

import { useForm } from "react-hook-form";
import type {
  BetterError,
  SignUpEmailFormValues,
  SignUpEmailRequest,
} from "@/schema/auth";
import InputField from "@/component/common/InputField";

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

      <InputField
        id="email"
        label="이메일"
        type="email"
        register={register}
        errors={errors}
        validation={{
          required: "이메일을 입력하세요.",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "유효한 이메일 주소를 입력하세요.",
          },
        }}
      />

      <InputField
        id="password"
        label="비밀번호"
        type="password"
        register={register}
        errors={errors}
        validation={{
          required: "비밀번호를 입력하세요.",
          minLength: {
            value: 8,
            message: "비밀번호는 최소 8자 이상이어야 합니다.",
          },
        }}
      />

      <InputField
        id="name"
        label="이름"
        type="text"
        register={register}
        errors={errors}
        validation={{
          required: "이름을 입력하세요.",
        }}
      />

      <button
        type="submit"
        className="mt-4 w-full rounded-xl bg-blue-600 px-8 py-3 font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-blue-300 disabled:shadow-none disabled:transform-none"
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
