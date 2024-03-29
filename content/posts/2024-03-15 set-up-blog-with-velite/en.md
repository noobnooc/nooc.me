---
title: Integrating a Static Blog in a Next.js Project Using Velite
slug: integrate-a-blog-in-nextjs-with-velite
lang: en
date: 2024-03-17 00:00:00
categories:
  - development
description: In this article, I will introduce how to use Velite to add a static blog feature to a website built with Next.js. The final effect is like the blog system of this site.

keywords:
  - Next.js static blog
  - Velite tutorial
  - Velite vs Contentlayer
  - Contentlayer alternative
  - MDX styling
  - Blog building
  - Static blog
---

# Why Another Blog?

Yes, I have integrated another blog system into my personal website. Before this, I already had a personal blog called "[Subjective World](https://subnooc.com)" where I occasionally vent my thoughts. However, I always intended for that blog to only share my personal insights, thoughts, and book notes - essentially, non-technical content. Right from the start, I had no plans to publish any technical-related content on that blog, and I even decided not to include any images, keeping it purely text-based.

But sometimes, I still had the desire to share some of my technical experiments and records. I tried using GitHub's [Discussions](https://github.com/noobnooc/noobnooc/discussions), and to be honest, it was sufficient. It had all the necessary features. However, my inclination to tinker couldn't be suppressed, and I couldn't help but find the limitations of that approach, such as the lack of customization, difficulty in discovery due to deep navigation, and the inability to drive traffic to my own website.

Naturally, this new blog should be integrated into my personal website, and it should have a high degree of customization. Since I moved away from GitHub, I felt the need to add some new features that were previously unavailable. As a result, I implemented multilingual translation. If you go back to the title of this article, you will see links to switch between English and Chinese below.

# Why Use a Static Blog

When it comes to building a blog, there are generally two options: dynamic blogs represented by platforms like Wordpress, Ghost, and Typecho, and static blogs represented by Hugo, Hexo, and Jekyll. The main difference between static and dynamic blogs is the presence of a database. Dynamic blogs rely on databases, while static blogs do not.

Dynamic blogs offer advantages such as scalability, interactivity, and user-friendliness, with powerful and feature-rich functionality. However, they can be difficult to migrate and come with high implementation costs. Setting up a dynamic blog from scratch requires significant effort and investment in expensive infrastructure like servers or container services.

On the other hand, static blogs are known for their simplicity (as they are based on files) and low cost. However, they may not be as user-friendly for non-technical users, and interactive features like comments and likes require workarounds since there is no database. Major platforms like GitHub Pages, Cloudflare Pages, and Vercel offer free hosting for static websites, and migrating a static blog is straightforward since the deployment process is the same across different platforms. Therefore, apart from the time investment, static blogs are virtually cost-free.

Since my personal website is already hosted on Cloudflare Pages and I don't currently have a need for a database, nor do I prioritize interactivity, I confidently chose a static blog without hesitation.

# Why Choose Velite

[Velite](https://github.com/zce/velite) is an open-source JavaScript content transformation tool that can convert Markdown/MDX, YAML, and other files into type-safe JavaScript data. For example, to implement a static blog, you can use Velite to convert Markdown files into data and then display them in your code. It may seem a bit convoluted, why not use ready-made solutions like [Hugo](https://gohugo.io) or [Hexo](https://hexo.io/index.html), which directly generate static websites from Markdown.

However, there are slight differences between these two approaches. If you use tools like Hugo or Hexo, they will generate the entire website instead of integrating it as part of an existing website. Although there are methods to integrate them into an existing website, they may not be as natural and elegant.

I wanted to integrate the blog as part of my personal homepage, rather than as a separate entity. Although my current homepage does not have any dynamic content, I chose to develop the website using [Next.js](https://nextjs.org) from the beginning to have the ability to expand in the future. This is where using Velite becomes natural: converting blog content into data and displaying it within Next.js. Additionally, with the help of MDX, I can embed React components in the articles, adding some eye-catching features.

Velite is not the first tool of its kind. There is a more well-known alternative called [Contentlayer](https://contentlayer.dev), which I used for my blog, "[Subjective World](https://subnooc.com)". I discovered Velite while searching for an alternative to Contentlayer.

Contentlayer, despite its popularity, has several issues:

- It doesn't handle static resources well.
- The maintenance is inactive, with no updates for over half a year.
- The documentation is too brief and often results in server errors (500).

As of March 2024, Contentlayer's last update was seven months ago, and looking at GitHub PRs, most of them are closed without being merged. This indicates that the original author no longer has the intention to update it. Even the documentation often fails to open, making it unusable.

Moreover, I envisioned a blog file structure where each article has its own folder containing the Markdown file, translations in different languages, images, and even videos related to the article. Contentlayer seems unable to support this directory structure because it doesn't handle static files. Images and similar files need to be manually placed in the `public` directory and managed by Next.js, then referenced directly in the Markdown file. This means that resources for the same article need to be placed in different directories, making management cumbersome. In contrast, Velite supports copying static files referenced in Markdown files directly to the `public` directory during the build process, making it much more convenient. Additionally, Velite's official examples also use the same directory structure I envisioned, suggesting that the author had similar requirements when creating this tool.

Velite uses Zod to provide data type checking, ensuring type safety and reducing maintenance burden. It also offers features such as duplicate `slug` detection and directory generation.

Based on these reasons, I ultimately chose to use Velite to integrate blogging functionality into my personal homepage.

# Getting Started with Velite

Velite has detailed documentation on its [official website](https://velite.js.org/guide/quick-start). If you want to explore what it can do and learn about specific details, you can refer to the official website. Here, I will provide a brief overview of how to integrate a static blog using Velite in a Next.js project.

> I performed the following steps in a project created using `npx create-next-app@latest` with the default settings, including TypeScript, TailwindCSS, and App Router. You can refer to the [Next.js official documentation](https://nextjs.org/docs/getting-started/installation) if your project structure is different from mine and make the necessary changes accordingly.

The workflow with Velite is as follows:

- Read the contents of the `velite.config.js` or `velite.config.ts` configuration file.
- Based on the configuration, read and process the content of the `root` directory specified in the configuration file.
- Output the processed results to the directory specified in the `output` configuration.
- Import the processed results from Velite directly into the Next.js project and start performing various operations.

## Adding the Necessary Configuration

As mentioned above, we will use the `velite.config.ts` configuration file to instruct Velite on how to work. Without further ado, let's create a file named `velite.config.ts` in the root directory of the project and add the following content:

```ts
// velite.config.ts

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
});
```

This configuration tells Velite:

- Process files in the `content` directory.
- Place the processed results in the `.velite` directory.
- Place referenced images, videos, and other static resources in the `/public/static` directory.
- The URL for the processed static resources will be `/static/**` (since Next.js serves files from the `public` directory at the root of the website, `/public/static/**` corresponds to `/static/**`).
- The processed static resource files will have the format `[name]-[hash:6].[ext]`.
- Velite will clean the output directory before building.

From this, we can see that the files in the `.velite` and `public/static` directories are generated by Velite and should not be tracked by Git. Therefore, we should add these two directories to the `.gitignore` file:

```bash
# .gitignore

# Origin content

# Velite
.velite
public/static
```

After adding these two lines to `.gitignore`, Velite will not affect the status of our code repository while working.

Now, if we run the `npx velite` command, Velite will start processing files according to our configuration (since we haven't told it how to process which files, it won't perform any processing). However, it can be cumbersome to run `npx velite` every time during development. Therefore, we can integrate the processing into Next.js and let Velite automatically detect file changes and process them during the `next dev` or `next build` process.

To achieve this, we can add Velite's processing logic to the `next.config.js` file in the root directory. Open the `next.config.js` file and replace its contents with the following:

```js
// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.plugins.push(new VeliteWebpackPlugin());
    return config;
  },
};

class VeliteWebpackPlugin {
  static started = false;
  apply(/** @type {import('webpack').Compiler} */ compiler) {
    // executed three times in nextjs
    // twice for the server (nodejs / edge runtime) and once for the client
    compiler.hooks.beforeCompile.tapPromise("VeliteWebpackPlugin", async () => {
      if (VeliteWebpackPlugin.started) return;
      VeliteWebpackPlugin.started = true;
      const dev = compiler.options.mode === "development";
      const { build } = await import("velite");
      await build({ watch: dev, clean: !dev });
    });
  }
}

module.exports = nextConfig;
```

> If you have already modified the default configuration file of Next.js before this, you can add the Velite-related logic based on your own configuration, referring to the above content.

After adding the above configuration, we can develop our Next.js project as usual without worrying about Velite. When we want to use the files processed by Velite, we can directly import the contents from the `.velite` directory.

If our project structure is deep, to avoid situations like `import {posts} from '../../../../velite'`, we can add a convenient path in the TypeScript configuration file. Open the `tsconfig.json` file in the root directory of the project and add the following data:

```json
{
  "compilerOptions": {
    ... Other config

    "paths": {
      "@/*": ["./*"]
    }
  }

  ... Other config
}
```

After adding the above configuration, we can conveniently use `import {posts} from '@/velite'` to import the files processed by Velite from anywhere.

## Define file processing methods

So far, we have completed all the necessary configurations for Velite, but there is one crucial step left - telling Velite which files to process and how to process them.

Let's go back to the Velite configuration file `velite.config.ts`. Previously, we only added the `root` and `output` fields, but we haven't told Velite about the format and directory structure of our blog content. Since we are building a blog system, we need to define the structure of posts and categories. We can define these two types in the configuration file. Open the `velite.config.ts` file and add the following content:

```ts
// velite.config.ts

import { defineCollection, defineConfig, s } from "velite";

const categories = defineCollection({
  name: "Category",
  pattern: "categories/*.yml",
  schema: s.object({
    slug: s.slug("posts", ["admin", "login"]),
    name: s.string(),
    description: s.string(),
  }),
});

const posts = defineCollection({
  name: "Post",
  pattern: "posts/**/*.md",
  schema: s.object({
    title: s.string().max(99),
    slug: s.slug(),
    date: s.isodate(),
    description: s.string().max(999).optional(),
    categories: s.array(s.string()),
    toc: s.toc(),
    content: s.markdown(),
  }),
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
  collections: { categories, posts },
});
```

The above configuration tells Velite that we have data for `Category` and `Post`.

- Files with the `*.yml` extension in the `content/categories/` directory will be parsed as Category data. Each file should include the fields `slug`, `name`, and `description`, all of which are string types. The `slug` field will be checked for uniqueness and cannot be `admin` or `login`.
- Files with the `*.md` extension in the `content/posts/` directory will be parsed as Post data. The Markdown file should include the following fields in the front matter: `title`, `slug`, `date`, `description`, and `categories`. The types of these fields can be inferred based on the type definitions and their meanings. The `toc` and `content` fields will be automatically filled by Velite based on the content of the Markdown file.

Now, we can start adding articles and categories. For example, if we have a category called "Development", we can create a `content/categories/development.yml` file and add the following content:

```yml
slug: development
name: Development
description: Sharing my experiences and adventures in programming
```

Then, we can add our first article by creating a file `content/posts/hello-world.md` and filling it with the following content:

```md
---
title: Hello, world!
slug: hello-world
date: 2024-03-17 00:00:00
categories:
  - development
---

Hello there! This is the first article on my blog.
```

Now we can directly import our category information and post content from the `.velite` directory.

# Using Velite-generated data in Next.js

After the above setup, we can import the data built by Velite from the `.velite` directory and use it in our pages.

- Reading category information

```ts
import { categories } from "@/.velite";

export default function Page() {
  return (
    <ul>
      {categories.map((category) => (
        <li key={category.slug}>
          <a href={`/categories/${category.slug}`}>{category.name}</a>
        </li>
      ))}
    </ul>
  );
}
```

- Read article list

```ts
import { posts } from "@/.velite";

export default function Page() {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug}>
          <a href={`/posts/${post.slug}`}>{post.title}</a>
        </li>
      ))}
    </ul>
  );
}
```

- Read the list of articles under a specific category

```ts
import { categories, posts } from "@/.velite";

function getPostsByCategorySlug(categorySlug: string) {
  return posts.filter((post) => post.categories.includes(categorySlug));
}

export default function Page() {
  const targetCategory = categories[0];

  const filteredPosts = getPostsByCategorySlug(targetCategory.slug);

  return (
    <ul>
      {filteredPosts.map((post) => (
        <li key={post.slug}>
          <a href={`/posts/${post.slug}`}>{post.title}</a>
        </li>
      ))}
    </ul>
  );
}
```

Then we can use this data to display, link, and optimize styles in the interface.

---

Velite can also achieve many other functions, such as counting the number of articles in each category, adding code highlighting to Markdown, and implementing internationalization.

For more usage examples, you can refer to [the source code of my blog](https://github.com/noobnooc/nooc.me), or if there are many people interested, I can write another article to introduce advanced usage later.
