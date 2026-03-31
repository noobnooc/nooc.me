import { lifePosts } from "@/lib/velite";
import { generateRssFeed } from "@/lib/feed";

export async function GET() {
  const lifeItems = lifePosts
    .filter((p) => p.lang === "en")
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
    title: "Nooc the Noob - Life",
    description: "Life essays, reading notes, and personal reflections from Nooc.",
    link: "/feed/life",
    language: "en",
    items: lifeItems,
  });

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
