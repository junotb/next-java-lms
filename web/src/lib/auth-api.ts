"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import api from "@/lib/api";
import { UserCreateRequest, UserProfileRequest } from "@/schema/user/user";

export async function login(payload: UserProfileRequest) {
  try {
    console.log("로그인 시도 중...", payload);
    const response = await api.post("/api/v1/auth/login", payload);
    console.log("로그인 응답 받음:", response);
    const { token, user } = await response.data();

    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    if (user.role === "TEACHER") redirect("/teach");
    if (user.role === "ADMINISTRATOR") redirect("/admin");
    redirect("/study");
  } catch (error) {
    console.error("로그인에 실패했습니다:", error);
    throw error;
  }
}

export async function signup(payload: UserCreateRequest) {
  try {
    const response = await api.post("/api/v1/auth/signup", payload);
    const { token, user } = await response.data();

    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    
    if (user.role === "TEACHER") redirect("/teach");
    if (user.role === "ADMINISTRATOR") redirect("/admin");
    redirect("/study");
  } catch (error) {
    console.error("회원가입에 실패했습니다:", error);
    throw error;
  }
}

export async function logout() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete({
      name: "auth_token",
      path: "/",
    });
    redirect("/");
  } catch (error) {
    console.error("로그아웃에 실패했습니다:", error);
    throw error;
  }
}