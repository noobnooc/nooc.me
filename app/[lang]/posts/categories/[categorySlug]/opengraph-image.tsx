import { categories } from "@/lib/velite";
import { getDictionary, Language } from "@/dictionaries";
import {
  generateOgImage,
  OG_IMAGE_SIZE,
  OG_IMAGE_CONTENT_TYPE,
} from "@/lib/og-image";

export const alt = "Category";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: { lang: Language; categorySlug: string };
}) {
  const dictionary = await getDictionary(params.lang);
  const category = categories.find((c) => c.slug === params.categorySlug);
  return generateOgImage({
    title: category?.name[params.lang] ?? "Category",
    type: "post",
    brandName: dictionary.labels.brandName,
    brandTagline: dictionary.labels.brandTagline,
  });
}
