import type { JSONContent } from "@tiptap/core";
import { generateHTML } from "@tiptap/html";

import { getBlogContentExtensions } from "@/features/blog/constants/blog-editor-extensions";

export function renderBlogHtml(content: JSONContent): string {
  return generateHTML(content, getBlogContentExtensions());
}
