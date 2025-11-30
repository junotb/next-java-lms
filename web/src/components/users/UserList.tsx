"use client";

import UserCard from "@/components/users/UserCard";
import { User } from "@/types/user";

type Props = {
  users: User[];
  basePath: string;
};

export default function UserList({ users, basePath }: Props) {
  return (
    <section>
      {users.length === 0 && (
        <div
          role="alert"
          className="flex justify-center items-center"
        >
          <p className="text-sm text-gray-500">등록된 사용자가 없습니다.</p>
        </div>
      )}
  
      {users.length > 0 && (
        <div
          role="list"
          className="flex flex-wrap gap-4 justify-center items-stretch"
        >
          {users.map((user) => (
            <UserCard key={user.email} href={`${basePath}/${user.email}`} email={user.email} firstName={user.firstName} lastName={user.lastName} />
          ))}
        </div>
      )}
    </section>
  );
}
