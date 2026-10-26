import type { MetadataRoute } from "next";

import { getPublishedBlogSitemapEntries } from "@/features/blog/services/blog.service";
import { getAllOpenings, getAllOpeningVariants } from "@/features/openings/services/openings.service";
import { getActiveStudiesWithPuzzleCountAndThemes } from "@/features/study/services/study.service";
import { getPublicUser } from "@/lib/supabase/auth";
import { getOpeningPath, getOpeningVariantPath } from "@/features/openings/utilities/opening-variant-path.utils"; // Utility'ler eklendi


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
      url: `${siteUrl}/blog`,
      changeFrequency: "weekly",
      priority: 0.6,
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

  const [openings, variants, studies, posts] = await Promise.all([
    getAllOpenings(supabase),
    getAllOpeningVariants(supabase),
    getActiveStudiesWithPuzzleCountAndThemes(supabase),
    getPublishedBlogSitemapEntries(supabase),
  ]);

  const openingPages: MetadataRoute.Sitemap = openings
    .filter((opening) => opening.slug)
    .map((opening) => ({
      url: `${siteUrl}${getOpeningPath(opening)}`, // Utility kullanıldı
      lastModified: new Date(opening.createdAt),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  const variantPages: MetadataRoute.Sitemap = variants.map((variant) => {
    const opening = openings.find((o) => o.id === variant.openingId);
    if (!opening) return null;

    return {
      url: `${siteUrl}${getOpeningVariantPath(opening, variant)}`, // Utility kullanıldı
      lastModified: new Date(variant.createdAt),
      changeFrequency: "weekly",
      priority: 0.6,
    };
  }).filter(Boolean) as MetadataRoute.Sitemap;    
    
  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const studyPages: MetadataRoute.Sitemap = studies.map((study) => ({
    url: `${siteUrl}/studies/${study.slug}`,
    lastModified: new Date(study.updatedAt),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...openingPages, ...variantPages, ...studyPages, ...blogPages];
}