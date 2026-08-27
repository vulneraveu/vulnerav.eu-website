import type { ReactNode } from "react";
import { cardClass } from "@/app/_components/ui";

type AuthCardProps = {
  title: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthCard({ title, children, footer }: AuthCardProps) {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col px-6 py-16">
      <div className={`flex flex-col gap-6 p-8 ${cardClass}`}>
        <h1 className="font-heading text-3xl font-medium text-ink">{title}</h1>
        {children}
        <p className="text-center font-sans text-sm text-ink-muted">{footer}</p>
      </div>
    </main>
  );
}
