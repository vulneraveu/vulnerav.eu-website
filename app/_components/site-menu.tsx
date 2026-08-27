"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { cardClass } from "@/app/_components/ui";
import { Button } from "@/app/_components/button";
import { TextLink } from "@/app/_components/text-link";

export function SiteMenu({ user, canWrite }: { user: { nickname: string } | null; canWrite: boolean }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const navItemClass =
    "rounded-lg px-3 py-2 text-center font-sans text-sm text-ink transition-colors hover:bg-paper";

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu"
        aria-expanded={open}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-line text-ink-muted transition-colors hover:border-accent-500 hover:text-accent-700"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      {open && (
        <div className={`absolute right-0 z-10 mt-3 w-64 p-2 ${cardClass}`}>
          <nav className="flex flex-col">
            <Link href="/" onClick={() => setOpen(false)} className={navItemClass}>
              Home
            </Link>
            <Link href="/confissoes" onClick={() => setOpen(false)} className={navItemClass}>
              Mural de Confissões
            </Link>
            {canWrite && (
              <Link href="/escrever" onClick={() => setOpen(false)} className={navItemClass}>
                Novo Artigo
              </Link>
            )}
          </nav>

          <div className="my-2 border-t border-line" />

          {user ? (
            <div className="flex flex-col gap-2 p-1">
              <form action={logout}>
                <Button type="submit" variant="danger" className="w-full">
                  Deslogar
                </Button>
              </form>
            </div>
          ) : (
            <div className="flex flex-col gap-2 p-1">
              <Button href="/login" onClick={() => setOpen(false)}>
                Entrar
              </Button>
              <p className="text-center font-sans text-sm text-ink-muted">
                Não tem conta? <TextLink href="/registro" onClick={() => setOpen(false)}>Cadastre-se</TextLink>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
