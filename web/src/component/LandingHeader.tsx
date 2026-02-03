"use client";

import Link from "next/link";
import ArrowLeftEndOnRectangle from "@/asset/icon/arrow-left-end-on-rectangle.svg";
import BookOpenIcon from "@/asset/icon/book-open.svg";
import { useAuthModalStore } from "@/store/useAuthModalStore";
import { Button } from "@/component/ui/button";

export default function LandingHeader() {
  const { openModal } = useAuthModalStore();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <BookOpenIcon />
          <h1 className="font-bold">NexLang</h1>
        </Link>
        <div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openModal("signin")}
            className="text-muted-foreground hover:text-foreground"
            aria-label="로그인"
          >
            <ArrowLeftEndOnRectangle className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}
