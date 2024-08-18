---
title: Integrating a Static Blog in a Next.js Project with Velite
slug: integrate-a-blog-in-nextjs-with-velite
lang: en
date: 2024-03-17 00:00:00
categories:
  - development
description: In this article, I'll explain how to use Velite to add a static blog feature to a website built with Next.js. The final result will be similar to the blog system on this site.

keywords:
  - Next.js static blog
  - Velite tutorial
  - Velite vs Contentlayer
  - Contentlayer alternative
  - MDX styling
  - Blog setup
  - Static blog
---

# Why I Built Another Blog

Yes, I've integrated another blog system into my personal homepage. Before this, I already had a personal blog called "[Subjective World](https://subnooc.com)", where I occasionally share my thoughts. However, I've always positioned that blog to share only my personal insights or book notes, more life-oriented content. From the beginning, I never intended to publish anything related to technical tinkering there, and I even decided not to include any images, keeping it purely text-based.

But sometimes I still have the urge to share some tinkering records. I tried using GitHub [Discussions](https://github.com/noobnooc/noobnooc/discussions) to publish, which is honestly sufficient and has all the necessary features. However, the tinkering gene always gets restless, and I can't help but find flaws in this approach, such as the lack of customization, the deep entry point making it hard to discover, and the inability to drive traffic to my own website, among others.

Naturally, this blog should be integrated into my personal homepage and should have a high degree of customization capability. And since I'm moving away from GitHub, I must add some features that weren't there before, so I implemented multilingual translation. Now, if you go back to the title of this article, you'll see language switch links for English and Chinese below.

# Why Use a Static Blog

Nowadays, there are generally two choices for setting up a blog: dynamic blogs represented by Wordpress, Ghost, Typeecho, etc., and static blogs represented by Hugo, Hexo, Jekyll, etc. A clear distinction between static and dynamic blogs is whether they use a database. If there's a database, it's a dynamic blog; if not, it's a static blog.

The advantages of dynamic blogs are strong extensibility, interactivity, user-friendliness for non-technical people, and powerful, rich features. The disadvantages are difficulty in migration, high usage costs, and if you want to implement it yourself rather than using existing solutions, the effort required is hard to estimate. If you want to deploy it yourself, you need to use complete servers or container services, which are expensive infrastructure.

The advantages of static blogs are purity (because they're all in file form) and low cost, but they're not very friendly to non-technical people. Also, because there's no database, you need to use some tricks to implement interactive features like comments and likes. Platforms like GitHub Pages, Cloudflare Pages, Vercel, etc., all provide free static website hosting services, and static websites are identical no matter where they're deployed, so they can be migrated at any time. Therefore, static blogs are almost zero-cost except for time.

My personal homepage is already hosted on Cloudflare Pages, and I don't want to introduce a behemoth like a database for now. Plus, I'm not too concerned about interactivity. So I chose a static blog without hesitation.

# Why Choose Velite

[Velite](https://github.com/zce/velite) is an open-source JavaScript content conversion tool that can convert Markdown/MDX, YAML, and other files into type-safe JavaScript data. For example, to implement a static blog, you can use it to convert Markdown format files into data, and then display it in your code. It might seem a bit roundabout, why not use ready-made solutions like [Hugo](https://gohugo.io) or [Hexo](https://hexo.io/index.html), which directly generate static websites from Markdown?

But there are subtle differences between these two models. If you use tools like Hugo or Hexo, they help you generate the entire website, rather than making it part of an existing website. There are some methods to implement it as part of an existing website, but they all tend to feel unnatural and inelegant.

I want to make the blog a part of my personal homepage, not the entire body. Although this homepage currently has no dynamic content, to have the ability to expand in the future, I used [Next.js](https://nextjs.org) to develop this website from the start. In this case, using Velite feels very natural, converting blog content into data, then using it in Next.js to display. Moreover, combined with MDX, you can even embed some React components in articles, possibly creating some eye-catching gimmicks.

Velite is probably not the first tool of its kind. There's a much more famous one called [Contentlayer](https://contentlayer.dev), which I used for my "[Subjective World](https://subnooc.com)" blog. I actually found Velite while searching for alternatives to Contentlayer.

Although Contentlayer is famous, it has many problems:

- It doesn't handle static assets well
- Maintenance is inactive, with no updates for over half a year
- The documentation is too brief, and often encounters `500` server errors

As of March 2024, Contentlayer's last update was seven months ago, and looking through GitHub PRs, you can see that the vast majority of PRs are closed without being merged. This indicates that the original author no longer has the intention to update. Even the documentation often can't be opened, making it impossible to use.

Moreover, in my imagination, the file structure of a blog should be one folder per article, with the article's Markdown file, translations in different languages, images, and even videos - all resources related to the article placed in the same directory for easy organization. But Contentlayer doesn't seem to be able to use this directory structure because it doesn't process static files. Files like images need to be manually placed in the `public` directory, hosted by Next.js, and then directly referenced in the Markdown file. This means resources for the same article have to be placed in different directories, making management very troublesome. Velite, on the other hand, supports directly copying static files referenced in Markdown files to `public` during build time, which is much more convenient. Moreover, in Velite's official examples, they use the same directory structure as I imagined, perhaps the author made this tool out of similar needs.

Velite uses Zod to provide data type checking, which can greatly ensure type safety and reduce maintenance burden. It also provides features like `slug` duplication detection and directory generation.

So based on these reasons, I ultimately chose to use Velite to integrate blog functionality into my personal homepage.

# Getting Started with Velite

Velite has detailed usage documentation on its [official website](https://velite.js.org/guide/quick-start). If you want to carefully study what it can be used for and some specific details, you can go directly to the official website to check. Here, I'll just briefly introduce the process of integrating a static blog in a Next.js project using Velite.

> I performed the subsequent operations in a project created using `npx create-next-app@latest`, which uses all default settings, i.e., TypeScript, TailwindCSS, and App Router are enabled, etc. For specific details, refer to the [Next.js official documentation](https://nextjs.org/docs/getting-started/installation). If your project structure is different from mine, you can make some relevant changes yourself.

The workflow of Velite is:

- Read the contents of the `velite.config.js` or `velite.config.ts` configuration file
- According to the definitions in the configuration file, read and process the contents of the directory specified by `root` in the configuration file
- Output the processed results to the directory set by `output` in the configuration file
- In the Next.js project, directly import the results processed by Velite, and then you can start various operations

## Installing Velite

First, we need to install Velite before we can properly import Velite-related configurations. Open the terminal and execute the following command:

```bash
# If you are using a different package manager, use the corresponding command
npm install velite
```

## Adding Necessary Configuration

As mentioned above, we will use the `velite.config.ts` configuration file to tell Velite how to work. So let's create a file named `velite.config.ts` in the project root directory and fill it in with the following content:

```ts
// velite.config.ts

import { defineConfig } from "velite";

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

- Process files in the `content` directory
- Place the processed results in the `.velite` directory
- Put referenced static assets like images and videos into the `/public/static` directory
- The reference address for processed static assets is `/static/**` (because Next.js hosts files in the `public` directory at the root of the website, so the `/public/static/**` directory corresponds to the address `/static/**`)
- The filename for processed static assets is `[name]-[hash:6].[ext]`
- Velite cleans the output directory before building

From this, we can see that the files in the `.velite` and `public/static` directories are automatically generated by Velite, so we shouldn't let Git track their changes. Therefore, we can add these two directories to `.gitignore`:

```bash
# .gitignore

# Existing content

# Velite
.velite
public/static
```

After adding these two lines to `.gitignore`, Velite will not affect the state of our code repository when working.

If we execute the `npx velite` command, Velite will start processing files according to our definitions (because we haven't told it how to process which files, so it won't process anything). However, every time we want to execute `npx velite` in the development process, it's a bit cumbersome. So we can integrate the processing into Next.js, and let Velite automatically detect file changes and process them during `next dev` or `next build`.

To implement this operation, we can add Velite's processing logic to `next.config.js`. Open the `next.config.js` file in the root directory and replace it with the following content:

```js
// next.config.js

const isDev = process.argv.indexOf('dev') !== -1
const isBuild = process.argv.indexOf('build') !== -1
if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
  process.env.VELITE_STARTED = '1'
  const { build } = await import('velite')
  await build({ watch: isDev, clean: !isDev })
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
```

> If you have modified the default configuration file of Next.js before, you can add the Velite-related logic according to your configuration.

After adding the above configuration, we can use Velite as usual without worrying about it, and when we want to use the processed files, we can directly import the contents of `.velite`.

If our project structure is deep, to avoid the situation of `import {posts} from '../../../../velite'`, we can add a convenient path in the TypeScript configuration file. Open the `tsconfig.json` file in the project root directory, and add the following data:

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

After adding the above configuration, I can easily use `import {posts} from '@/velite'` to import the processed files.

## Define file processing methods

So far, we have completed all the necessary configurations for Velite, but we still need to tell Velite which files to process and how to process them.

Let's go back to the Velite configuration file `velite.config.ts`, where we have only added the `root` and `output` fields, but haven't told Velite our blog content format and directory structure. Because we are building a blog system, we need to define the structure of posts (Post) and categories (Category). So we can define these types in the configuration file, open the `velite.config.ts` file, and add the following content:

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

The above configuration tells Velite that we have `Category` and `Post` data.

- The `*.yml` files in the `content/categories/` directory will be parsed into Category data. Each file should contain the fields `slug`, `name`, and `description`, all of which are string types. The difference is that `slug` will check for uniqueness and cannot be `admin` or `login`.
- The `*.md` files in the `content/posts/` directory will be parsed into Post data. The header of the Markdown file needs to contain the fields: `title`, `slug`, `date`, `description`, and `categories`, their types can be inferred from the type definitions and meanings. The `toc` and `content` fields will be automatically filled in by Velite based on the content of the Markdown file.

Now, we can start adding articles and categories. Suppose we have a `development` category, we can create a `content/categories/development.yml` file and add the following content:

```yml
slug: development
name: Development
description: Sharing my experiences in programming
```

Then, we can add our first article by creating a file `content/posts/hello-world.md` and filling in the following content:

```md
---
title: Hello, world!
slug: hello-world
date: 2024-03-17 00:00:00
categories:
  - development
---

Hello! This is my first article on my blog.
```

Now we can directly import our category information and article content from the `.velite` directory.

# Using Velite's generated data in Next.js

After the above settings, we can directly import the data built by Velite in the `.velite` directory, and then use it in the page as needed.

- Read category information

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

- Read article list in a category

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

Then we can use these data to display, link, optimize styles, etc. in the interface.

---

Velite can also implement many other functions, such as counting the number of articles in each category, adding code highlighting to Markdown, and implementing internationalization.

More usage methods can be found in [my blog source code](https://github.com/noobnooc/nooc.me), or if there are more people who want to see it, I will write an article later to introduce advanced usage.
