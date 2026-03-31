export interface ResumeContact {
  kind: "website" | "email" | "github";
  label: string;
  value: string;
  href: string;
}

export interface ResumePreferenceGroup {
  kind: "cities" | "industries" | "roles";
  label: string;
  items: string[];
}

export interface ResumeProject {
  name: string;
  note?: string;
  href?: string;
  description: string;
  stack: string[];
}

export interface ResumeExperience {
  role: string;
  organization: string;
  location?: string;
  period: string;
  summary: string;
  projects: ResumeProject[];
}

export interface ResumeSkillGroup {
  label: string;
  items: string[];
}

export interface ResumeEducation {
  school: string;
  degree: string;
  location: string;
  period: string;
}

export interface ResumeContent {
  pageTitle: string;
  name: string;
  summary: string;
  imageDescription: string;
  highlights: string[];
  sectionLabels: {
    preferences: string;
    experience: string;
    skills: string;
    education: string;
  };
  contacts: ResumeContact[];
  preferenceGroups: ResumePreferenceGroup[];
  experiences: ResumeExperience[];
  skillGroups: ResumeSkillGroup[];
  education: ResumeEducation;
}

export const resumeContent = {
  zh: {
    pageTitle: "简历",
    name: "李志青 / Nooc",
    summary:
      "初中开始了解代码，大学学了计算机科学与技术专业，毕业后一直从事 web 前后端开发相关工作；做过 Web 端 SaaS、iOS 应用、Electron 桌面端应用；用过 TypeScript、Next.js、SwiftUI、Electron、MongoDB、Docker 等相关技术和工具；热衷于探索 AI 编程，尝试过使用 AI 不写一行代码做出完整产品；",
    imageDescription:
      "Web 开发者，做过 SaaS、iOS 和 Electron 产品，常用 Codex、Claude Code、TypeScript、Next.js 和 SwiftUI。",
    highlights: [],
    sectionLabels: {
      preferences: "求职偏好",
      experience: "工作经历",
      skills: "技能",
      education: "教育",
    },
    contacts: [
      {
        kind: "website",
        label: "网站",
        value: "nooc.me",
        href: "https://nooc.me",
      },
      {
        kind: "email",
        label: "邮箱",
        value: "nooc@nooc.me",
        href: "mailto:nooc@nooc.me",
      },
      {
        kind: "github",
        label: "GitHub",
        value: "github.com/noobnooc",
        href: "https://github.com/noobnooc",
      },
    ],
    preferenceGroups: [
      {
        kind: "cities",
        label: "偏好城市",
        items: ["深圳", "成都", "杭州", "上海"],
      },
      {
        kind: "industries",
        label: "行业偏好",
        items: ["AI", "互联网", "影视", "音乐", "教育"],
      },
      {
        kind: "roles",
        label: "偏好职位",
        items: ["Web 前端开发", "Web 全栈开发", "群众演员"],
      },
    ],
    experiences: [
      {
        role: "独立开发",
        organization: "个人项目",
        period: "2022 - 现在",
        summary: "自己在折腾独立开发，主要聚焦于 iOS 端应用和网站应用。",
        projects: [
          {
            name: "回声铃",
            note: "echobell.one",
            href: "https://echobell.one",
            description: "通过 Webhook / Email 向手机发送通知或电话提醒。",
            stack: ["Swift", "TypeScript", "Cloudflare"],
          },
          {
            name: "Dippod",
            note: "dippod.com",
            href: "https://dippod.com",
            description:
              "将任何内容转成清晰、结构化的知识点，帮助你快速学习，并在合适的时间复习。",
            stack: ["TypeScript", "Next.js"],
          },
          {
            name: "星火记",
            note: "sparkmemos.com",
            href: "https://sparkmemos.com",
            description: "iOS 端本地优先的短笔记应用。",
            stack: ["Swift", "SwiftUI"],
          },
          {
            name: "CassetteOne",
            note: "cassette.one",
            href: "https://cassette.one",
            description: "iOS 端磁带机风格的白噪音 / 音乐播放器。",
            stack: ["Swift", "SwiftUI"],
          },
          {
            name: "游民 CO",
            note: "youmin.co",
            href: "https://youmin.co",
            description: "数字游民线上社区。",
            stack: ["TypeScript", "Next.js", "Cloudflare"],
          },
          {
            name: "onei.ai",
            href: "https://onei.ai",
            description: "AI 导航网站。",
            stack: ["TypeScript", "Next.js", "Cloudflare"],
          },
        ],
      },
      {
        role: "Web 前端工程师",
        organization: "成都木帆科技有限公司",
        location: "成都",
        period: "2018 - 2022",
        summary:
          "参与公司的 Web 前后端程序开发，也简单接触过 iOS 和 Android 端应用开发。",
        projects: [
          {
            name: "Makeflow",
            note: "makeflow.com",
            href: "https://makeflow.com",
            description:
              "基于流程的项目协作工具，参与 Web 前后端开发、移动端应用包装与线上部署。",
            stack: ["TypeScript", "React", "MongoDB"],
          },
          {
            name: "Todostack",
            description:
              "键盘友好的桌面端 Todo 应用，可在线分配任务给其他用户，独立完成桌面端和后端的需求开发与部署。",
            stack: ["TypeScript", "React", "Electron", "MongoDB"],
          },
          {
            name: "饭碗警告",
            note: "fwalert.com",
            href: "https://fwalert.com",
            description:
              "通过 Webhook / Email 向用户发送电话、短信等通知，独立完成大部分需求开发，并完成 iOS / Android 端应用开发。",
            stack: ["TypeScript", "React", "Swift", "Kotlin", "MongoDB"],
          },
          {
            name: "盯梢",
            note: "dingshao.cn",
            href: "https://dingshao.cn",
            description:
              "社区驱动的消息推送平台，参与 Web 前后端开发与移动端应用包装。",
            stack: ["TypeScript", "React", "Capacitor", "MongoDB"],
          },
        ],
      },
    ],
    skillGroups: [
      {
        label: "常用",
        items: [
          "TypeScript",
          "React",
          "Next.js",
          "Swift",
          "SwiftUI",
          "Cloudflare",
          "GitHub",
        ],
      },
      {
        label: "用过",
        items: ["Docker", "Figma", "Electron", "MongoDB"],
      },
      {
        label: "了解",
        items: ["Kotlin", "Go"],
      },
    ],
    education: {
      school: "四川理工学院",
      degree: "本科学士",
      location: "四川",
      period: "2014 - 2018",
    },
  },
  en: {
    pageTitle: "Resume",
    name: "Li Zhiqing / Nooc",
    summary:
      "I started learning about code in middle school, majored in Computer Science and Technology in college, and have been working on web frontend and backend development since graduation. I have built web SaaS products, iOS apps, and Electron desktop apps, and have worked with technologies and tools such as TypeScript, Next.js, SwiftUI, Electron, MongoDB, and Docker. I am enthusiastic about exploring AI-assisted programming and have even tried building complete products with AI without writing a single line of code.",
    imageDescription:
      "Web developer building SaaS, iOS, and Electron products with Codex, Claude Code, TypeScript, Next.js, and SwiftUI.",
    highlights: [],
    sectionLabels: {
      preferences: "Preferences",
      experience: "Experience",
      skills: "Skills",
      education: "Education",
    },
    contacts: [
      {
        kind: "website",
        label: "Website",
        value: "nooc.me",
        href: "https://nooc.me",
      },
      {
        kind: "email",
        label: "Email",
        value: "nooc@nooc.me",
        href: "mailto:nooc@nooc.me",
      },
      {
        kind: "github",
        label: "GitHub",
        value: "github.com/noobnooc",
        href: "https://github.com/noobnooc",
      },
    ],
    preferenceGroups: [
      {
        kind: "cities",
        label: "Preferred Cities",
        items: ["Shenzhen", "Chengdu", "Hangzhou", "Shanghai"],
      },
      {
        kind: "industries",
        label: "Preferred Industries",
        items: ["AI", "Internet", "Film & TV", "Music", "Education"],
      },
      {
        kind: "roles",
        label: "Preferred Roles",
        items: [
          "Web Frontend Developer",
          "Web Full-stack Developer",
          "Background Actor",
        ],
      },
    ],
    experiences: [
      {
        role: "Independent Developer",
        organization: "Personal Projects",
        period: "2022 - Present",
        summary:
          "Working on independent products, mainly focused on iOS apps and web applications.",
        projects: [
          {
            name: "Echobell",
            note: "echobell.one",
            href: "https://echobell.one",
            description:
              "Sends notifications or phone reminders to mobile devices through Webhook / Email.",
            stack: ["Swift", "TypeScript", "Cloudflare"],
          },
          {
            name: "Dippod",
            note: "dippod.com",
            href: "https://dippod.com",
            description:
              "Turn anything into clear, structured knowledge points. Learn them fast and review them at the right time.",
            stack: ["TypeScript", "Next.js"],
          },
          {
            name: "Spark Memos",
            note: "sparkmemos.com",
            href: "https://sparkmemos.com",
            description: "A local-first short notes app for iOS.",
            stack: ["Swift", "SwiftUI"],
          },
          {
            name: "CassetteOne",
            note: "cassette.one",
            href: "https://cassette.one",
            description:
              "A cassette-style white noise and music player for iOS.",
            stack: ["Swift", "SwiftUI"],
          },
          {
            name: "Youmin CO",
            note: "youmin.co",
            href: "https://youmin.co",
            description: "An online community for digital nomads.",
            stack: ["TypeScript", "Next.js", "Cloudflare"],
          },
          {
            name: "onei.ai",
            href: "https://onei.ai",
            description: "An AI directory website.",
            stack: ["TypeScript", "Next.js", "Cloudflare"],
          },
        ],
      },
      {
        role: "Web Frontend Engineer",
        organization: "Chengdu Mufan Tech",
        location: "Chengdu",
        period: "2018 - 2022",
        summary:
          "Worked on web frontend and backend development, with some exposure to iOS and Android app development.",
        projects: [
          {
            name: "Makeflow",
            note: "makeflow.com",
            href: "https://makeflow.com",
            description:
              "A workflow-based project collaboration tool. Contributed to the web frontend/backend, mobile packaging, and production deployment.",
            stack: ["TypeScript", "React", "MongoDB"],
          },
          {
            name: "Todostack",
            description:
              "A keyboard-friendly desktop Todo app with online task assignment. Built the desktop app features and backend requirements independently.",
            stack: ["TypeScript", "React", "Electron", "MongoDB"],
          },
          {
            name: "FWAlert",
            note: "fwalert.com",
            href: "https://fwalert.com",
            description:
              "A notification product that sends phone calls, SMS, and other alerts through Webhook / Email. Delivered most of the feature work and built the iOS / Android apps.",
            stack: ["TypeScript", "React", "Swift", "Kotlin", "MongoDB"],
          },
          {
            name: "Dingshao",
            note: "dingshao.cn",
            href: "https://dingshao.cn",
            description:
              "A community-driven push notification platform. Contributed to the web frontend/backend and mobile app packaging.",
            stack: ["TypeScript", "React", "Capacitor", "MongoDB"],
          },
        ],
      },
    ],
    skillGroups: [
      {
        label: "Used Often",
        items: [
          "TypeScript",
          "React",
          "Next.js",
          "Swift",
          "SwiftUI",
          "Cloudflare",
          "GitHub",
        ],
      },
      {
        label: "Worked With",
        items: ["Docker", "Figma", "Electron", "MongoDB"],
      },
      {
        label: "Familiar With",
        items: ["Kotlin", "Go"],
      },
    ],
    education: {
      school: "Sichuan University of Science and Engineering",
      degree: "Bachelor's Degree",
      location: "Sichuan",
      period: "2014 - 2018",
    },
  },
} satisfies Record<"zh" | "en", ResumeContent>;
