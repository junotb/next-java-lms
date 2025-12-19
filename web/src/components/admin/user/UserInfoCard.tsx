"use client";

import Loader from "@/components/Loader";
import UserRegisterForm from "@/components/admin/user/UserRegisterForm";
import UserModifyForm from "@/components/admin/user/UserModifyForm";
import { useUserProfile, useUserCreate, useUserProfileUpdate, useUserDelete } from "@/hooks/admin/useUser";
import { UserCreateRequest, UserProfileUpdateRequest } from "@/schemas/user";

interface UserInfoCardProps {
  userId: number | null;
  onSuccess: () => void;
}

export default function UserInfoCard({ userId, onSuccess }: UserInfoCardProps) {
  const isRegister = userId === null;

  const { data: user, isLoading: isUserLoading } = useUserProfile(userId ?? 0, { enabled: !isRegister });

  const registerMutation = useUserCreate();
  const modifyMutation = useUserProfileUpdate();
  const deleteMutation = useUserDelete();
  
  const handleSubmit = async (raw: unknown) => {
    if (isRegister) {
      const payload = UserCreateRequest.parse(raw);
      await registerMutation.mutateAsync(payload);
      onSuccess();
      return;
    }

    if (userId === null) return;

    const payload = UserProfileUpdateRequest.parse(raw);
    await modifyMutation.mutateAsync({ userId, payload });
    onSuccess();
  }

  const handleDelete = async () => {
    if (userId === null) return;
    await deleteMutation.mutateAsync(userId);
    onSuccess();
  }

  const title = isRegister ? "사용자 등록" : "사용자 수정";

  return (
    <div className="w-116 h-112 lg:w-140 lg:h-136 px-8 py-12 lg:py-24">
      <h1 className="text-3xl lg:text-4xl font-bold">
        {title}
      </h1>
      
      <div className="flex-1 flex items-center justify-center mt-8">
        {isUserLoading || registerMutation.isPending || modifyMutation.isPending
          ? <Loader />
          : isRegister
            ? <UserRegisterForm onSubmit={handleSubmit} />
            : user && <UserModifyForm user={user} onSubmit={handleSubmit} onDelete={handleDelete} />
        }
      </div>
    </div>
  );
}
