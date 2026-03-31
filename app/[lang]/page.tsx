import { getDictionary } from "@/dictionaries";
import { posts, lifePosts } from "@/lib/velite";
import Link from "next/link";
import Image from "next/image";
import { displayDate } from "@/lib/date";
import {
  RiDraftLine as LifeIcon,
  RiApps2Line as BriefcaseIcon,
  RiWindowLine as CpuChipIcon,
} from "@remixicon/react";
import {
  PrintedSection,
  PrintedLabel,
  PrintedDivider,
} from "@/components/printed-elements";

function getLatestPosts(lang: string, count = 3) {
  return posts
    .sort(
      (p1, p2) => new Date(p2.date).getTime() - new Date(p1.date).getTime(),
    )
    .filter((post) => !post.draft && post.lang === lang)
    .slice(0, count);
}

function getLatestLifePosts(lang: string, count = 3) {
  return lifePosts
    .filter((post) => post.lang === lang)
    .sort(
      (p1, p2) => new Date(p2.date).getTime() - new Date(p1.date).getTime(),
    )
    .slice(0, count);
}

function getRandomMotto(dictionary: Awaited<ReturnType<typeof getDictionary>>) {
  const mottos = dictionary.meta.mottos?.length
    ? dictionary.meta.mottos
    : [dictionary.meta.motto];
  return mottos[Math.floor(Math.random() * mottos.length)] ?? "";
}

export default async function Home(
  props: {
    params: Promise<{
      lang: string;
    }>;
  }
) {
  const params = await props.params;
  const dictionary = await getDictionary(params.lang);
  const latestPosts = getLatestPosts(params.lang);
  const latestLife = getLatestLifePosts(params.lang);
  const motto = getRandomMotto(dictionary);

  return (
    <div>
      {/* Profile header - printed label style */}
      <PrintedSection>
        <div className="flex items-start gap-4 mb-2">
          <div className="flex-1">
            <h1 className="font-serif text-2xl font-bold tracking-tight text-printer-ink dark:text-printer-ink-dark">
              Nooc
            </h1>
            <p className="font-serif text-xs sm:text-[13px] text-printer-ink-light dark:text-printer-ink-dark/60 mt-1 leading-relaxed">
              {motto}
            </p>
          </div>
        </div>

        {/* Contact strip */}
        <div className="flex flex-wrap gap-2 mt-4">
          {dictionary.contacts.map((contact) => (
            <a
              key={`${contact.label}-${contact.name}`}
              href={contact.link}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-sm border border-printer-ink/8 dark:border-printer-ink-dark/8 text-printer-ink-light dark:text-printer-ink-dark/50 hover:text-printer-accent dark:hover:text-printer-accent-dark hover:border-printer-accent/20 dark:hover:border-printer-accent-dark/20 transition-colors"
            >
              <contact.icon className="w-3 h-3" />
              {contact.label}
            </a>
          ))}
        </div>
      </PrintedSection>

      <PrintedDivider style="dotted" />

      {/* Works section */}
      <PrintedSection
        label={
          <span className="inline-flex items-center gap-1.5">
            <BriefcaseIcon className="w-2.5 h-2.5" />
            <span className="label-text">{dictionary.labels.works}</span>
          </span>
        }
      >
        <div className="grid grid-cols-2 gap-2">
          {dictionary.works
            .filter((work) => work.primary)
            .slice(0, 4)
            .map((work) => (
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
        <Link
          href={dictionary.urls.works}
          className="inline-flex items-center gap-1 font-mono text-[11px] tracking-wider text-printer-accent dark:text-printer-accent-dark mt-3 hover:underline"
        >
          ◦ VIEW ALL →
        </Link>
      </PrintedSection>

      <PrintedDivider style="dashed" />

      {/* Latest Life Posts */}
      <PrintedSection
        label={
          <span className="inline-flex items-center gap-1.5">
            <LifeIcon className="w-2.5 h-2.5" />
            <span className="label-text">{dictionary.labels.latestLife}</span>
          </span>
        }
      >
        <div className="flex flex-col gap-3">
          {latestLife.map((post) => (
            <Link
              key={post.slug}
              href={post.permalink}
              className="group block"
            >
              <div className="py-2 -mx-2 px-2 rounded-md hover:bg-printer-ink/3 dark:hover:bg-printer-ink-dark/3 transition-colors">
                <div className="font-mono text-[10px] text-printer-ink-light dark:text-printer-ink-dark/40 tabular-nums mb-1">
                  {displayDate(post.date, params.lang)}
                </div>
                <h3 className="font-serif text-base text-printer-ink dark:text-printer-ink-dark group-hover:text-printer-accent dark:group-hover:text-printer-accent-dark transition-colors leading-snug">
                  {post.title}
                </h3>
                {post.description && (
                  <p className="font-serif text-xs text-printer-ink-light dark:text-printer-ink-dark/40 mt-0.5 line-clamp-1">
                    {post.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
        <Link
          href={dictionary.urls.life}
          className="inline-flex items-center gap-1 font-mono text-[11px] tracking-wider text-printer-accent dark:text-printer-accent-dark mt-3 hover:underline"
        >
          ✦ VIEW ALL →
        </Link>
      </PrintedSection>

      <PrintedDivider style="dashed" />

      {/* Latest Tech Posts */}
      <PrintedSection
        label={
          <span className="inline-flex items-center gap-1.5">
            <CpuChipIcon className="w-2.5 h-2.5" />
            <span className="label-text">{dictionary.labels.latestTech}</span>
          </span>
        }
      >
        <div className="flex flex-col gap-3">
          {latestPosts.map((post) => (
            <Link
              key={post.slug}
              href={post.permalink}
              className="group block"
            >
              <div className="py-2 -mx-2 px-2 rounded-md hover:bg-printer-ink/3 dark:hover:bg-printer-ink-dark/3 transition-colors">
                <div className="font-mono text-[10px] text-printer-ink-light dark:text-printer-ink-dark/40 tabular-nums mb-1">
                  {displayDate(post.date, params.lang)}
                </div>
                <h3 className="font-serif text-base text-printer-ink dark:text-printer-ink-dark group-hover:text-printer-accent dark:group-hover:text-printer-accent-dark transition-colors leading-snug">
                  {post.title}
                </h3>
                {post.description && (
                  <p className="font-serif text-xs text-printer-ink-light dark:text-printer-ink-dark/40 mt-0.5 line-clamp-1">
                    {post.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
        <Link
          href={dictionary.urls.posts}
          className="inline-flex items-center gap-1 font-mono text-[11px] tracking-wider text-printer-accent dark:text-printer-accent-dark mt-3 hover:underline"
        >
          ▸ VIEW ALL →
        </Link>
      </PrintedSection>

      {/* Footer stamp */}
      <div className="mt-8 pt-4 border-t border-dotted border-printer-ink/10 dark:border-printer-ink-dark/10">
        <div className="flex items-center justify-between">
          <div className="font-mono text-[9px] text-printer-ink-light dark:text-printer-ink-dark/30 tracking-wider uppercase">
            {dictionary.labels.printedOn}{" "}
            {new Date().toISOString().split("T")[0]}
          </div>
          <PrintedLabel variant="muted">nooc.me</PrintedLabel>
        </div>
      </div>
    </div>
  );
}
