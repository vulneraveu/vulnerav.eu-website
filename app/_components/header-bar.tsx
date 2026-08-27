"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { SiteMenu } from "@/app/_components/site-menu";
import { ThemeToggle } from "@/app/_components/theme-toggle";

type User = { nickname: string } | null;

export function HeaderBar({ user, canWrite }: { user: User; canWrite: boolean }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (isHome) {
    return (
      <header>
        <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center px-10 py-8">
          <div />
          <Link
            href="/"
            className="justify-self-center font-heading text-5xl font-medium tracking-tight text-ink"
          >
            vulnerav.eu
          </Link>
          <div className="flex items-center justify-self-end gap-3">
            <ThemeToggle />
            <SiteMenu user={user} canWrite={canWrite} />
          </div>
        </div>
        <div className="mx-auto h-px w-32 bg-line" />
      </header>
    );
  }

  return (
    <header className="border-b border-line">
      <div className="flex w-full items-center justify-between px-8 py-5">
        <Link href="/" className="font-heading text-2xl font-medium tracking-tight text-ink">
          vulnerav.eu
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <SiteMenu user={user} canWrite={canWrite} />
        </div>
      </div>
    </header>
  );
}
