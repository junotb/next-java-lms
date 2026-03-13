"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { BetterError, SessionUser } from "@/types/auth";
import type {
  SignInEmailRequest,
  SignUpEmailRequest,
} from "@/schemas/auth/auth";
import { useAuthModalStore } from "@/stores/useAuthModalStore";
import { toast } from "sonner";
import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";
import SocialLoginButtons from "@/components/auth/SocialLoginButtons";
import RoleLoginButtons from "@/components/auth/RoleLoginButtons";
import Loader from "@/components/common/Loader";
import { authClient } from "@/lib/auth-client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ROLE_REDIRECT_MAP, MODAL_TYPES } from "@/constants/auth";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import {
  getRoleFromPath,
  toAnalyticsErrorCode,
  trackEvent,
} from "@/lib/analytics/client";

/**
 * 인증 모달 컨테이너.
 * 로그인/회원가입 폼, 소셜 로그인, 모달 전환 처리.
 */
export default function AuthModalContainer() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<BetterError | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const { modalType, openModal, closeModal } = useAuthModalStore();

  useEffect(() => {
    setError(null);
  }, [modalType]);

  if (!modalType) return null;

  const runWithLoading = async <T,>(
    fn: () => Promise<{ data: T | null; error: BetterError | null }>
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fn();
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (payload: SignInEmailRequest) => {
    trackEvent(ANALYTICS_EVENTS.AUTH_SIGNIN_ATTEMPT, {
      screen: pathname,
      role: getRoleFromPath(pathname),
      source: "auth_modal_signin_form",
    });

    const { data, error } = await runWithLoading(() =>
      authClient.signIn.email(payload)
    );

    if (error) {
      setError(error);
      trackEvent(ANALYTICS_EVENTS.AUTH_SIGNIN_RESULT, {
        screen: pathname,
        role: getRoleFromPath(pathname),
        source: "auth_modal_signin_form",
        result: "fail",
        error_code: toAnalyticsErrorCode(error),
      });
      return;
    }

    if (!data) {
      toast.error("로그인에 실패했습니다.");
      trackEvent(ANALYTICS_EVENTS.AUTH_SIGNIN_RESULT, {
        screen: pathname,
        role: getRoleFromPath(pathname),
        source: "auth_modal_signin_form",
        result: "fail",
        error_code: "unknown_error",
      });
      return;
    }

    const user = data.user as SessionUser;
    const redirectPath = user.role
      ? ROLE_REDIRECT_MAP[user.role]
      : "/";

    trackEvent(ANALYTICS_EVENTS.AUTH_SIGNIN_RESULT, {
      screen: pathname,
      role: getRoleFromPath(pathname),
      source: "auth_modal_signin_form",
      result: "success",
    });

    // 로그인 후 뒤로가기 시 모달이 다시 뜨는 것을 방지하기 위해 replace 사용
    router.replace(redirectPath);
    closeModal();
  };

  const handleSignUp = async (payload: SignUpEmailRequest) => {
    trackEvent(ANALYTICS_EVENTS.AUTH_SIGNUP_ATTEMPT, {
      screen: pathname,
      role: getRoleFromPath(pathname),
      source: "auth_modal_signup_form",
    });

    const { data, error } = await runWithLoading(() =>
      authClient.signUp.email(payload)
    );

    if (error) {
      setError(error);
      trackEvent(ANALYTICS_EVENTS.AUTH_SIGNUP_RESULT, {
        screen: pathname,
        role: getRoleFromPath(pathname),
        source: "auth_modal_signup_form",
        result: "fail",
        error_code: toAnalyticsErrorCode(error),
      });
      return;
    }

    if (data) {
      trackEvent(ANALYTICS_EVENTS.AUTH_SIGNUP_RESULT, {
        screen: pathname,
        role: getRoleFromPath(pathname),
        source: "auth_modal_signup_form",
        result: "success",
      });
      openModal(MODAL_TYPES.SIGN_IN);
      toast.success("회원가입이 완료되었습니다. 로그인해주세요.");
      return;
    }

    trackEvent(ANALYTICS_EVENTS.AUTH_SIGNUP_RESULT, {
      screen: pathname,
      role: getRoleFromPath(pathname),
      source: "auth_modal_signup_form",
      result: "fail",
      error_code: "unknown_error",
    });
  };

  return (
    <Dialog open={!!modalType} onOpenChange={(isOpen) => !isOpen && closeModal()}>
      <DialogContent
        className={cn(
          "w-full max-w-md overflow-hidden rounded-2xl bg-card shadow-2xl transition-all animate-scale-in p-8 sm:p-10"
        )}
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">
          {modalType === MODAL_TYPES.SIGN_IN ? "로그인" : "회원가입"}
        </DialogTitle>
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
          <>
            <SignInForm error={error} onSubmit={handleSignIn} />
            <div className="mt-4 pt-4 space-y-4 border-t border-border">
              <RoleLoginButtons onSignIn={handleSignIn} />
              <SocialLoginButtons />
            </div>
          </>
        )}
        {!isLoading && modalType === MODAL_TYPES.SIGN_UP && (
          <SignUpForm error={error} onSubmit={handleSignUp} />
        )}

        {!isLoading && modalType === MODAL_TYPES.SIGN_UP && (
          <div className="mt-4 pt-4 border-t border-border">
            <SocialLoginButtons />
          </div>
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
