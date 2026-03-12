import { getDictionary } from "@/dictionaries";
import { resumeContent } from "@/lib/resume";
import {
  generateOgImage,
  OG_IMAGE_CONTENT_TYPE,
  OG_IMAGE_SIZE,
} from "@/lib/og-image";

export const runtime = "edge";

export const alt = "Resume";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: { lang: "zh" | "en" };
}) {
  const dictionary = await getDictionary(params.lang);
  const content = resumeContent[params.lang];

  return generateOgImage({
    title: content.name,
    description: content.summary,
    type: "page",
    emoji: "📄",
    brandName: dictionary.labels.brandName,
    brandTagline: dictionary.labels.brandTagline,
  });
}
