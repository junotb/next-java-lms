"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { ROLE_REDIRECT_MAP } from "@/constants/auth";
import Loader from "@/components/common/Loader";

/**
 * 소셜 로그인 콜백 후 리다이렉트 처리.
 * Better Auth OAuth callback 후 이 페이지로 이동하며, 역할에 맞는 경로로 리다이렉트합니다.
 */
export default function AuthCompletePage() {
  const router = useRouter();

  useEffect(() => {
    const redirect = async () => {
      const { data } = await authClient.getSession();
      const role = data?.user ? (data.user as { role?: string }).role : undefined;
      const path = role ? ROLE_REDIRECT_MAP[role] || "/" : "/";
      router.replace(path);
    };

    redirect();
  }, [router]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Loader />
    </div>
  );
}
