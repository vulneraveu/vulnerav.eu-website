"use client";

import { useEffect, useState } from "react";

const FOLD_MS = 750;
const FADE_MS = 400;

// Dobra "de verdade": a metade esquerda do papel gira em 3D a partir da
// própria dobradiça (a linha vertical do meio) e fecha sobre a metade
// direita, parada — como fechar um livro pela lombada. Só então
// desaparece. Não mostra o texto da confissão (é só o "papel" dobrando).
export function ConfessionFoldOverlay({ onDone }: { onDone: () => void }) {
  const [stage, setStage] = useState<"fold" | "fade">("fold");

  useEffect(() => {
    const toFade = setTimeout(() => setStage("fade"), FOLD_MS);
    const toDone = setTimeout(onDone, FOLD_MS + FADE_MS);
    return () => {
      clearTimeout(toFade);
      clearTimeout(toDone);
    };
  }, [onDone]);

  return (
    <div className={`confession-fold-overlay ${stage === "fade" ? "confession-fold-out" : ""}`}>
      <div className="confession-fold-panel confession-fold-left">
        <div className="paper-texture-overlay" />
      </div>
      <div className="confession-fold-panel confession-fold-right-static">
        <div className="paper-texture-overlay" />
      </div>
    </div>
  );
}
