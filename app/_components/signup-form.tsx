"use client";

import { useActionState, useState } from "react";
import { signup, type AuthActionState } from "@/app/actions/auth";
import { inputClass } from "@/app/_components/ui";
import { Button } from "@/app/_components/button";
import { ErrorToast } from "@/app/_components/error-toast";

const initialState: AuthActionState = { status: "idle" };

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signup, initialState);
  const fieldErrors = state.status === "error" ? state.fieldErrors : undefined;
  // Controlados só pra sobreviver ao reset automático do form após a action
  // — senha continua descontrolada, some no erro (não precisa persistir).
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");

  return (
    <form action={formAction} noValidate className="flex flex-col gap-3">
      <ErrorToast state={state} />
      <input
        name="nickname"
        placeholder="apelido"
        required
        autoComplete="nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        aria-invalid={!!fieldErrors?.nickname}
        className={inputClass}
      />
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
        autoComplete="new-password"
        aria-invalid={!!fieldErrors?.password}
        className={inputClass}
      />
      <input
        name="passwordConfirmation"
        type="password"
        placeholder="confirme a senha"
        required
        autoComplete="new-password"
        aria-invalid={!!fieldErrors?.passwordConfirmation}
        className={inputClass}
      />
      <Button type="submit" disabled={pending}>
        {pending ? "Criando..." : "Criar conta"}
      </Button>
    </form>
  );
}
