"use client";

import { useRef } from "react";
import { Upload } from "lucide-react";
import Loader from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useVideoUpload } from "@/hooks/useLessonFeedback";

interface VideoUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scheduleId: number;
}

/**
 * 강사용 수업 영상 업로드 모달.
 */
export default function VideoUploadModal({
  open,
  onOpenChange,
  scheduleId,
}: VideoUploadModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const mutation = useVideoUpload(scheduleId);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      mutation.reset();
      return;
    }
    try {
      await mutation.mutateAsync(file);
      onOpenChange(false);
    } catch {
      // onError handled in mutation
    }
    e.target.value = "";
  };

  const handleClick = () => inputRef.current?.click();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-md">
        <DialogHeader>
          <DialogTitle>수업 영상 업로드</DialogTitle>
          <DialogDescription>
            수업 녹화본을 업로드하면 자동으로 자막(VTT)이 생성되고 AI 피드백이 작성됩니다. 영상 파일은 저장되지 않습니다.
          </DialogDescription>
        </DialogHeader>
        <div className="pt-4">
          <input
            ref={inputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            onClick={handleClick}
            disabled={mutation.isPending}
            className="w-full min-h-10 gap-2"
          >
            {mutation.isPending ? (
              <>
                <Loader variant="inline" />
                업로드 중...
              </>
            ) : (
              <>
                <Upload className="size-4" />
                비디오 파일 선택
              </>
            )}
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            mp4, webm, mov 형식 지원
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
