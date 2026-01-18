"use client";

import { useForm } from "react-hook-form";
import type {
  UserCreateRequest,
  UserCreateFormValues,
} from "@/schema/user/user";
import InputField from "@/component/common/InputField";
import SelectField from "@/component/common/SelectField";
import { UserRoleSchema } from "@/schema/user/user-role";
import { UserStatusSchema } from "@/schema/user/user-status";

const USER_ROLE_NAMES: Record<string, string> = {
  STUDENT: "학생",
  TEACHER: "강사",
  ADMIN: "관리자",
};
const USER_STATUS_NAMES: Record<string, string> = {
  ACTIVE: "활성",
  INACTIVE: "비활성",
};
interface UserCreateFormProps {
  onSubmit: (data: UserCreateRequest) => void;
}

export default function UserCreateForm({ onSubmit }: UserCreateFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserCreateFormValues>({
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
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-full"
    >
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
            message: "비밀번호는 8자 이상이어야 합니다.",
          },
        }}
      />

      <InputField
        id="name"
        label="이름"
        register={register}
        errors={errors}
        validation={{ required: "이름을 입력하세요." }}
      />

      <SelectField
        id="role"
        label="역할"
        register={register}
        errors={errors}
        validation={{ required: "역할을 선택하세요." }}
      >
        {UserRoleSchema.options.map((role) => (
          <option key={role} value={role}>
            {USER_ROLE_NAMES[role]}
          </option>
        ))}
      </SelectField>

      <SelectField
        id="status"
        label="상태"
        register={register}
        errors={errors}
        validation={{ required: "상태를 선택하세요." }}
      >
        {UserStatusSchema.options.map((status) => (
          <option key={status} value={status}>
            {USER_STATUS_NAMES[status]}
          </option>
        ))}
      </SelectField>

      <button
        type="submit"
        className="mt-4 w-full rounded-xl bg-blue-600 px-8 py-3 font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-blue-300 disabled:shadow-none disabled:transform-none"
        disabled={isSubmitting}
      >
        등록
      </button>
    </form>
  );
}
