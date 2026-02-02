"use client";

import Loader from "@/component/common/Loader";
import ScheduleCreateForm from "@/component/admin/schedule/ScheduleCreateForm";
import ScheduleUpdateForm from "@/component/admin/schedule/ScheduleUpdateForm";
import {
  useScheduleInfo,
  useScheduleCreate,
  useScheduleUpdate,
  useScheduleDelete,
} from "@/hook/admin/useSchedule";
import {
  ScheduleCreateRequest,
  ScheduleUpdateRequest,
} from "@/schema/schedule/schedule";
import { Card, CardContent, CardHeader, CardTitle } from "@/component/ui/card";

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
    } catch (error) {
      console.error("Form submission failed:", error);
      // 사용자에게 토스트 메시지 등으로 에러를 알려주는 로직을 추가할 수 있습니다.
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
