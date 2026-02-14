"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { useToastStore } from "@/stores/useToastStore";
import {
  ProfileUpdateRequestSchema,
  type ProfileUpdateRequest,
} from "@/schemas/auth/profile";
import { Button } from "@/components/ui/button";
import InputField from "@/components/common/InputField";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToastStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileUpdateRequest>({
    resolver: zodResolver(ProfileUpdateRequestSchema),
    defaultValues: { name: "", image: "" },
  });

  useEffect(() => {
    const load = async () => {
      const { data } = await authClient.getSession();
      if (data?.user) {
        const u = data.user as { name?: string; image?: string | null };
        reset({
          name: u.name || "",
          image: u.image || "",
        });
      }
      setIsLoading(false);
    };
    load();
  }, [reset]);

  const onSubmit = async (payload: ProfileUpdateRequest) => {
    const { data, error } = await authClient.updateUser({
      name: payload.name.trim(),
      image: payload.image?.trim() || undefined,
    });

    if (error) {
      showToast(error.message || "수정에 실패했습니다.", "error");
      return;
    }

    if (data) {
      showToast("프로필이 수정되었습니다.", "success");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <span className="inline-block size-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 max-w-md"
    >
      <InputField
        id="name"
        label="이름"
        register={register}
        errors={errors}
        autoComplete="name"
      />
      <InputField
        id="image"
        label="프로필 이미지 URL"
        register={register}
        errors={errors}
        placeholder="https://..."
      />
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
        저장
      </Button>
    </form>
  );
}
