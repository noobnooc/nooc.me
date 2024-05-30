import dictionary from "@/dictionaries/en";
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${dictionary.meta.baseUrl}/sitemap.xml`,
  };
}
