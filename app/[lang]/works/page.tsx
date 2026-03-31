import Image from "next/image";
import { getDictionary } from "@/dictionaries";
import { Metadata } from "next";
import { getAlternateLanguages } from "@/lib/metadata";
import {
  RiArchiveLine as ArchiveBoxIcon,
  RiApps2Line as BriefcaseIcon,
  RiStarLine as StarIcon,
} from "@remixicon/react";
import {
  PrintedSection,
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
    title: `${dictionary.labels.works} - ${dictionary.meta.websiteName}`,
    description: dictionary.labels.noocWorks,
    keywords: dictionary.meta.fillKeywords([]),
    openGraph: {
      type: "website",
      url: new URL(dictionary.urls.works, dictionary.meta.baseUrl).href,
      siteName: dictionary.meta.websiteName,
      title: dictionary.labels.works,
      description: dictionary.labels.noocWorks,
    },
    twitter: {
      title: dictionary.labels.works,
      description: dictionary.labels.noocWorks,
      site: "@noobnooc",
      card: "summary_large_image",
    },
    alternates: {
      canonical: new URL(dictionary.urls.works, dictionary.meta.baseUrl).href,
      languages: await getAlternateLanguages(
        (dictionary) => dictionary.urls.works,
      ),
    },
  };
}

export default async function WorksPage(
  props: {
    params: Promise<{ lang: string }>;
  }
) {
  const params = await props.params;
  const dictionary = await getDictionary(params.lang);

  const primaryWorks = dictionary.works.filter((w) => w.primary);
  const otherWorks = dictionary.works.filter((w) => !w.primary);

  return (
    <div>
      {/* Header */}
      <PrintedSection>
        <PrintedPageTitle icon={BriefcaseIcon}>
          {dictionary.labels.works}
        </PrintedPageTitle>
        <p className="font-serif text-xs text-printer-ink-light dark:text-printer-ink-dark/50">
          {dictionary.labels.noocWorks}
        </p>
      </PrintedSection>

      {/* Primary works */}
      <PrintedSection
        label={
          <span className="inline-flex items-center gap-1.5">
            <StarIcon className="w-2.5 h-2.5" />
            <span className="label-text">{dictionary.labels.featured}</span>
          </span>
        }
      >
        <div className="flex flex-col gap-1">
          {primaryWorks.map((work) => (
            <a
              key={work.name}
              href={work.link}
              target="_blank"
              rel="noopener"
              className="group flex items-center gap-3 py-3 -mx-2 px-2 rounded-md hover:bg-printer-ink/3 dark:hover:bg-printer-ink-dark/3 transition-colors"
            >
              {work.image ? (
                <Image
                  className="h-10 w-10 rounded-lg border border-printer-ink/10 dark:border-printer-ink-dark/10 shrink-0"
                  src={work.image}
                  alt={dictionary.labels.icon(work.name)}
                />
              ) : (
                <div className="h-10 w-10 rounded-lg bg-printer-accent/10 dark:bg-printer-accent-dark/10 flex items-center justify-center font-mono text-lg font-bold text-printer-accent dark:text-printer-accent-dark shrink-0">
                  {work.name[0]}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="font-mono text-sm font-medium text-printer-ink dark:text-printer-ink-dark group-hover:text-printer-accent dark:group-hover:text-printer-accent-dark transition-colors">
                  {work.name}
                </div>
                <div className="font-mono text-[10px] text-printer-ink-light dark:text-printer-ink-dark/40 mt-0.5 line-clamp-1">
                  {work.summary}
                </div>
              </div>
              <span className="font-mono text-[10px] text-printer-ink-light dark:text-printer-ink-dark/30 group-hover:text-printer-accent dark:group-hover:text-printer-accent-dark transition-colors shrink-0">
                →
              </span>
            </a>
          ))}
        </div>
      </PrintedSection>

      <PrintedDivider style="dashed" />

      {/* Other works */}
      {otherWorks.length > 0 && (
        <PrintedSection
          label={
            <span className="inline-flex items-center gap-1.5">
              <ArchiveBoxIcon className="w-2.5 h-2.5" />
              <span className="label-text">{dictionary.labels.archive}</span>
            </span>
          }
        >
          <div className="flex flex-col gap-1">
            {otherWorks.map((work) => (
              <a
                key={work.name}
                href={work.link}
                target="_blank"
                rel="noopener"
                className="group flex items-center gap-3 py-2.5 -mx-2 px-2 rounded-md hover:bg-printer-ink/3 dark:hover:bg-printer-ink-dark/3 transition-colors"
              >
                {work.image ? (
                  <Image
                    className="h-8 w-8 rounded-lg border border-printer-ink/10 dark:border-printer-ink-dark/10 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity"
                    src={work.image}
                    alt={dictionary.labels.icon(work.name)}
                  />
                ) : (
                  <div className="h-8 w-8 rounded-lg bg-printer-ink/5 dark:bg-printer-ink-dark/5 flex items-center justify-center font-mono text-sm font-bold text-printer-ink-light dark:text-printer-ink-dark/40 shrink-0">
                    {work.name[0]}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-xs text-printer-ink/70 dark:text-printer-ink-dark/70 group-hover:text-printer-accent dark:group-hover:text-printer-accent-dark transition-colors">
                    {work.name}
                  </div>
                  <div className="font-mono text-[10px] text-printer-ink-light dark:text-printer-ink-dark/30 mt-0.5 line-clamp-1">
                    {work.summary}
                  </div>
                </div>
                <span className="font-mono text-[10px] text-printer-ink-light dark:text-printer-ink-dark/30 group-hover:text-printer-accent dark:group-hover:text-printer-accent-dark transition-colors shrink-0">
                  →
                </span>
              </a>
            ))}
          </div>
        </PrintedSection>
      )}
    </div>
  );
}
