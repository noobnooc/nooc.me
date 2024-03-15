export const runtime = "edge";

import { posts } from "@/.velite";
import { CalendarDaysIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { displayDate } from "../../../lib/date";

function getPublishedPosts(lang: string) {
  return posts.filter((post) => !post.draft && post.lang === lang);
}

export default async function PostsPage({
  params,
}: {
  params: {
    lang: string;
  };
}) {
  const posts = getPublishedPosts(params.lang);

  return (
    <main className="mx-auto flex w-full max-w-screen-lg flex-col gap-4 px-4 py-8">
      {posts.map((post) => (
        <div
          key={post.slug}
          className="rounded-3xl p-4 border bg-white/50 dark:bg-indigo-100/5 flex flex-col gap-2"
        >
          <Link href={post.permalink}>
            <h1 className="text-xl font-serif">{post.title}</h1>
          </Link>
          <p className="opacity-70">{post.description}</p>
          <div className="opacity-50 flex items-center gap-4">
            <div className="flex items-center gap-1">
              <CalendarDaysIcon className="w-4 h-4" />
              {displayDate(post.date, params.lang)}
            </div>
          </div>
        </div>
      ))}
    </main>
  );
}
