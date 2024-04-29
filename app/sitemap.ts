import { MetadataRoute } from "next";
import { dictionaryKeys, getDictionary } from "../dictionaries";
import { posts } from "@/.velite";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dictionaries = await Promise.all(dictionaryKeys.map(getDictionary));

  const basicUrls = dictionaries.map((dictionary) => {
    return [
      {
        url: new URL(dictionary.urls.home, dictionary.meta.baseUrl).href,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1,
      },
      {
        url: new URL(dictionary.urls.posts, dictionary.meta.baseUrl).href,
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
  });

  const postUrls = posts.map((post) => {
    return {
      url: new URL(post.permalink, dictionaries[0].meta.baseUrl).href,
      lastModified: post.updated || post.date,
      changeFrequency: "daily" as const,
      priority: 1,
    };
  });

  return [...basicUrls.flat(), ...postUrls];
}
