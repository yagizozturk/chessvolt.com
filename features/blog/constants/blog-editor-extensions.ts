import Link from "@tiptap/extension-link";
import StarterKit from "@tiptap/starter-kit";

function isSafeBlogLink(url: string): boolean {
  try {
    const parsed = new URL(url, "https://www.chessvolt.com");
    return parsed.protocol === "http:" || parsed.protocol === "https:" || parsed.protocol === "mailto:";
  } catch {
    return false;
  }
}

export function getBlogContentExtensions() {
  return [
    StarterKit.configure({
      heading: { levels: [2, 3] },
      link: false,
      blockquote: false,
      code: false,
      codeBlock: false,
      horizontalRule: false,
      strike: false,
      underline: false,
    }),
    Link.configure({
      openOnClick: false,
      autolink: true,
      defaultProtocol: "https",
      protocols: ["http", "https", "mailto"],
      HTMLAttributes: {
        rel: "noopener noreferrer nofollow",
        target: "_blank",
      },
      isAllowedUri: (url, { defaultValidate }) => isSafeBlogLink(url) && defaultValidate(url),
    }),
  ];
}
