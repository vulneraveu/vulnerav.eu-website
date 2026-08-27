import { db } from "@/lib/db";
import { getIpHash } from "@/lib/anon";
import { getOptionalSession, getPermissions } from "@/lib/dal";
import { PERMISSIONS } from "@/lib/permissions";
import { ConfessionForm } from "@/app/_components/confession-form";
import { ConfessionCard } from "@/app/_components/confession-card";
import { Pagination } from "@/app/_components/pagination";

const PAGE_SIZE = 20;

export default async function MuralPage({ searchParams }: PageProps<"/mural">) {
  const { page: pageParam } = await searchParams;
  const requestedPage = Math.max(1, Number(pageParam) || 1);

  const totalCount = await db.confession.count({ where: { approved: true } });
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);

  const [confessions, ipHash, session] = await Promise.all([
    db.confession.findMany({
      where: { approved: true },
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        body: true,
        createdAt: true,
        likesCount: true,
        feelsCount: true,
        comments: {
          orderBy: { createdAt: "asc" },
          select: { id: true, body: true },
        },
      },
    }),
    getIpHash(),
    getOptionalSession(),
  ]);

  const reactions = confessions.length
    ? await db.confessionReaction.findMany({
        where: { ipHash, confessionId: { in: confessions.map((c) => c.id) } },
        select: { confessionId: true, type: true },
      })
    : [];
  const reacted = new Set(reactions.map((r) => `${r.confessionId}:${r.type}`));

  const canModerate = session
    ? (await getPermissions(session.userId)).has(PERMISSIONS.CONFESSION_MODERATE)
    : false;

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-8 pt-8 pb-16">
      <div className="relative mx-auto h-16 w-full max-w-[420px]">
        <div className="mural-rope" />
        <div className="mural-pin" style={{ left: "20%" }} />
        <div className="mural-pin" style={{ left: "50%" }} />
        <div className="mural-pin" style={{ left: "78%" }} />
      </div>

      <ConfessionForm />

      {confessions.length === 0 ? (
        <p className="text-center font-sans text-sm text-ink-muted">
          Ninguém escreveu ainda no mural. Seja a primeira pessoa.
        </p>
      ) : (
        <div className="flex flex-col">
          {confessions.map((confession) => (
            <ConfessionCard
              key={confession.id}
              confession={confession}
              liked={reacted.has(`${confession.id}:LIKE`)}
              felt={reacted.has(`${confession.id}:FEEL`)}
              canModerate={canModerate}
            />
          ))}
        </div>
      )}

      {totalCount > PAGE_SIZE && (
        <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/mural" />
      )}
    </main>
  );
}
