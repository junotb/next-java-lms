"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import UserListForm from "@/component/admin/user/UserListForm";
import UserInfoCard from "@/component/admin/user/UserInfoCard";
import UserListTable from "@/component/admin/user/UserListTable";
import Loader from "@/component/common/Loader";
import Modal from "@/component/common/Modal";
import { useUserList } from "@/hook/admin/useUser";
import { UserListRequest } from "@/schema/user/user";
import { Button } from "@/component/ui/button";

export default function AdminUsersPage() {
  const [request, setRequest] = useState<UserListRequest>({
    name: undefined,
    role: undefined,
    status: undefined,
  });

  const [userId, setUserId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: users, isLoading, error } = useUserList(request);

  const updateRequest = (newRequest: UserListRequest) => setRequest(newRequest);

  const openCreateModal = () => {
    setUserId(null);
    setIsModalOpen(true);
  };
  const openUpdateModal = (id: string) => {
    setUserId(id);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setUserId(null);
    setIsModalOpen(false);
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
      <div className="flex flex-col gap-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              사용자 관리
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              서비스 사용자를 검색하고 관리합니다.
            </p>
          </div>
          <Button
            className="flex items-center gap-2"
            onClick={openCreateModal}
          >
            <Plus className="mr-2 h-4 w-4" />
            <span>사용자 추가</span>
          </Button>
        </header>

        <div className="w-full">
          <UserListForm onSubmit={updateRequest} />
        </div>

        <div className="flex-1 flex flex-col gap-4">
          {isLoading ? (
            <Loader />
          ) : error ? (
            <p className="text-center text-destructive">
              사용자 목록을 불러오는 중 오류가 발생했습니다.
            </p>
          ) : users?.length ? (
            <UserListTable users={users ?? []} onUpdate={openUpdateModal} />
          ) : (
            <p className="text-center text-muted-foreground">사용자가 없습니다.</p>
          )}
        </div>
      </div>

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <UserInfoCard userId={userId} onSuccess={closeModal} />
        </Modal>
      )}
    </div>
  );
}
