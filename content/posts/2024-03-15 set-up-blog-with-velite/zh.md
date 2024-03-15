---
draft: true
title: 使用 Velite 搭建一个博客系统
slug: set-up-blog-with-velite
lang: zh
date: 2024-03-15 00:00:00
categories:
  - development

description: 使用 Velite 在 NextJS 项目中集成一个静态博客系统

keywords:
  - Next.js 静态博客
  - Velite 使用教程
  - Velite 对比 Contentlayer
  - Contentlayer 平替
---

在这篇文章里，我会介绍如何使用 Velite ，为使用 Next.js 搭建的网站，添加一个静态博客的功能。最终效果如本文

# 为什么又搭建了一个博客

是的，我又在我的个人主页上集成了一个博客系统。在这之前，我已经有了一个个人博客「[主观世界](https://subnooc.com)」，不时也会在上面发发牢骚。但我对该博客的定位一直是只分享我自己的一些心得想法，或者是读书笔记这些篇生活向的东西，从一开始就没有打算在上面发布技术折腾相关的东西。

但有时又还是有分享一些折腾记录的欲望，有尝试直接使用 GitHub 的 [Discussions](https://github.com/noobnooc/noobnooc/discussions) 来发布，说实话其实是够用的，该有的功能都有。但喜欢折腾的基因总是按耐不住，总是忍不住找这个方式的缺点，比如无法自定义、入口太深很难被发现、不能为自己的网站引流等等。

自然而然，这个博客应该集成到我的个人主页之中，应该要有高度的自定义能力。而且既然从 GitHub 搬出来了，那就必须得添加一些之前没有功能，于是我便实现了多语言翻译。此时如果你回到这篇文章的标题处，在下方便能看见英文和中文的切换链接。

# 为什么选择 Velite

[Velite](https://github.com/zce/velite) 是一个开源的 JavaScript 内容转换工具，它可以将 Markdown/MDX、 YAML 等文件，转换为类型安全的 JavaScript 数据。比如用来实现一个静态博客，可以使用它来将 Markdown 格式的文件，转换为数据，然后再在代码中将其展示出来。可能看起来有一点绕，为什么不直接使用现成的，像 [Hugo](https://gohugo.io)、[Hexo](https://hexo.io/index.html)，不都是直接将 Markdown 生成为静态网站吗。

但这两种模式有些微的区别，如果使用 Hugo、Hexo 这些工具，它们会帮你生成整个网站，而不是将其作为网站的一部分。也有一些方法能够实现将其作为现有网站的一部分，但都会显得不那么自然，不够优雅。

我是想将博客作为我个人主页的一部分，而不是作为整个主体。虽然目前这个主页没有任何的动态内容，但是为了后续有能够扩展的能力，我一开始就使用了 [Next.js](https://nextjs.org) 来开发这个网站。这时使用 Velite 这种方式就会显得很自然，博客的内容转换为数据，然后在 Next.js 中使用，将其展示出来。而且结合 MDX，还可以在文章中嵌入一些 React 组建，说不能搞一些能吸引眼球的噱头出来。

Velite 应该也不是第一个做这类工具的，有一个远比它有名的 [Contentlayer](https://contentlayer.dev) ，我的「[主观世界](https://subnooc.com)」这个博客便是使用的它。我也正是在搜索 Contentlayer 的代替品时，才找到的 Velite 。

Contentlayer 虽然有名，但它有很多问题：

- 不能很好地处理静态资源
- 维护不活跃，已经有半年多没更新
- 使用文档太简略，甚至经常 `500`

截止 2024 年 3 月，Contentlayer 的上一次更新是七个月前，而且翻找 GitHub PR，也能看到绝大多数 PR 都是被 Closed ，而没有被合并。说明原作者已经没有更新意愿了。甚至经常连使用文档都无法打开，更是没有办法使用了。

而且我想象中博客的文件结构，应该是一篇文章一个文件夹，文章的 Markdown 文件、不同语言的翻译、图片，甚至视频，这些和文章相关的资源都放在这同一个文件目录中，这样会比较方便整理。但 Contentlayer 似乎没法使用这样目录结构，因为它不会处理静态文件，像图片这些文件，需要自己手动放到 `public` 目录中，由 Next.js 托管，然后在 Markdown 文件中直接引用。这意味这同一篇文章的资源，要放在不同的目录之中，管理起来十分麻烦。而 Velite 支持直接将 Markdown 文件中引用到的静态文件，在构建时直接复制到 `public` 中去，这样就方便多了。

所以机遇上面这些原因，我选择了使用 Velite 来为我的个人主页集成博客功能。

# 开始使用 Velite
