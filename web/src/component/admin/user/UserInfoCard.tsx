"use client";

import Loader from "@/component/Loader";
import UserCreateForm from "@/component/admin/user/UserCreateForm";
import UserUpdateForm from "@/component/admin/user/UserUpdateForm";
import { useUserProfile, useUserCreate, useUserProfileUpdate, useUserDelete } from "@/hook/admin/useUser";
import { UserCreateRequest, UserProfileUpdateRequest } from "@/schema/user/user";

interface UserInfoCardProps {
  userId: number | null;
  onSuccess: () => void;
}

export default function UserInfoCard({ userId, onSuccess }: UserInfoCardProps) {
  const isCreate = userId === null;

  const { data: user, isLoading: isUserLoading } = useUserProfile(userId ?? 0, { enabled: !isCreate });

  const registerMutation = useUserCreate();
  const modifyMutation = useUserProfileUpdate();
  const deleteMutation = useUserDelete();
  
  const handleSubmit = async (raw: UserCreateRequest | UserProfileUpdateRequest) => {
    if (isCreate) {
      const payload = raw as UserCreateRequest;
      await registerMutation.mutateAsync(payload);
      onSuccess();
      return;
    }

    if (userId === null) return;

    const payload = raw as UserProfileUpdateRequest;
    await modifyMutation.mutateAsync({ userId, payload });
    onSuccess();
  }

  const handleDelete = async () => {
    if (userId === null) return;
    await deleteMutation.mutateAsync(userId);
    onSuccess();
  }

  const title = isCreate ? "사용자 등록" : "사용자 수정";

  return (
    <div className="w-116 h-112 lg:w-140 lg:h-136 px-8 py-12 lg:py-24">
      <h1 className="text-3xl lg:text-4xl font-bold">
        {title}
      </h1>
      
      <div className="flex-1 flex items-center justify-center mt-8">
        {isUserLoading || registerMutation.isPending || modifyMutation.isPending
          ? <Loader />
          : isCreate
            ? <UserCreateForm onSubmit={handleSubmit} />
            : user && <UserUpdateForm user={user} onSubmit={handleSubmit} onDelete={handleDelete} />
        }
      </div>
    </div>
  );
}
