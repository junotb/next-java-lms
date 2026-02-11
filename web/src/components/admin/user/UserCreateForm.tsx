"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
  UserCreateRequest,
  UserCreateFormValues,
} from "@/schemas/user/user";
import { UserCreateRequestSchema } from "@/schemas/user/user";
import InputField from "@/components/common/InputField";
import SelectField from "@/components/common/SelectField";
import { UserRoleSchema } from "@/schemas/user/user-role";
import { UserStatusSchema } from "@/schemas/user/user-status";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { USER_ROLE_NAMES, USER_STATUS_NAMES } from "@/constants/auth";
interface UserCreateFormProps {
  onSubmit: (data: UserCreateRequest) => void;
}

export default function UserCreateForm({ onSubmit }: UserCreateFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserCreateFormValues>({
    resolver: zodResolver(UserCreateRequestSchema),
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
      />

      <InputField
        id="password"
        label="비밀번호"
        type="password"
        register={register}
        errors={errors}
      />

      <InputField
        id="name"
        label="이름"
        register={register}
        errors={errors}
      />

      <SelectField
        id="role"
        label="역할"
        register={register}
        errors={errors}
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
      >
        {UserStatusSchema.options.map((status) => (
          <option key={status} value={status}>
            {USER_STATUS_NAMES[status]}
          </option>
        ))}
      </SelectField>

      <Button
        type="submit"
        className={cn(
          "mt-4 w-full rounded-xl px-8 py-3 font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 disabled:shadow-none disabled:transform-none"
        )}
        disabled={isSubmitting}
      >
        등록
      </Button>
    </form>
  );
}
