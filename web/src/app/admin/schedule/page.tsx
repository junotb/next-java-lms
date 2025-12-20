"use client";

import { useState } from "react";
import PlusIcon from "@/assets/icons/plus.svg";
import ScheduleListForm from "@/components/admin/schedule/ScheduleListForm";
import ScheduleInfoCard from "@/components/admin/schedule/ScheduleInfoCard";
import ScheduleListTable from "@/components/admin/schedule/ScheduleListTable";
import Loader from "@/components/Loader";
import Modal from "@/components/Modal";
import { useScheduleList } from "@/hooks/admin/useSchedule";
import { ScheduleListRequest } from "@/schemas/schedule";

const DEFAULT_REQUEST: ScheduleListRequest = {
  userId: null,
  status: null,
};

export default function AdminSchedulesPage() {
  const [request, setRequest] = useState<ScheduleListRequest>(DEFAULT_REQUEST);

  const [scheduleId, setScheduleId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: schedules, isLoading, error } = useScheduleList(request);

  const updateFilter = (newFilter: ScheduleListRequest) => setRequest(newFilter);

  const openCreateModal = () => { setScheduleId(null); setIsModalOpen(true); };
  const openUpdateModal = (id: number) => { setScheduleId(id); setIsModalOpen(true); };
  const closeModal = () => { setScheduleId(null); setIsModalOpen(false); };

  return (
    <div className="flex-1 flex flex-col gap-8 mx-auto py-12 lg:py-24 w-full max-w-lg lg:max-w-4xl text-center bg-background">
      <h1 className="text-3xl lg:text-4xl font-bold">
        스케줄 목록
      </h1>
      
      <div className="w-full">
        <ScheduleListForm onSubmit={updateFilter} />
      </div>
    
      <div className="flex-1 flex flex-col gap-4 items-center">
        {isLoading
          ? <Loader />
          : error
            ? <p className="text-center text-red-500">스케줄 목록을 불러오는 중 오류가 발생했습니다.</p>
            : schedules?.length
              ? <ScheduleListTable schedules={schedules ?? []} onUpdate={openUpdateModal} />
              : <p className="text-center">스케줄이 없습니다.</p>
        }
      </div>

      <div className="w-full h-16 text-right">
        <button
          className="border border-blue-600 bg-blue-600 text-white p-4 hover:bg-blue-700 rounded-md"
          onClick={openCreateModal}
        >
          <PlusIcon className="w-4 h-4" />
        </button>
      </div>

      {isModalOpen &&
        <Modal onClose={closeModal}>
          <ScheduleInfoCard scheduleId={scheduleId} onSuccess={closeModal} />
        </Modal>
      }
    </div>
  );
}
