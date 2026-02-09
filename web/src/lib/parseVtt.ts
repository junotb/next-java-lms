/**
 * VTT 자막 파싱 유틸리티.
 * WEBVTT 형식 문자열을 파싱하여 start, end, name, text를 가진 객체 배열로 변환.
 * [Speaker Name] 형식의 화자 라벨을 name 필드로 추출하고, 나머지는 text에 저장.
 */

import type { VttCue } from "@/types/vtt";

// 하위 호환성을 위해 타입 re-export
export type { VttCue } from "@/types/vtt";

/** VTT 타임코드 (00:00:00.000)를 초로 변환 */
function parseVttTime(timeStr: string): number {
  const match = timeStr.trim().match(/^(\d{2}):(\d{2}):(\d{2})\.(\d{3})$/);
  if (!match) return 0;
  const [, h, m, s, ms] = match;
  return (
    parseInt(h!, 10) * 3600 +
    parseInt(m!, 10) * 60 +
    parseInt(s!, 10) +
    parseInt(ms!, 10) / 1000
  );
}

/**
 * VTT 문자열을 파싱하여 VttCue 배열로 반환.
 * @param vttContent - WEBVTT 형식의 자막 문자열
 * @returns 파싱된 자막 cue 배열
 */
export function parseVtt(vttContent: string): VttCue[] {
  const cues: VttCue[] = [];
  const lines = vttContent.split(/\r?\n/);
  let i = 0;

  // WEBVTT 헤더 건너뛰기
  while (i < lines.length && (lines[i].trim() === "" || lines[i].startsWith("WEBVTT"))) {
    i++;
  }

  // Cue 블록 파싱: "00:00:00.000 --> 00:00:05.000" 다음에 "[Speaker N] 텍스트"
  const timeLineRegex = /^(\d{2}:\d{2}:\d{2}\.\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}\.\d{3})$/;
  const speakerRegex = /^\[([^\]]+)\]\s*(.*)$/;

  while (i < lines.length) {
    const timeLine = lines[i];
    const timeMatch = timeLine.match(timeLineRegex);
    if (!timeMatch) {
      i++;
      continue;
    }

    const start = parseVttTime(timeMatch[1]);
    const end = parseVttTime(timeMatch[2]);
    i++;

    // 다음 줄이 텍스트 (빈 줄 또는 다음 cue 전까지)
    let text = "";
    let name = "Speaker 1";
    if (i < lines.length && lines[i].trim() !== "") {
      const content = lines[i].trim();
      const speakerMatch = content.match(speakerRegex);
      if (speakerMatch) {
        name = speakerMatch[1];
        text = speakerMatch[2];
      } else {
        text = content;
      }
      i++;
    }

    cues.push({ start, end, name, text });
  }

  return cues;
}
