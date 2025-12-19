"use client";

import BookOpenIcon from "@/assets/icons/book-open.svg";
import Link from "next/link";

export default function AdminHeader() {
  return (
    <header className="sticky flex justify-center top-0 z-40 border-b w-full bg-background">
      <div className="flex items-center justify-between px-4 h-16 w-full">
        <div className="flex items-center space-x-2">
          <BookOpenIcon />
          <h1 className="font-bold">Next-Java-Lms</h1>
        </div>
        <nav className="flex items-center space-x-6">
          <Link href="/admin" className="flex items-center">
            <span>대시보드</span>
          </Link>
          <Link href="/admin/user" className="flex items-center">
            <span>사용자</span>
          </Link>
          <Link href="/admin/schedule" className="flex items-center">
            <span>스케줄</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}