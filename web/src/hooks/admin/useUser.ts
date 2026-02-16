"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userList, userProfile, userCreate, userProfileUpdate, userDelete, userRoleStats } from "@/lib/user";
import { User, UserListRequest, UserCreateRequest, UserProfileUpdateRequest } from "@/schemas/user/user";
import { UserRole } from "@/schemas/user/user-role";
import { STALE_TIME_LIST, STALE_TIME_STATS } from "@/constants/config";
import { toast } from "sonner";

/**
 * 사용자 목록 조회.
 * @param request - 목록 필터/페이지 조건
 */
export function useUserList(request: UserListRequest) {
  return useQuery<User[], Error>({
    queryKey: ["user", "list", request],
    queryFn: async () => await userList(request),
    enabled: true,
    staleTime: STALE_TIME_LIST,
  });
}

/**
 * 사용자 상세 조회.
 * @param userId - 사용자 ID
 * @param options.enabled - 쿼리 실행 여부
 */
export function useUserProfile(userId: string, options?: { enabled?: boolean }) {
  return useQuery<User, Error>({
    queryKey: ["user", userId],
    queryFn: async () => await userProfile(userId),
    enabled: options?.enabled ?? userId.length > 0,
  });
}

/**
 * 사용자 등록.
 * 성공 시 목록 캐시 무효화. 에러 시 Toast 표시.
 */
export function useUserCreate() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: UserCreateRequest) => userCreate(payload),
    onSuccess: async () => await qc.invalidateQueries({ queryKey: ["user"] }),
    onError: (err) => {
      toast.error(err?.message ?? "사용자 등록에 실패했습니다.");
    },
  });
}

/**
 * 사용자 수정.
 * 성공 시 목록 캐시 무효화. 에러 시 Toast 표시.
 */
export function useUserProfileUpdate() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, payload }: { userId: string; payload: UserProfileUpdateRequest }) => userProfileUpdate(userId, payload),
    onSuccess: async () => await qc.invalidateQueries({ queryKey: ["user"] }),
    onError: (err) => {
      toast.error(err?.message ?? "사용자 수정에 실패했습니다.");
    },
  });
}

/**
 * 사용자 삭제.
 * 성공 시 목록 캐시 무효화. 에러 시 Toast 표시.
 */
export function useUserDelete() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => userDelete(userId),
    onSuccess: async () => await qc.invalidateQueries({ queryKey: ["user"] }),
    onError: (err) => {
      toast.error(err?.message ?? "사용자 삭제에 실패했습니다.");
    },
  });
}

/**
 * 사용자 역할별 통계.
 * 대시보드 등에서 사용.
 */
export function useUserRoleStats() {
  return useQuery<Record<UserRole, number>, Error>({
    queryKey: ["user", "role-stats"],
    queryFn: async () => await userRoleStats(),
    enabled: true,
    staleTime: STALE_TIME_STATS,
  });
}