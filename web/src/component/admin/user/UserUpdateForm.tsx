"use client";

import { useForm } from "react-hook-form";
import { User } from "@/schema/user/user";
import type { UserProfileUpdateRequest, UserProfileUpdateFormValues } from "@/schema/user/user";

interface UserUpdateFormProps {
  user: User;
  onSubmit: (data: UserProfileUpdateRequest) => void;
  onDelete: () => void;
}

export default function UserUpdateForm({ user, onSubmit, onDelete }: UserUpdateFormProps) {
  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting
    },
  } = useForm<UserProfileUpdateFormValues>({
    defaultValues: {
      name: user.name,
      role: user.role,
      status: user.status,
    },
    mode: "onSubmit",
  });

  return (
    <form
      onSubmit={handleSubmit((values) => {
        // 공백 제거
        const payload: UserProfileUpdateRequest = {
          ...values,
          name: values.name.trim(),
        };
        onSubmit(payload);
      })}
      className="flex flex-col gap-4 w-full"
    >
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
            className="border px-2 lg:px-4 py-2 disabled:bg-gray-200 text-sm rounded-md"
            defaultValue={user.email}
            disabled={true}
          />
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

      <div className="flex justify-center gap-4 w-full">
        <button
          type="submit"
          className="mt-4 px-8 py-2 bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded"
          disabled={isSubmitting}
        >
          수정
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="mt-4 px-8 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          삭제
        </button>
      </div>
    </form>
  );
}