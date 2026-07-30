import { error } from "@sveltejs/kit";
import { categories, findCategory, findPost, isSection, posts } from "$lib/content";
import { getDictionary, isLanguage, languages } from "$lib/dictionaries";
import { displayDate } from "$lib/date";
import { generateOgImage, type OgImageOptions } from "$lib/og/image";
import { resumeContent } from "$lib/resume";
import { activities } from "../../../params/activity";
import type { EntryGenerator, RequestHandler } from "./$types";

export const prerender = true;

/** Static pages under each language, with their page-layout OG options. */
const PAGE_EMOJIS: Record<string, string> = {
  life: "🌿",
  work: "🛠",
  about: "👋",
  resume: "📄",
  "life/reading": "📚",
  "life/films": "🎬",
  "life/music": "🎵",
};

export const entries: EntryGenerator = () => [
  ...languages.map((lang) => ({ path: `${lang}.png` })),
  ...languages.flatMap((lang) =>
    Object.keys(PAGE_EMOJIS).map((page) => ({ path: `${lang}/${page}.png` })),
  ),
  ...posts.map((post) => ({
    path: `${post.lang}/${post.section}/${post.slug}.png`,
  })),
  ...categories.flatMap((category) =>
    languages.map((lang) => ({
      path: `${lang}/${category.section}/categories/${category.slug}.png`,
    })),
  ),
];

function resolveOptions(path: string): OgImageOptions | undefined {
  if (!path.endsWith(".png")) return undefined;

  const segments = path.slice(0, -".png".length).split("/");
  const lang = segments.shift();
  if (!lang || !isLanguage(lang)) return undefined;

  const dictionary = getDictionary(lang);
  const branding = {
    brandName: dictionary.labels.brandName,
    brandTagline: dictionary.labels.brandTagline,
  };
  const page = segments.join("/");

  // Home
  if (page === "") {
    return {
      title: "Nooc",
      description: dictionary.meta.motto,
      type: "page",
      showTitleAvatar: true,
      ...branding,
    };
  }

  // Static pages
  if (page in PAGE_EMOJIS) {
    const titles: Record<string, string> = {
      life: dictionary.labels.life,
      work: dictionary.labels.works,
      about: dictionary.labels.aboutTitle,
      resume: resumeContent[lang].name,
      "life/reading": dictionary.labels.reading,
      "life/films": dictionary.labels.films,
      "life/music": dictionary.labels.music,
    };
    const descriptions: Record<string, string | undefined> = {
      work: dictionary.labels.noocWorks,
      about: dictionary.labels.aboutSubtitle || undefined,
      resume: resumeContent[lang].imageDescription,
    };
    return {
      title: titles[page],
      subtitle: descriptions[page],
      emoji: PAGE_EMOJIS[page],
      type: "page",
      ...branding,
    };
  }

  const [section, ...rest] = segments;
  if (!isSection(section)) return undefined;
  const type = section === "life" ? "life" : "post";

  // Category pages
  if (rest.length === 2 && rest[0] === "categories") {
    const category = findCategory(section, rest[1]);
    if (!category) return undefined;
    return { title: category.name[lang], type, ...branding };
  }

  // Post pages
  if (rest.length === 1) {
    const post = findPost(lang, section, rest[0]);
    if (!post) return undefined;
    return {
      title: post.title,
      description: post.description,
      category: post.categories[0],
      date: displayDate(post.date, "en-US"),
      type,
      ...branding,
    };
  }

  return undefined;
}

export const GET: RequestHandler = async ({ params }) => {
  const options = resolveOptions(params.path);
  if (!options) error(404, "No OG image for this path");

  const png = await generateOgImage(options);

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400",
    },
  });
};
