"use client";

import { useEffect, useState } from "react";

type ErrorState = { status: string; error?: string; fieldErrors?: Record<string, string[]> };

function collectMessages(state: ErrorState): string[] {
  if (state.status !== "error") return [];
  const messages = state.error ? [state.error] : [];
  for (const errors of Object.values(state.fieldErrors ?? {})) {
    if (errors?.[0]) messages.push(errors[0]);
  }
  return messages;
}

export function ErrorToast({ state }: { state: ErrorState }) {
  const [visible, setVisible] = useState(false);
  const messages = collectMessages(state);

  useEffect(() => {
    if (messages.length === 0) return;
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- retrigger em toda nova submissão, mesmo com a mesma mensagem
  }, [state]);

  if (messages.length === 0) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`fixed left-1/2 top-6 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-lg border border-danger/40 bg-surface px-4 py-3 text-center shadow-[var(--shadow-card)] transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0"
      }`}
    >
      <ul className="flex flex-col gap-1 font-sans text-sm text-danger">
        {messages.map((message, i) => (
          <li key={i}>{message}</li>
        ))}
      </ul>
    </div>
  );
}
