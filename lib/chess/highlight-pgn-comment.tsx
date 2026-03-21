import type { ReactNode } from "react";

/**
 * PGN yorum metninde `*Nd4*` gibi yıldız çiftleri arasını renkli vurgular (yıldızlar gösterilmez).
 */
export function highlightPgnCommentSpans(text: string): ReactNode {
  const re = /\*([^*]+)\*/g;
  const nodes: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    nodes.push(
      <span
        key={k++}
        className="text-primary bg-primary/15 dark:bg-primary/25 rounded px-1 py-0.5 font-semibold"
      >
        {m[1]}
      </span>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return <>{nodes}</>;
}
