"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createConfession, type ConfessionActionState } from "@/app/actions/confession";
import { inputClass, cardClass } from "@/app/_components/ui";
import { Button } from "@/app/_components/button";
import { ErrorToast } from "@/app/_components/error-toast";
import { ConfessionFoldOverlay } from "@/app/_components/confession-fold-overlay";

const initialState: ConfessionActionState = { status: "idle" };

type Phase = "idle" | "folding" | "appearing";

export function ConfessionForm() {
  const [state, formAction, pending] = useActionState(createConfession, initialState);
  const [draft, setDraft] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const fieldErrors = state.status === "error" ? state.fieldErrors : undefined;

  useEffect(() => {
    if (state.status !== "success") return;
    setPhase("folding");
  }, [state]);

  return (
    <div className="relative mb-10">
      <form
        ref={formRef}
        action={async (formData) => {
          await formAction(formData);
          formRef.current?.reset();
          setDraft("");
        }}
        onAnimationEnd={() => {
          if (phase === "appearing") setPhase("idle");
        }}
        noValidate
        className={`relative flex flex-col gap-3 p-5 ${cardClass} ${phase === "folding" ? "opacity-0" : ""} ${
          phase === "appearing" ? "confession-appear" : ""
        }`}
      >
        <ErrorToast state={state} />
        <p className="font-sans text-xs text-ink-muted">O que você não tem coragem de dizer?</p>
        <textarea
          name="body"
          rows={4}
          maxLength={500}
          placeholder="Escreva aqui. Ninguém vai saber que foi você."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          aria-invalid={!!fieldErrors?.body}
          className={`${inputClass} resize-y font-body`}
        />
        <p className="font-sans text-xs text-ink-muted">
          Evite nomes, telefones, endereços ou qualquer coisa que identifique você ou outra pessoa. Depois de
          publicado, fica visível pra qualquer um.
        </p>
        <div className="flex justify-end">
          <Button type="submit" disabled={pending || draft.trim().length === 0}>
            {pending ? "Publicando..." : "Publicar anonimamente"}
          </Button>
        </div>

        <div className="paper-texture-overlay" />
      </form>

      {phase === "folding" && <ConfessionFoldOverlay onDone={() => setPhase("appearing")} />}
    </div>
  );
}
