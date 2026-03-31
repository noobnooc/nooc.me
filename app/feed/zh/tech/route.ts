import { posts } from "@/lib/velite";
import { generateRssFeed } from "@/lib/feed";

export async function GET() {
  const techPosts = posts
    .filter((p) => !p.draft && p.lang === "zh")
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
    title: "Nooc 的主页 - 技术",
    description: "Nooc 的技术文章和开发心得。",
    link: "/feed/zh/tech",
    language: "zh",
    items: techPosts,
  });

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
