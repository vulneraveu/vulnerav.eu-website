import type { EmbedProvider } from "@/generated/prisma/client";

type ParsedEmbed = { provider: EmbedProvider; externalId: string };

/**
 * Extrai o provider + id de uma URL do YouTube/Instagram, validado no
 * servidor. Nunca renderize HTML/iframe vindo do usuário — só o
 * provider+id validados aqui, que o componente de embed transforma na
 * src de um iframe a partir de um template fixo.
 */
export function parseEmbedUrl(url: string): ParsedEmbed | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  if (parsed.protocol !== "https:") return null;

  const host = parsed.hostname.replace(/^www\./, "");

  if (host === "youtube.com" || host === "m.youtube.com") {
    const id = parsed.searchParams.get("v");
    if (id && /^[\w-]{11}$/.test(id)) return { provider: "YOUTUBE", externalId: id };
    return null;
  }

  if (host === "youtu.be") {
    const id = parsed.pathname.slice(1);
    if (/^[\w-]{11}$/.test(id)) return { provider: "YOUTUBE", externalId: id };
    return null;
  }

  if (host === "instagram.com") {
    const match = parsed.pathname.match(/^\/(reel|p)\/([\w-]+)\/?$/);
    if (match) return { provider: "INSTAGRAM", externalId: match[1] + ":" + match[2] };
    return null;
  }

  return null;
}

// Instagram não usa mais iframe direto — ver app/_components/instagram-embed.tsx.
export function youtubeEmbedSrc(externalId: string) {
  return `https://www.youtube-nocookie.com/embed/${externalId}`;
}
