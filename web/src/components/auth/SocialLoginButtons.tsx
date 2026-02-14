"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

const SOCIAL_PROVIDERS = [
  { provider: "github" as const, label: "GitHub" },
  { provider: "google" as const, label: "Google" },
  { provider: "naver" as const, label: "네이버" },
  { provider: "kakao" as const, label: "카카오" },
] as const;

/**
 * 소셜 로그인 버튼 그룹.
 * 로그인/회원가입 모달에서 공통 사용.
 * OAuth 리다이렉트 후 /auth/complete에서 역할 기반 리다이렉트 처리.
 */
export default function SocialLoginButtons() {
  const handleSocialSignIn = (
    provider: "github" | "google" | "naver" | "kakao"
  ) => {
    authClient.signIn.social({
      provider,
      callbackURL: "/auth/complete",
    });
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <p className="text-sm text-muted-foreground text-center">
        또는 소셜 계정으로 계속하기
      </p>
      <div className="grid grid-cols-2 gap-2">
        {SOCIAL_PROVIDERS.map(({ provider, label }) => (
          <Button
            key={provider}
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => handleSocialSignIn(provider)}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}
