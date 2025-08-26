import { getDictionary } from "../../../../dictionaries";
import { getToolSlug } from "@/lib/slugify";
import { Metadata } from "next";
import { getAlternateLanguages } from "@/lib/metadata";
import { notFound } from "next/navigation";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";

export const runtime = "edge";

export async function generateStaticParams() {
  const enDictionary = await getDictionary("en");
  const zhDictionary = await getDictionary("zh");
  
  const params = [];
  
  // Generate params for English tools
  for (const tool of enDictionary.tools) {
    params.push({
      lang: "en",
      toolSlug: getToolSlug(tool.name),
    });
  }
  
  // Generate params for Chinese tools
  for (const tool of zhDictionary.tools) {
    params.push({
      lang: "zh",
      toolSlug: getToolSlug(tool.name),
    });
  }
  
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string; toolSlug: string };
}): Promise<Metadata> {
  const { lang, toolSlug } = params;
  const dictionary = await getDictionary(lang);

  const tool = dictionary.tools.find(
    (tool) => getToolSlug(tool.name) === toolSlug,
  );

  if (!tool) {
    notFound();
  }

  return {
    metadataBase: new URL(dictionary.meta.baseUrl),
    title: `${tool.name} - ${dictionary.labels.tools}`,
    description: tool.summary,
    keywords: dictionary.meta.fillKeywords([tool.name, tool.platform, tool.pricing]),
    openGraph: {
      type: "website",
      url: new URL(`${dictionary.urls.tools}/${toolSlug}`, dictionary.meta.baseUrl).href,
      siteName: dictionary.meta.websiteName,
      title: `${tool.name} - ${dictionary.labels.tools}`,
      description: tool.summary,
      images: "/static/banner.png",
    },
    twitter: {
      title: `${tool.name} - ${dictionary.labels.tools}`,
      description: tool.summary,
      site: "@noobnooc",
      card: "summary_large_image",
    },
    alternates: {
      languages: await getAlternateLanguages(
        (dictionary) => `${dictionary.urls.tools}/${toolSlug}`,
      ),
    },
  };
}

function RatingStars({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const totalStars = 5;

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <StarIcon key={`full-${i}`} className="h-5 w-5 text-yellow-500" />
      ))}
      {hasHalfStar && (
        <div className="relative">
          <StarIconOutline className="h-5 w-5 text-yellow-500" />
          <div
            className="absolute top-0 left-0 overflow-hidden"
            style={{ width: "50%" }}
          >
            <StarIcon className="h-5 w-5 text-yellow-500" />
          </div>
        </div>
      )}
      {[...Array(totalStars - fullStars - (hasHalfStar ? 1 : 0))].map(
        (_, i) => (
          <StarIconOutline
            key={`empty-${i}`}
            className="h-5 w-5 text-yellow-500"
          />
        ),
      )}
      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

export default async function ToolPage({
  params,
}: {
  params: {
    lang: string;
    toolSlug: string;
  };
}) {
  const { lang, toolSlug } = params;
  const dictionary = await getDictionary(lang);

  const tool = dictionary.tools.find(
    (tool) => getToolSlug(tool.name) === toolSlug,
  );

  if (!tool) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-screen-lg flex-col gap-8 px-4 py-8">
      {/* Back to Tools Link */}
      <Link
        href={dictionary.urls.tools}
        className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
      >
        ← {dictionary.labels.backToTools}
      </Link>

      {/* Tool Header */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <Image
            src={tool.icon}
            alt={`Icon of ${tool.name}`}
            className={twMerge(
              "flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-white",
              `bg-${tool.color}-500`,
            )}
          />
          <div className="flex-1">
            <h1
              className={twMerge(
                "text-3xl font-bold mb-2",
                `text-${tool.color}-500`,
              )}
            >
              {tool.name}
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
              {tool.summary}
            </p>
            <RatingStars rating={tool.rating} />
          </div>
        </div>

        {/* Tool Details */}
        <div className="flex flex-wrap gap-4">
          {tool.platform && (
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {dictionary.labels.platform}
              </span>
              <span className="text-sm rounded-full bg-gray-200 dark:bg-gray-700 px-3 py-1">
                {tool.platform}
              </span>
            </div>
          )}
          {tool.pricing && (
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {dictionary.labels.pricing}
              </span>
              <span
                className={`text-sm rounded-full px-3 py-1 ${
                  ["free", "免费"].includes(tool.pricing)
                    ? "bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200"
                    : ["freemium", "免费增值"].includes(tool.pricing)
                      ? "bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200"
                      : "bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200"
                }`}
              >
                {tool.pricing}
              </span>
            </div>
          )}
        </div>

        {/* Visit Tool Button */}
        <div className="flex gap-4">
          <a
            href={tool.link}
            target="_blank"
            rel="noopener noreferrer"
            className={twMerge(
              "inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-colors",
              `bg-${tool.color}-500 hover:bg-${tool.color}-600`,
            )}
          >
            {dictionary.labels.visitTool} {tool.name}
            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
    </main>
  );
}