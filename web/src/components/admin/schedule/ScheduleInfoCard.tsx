"use client";

import Loader from "@/components/Loader";
import ScheduleCreateForm from "@/components/admin/schedule/ScheduleCreateForm";
import ScheduleUpdateForm from "@/components/admin/schedule/ScheduleUpdateForm";
import { useScheduleInfo, useScheduleCreate, useScheduleUpdate, useScheduleDelete } from "@/hooks/admin/useSchedule";
import { ScheduleCreateRequest, ScheduleUpdateRequest } from "@/schemas/schedule";

interface ScheduleInfoCardProps {
  scheduleId: number | null;
  onSuccess: () => void;
}

export default function ScheduleInfoCard({ scheduleId, onSuccess }: ScheduleInfoCardProps) {
  const isCreate = scheduleId === null;

  const { data: schedule, isLoading: isScheduleLoading } = useScheduleInfo(scheduleId ?? 0, { enabled: !isCreate });

  const registerMutation = useScheduleCreate();
  const modifyMutation = useScheduleUpdate();
  const deleteMutation = useScheduleDelete();
  
  const handleSubmit = async (raw: unknown) => {
    console.log("handleSubmit", raw);
    if (isCreate) {
      const payload = ScheduleCreateRequest.parse(raw);
      await registerMutation.mutateAsync(payload);
      onSuccess();
      return;
    }

    if (scheduleId === null) return;

    const payload = ScheduleUpdateRequest.parse(raw);
    await modifyMutation.mutateAsync({ scheduleId, payload });
    onSuccess();
  }

  const handleDelete = async () => {
    if (scheduleId === null) return;
    await deleteMutation.mutateAsync(scheduleId);
    onSuccess();
  }

  const title = isCreate ? "스케줄 등록" : "스케줄 수정";

  return (
    <div className="w-116 h-112 lg:w-140 lg:h-136 px-8 py-12 lg:py-24">
      <h1 className="text-3xl lg:text-4xl font-bold">
        {title}
      </h1>
      
      <div className="flex-1 flex items-center justify-center mt-8">
        {isScheduleLoading || registerMutation.isPending || modifyMutation.isPending
          ? <Loader />
          : isCreate
            ? <ScheduleCreateForm onSubmit={handleSubmit} />
            : schedule && <ScheduleUpdateForm schedule={schedule} onSubmit={handleSubmit} onDelete={handleDelete} />
        }
      </div>
    </div>
  );
}
