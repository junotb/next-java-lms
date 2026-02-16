"use client";

import { Github } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

const ICON_SIZE = 20;

/** 모노톤 소셜 로그인 아이콘. currentColor로 사이트 테마에 맞춤. 크기 통일. */
const SocialIcon = ({ provider }: { provider: string }) => {
  const wrapperClass = "shrink-0 inline-flex items-center justify-center text-current";
  const svgStyle = { width: ICON_SIZE, height: ICON_SIZE, minWidth: ICON_SIZE, minHeight: ICON_SIZE };

  if (provider === "github") {
    return (
      <span className={wrapperClass} style={{ width: ICON_SIZE, height: ICON_SIZE }}>
        <Github
          size={ICON_SIZE}
          strokeWidth={2}
          style={svgStyle}
          aria-hidden
        />
      </span>
    );
  }
  if (provider === "google") {
    return (
      <span className={wrapperClass} style={{ width: ICON_SIZE, height: ICON_SIZE }}>
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          style={svgStyle}
          aria-hidden
        >
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
      </span>
    );
  }
  if (provider === "naver") {
    return (
      <span className={wrapperClass} style={{ width: ICON_SIZE, height: ICON_SIZE }}>
        <svg viewBox="0 0 24 24" fill="currentColor" style={svgStyle} aria-hidden>
          <path d="M16.273 12.845L7.376 0H0v24h7.726V11.155L16.624 24H24V0h-7.727z" />
        </svg>
      </span>
    );
  }
  if (provider === "kakao") {
    return (
      <span className={wrapperClass} style={{ width: ICON_SIZE, height: ICON_SIZE }}>
        <svg viewBox="0 0 24 24" fill="currentColor" style={svgStyle} aria-hidden>
          <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.88 1.9 5.42 4.74 6.9-.2.73-.73 2.65-.83 3.06-.13.53.22.52.4.38.14-.1 2.3-1.55 3.25-2.21.54.08 1.1.12 1.69.12 5.523 0 10-3.477 10-7.5S17.523 3 12 3z" />
        </svg>
      </span>
    );
  }
  return null;
};

const SOCIAL_PROVIDERS = [
  { provider: "github" as const, label: "GitHub" },
  { provider: "google" as const, label: "Google" },
  { provider: "naver" as const, label: "Naver" },
  { provider: "kakao" as const, label: "Kakao" },
] as const;

/**
 * 소셜 로그인 버튼 그룹.
 * 로그인/회원가입 모달에서 공통 사용.
 * OAuth 리다이렉트 후 /api/auth/complete에서 역할 기반 리다이렉트 처리.
 */
export default function SocialLoginButtons() {
  const handleSocialSignIn = (
    provider: "github" | "google" | "naver" | "kakao"
  ) => {
    authClient.signIn.social({
      provider,
      callbackURL: "/api/auth/complete",
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
            className="w-full gap-2"
            onClick={() => handleSocialSignIn(provider)}
          >
            <SocialIcon provider={provider} />
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}
