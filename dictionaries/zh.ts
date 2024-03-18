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

import avatar from "../public/avatar.png";
import blankAvatar from "../public/avatars/blank.jpeg";
import jiaZombieAvatar from "../public/avatars/jiazombie.png";
import liunengAvatar from "../public/avatars/liuneng.jpg";
import pilotAvatar from "../public/avatars/pilot.jpg";
import gartnerAvatar from "../public/avatars/gartner.jpg";
import anonymousAvatar from "../public/avatars/anonymous.jpeg";
import xiaochengAvatar from "../public/avatars/xiaocheng.jpg";
import changefengAvatar from "../public/avatars/changfeng.jpg";
import yinAvatar from "../public/avatars/yin.jpg";
import kuiziAvatar from "../public/avatars/kuizi.jpeg";
import xiaoshuiAvatar from "../public/avatars/xiaoshui.jpg";

import AssisChat from "../public/assischat.png";
import lofyee from "../public/lofyee.png";
import subnooc from "../public/subnooc.png";
import quwu from "../public/quwu.png";
import youminco from "../public/youminco.png";

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
    writing: "在写什么",
    friends: "他们说",
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
  friendComments: [
    {
      name: "Blank",
      comment:
        "天啊，这么精致的小男生如果还是单身那我觉得你附近的女孩子都得去看眼科",
      avatar: blankAvatar,
      color: "neutral",
      link: "https://twitter.com/B58B30/status/1681495228484829184?s=20",
    },
    {
      name: "Gartner",
      comment: "地球没了你，太阳照常升起。",
      avatar: gartnerAvatar,
      color: "cyan",
      link: "https://twitter.com/gartner_feel/status/1681560096336396291?s=20",
    },
    {
      name: "象牙山刘能",
      comment: "洛阳亲友如相问，一支红杏出墙来。",
      avatar: liunengAvatar,
      color: "yellow",
      link: "https://twitter.com/disksing/status/1681508115861344256?s=20",
    },
    {
      name: "象牙山小成",
      comment: "不认识，路过",
      avatar: xiaochengAvatar,
      color: "pink",
      link: "https://twitter.com/heavenclouder/status/1681552028634599424?s=20",
    },
    {
      name: "巧月长风📷",
      comment: "我爱你",
      avatar: changefengAvatar,
      color: "teal",
      link: "https://v.douyin.com/iXoWRJq/",
    },
    {
      name: "假僵尸",
      comment: "皆九年之学，论秀，吾不及汝",
      avatar: jiaZombieAvatar,
      color: "green",
      link: "https://github.com/JiaZombie",
    },
    {
      name: "机长",
      comment: "成都不能没有你，就像西方不能没有耶路撒冷",
      avatar: pilotAvatar,
      color: "neutral",
    },
    {
      name: "不愿透露姓名的王先生",
      comment: "孩子是无辜的，为了孩子，回来吧。",
      avatar: anonymousAvatar,
      color: "red",
    },
    {
      name: "Nooc",
      comment: "你们在说什么。。。",
      avatar: avatar,
      color: "blue",
    },
    {
      name: "尹某人",
      comment: "做专利嘛？做商标嘛？做版权嘛？做软著嘛？找我",
      avatar: yinAvatar,
      color: "teal",
    },
    {
      name: "单向葵子",
      comment: "没有本人照片 不太满意",
      avatar: kuiziAvatar,
      color: "yellow",
      link: "https://www.xiaohongshu.com/user/profile/62977c720000000021023521?xhsshare=CopyLink&appuid=60eb1d4000000000010063aa&apptime=1689754577",
    },
    {
      name: "小水",
      comment: "很会伪装的梅林",
      avatar: xiaoshuiAvatar,
      color: "pink",
    },
  ],
  works: [
    {
      name: "游民CO",
      summary: "数字游民资讯网站",
      image: youminco,
      link: "https://youmin.co",
      color: "blue",
      primary: true,
    },
    {
      name: "趣物",
      summary: "收集有趣物品的网站",
      image: quwu,
      link: "https://quwu.io",
      color: "amber",
      primary: true,
    },
    {
      name: "AssisChat",
      summary: "ChatGPT 客户端",
      image: AssisChat,
      link: "https://assischat.com",
      color: "green",
      primary: true,
    },
    {
      name: "Lofyee",
      summary: "Lo-Fi 音乐播放器",
      image: lofyee,
      link: "https://lofyee.com",
      color: "rose",
      primary: true,
    },
    {
      name: "主观世界",
      summary: "分享我思考的博客",
      image: subnooc,
      link: "https://subnooc.com",
      color: "red",
      primary: false,
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
};

export default dictionary;
