"use client";

import { useState } from "react";
import { LogOut, CheckCircle } from "lucide-react";
import Loader from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useFinishLesson } from "@/hooks/useLesson";
import { useCountdown } from "@/hooks/useCountdown";
import { USER_ROLE } from "@/constants/auth";

interface LessonControllerProps {
  scheduleId: number;
  role: string;
  endsAt: string;
  onExit: () => void;
}

/**
 * 수업실 하단 컨트롤러.
 * 남은 시간 표시, 강사 전용 수업 종료, 나가기 버튼.
 */
export default function LessonController({
  scheduleId,
  role,
  endsAt,
  onExit,
}: LessonControllerProps) {
  const remaining = useCountdown(endsAt);
  const finishMutation = useFinishLesson(scheduleId);
  const [finishDialogOpen, setFinishDialogOpen] = useState(false);

  const isTeacher = role === USER_ROLE.TEACHER;

  const handleFinishClick = () => setFinishDialogOpen(true);

  const handleConfirmFinish = () => {
    finishMutation.mutate();
    setFinishDialogOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4 h-14 px-4 bg-zinc-900/95 border-t border-zinc-800 shrink-0">
        <div className="flex items-center gap-2 text-zinc-400">
          <span className="text-sm">남은 시간</span>
          <span className="font-mono text-lg text-white tabular-nums">{remaining}</span>
        </div>
        <div className="flex items-center gap-2">
          {isTeacher && (
            <Button
              type="button"
              variant="default"
              size="sm"
              className="gap-2 bg-foreground hover:bg-foreground/90 text-background"
              onClick={handleFinishClick}
              disabled={finishMutation.isPending}
            >
              {finishMutation.isPending ? (
                <Loader variant="inline" />
              ) : (
                <CheckCircle className="size-4" />
              )}
              수업 종료
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2 border-zinc-600 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            onClick={onExit}
          >
            <LogOut className="size-4" />
            나가기
          </Button>
        </div>
      </div>

      <Dialog open={finishDialogOpen} onOpenChange={setFinishDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-700">
          <DialogHeader>
            <DialogTitle className="text-white">수업 종료</DialogTitle>
            <DialogDescription className="text-zinc-400">
              수업을 종료하고 출석 처리합니다. 계속하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setFinishDialogOpen(false)}
              className="border-zinc-600 text-zinc-300"
            >
              취소
            </Button>
            <Button
              type="button"
              className="gap-2 bg-foreground hover:bg-foreground/90 text-background"
              onClick={handleConfirmFinish}
              disabled={finishMutation.isPending}
            >
              {finishMutation.isPending ? (
                <Loader variant="inline" />
              ) : null}
              수업 종료
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
