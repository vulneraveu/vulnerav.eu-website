"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { reactToConfession, deleteConfession, deleteConfessionComment } from "@/app/actions/confession";
import { cardClass } from "@/app/_components/ui";
import { ConfessionCommentForm } from "@/app/_components/confession-comment-form";
import { ConfirmDialog } from "@/app/_components/confirm-dialog";
import { HeartIcon, CommentIcon, FeelIcon, XIcon } from "@/app/_components/icons";

type Comment = { id: string; body: string };

type ConfessionCardProps = {
  confession: {
    id: string;
    body: string;
    createdAt: Date;
    likesCount: number;
    feelsCount: number;
    comments: Comment[];
  };
  liked: boolean;
  felt: boolean;
  canModerate: boolean;
};

function relativeTime(date: Date) {
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return "agora mesmo";
  if (diff < 3600) return `há ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `há ${Math.floor(diff / 3600)} horas`;
  return `há ${Math.floor(diff / 86400)} dias`;
}

// Hash tipo djb2 sobre a string inteira — soma dos primeiros N chars de um
// cuid dava rotação quase igual pra confissões criadas em sequência, porque
// o prefixo do cuid é derivado do timestamp (pouca entropia ali). Multiplicar
// e misturar a string toda espalha bem melhor.
function hashFor(id: string) {
  let hash = 5381;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 33) ^ id.charCodeAt(i);
  }
  return hash >>> 0;
}

// PRNG determinístico (mulberry32) a partir do hash — cada confissão sempre
// gera a mesma "aleatoriedade" (mesmo giro, mesmo recorte), mas sem repetir
// o padrão de uma pra outra.
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function rotationFor(hash: number) {
  const rand = mulberry32(hash);
  return (rand() - 0.5) * 2; // -1deg .. +1deg
}

// Ponto na posição t (0-1) do perímetro de um quadrado 0-100, sentido
// horário a partir do canto superior esquerdo.
function perimeterPoint(t: number): [number, number] {
  const p = t * 4;
  if (p < 1) return [p * 100, 0];
  if (p < 2) return [100, (p - 1) * 100];
  if (p < 3) return [100 - (p - 2) * 100, 100];
  return [0, 100 - (p - 3) * 100];
}

const PERIMETER_POINT_COUNT = 80;

function crumpleClipFor(hash: number) {
  const rand = mulberry32(hash ^ 0x2545f491);
  const clamp = (v: number) => Math.min(100, Math.max(0, v));
  const points: string[] = [];
  for (let i = 0; i < PERIMETER_POINT_COUNT; i++) {
    const [x, y] = perimeterPoint(i / PERIMETER_POINT_COUNT);
    const jx = (rand() - 0.5) * 1.6;
    const jy = (rand() - 0.5) * 1.6;
    points.push(`${clamp(x + jx).toFixed(1)}% ${clamp(y + jy).toFixed(1)}%`);
  }
  return `polygon(${points.join(", ")})`;
}

// O vinco vertical bem no meio do papel — marca de ter sido dobrado ao
// meio (a mesma dobra da animação de publicar, ver confession-fold-overlay)
// e depois desdobrado. Nunca é perfeitamente centralizado nem perfeitamente
// reto — desloca até ±1% do centro e inclina até ±0.5° — e cada confissão
// tem sua própria variação (determinística pelo hash). Fino e bem sutil.
function verticalCreaseFor(hash: number) {
  const rand = mulberry32(hash ^ 0x9e3779b9);
  const offsetX = (rand() - 0.5) * 2; // ±1% do centro
  const angleDeg = (rand() - 0.5) * 1; // ±0.5° de inclinação
  const height = 94; // de y=3 a y=97
  const dx = height * Math.tan((angleDeg * Math.PI) / 180);
  const baseX = 50 + offsetX;
  const topX = baseX - dx / 2;
  const bottomX = baseX + dx / 2;

  return {
    d: `M ${topX.toFixed(2)} 3 L ${bottomX.toFixed(2)} 97`,
    dark: (0.06 + rand() * 0.04).toFixed(2),
    light: (0.08 + rand() * 0.05).toFixed(2),
    width: 0.2 + rand() * 0.15,
  };
}

const ghostBtnClass =
  "reaction-btn flex min-h-11 cursor-pointer items-center gap-1.5 border-none bg-transparent p-3 font-sans text-[13px] text-ink-muted transition-colors disabled:cursor-not-allowed";

function ReactionButton({
  type,
  icon,
  label,
}: {
  type: "LIKE" | "FEEL";
  icon: React.ReactNode;
  label: React.ReactNode;
}) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" name="type" value={type} disabled={pending} className={ghostBtnClass}>
      {icon}
      {label}
    </button>
  );
}

export function ConfessionCard({ confession, liked, felt, canModerate }: ConfessionCardProps) {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{ message: string; form: HTMLFormElement } | null>(null);
  // Depois de confirmado no dialog custom, reenviamos o form de verdade via
  // requestSubmit() — o que dispara onSubmit de novo. Essa flag avisa o
  // handler pra deixar passar dessa vez, em vez de abrir o dialog de novo.
  const skipConfirmRef = useRef(false);
  const hash = hashFor(confession.id);
  const rotate = rotationFor(hash);
  const crease = verticalCreaseFor(hash);

  function confirmBeforeSubmit(e: React.FormEvent<HTMLFormElement>, message: string) {
    if (skipConfirmRef.current) {
      skipConfirmRef.current = false;
      return;
    }
    e.preventDefault();
    setPendingDelete({ message, form: e.currentTarget });
  }

  return (
    // Wrapper externo só cuida da rotação e do pin — o pin precisa poder
    // "furar" pra fora do card, então não pode estar dentro do elemento
    // recortado pelo clip-path abaixo. Ele vem DEPOIS do card no DOM de
    // propósito, pra pintar por cima do papel (senão o papel tapa o pin).
    <div className="relative mb-10" style={{ transform: `rotate(${rotate}deg)` }}>
      <div
        className={`relative p-5 mural-post-lines mural-post-card ${cardClass}`}
        style={{ clipPath: crumpleClipFor(hash) }}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="font-sans text-xs text-ink-muted">{relativeTime(confession.createdAt)}</p>

          {canModerate && (
            <form
              action={deleteConfession}
              onSubmit={(e) => confirmBeforeSubmit(e, "Apagar esta confissão e todos os comentários?")}
            >
              <input type="hidden" name="confessionId" value={confession.id} />
              <button
                type="submit"
                title="Apagar confissão"
                className="cursor-pointer text-ink-muted transition-colors hover:text-danger"
              >
                <XIcon />
              </button>
            </form>
          )}
        </div>

        <p className="mb-4 whitespace-pre-wrap font-body text-lg italic leading-[1.85] text-ink">
          {confession.body}
        </p>

        <div className="flex flex-nowrap items-center gap-2 overflow-x-auto sm:gap-5">
          <form action={reactToConfession}>
            <input type="hidden" name="confessionId" value={confession.id} />
            <ReactionButton type="LIKE" icon={<HeartIcon filled={liked} />} label={confession.likesCount} />
          </form>

          <button type="button" onClick={() => setCommentsOpen((v) => !v)} className={ghostBtnClass}>
            <CommentIcon />
            {confession.comments.length}
          </button>

          <form action={reactToConfession}>
            <input type="hidden" name="confessionId" value={confession.id} />
            <ReactionButton
              type="FEEL"
              icon={<FeelIcon filled={felt} />}
              label={
                <>
                  <span className="sm:hidden">também sinto isso</span>
                  <span className="hidden sm:inline">eu também sinto isso</span> {confession.feelsCount}
                </>
              }
            />
          </form>
        </div>

        {commentsOpen && (
          <div className="mt-4 flex flex-col gap-3 border-t border-line pt-4">
            {confession.comments.map((comment) => (
              <div key={comment.id} className="flex items-start justify-between gap-2">
                <p className="min-w-0 flex-1 border-l-2 border-line pl-3 font-body text-base leading-relaxed text-ink-muted">
                  {comment.body}
                </p>

                {canModerate && (
                  <form
                    action={deleteConfessionComment}
                    className="shrink-0"
                    onSubmit={(e) => confirmBeforeSubmit(e, "Apagar este comentário?")}
                  >
                    <input type="hidden" name="commentId" value={comment.id} />
                    <button
                      type="submit"
                      title="Apagar comentário"
                      className="mt-1 cursor-pointer text-ink-muted transition-colors hover:text-danger"
                    >
                      <XIcon />
                    </button>
                  </form>
                )}
              </div>
            ))}
            <ConfessionCommentForm confessionId={confession.id} />
          </div>
        )}

        <div className="paper-texture-overlay" />
        <svg className="paper-crease-overlay" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path
            d={crease.d}
            fill="none"
            stroke={`rgba(255,255,255,${crease.light})`}
            strokeWidth={crease.width + 0.1}
            strokeLinecap="round"
            transform="translate(0.15, 0.15)"
          />
          <path
            d={crease.d}
            fill="none"
            stroke={`rgba(0,0,0,${crease.dark})`}
            strokeWidth={crease.width}
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="mural-post-pin" />

      {pendingDelete && (
        <ConfirmDialog
          message={pendingDelete.message}
          onCancel={() => setPendingDelete(null)}
          onConfirm={() => {
            skipConfirmRef.current = true;
            pendingDelete.form.requestSubmit();
            setPendingDelete(null);
          }}
        />
      )}
    </div>
  );
}
