import type { MetadataRoute } from "next";

// Cambiar por el dominio real cuando se publique el sitio.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.gruporca.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
