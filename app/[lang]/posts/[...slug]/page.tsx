export const runtime = "edge";

import { posts } from "@/.velite";
import { CalendarDaysIcon, LanguageIcon } from "@heroicons/react/24/solid";
import { displayDate } from "@/lib/date";
import { notFound } from "next/navigation";
import { MDXContent } from "@/components/mdx-components";
import Link from "next/link";
import { languageLabels } from "@/dictionaries";

export default async function PostPage({
  params,
}: {
  params: {
    lang: string;
    slug: string[];
  };
}) {
  const [postSlug] = params.slug;

  const post = posts.find(
    (post) => post.lang === params.lang && post.slug === postSlug,
  );

  const otherLanguages = posts.filter(
    (post) => post.slug === postSlug && post.lang !== params.lang,
  );

  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto flex items-start w-full max-w-screen-lg gap-4 px-4 py-8 relative scroll-smooth">
      <article className="rounded-3xl p-8 border bg-white/50 dark:bg-indigo-100/5 flex flex-col md:basis-3/4">
        <h1 className="text-3xl font-serif">{post.title}</h1>
        <div className="opacity-50 flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1">
            <CalendarDaysIcon className="w-4 h-4" />
            {displayDate(post.date, params.lang)}
          </div>

          {otherLanguages.length ? (
            <div className="flex items-center gap-1">
              <LanguageIcon className="w-4 h-4" />
              {otherLanguages.map((post) => (
                <Link
                  key={post.lang}
                  className="underline"
                  href={post.permalink}
                >
                  {languageLabels[post.lang]}
                </Link>
              ))}
            </div>
          ) : undefined}
        </div>
        <p className="opacity-70 mt-2">{post.description}</p>
        <hr className="my-4" />
        <div className="flex flex-col gap-4">
          <MDXContent code={post.content} />
        </div>
      </article>
      <ol className="hidden md:block md:basis-1/4 sticky top-28 flex-col items-end">
        {post.toc.map((entry) => (
          <li className="text-right" key={entry.title}>
            <Link className="opacity-80" href={`#${entry.title}`}>
              {entry.title}
            </Link>
            <ol className="pr-4 flex flex-col items-end">
              {entry.items.map((subEntry) => (
                <li key={subEntry.url}>
                  <Link className="opacity-60" href={`#${subEntry.title}`}>
                    {subEntry.title}
                  </Link>
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ol>
    </main>
  );
}
