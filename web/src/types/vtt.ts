/**
 * VTT 자막 파싱 관련 타입 정의
 */

export interface VttCue {
  /** 시작 시간 (초) */
  start: number;
  /** 종료 시간 (초) */
  end: number;
  /** 화자 이름 (예: Speaker 1) */
  name: string;
  /** 자막 텍스트 */
  text: string;
}
