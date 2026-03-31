import { getDictionary, Language } from "@/dictionaries";
import { Metadata } from "next";
import { getAlternateLanguages } from "@/lib/metadata";
import { RiUser4Line as IdentificationIcon } from "@remixicon/react";
import {
  PrintedSection,
  PrintedDivider,
  PrintedPageTitle,
} from "@/components/printed-elements";
import { PostContent } from "@/components/post-content";

export async function generateMetadata(
  props: {
    params: Promise<{ lang: Language }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const dictionary = await getDictionary(params.lang);
  const subtitle = dictionary.labels.aboutSubtitle.trim();
  const description = subtitle || dictionary.labels.aboutTitle;

  return {
    metadataBase: new URL(dictionary.meta.baseUrl),
    title: `${dictionary.labels.aboutTitle} - ${dictionary.meta.websiteName}`,
    description,
    keywords: dictionary.meta.fillKeywords([]),
    openGraph: {
      type: "website",
      url: new URL(dictionary.urls.about, dictionary.meta.baseUrl).href,
      siteName: dictionary.meta.websiteName,
      title: dictionary.labels.aboutTitle,
      description,
    },
    twitter: {
      title: dictionary.labels.aboutTitle,
      description,
      site: "@noobnooc",
      card: "summary_large_image",
    },
    alternates: {
      canonical: new URL(dictionary.urls.about, dictionary.meta.baseUrl).href,
      languages: await getAlternateLanguages(
        (dictionary) => dictionary.urls.about,
      ),
    },
  };
}

export default async function AboutPage(
  props: {
    params: Promise<{
      lang: Language;
    }>;
  }
) {
  const params = await props.params;
  const dictionary = await getDictionary(params.lang);
  const subtitle = dictionary.labels.aboutSubtitle.trim();

  // Convert markdown-like content to simple HTML
  const aboutHtml = dictionary.aboutContent
    .trim()
    .replace(/### (.+)/g, "<h3>$1</h3>")
    .replace(/## (.+)/g, "<h2>$1</h2>")
    .replace(/# (.+)/g, "<h1>$1</h1>")
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener">$1</a>',
    )
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^/, "<p>")
    .replace(/$/, "</p>")
    .replace(/<p><h([123])>/g, "<h$1>")
    .replace(/<\/h([123])><\/p>/g, "</h$1>")
    .replace(/<p><\/p>/g, "");

  return (
    <div>
      {/* Header */}
      <PrintedSection>
        <PrintedPageTitle icon={IdentificationIcon}>
          {dictionary.labels.aboutTitle}
        </PrintedPageTitle>
        {subtitle && (
          <p className="font-serif text-xs text-printer-ink-light dark:text-printer-ink-dark/50">
            {subtitle}
          </p>
        )}
      </PrintedSection>

      <PrintedDivider style="solid" />

      {/* About content */}
      <PostContent html={aboutHtml} />

      <PrintedDivider style="dashed" />

      {/* Footer */}
      <div className="font-mono text-[9px] text-printer-ink-light dark:text-printer-ink-dark/30 tracking-wider uppercase text-center py-4">
        {params.lang === "zh" ? "就酱～" : "That's about it~"}
      </div>
    </div>
  );
}
