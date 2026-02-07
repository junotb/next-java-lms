"use client";

import { useState, useEffect } from "react";
import { Button } from "@/component/ui/button";
import { Input } from "@/component/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/component/ui/dialog";
import { useMeetLinkUpdate } from "@/hook/teach/useMeetLink";

interface MeetLinkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scheduleId: number;
  initialMeetLink?: string | null;
}

/**
 * 강사용 Meet 링크 입력 모달.
 */
export default function MeetLinkModal({
  open,
  onOpenChange,
  scheduleId,
  initialMeetLink,
}: MeetLinkModalProps) {
  const [meetLink, setMeetLink] = useState(initialMeetLink ?? "");
  const mutation = useMeetLinkUpdate();

  useEffect(() => {
    if (open) {
      setMeetLink(initialMeetLink ?? "");
    }
  }, [open, initialMeetLink]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = meetLink.trim();
    if (!trimmed) return;

    try {
      await mutation.mutateAsync({ scheduleId, payload: { meetLink: trimmed } });
      onOpenChange(false);
    } catch {
      // onError는 mutation에서 처리
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-md">
        <DialogHeader>
          <DialogTitle>Meet 링크 입력</DialogTitle>
          <DialogDescription>
            수업에 사용할 Google Meet 링크를 입력하세요. 학생과 강사는 수업방에서 이 링크로 입장합니다.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
          <Input
            type="url"
            placeholder="https://meet.google.com/xxx-xxxx-xxx"
            value={meetLink}
            onChange={(e) => setMeetLink(e.target.value)}
            disabled={mutation.isPending}
            className="font-mono text-sm"
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button type="submit" disabled={!meetLink.trim() || mutation.isPending}>
              {mutation.isPending ? "저장 중..." : "저장"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
