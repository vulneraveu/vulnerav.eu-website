"use client";

import { useEffect } from "react";
import { Button } from "@/app/_components/button";
import { cardClass } from "@/app/_components/ui";

type ConfirmDialogProps = {
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

// Confirmação custom pra ações destrutivas (apagar confissão/comentário),
// no lugar do window.confirm() nativo do navegador — feio e sem estilo.
export function ConfirmDialog({ message, confirmLabel = "Apagar", onConfirm, onCancel }: ConfirmDialogProps) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label={message}
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-sm p-6 text-center ${cardClass}`}
      >
        <p className="mb-6 font-body text-base leading-relaxed text-ink">{message}</p>
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded-lg px-4 py-2.5 font-sans text-sm font-medium text-ink-muted transition-colors hover:text-ink"
          >
            Cancelar
          </button>
          <Button type="button" variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
