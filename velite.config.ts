import rehypePrettyCode from "rehype-pretty-code";
import { defineCollection, defineConfig, s } from "velite";

const lang = s.enum(["en", "zh"]);

const name = s.object({
  en: s.string().max(20),
  zh: s.string().max(20),
});

const description = s
  .object({
    en: s.string().max(100),
    zh: s.string().max(100),
  })
  .optional();

const count = s
  .object({
    en: s.number(),
    zh: s.number(),
  })
  .default({ en: 0, zh: 0 });

const categories = defineCollection({
  name: "Category",
  pattern: "categories/*.yml",
  schema: s
    .object({
      slug: s.slug("posts", ["admin", "login"]),
      cover: s.image().optional(),
      name,
      description,
      count,
    })
    .transform((data) => ({
      ...data,
      permalink: {
        en: `/en/posts/categories/${data.slug}`,
        zh: `/zh/posts/categories/${data.slug}`,
      },
    })),
});

const tags = defineCollection({
  name: "Tag",
  pattern: "tags/index.yml",
  schema: s
    .object({
      slug: s.slug("posts", ["admin", "login"]),
      cover: s.image().optional(),
      name,
      description,
      count,
    })
    .transform((data) => ({
      ...data,
      permalink: {
        en: `/en/posts/tags/${data.slug}`,
        zh: `/zh/posts/tags/${data.slug}`,
      },
    })),
});

const posts = defineCollection({
  name: "Post",
  pattern: "posts/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(99),
      slug: s.string(),
      lang,
      date: s.isodate(),
      updated: s.isodate().optional(),
      cover: s.image().optional(),
      video: s.file().optional(),
      description: s.string().max(999).optional(),
      keywords: s.array(s.string()).optional(),
      draft: s.boolean().default(false),
      featured: s.boolean().default(false),
      categories: s.array(s.string()),
      tags: s.array(s.string()).default([]),
      toc: s.toc(),
      metadata: s.metadata(),
      excerpt: s.excerpt(),
      content: s.markdown(),
    })
    .transform((data) => ({
      ...data,
      permalink: `/${data.lang}/posts/${data.slug}`,
      seoLink: `/${data.lang}/posts/${data.slug}/${data.title}`,
    })),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { categories, tags, posts },
  markdown: { rehypePlugins: [rehypePrettyCode] },
  prepare: ({ categories, tags, posts }) => {
    const docs = posts.filter(
      (i) => process.env.NODE_ENV !== "production" || !i.draft,
    );

    const unexpectedCategories = Array.from(
      new Set(docs.map((item) => item.categories).flat()),
    ).filter((i) => categories.find((j) => j.slug === i) == null);

    const unexpectedTags = Array.from(
      new Set(docs.map((item) => item.tags).flat()),
    ).filter((i) => tags.find((j) => j.slug === i) == null);

    if (unexpectedCategories.length || unexpectedTags.length) {
      console.error(
        "Unexpected categories or tags founded: ",
        unexpectedCategories.join(", "),
        unexpectedTags.join(", "),
      );

      return false;
    }

    categories.forEach((category) => {
      category.count = {
        en: posts.filter(
          (post) =>
            post.categories.includes(category.slug) && post.lang === "en",
        ).length,
        zh: posts.filter(
          (post) =>
            post.categories.includes(category.slug) && post.lang === "zh",
        ).length,
      };
    });

    tags.forEach((tag) => {
      tag.count = {
        en: posts.filter(
          (post) => post.tags.includes(tag.slug) && post.lang === "en",
        ).length,
        zh: posts.filter(
          (post) => post.tags.includes(tag.slug) && post.lang === "zh",
        ).length,
      };
    });
  },
});
