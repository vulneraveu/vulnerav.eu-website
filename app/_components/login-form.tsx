"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { login, type AuthActionState } from "@/app/actions/auth";
import { inputClass } from "@/app/_components/ui";
import { Button } from "@/app/_components/button";
import { ErrorToast } from "@/app/_components/error-toast";

const initialState: AuthActionState = { status: "idle" };

export function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(login, initialState);
  const fieldErrors = state.status === "error" ? state.fieldErrors : undefined;
  // Controlado só pra sobreviver ao reset automático do form após a action
  // — senha continua descontrolada, some no erro (não precisa persistir).
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (state.status !== "success") return;
    if (onSuccess) onSuccess();
    else router.push("/");
    router.refresh();
  }, [state, router, onSuccess]);

  return (
    <form action={formAction} noValidate className="flex flex-col gap-3">
      <ErrorToast state={state} />
      <input
        name="email"
        type="email"
        placeholder="e-mail"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-invalid={!!fieldErrors?.email}
        className={inputClass}
      />
      <input
        name="password"
        type="password"
        placeholder="senha"
        required
        autoComplete="current-password"
        aria-invalid={!!fieldErrors?.password}
        className={inputClass}
      />
      <Button type="submit" disabled={pending}>
        {pending ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
