import { lifePosts, lifeCategories } from "@/lib/velite";
import Link from "next/link";
import { displayDate } from "@/lib/date";
import { getDictionary, Language } from "@/dictionaries";
import { Metadata } from "next";
import { getAlternateLanguages } from "@/lib/metadata";
import {
  RiDraftLine as LifeIcon,
  RiBookOpenLine as BookOpenIcon,
  RiFilmLine as FilmIcon,
  RiMusic2Line as MusicalNoteIcon,
  RiPriceTag3Line as TagIcon,
  RiPulseLine as ActivityIcon,
} from "@remixicon/react";
import {
  PrintedSection,
  PrintedLabel,
  PrintedDivider,
  PrintedPageTitle,
} from "@/components/printed-elements";

export async function generateMetadata(
  props: {
    params: Promise<{ lang: Language }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const dictionary = await getDictionary(params.lang);

  return {
    metadataBase: new URL(dictionary.meta.baseUrl),
    title: `${dictionary.labels.life} - ${dictionary.meta.websiteName}`,
    description: dictionary.labels.life,
    keywords: dictionary.meta.fillKeywords([]),
    openGraph: {
      type: "website",
      url: new URL(dictionary.urls.life, dictionary.meta.baseUrl).href,
      siteName: dictionary.meta.websiteName,
      title: dictionary.labels.life,
      description: dictionary.labels.life,
    },
    twitter: {
      title: dictionary.labels.life,
      description: dictionary.labels.life,
      site: "@noobnooc",
      card: "summary_large_image",
    },
    alternates: {
      canonical: new URL(dictionary.urls.life, dictionary.meta.baseUrl).href,
      languages: await getAlternateLanguages(
        (dictionary) => dictionary.urls.life,
      ),
    },
  };
}

function getPublishedLifePosts(lang: Language) {
  return lifePosts
    .filter((post) => post.lang === lang)
    .sort(
      (p1, p2) => new Date(p2.date).getTime() - new Date(p1.date).getTime(),
    );
}

export default async function LifePage(
  props: {
    params: Promise<{
      lang: Language;
    }>;
  }
) {
  const params = await props.params;
  const dictionary = await getDictionary(params.lang);
  const allPosts = getPublishedLifePosts(params.lang);

  return (
    <div>
      {/* Header */}
      <PrintedSection>
        <PrintedPageTitle icon={LifeIcon}>{dictionary.labels.life}</PrintedPageTitle>
        <p className="font-serif text-xs text-printer-ink-light dark:text-printer-ink-dark/50">
          {dictionary.labels.entries(allPosts.length)}
        </p>
      </PrintedSection>

      {/* Archive sections - links to subpages */}
      <PrintedSection
        label={
          <span className="inline-flex items-center gap-1.5">
            <ActivityIcon className="w-2.5 h-2.5" />
            <span className="label-text">{dictionary.labels.activity}</span>
          </span>
        }
      >
        <div className="flex flex-wrap gap-2">
          <Link href={`${dictionary.urls.life}/reading`}>
            <PrintedLabel variant="default">
              <BookOpenIcon className="w-2.5 h-2.5 mr-1" />
              <span className="label-text">{dictionary.labels.reading}</span>
            </PrintedLabel>
          </Link>
          <Link href={`${dictionary.urls.life}/films`}>
            <PrintedLabel variant="default">
              <FilmIcon className="w-2.5 h-2.5 mr-1" />
              <span className="label-text">{dictionary.labels.films}</span>
            </PrintedLabel>
          </Link>
          <Link href={`${dictionary.urls.life}/music`}>
            <PrintedLabel variant="default">
              <MusicalNoteIcon className="w-2.5 h-2.5 mr-1" />
              <span className="label-text">{dictionary.labels.music}</span>
            </PrintedLabel>
          </Link>
        </div>
      </PrintedSection>

      <PrintedDivider style="dashed" />

      {/* Categories as label strips */}
      <PrintedSection
        label={
          <span className="inline-flex items-center gap-1.5">
            <TagIcon className="w-2.5 h-2.5" />
            <span className="label-text">{dictionary.labels.categories}</span>
          </span>
        }
      >
        <div className="flex flex-wrap gap-1.5 mb-2">
          {lifeCategories.map((category) => (
            <Link key={category.slug} href={category.permalink[params.lang]}>
              <PrintedLabel variant="default">
                {category.name[params.lang]}{" "}
                <span className="opacity-50">({category.count[params.lang]})</span>
              </PrintedLabel>
            </Link>
          ))}
        </div>
      </PrintedSection>

      <PrintedDivider style="dashed" />

      {/* Post list */}
      <div className="flex flex-col">
        {allPosts.map((post, index) => (
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
            {index < allPosts.length - 1 && (
              <div className="border-b border-dotted border-printer-ink/5 dark:border-printer-ink-dark/5" />
            )}
          </div>
        ))}
      </div>

      <PrintedDivider style="dashed" />
    </div>
  );
}
