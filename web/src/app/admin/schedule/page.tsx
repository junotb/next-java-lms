"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import ScheduleListForm from "@/components/admin/schedule/ScheduleListForm";
import ScheduleInfoCard from "@/components/admin/schedule/ScheduleInfoCard";
import ScheduleListTable from "@/components/admin/schedule/ScheduleListTable";
import ListTableSkeleton from "@/components/admin/ListTableSkeleton";
import Modal from "@/components/common/Modal";
import { useScheduleList } from "@/hooks/admin/useSchedule";
import { ScheduleListRequest } from "@/schemas/schedule/schedule";
import { Button } from "@/components/ui/button";

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
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              수업 관리
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground sm:text-base lg:text-lg">
              일정을 검색하고 관리합니다.
            </p>
          </div>
          <Button
            className="flex shrink-0 items-center justify-center gap-2 self-start sm:self-auto"
            onClick={openCreateModal}
          >
            <Plus className="h-4 w-4 shrink-0" />
            <span className="truncate">수업 추가</span>
          </Button>
        </header>

        <div className="w-full">
          <ScheduleListForm onSubmit={updateRequest} />
        </div>

        <div className="flex flex-col gap-4 flex-1 min-w-0">
          {isLoading ? (
            <ListTableSkeleton columnCount={5} rowCount={8} />
          ) : error ? (
            <p className="text-center text-destructive">
              수업 목록을 불러오는 중 오류가 발생했습니다.
            </p>
          ) : schedules?.length ? (
            <div className="min-w-0 overflow-x-auto rounded-lg border border-border">
              <ScheduleListTable
                schedules={schedules ?? []}
                onUpdate={openUpdateModal}
              />
            </div>
          ) : (
            <p className="text-center text-muted-foreground">수업이 없습니다.</p>
          )}
        </div>
      </div>

      {isModalOpen && (
        <Modal onClose={closeModal} title="수업 상세 정보">
          <ScheduleInfoCard scheduleId={scheduleId} onSuccess={closeModal} />
        </Modal>
      )}
    </div>
  );
}
