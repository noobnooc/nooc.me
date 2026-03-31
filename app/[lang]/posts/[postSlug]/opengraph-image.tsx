import { posts } from "@/lib/velite";
import { getDictionary, Language } from "@/dictionaries";
import {
  generateOgImage,
  OG_IMAGE_SIZE,
  OG_IMAGE_CONTENT_TYPE,
} from "@/lib/og-image";

export const alt = "Post cover image";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: { lang: Language; postSlug: string };
}) {
  const dictionary = await getDictionary(params.lang);
  const post = posts.find(
    (p) => p.lang === params.lang && p.slug === params.postSlug,
  );

  if (!post) {
    return generateOgImage({
      title: "Not Found",
      type: "post",
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
    type: "post",
    brandName: dictionary.labels.brandName,
    brandTagline: dictionary.labels.brandTagline,
  });
}
