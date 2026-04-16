import type { ReactNode } from "react";

type TokenType = "plain" | "tag" | "attr" | "string" | "expression";

type Token = {
  text: string;
  type: TokenType;
};

type CodeViewerProps = {
  code: string;
  className?: string;
};

const TOKEN_PATTERN =
  /("[^"\n]*"|'[^'\n]*'|<\/?[A-Za-z][\w.-]*|\/?>|[A-Za-z_:][\w:-]*(?==)|\{[^}\n]*\})/g;

const TOKEN_CLASSES: Record<TokenType, string> = {
  plain: "text-slate-100/90",
  tag: "text-pink-300",
  attr: "text-cyan-300",
  string: "text-amber-300",
  expression: "text-violet-300",
};

function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let lastIndex = 0;

  for (const match of code.matchAll(TOKEN_PATTERN)) {
    const index = match.index ?? 0;
    const matchedText = match[0];

    if (index > lastIndex) {
      tokens.push({ text: code.slice(lastIndex, index), type: "plain" });
    }

    if (
      matchedText.startsWith("<") ||
      matchedText.startsWith("</") ||
      matchedText === ">" ||
      matchedText === "/>"
    ) {
      tokens.push({ text: matchedText, type: "tag" });
    } else if (
      matchedText.startsWith('"') ||
      matchedText.startsWith("'")
    ) {
      tokens.push({ text: matchedText, type: "string" });
    } else if (matchedText.startsWith("{") && matchedText.endsWith("}")) {
      tokens.push({ text: matchedText, type: "expression" });
    } else {
      tokens.push({ text: matchedText, type: "attr" });
    }

    lastIndex = index + matchedText.length;
  }

  if (lastIndex < code.length) {
    tokens.push({ text: code.slice(lastIndex), type: "plain" });
  }

  return tokens;
}

function renderTokens(tokens: Token[]): ReactNode[] {
  return tokens.map((token, index) => (
    <span key={`${token.type}-${index}`} className={TOKEN_CLASSES[token.type]}>
      {token.text}
    </span>
  ));
}

export function CodeViewer({ code, className }: CodeViewerProps) {
  const containerClassName = className
    ? `overflow-x-auto rounded-md border bg-slate-950 p-3 text-sm leading-relaxed ${className}`
    : "overflow-x-auto rounded-md border bg-slate-950 p-3 text-sm leading-relaxed";

  return (
    <pre className={containerClassName}>
      <code className="block w-full whitespace-pre font-mono">
        {renderTokens(tokenize(code))}
      </code>
    </pre>
  );
}
