---
title: 使用 Cloudflare 搭建一个 URL 重定向服务
slug: a-url-redirect-service-with-cloudflare
lang: zh
date: 2024-08-09 11:00:00
categories:
  - development
  - product
description: 使用 Cloudflare Pages 和 Cloudflare KV 搭建一个 URL 重定向服务

keywords:
  - 域名重定向
  - 短链接
  - Cloudflare Pages
  - Cloudflare KV
  - Cloudflare
  - JavaScript
  - Claude
  - AI
---

之前有一个需求，因为在我的 App 里会有 Twitter 、GitHub 和 Discord 的链接，而我又不想直接把链接硬编码到 App 里，尤其是 Discord ，他的链接看起来就像是随时会变的样子。所以我需要一个更稳定的链接，然后再重定向到目标链接。我初步设想的是，可以把 [weel.one/x](https://weel.one/x) 转到 Twitter，[weel.one/discord](https://weel.one/discord) 转到 Discord，[weel.one/spark-ios](https://weel.one/spark-ios) 转到星火记 app 的 App Store 链接，再把 [weel.one](https://weel.one) 转到公司的官网 [weelone.com](https://weelone.com)。这样即使实现稳定的链接转发到不稳定的链接，又能一眼看出链接的目的，还能实现短链。

有些域名服务商会直接提供重定向服务，像已经死去的 Google Domains 就有提供。但是我的域名全在 Cloudflare 上，而 Cloudflare 提供的重定向服务特别复杂，还限制数量。于是只能自己用 Cloudflare Pages 来实现一个了，趁着大家最近再说 Claude 写代码十分厉害，正好可以试试让他从头来实现这个服务。

于是就有了这个由 Claude 实现的 URL 重定向服务，[cf-redirect](https://github.com/noobnooc/cf-redirect) ，可以快速部署到 Cloudflare Pages 上，然后使用 Cloudflare KV 来存储重定向的链接关系。

比如在 Cloudflare KV 里添加了如下键值对：

```
redirect:x = https://twitter.com/weeloneHQ
redirect:github = https://github.com/weelone
redirect:discord = https://discord.gg/BehJCsAqQA
redirect:* = https://weelone.com
```

之后再访问 [weel.one/x](https://weel.one/x), [weel.one/github](https://weel.one/github), [weel.one/discord](https://weel.one/discord) 都会被重定向到对应的链接，访问不存在的链接或者直接访问 [weel.one](https://weel.one) 都会被重定向到 [weelone.com](https://weelone.com) 。

如果你也想要快速部署一个这样的服务，可以直接到 [仓库](https://github.com/noobnooc/cf-redirect) 里查看部署流程哦。