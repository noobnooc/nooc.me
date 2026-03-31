import "../../styles/globals.css";

import { Metadata } from "next";
import { getDictionary, dictionaryKeys } from "../../dictionaries";
import { getAlternateLanguages } from "@/lib/metadata";
import { generateWebSiteJsonLd } from "@/lib/json-ld";
import Script from "next/script";
import PrinterShell from "../../components/printer-shell";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
type ColorMode = "system" | "light" | "dark";
type ResolvedColorMode = "light" | "dark";

function parseColorMode(value: string | undefined): ColorMode {
  return value === "system" || value === "light" || value === "dark" ? value : "system";
}

function parseResolvedColorMode(value: string | undefined): ResolvedColorMode | undefined {
  return value === "light" || value === "dark" ? value : undefined;
}

export async function generateMetadata(
  props: {
    params: Promise<{ lang: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  if (!dictionaryKeys.includes(params.lang as any)) return {};
  const dictionary = await getDictionary(params.lang);

  const feedBase = params.lang === "zh" ? "/feed/zh" : "/feed";

  return {
    metadataBase: new URL(dictionary.meta.baseUrl),
    title: dictionary.meta.websiteName,
    description: dictionary.meta.motto,
    keywords: dictionary.meta.fillKeywords([]),
    authors: [{ name: "Nooc", url: dictionary.meta.baseUrl }],
    creator: "Nooc",
    openGraph: {
      type: "website",
      url: new URL(dictionary.urls.home, dictionary.meta.baseUrl).href,
      title: dictionary.meta.websiteName,
      description: dictionary.meta.motto,
      siteName: dictionary.meta.websiteName,
      locale: params.lang === "zh" ? "zh_CN" : "en_US",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: dictionary.meta.websiteName,
        },
      ],
    },
    twitter: {
      title: dictionary.meta.websiteName,
      description: dictionary.meta.motto,
      site: "@noobnooc",
      creator: "@noobnooc",
      card: "summary_large_image",
      images: ["/twitter-image"],
    },
    alternates: {
      canonical: new URL(dictionary.urls.home, dictionary.meta.baseUrl).href,
      types: {
        "application/rss+xml": [
          { url: `${feedBase}`, title: `${dictionary.meta.websiteName} - All` },
          { url: `${feedBase}/tech`, title: `${dictionary.meta.websiteName} - Tech` },
          { url: `${feedBase}/life`, title: `${dictionary.meta.websiteName} - Life` },
        ],
      },
      languages: await getAlternateLanguages(
        (dictionary) => dictionary.urls.home,
      ),
    },
  };
}

export default async function RootLayout(
  props: {
    children: React.ReactNode;
    params: Promise<{
      lang: string;
    }>;
  }
) {
  const params = await props.params;

  const {
    children
  } = props;

  if (!dictionaryKeys.includes(params.lang as any)) notFound();
  const dictionary = await getDictionary(params.lang);
  const cookieStore = await cookies();
  const initialColorMode = parseColorMode(cookieStore.get("color-mode")?.value);
  const initialResolvedColorMode = parseResolvedColorMode(
    cookieStore.get("resolved-color-mode")?.value,
  );
  const initialHtmlClassName =
    initialColorMode === "dark" ||
    (initialColorMode === "system" && initialResolvedColorMode === "dark")
      ? "dark"
      : undefined;

  const printerShellProps = {
    labels: {
      home: dictionary.labels.home,
      posts: dictionary.labels.posts,
      life: dictionary.labels.life,
      works: dictionary.labels.works,
      about: dictionary.labels.about,
      brandName: dictionary.labels.brandName,
      brandTagline: dictionary.labels.brandTagline,
    },
    urls: {
      home: dictionary.urls.home,
      posts: dictionary.urls.posts,
      life: dictionary.urls.life,
      works: dictionary.urls.works,
      about: dictionary.urls.about,
    },
  };

  return (
    <html
      lang={params.lang}
      suppressHydrationWarning
      className={initialHtmlClassName}
      data-color-mode={initialColorMode}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var fallbackMode = '${initialColorMode}';
                  var storedMode = localStorage.getItem('color-mode');
                  var mode = storedMode === 'system' || storedMode === 'light' || storedMode === 'dark'
                    ? storedMode
                    : fallbackMode;
                  document.documentElement.dataset.colorMode = mode;
                  var dark = mode === 'dark' || mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (dark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateWebSiteJsonLd({
              name: dictionary.meta.websiteName,
              alternateName: "Nooc the Noob",
              url: new URL(dictionary.urls.home, dictionary.meta.baseUrl).href,
              description: dictionary.meta.motto,
            })),
          }}
        />
      </head>
      <body>
        <PrinterShell dictionary={printerShellProps} lang={params.lang} initialColorMode={initialColorMode}>
          {children}
        </PrinterShell>
      </body>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3512386112816826"
        strategy="lazyOnload"
        crossOrigin="anonymous"
      ></Script>
    </html>
  );
}
