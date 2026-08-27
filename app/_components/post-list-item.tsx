import { Button } from "@/app/_components/button";
import { formatText } from "@/app/_components/format-text";

type PostListItemProps = {
  slug: string;
  title: string;
  author: string;
  createdAt: Date;
  excerpt: string;
};

export function PostListItem({ slug, title, author, createdAt, excerpt }: PostListItemProps) {
  return (
    <article className="flex flex-col items-center gap-4 text-center">
      <h2 className="font-heading text-3xl font-medium text-ink">{title}</h2>
      <p className="font-sans text-xs uppercase tracking-wide text-ink-muted">
        {author} / {createdAt.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}
      </p>
      <p className="font-body text-[17px] leading-relaxed text-ink-muted line-clamp-4">{formatText(excerpt)}</p>
      <Button href={`/blog/${slug}`}>Ver mais</Button>
    </article>
  );
}
