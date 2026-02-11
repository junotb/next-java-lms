"use client";

import Loader from "@/components/common/Loader";
import ScheduleCreateForm from "@/components/admin/schedule/ScheduleCreateForm";
import ScheduleUpdateForm from "@/components/admin/schedule/ScheduleUpdateForm";
import {
  useScheduleInfo,
  useScheduleCreate,
  useScheduleUpdate,
  useScheduleDelete,
} from "@/hooks/admin/useSchedule";
import {
  ScheduleCreateRequest,
  ScheduleUpdateRequest,
} from "@/schemas/schedule/schedule";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ScheduleInfoCardProps {
  scheduleId: number | null;
  onSuccess: () => void;
}

export default function ScheduleInfoCard({
  scheduleId,
  onSuccess,
}: ScheduleInfoCardProps) {
  const isCreate = scheduleId === null;

  const { data: schedule, isLoading: isScheduleLoading } = useScheduleInfo(
    scheduleId ?? 0,
    { enabled: !isCreate }
  );

  const registerMutation = useScheduleCreate();
  const modifyMutation = useScheduleUpdate();
  const deleteMutation = useScheduleDelete();

  const handleSubmit = async (
    raw: ScheduleCreateRequest | ScheduleUpdateRequest
  ) => {
    try {
      if (isCreate) {
        const payload = raw as ScheduleCreateRequest;
        await registerMutation.mutateAsync(payload);
      } else {
        if (scheduleId === null) return;
        const payload = raw as ScheduleUpdateRequest;
        await modifyMutation.mutateAsync({ scheduleId, payload });
      }
      onSuccess();
    } catch {
      // onError는 mutation에서 처리됨
    }
  };

  const handleDelete = async () => {
    if (scheduleId === null) return;
    await deleteMutation.mutateAsync(scheduleId);
    onSuccess();
  };

  const title = isCreate ? "스케줄 등록" : "스케줄 수정";
  const isMutating = registerMutation.isPending || modifyMutation.isPending;

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="text-3xl lg:text-4xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex-1 flex items-center justify-center">
          {isScheduleLoading || isMutating ? (
            <Loader />
          ) : isCreate ? (
            <ScheduleCreateForm onSubmit={handleSubmit} />
          ) : (
            schedule && (
              <ScheduleUpdateForm
                schedule={schedule}
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
