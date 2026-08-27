"use client";

import { useActionState, useRef } from "react";
import { createPost, type PostActionState } from "@/app/actions/post";
import { inputClass } from "@/app/_components/ui";
import { Button } from "@/app/_components/button";
import { ErrorToast } from "@/app/_components/error-toast";

const initialState: PostActionState = { status: "idle" };

// Envolve a seleção atual do textarea com o marcador (** pra negrito, * pra
// itálico) — igual a caixa de comentário do GitHub. O textarea aqui é não
// controlado (sem value/onChange), então mexer direto no DOM + disparar um
// "input" é seguro; o dispatch é só pra manter os listeners nativos felizes.
function wrapSelection(textarea: HTMLTextAreaElement, marker: string) {
  const { selectionStart, selectionEnd, value } = textarea;
  const selected = value.slice(selectionStart, selectionEnd) || "texto";
  const before = value.slice(0, selectionStart);
  const after = value.slice(selectionEnd);

  textarea.value = `${before}${marker}${selected}${marker}${after}`;
  textarea.focus();
  textarea.setSelectionRange(selectionStart + marker.length, selectionStart + marker.length + selected.length);
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
}

const toolbarBtnClass =
  "cursor-pointer rounded-lg border border-line px-2.5 py-1 font-sans text-sm text-ink transition-colors hover:border-accent-500 hover:text-accent-700";

export function PostForm() {
  const [state, formAction, pending] = useActionState(createPost, initialState);
  const fieldErrors = state.status === "error" ? state.fieldErrors : undefined;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function applyFormat(marker: string) {
    if (textareaRef.current) wrapSelection(textareaRef.current, marker);
  }

  function handleShortcut(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (!(e.ctrlKey || e.metaKey)) return;
    if (e.key === "b") {
      e.preventDefault();
      applyFormat("**");
    } else if (e.key === "i") {
      e.preventDefault();
      applyFormat("*");
    }
  }

  return (
    <form action={formAction} noValidate className="flex flex-col gap-3">
      <ErrorToast state={state} />
      <input
        name="title"
        placeholder="Título"
        required
        aria-invalid={!!fieldErrors?.title}
        className={inputClass}
      />

      <div className="flex gap-1.5">
        <button type="button" onClick={() => applyFormat("**")} title="Negrito (Ctrl+B)" className={toolbarBtnClass}>
          <span className="font-bold">B</span>
        </button>
        <button type="button" onClick={() => applyFormat("*")} title="Itálico (Ctrl+I)" className={toolbarBtnClass}>
          <span className="italic">I</span>
        </button>
      </div>

      <textarea
        ref={textareaRef}
        name="body"
        placeholder="Escreva aqui..."
        required
        rows={14}
        onKeyDown={handleShortcut}
        aria-invalid={!!fieldErrors?.body}
        className={`${inputClass} resize-y`}
      />
      <input
        name="embedUrl"
        placeholder="Link do YouTube ou Instagram (opcional)"
        aria-invalid={!!fieldErrors?.embedUrl}
        className={inputClass}
      />
      <Button type="submit" disabled={pending}>
        {pending ? "Publicando..." : "Publicar"}
      </Button>
    </form>
  );
}
