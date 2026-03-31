import { lifePosts } from "@/lib/velite";
import { generateRssFeed } from "@/lib/feed";

export async function GET() {
  const lifeItems = lifePosts
    .filter((p) => p.lang === "zh")
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
    title: "Nooc 的主页 - 生活",
    description: "Nooc 的生活随笔、读书笔记和个人感悟。",
    link: "/feed/zh/life",
    language: "zh",
    items: lifeItems,
  });

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
