---
title: Building a URL Redirect Service with Cloudflare
slug: a-url-redirect-service-with-cloudflare
lang: en
date: 2024-08-09 11:00:00
categories:
  - development
  - product
description: Building a URL redirect service using Cloudflare Pages and Cloudflare KV

keywords:
  - domain redirect
  - short links
  - url redirect
  - Cloudflare Pages
  - Cloudflare KV
  - Cloudflare
  - JavaScript
  - Claude
  - AI
---

I had a requirement recently because my app contains links to Twitter, GitHub, and Discord, but I didn't want to hardcode these links directly into the app, especially for Discord, as its link seems like it could change at any time. So I needed a more stable link that could then redirect to the target link. My initial idea was to redirect [weel.one/x](https://weel.one/x) to Twitter, [weel.one/discord](https://weel.one/discord) to Discord, [weel.one/spark-ios](https://weel.one/spark-ios) to the App Store link for the Spark Notes app, and [weel.one](https://weel.one) to the company's official website [weelone.com](https://weelone.com). This way, I could achieve stable links forwarding to potentially unstable links, make the purpose of the links immediately apparent, and create short links all at once.

Some domain service providers offer redirect services directly, like the now-defunct Google Domains used to. However, all my domains are on Cloudflare, and Cloudflare's redirect service is particularly complex and has quantity limitations. So I had to implement one myself using Cloudflare Pages. With everyone recently talking about how great Claude is at writing code, I thought it would be perfect to try and have it implement this service from scratch.

This led to the creation of this URL redirect service implemented by Claude, [cf-redirect](https://github.com/noobnooc/cf-redirect), which can be quickly deployed to Cloudflare Pages and uses Cloudflare KV to store the redirect link relationships.

For example, after adding the following key-value pairs to Cloudflare KV:

```
redirect:x = https://twitter.com/weeloneHQ
redirect:github = https://github.com/weelone
redirect:discord = https://discord.gg/BehJCsAqQA
redirect:* = https://weelone.com
```

After that, visiting [weel.one/x](https://weel.one/x), [weel.one/github](https://weel.one/github), [weel.one/discord](https://weel.one/discord) will all be redirected to their corresponding links. Visiting non-existent links or directly accessing [weel.one](https://weel.one) will be redirected to [weelone.com](https://weelone.com).

If you also want to quickly deploy such a service, you can directly check the deployment process in the [repository](https://github.com/noobnooc/cf-redirect).