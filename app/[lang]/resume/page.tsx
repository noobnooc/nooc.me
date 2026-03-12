import { Metadata } from "next";
import { getDictionary, Language } from "@/dictionaries";
import { getAlternateLanguages } from "@/lib/metadata";
import { resumeContent } from "@/lib/resume";
import { SiGithub } from "@icons-pack/react-simple-icons";
import {
  RiApps2Line as BriefcaseIcon,
  RiBookOpenLine as BookOpenIcon,
  RiMailLine as MailIcon,
  RiPriceTag3Line as TagIcon,
  RiSendPlaneLine as SendPlaneIcon,
  RiUser4Line as IdentificationIcon,
  RiWindowLine as WindowIcon,
} from "@remixicon/react";
import {
  PrintedDivider,
  PrintedLabel,
  PrintedPageTitle,
  PrintedSection,
} from "@/components/printed-elements";

export const runtime = "edge";

const routePath = (lang: Language) => `/${lang}/resume`;

const contactIcons = {
  website: WindowIcon,
  email: MailIcon,
  github: SiGithub,
} as const;

export async function generateMetadata(
  props: {
    params: Promise<{ lang: Language }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const dictionary = await getDictionary(params.lang);
  const content = resumeContent[params.lang];
  const canonical = new URL(routePath(params.lang), dictionary.meta.baseUrl).href;

  return {
    metadataBase: new URL(dictionary.meta.baseUrl),
    title: `${content.pageTitle} - ${dictionary.meta.websiteName}`,
    description: content.summary,
    keywords: dictionary.meta.fillKeywords(["resume", "cv"]),
    openGraph: {
      type: "website",
      url: canonical,
      siteName: dictionary.meta.websiteName,
      title: content.pageTitle,
      description: content.summary,
    },
    twitter: {
      title: content.pageTitle,
      description: content.summary,
      site: "@noobnooc",
      card: "summary_large_image",
    },
    alternates: {
      canonical,
      languages: await getAlternateLanguages((_, lang) => routePath(lang)),
    },
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    },
  };
}

export default async function ResumePage(
  props: {
    params: Promise<{
      lang: Language;
    }>;
  }
) {
  const params = await props.params;
  const dictionary = await getDictionary(params.lang);
  const content = resumeContent[params.lang];

  return (
    <div>
      <PrintedSection>
        <PrintedPageTitle icon={IdentificationIcon}>
          {content.pageTitle}
        </PrintedPageTitle>
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold tracking-tight text-printer-ink dark:text-printer-ink-dark">
              {content.name}
            </h2>
            <p className="mt-2 max-w-2xl font-serif text-xs leading-relaxed text-printer-ink-light dark:text-printer-ink-dark/55">
              {content.summary}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {content.contacts.map((contact) => {
              const Icon = contactIcons[contact.kind];
              const external = contact.href.startsWith("https://");

              return (
                <a
                  key={contact.label}
                  href={contact.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener" : undefined}
                  className="inline-flex items-center gap-1.5 rounded-sm border border-printer-ink/8 px-2.5 py-1 font-mono text-[10px] tracking-wider text-printer-ink-light transition-colors hover:border-printer-accent/20 hover:text-printer-accent dark:border-printer-ink-dark/8 dark:text-printer-ink-dark/50 dark:hover:border-printer-accent-dark/20 dark:hover:text-printer-accent-dark"
                >
                  <Icon className="h-3 w-3 shrink-0" />
                  <span className="uppercase">{contact.label}</span>
                  <span className="normal-case tracking-normal text-printer-ink/70 dark:text-printer-ink-dark/70">
                    {contact.value}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </PrintedSection>

      <PrintedDivider style="solid" />

      <PrintedSection
        label={
          <span className="inline-flex items-center gap-1.5">
            <TagIcon className="h-2.5 w-2.5" />
            <span className="label-text">{content.sectionLabels.preferences}</span>
          </span>
        }
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {content.preferenceGroups.map((group) => (
            <div
              key={group.label}
              className="rounded-md border border-printer-ink/8 bg-printer-ink/3 p-3 dark:border-printer-ink-dark/8 dark:bg-printer-ink-dark/3"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-printer-ink-light dark:text-printer-ink-dark/45">
                {group.label}
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <PrintedLabel key={item} variant="default">
                    {item}
                  </PrintedLabel>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PrintedSection>

      <PrintedDivider style="dashed" />

      <PrintedSection
        label={
          <span className="inline-flex items-center gap-1.5">
            <BriefcaseIcon className="h-2.5 w-2.5" />
            <span className="label-text">{content.sectionLabels.experience}</span>
          </span>
        }
      >
        <div className="flex flex-col gap-8">
          {content.experiences.map((experience) => (
            <div key={`${experience.role}-${experience.period}`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-serif text-lg text-printer-ink dark:text-printer-ink-dark">
                    {experience.role}
                  </h3>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-printer-ink-light dark:text-printer-ink-dark/45">
                    {experience.organization}
                    {experience.location ? ` · ${experience.location}` : ""}
                  </p>
                </div>
                <PrintedLabel variant="muted">{experience.period}</PrintedLabel>
              </div>

              <p className="mt-3 max-w-2xl font-serif text-xs leading-relaxed text-printer-ink-light dark:text-printer-ink-dark/55">
                {experience.summary}
              </p>

              <div className="mt-5 flex flex-col">
                {experience.projects.map((project, index) => (
                  <div key={project.name}>
                    <div className="rounded-md px-0 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {project.href ? (
                          <a
                            href={project.href}
                            target="_blank"
                            rel="noopener"
                            className="font-mono text-sm font-medium text-printer-ink transition-colors hover:text-printer-accent dark:text-printer-ink-dark dark:hover:text-printer-accent-dark"
                          >
                            {project.name}
                          </a>
                        ) : (
                          <span className="font-mono text-sm font-medium text-printer-ink dark:text-printer-ink-dark">
                            {project.name}
                          </span>
                        )}
                        {project.note && (
                          <span className="font-mono text-[10px] text-printer-ink-light dark:text-printer-ink-dark/40">
                            {project.note}
                          </span>
                        )}
                      </div>

                      <p className="mt-2 font-serif text-xs leading-relaxed text-printer-ink-light dark:text-printer-ink-dark/55">
                        {project.description}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {project.stack.map((item) => (
                          <PrintedLabel key={item} variant="default">
                            {item}
                          </PrintedLabel>
                        ))}
                      </div>
                    </div>

                    {index < experience.projects.length - 1 && (
                      <div className="border-b border-dotted border-printer-ink/5 dark:border-printer-ink-dark/5" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PrintedSection>

      <PrintedDivider style="dashed" />

      <PrintedSection
        label={
          <span className="inline-flex items-center gap-1.5">
            <SendPlaneIcon className="h-2.5 w-2.5" />
            <span className="label-text">{content.sectionLabels.skills}</span>
          </span>
        }
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {content.skillGroups.map((group) => (
            <div
              key={group.label}
              className="rounded-md border border-printer-ink/8 bg-printer-ink/3 p-3 dark:border-printer-ink-dark/8 dark:bg-printer-ink-dark/3"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-printer-ink-light dark:text-printer-ink-dark/45">
                {group.label}
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <PrintedLabel key={item} variant="default">
                    {item}
                  </PrintedLabel>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PrintedSection>

      <PrintedDivider style="dashed" />

      <PrintedSection
        label={
          <span className="inline-flex items-center gap-1.5">
            <BookOpenIcon className="h-2.5 w-2.5" />
            <span className="label-text">{content.sectionLabels.education}</span>
          </span>
        }
      >
        <div className="flex flex-col gap-3 rounded-md border border-printer-ink/8 bg-printer-ink/3 p-4 dark:border-printer-ink-dark/8 dark:bg-printer-ink-dark/3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="font-serif text-lg text-printer-ink dark:text-printer-ink-dark">
              {content.education.school}
            </h3>
            <p className="mt-1 font-serif text-xs text-printer-ink-light dark:text-printer-ink-dark/55">
              {content.education.degree}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <PrintedLabel variant="muted">{content.education.period}</PrintedLabel>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-printer-ink-light dark:text-printer-ink-dark/45">
              {content.education.location}
            </div>
          </div>
        </div>
      </PrintedSection>

      <div className="mt-8 border-t border-dotted border-printer-ink/10 pt-4 dark:border-printer-ink-dark/10">
        <div className="flex items-center justify-between gap-3">
          <div className="font-mono text-[9px] uppercase tracking-wider text-printer-ink-light dark:text-printer-ink-dark/30">
            {dictionary.labels.printedOn} {new Date().toISOString().split("T")[0]}
          </div>
          <PrintedLabel variant="muted">resume</PrintedLabel>
        </div>
      </div>
    </div>
  );
}
