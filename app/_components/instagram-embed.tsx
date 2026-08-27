import Link from "next/link";

// O widget oficial de embed da Instagram (blockquote + embed.js) está
// quebrado no Chrome atual — o script deles depende do evento "unload",
// que o navegador descontinuou, e não há como contornar isso do nosso lado.
// Até a Meta corrigir o script, mostramos um card levando pro post.
export function InstagramEmbed({ url }: { url: string }) {
  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-3 rounded-lg border border-line bg-paper px-4 py-5 font-sans text-sm text-ink transition-colors hover:border-accent-500 hover:text-accent-700"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
      </svg>
      Ver post no Instagram
    </Link>
  );
}
