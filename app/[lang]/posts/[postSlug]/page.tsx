import { posts } from "@/lib/velite";
import { displayDate } from "@/lib/date";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary, Language, languageLabels } from "@/dictionaries";
import { SiX } from "@icons-pack/react-simple-icons";
import { Metadata } from "next";
import { PostAdvertising } from "./Advertising";
import { getAlternateLanguages } from "@/lib/metadata";
import { generateBlogPostingJsonLd, generateBreadcrumbJsonLd } from "@/lib/json-ld";
import { PostContent } from "@/components/post-content";
import {
  PrintedSection,
  PrintedLabel,
  PrintedDivider,
} from "@/components/printed-elements";

export async function generateMetadata(
  props: {
    params: Promise<{ lang: Language; postSlug: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
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
    authors: [{ name: "Nooc", url: dictionary.meta.baseUrl }],
    openGraph: {
      type: "article",
      url: new URL(post.permalink, dictionary.meta.baseUrl).href,
      siteName: dictionary.meta.websiteName,
      title: post.title,
      description: post.description,
      locale: lang === "zh" ? "zh_CN" : "en_US",
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: ["Nooc"],
      tags: post.categories,
    },
    twitter: {
      title: post.title,
      description: post.description,
      site: "@noobnooc",
      creator: "@noobnooc",
      card: "summary_large_image",
    },
    alternates: {
      canonical: new URL(post.permalink, dictionary.meta.baseUrl).href,
      languages: Object.fromEntries(
        allLanguages.map((post) => [post.lang, post.permalink]),
      ),
    },
  };
}

export default async function PostPage(
  props: {
    params: Promise<{
      lang: Language;
      postSlug: string;
    }>;
  }
) {
  const params = await props.params;
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

  const baseUrl = dictionary.meta.baseUrl;
  const postUrl = new URL(post.permalink, baseUrl).href;

  const jsonLd = [
    generateBlogPostingJsonLd({
      title: post.title,
      description: post.description,
      url: postUrl,
      datePublished: post.date,
      dateModified: post.updated,
      image: post.cover?.src ? new URL(post.cover.src, baseUrl).href : undefined,
      categories: post.categories,
      lang: params.lang,
    }),
    generateBreadcrumbJsonLd({
      items: [
        { name: dictionary.labels.home, url: new URL(dictionary.urls.home, baseUrl).href },
        { name: dictionary.labels.posts, url: new URL(dictionary.urls.posts, baseUrl).href },
        { name: post.title, url: postUrl },
      ],
    }),
  ];

  return (
    <>
      {jsonLd.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
      <div>
      {/* Post header */}
      <PrintedSection>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.categories.map((cat) => (
            <Link
              key={cat}
              href={`/${lang}/posts/categories/${cat}`}
            >
              <PrintedLabel variant="accent">{cat}</PrintedLabel>
            </Link>
          ))}
        </div>
        <h1 className="font-serif text-2xl font-bold text-printer-ink dark:text-printer-ink-dark leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          <span className="font-mono text-[10px] text-printer-ink-light dark:text-printer-ink-dark/40 tabular-nums">
            {displayDate(post.date, params.lang)}
          </span>
          {otherLanguages.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-printer-ink-light dark:text-printer-ink-dark/40">
                |
              </span>
              {otherLanguages.map((p) => (
                <Link
                  key={p.lang}
                  className="font-mono text-[10px] text-printer-accent dark:text-printer-accent-dark hover:underline"
                  href={p.permalink}
                >
                  {languageLabels[p.lang]}
                </Link>
              ))}
            </div>
          )}
        </div>
        {post.description && (
          <p className="font-serif text-xs text-printer-ink-light dark:text-printer-ink-dark/50 mt-2 leading-relaxed">
            {post.description}
          </p>
        )}
      </PrintedSection>

      <PrintedDivider style="solid" />

      {/* Post content */}
      <PostContent html={post.content} />

      <PrintedDivider style="dashed" />

      {/* Footer actions */}
      <div className="flex items-center gap-4">
        <span className="font-mono text-[10px] text-printer-ink-light dark:text-printer-ink-dark/40 uppercase tracking-wider">
          {dictionary.labels.shareTo}
        </span>
        <a
          href={dictionary.urls.shareToX(post.title, post.permalink)}
          target="_blank"
          className="text-printer-ink-light dark:text-printer-ink-dark/40 hover:text-printer-ink dark:hover:text-printer-ink-dark transition-colors"
        >
          <SiX className="w-4 h-4" />
        </a>
      </div>

      <div className="mt-6">
        <Link
          href={dictionary.urls.posts}
          className="inline-flex items-center gap-1 font-mono text-[11px] tracking-wider text-printer-accent dark:text-printer-accent-dark hover:underline"
        >
          ← BACK TO TECH
        </Link>
      </div>

      <PrintedDivider style="dotted" />

      {/* Advertising */}
      <PrintedSection>
        <PostAdvertising advertisements={dictionary.postAdvertisements} />
      </PrintedSection>
    </div>
    </>
  );
}
