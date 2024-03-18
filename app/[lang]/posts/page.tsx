import { posts, categories } from "@/.velite";
import { CalendarDaysIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { displayDate } from "../../../lib/date";
import { Language, getDictionary } from "@/dictionaries";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang);

  return {
    metadataBase: new URL(dictionary.meta.baseUrl),
    title: dictionary.labels.posts,
    description: dictionary.labels.posts,
    keywords: dictionary.meta.fillKeywords([]),
    openGraph: {
      title: dictionary.labels.posts,
      description: dictionary.labels.posts,
    },
    twitter: {
      title: dictionary.labels.posts,
      description: dictionary.labels.posts,
      site: "@noobnooc",
      card: "summary_large_image",
    },
  };
}

function getPublishedPosts(lang: string) {
  return posts.filter((post) => !post.draft && post.lang === lang);
}

export default async function PostsPage({
  params,
}: {
  params: {
    lang: Language;
  };
}) {
  const dictionary = await getDictionary(params.lang);
  const posts = getPublishedPosts(params.lang);

  return (
    <main className="mx-auto flex flex-col sm:flex-row sm:items-start w-full max-w-screen-lg gap-4 px-4 py-8">
      <ul className="basis-3/4 flex flex-col gap-4">
        {posts.map((post) => (
          <li
            key={post.slug}
            className="rounded-3xl p-4 sm:px-8 border bg-white/50 dark:bg-indigo-100/5 flex flex-col gap-2"
          >
            <Link href={post.seoLink}>
              <h1 className="text-xl font-serif">{post.title}</h1>
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
        <div className="opacity-50 mb-4">{dictionary.labels.categories}</div>
        <ol className="underline">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link href={category.permalink[params.lang]}>
                {category.name[params.lang]}{" "}
                <span className="opacity-50">
                  ({category.count[params.lang]})
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
