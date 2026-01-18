"use client";

import { useForm } from "react-hook-form";
import type {
  User,
  UserProfileUpdateRequest,
  UserProfileUpdateFormValues,
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

interface UserUpdateFormProps {
  user: User;
  onSubmit: (data: UserProfileUpdateRequest) => void;
  onDelete: () => void;
}

export default function UserUpdateForm({
  user,
  onSubmit,
  onDelete,
}: UserUpdateFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
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
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-full"
    >
      <InputField
        id="email"
        label="이메일"
        type="email"
        register={register}
        errors={errors}
        defaultValue={user.email}
        disabled={true}
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

      <div className="flex justify-center gap-4 w-full">
        <button
          type="submit"
          className="mt-4 flex-1 rounded-xl bg-blue-600 px-8 py-3 font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-blue-300 disabled:shadow-none disabled:transform-none"
          disabled={isSubmitting}
        >
          수정
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="mt-4 flex-1 rounded-xl bg-red-600 px-8 py-3 font-bold text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-700 hover:-translate-y-0.5"
        >
          삭제
        </button>
      </div>
    </form>
  );
}
