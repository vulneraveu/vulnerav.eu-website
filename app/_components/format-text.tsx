import type { ReactNode } from "react";

// Markdown bem mínimo — só **negrito** e *itálico*, nada além disso. Monta
// nós React direto (nunca uma string HTML), então não tem risco de XSS:
// tudo que não casar com esses dois padrões continua texto puro.
export function formatText(text: string): ReactNode[] {
  const pattern = /\*\*(.+?)\*\*|\*(.+?)\*/g;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text))) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    if (match[1] !== undefined) {
      nodes.push(<strong key={key++}>{match[1]}</strong>);
    } else if (match[2] !== undefined) {
      nodes.push(<em key={key++}>{match[2]}</em>);
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}
