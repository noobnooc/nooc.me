import { MetadataRoute } from "next";
import { dictionaryKeys, getDictionary } from "../dictionaries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls = await Promise.all(
    dictionaryKeys.map(async (lang) => {
      const dictionary = await getDictionary(lang);

      return [
        {
          url: new URL(dictionary.urls.home, dictionary.meta.baseUrl).href,
          lastModified: new Date(),
          changeFrequency: "daily" as const,
          priority: 1,
        },
        {
          url: new URL(dictionary.urls.works, dictionary.meta.baseUrl).href,
          lastModified: new Date(),
          changeFrequency: "daily" as const,
          priority: 0.8,
        },
      ];
    }),
  );

  return urls.flat();
}
