"use client";

import Loader from "@/component/common/Loader";
import UserCreateForm from "@/component/admin/user/UserCreateForm";
import UserUpdateForm from "@/component/admin/user/UserUpdateForm";
import {
  useUserProfile,
  useUserCreate,
  useUserProfileUpdate,
  useUserDelete,
} from "@/hook/admin/useUser";
import {
  UserCreateRequest,
  UserProfileUpdateRequest,
} from "@/schema/user/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/component/ui/card";

interface UserInfoCardProps {
  userId: string | null;
  onSuccess: () => void;
}

export default function UserInfoCard({ userId, onSuccess }: UserInfoCardProps) {
  const isCreate = userId === null;

  const { data: user, isLoading: isUserLoading } = useUserProfile(
    userId ?? "",
    { enabled: !isCreate }
  );

  const registerMutation = useUserCreate();
  const modifyMutation = useUserProfileUpdate();
  const deleteMutation = useUserDelete();

  const handleSubmit = async (
    raw: UserCreateRequest | UserProfileUpdateRequest
  ) => {
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
  };

  const handleDelete = async () => {
    if (userId === null) return;
    await deleteMutation.mutateAsync(userId);
    onSuccess();
  };

  const title = isCreate ? "사용자 등록" : "사용자 수정";
  const isMutating = registerMutation.isPending || modifyMutation.isPending;

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="text-3xl lg:text-4xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex-1 flex items-center justify-center">
          {/* 로딩 및 뮤테이션 상태를 변수로 분리하여 가독성을 높입니다. */}
          {isUserLoading || isMutating ? (
            <Loader />
          ) : isCreate ? (
            <UserCreateForm onSubmit={handleSubmit} />
          ) : (
            user && (
              <UserUpdateForm
                user={user}
                onSubmit={handleSubmit}
                onDelete={handleDelete}
              />
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}
