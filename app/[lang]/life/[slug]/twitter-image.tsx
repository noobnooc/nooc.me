import { lifePosts } from "@/lib/velite";
import { getDictionary, Language } from "@/dictionaries";
import {
  generateOgImage,
  OG_IMAGE_SIZE,
  OG_IMAGE_CONTENT_TYPE,
} from "@/lib/og-image";

export const alt = "Life post cover image";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: { lang: Language; slug: string };
}) {
  const dictionary = await getDictionary(params.lang);
  const post = lifePosts.find(
    (p) => p.lang === params.lang && p.slug === params.slug,
  );

  if (!post) {
    return generateOgImage({
      title: "Not Found",
      type: "life",
      brandName: dictionary.labels.brandName,
      brandTagline: dictionary.labels.brandTagline,
    });
  }

  const date = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return generateOgImage({
    title: post.title,
    description: post.description,
    category: post.categories[0],
    date,
    type: "life",
    brandName: dictionary.labels.brandName,
    brandTagline: dictionary.labels.brandTagline,
  });
}
