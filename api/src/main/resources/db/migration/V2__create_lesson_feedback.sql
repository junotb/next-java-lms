-- 수업 후 피드백 테이블 (vttContent + Gemini feedback)
CREATE TABLE IF NOT EXISTS "lesson_feedback" (
    "id"         BIGSERIAL PRIMARY KEY,
    "scheduleId" BIGINT NOT NULL,
    "vttContent" TEXT NOT NULL,
    "feedbackContent" TEXT NULL,
    "feedbackStatus" VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "uk_lesson_feedback_schedule" UNIQUE ("scheduleId"),
    CONSTRAINT "fk_lesson_feedback_schedule" FOREIGN KEY ("scheduleId") REFERENCES "schedule" ("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "idx_lesson_feedback_schedule_id" ON "lesson_feedback" ("scheduleId");

COMMENT ON TABLE "lesson_feedback" IS '수업 녹화본의 VTT 자막 및 AI 피드백';
COMMENT ON COLUMN "lesson_feedback"."vttContent" IS '비디오 업로드 후 STT로 변환된 WebVTT 문자열';
COMMENT ON COLUMN "lesson_feedback"."feedbackContent" IS 'Gemini가 vttContent 기반으로 생성한 피드백';
COMMENT ON COLUMN "lesson_feedback"."feedbackStatus" IS 'PENDING | PROCESSING | COMPLETED | FAILED';
