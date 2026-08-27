"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import { createSession, deleteSession } from "@/lib/session";
import { LoginSchema, SignupSchema } from "@/lib/validations/auth";
import { ROLES } from "@/lib/roles";
import { getIpHash } from "@/lib/anon";
import { consumeRateLimit } from "@/lib/rate-limit";

const FIVE_MINUTES = 5 * 60 * 1000;

export type AuthActionState =
  | { status: "idle" }
  | { status: "error"; error?: string; fieldErrors?: Record<string, string[]> }
  | { status: "success" };

export async function login(_prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { status: "error", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const ipHash = await getIpHash();
  const rateLimit = consumeRateLimit(`login:${ipHash}`, 5, FIVE_MINUTES);
  if (!rateLimit.allowed) {
    return { status: "error", error: "Muitas tentativas. Tente novamente em alguns minutos." };
  }

  const user = await db.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true, passwordHash: true, role: { select: { name: true } } },
  });

  // Mesma mensagem pra "não existe" e "senha errada" — não dar dica pra
  // quem está tentando enumerar e-mails cadastrados.
  const invalidCredentials: AuthActionState = { status: "error", error: "E-mail ou senha incorretos." };

  if (!user || user.role.name === ROLES.LOCKED) return invalidCredentials;

  const validPassword = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!validPassword) return invalidCredentials;

  await createSession(user.id);
  return { status: "success" };
}

export async function signup(_prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = SignupSchema.safeParse({
    nickname: formData.get("nickname"),
    email: formData.get("email"),
    password: formData.get("password"),
    passwordConfirmation: formData.get("passwordConfirmation"),
  });

  if (!parsed.success) {
    return { status: "error", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const ipHash = await getIpHash();
  const rateLimit = consumeRateLimit(`signup:${ipHash}`, 3, FIVE_MINUTES);
  if (!rateLimit.allowed) {
    return { status: "error", error: "Muitas tentativas. Tente novamente em alguns minutos." };
  }

  const existing = await db.user.findFirst({
    where: { OR: [{ email: parsed.data.email }, { nickname: parsed.data.nickname }] },
    select: { email: true, nickname: true },
  });

  if (existing) {
    return {
      status: "error",
      fieldErrors: {
        ...(existing.email === parsed.data.email ? { email: ["E-mail já cadastrado."] } : {}),
        ...(existing.nickname === parsed.data.nickname ? { nickname: ["Apelido já em uso."] } : {}),
      },
    };
  }

  const readerRole = await db.role.findUniqueOrThrow({ where: { name: ROLES.READER } });
  const passwordHash = await hashPassword(parsed.data.password);

  const user = await db.user.create({
    data: { nickname: parsed.data.nickname, email: parsed.data.email, passwordHash, roleId: readerRole.id },
    select: { id: true },
  });

  await createSession(user.id);
  redirect("/");
}

export async function logout() {
  await deleteSession();
  redirect("/");
}
