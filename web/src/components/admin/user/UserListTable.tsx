import { User } from "@/schemas/user/user";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil } from "lucide-react";
import {
  USER_ROLE_NAMES,
  USER_STATUS_NAMES,
  USER_ROLE_COLORS,
  USER_STATUS_COLORS,
} from "@/constants/auth";

interface UserListTableProps {
  users: User[];
  onUpdate: (userId: string) => void;
}

export default function UserListTable({ users, onUpdate }: UserListTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>이름</TableHead>
          <TableHead>이메일</TableHead>
          <TableHead>역할</TableHead>
          <TableHead>상태</TableHead>
          <TableHead className="relative">
            <span className="sr-only">수정</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell
              className="max-w-24 truncate text-muted-foreground sm:max-w-none"
              title={user.email}
            >
              {user.email}
            </TableCell>
            <TableCell>
              <Badge
                className={cn(
                  "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold leading-5 sm:px-3 sm:py-1 sm:text-sm",
                  USER_ROLE_COLORS[user.role]
                )}
              >
                {USER_ROLE_NAMES[user.role]}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge
                className={cn(
                  "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold leading-5 sm:px-3 sm:py-1 sm:text-sm",
                  USER_STATUS_COLORS[user.status]
                )}
              >
                {USER_STATUS_NAMES[user.status]}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button
                onClick={() => onUpdate(user.id)}
                size="sm"
                variant="ghost"
                className="h-8 w-8 shrink-0 p-0 sm:inline-flex sm:h-auto sm:w-auto sm:gap-2 sm:px-3 sm:py-2"
                aria-label={`${user.name} 수정`}
              >
                <Pencil className="h-4 w-4" />
                <span className="hidden sm:inline">수정</span>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
