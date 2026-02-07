-- schedule 테이블에 Google Meet 링크 컬럼 추가
ALTER TABLE "schedule"
    ADD COLUMN IF NOT EXISTS "meetLink" VARCHAR(2048) NULL;

COMMENT ON COLUMN "schedule"."meetLink" IS 'Google Meet 등 화상 수업 링크. 강사가 수업 전 입력.';
