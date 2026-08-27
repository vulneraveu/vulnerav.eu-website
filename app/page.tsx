import { db } from "@/lib/db";
import { PostListItem } from "@/app/_components/post-list-item";

export default async function Home() {
  const posts = await db.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      body: true,
      createdAt: true,
      author: { select: { nickname: true } },
    },
  });

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-8 pt-8 pb-16">
      <p className="mx-auto max-w-xl text-center font-body text-xl italic leading-relaxed text-ink">
        eu quase me perdi.
        <br />
        agora me conto em voz alta.
      </p>

      {posts.length === 0 ? (
        <p className="mx-auto mt-16 font-sans text-sm text-ink-muted">Sem posts por enquanto.</p>
      ) : (
        <ul className="mx-auto mt-8 flex w-full max-w-3xl flex-col">
          {posts.map((post) => (
            <li key={post.id} className="border-b border-line py-12 first:pt-0 last:border-b-0">
              <PostListItem
                slug={post.slug}
                title={post.title}
                author={post.author.nickname}
                createdAt={post.createdAt}
                excerpt={post.body}
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
