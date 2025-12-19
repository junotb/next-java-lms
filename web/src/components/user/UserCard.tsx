"use client";

import Link from "next/link";
import UserIcon from "@/assets/icons/user.svg";

interface UserCardProps {
  href: string;
  email: string;
  firstName: string;
  lastName: string;
};

export default function UserCard({ href, email, firstName, lastName }: UserCardProps) {
  return (
    <Link
      href={href}
      className="rounded-2xl border bg-white active:bg-gray-300 p-4 shadow active:shadow-xl transition"
      role="listitem"
      aria-label={`${firstName} ${lastName} 카드`}
    >
      <div className="flex flex-col items-center gap-2">
        <UserIcon className="w-12 h-12 fill-black" />
        <div className="text-center">
          <h3 className="text-base font-semibold">{firstName} {lastName}</h3>
          <p className="text-sm">{email}</p>
        </div>
      </div>
    </Link>
  );
}
