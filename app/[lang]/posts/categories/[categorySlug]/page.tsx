import { posts, categories } from "@/lib/velite";
import Link from "next/link";
import { Language, dictionaryKeys, getDictionary } from "@/dictionaries";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { displayDate } from "@/lib/date";
import { getAlternateLanguages } from "@/lib/metadata";
import { RiPriceTag3Line as TagIcon } from "@remixicon/react";
import {
  PrintedSection,
  PrintedLabel,
  PrintedDivider,
  PrintedPageTitle,
} from "@/components/printed-elements";

export async function generateMetadata(
  props: {
    params: Promise<{ lang: Language; categorySlug: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
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
    },
    twitter: {
      title: category.name[params.lang],
      description: category.description?.[params.lang],
      site: "@noobnooc",
      card: "summary_large_image",
    },
    alternates: {
      languages: await getAlternateLanguages(
        (dictionary, lang) => category.permalink[lang],
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

export default async function CategoryPostsPage(
  props: {
    params: Promise<{
      lang: Language;
      categorySlug: string;
    }>;
  }
) {
  const params = await props.params;
  const dictionary = await getDictionary(params.lang);
  const category = categories.find(
    (category) => category.slug === params.categorySlug,
  );

  if (!category) {
    notFound();
  }

  const categoryPosts = getPublishedPosts(params.lang, category.slug);

  return (
    <div>
      {/* Header */}
      <PrintedSection>
        <PrintedPageTitle icon={TagIcon}>
          {category.name[params.lang]}
        </PrintedPageTitle>
        {category.description?.[params.lang] && (
          <p className="font-serif text-xs text-printer-ink-light dark:text-printer-ink-dark/50">
            {category.description[params.lang]}
          </p>
        )}
        <p className="font-serif text-[10px] text-printer-ink-light dark:text-printer-ink-dark/40 mt-1">
          {dictionary.labels.entries(categoryPosts.length)}
        </p>
      </PrintedSection>

      {/* Back link */}
      <div className="mb-4">
        <Link
          href={dictionary.urls.posts}
          className="inline-flex items-center gap-1 font-mono text-[11px] tracking-wider text-printer-accent dark:text-printer-accent-dark hover:underline"
        >
          ← ALL TECH POSTS
        </Link>
      </div>

      <PrintedDivider style="dashed" />

      {/* Post list */}
      <div className="flex flex-col">
        {categoryPosts.map((post, index) => (
          <div key={post.slug}>
            <Link href={post.permalink} className="group block">
              <div className="py-3 -mx-2 px-2 rounded-md hover:bg-printer-ink/3 dark:hover:bg-printer-ink-dark/3 transition-colors">
                <div className="font-mono text-[10px] text-printer-ink-light dark:text-printer-ink-dark/40 tabular-nums mb-1">
                  {displayDate(post.date, params.lang)}
                </div>
                <h2 className="font-serif text-base text-printer-ink dark:text-printer-ink-dark group-hover:text-printer-accent dark:group-hover:text-printer-accent-dark transition-colors leading-snug">
                  {post.title}
                </h2>
                {post.description && (
                  <p className="font-serif text-xs text-printer-ink-light dark:text-printer-ink-dark/40 mt-1 line-clamp-2">
                    {post.description}
                  </p>
                )}
              </div>
            </Link>
            {index < categoryPosts.length - 1 && (
              <div className="border-b border-dotted border-printer-ink/5 dark:border-printer-ink-dark/5" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
