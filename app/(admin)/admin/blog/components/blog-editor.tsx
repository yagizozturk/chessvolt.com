"use client";

import type { JSONContent } from "@tiptap/core";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { getBlogContentExtensions } from "@/features/blog/constants/blog-editor-extensions";

type Props = {
  initialContent: JSONContent;
};

const EMPTY_DOC: JSONContent = { type: "doc", content: [{ type: "paragraph" }] };

export function BlogEditor({ initialContent }: Props) {
  const [contentJson, setContentJson] = useState(() => JSON.stringify(initialContent ?? EMPTY_DOC));
  const extensions = useMemo(
    () => [...getBlogContentExtensions(), Placeholder.configure({ placeholder: "Write the post…" })],
    [],
  );
  const editor = useEditor(
    {
      immediatelyRender: false,
      shouldRerenderOnTransaction: true,
      extensions,
      content: initialContent,
      onUpdate: ({ editor: current }) => {
        setContentJson(JSON.stringify(current.getJSON()));
      },
    },
    [],
  );

  function setLink() {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previous ?? "https://");
    if (url === null) return;
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  }

  return (
    <div className="space-y-2">
      <input type="hidden" name="content" value={contentJson} readOnly />
      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" variant={editor?.isActive("bold") ? "secondary" : "outline"} onClick={() => editor?.chain().focus().toggleBold().run()} disabled={!editor}>
          Bold
        </Button>
        <Button type="button" size="sm" variant={editor?.isActive("italic") ? "secondary" : "outline"} onClick={() => editor?.chain().focus().toggleItalic().run()} disabled={!editor}>
          Italic
        </Button>
        <Button type="button" size="sm" variant={editor?.isActive("heading", { level: 2 }) ? "secondary" : "outline"} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} disabled={!editor}>
          H2
        </Button>
        <Button type="button" size="sm" variant={editor?.isActive("heading", { level: 3 }) ? "secondary" : "outline"} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} disabled={!editor}>
          H3
        </Button>
        <Button type="button" size="sm" variant={editor?.isActive("bulletList") ? "secondary" : "outline"} onClick={() => editor?.chain().focus().toggleBulletList().run()} disabled={!editor}>
          List
        </Button>
        <Button type="button" size="sm" variant={editor?.isActive("orderedList") ? "secondary" : "outline"} onClick={() => editor?.chain().focus().toggleOrderedList().run()} disabled={!editor}>
          Numbered
        </Button>
        <Button type="button" size="sm" variant={editor?.isActive("link") ? "secondary" : "outline"} onClick={setLink} disabled={!editor}>
          Link
        </Button>
      </div>
      <div className="border-input focus-within:border-primary focus-within:ring-primary/50 rounded-md border bg-transparent focus-within:ring-[3px] [&_.ProseMirror]:min-h-48 [&_.ProseMirror]:px-3 [&_.ProseMirror]:py-2 [&_.ProseMirror]:outline-none [&_.ProseMirror_p.is-editor-empty:first-child]:before:text-muted-foreground [&_.ProseMirror_p.is-editor-empty:first-child]:before:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child]:before:float-left [&_.ProseMirror_p.is-editor-empty:first-child]:before:h-0 [&_.ProseMirror_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
