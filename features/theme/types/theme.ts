import type { ThemeCategory } from "@/features/theme/types/theme-category";

export type Theme = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: ThemeCategory;
  sortOrder: number;
  isActive: boolean;
  coverImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};
