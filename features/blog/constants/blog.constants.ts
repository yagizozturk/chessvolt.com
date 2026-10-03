export const BLOG_PAGE_SIZE = 6;
export const BLOG_PREVIEW_LENGTH = 160;
export const BLOG_COVERS_BUCKET = "blog-covers";
export const BLOG_COVER_MAX_BYTES = 2 * 1024 * 1024;

export const BLOG_COVER_CONTENT_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

export type BlogCoverContentType = keyof typeof BLOG_COVER_CONTENT_TYPES;
