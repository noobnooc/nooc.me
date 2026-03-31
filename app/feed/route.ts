import { posts, lifePosts } from "@/lib/velite";
import { generateRssFeed } from "@/lib/feed";

export async function GET() {
  const allPosts = [
    ...posts
      .filter((p) => !p.draft && p.lang === "en")
      .map((p) => ({
        title: p.title,
        description: p.description,
        link: p.permalink,
        date: p.date,
        categories: p.categories,
        author: "nooc@nooc.me (Nooc)",
      })),
    ...lifePosts
      .filter((p) => p.lang === "en")
      .map((p) => ({
        title: p.title,
        description: p.description,
        link: p.permalink,
        date: p.date,
        categories: p.categories,
        author: "nooc@nooc.me (Nooc)",
      })),
  ].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const feed = generateRssFeed({
    title: "Nooc the Noob",
    description: "All posts from Nooc — tech articles and life essays.",
    link: "/feed",
    language: "en",
    items: allPosts,
  });

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
