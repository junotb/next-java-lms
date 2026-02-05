"use client";

import { useState } from "react";
import { Video, Mic, MicOff, Camera, CameraOff } from "lucide-react";
import { Button } from "@/component/ui/button";
import { cn } from "@/lib/utils";

export default function VideoArea() {
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(false);

  return (
    <div className="relative flex-1 min-h-0 flex flex-col bg-zinc-950 rounded-lg overflow-hidden">
      {/* 중앙: 카메라 대기 영역 */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-zinc-500">
        <div className="rounded-full bg-zinc-800/80 p-8">
          <Video className="size-16 text-zinc-600" strokeWidth={1.5} />
        </div>
        <p className="text-sm font-medium">카메라 연결 대기 중</p>
      </div>

      {/* 하단 오버레이: 마이크/카메라 토글 */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2",
          "py-3 bg-gradient-to-t from-black/70 to-transparent"
        )}
      >
        <Button
          type="button"
          variant={micOn ? "secondary" : "destructive"}
          size="icon"
          className="rounded-full h-12 w-12 bg-zinc-800/90 hover:bg-zinc-700 border-0"
          onClick={() => setMicOn((v) => !v)}
          aria-label={micOn ? "마이크 끄기" : "마이크 켜기"}
        >
          {micOn ? <Mic className="size-5" /> : <MicOff className="size-5" />}
        </Button>
        <Button
          type="button"
          variant={cameraOn ? "secondary" : "destructive"}
          size="icon"
          className="rounded-full h-12 w-12 bg-zinc-800/90 hover:bg-zinc-700 border-0"
          onClick={() => setCameraOn((v) => !v)}
          aria-label={cameraOn ? "카메라 끄기" : "카메라 켜기"}
        >
          {cameraOn ? <Camera className="size-5" /> : <CameraOff className="size-5" />}
        </Button>
      </div>
    </div>
  );
}
