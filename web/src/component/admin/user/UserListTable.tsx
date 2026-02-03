import { User } from "@/schema/user/user";
import { cn } from "@/lib/utils";
import { Badge } from "@/component/ui/badge";
import { Button } from "@/component/ui/button";

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

// 역할과 상태에 따른 색상 스타일을 매핑하여 관리합니다.
const USER_ROLE_COLORS: Record<string, string> = {
  STUDENT: "bg-primary/10 text-primary",
  TEACHER: "bg-secondary text-secondary-foreground",
  ADMIN: "bg-accent text-accent-foreground",
};

const USER_STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  INACTIVE: "bg-destructive/10 text-destructive",
};

interface UserListTableProps {
  users: User[];
  onUpdate: (userId: string) => void;
}

export default function UserListTable({ users, onUpdate }: UserListTableProps) {
  return (
    <table className="min-w-full divide-y divide-border">
      <thead className="bg-muted">
        <tr>
          <th
            scope="col"
            className="px-6 py-4 text-left text-sm font-medium text-muted-foreground uppercase tracking-wider"
          >
            이름
          </th>
          <th
            scope="col"
            className="px-6 py-4 text-left text-sm font-medium text-muted-foreground uppercase tracking-wider"
          >
            이메일
          </th>
          <th
            scope="col"
            className="px-6 py-4 text-left text-sm font-medium text-muted-foreground uppercase tracking-wider"
          >
            역할
          </th>
          <th
            scope="col"
            className="px-6 py-4 text-left text-sm font-medium text-muted-foreground uppercase tracking-wider"
          >
            상태
          </th>
          <th scope="col" className="relative px-6 py-4">
            <span className="sr-only">수정</span>
          </th>
        </tr>
      </thead>
      <tbody className="bg-card divide-y divide-border">
        {users.map((user) => (
          <tr key={user.id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground text-left">
              {user.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-left">
              {user.email}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-left">
              <Badge
                className={cn(
                  "inline-flex rounded-full px-3 py-1 text-sm font-semibold leading-5",
                  USER_ROLE_COLORS[user.role]
                )}
              >
                {USER_ROLE_NAMES[user.role]}
              </Badge>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-left">
              <Badge
                className={cn(
                  "inline-flex rounded-full px-3 py-1 text-sm font-semibold leading-5",
                  USER_STATUS_COLORS[user.status]
                )}
              >
                {USER_STATUS_NAMES[user.status]}
              </Badge>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-right">
              <Button
                onClick={() => onUpdate(user.id)}
                className="px-2 lg:px-4 py-2 text-sm"
              >
                수정
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
