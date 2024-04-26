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
import SparkMemosLogo from '../public/sparkmemos.webp';

const dictionary = {
  meta: {
    baseUrl: "https://nooc.me",
    websiteName: "Nooc the Noob",
    motto: "A noob named Nooc.",
    bio: `
A person.

Male.
Reading, music, and coding.
Random stations for music.
Follows directors for movies.
Prefers novels for reading,
also philosophy and history.
Buys games but doesn't play.

Tried learning to draw,
bought a MIDI keyboard, 
but that's all about it.

Client development.
A fan of Serverless.
    `,
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

    shareToX(title: string, postLink: string) {
      return `https://twitter.com/share?text=${encodeURIComponent(
        `I am reading ${title.toLocaleUpperCase()} @noobnooc`,
      )}&url=${encodeURIComponent(`https://nooc.me${postLink}`)}`;
    },
  },
  labels: {
    home: "Home",
    works: "Works",
    posts: "Blog",
    noocWorks: "Nooc's Works",
    doing: "Doing",
    playing: "Playing",
    friends: "Friends",
    contactMe: "Contact Me",
    toc: "Table of Contents",
    categories: "Categories",
    shareTo: "Share to: ",
    subnooc: "Subjective Nooc",
    icon(label: string) {
      return `Icon for ${label}`;
    },
  },
  playingItems: [
    {
      name: "TypeScript",
      icon: SiTypescript,
      summary:
        "My most commonly used programming language, often used with Node / React / Tailwind, etc.",
      color: "blue",
    },
    {
      name: "Swift",
      icon: SiSwift,
      summary:
        "Recently learning Apple's ecosystem programming, commonly used with SwiftUI.",
      color: "amber",
    },
    {
      name: "Sketch",
      icon: SiSketch,
      summary:
        "Occasionally dabble in design, but not very proficient. Now using Figma more often.",
      color: "yellow",
    },
    {
      name: "Blender",
      icon: SiBlender,
      summary:
        "Tried learning many times, but always gave up after following tutorials.",
      color: "orange",
    },
    {
      name: "Switch",
      icon: SiNintendoswitch,
      summary:
        "I have a Switch, but it has a lot of dust on it, and I also have a PS4 with even more dust.",
      color: "rose",
    },
    {
      name: "Photography",
      icon: CameraIcon,
      summary:
        "I have a Sony a7c, but I don't know if the battery still has power.",
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
      name: "Spark Memos",
      summary: "A simple short-note-taking app.",
      image: SparkMemosLogo,
      link: "https://sparkmemos.com",
      color: "orange",
      primary: true,
    },
    {
      name: "YouminCO",
      summary: "A digital nomad community in Chinese.",
      image: youminco,
      link: "https://youmin.co",
      color: "blue",
      primary: true,
    },
    {
      name: "AssisChat",
      summary: "A ChatGPT client for iOS.",
      image: AssisChat,
      link: "https://assischat.com",
      color: "green",
      primary: false,
    },
    {
      name: "Lofyee",
      summary: "A Lo-Fi music player for iOS.",
      image: lofyee,
      link: "https://lofyee.com",
      color: "rose",
      primary: true,
    },
    {
      name: "Subject World",
      summary: "My blog to share my thoughts in Chinese.",
      image: subnooc,
      link: "https://subnooc.com",
      color: "red",
      primary: true,
    },
    {
      name: "OhMyGPT",
      summary: "Deploy your GPT app by one-click.",
      link: "https://github.com/assischat/ohmygpt",
      color: "green",
      primary: false,
    },
    {
      name: "PH Summary",
      summary: "Product Hunt daily summary.",
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
      label: "Email",
      name: "nooc@nooc.me",
      link: "mailto:nooc@nooc.me",
      icon: EnvelopeIcon,
    },
  ],
};

export default dictionary;
