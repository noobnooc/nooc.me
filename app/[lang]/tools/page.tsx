import Card from "../../../components/card";
import { twMerge } from "tailwind-merge";
import { getDictionary } from "../../../dictionaries";
import { Metadata } from "next";
import { getAlternateLanguages } from "@/lib/metadata";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";
import Image from "next/image";
import { getToolSlug } from "@/lib/slugify";

export const runtime = "edge";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang);

  return {
    metadataBase: new URL(dictionary.meta.baseUrl),
    title: dictionary.labels.tools,
    description: dictionary.labels.noocTools,
    keywords: dictionary.meta.fillKeywords([]),
    openGraph: {
      type: "website",
      url: new URL(dictionary.urls.tools, dictionary.meta.baseUrl).href,
      siteName: dictionary.meta.websiteName,
      title: dictionary.labels.tools,
      description: dictionary.labels.noocTools,
      images: "/static/banner.png",
    },
    twitter: {
      title: dictionary.labels.tools,
      description: dictionary.labels.noocTools,
      site: "@noobnooc",
      card: "summary_large_image",
    },
    alternates: {
      languages: await getAlternateLanguages(
        (dictionary) => dictionary.urls.tools,
      ),
    },
  };
}

function RatingStars({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const totalStars = 5;

  return (
    <div className="flex">
      {[...Array(fullStars)].map((_, i) => (
        <StarIcon key={`full-${i}`} className="h-4 w-4 text-yellow-500" />
      ))}
      {hasHalfStar && (
        <div className="relative">
          <StarIconOutline className="h-4 w-4 text-yellow-500" />
          <div
            className="absolute top-0 left-0 overflow-hidden"
            style={{ width: "50%" }}
          >
            <StarIcon className="h-4 w-4 text-yellow-500" />
          </div>
        </div>
      )}
      {[...Array(totalStars - fullStars - (hasHalfStar ? 1 : 0))].map(
        (_, i) => (
          <StarIconOutline
            key={`empty-${i}`}
            className="h-4 w-4 text-yellow-500"
          />
        ),
      )}
      <span className="ml-1 text-xs text-gray-600 dark:text-gray-400">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

export default async function ToolsPage({
  params,
}: {
  params: { lang: string };
}) {
  const dictionary = await getDictionary(params.lang);

  return (
    <main className="mx-auto flex w-full max-w-screen-lg flex-col gap-4 px-4 py-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {dictionary.tools.map((tool) => {
          const toolSlug = getToolSlug(tool.name);
          const toolUrl = `${dictionary.urls.tools}/${toolSlug}`;
          
          return (
            <Card
              key={tool.name}
              className={twMerge(
                "flex flex-col gap-4",
                `bg-${tool.color}-300/10 dark:bg-${tool.color}-400/10`,
              )}
              link={toolUrl}
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h2
                      className={`text-${tool.color}-500 font-semibold text-lg`}
                    >
                      {tool.name}
                    </h2>
                    <p className="text-sm opacity-80">{tool.summary}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {tool.platform && (
                        <span className="text-xs rounded-full bg-gray-200 dark:bg-gray-700 px-2 py-0.5">
                          {tool.platform}
                        </span>
                      )}
                      {tool.pricing && (
                        <span
                          className={`text-xs rounded-full px-2 py-0.5 ${
                            ["free", "免费"].includes(tool.pricing)
                              ? "bg-green-200 dark:bg-green-800"
                              : ["freemium", "免费增值"].includes(tool.pricing)
                                ? "bg-blue-200 dark:bg-blue-800"
                                : "bg-amber-200 dark:bg-amber-800"
                          }`}
                        >
                          {tool.pricing}
                        </span>
                      )}
                    </div>
                  </div>
                  <Image
                    src={tool.icon}
                    alt={`Icon of ${tool.name}`}
                    className={twMerge(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white",
                      `bg-${tool.color}-500`,
                    )}
                  />
                </div>
                <RatingStars rating={tool.rating} />
              </div>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
