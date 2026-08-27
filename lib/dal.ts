import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getSessionToken, decrypt, deleteSession } from "@/lib/session";
import { db } from "@/lib/db";
import { ROLES } from "@/lib/roles";

// Sessão válida só se o JWT decodificar E a role não for "locked" (ver lib/roles.ts).
export const getOptionalSession = cache(async () => {
  const token = await getSessionToken();
  const payload = await decrypt(token);
  if (!payload?.userId) return null;

  const user = await db.user.findUnique({
    where: { id: payload.userId },
    select: { role: { select: { name: true } } },
  });

  if (!user || user.role.name === ROLES.LOCKED) return null;

  return { userId: payload.userId };
});

export const verifySession = cache(async () => {
  const session = await getOptionalSession();

  if (!session) {
    await deleteSession();
    redirect("/login");
  }

  return session;
});

export const getUser = cache(async () => {
  const session = await getOptionalSession();
  if (!session) return null;

  return db.user.findUnique({
    where: { id: session.userId },
    select: { id: true, nickname: true, role: { select: { name: true } } },
  });
});

export const getPermissions = cache(async (userId: string) => {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      role: {
        select: { permissions: { select: { permission: { select: { key: true } } } } },
      },
    },
  });

  return new Set(user?.role.permissions.map((p) => p.permission.key) ?? []);
});

export async function requirePermission(key: string) {
  const session = await verifySession();
  const permissions = await getPermissions(session.userId);

  if (!permissions.has(key)) {
    redirect("/painel");
  }

  return session;
}
