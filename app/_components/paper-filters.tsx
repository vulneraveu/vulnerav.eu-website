// Filtro SVG compartilhado (sem nenhum asset externo) que gera a textura de
// "papel amassado e desdobrado" nos cards do mural. Só define, nunca
// aparece sozinho — outros elementos referenciam via filter: url(#id).
export function PaperFilters() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        {/* Região do filtro travada em 0%/100% (sem a folga padrão de -10%/120%
            do SVG) — uma região maior que o elemento pintava por cima do que
            tivesse ao redor do card, mesmo com overflow:hidden no CSS. */}
        <filter id="paper-texture" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="noise" />
          <feDiffuseLighting in="noise" lightingColor="#ffffff" surfaceScale="2.2" diffuseConstant="1.1" result="light">
            <feDistantLight azimuth="235" elevation="55" />
          </feDiffuseLighting>
        </filter>
      </defs>
    </svg>
  );
}
