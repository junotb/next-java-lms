"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserFilterSchema, UserFilter } from "@/schemas/user-filter-schema";
import { User } from "@/schemas/user-schema";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: {},
  } = useForm<UserFilter>({
    resolver: zodResolver(UserFilterSchema),
  });

  const handleReset = () => {
    reset({
      role: "STUDENT",
      lastName: "",
      firstName: "",
      status: "ACTIVE",
    });
  };

  const processSubmit = async (userFilter: UserFilter) => {
    const params = new URLSearchParams();

    params.set("role", userFilter.role);
    params.set("status", userFilter.status);

    if (userFilter.firstName) params.set("firstName", userFilter.firstName);
    if (userFilter.lastName) params.set("lastName", userFilter.lastName);

    const queryString = params.toString();

    const newUsers = await fetch(`/api/users?${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

    setUsers(newUsers);
  }

  return (
    <div>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="max-w-5xl w-full mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            사용자 목록
          </h1>
          
          <form
            method="post"
            className="flex flex-wrap items-end gap-4"
            onSubmit={handleSubmit(processSubmit)}
          >
            <div className="flex flex-col gap-1">
              <label
                htmlFor="role"
                className="text-sm font-medium text-gray-700"
              >
                역할
              </label>
              <select
                id="role"
                className="w-40 rounded-md border px-3 py-2 text-sm"
                {...register("role")}
              >
                <option value="STUDENT">학생</option>
                <option value="TEACHER">강사</option>
                <option value="ADMINISTRATOR">관리자</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="lastName"
                className="text-sm font-medium text-gray-700"
              >
                성
              </label>
              <input
                id="lastName"
                type="text"
                className="w-32 rounded-md border px-3 py-2 text-sm"
                {...register("lastName")}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="firstName"
                className="text-sm font-medium text-gray-700"
              >
                이름
              </label>
              <input
                id="firstName"
                type="text"
                className="w-36 rounded-md border px-3 py-2 text-sm"
                {...register("firstName")}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="status"
                className="text-sm font-medium text-gray-700"
              >
                상태
              </label>
              <select
                id="status"
                className="w-40 rounded-md border px-3 py-2 text-sm"
                {...register("status")}
              >
                <option value="ACTIVE">활성</option>
                <option value="INACTIVE">비활성</option>
              </select>
            </div>
    
            <button type="button" onClick={handleReset} className="rounded-md border px-4 py-2 text-sm cursor-pointer">
              초기화
            </button>

            <button type="submit" className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700 cursor-pointer">
              검색
            </button>
          </form>

          {users.length > 0 ? (
            <ul className="mt-8 w-full">
              {users.map((user) => (
                <li
                  key={user.id}
                  className="border-b py-4"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        {user.lastName} {user.firstName} ({user.role})
                      </p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status === "ACTIVE" ? "활성" : "비활성"}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-8 text-gray-600">검색된 사용자가 없습니다.</p>
          )}
        </div>
      </section>
    </div>
  );
}
