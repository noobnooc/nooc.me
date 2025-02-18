import { posts } from "@/.velite";
import { CalendarDaysIcon, LanguageIcon } from "@heroicons/react/24/solid";
import { displayDate } from "@/lib/date";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary, Language, languageLabels } from "@/dictionaries";
import { SiX } from "@icons-pack/react-simple-icons";
import { Metadata } from "next";
import classNames from "classnames";
import { PostAdvertising } from "./Advertising";
import { getAlternateLanguages } from "@/lib/metadata";

export const runtime = "edge";

export async function generateMetadata({
  params,
}: {
  params: { lang: Language; postSlug: string };
}): Promise<Metadata> {
  const { lang, postSlug } = params;
  const dictionary = await getDictionary(lang);

  const post = posts.find(
    (post) => post.lang === lang && post.slug === postSlug,
  );

  if (!post) {
    notFound();
  }

  const allLanguages = posts.filter((post) => post.slug === postSlug);

  return {
    metadataBase: new URL(dictionary.meta.baseUrl),
    title: post.title,
    description: post.description,
    keywords: dictionary.meta.fillKeywords(post.keywords),
    openGraph: {
      type: "article",
      url: new URL(post.permalink, dictionary.meta.baseUrl).href,
      siteName: dictionary.meta.websiteName,
      title: post.title,
      description: post.description,
      images: post.cover?.src ?? "/static/banner.png",
    },
    twitter: {
      title: post.title,
      description: post.description,
      site: "@noobnooc",
      card: "summary_large_image",
      images: post.cover?.src ?? "/static/banner.png",
    },
    alternates: {
      languages: Object.fromEntries(
        allLanguages.map((post) => [post.lang, post.permalink]),
      ),
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: {
    lang: Language;
    postSlug: string;
  };
}) {
  const { lang, postSlug } = params;

  const dictionary = await getDictionary(lang);

  const post = posts.find(
    (post) => post.lang === lang && post.slug === postSlug,
  );

  const otherLanguages = posts.filter(
    (post) => post.slug === postSlug && post.lang !== params.lang,
  );

  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto flex items-start w-full max-w-screen-lg gap-4 px-4 py-8 relative scroll-smooth">
      <div className="flex flex-col gap-4 w-full">
        <article className="rounded-3xl p-4 pb-8 md:p-8 border bg-white/50 dark:bg-indigo-100/5 flex flex-col md:basis-3/4 grow-0 min-w-0">
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
          {/* <div className="leading-loose flex flex-col gap-4">
          <MDXContent code={post.content} />
        </div> */}
          <div
            className={classNames(
              "prose dark:prose-invert",
              "prose-headings:font-serif prose-headings:mt-8",
              "prose-h1:text-3xl",
              "prose-h2:text-xl",
              "prose-h3:text-lg",
              "prose-blockquote:font-normal",
              "prose-pre:border prose-pre:rounded-xl",
              "before:prose-p:content-none after:prose-p:content-none",
            )}
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>
          <hr className="my-8" />
          <div className="flex items-center gap-4">
            <span className="opacity-50">{dictionary.labels.shareTo}</span>
            <a
              href={dictionary.urls.shareToX(post.title, post.permalink)}
              target="_blank"
            >
              <SiX className="w-5 h-5" />
            </a>
          </div>
        </article>

        <PostAdvertising advertisements={dictionary.postAdvertisements} />
      </div>
      <section className="hidden md:flex md:basis-1/4 sticky top-28 border rounded-3xl p-4 flex-col shrink-0">
        <label className="opacity-50 mb-4">{dictionary.labels.toc}</label>
        <ul className="flex flex-col gap-2 list-disc ml-6">
          {post.toc.map((entry) => (
            <li className="" key={entry.title}>
              <div className="opacity-80">{entry.title}</div>
              <ol className="pr-4 flex flex-col ml-4 gap-2 list-[square]">
                {entry.items.map((subEntry) => (
                  <li key={subEntry.url}>
                    <div className="opacity-60">{subEntry.title}</div>
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
