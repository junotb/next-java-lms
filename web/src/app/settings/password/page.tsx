"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { useToastStore } from "@/stores/useToastStore";
import {
  ChangePasswordRequestSchema,
  type ChangePasswordRequest,
} from "@/schemas/auth/password";
import InputField from "@/components/common/InputField";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PasswordPage() {
  const { showToast } = useToastStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordRequest>({
    resolver: zodResolver(ChangePasswordRequestSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (payload: ChangePasswordRequest) => {
    const { data, error } = await authClient.changePassword({
      currentPassword: payload.currentPassword,
      newPassword: payload.newPassword,
      revokeOtherSessions: false,
    });

    if (error) {
      showToast(error.message || "비밀번호 변경에 실패했습니다.", "error");
      return;
    }

    if (data) {
      showToast("비밀번호가 변경되었습니다.", "success");
      reset();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 max-w-md"
    >
      <InputField
        id="currentPassword"
        label="현재 비밀번호"
        type="password"
        register={register}
        errors={errors}
        autoComplete="current-password"
      />
      <InputField
        id="newPassword"
        label="새 비밀번호"
        type="password"
        register={register}
        errors={errors}
        autoComplete="new-password"
      />
      <InputField
        id="confirmPassword"
        label="새 비밀번호 확인"
        type="password"
        register={register}
        errors={errors}
        autoComplete="new-password"
      />
      <p className="text-sm text-muted-foreground">
        비밀번호는 8자 이상, 영문과 숫자를 포함해야 합니다.
      </p>
      <Button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "w-fit rounded-xl px-6 py-2 font-bold shadow-lg shadow-primary/20",
          "disabled:opacity-50"
        )}
      >
        {isSubmitting && (
          <span
            className="mr-2 inline-block size-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden
          />
        )}
        비밀번호 변경
      </Button>
    </form>
  );
}
