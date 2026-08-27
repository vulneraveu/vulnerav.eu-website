import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { youtubeEmbedSrc } from "@/lib/embeds";
import { InstagramEmbed } from "@/app/_components/instagram-embed";
import { formatText } from "@/app/_components/format-text";

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;

  const post = await db.post.findFirst({
    where: { slug, published: true },
    select: {
      title: true,
      body: true,
      createdAt: true,
      author: { select: { nickname: true } },
      embeds: { select: { provider: true, externalId: true, url: true }, orderBy: { position: "asc" } },
    },
  });

  if (!post) notFound();

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-8 pt-8 pb-16">
      <article className="flex flex-col gap-6">
        <header className="flex flex-col items-center gap-2 text-center">
          <h1 className="font-heading text-4xl font-medium text-ink">{post.title}</h1>
          <p className="font-sans text-xs uppercase tracking-wide text-ink-muted">
            {post.author.nickname} /{" "}
            {post.createdAt.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </header>

        <div className="whitespace-pre-wrap font-body text-[17px] leading-relaxed text-ink">
          {formatText(post.body)}
        </div>

        {post.embeds.map((embed) =>
          embed.provider === "YOUTUBE" ? (
            <iframe
              key={embed.externalId}
              src={youtubeEmbedSrc(embed.externalId)}
              className="aspect-video w-full rounded-lg border border-line"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
            />
          ) : (
            <InstagramEmbed key={embed.externalId} url={embed.url} />
          )
        )}
      </article>
    </main>
  );
}
