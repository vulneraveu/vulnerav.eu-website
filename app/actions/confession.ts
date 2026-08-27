"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getIpHash } from "@/lib/anon";
import { requirePermission } from "@/lib/dal";
import { PERMISSIONS } from "@/lib/permissions";
import { ConfessionSchema, ConfessionCommentSchema } from "@/lib/validations/confession";
import { consumeRateLimit } from "@/lib/rate-limit";

const FIVE_MINUTES = 5 * 60 * 1000;
const ONE_MINUTE = 60 * 1000;
const RATE_LIMIT_ERROR = "Muitas tentativas. Tente novamente em alguns minutos.";

export type ConfessionActionState =
  | { status: "idle" }
  | { status: "error"; error?: string; fieldErrors?: Record<string, string[]> }
  | { status: "success" };

export async function createConfession(
  _prevState: ConfessionActionState,
  formData: FormData
): Promise<ConfessionActionState> {
  const parsed = ConfessionSchema.safeParse({ body: formData.get("body") });

  if (!parsed.success) {
    return { status: "error", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const ipHash = await getIpHash();
  if (!consumeRateLimit(`confession:${ipHash}`, 3, FIVE_MINUTES).allowed) {
    return { status: "error", error: RATE_LIMIT_ERROR };
  }

  await db.confession.create({
    data: { body: parsed.data.body, ipHash },
  });

  revalidatePath("/mural");
  return { status: "success" };
}

const COUNT_FIELD = { LIKE: "likesCount", FEEL: "feelsCount" } as const;

// Toggle: primeiro clique registra a reação, um segundo clique do mesmo
// visitante (mesmo ipHash) remove — sem o "clica infinito" do mural antigo.
export async function reactToConfession(formData: FormData) {
  const confessionId = formData.get("confessionId");
  const type = formData.get("type");

  if (typeof confessionId !== "string" || (type !== "LIKE" && type !== "FEEL")) {
    return;
  }

  const ipHash = await getIpHash();
  if (!consumeRateLimit(`reaction:${ipHash}`, 60, ONE_MINUTE).allowed) return;
  const countField = COUNT_FIELD[type];

  const existing = await db.confessionReaction.findUnique({
    where: { confessionId_ipHash_type: { confessionId, ipHash, type } },
  });

  if (existing) {
    await db.$transaction([
      db.confessionReaction.delete({ where: { id: existing.id } }),
      db.confession.update({
        where: { id: confessionId },
        data: { [countField]: { decrement: 1 } },
      }),
    ]);
  } else {
    await db.$transaction([
      db.confessionReaction.create({ data: { confessionId, ipHash, type } }),
      db.confession.update({
        where: { id: confessionId },
        data: { [countField]: { increment: 1 } },
      }),
    ]);
  }

  revalidatePath("/mural");
}

export async function createConfessionComment(
  _prevState: ConfessionActionState,
  formData: FormData
): Promise<ConfessionActionState> {
  const confessionId = formData.get("confessionId");
  if (typeof confessionId !== "string") {
    return { status: "error", error: "Confissão inválida." };
  }

  const parsed = ConfessionCommentSchema.safeParse({ body: formData.get("body") });
  if (!parsed.success) {
    return { status: "error", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const ipHash = await getIpHash();
  if (!consumeRateLimit(`comment:${ipHash}`, 5, FIVE_MINUTES).allowed) {
    return { status: "error", error: RATE_LIMIT_ERROR };
  }

  await db.confessionComment.create({
    data: { body: parsed.data.body, confessionId, ipHash },
  });

  revalidatePath("/mural");
  return { status: "success" };
}

export async function deleteConfession(formData: FormData) {
  await requirePermission(PERMISSIONS.CONFESSION_MODERATE);

  const id = formData.get("confessionId");
  if (typeof id !== "string") return;

  await db.confession.delete({ where: { id } });
  revalidatePath("/mural");
}

export async function deleteConfessionComment(formData: FormData) {
  await requirePermission(PERMISSIONS.CONFESSION_MODERATE);

  const id = formData.get("commentId");
  if (typeof id !== "string") return;

  await db.confessionComment.delete({ where: { id } });
  revalidatePath("/mural");
}
