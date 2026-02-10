"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { BetterError } from "@/types/auth";
import type {
  SignInEmailRequest,
  SignUpEmailRequest,
} from "@/schema/auth/auth";
import { useAuthModalStore } from "@/store/useAuthModalStore";
import { useToastStore } from "@/store/useToastStore";
import SignInForm from "@/component/auth/SignInForm";
import SignUpForm from "@/component/auth/SignUpForm";
import Loader from "@/component/common/Loader";
import { authClient } from "@/lib/auth-client";
import { Dialog, DialogContent } from "@/component/ui/dialog";
import { Button } from "@/component/ui/button";
import { cn } from "@/lib/utils";
import { ROLE_REDIRECT_MAP, MODAL_TYPES } from "@/constants/auth";

export default function AuthModalContainer() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<BetterError | null>(null);

  const router = useRouter();
  const { showToast } = useToastStore();
  const { modalType, openModal, closeModal } = useAuthModalStore();

  useEffect(() => {
    setError(null);
  }, [modalType]);

  if (!modalType) return null;

  const handleSignIn = async (payload: SignInEmailRequest) => {
    const { data, error } = await authClient.signIn.email(payload, {
      onRequest: () => {
        setIsLoading(true);
        setError(null);
      },
      onSuccess: () => setIsLoading(false),
      onError: () => setIsLoading(false),
    });

    if (error) {
      setError(error);
      return;
    }

    if (!data) {
      showToast("로그인에 실패했습니다.", "error");
      return;
    }

    const { role } = data.user as unknown as { role: string };

    const redirectPath = ROLE_REDIRECT_MAP[role] || "/";

    // 로그인 후 뒤로가기 시 모달이 다시 뜨는 것을 방지하기 위해 push 대신 replace를 사용합니다.
    // 이 방식은 사용자 경험을 향상시킵니다.
    router.replace(redirectPath);
    closeModal();
  };

  const handleSignUp = async (payload: SignUpEmailRequest) => {
    const { data, error } = await authClient.signUp.email(payload, {
      onRequest: () => {
        setIsLoading(true);
        setError(null);
      },
      onSuccess: () => setIsLoading(false),
      onError: () => setIsLoading(false),
    });

    if (error) {
      setError(error);
    } else if (data) {
      openModal(MODAL_TYPES.SIGN_IN);
      showToast("회원가입이 완료되었습니다. 로그인해주세요.", "success");
    }
  };

  return (
    <Dialog open={!!modalType} onOpenChange={(isOpen) => !isOpen && closeModal()}>
      <DialogContent
        onClose={closeModal}
        className={cn(
          "relative w-full max-w-md overflow-hidden rounded-2xl bg-card shadow-2xl transition-all animate-scale-in p-8 sm:p-10"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={closeModal}
          aria-label="모달 닫기"
          className="absolute right-5 top-5 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          ✕
        </Button>

        {isLoading && <Loader />}
        {!isLoading && modalType === MODAL_TYPES.SIGN_IN && (
          <SignInForm error={error} onSubmit={handleSignIn} />
        )}
        {!isLoading && modalType === MODAL_TYPES.SIGN_UP && (
          <SignUpForm error={error} onSubmit={handleSignUp} />
        )}

        <Button
          variant="link"
          onClick={() =>
            openModal(
              modalType === MODAL_TYPES.SIGN_IN
                ? MODAL_TYPES.SIGN_UP
                : MODAL_TYPES.SIGN_IN
            )
          }
          className="mt-6 w-full text-center text-sm text-muted-foreground hover:text-foreground"
        >
          {modalType === MODAL_TYPES.SIGN_IN
            ? "계정이 없으신가요? 회원가입"
            : "이미 계정이 있으신가요? 로그인"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
