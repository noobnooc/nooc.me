import Card from "../../../components/card";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { dictionaryKeys, getDictionary } from "../../../dictionaries";
import { Metadata } from "next";
import { getAlternateLanguages } from "@/lib/metadata";

export const runtime = "edge";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang);

  return {
    metadataBase: new URL(dictionary.meta.baseUrl),
    title: dictionary.labels.works,
    description: dictionary.labels.noocWorks,
    keywords: dictionary.meta.fillKeywords([]),
    openGraph: {
      type: "website",
      url: new URL(dictionary.urls.works, dictionary.meta.baseUrl).href,
      siteName: dictionary.meta.websiteName,
      title: dictionary.labels.works,
      description: dictionary.labels.noocWorks,
      images: "/static/banner.png",
    },
    twitter: {
      title: dictionary.labels.works,
      description: dictionary.labels.noocWorks,
      site: "@noobnooc",
      card: "summary_large_image",
    },
    alternates: {
      languages: await getAlternateLanguages(
        (dictionary) =>
          new URL(dictionary.urls.works, dictionary.meta.baseUrl).href,
      ),
    },
  };
}

export default async function WorksPage({
  params,
}: {
  params: { lang: string };
}) {
  const dictionary = await getDictionary(params.lang);

  return (
    <main className="mx-auto flex w-full max-w-screen-lg flex-col gap-4 px-4 py-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {dictionary.works.map((work) => (
          <Card
            key={work.name}
            className={twMerge(
              "flex flex-col gap-4 sm:flex-row",
              `bg-${work.color}-300/10 dark:bg-${work.color}-400/10`,
            )}
            link={work.link}
          >
            {work.image ? (
              <Image
                className="h-14 w-14 rounded-xl border aspect-square"
                src={work.image}
                alt={dictionary.labels.icon(work.name)}
              />
            ) : (
              <div
                className={twMerge(
                  "flex h-14 w-14 items-center justify-center rounded-lg font-mono text-4xl font-bold text-white ",
                  `bg-${work.color}-500`,
                )}
              >
                {work.name[0]}
              </div>
            )}
            <div>
              <h1 className={`text-${work.color}-500 text-bold sm:text-lg`}>
                {work.name}
              </h1>
              <p className="opacity-60">{work.summary}</p>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
