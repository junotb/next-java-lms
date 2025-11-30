"use client";

import Bars3Icon from "@/assets/icons/bars-3.svg";
import BookOpenIcon from "@/assets/icons/book-open.svg";

export default function HomeHeader() {
  return (
    <header className="sticky flex justify-center top-0 z-40 border-b w-full bg-background">
      <div className="flex items-center justify-between px-4 h-16 w-full">
        <div className="flex items-center space-x-2">
          <BookOpenIcon />
          <h1 className="font-bold">Next-Java-Lms</h1>
        </div>
        <div>
          <button aria-label="메뉴 열기">
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
}