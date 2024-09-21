import { CameraIcon, EnvelopeIcon } from "@heroicons/react/24/solid";
import {
  SiBlender,
  SiGithub,
  SiNintendoswitch,
  SiSketch,
  SiSwift,
  SiTypescript,
  SiX,
} from "@icons-pack/react-simple-icons";

import AssisChat from "../public/static/assischat.webp";
import lofyee from "../public/static/lofyee.webp";
import subnooc from "../public/static/subnooc.webp";
import youminco from "../public/static/youminco.webp";
import SparkMemosLogo from '../public/static/sparkmemos.webp';
import CassetteOneLogo from '../public/static/cassette-one.webp';

const dictionary = {
  meta: {
    baseUrl: "https://nooc.me",
    websiteName: "Nooc 的主页",
    motto: "游离于存在与虚无间的理想主义者",
    bio: `
一个人。

男的,
喜欢看书听歌写代码。

听歌喜欢电台随机;
电影喜欢追着导演看;
看书偏爱小说，有时也看哲史;
游戏喜欢买但不爱玩。

尝试过学画画;
也买过 MIDI 键盘;
但仅此而已。

偏爱泛客户端开发;
Serverless 爱好者。
    `,
    fillKeywords(keywords?: string[]): string[] {
      return [
        "Nooc",
        "noobnooc",
        "noocink",
        "nookinc",
        "Nooc 的个人主页",
        "个人主页",
        "个人网站",
        "独立博客",
        "独立开发",
        "Bento",
        ...(keywords ?? []),
      ];
    },
  },
  urls: {
    home: "/zh",
    works: "/zh/works",
    posts: "/zh/posts",

    shareToX(title: string, postLink: string) {
      return `https://twitter.com/share?text=${encodeURIComponent(
        `我正在看「${title}」 @noobnooc`,
      )}&url=${encodeURIComponent(`https://nooc.me${postLink}`)}`;
    },
  },
  labels: {
    home: "主页",
    works: "作品",
    posts: "博客",
    noocWorks: "Nooc的作品",
    doing: "在做什么",
    playing: "在玩什么",
    contactMe: "联系我",
    toc: "目录",
    categories: "分类",
    shareTo: "分享到：",
    subnooc: "主观世界",
    icon(label: string) {
      return `${label}的图标`;
    },
  },
  playingItems: [
    {
      name: "TypeScript",
      icon: SiTypescript,
      summary:
        "最常使用的编程语言, 常搭配使用的有 Node / React / Tailwind 等。",
      color: "blue",
    },
    {
      name: "Swift",
      icon: SiSwift,
      summary:
        "最近在学习苹果生态的程序设计, 常搭配使用的有 SwiftUI / Combine 。",
      color: "amber",
    },
    {
      name: "Sketch",
      icon: SiSketch,
      summary: "偶尔也弄弄设计, 但不太熟。现在用 Figma 比较多。",
      color: "yellow",
    },
    {
      name: "Blender",
      icon: SiBlender,
      summary: "尝试学习过很多次, 每次都是照着教程弄一遍就放弃了。",
      color: "orange",
    },
    {
      name: "Switch",
      icon: SiNintendoswitch,
      summary: "有一台 Switch, 但上面很多灰, 还有一台灰更多的 PS4 。",
      color: "rose",
    },
    {
      name: "摄影",
      icon: CameraIcon,
      summary: "有一台 Sony a7c, 但不知道电池还有没有电。",
      color: "cyan",
    },
  ],
  works: [
    {
      name: "星火记",
      summary: "一个简洁的短笔记应用",
      image: SparkMemosLogo,
      link: "https://apps.apple.com/cn/app/spark-memos-inspiration/id6480926767?platform=ipad",
      color: "orange",
      primary: true,
    },
    {
      name: "CassetteOne",
      summary: "一个模拟磁带机设计的复古风格白噪音和音乐播放器。",
      image: CassetteOneLogo,
      link: "https://cassette.one",
      color: "orange",
      primary: true,
    },
    {
      name: "游民CO",
      summary: "数字游民资讯网站",
      image: youminco,
      link: "https://youmin.co",
      color: "blue",
      primary: true,
    },
    {
      name: "AssisChat",
      summary: "ChatGPT 客户端",
      image: AssisChat,
      link: "https://assischat.com",
      color: "green",
      primary: false,
    },
    {
      name: "Lofyee",
      summary: "Lo-Fi 音乐播放器",
      image: lofyee,
      link: "https://lofyee.com",
      color: "rose",
      primary: false,
    },
    {
      name: "主观世界",
      summary: "分享我思考的博客",
      image: subnooc,
      link: "https://subnooc.com",
      color: "red",
      primary: true,
    },
    {
      name: "OhMyGPT",
      summary: "一键部署自己 ChatGPT 应用",
      link: "https://github.com/assischat/ohmygpt",
      color: "green",
      primary: false,
    },
    {
      name: "PH Summary",
      summary: "Product Hunt 每日摘要",
      link: "https://twitter.com/ph_summary",
      color: "orange",
      primary: false,
    },
  ],
  contacts: [
    {
      label: "X (中文)",
      name: "@noobnooc",
      link: "https://x.com/noobnooc",
      icon: SiX,
    },
    {
      label: "X (English)",
      name: "@WeeloneHQ",
      link: "https://x.com/WeeLoneHQ",
      icon: SiX,
    },
    {
      label: "GitHub",
      name: "@noobnooc",
      link: "https://github.com/noobnooc",
      icon: SiGithub,
    },
    {
      label: "邮箱",
      name: "nooc@nooc.me",
      link: "mailto:nooc@nooc.me",
      icon: EnvelopeIcon,
    },
  ],
  postAdvertisements: [
    {
      title: "支持我",
      description: "「星火记」是一个简洁的短笔记应用，可以用来记录灵感、想法，或者是用于稍后阅读、读书笔记等。",
      icon: SparkMemosLogo,
      link: "https://sparkmemos.com",
    },
    {
      title: "支持我",
      description: "「CassetteOne」是一个模拟磁带机设计的复古风格白噪音和音乐播放器。",
      icon: CassetteOneLogo,
      link: "https://cassette.one",
    }
  ],
};

export default dictionary;
