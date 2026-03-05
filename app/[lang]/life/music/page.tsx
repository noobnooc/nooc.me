import { getDictionary } from "@/dictionaries";
import { Metadata } from "next";
import Link from "next/link";
import { getAlternateLanguages } from "@/lib/metadata";
import { RiMusic2Line as MusicalNoteIcon } from "@remixicon/react";
import {
  PrintedSection,
  PrintedDivider,
  PrintedPageTitle,
} from "@/components/printed-elements";

export const runtime = "edge";

export async function generateMetadata(
  props: {
    params: Promise<{ lang: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const dictionary = await getDictionary(params.lang);

  return {
    metadataBase: new URL(dictionary.meta.baseUrl),
    title: `${dictionary.labels.music} - ${dictionary.labels.life} - ${dictionary.meta.websiteName}`,
    description: dictionary.labels.music,
    keywords: dictionary.meta.fillKeywords([]),
    openGraph: {
      type: "website",
      url: new URL(
        `${dictionary.urls.life}/music`,
        dictionary.meta.baseUrl,
      ).href,
      siteName: dictionary.meta.websiteName,
      title: dictionary.labels.music,
      description: dictionary.labels.music,
    },
    twitter: {
      title: dictionary.labels.music,
      description: dictionary.labels.music,
      site: "@noobnooc",
      card: "summary_large_image",
    },
    alternates: {
      canonical: new URL(
        `${dictionary.urls.life}/music`,
        dictionary.meta.baseUrl,
      ).href,
      languages: await getAlternateLanguages(
        (dictionary) => `${dictionary.urls.life}/music`,
      ),
    },
  };
}

export default async function MusicPage(
  props: {
    params: Promise<{
      lang: string;
    }>;
  }
) {
  const params = await props.params;
  const dictionary = await getDictionary(params.lang);

  return (
    <div>
      {/* Header */}
      <PrintedSection>
        <PrintedPageTitle icon={MusicalNoteIcon}>
          {dictionary.labels.music}
        </PrintedPageTitle>
        <p className="font-serif text-xs text-printer-ink-light dark:text-printer-ink-dark/50">
          {dictionary.labels.entries(dictionary.archive.music.length)}
        </p>
      </PrintedSection>

      <PrintedDivider style="dashed" />

      {/* Music list */}
      <PrintedSection>
        <div className="flex flex-col">
          {dictionary.archive.music.map(
            (item: { title: string; summary: string }, index: number) => (
              <div key={item.title}>
                <div className="py-2.5 -mx-2 px-2">
                  <div className="font-mono text-sm text-printer-ink dark:text-printer-ink-dark">
                    {item.title}
                  </div>
                  <p className="font-mono text-[10px] text-printer-ink-light dark:text-printer-ink-dark/40 mt-0.5">
                    {item.summary}
                  </p>
                </div>
                {index < dictionary.archive.music.length - 1 && (
                  <div className="border-b border-dotted border-printer-ink/5 dark:border-printer-ink-dark/5" />
                )}
              </div>
            ),
          )}
        </div>
      </PrintedSection>

      <PrintedDivider style="dashed" />

      {/* Back link */}
      <PrintedSection>
        <Link
          href={dictionary.urls.life}
          className="inline-flex items-center gap-1.5 font-mono text-xs text-printer-ink-light dark:text-printer-ink-dark/50 hover:text-printer-accent dark:hover:text-printer-accent-dark transition-colors"
        >
          <span>←</span>
          <span className="uppercase tracking-wider">
            {dictionary.labels.life}
          </span>
        </Link>
      </PrintedSection>
    </div>
  );
}
