"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "@/libs/api";
import { userList, userProfile, userCreate, userProfileUpdate, userDelete } from "@/libs/user";
import { User, UserListRequest, UserCreateRequest, UserProfileUpdateRequest } from "@/schemas/user";

// 사용자 목록 조회 훅
export function useUserList(filter: UserListRequest) {
  return useQuery<User[], Error>({
    queryKey: ["user", "list", filter],
    queryFn: () => userList(filter),
    enabled: true,
    staleTime: 5 * 60 * 1000,
  });
}

// 사용자 상세 조회 훅
export function useUserProfile(userId: number, options?: { enabled?: boolean }) {
  return useQuery<User, Error>({
    queryKey: ["user", userId],
    queryFn: async () => userProfile(userId),
    enabled: options?.enabled ?? userId > 0,
  });
}

// 사용자 등록 훅
export function useUserCreate() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: UserCreateRequest) => userCreate(payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: ApiError) => {
      console.error(`Failed to register user: ${error.status} ${error.message}`);
    }
  });
}

// 사용자 수정 훅
export function useUserProfileUpdate() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, payload }: { userId: number; payload: UserProfileUpdateRequest }) => userProfileUpdate(userId, payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: ApiError) => {
      console.error(`Failed to modify user: ${error.status} ${error.message}`);
    }
  });
}

// 사용자 삭제 훅
export function useUserDelete() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (userId: number) => userDelete(userId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: ApiError) => {
      console.error(`Failed to delete user: ${error.status} ${error.message}`);
    }
  });
}

