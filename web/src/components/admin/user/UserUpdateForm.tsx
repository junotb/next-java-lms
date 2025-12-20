"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserProfileUpdateRequest } from "@/schemas/user";
import { User } from "@/schemas/user";

interface UserUpdateFormProps {
  user: User;
  onSubmit: (data: UserProfileUpdateRequest) => void;
  onDelete: () => void;
}

export default function UserUpdateForm({ user, onSubmit, onDelete }: UserUpdateFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<UserProfileUpdateRequest>({
    resolver: zodResolver(UserProfileUpdateRequest),
    defaultValues: { ...user },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-full"
    >
      <div className="flex space-x-4">
        <div className="flex flex-col items-end w-full">
          <div className="flex items-center gap-4 w-full">
            <label
              htmlFor="username"
              className="w-16 text-left text-sm font-medium text-gray-700"
            >
              아이디
            </label>
            <input
              id="username"
              type="text"
              className="border px-2 lg:px-4 py-2 w-28 lg:w-40 disabled:bg-gray-200 text-sm rounded-md"
              defaultValue={user.username}
              disabled={true}
            />
          </div>
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
              className="border px-2 lg:px-4 py-2 w-28 lg:w-40 disabled:bg-gray-200 text-sm rounded-md"
              disabled={true}
            />
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <div className="flex flex-col items-end w-full">
          <div className="flex items-center gap-4 w-full">
            <label
              htmlFor="firstName"
              className="w-16 text-left text-sm font-medium text-gray-700"
            >
              이름
            </label>
            <input
              id="firstName"
              type="text"
              className="border px-2 lg:px-4 py-2 w-28 lg:w-40 text-sm rounded-md"
              {...register("firstName")}
            />
          </div>
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end w-full">
          <div className="flex items-center gap-4 w-full">
            <label
              htmlFor="lastName"
              className="w-16 text-left text-sm font-medium text-gray-700"
            >
              성
            </label>
            <input
              id="lastName"
              type="text"
              className="border px-2 lg:px-4 py-2 w-28 lg:w-40 text-sm rounded-md"
              {...register("lastName")}
            />
          </div>
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end w-full">
        <div className="flex items-center gap-4 w-full">
          <label
            htmlFor="email"
            className="w-16 text-left text-sm font-medium text-gray-700"
          >
            이메일
          </label>
          <input
            id="email"
            type="email"
            className="border px-2 lg:px-4 py-2 w-28 lg:w-40 text-sm rounded-md"
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">
            {errors.email.message}
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
              {...register("role")}
            >
              <option value="STUDENT">학생</option>
              <option value="TEACHER">강사</option>
              <option value="ADMINISTRATOR">관리자</option>
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
              {...register("status")}
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
          className="mt-4 mx-auto px-8 py-2 bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded"
          disabled={!isDirty || isSubmitting}
        >
          수정
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="mt-4 mx-auto px-8 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          삭제
        </button>
      </div>
    </form>
  );
}