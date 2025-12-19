"use client";

import { useState } from "react";
import PlusIcon from "@/assets/icons/plus.svg";
import UserFilterForm from "@/components/admin/user/UserFilterForm";
import UserInfoCard from "@/components/admin/user/UserInfoCard";
import UserListTable from "@/components/admin/user/UserListTable";
import Loader from "@/components/Loader";
import Modal from "@/components/Modal";
import { useUserList } from "@/hooks/admin/useUser";
import { UserListRequest } from "@/schemas/user";

const DEFAULT_VALUES: UserListRequest = {
  role: null,
  status: null,
  lastName: null,
  firstName: null,
};

export default function AdminUsersPage() {
  const [filter, setFilter] = useState<UserListRequest>(DEFAULT_VALUES);

  const [userId, setUserId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: users, isLoading, error } = useUserList(filter);

  const updateFilter = (newFilter: UserListRequest) => setFilter(newFilter);

  const openRegisterModal = () => { setUserId(null); setIsModalOpen(true); };
  const openModifyModal = (id: number) => { setUserId(id); setIsModalOpen(true); };
  const closeModal = () => { setUserId(null); setIsModalOpen(false); };

  return (
    <div className="flex-1 flex flex-col gap-8 mx-auto py-12 lg:py-24 w-full max-w-lg lg:max-w-4xl text-center bg-background">
      <h1 className="text-3xl lg:text-4xl font-bold">
        사용자 목록
      </h1>
      
      <div className="w-full">
        <UserFilterForm onSubmit={updateFilter} />
      </div>
    
      <div className="flex-1 flex flex-col gap-4 items-center">
        {isLoading
          ? <Loader />
          : error
            ? <p className="text-center text-red-500">사용자 목록을 불러오는 중 오류가 발생했습니다.</p>
            : users?.length
              ? <UserListTable users={users ?? []} onModify={openModifyModal} />
              : <p className="text-center">사용자가 없습니다.</p>
        }
      </div>

      <div className="w-full h-16 text-right">
        <button
          className="border border-blue-600 bg-blue-600 text-white p-4 hover:bg-blue-700 rounded-md"
          onClick={openRegisterModal}
        >
          <PlusIcon className="w-4 h-4" />
        </button>
      </div>

      {isModalOpen &&
        <Modal onClose={closeModal}>
          <UserInfoCard userId={userId} onSuccess={closeModal} />
        </Modal>
      }
    </div>
  );
}
