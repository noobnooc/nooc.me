import { posts, categories } from "@/.velite";
import { CalendarDaysIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { Language, dictionaryKeys, getDictionary } from "@/dictionaries";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { displayDate } from "@/lib/date";
import { getAlternateLanguages } from "@/lib/metadata";

export const runtime = "edge";

export async function generateMetadata({
  params,
}: {
  params: { lang: Language; categorySlug: string };
}): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang);
  const category = categories.find(
    (category) => category.slug === params.categorySlug,
  );

  if (!category) {
    notFound();
  }

  return {
    metadataBase: new URL(dictionary.meta.baseUrl),
    title: category.name[params.lang],
    description: category.description?.[params.lang],
    keywords: dictionary.meta.fillKeywords([]),
    openGraph: {
      type: "website",
      url: new URL(category.permalink[params.lang], dictionary.meta.baseUrl)
        .href,
      siteName: dictionary.meta.websiteName,
      title: category.name[params.lang],
      description: category.description?.[params.lang],
      images: "/static/banner.png",
    },
    twitter: {
      title: category.name[params.lang],
      description: category.description?.[params.lang],
      site: "@noobnooc",
      card: "summary_large_image",
    },
    alternates: {
      languages: await getAlternateLanguages(
        (dictionary) =>
          new URL(category.permalink[params.lang], dictionary.meta.baseUrl)
            .href,
      ),
    },
  };
}

function getPublishedPosts(lang: string, category: string) {
  return posts
    .sort((p1, p2) => new Date(p2.date).getTime() - new Date(p1.date).getTime())
    .filter(
      (post) =>
        !post.draft && post.lang === lang && post.categories.includes(category),
    );
}

export default async function CategoryPostsPage({
  params,
}: {
  params: {
    lang: Language;
    categorySlug: string;
  };
}) {
  const category = categories.find(
    (category) => category.slug === params.categorySlug,
  );

  if (!category) {
    notFound();
  }

  const posts = getPublishedPosts(params.lang, category.slug);

  return (
    <main className="mx-auto flex flex-col sm:flex-row w-full max-w-screen-lg gap-4 px-4 py-8">
      <ul className="basis-3/4 flex flex-col gap-4">
        {posts.map((post) => (
          <li
            key={post.slug}
            className="rounded-3xl p-4 sm:px-8 border bg-white/50 dark:bg-indigo-100/5 flex flex-col gap-2"
          >
            <Link className="underline" href={post.permalink}>
              <h2 className="text-xl font-serif">{post.title}</h2>
            </Link>
            <p className="opacity-70">{post.description}</p>
            <div className="opacity-50 flex items-center gap-4">
              <div className="flex items-center gap-1">
                <CalendarDaysIcon className="w-4 h-4" />
                {displayDate(post.date, params.lang)}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <section className="basis-1/4 sticky top-28 border rounded-3xl p-4 flex-col">
        <div className="opacity-50 mb-2">{category.name[params.lang]}</div>
        <div>{category.description?.[params.lang]}</div>
      </section>
    </main>
  );
}
