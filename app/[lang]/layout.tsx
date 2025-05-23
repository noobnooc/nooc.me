import "../../styles/globals.css";

import { Metadata } from "next";
import Image from "next/image";
import avatar from "../../public/static/avatar.webp";
import Link from "next/link";
import { dictionaryKeys, getDictionary } from "../../dictionaries";
import { getAlternateLanguages } from "@/lib/metadata";
import Script from "next/script";

export const runtime = "edge";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang);

  return {
    metadataBase: new URL(dictionary.meta.baseUrl),
    title: dictionary.meta.websiteName,
    description: dictionary.meta.motto,
    keywords: dictionary.meta.fillKeywords([]),
    openGraph: {
      type: "website",
      url: new URL(dictionary.urls.home, dictionary.meta.baseUrl).href,
      title: dictionary.meta.websiteName,
      description: dictionary.meta.motto,
      siteName: dictionary.meta.websiteName,
      images: "/static/banner.png",
    },
    twitter: {
      title: dictionary.meta.websiteName,
      description: dictionary.meta.motto,
      site: "@noobnooc",
      card: "summary_large_image",
      images: "/static/banner.png",
    },
    alternates: {
      languages: await getAlternateLanguages(
        (dictionary) => dictionary.urls.home,
      ),
    },
  };
}

export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    lang: string;
  };
}) {
  const dictionary = await getDictionary(params.lang);

  return (
    <html lang={params.lang} className="">
      <body className="bg-slate-50 text-black dark:bg-neutral-900 dark:text-slate-50">
        <header className="sticky top-0 z-10 text-md h-20">
          <div className="w-full bg-white/50 backdrop-blur-xl dark:bg-neutral-900">
            <div className="w-full bg-white/50 dark:bg-slate-100/5">
              <hr />
              <div className="mx-auto flex h-20 w-full max-w-screen-lg items-center justify-between gap-4 px-4 py-6">
                <Link
                  className="flex items-center gap-4"
                  href={dictionary.urls.home}
                >
                  <Image
                    className="h-8 w-8 rounded-lg"
                    src={avatar}
                    alt="Nooc Avatar"
                  />
                  <div className="font-bold hidden opacity-80 md:inline">
                    {dictionary.meta.websiteName}
                  </div>
                </Link>
                <nav className="font-light">
                  <ul className="flex gap-4">
                    <li>
                      <Link href={dictionary.urls.home}>
                        {dictionary.labels.home}
                      </Link>
                    </li>
                    <li>
                      <Link href={dictionary.urls.posts}>
                        {dictionary.labels.posts}
                      </Link>
                    </li>
                    <li>
                      <Link href={dictionary.urls.works}>
                        {dictionary.labels.works}
                      </Link>
                    </li>
                    <li>
                      <Link href={dictionary.urls.tools}>
                        {dictionary.labels.tools}
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
              <hr />
            </div>
          </div>
        </header>

        {children}

        <footer className="text-md bg-white/50 text-sm dark:bg-slate-100/5">
          <hr />
          <div className="mx-auto flex w-full max-w-screen-lg flex-col justify-between gap-4 px-4 py-10 sm:flex-row">
            <nav className="opacity-80">
              <ul className="flex gap-4">
                {dictionary.works
                  .filter((work) => work.primary)
                  .map((item) => (
                    <li key={item.name}>
                      <a href={item.link}>{item.name}</a>
                    </li>
                  ))}
              </ul>
            </nav>
            <p className="opacity-60">© 2025 Nooc</p>
          </div>
          <hr />
        </footer>
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
