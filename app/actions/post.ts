"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/dal";
import { PERMISSIONS } from "@/lib/permissions";
import { PostSchema } from "@/lib/validations/post";
import { parseEmbedUrl } from "@/lib/embeds";
import { slugify } from "@/lib/slug";

export type PostActionState =
  | { status: "idle" }
  | { status: "error"; error?: string; fieldErrors?: Record<string, string[]> }
  | { status: "success" };

async function uniqueSlug(title: string) {
  const base = slugify(title);
  let slug = base;
  let suffix = 1;

  while (await db.post.findUnique({ where: { slug }, select: { id: true } })) {
    suffix += 1;
    slug = `${base}-${suffix}`;
  }

  return slug;
}

export async function createPost(_prevState: PostActionState, formData: FormData): Promise<PostActionState> {
  const session = await requirePermission(PERMISSIONS.POST_CREATE);

  const rawEmbedUrl = formData.get("embedUrl");
  const parsed = PostSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
    embedUrl: rawEmbedUrl ? rawEmbedUrl : undefined,
  });

  if (!parsed.success) {
    return { status: "error", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const embed = parsed.data.embedUrl ? parseEmbedUrl(parsed.data.embedUrl) : null;
  if (parsed.data.embedUrl && !embed) {
    return { status: "error", fieldErrors: { embedUrl: ["Só aceitamos links do YouTube ou Instagram."] } };
  }

  const slug = await uniqueSlug(parsed.data.title);

  const post = await db.post.create({
    data: {
      slug,
      title: parsed.data.title,
      body: parsed.data.body,
      published: true,
      authorId: session.userId,
      embeds: embed
        ? { create: [{ provider: embed.provider, url: parsed.data.embedUrl!, externalId: embed.externalId }] }
        : undefined,
    },
    select: { slug: true },
  });

  redirect(`/blog/${post.slug}`);
}
