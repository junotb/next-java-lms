"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { withdraw } from "@/lib/user";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * 회원 탈퇴 폼. 확인 후 계정 및 모든 연관 데이터를 삭제합니다.
 */
export default function WithdrawForm() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleWithdraw = async () => {
    setIsSubmitting(true);
    try {
      await withdraw();
      await authClient.signOut();
      toast.success("회원 탈퇴가 완료되었습니다.");
      router.replace("/");
      router.refresh();
    } catch (e: unknown) {
      const message =
        e && typeof e === "object" && "message" in e
          ? String((e as { message: unknown }).message)
          : "탈퇴 처리에 실패했습니다.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
      setOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-md">
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
        <h3 className="font-semibold text-destructive">회원 탈퇴 안내</h3>
        <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground space-y-1">
          <li>계정 정보가 완전히 삭제됩니다.</li>
          <li>수강 신청·수업 스케줄·피드백 등 모든 연관 데이터가 삭제됩니다.</li>
          <li>탈퇴 후 같은 이메일로 재가입할 수 있습니다.</li>
        </ul>
      </div>
      <Button
        type="button"
        variant="destructive"
        className="w-fit"
        onClick={() => setOpen(true)}
      >
        회원 탈퇴
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>정말 탈퇴하시겠습니까?</DialogTitle>
            <DialogDescription>
              이 작업은 되돌릴 수 없습니다. 계정과 모든 관련 데이터가 삭제됩니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleWithdraw}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span
                  className="mr-2 inline-block size-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
                  aria-hidden
                />
              ) : null}
              탈퇴하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
