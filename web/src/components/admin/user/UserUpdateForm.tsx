"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
  User,
  UserProfileUpdateRequest,
  UserProfileUpdateFormValues,
} from "@/schemas/user/user";
import { UserProfileUpdateRequestSchema } from "@/schemas/user/user";
import InputField from "@/components/common/InputField";
import SelectField from "@/components/common/SelectField";
import { UserRoleSchema } from "@/schemas/user/user-role";
import { UserStatusSchema } from "@/schemas/user/user-status";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { USER_ROLE_NAMES, USER_STATUS_NAMES } from "@/constants/auth";

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
    resolver: zodResolver(UserProfileUpdateRequestSchema),
    defaultValues: {
      email: user.email,
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

      <div className="flex justify-center gap-4 w-full">
        <Button
          type="submit"
          className={cn(
            "mt-4 flex-1 rounded-xl px-8 py-3 font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 disabled:shadow-none disabled:transform-none"
          )}
          disabled={isSubmitting}
        >
          수정
        </Button>

        <Button
          type="button"
          onClick={onDelete}
          variant="destructive"
          className={cn(
            "mt-4 flex-1 rounded-xl px-8 py-3 font-bold shadow-lg shadow-destructive/20 transition-all hover:-translate-y-0.5"
          )}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          삭제
        </Button>
      </div>
    </form>
  );
}
