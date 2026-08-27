"use client";

import { useActionState, useRef } from "react";
import { createConfessionComment, type ConfessionActionState } from "@/app/actions/confession";
import { inputClass } from "@/app/_components/ui";
import { Button } from "@/app/_components/button";

const initialState: ConfessionActionState = { status: "idle" };

export function ConfessionCommentForm({ confessionId }: { confessionId: string }) {
  const [, formAction, pending] = useActionState(createConfessionComment, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await formAction(formData);
        formRef.current?.reset();
      }}
      noValidate
      className="flex gap-2"
    >
      <input type="hidden" name="confessionId" value={confessionId} />
      <input
        name="body"
        type="text"
        placeholder="responder, também anonimamente"
        maxLength={500}
        className={`${inputClass} flex-1 py-2 text-sm`}
      />
      <Button type="submit" disabled={pending} className="px-3 py-2 text-sm">
        {pending ? "..." : "Enviar"}
      </Button>
    </form>
  );
}
