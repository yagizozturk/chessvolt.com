import type { JSONContent } from "@tiptap/core";

import { BLOG_PREVIEW_LENGTH } from "@/features/blog/constants/blog.constants";

function collectText(node: JSONContent, parts: string[]) {
  if (typeof node.text === "string") {
    parts.push(node.text);
  }

  for (const child of node.content ?? []) {
    collectText(child, parts);
  }
}

export function blogContentToPlainText(content: JSONContent): string {
  const parts: string[] = [];
  collectText(content, parts);
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

export function truncateBlogPreview(content: JSONContent, maxLength = BLOG_PREVIEW_LENGTH): string {
  const text = blogContentToPlainText(content);
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

export function isBlogContentEmpty(content: JSONContent): boolean {
  return blogContentToPlainText(content).length === 0;
}

export function parseBlogContent(raw: string): JSONContent | null {
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || (value as JSONContent).type !== "doc") {
      return null;
    }
    return value as JSONContent;
  } catch {
    return null;
  }
}
