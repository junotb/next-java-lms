import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UserListRequest, UserListFormValues } from "@/schema/user/user";
import { UserListRequestSchema } from "@/schema/user/user";
import { UserRoleSchema } from "@/schema/user/user-role";
import { UserStatusSchema } from "@/schema/user/user-status";
import { Input } from "@/component/ui/input";
import { Label } from "@/component/ui/label";
import { Button } from "@/component/ui/button";
import { cn } from "@/lib/utils";
import { Search, RotateCcw } from "lucide-react";

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
    resolver: zodResolver(UserListRequestSchema),
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
        <Label htmlFor="name" className="text-sm font-medium text-foreground">
          이름
        </Label>
        <Input
          id="name"
          type="text"
          className="px-2 lg:px-4 py-2 w-20 lg:w-32 text-sm h-auto"
          {...register("name")}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="role" className="text-sm font-medium text-foreground">
          역할
        </Label>
        <select
          id="role"
          className={cn(
            "flex h-10 w-20 lg:w-24 rounded-md border border-input bg-background px-2 lg:px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
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
        <Label htmlFor="status" className="text-sm font-medium text-foreground">
          상태
        </Label>
        <select
          id="status"
          className={cn(
            "flex h-10 w-20 lg:w-24 rounded-md border border-input bg-background px-2 lg:px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
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
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          className="px-2 lg:px-4 py-2 text-sm h-auto"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          초기화
        </Button>

        <Button
          type="submit"
          className="px-2 lg:px-4 py-2 text-sm h-auto"
        >
          <Search className="mr-2 h-4 w-4" />
          검색
        </Button>
      </div>
    </form>
  );
}
