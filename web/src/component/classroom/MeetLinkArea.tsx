"use client";

import { Video } from "lucide-react";
import { Button } from "@/component/ui/button";

interface MeetLinkAreaProps {
  meetLink: string | null;
}

/**
 * 수업방 메인 영역. Google Meet 링크가 있으면 참가 버튼, 없으면 대기 메시지 표시.
 */
export default function MeetLinkArea({ meetLink }: MeetLinkAreaProps) {
  const hasLink = meetLink != null && meetLink.trim().length > 0;

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-6 p-6 bg-zinc-950 rounded-lg">
      <div className="rounded-full bg-zinc-800/80 p-8">
        <Video className="size-16 text-zinc-600" strokeWidth={1.5} />
      </div>

      {hasLink ? (
        <>
          <p className="text-sm font-medium text-zinc-400">
            아래 버튼을 클릭하여 Google Meet에 참가하세요.
          </p>
          <Button
            asChild
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <a href={meetLink} target="_blank" rel="noopener noreferrer">
              Google Meet 참가
            </a>
          </Button>
        </>
      ) : (
        <p className="text-sm font-medium text-zinc-500 text-center max-w-xs">
          강사가 링크를 등록할 때까지 기다려 주세요.
        </p>
      )}
    </div>
  );
}
