import { posts } from "@/lib/velite";
import { generateRssFeed } from "@/lib/feed";

export async function GET() {
  const techPosts = posts
    .filter((p) => !p.draft && p.lang === "en")
    .sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
    .map((p) => ({
      title: p.title,
      description: p.description,
      link: p.permalink,
      date: p.date,
      categories: p.categories,
      author: "nooc@nooc.me (Nooc)",
    }));

  const feed = generateRssFeed({
    title: "Nooc the Noob - Tech",
    description: "Tech articles and development insights from Nooc.",
    link: "/feed/tech",
    language: "en",
    items: techPosts,
  });

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
