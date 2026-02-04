"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import ScheduleListForm from "@/component/admin/schedule/ScheduleListForm";
import ScheduleInfoCard from "@/component/admin/schedule/ScheduleInfoCard";
import ScheduleListTable from "@/component/admin/schedule/ScheduleListTable";
import Loader from "@/component/common/Loader";
import Modal from "@/component/common/Modal";
import { useScheduleList } from "@/hook/admin/useSchedule";
import { ScheduleListRequest } from "@/schema/schedule/schedule";
import { Button } from "@/component/ui/button";

export default function AdminSchedulesPage() {
  const [request, setRequest] = useState<ScheduleListRequest>({
    userId: undefined,
    status: undefined,
  });

  const [scheduleId, setScheduleId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: schedules, isLoading, error } = useScheduleList(request);

  const updateRequest = (newRequest: ScheduleListRequest) =>
    setRequest(newRequest);

  const openCreateModal = () => {
    setScheduleId(null);
    setIsModalOpen(true);
  };
  const openUpdateModal = (id: number) => {
    setScheduleId(id);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setScheduleId(null);
    setIsModalOpen(false);
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
      <div className="flex flex-col gap-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              스케줄 관리
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              사용자 스케줄을 검색하고 관리합니다.
            </p>
          </div>
          <Button
            className="flex items-center gap-2"
            onClick={openCreateModal}
          >
            <Plus className="mr-2 h-4 w-4" />
            <span>스케줄 추가</span>
          </Button>
        </header>

        <div className="w-full">
          <ScheduleListForm onSubmit={updateRequest} />
        </div>

        <div className="flex-1 flex flex-col gap-4">
          {isLoading ? (
            <Loader />
          ) : error ? (
            <p className="text-center text-destructive">
              스케줄 목록을 불러오는 중 오류가 발생했습니다.
            </p>
          ) : schedules?.length ? (
            <ScheduleListTable
              schedules={schedules ?? []}
              onUpdate={openUpdateModal}
            />
          ) : (
            <p className="text-center text-muted-foreground">스케줄이 없습니다.</p>
          )}
        </div>
      </div>

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <ScheduleInfoCard scheduleId={scheduleId} onSuccess={closeModal} />
        </Modal>
      )}
    </div>
  );
}
