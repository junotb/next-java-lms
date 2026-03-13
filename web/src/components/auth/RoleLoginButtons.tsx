"use client";

import { Shield, GraduationCap, User } from "lucide-react";
import type { SignInEmailRequest } from "@/schemas/auth/auth";
import { Button } from "@/components/ui/button";
import { DEMO_ROLE_ACCOUNTS, USER_ROLE_COLORS } from "@/constants/auth";
import type { UserRole } from "@/schemas/user/user-role";

const ROLE_ICONS: Record<UserRole, React.ElementType> = {
  ADMIN: Shield,
  TEACHER: GraduationCap,
  STUDENT: User,
};

interface RoleLoginButtonsProps {
  onSignIn: (payload: SignInEmailRequest) => void;
}

/**
 * 역할별 데모 로그인 버튼.
 * 관리자·강사·학생 계정으로 원클릭 로그인.
 */
export default function RoleLoginButtons({ onSignIn }: RoleLoginButtonsProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <p className="text-sm text-muted-foreground text-center">
        데모 계정으로 로그인
      </p>
      <div className="flex flex-col gap-2">
        {DEMO_ROLE_ACCOUNTS.map(({ role, email, password, label }) => {
          const Icon = ROLE_ICONS[role];
          return (
            <Button
              key={role}
              type="button"
              variant="outline"
              className={`w-full justify-start gap-2 ${USER_ROLE_COLORS[role]} hover:opacity-90`}
              onClick={() => onSignIn({ email, password })}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              {label}로 로그인
            </Button>
          );
        })}
      </div>
    </div>
  );
}
