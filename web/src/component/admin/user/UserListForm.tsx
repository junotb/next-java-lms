import { useForm } from "react-hook-form";
import type { UserListRequest, UserListFormValues } from "@/schema/user/user";
import { UserRoleSchema } from "@/schema/user/user-role";
import { UserStatusSchema } from "@/schema/user/user-status";

// 스키마와 UI 표시 이름을 매핑하여 중앙에서 관리합니다.
const USER_ROLE_NAMES: Record<string, string> = {
  STUDENT: "학생",
  TEACHER: "강사",
  ADMIN: "관리자",
};
const USER_STATUS_NAMES: Record<string, string> = {
  ACTIVE: "활성",
  INACTIVE: "비활성",
};

interface UserListFormProps {
  onSubmit: (data: UserListRequest) => void;
}

export default function UserListForm({ onSubmit }: UserListFormProps) {
  const { register, handleSubmit, reset } = useForm<UserListFormValues>({
    defaultValues: {
      role: undefined,
      status: undefined,
      name: "",
    },
    mode: "onSubmit",
  });

  const handleReset = () =>
    reset({
      role: undefined,
      status: undefined,
      name: "",
    });

  return (
    <form
      className="flex flex-wrap justify-start items-end gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          이름
        </label>
        <input
          id="name"
          type="text"
          className="border px-2 lg:px-4 py-2 w-20 lg:w-32 text-sm rounded-md"
          {...register("name")}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="role" className="text-sm font-medium text-gray-700">
          역할
        </label>
        <select
          id="role"
          className="border px-2 lg:px-4 py-2 w-20 lg:w-24 text-sm rounded-md"
          {...register("role")}
        >
          <option value="">전체</option>
          {UserRoleSchema.options.map((role) => (
            <option key={role} value={role}>
              {USER_ROLE_NAMES[role]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="status" className="text-sm font-medium text-gray-700">
          상태
        </label>
        <select
          id="status"
          className="border px-2 lg:px-4 py-2 w-20 lg:w-24 text-sm rounded-md"
          {...register("status")}
        >
          <option value="">전체</option>
          {UserStatusSchema.options.map((status) => (
            <option key={status} value={status}>
              {USER_STATUS_NAMES[status]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-center items-center gap-4">
        <button
          type="button"
          onClick={handleReset}
          className="border px-2 lg:px-4 py-2 text-sm rounded-md cursor-pointer"
        >
          초기화
        </button>

        <button
          type="submit"
          className="border border-blue-600 bg-blue-600 text-white px-2 lg:px-4 py-2 text-sm rounded-md hover:bg-blue-700 cursor-pointer"
        >
          검색
        </button>
      </div>
    </form>
  );
}
