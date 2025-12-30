"use client";

import { useForm } from "react-hook-form";
import type { UserCreateRequest, UserCreateFormValues } from "@/schema/user/user";

interface UserCreateFormProps {
  onSubmit: (data: UserCreateRequest) => void;
}

export default function UserCreateForm({ onSubmit }: UserCreateFormProps) {
  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<UserCreateFormValues>({
    defaultValues: {
      email: "",
      password: "",
      name: "",
      role: undefined,
      status: undefined,
    },
    mode: "onSubmit",
  });

  return (
    <form
      onSubmit={handleSubmit((values) => {
        // 공백 제거
        const payload: UserCreateRequest = {
          ...values,
          email: values.email.trim(),
          password: values.password.trim(),
          name: values.name.trim(),
        };
        onSubmit(payload);
      })}
      className="flex flex-col gap-4 w-full"
    >
      <div className="flex space-x-4">
        <div className="flex flex-col items-end w-full">
          <div className="flex items-center gap-4 w-full">
            <label
              htmlFor="email"
              className="w-16 text-left text-sm font-medium text-gray-700"
            >
              아이디
            </label>
            <input
              id="email"
              type="text"
              className="border px-2 lg:px-4 py-2 w-28 lg:w-40 text-sm rounded-md"
              {...register("email", {
                required: "아이디를 입력하세요.",
                validate: (value) => value.trim().length > 0 || "아이디를 입력하세요.",
              })}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end w-full">
          <div className="flex items-center gap-4 w-full">
            <label
              htmlFor="password"
              className="w-16 text-left text-sm font-medium text-gray-700"
            >
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              className="border px-2 lg:px-4 py-2 w-28 lg:w-40 text-sm rounded-md"
              {...register("password", {
                required: "비밀번호를 입력하세요.",
                validate: (value) => value.trim().length > 0 || "비밀번호를 입력하세요.",
              })}
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end w-full">
        <div className="flex items-center gap-4 w-full">
          <label
            htmlFor="name"
            className="w-16 text-left text-sm font-medium text-gray-700"
          >
            이름
          </label>
          <input
            id="name"
            type="text"
            className="border px-2 lg:px-4 py-2 text-sm rounded-md"
            {...register("name", {
              required: "이름을 입력하세요.",
              validate: (value) => value.trim().length > 0 || "이름을 입력하세요.",
            })}
          />
        </div>
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="flex space-x-4">
        <div className="flex flex-col items-end w-full">
          <div className="flex items-center gap-4 w-full">
            <label
              htmlFor="role"
              className="w-16 text-left text-sm font-medium text-gray-700"
            >
              역할
            </label>
            <select
              id="role"
              className="border px-2 lg:px-4 py-2 w-28 lg:w-40 text-sm rounded-md"
              {...register("role", {
                required: "역할을 선택하세요.",
              })}
            >
              <option value="STUDENT">학생</option>
              <option value="TEACHER">강사</option>
              <option value="ADMIN">관리자</option>
            </select>
          </div>
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">
              {errors.role.message}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end w-full">
          <div className="flex items-center gap-4 w-full">
            <label
              htmlFor="status"
              className="w-16 text-left text-sm font-medium text-gray-700"
            >
              상태
            </label>
            <select
              id="status"
              className="border px-2 lg:px-4 py-2 w-28 lg:w-40 text-sm rounded-md"
              {...register("status", {
                required: "상태를 선택하세요.",
              })}
            >
              <option value="ACTIVE">활성</option>
              <option value="INACTIVE">비활성</option>
            </select>
          </div>
          {errors.status && (
            <p className="text-red-500 text-sm mt-1">
              {errors.status.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-4 w-full">
        <button
          type="submit"
          className="mt-4 mx-auto px-8 py-2 bg-blue-600 text-white rounded"
          disabled={isSubmitting}
        >
          등록
        </button>
      </div>
    </form>
  );
}