import type { IconName } from "$lib/icons";

interface Contact {
  label: string;
  name: string;
  link: string;
  icon: IconName;
}

const contacts: Contact[] = [
  {
    label: "X (Twitter)",
    name: "@noobnooc",
    link: "https://x.com/noobnooc",
    icon: "x",
  },
  {
    label: "GitHub",
    name: "@noobnooc",
    link: "https://github.com/noobnooc",
    icon: "github",
  },
  {
    label: "Email",
    name: "nooc@nooc.me",
    link: "mailto:nooc@nooc.me",
    icon: "mail",
  },
  {
    label: "Telegram",
    name: "@noobnooc",
    link: "https://t.me/noobnooc",
    icon: "send",
  },
];

const dictionary = {
  meta: {
    baseUrl: "https://nooc.me",
    websiteName: "Nooc the Noob",
    motto: "A noob named Nooc.",
    mottos: [
      "The rose is without why, it blooms because it blooms.",
      "What we call ordinary life, day after day, may in fact be a chain of miracles.",
    ],
    fillKeywords(keywords?: string[]): string[] {
      return [
        "Nooc",
        "noobnooc",
        "noocink",
        "nookinc",
        "Nooc Website",
        "Portfolio",
        "Indie Blog",
        "Personal Blog",
        "Personal Website",
        "Indie Developer",
        "Bento",
        ...(keywords ?? []),
      ];
    },
  },
  urls: {
    home: "/en",
    works: "/en/works",
    posts: "/en/posts",
    life: "/en/life",
    about: "/en/about",

    shareToX(title: string, postLink: string) {
      return `https://twitter.com/share?text=${encodeURIComponent(
        `I am reading ${title.toLocaleUpperCase()} @noobnooc`,
      )}&url=${encodeURIComponent(`https://nooc.me${postLink}`)}`;
    },
  },
  labels: {
    home: "Home",
    works: "Works",
    posts: "Tech",
    life: "Life",
    about: "About",
    latestTech: "Tech",
    latestLife: "Life",
    noocWorks: "Nooc's Works",
    recommended: "Recommended",
    activity: "Activity",
    categories: "Categories",
    featured: "Featured",
    archive: "Archive",
    shareTo: "Share to: ",
    brandName: "NOOC",
    brandTagline: "Nooc the Noob",
    backToSection: {
      posts: "← BACK TO TECH",
      life: "← BACK TO LIFE",
    },
    allSectionPosts: {
      posts: "← ALL TECH POSTS",
      life: "← ALL LIFE POSTS",
    },
    notFoundStatus: "Paper Tray Empty",
    notFoundTitle: "Out of Paper",
    notFoundSubtitle: "Please insert paper correctly to print content.",
    notFoundButton: "← Print Home",
    notFoundError: "ERR 404 · PAPER_NOT_FOUND",
    printedOn: "Printed on",
    reading: "Recent Reading",
    films: "Recent Films",
    music: "Recent Listening",
    aboutTitle: "About",
    aboutSubtitle: "A noob named Nooc",
    wechatScanHint: "Scan to read on WeChat",
    entries(count: number) {
      return `${count} ${count === 1 ? "entry" : "entries"}`;
    },
    icon(label: string) {
      return `Icon for ${label}`;
    },
  },
  tools: [
    {
      name: "Raycast",
      summary:
        "Raycast is a blazingly fast, totally extendable launcher for macOS.",
      link: "https://raycast.com/?via=nooc",
      icon: "/images/tools/raycast.webp",
      rating: 5,
      platform: "macOS",
      pricing: "freemium",
    },
    {
      name: "OrbStack",
      summary:
        "OrbStack is the fast, light, and easy way to run Docker containers and Linux.",
      link: "https://orbstack.dev",
      icon: "/images/tools/orbstack.webp",
      rating: 5,
      platform: "macOS",
      pricing: "freemium",
    },
    {
      name: "CleanShot",
      summary:
        "CleanShot X provides over 50 features making it the ultimate screen capturing tool.",
      link: "https://cleanshot.sjv.io/9LxN54",
      icon: "/images/tools/cleanshot.webp",
      rating: 4.5,
      platform: "macOS",
      pricing: "paid",
    },
    {
      name: "Wise",
      summary:
        "Wise is a cross-border payment/transfer tool with favorable exchange rates and a user-friendly app interface.",
      link: "https://wise.com/invite/ihpc/1q2ntua",
      icon: "/images/tools/wise.webp",
      rating: 5,
      platform: "Web, iOS, Android",
      pricing: "free",
    },
    {
      name: "HTTPie",
      summary:
        "HTTPie is a command-line HTTP client that makes APIs simple and intuitive.",
      link: "https://httpie.io",
      icon: "/images/tools/httpie.webp",
      rating: 4.5,
      platform: "Desktop, Web",
      pricing: "free",
    },
    {
      name: "Shots",
      summary:
        "Shots helps you create beautiful presentations from screen captures.",
      link: "https://shots.so",
      icon: "/images/tools/shots.webp",
      rating: 4.5,
      platform: "Web",
      pricing: "free",
    },
    {
      name: "TablePlus",
      summary: "TablePlus is a powerful GUI tool for database management.",
      link: "https://tableplus.com",
      icon: "/images/tools/tableplus.webp",
      rating: 4,
      platform: "Desktop, iOS",
      pricing: "freemium",
    },
    {
      name: "Astro",
      summary: "Astro is an ASO keywords tool for App Store optimization.",
      link: "https://tryastro.app?aff=kMo5R",
      icon: "/images/tools/astro.webp",
      rating: 3.5,
      platform: "macOS",
      pricing: "paid",
    },
  ],
  works: [
    {
      name: "Dippod",
      summary: "AI flashcards from topics, PDFs, and notes.",
      image: "/static/dippod.webp",
      link: "https://dippod.com",
      primary: true,
    },
    {
      name: "Echobell",
      summary: "Turn webhooks and emails into instant alerts and phone calls.",
      image: "/static/echobell.webp",
      link: "https://echobell.one",
      primary: true,
    },
    {
      name: "Spark Memos",
      summary: "Capture ideas fast with rich notes and iCloud sync.",
      image: "/static/sparkmemos.webp",
      link: "https://sparkmemos.com",
      primary: true,
    },
    {
      name: "CassetteOne",
      summary: "A retro design cassette music player for iOS.",
      image: "/static/cassette-one.webp",
      link: "https://cassette.one",
      primary: true,
    },
    {
      name: "YouminCO",
      summary: "A digital nomad community in Chinese.",
      image: "/static/youminco.webp",
      link: "https://youmin.co",
      primary: true,
    },
    {
      name: "AssisChat",
      summary: "A ChatGPT client for iOS.",
      image: "/static/assischat.webp",
      link: "https://assischat.com",
      primary: false,
    },
    {
      name: "Lofyee",
      summary: "A Lo-Fi music player for iOS.",
      image: "/static/lofyee.webp",
      link: "https://lofyee.com",
      primary: false,
    },
    {
      name: "Subject World",
      summary: "My blog to share my thoughts in Chinese.",
      image: "/static/subnooc.webp",
      link: "https://subnooc.com",
      primary: false,
    },
    {
      name: "OhMyGPT",
      summary: "Deploy your GPT app by one-click.",
      link: "https://github.com/assischat/ohmygpt",
      primary: false,
    },
    {
      name: "PH Summary",
      summary: "Product Hunt daily summary.",
      link: "https://twitter.com/ph_summary",
      primary: false,
    },
  ],
  contacts,
  social: {
    followers: "Followers",
    following: "Following",
    posts: "Posts",
    repos: "Repos",
    contributions: "Contribs/yr",
    recentActivity: "Recent activity",
    since(year: string) {
      return `since ${year}`;
    },
    emailTo: "To",
    emailHint: "Mail lands straight in my inbox.",
  },
  postAdvertisements: [
    {
      title: "Support me",
      description:
        "Echobell can convert Webhook/Email to app notifications and calls.",
      icon: "/static/echobell.webp",
      link: "https://apps.apple.com/app/apple-store/id6743597198?pt=126931111&ct=Nooc&mt=8",
    },
    {
      title: "Support me",
      description:
        "Spark Memos is a concise note-taking app for capturing ideas, inspirations, or for later reading and book notes.",
      icon: "/static/sparkmemos.webp",
      link: "https://sparkmemos.com",
    },
    {
      title: "Support me",
      description:
        "CassetteOne is a retro design cassette white noise and music player for iOS.",
      icon: "/static/cassette-one.webp",
      link: "https://cassette.one",
    },
  ],
  archive: {
    reading: [
      {
        title: "The Unbearable Lightness of Being",
        summary: "When existence is light, how should we face it?",
      },
      {
        title: "The Master and Margarita",
        summary: "What is good, and what is evil?",
      },
      { title: "Life is Elsewhere", summary: "When poetry becomes a danger." },
      {
        title: "The Neapolitan Novels",
        summary: "An epic novel about growth, friendship and love.",
      },
      {
        title: "The Brothers Karamazov",
        summary: "If we end evil by evil means, are we still good?",
      },
      {
        title: "Netochka Nezvanova",
        summary: "Some people drift further into fantasy, becoming dreamers.",
      },
      {
        title: "Strait Is the Gate",
        summary: "When faith collides with the secular world.",
      },
      {
        title: "The Death of Ivan Ilyich",
        summary: "A Tolstoy novella from his later years.",
      },
      { title: "Kon-Tiki", summary: "A wild journey to prove oneself." },
      {
        title: "The Submarine at Night",
        summary: "A short story collection in a Borges-like style.",
      },
      {
        title: "Make Something Wonderful",
        summary: "A collection of Steve Jobs' speeches and letters.",
      },
    ],
    films: [
      {
        title: "When Life Gives You Tangerines",
        summary: "A very good Korean drama.",
      },
      {
        title: "Adventure Time",
        summary: "The best way to learn English through a show.",
      },
      {
        title: "Art of the Cosmos",
        summary: "A long journey to the West seeking truth.",
      },
      {
        title: "Monster",
        summary: "A work by one of my favorite directors, Hirokazu Kore-eda.",
      },
      {
        title: "The Simpsons",
        summary: "Re-watching this animation that's older than me.",
      },
      {
        title: "The Long Season",
        summary: "My favorite Chinese drama in recent years.",
      },
      {
        title: "Deep Sea",
        summary: "Childlike wonder — I love this colorful art style.",
      },
    ],
    music: [
      {
        title: "Sunset Rollercoaster",
        summary: "A band with a strong vibe, perfect for vibe coding.",
      },
      {
        title: "Chen Jingfei",
        summary:
          "Retro tunes and vocals paired with not monotonous arrangements.",
      },
      {
        title: "Low Roar",
        summary: "Ethereal and lonely sounds from Iceland.",
      },
      {
        title: "Hedgehog",
        summary: "Somehow manages to move me.",
      },
      {
        title: "Sufjan Stevens",
        summary: "Gentle and full of stories.",
      },
      {
        title: "The Chairs",
        summary: "Soft and flowing vocals and lyrics.",
      },
    ],
  },
  aboutContent: `
This is the corner of [Nooc](https://nooc.me).

Updated irregularly, sharing random thoughts, reading notes, and daily ramblings — but anything could appear.

### About Me

My online name is Nooc — not a real word, no special meaning. Like myself, not so conventional, and not seeking worldly definitions.

Active on [Twitter](https://twitter.com/noobnooc), often sharing unfiltered thoughts. You can also reach me on [Telegram](https://t.me/noobnooc) or email [nooc@nooc.me](mailto:nooc@nooc.me).

Thanks to quantum mechanics, I was born somewhere between 1996 and 1997. An ordinary guy with nothing but dreams. I dream of becoming a nomad and traveling the world someday.

Since I can't be a physical carpenter, but love the "design → build → polish → ship" workflow, I call myself a digital carpenter. Hopefully one day I can make things I enjoy in the virtual world that also bring a smile to others.

My biggest hobby is starting things and never finishing them. I've tried drawing, video editing, photography, and MIDI — none stuck. The things I've consistently done are eating, sleeping, reading novels, and writing code. Hopefully writing will join the list.

I enjoy unique foods like houttuynia with cilantro, cold shredded potatoes, and various inventive concoctions.

I usually sleep between midnight and 8 AM in UTC+8.

Favorite authors include Márquez, Calvino, Wang Xiaobo, Woolf, Murakami, Mo Yan, Liu Liangcheng, and more. Some I've been meaning to read but haven't yet: Dostoevsky, Saramago, Proust, Vonnegut. Someday I'll enter their worlds.

I mainly write JavaScript/TypeScript, React/Next.js, Swift/SwiftUI — with a preference for Serverless.

When listening to music, I prefer random shuffle. I can never tell genres apart. Country, pop, rock, folk, blues? Not sure. Chinese, Japanese, vocal, instrumental, wild, quiet — I listen to everything.

If you like any of Jiang Wen, Wong Kar-wai, Hirokazu Kore-eda, Takeshi Kitano, Edward Yang, or Huang Xingyao — we're friends.

That's about it~
  `,
};

export default dictionary;

export type Dictionary = typeof dictionary;
