import type { MetadataRoute } from "next";

import { getAllOpenings } from "@/features/openings/services/openings.service";
import { getActiveStudiesWithPuzzleCountAndThemes } from "@/features/study/services/study.service";
import { getAllActiveThemes } from "@/features/theme/services/theme.service";
import { getPublicUser } from "@/lib/supabase/auth";

const siteUrl = process.env.PUBLIC_SITE_URL || "https://www.chessvolt.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/openings`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/puzzles`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/studies`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/privacy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const { supabase } = await getPublicUser();

  const [openings, themes, studies] = await Promise.all([
    getAllOpenings(supabase),
    getAllActiveThemes(supabase),
    getActiveStudiesWithPuzzleCountAndThemes(supabase),
  ]);

  const openingPages: MetadataRoute.Sitemap = openings
    .filter((opening) => opening.slug)
    .map((opening) => ({
      url: `${siteUrl}/openings/${opening.slug}/${opening.id}`,
      lastModified: new Date(opening.createdAt),
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  
  const studyPages: MetadataRoute.Sitemap = studies.map((study) => ({
    url: `${siteUrl}/studies/${study.slug}`,
    lastModified: new Date(study.updatedAt),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  /* Commented out because we don't want to include puzzle theme pages in the sitemap for now. We can uncomment this later if we decide to include them.
  const puzzleThemePages: MetadataRoute.Sitemap = themes.map((theme) => ({
    url: `${siteUrl}/puzzles/theme/${theme.slug}`,
    lastModified: new Date(theme.updatedAt),
    changeFrequency: "weekly",
    priority: 0.7,
  }));
  */ 


  return [...staticPages, ...openingPages, ...studyPages];
}