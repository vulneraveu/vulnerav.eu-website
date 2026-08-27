import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  const prevHref = currentPage > 1 ? `${basePath}?page=${currentPage - 1}` : undefined;
  const nextHref = currentPage < totalPages ? `${basePath}?page=${currentPage + 1}` : undefined;

  return (
    <nav
      aria-label="Paginação"
      className="mt-4 flex items-center justify-center gap-6 font-sans text-sm text-ink-muted"
    >
      {prevHref ? (
        <Link href={prevHref} className="text-ink transition-colors hover:text-accent-700">
          ← anterior
        </Link>
      ) : (
        <span className="opacity-40">← anterior</span>
      )}

      <span>
        página {currentPage} de {totalPages}
      </span>

      {nextHref ? (
        <Link href={nextHref} className="text-ink transition-colors hover:text-accent-700">
          próxima →
        </Link>
      ) : (
        <span className="opacity-40">próxima →</span>
      )}
    </nav>
  );
}
