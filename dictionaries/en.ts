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
      name: "CassetteOne",
      summary: "A retro design cassette music player for iOS.",
      image: CassetteOneLogo,
      link: "https://cassette.one",
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
      primary: false,
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
  postAdvertisements:[
    {
      title: "Support me",
      description: "Spark Memos is a concise note-taking app for capturing ideas, inspirations, or for later reading and book notes.",
      icon: SparkMemosLogo,
      link: "https://sparkmemos.com",
    },
    {
      title: "Support me",
      description: "CassetteOne is a retro design cassette white noise and music player for iOS.",
      icon: CassetteOneLogo,
      link: "https://cassette.one",
    },
  ],
};

export default dictionary;
