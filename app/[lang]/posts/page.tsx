import { posts, categories } from "@/lib/velite";
import Link from "next/link";
import Image from "next/image";
import { displayDate } from "../../../lib/date";
import { Language, getDictionary } from "@/dictionaries";
import { Metadata } from "next";
import { getAlternateLanguages } from "@/lib/metadata";
import {
  RiWindowLine as CpuChipIcon,
  RiPriceTag3Line as TagIcon,
  RiToolsLine as WrenchScrewdriverIcon,
} from "@remixicon/react";
import {
  PrintedSection,
  PrintedLabel,
  PrintedDivider,
  PrintedPageTitle,
} from "@/components/printed-elements";

export async function generateMetadata(
  props: {
    params: Promise<{ lang: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const dictionary = await getDictionary(params.lang);

  return {
    metadataBase: new URL(dictionary.meta.baseUrl),
    title: `${dictionary.labels.posts} - ${dictionary.meta.websiteName}`,
    description: dictionary.labels.posts,
    keywords: dictionary.meta.fillKeywords([]),
    openGraph: {
      type: "website",
      url: new URL(dictionary.urls.posts, dictionary.meta.baseUrl).href,
      siteName: dictionary.meta.websiteName,
      title: dictionary.labels.posts,
      description: dictionary.labels.posts,
    },
    twitter: {
      title: dictionary.labels.posts,
      description: dictionary.labels.posts,
      site: "@noobnooc",
      card: "summary_large_image",
    },
    alternates: {
      canonical: new URL(dictionary.urls.posts, dictionary.meta.baseUrl).href,
      languages: await getAlternateLanguages(
        (dictionary) => dictionary.urls.posts,
      ),
    },
  };
}

function getPublishedPosts(lang: string) {
  return posts
    .sort(
      (p1, p2) => new Date(p2.date).getTime() - new Date(p1.date).getTime(),
    )
    .filter((post) => !post.draft && post.lang === lang);
}

function RatingDots({ rating }: { rating: number }) {
  const fullDots = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const totalDots = 5;

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullDots)].map((_, i) => (
        <div
          key={`full-${i}`}
          className="w-1.5 h-1.5 rounded-full bg-printer-accent dark:bg-printer-accent-dark"
        />
      ))}
      {hasHalf && (
        <div className="w-1.5 h-1.5 rounded-full bg-printer-accent/40 dark:bg-printer-accent-dark/40" />
      )}
      {[...Array(totalDots - fullDots - (hasHalf ? 1 : 0))].map((_, i) => (
        <div
          key={`empty-${i}`}
          className="w-1.5 h-1.5 rounded-full bg-printer-ink/10 dark:bg-printer-ink-dark/10"
        />
      ))}
      <span className="font-mono text-[9px] text-printer-ink-light dark:text-printer-ink-dark/40 ml-1 tabular-nums">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

export default async function PostsPage(
  props: {
    params: Promise<{
      lang: Language;
    }>;
  }
) {
  const params = await props.params;
  const dictionary = await getDictionary(params.lang);
  const allPosts = getPublishedPosts(params.lang);

  return (
    <div>
      {/* Header */}
      <PrintedSection>
        <PrintedPageTitle icon={CpuChipIcon}>
          {dictionary.labels.posts}
        </PrintedPageTitle>
        <p className="font-serif text-xs text-printer-ink-light dark:text-printer-ink-dark/50">
          {dictionary.labels.entries(allPosts.length)}
        </p>
      </PrintedSection>

      {/* Categories sidebar as label strips */}
      <PrintedSection
        label={
          <span className="inline-flex items-center gap-1.5">
            <TagIcon className="w-2.5 h-2.5" />
            <span className="label-text">{dictionary.labels.categories}</span>
          </span>
        }
      >
        <div className="flex flex-wrap gap-1.5 mb-2">
          {categories.map((category) => (
            <Link key={category.slug} href={category.permalink[params.lang]}>
              <PrintedLabel variant="default">
                {category.name[params.lang]}{" "}
                <span className="opacity-50">
                  ({category.count[params.lang]})
                </span>
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

      {/* Recommended Tools */}
      <PrintedSection
        label={
          <span className="inline-flex items-center gap-1.5">
            <WrenchScrewdriverIcon className="w-2.5 h-2.5" />
            <span className="label-text">{dictionary.labels.recommended}</span>
          </span>
        }
      >
        <div className="flex flex-col gap-1">
          {dictionary.tools.map((tool, index) => (
            <div key={tool.name}>
              <a
                href={tool.link}
                target="_blank"
                rel="noopener"
                className="group flex items-center gap-3 py-3 -mx-2 px-2 rounded-md hover:bg-printer-ink/3 dark:hover:bg-printer-ink-dark/3 transition-colors"
              >
                <Image
                  src={tool.icon}
                  alt={`${tool.name} icon`}
                  className="h-10 w-10 rounded-lg border border-printer-ink/10 dark:border-printer-ink-dark/10 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-medium text-printer-ink dark:text-printer-ink-dark group-hover:text-printer-accent dark:group-hover:text-printer-accent-dark transition-colors">
                      {tool.name}
                    </span>
                    <RatingDots rating={tool.rating} />
                  </div>
                  <p className="font-mono text-[10px] text-printer-ink-light dark:text-printer-ink-dark/40 mt-0.5 line-clamp-1">
                    {tool.summary}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {tool.platform && (
                      <PrintedLabel variant="muted">{tool.platform}</PrintedLabel>
                    )}
                    {tool.pricing && (
                      <PrintedLabel variant="default">{tool.pricing}</PrintedLabel>
                    )}
                  </div>
                </div>
                <span className="font-mono text-[10px] text-printer-ink-light dark:text-printer-ink-dark/30 group-hover:text-printer-accent dark:group-hover:text-printer-accent-dark transition-colors shrink-0">
                  →
                </span>
              </a>
              {index < dictionary.tools.length - 1 && (
                <div className="border-b border-dotted border-printer-ink/5 dark:border-printer-ink-dark/5" />
              )}
            </div>
          ))}
        </div>
      </PrintedSection>
    </div>
  );
}
