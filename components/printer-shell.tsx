"use client";

import Link from "next/link";
import Image from "next/image";
import avatar from "../public/static/avatar.webp";
import { usePathname, useRouter } from "next/navigation";
import classNames from "classnames";
import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import RotaryDial from "./rotary-dial";
import {
  RiComputerLine as ComputerDesktopIcon,
  RiMoonLine as MoonIcon,
  RiSunLine as SunIcon,
} from "@remixicon/react";
/**
 * Generate random keyframes that simulate a subtle printer paper-jam stutter.
 * Only the top portion of the paper slides in (small fixed px offset),
 * with minor speed variations to hint at the mechanical feel.
 */
const FEED_PX = 60; // how many pixels the paper slides down

function generatePaperFeedKeyframes(): { offset: number; transform: string; easing: string }[] {
  const keyframes: { offset: number; transform: string; easing: string }[] = [];

  // Start: paper shifted up by FEED_PX
  keyframes.push({ offset: 0, transform: `translateY(-${FEED_PX}px)`, easing: "ease-out" });

  // 2-3 subtle stutter points
  const stutterCount = 2 + Math.floor(Math.random() * 2);
  const offsets: number[] = [];
  for (let i = 0; i < stutterCount; i++) {
    offsets.push(0.15 + Math.random() * 0.6);
  }
  offsets.sort((a, b) => a - b);

  for (const offset of offsets) {
    const linearPx = FEED_PX * (1 - offset); // remaining distance
    const jitter = (Math.random() - 0.4) * 8; // small random deviation
    const y = -Math.max(0, Math.min(FEED_PX, linearPx + jitter));
    const easings = ["ease-in", "ease-out", "ease-in-out", "linear"];
    const easing = easings[Math.floor(Math.random() * easings.length)];
    keyframes.push({ offset, transform: `translateY(${y}px)`, easing });
  }

  // End: paper at rest
  keyframes.push({ offset: 1, transform: "translateY(0px)", easing: "ease-out" });

  return keyframes;
}

/**
 * Compute a negative animation-delay so a CSS animation stays in sync with
 * wall-clock time across re-mounts (prevents the indicator light from
 * visually resetting every time the component re-renders).
 */
function useSyncedAnimationDelay(durationMs: number) {
  const [delay, setDelay] = useState("0ms");

  useEffect(() => {
    const elapsed = Date.now() % durationMs;
    setDelay(`-${elapsed}ms`);
  }, [durationMs]);

  return delay;
}

/**
 * Hook: animate the paper element on every pathname change.
 * On a language switch the entire component tree remounts (because <html lang>
 * changes), so prevPathRef would be initialised to the CURRENT pathname and the
 * "skip initial mount" guard would swallow the animation.  We use a sessionStorage
 * flag written just before navigation to detect this case.
 */
const LANG_SWITCH_KEY = '__printer_lang_switch__';
const LANGUAGE_DIAL_ANIMATION_MS = 220;

function usePaperFeedAnimation() {
  const pathname = usePathname();
  const paperRef = useRef<HTMLDivElement>(null);
  const prevPathRef = useRef(pathname);
  const isLangSwitch = useRef(false);

  // On mount, check if we arrived via a language switch
  useEffect(() => {
    try {
      if (sessionStorage.getItem(LANG_SWITCH_KEY)) {
        isLangSwitch.current = true;
        sessionStorage.removeItem(LANG_SWITCH_KEY);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const el = paperRef.current;
    if (!el) return;

    // Skip animation on true initial page load (not a language switch remount)
    if (prevPathRef.current === pathname && !isLangSwitch.current) return;
    prevPathRef.current = pathname;
    isLangSwitch.current = false;

    const kf = generatePaperFeedKeyframes();
    const duration = 350 + Math.random() * 200; // 350-550ms, snappy

    const animation = el.animate(
      kf.map(({ offset, transform }) => ({ offset, transform })),
      {
        duration,
        easing: "linear",
        fill: "backwards",
      },
    );

    return () => animation.cancel();
  }, [pathname]);

  return paperRef;
}
type ColorMode = "system" | "light" | "dark";
type ResolvedColorMode = "light" | "dark";

function parseColorMode(value: string | null): ColorMode {
  return value === "system" || value === "light" || value === "dark" ? value : "system";
}

function useColorMode(initialMode: ColorMode) {
  const [mode, setMode] = useState<ColorMode>(() => {
    if (typeof window === "undefined") return initialMode;

    const domMode = document.documentElement.dataset.colorMode;
    if (domMode) return parseColorMode(domMode);

    try {
      const rawStored = localStorage.getItem("color-mode");
      if (rawStored !== null) return parseColorMode(rawStored);
    } catch {}

    return initialMode;
  });
  const [resolvedMode, setResolvedMode] = useState<ResolvedColorMode>(() => {
    if (typeof window === "undefined") return initialMode === "dark" ? "dark" : "light";
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  });

  const apply = useCallback((m: ColorMode): ResolvedColorMode => {
    const root = document.documentElement;
    const isDark =
      m === "dark" || (m === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    root.classList.toggle("dark", isDark);
    return isDark ? "dark" : "light";
  }, []);

  const persistColorMode = useCallback((modeValue: ColorMode, resolved: ResolvedColorMode) => {
    try {
      document.cookie = `color-mode=${modeValue}; path=/; max-age=31536000; samesite=lax`;
      document.cookie = `resolved-color-mode=${resolved}; path=/; max-age=31536000; samesite=lax`;
    } catch {}
  }, []);

  useLayoutEffect(() => {
    const resolved = apply(mode);
    setResolvedMode(resolved);
    persistColorMode(mode, resolved);

    if (mode === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => {
        const nextResolved = apply("system");
        setResolvedMode(nextResolved);
        persistColorMode("system", nextResolved);
      };
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, [mode, apply, persistColorMode]);

  useLayoutEffect(() => {
    try {
      const rawStored = localStorage.getItem("color-mode");
      const stored = rawStored === null ? initialMode : parseColorMode(rawStored);
      setMode((current) => (current === stored ? current : stored));
      document.documentElement.dataset.colorMode = stored;
      return;
    } catch {}

    document.documentElement.dataset.colorMode = initialMode;
    setMode((current) => (current === initialMode ? current : initialMode));
  }, [initialMode]);

  const setColorMode = useCallback((next: ColorMode) => {
    setMode(next);
    try {
      localStorage.setItem("color-mode", next);
    } catch {}
    document.documentElement.dataset.colorMode = next;
    const resolved = apply(next);
    setResolvedMode(resolved);
    persistColorMode(next, resolved);
  }, [apply, persistColorMode]);

  return { mode, resolvedMode, setColorMode };
}

type StickerId = "github" | "docker" | "typescript" | "swift" | "cloudflare";

interface StickerDefinition {
  id: StickerId;
  label: string;
  width: number;
  height: number;
  rotation: number;
  color: string;
  darkColor?: string;
  /** SVG path d attribute from Simple Icons (viewBox 0 0 24 24) */
  svgPath: string;
  /**
   * How the white sticker backing is drawn:
   *  - "circle"       — a simple <circle> behind the icon (e.g. GitHub)
   *  - "rounded-rect" — a <rect rx> behind the icon (e.g. TypeScript, Swift)
   *  - "silhouette"   — paint-order stroke expansion of the icon path (e.g. Docker, Cloudflare)
   */
  bgShape: "circle" | "rounded-rect" | "silhouette";
  /** Border radius for rounded-rect backgrounds (SVG units in 0-24 viewBox) */
  bgRadius?: number;
  /** Keep sticker backing white in both light and dark modes. */
  forceWhiteBg?: boolean;
  /** Hide the subtle outline around the sticker backing. */
  hideBgBorder?: boolean;
  /** Padding between backing and icon path (SVG units in 0-24 viewBox). */
  innerPadding?: number;
  /** Optional optical centering offset for icon path (SVG units). */
  iconOffsetX?: number;
  iconOffsetY?: number;
}

// SVG paths from Simple Icons (viewBox: 0 0 24 24)
const SI_PATHS: Record<StickerId, string> = {
  github: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  docker: "M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 003.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288Z",
  cloudflare: "M16.5088 16.8447c.1475-.5068.0908-.9707-.1553-1.3154-.2246-.3164-.6045-.499-1.0615-.5205l-8.6592-.1123a.1559.1559 0 0 1-.1333-.0713c-.0283-.042-.0351-.0986-.021-.1553.0278-.084.1123-.1484.2036-.1562l8.7359-.1123c1.0351-.0489 2.1601-.8868 2.5537-1.9136l.499-1.3013c.0215-.0561.0293-.1128.0147-.168-.5625-2.5463-2.835-4.4453-5.5499-4.4453-2.5039 0-4.6284 1.6177-5.3876 3.8614-.4927-.3658-1.1187-.5625-1.794-.499-1.2026.119-2.1665 1.083-2.2861 2.2856-.0283.31-.0069.6128.0635.894C1.5683 13.171 0 14.7754 0 16.752c0 .1748.0142.3515.0352.5273.0141.083.0844.1475.1689.1475h15.9814c.0909 0 .1758-.0645.2032-.1553l.12-.4268zm2.7568-5.5634c-.0771 0-.1611 0-.2383.0112-.0566 0-.1054.0415-.127.0976l-.3378 1.1744c-.1475.5068-.0918.9707.1543 1.3164.2256.3164.6055.498 1.0625.5195l1.8437.1133c.0557 0 .1055.0263.1329.0703.0283.043.0351.1074.0214.1562-.0283.084-.1132.1485-.204.1553l-1.921.1123c-1.041.0488-2.1582.8867-2.5527 1.914l-.1406.3585c-.0283.0713.0215.1416.0986.1416h6.5977c.0771 0 .1474-.0489.169-.126.1122-.4082.1757-.837.1757-1.2803 0-2.6025-2.125-4.727-4.7344-4.727",
  typescript: "M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z",
  swift: "M7.508 0c-.287 0-.573 0-.86.002-.241.002-.483.003-.724.01-.132.003-.263.009-.395.015A9.154 9.154 0 0 0 4.348.15 5.492 5.492 0 0 0 2.85.645 5.04 5.04 0 0 0 .645 2.848c-.245.48-.4.972-.495 1.5-.093.52-.122 1.05-.136 1.576a35.2 35.2 0 0 0-.012.724C0 6.935 0 7.221 0 7.508v8.984c0 .287 0 .575.002.862.002.24.005.481.012.722.014.526.043 1.057.136 1.576.095.528.25 1.02.495 1.5a5.03 5.03 0 0 0 2.205 2.203c.48.244.97.4 1.498.495.52.093 1.05.124 1.576.138.241.007.483.009.724.01.287.002.573.002.86.002h8.984c.287 0 .573 0 .86-.002.241-.001.483-.003.724-.01a10.523 10.523 0 0 0 1.578-.138 5.322 5.322 0 0 0 1.498-.495 5.035 5.035 0 0 0 2.203-2.203c.245-.48.4-.972.495-1.5.093-.52.124-1.05.138-1.576.007-.241.009-.481.01-.722.002-.287.002-.575.002-.862V7.508c0-.287 0-.573-.002-.86a33.662 33.662 0 0 0-.01-.724 10.5 10.5 0 0 0-.138-1.576 5.328 5.328 0 0 0-.495-1.5A5.039 5.039 0 0 0 21.152.645 5.32 5.32 0 0 0 19.654.15a10.493 10.493 0 0 0-1.578-.138 34.98 34.98 0 0 0-.722-.01C17.067 0 16.779 0 16.492 0H7.508zm6.035 3.41c4.114 2.47 6.545 7.162 5.549 11.131-.024.093-.05.181-.076.272l.002.001c2.062 2.538 1.5 5.258 1.236 4.745-1.072-2.086-3.066-1.568-4.088-1.043a6.803 6.803 0 0 1-.281.158l-.02.012-.002.002c-2.115 1.123-4.957 1.205-7.812-.022a12.568 12.568 0 0 1-5.64-4.838c.649.48 1.35.902 2.097 1.252 3.019 1.414 6.051 1.311 8.197-.002C9.651 12.73 7.101 9.67 5.146 7.191a10.628 10.628 0 0 1-1.005-1.384c2.34 2.142 6.038 4.83 7.365 5.576C8.69 8.408 6.208 4.743 6.324 4.86c4.436 4.47 8.528 6.996 8.528 6.996.154.085.27.154.36.213.085-.215.16-.437.224-.668.708-2.588-.09-5.548-1.893-7.992z",
};

const STICKERS: StickerDefinition[] = [
  {
    id: "github",
    label: "GitHub",
    width: 42,
    height: 42,
    rotation: -6,
    color: "#181717",
    darkColor: "#f0f6fc",
    svgPath: SI_PATHS.github,
    bgShape: "circle",
    forceWhiteBg: true,
    hideBgBorder: true,
    innerPadding: 1.6,
    iconOffsetY: -0.35,
  },
  { id: "docker", label: "Docker", width: 48, height: 38, rotation: 2, color: "#2496ED", svgPath: SI_PATHS.docker, bgShape: "silhouette" },
  { id: "cloudflare", label: "Cloudflare", width: 50, height: 38, rotation: 8, color: "#F38020", svgPath: SI_PATHS.cloudflare, bgShape: "silhouette" },
  {
    id: "typescript",
    label: "TypeScript",
    width: 38,
    height: 38,
    rotation: 4,
    color: "#3178C6",
    svgPath: SI_PATHS.typescript,
    bgShape: "rounded-rect",
    bgRadius: 2,
    forceWhiteBg: true,
    hideBgBorder: true,
    innerPadding: 1.6,
  },
  {
    id: "swift",
    label: "Swift",
    width: 38,
    height: 38,
    rotation: -5,
    color: "#F05138",
    svgPath: SI_PATHS.swift,
    bgShape: "rounded-rect",
    bgRadius: 5.5,
    forceWhiteBg: true,
    hideBgBorder: true,
    innerPadding: 1.6,
  },
];

type StickerLayout = Record<StickerId, { x: number; y: number }>;
type StickerOrder = StickerId[];

const DEFAULT_STICKER_ORDER: StickerOrder = STICKERS.map((sticker) => sticker.id);
const STICKER_STORAGE_KEY = "__printer_sticker_layout_v5__";
const STICKER_ORDER_STORAGE_KEY = "__printer_sticker_order_v1__";
let stickerLayoutMemory: StickerLayout | null = null;
let stickerOrderMemory: StickerOrder | null = null;
const STICKER_NORMALIZE_EPSILON_PX = 4;
const SHELL_BOTTOM_SECTION_HEIGHT_PX = 20;
const SHELL_BOTTOM_SAFE_GAP_PX = 2;

const STICKER_ANCHORS = [
  { x: 0.08, y: 0.14 },
  { x: 0.5, y: 0.1 },
  { x: 0.92, y: 0.14 },
  { x: 0.1, y: 0.56 },
  { x: 0.9, y: 0.56 },
];

const STICKER_BY_ID = STICKERS.reduce<Record<StickerId, StickerDefinition>>((acc, sticker) => {
  acc[sticker.id] = sticker;
  return acc;
}, {} as Record<StickerId, StickerDefinition>);

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getStickerBoundsForShell(sticker: StickerDefinition, shellWidth: number, shellHeight: number) {
  const minCenterX = sticker.width / 2;
  const maxCenterX = Math.max(minCenterX, shellWidth - sticker.width / 2);
  const minCenterY = sticker.height / 2;
  const maxCenterY = Math.max(
    minCenterY,
    shellHeight - SHELL_BOTTOM_SECTION_HEIGHT_PX - SHELL_BOTTOM_SAFE_GAP_PX - sticker.height / 2,
  );
  return { minCenterX, maxCenterX, minCenterY, maxCenterY };
}

function createRandomStickerLayout(shellRect: DOMRect): StickerLayout {
  const anchors = [...STICKER_ANCHORS];

  for (let i = anchors.length - 1; i > 0; i -= 1) {
    const swapIndex = Math.floor(Math.random() * (i + 1));
    [anchors[i], anchors[swapIndex]] = [anchors[swapIndex], anchors[i]];
  }

  const layout = {} as StickerLayout;

  for (let index = 0; index < STICKERS.length; index += 1) {
    const sticker = STICKERS[index];
    const anchor = anchors[index] ?? { x: 0.5, y: 0.5 };
    const bounds = getStickerBoundsForShell(sticker, shellRect.width, shellRect.height);
    const centerX = clamp((anchor.x + (Math.random() - 0.5) * 0.05) * shellRect.width, bounds.minCenterX, bounds.maxCenterX);
    const centerY = clamp((anchor.y + (Math.random() - 0.5) * 0.04) * shellRect.height, bounds.minCenterY, bounds.maxCenterY);
    layout[sticker.id] = {
      x: centerX,
      y: centerY,
    };
  }

  return layout;
}

function parseStickerLayout(raw: string | null): StickerLayout | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<Record<StickerId, { x: unknown; y: unknown }>>;
    const layout = {} as StickerLayout;

    for (const sticker of STICKERS) {
      const position = parsed[sticker.id];
      if (!position || typeof position.x !== "number" || typeof position.y !== "number") {
        return null;
      }

      layout[sticker.id] = {
        x: position.x,
        y: position.y,
      };
    }

    return layout;
  } catch {
    return null;
  }
}

function parseStickerOrder(raw: string | null): StickerOrder | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length !== STICKERS.length) return null;

    const seen = new Set<StickerId>();
    const order: StickerOrder = [];

    for (const value of parsed) {
      if (typeof value !== "string") return null;
      if (!(value in STICKER_BY_ID)) return null;
      const id = value as StickerId;
      if (seen.has(id)) return null;
      seen.add(id);
      order.push(id);
    }

    return order;
  } catch {
    return null;
  }
}

function moveStickerToTop(order: StickerOrder, id: StickerId): StickerOrder {
  if (order[order.length - 1] === id) return order;
  return [...order.filter((item) => item !== id), id];
}

/**
 * Render a sticker face.  The background shape depends on `sticker.bgShape`:
 *  - "circle"       — simple SVG <circle> behind the icon (GitHub).
 *  - "rounded-rect" — SVG <rect rx> behind the icon (TypeScript, Swift).
 *  - "silhouette"   — paint-order stroke expansion of the path (Docker, Cloudflare).
 */
function renderStickerFace(sticker: StickerDefinition, resolvedMode: ResolvedColorMode) {
  const useDarkIconColor = resolvedMode === "dark" && !sticker.forceWhiteBg;
  const iconColor = useDarkIconColor ? (sticker.darkColor ?? sticker.color) : sticker.color;
  const bgFill = sticker.forceWhiteBg ? "#ffffff" : (resolvedMode === "dark" ? "#171a1f" : "#ffffff");
  const borderColor = resolvedMode === "dark" ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.13)";
  const iconScale = sticker.innerPadding ? (24 - sticker.innerPadding * 2) / 24 : 1;
  const iconTransform = `translate(12 12) scale(${iconScale}) translate(-12 -12)`;
  const iconOffsetX = sticker.iconOffsetX ?? 0;
  const iconOffsetY = sticker.iconOffsetY ?? 0;
  const silhouetteStrokeWidth = 3.2;

  let bgElement: React.ReactNode = null;
  let borderElement: React.ReactNode = null;

  if (sticker.bgShape === "circle") {
    const r = 12;
    bgElement = <circle cx="12" cy="12" r={r} fill={bgFill} />;
    borderElement = (
      <circle
        cx="12"
        cy="12"
        r={r}
        fill="none"
        stroke={borderColor}
        strokeWidth={0.5}
        vectorEffect="non-scaling-stroke"
      />
    );
  } else if (sticker.bgShape === "rounded-rect") {
    const rx = sticker.bgRadius ?? 2;
    bgElement = (
      <rect
        x={0}
        y={0}
        width={24}
        height={24}
        rx={rx}
        ry={rx}
        fill={bgFill}
      />
    );
    borderElement = (
      <rect
        x={0}
        y={0}
        width={24}
        height={24}
        rx={rx}
        ry={rx}
        fill="none"
        stroke={borderColor}
        strokeWidth={0.5}
        vectorEffect="non-scaling-stroke"
      />
    );
  } else {
    // "silhouette" — paint-order expansion (Docker, Cloudflare)
    bgElement = (
      <path
        d={sticker.svgPath}
        fill={bgFill}
        fillRule="nonzero"
        stroke={bgFill}
        strokeWidth={silhouetteStrokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
        paintOrder="stroke fill"
      />
    );
    borderElement = (
      <path
        d={sticker.svgPath}
        fill="none"
        stroke={borderColor}
        strokeWidth={0.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        paintOrder="stroke fill"
      />
    );
  }

  return (
    <svg
      className="block h-full w-full"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {bgElement}
      {!sticker.hideBgBorder && borderElement}
      <g transform={`translate(${iconOffsetX} ${iconOffsetY})`}>
        <g transform={iconTransform}>
          <path d={sticker.svgPath} fill={iconColor} />
        </g>
      </g>
    </svg>
  );
}

interface StickerButtonProps {
  sticker: StickerDefinition;
  x: number;
  y: number;
  dragging: boolean;
  resolvedMode: ResolvedColorMode;
  onPointerDown: (event: React.PointerEvent<HTMLButtonElement>, id: StickerId) => void;
  onPointerMove: (event: React.PointerEvent<HTMLButtonElement>, id: StickerId) => void;
  onPointerUp: (event: React.PointerEvent<HTMLButtonElement>) => void;
  onLostPointerCapture: (event: React.PointerEvent<HTMLButtonElement>) => void;
}

const StickerButton = memo(function StickerButton({
  sticker,
  x,
  y,
  dragging,
  resolvedMode,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onLostPointerCapture,
}: StickerButtonProps) {
  return (
    <button
      type="button"
      aria-label={`${sticker.label} sticker`}
      onPointerDown={(event) => onPointerDown(event, sticker.id)}
      onPointerMove={(event) => onPointerMove(event, sticker.id)}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onLostPointerCapture={onLostPointerCapture}
      className={classNames(
        "absolute pointer-events-auto touch-none select-none",
        dragging ? "z-50 cursor-grabbing" : "z-20 cursor-grab",
      )}
      style={{
        width: `${sticker.width}px`,
        height: `${sticker.height}px`,
        left: `${x}px`,
        top: `${y}px`,
        transform: `translate3d(-50%, -50%, 0) rotate(${sticker.rotation}deg)`,
        filter: dragging ? "drop-shadow(0 6px 12px rgba(0,0,0,0.2)) drop-shadow(0 2px 4px rgba(0,0,0,0.12))" : "none",
        transition: dragging ? "none" : "filter 140ms ease-out",
        willChange: dragging ? "transform, filter" : "auto",
      }}
    >
      {renderStickerFace(sticker, resolvedMode)}
    </button>
  );
});


interface PrinterShellProps {
  dictionary: {
    labels: {
      home: string;
      posts: string;
      life: string;
      works: string;
      about: string;
      brandName: string;
      brandTagline: string;
    };
    urls: {
      home: string;
      posts: string;
      life: string;
      works: string;
      about: string;
    };
  };
  children: React.ReactNode;
  lang: string;
  initialColorMode: ColorMode;
}

export default function PrinterShell({
  dictionary,
  children,
  lang,
  initialColorMode,
}: PrinterShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { mode, resolvedMode, setColorMode } = useColorMode(initialColorMode);
  const paperRef = usePaperFeedAnimation();
  const indicatorDelay = useSyncedAnimationDelay(2000);
  const [pendingNavHref, setPendingNavHref] = useState<string | null>(null);
  const [pendingFromPath, setPendingFromPath] = useState<string | null>(null);
  const [displayLang, setDisplayLang] = useState(lang);
  const shellRef = useRef<HTMLDivElement>(null);
  const [stickerLayout, setStickerLayout] = useState<StickerLayout | null>(() => stickerLayoutMemory);
  const [stickerOrder, setStickerOrder] = useState<StickerOrder>(() => stickerOrderMemory ?? [...DEFAULT_STICKER_ORDER]);
  const stickerLayoutRef = useRef<StickerLayout | null>(stickerLayoutMemory);
  const [draggingStickerId, setDraggingStickerId] = useState<StickerId | null>(null);
  const dragStateRef = useRef<{
    id: StickerId;
    pointerId: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const langSwitchTimerRef = useRef<number | null>(null);

  const navItems = [
    { label: dictionary.labels.home, href: dictionary.urls.home },
    { label: dictionary.labels.life, href: dictionary.urls.life },
    { label: dictionary.labels.posts, href: dictionary.urls.posts },
    { label: dictionary.labels.works, href: dictionary.urls.works },
    { label: dictionary.labels.about, href: dictionary.urls.about },
  ];

  function isActive(href: string) {
    if (href === dictionary.urls.home) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  }

  useEffect(() => {
    if (!pendingNavHref || !pendingFromPath) return;
    if (pathname !== pendingFromPath) {
      setPendingNavHref(null);
      setPendingFromPath(null);
    }
  }, [pathname, pendingNavHref, pendingFromPath]);

  useEffect(() => {
    setDisplayLang(lang);
  }, [lang]);

  const getStickerBounds = useCallback((sticker: StickerDefinition, shellRect: DOMRect) => {
    return getStickerBoundsForShell(sticker, shellRect.width, shellRect.height);
  }, []);

  const normalizeStickerLayoutToTopSection = useCallback((layout: StickerLayout): StickerLayout => {
    const shell = shellRef.current;
    if (!shell) return layout;

    const shellRect = shell.getBoundingClientRect();
    if (shellRect.width <= 0 || shellRect.height <= 0) return layout;

    const normalized = {} as StickerLayout;
    let changed = false;

    for (const sticker of STICKERS) {
      const position = layout[sticker.id];
      const bounds = getStickerBounds(sticker, shellRect);
      const rawCenterX = position.x;
      const rawCenterY = position.y;
      const clampedCenterX = clamp(rawCenterX, bounds.minCenterX, bounds.maxCenterX);
      const clampedCenterY = clamp(rawCenterY, bounds.minCenterY, bounds.maxCenterY);
      const centerX =
        Math.abs(clampedCenterX - rawCenterX) <= STICKER_NORMALIZE_EPSILON_PX ? rawCenterX : clampedCenterX;
      const centerY =
        Math.abs(clampedCenterY - rawCenterY) <= STICKER_NORMALIZE_EPSILON_PX ? rawCenterY : clampedCenterY;

      normalized[sticker.id] = {
        x: centerX,
        y: centerY,
      };

      if (!changed) {
        changed =
          Math.abs(normalized[sticker.id].x - position.x) > 0.0005 ||
          Math.abs(normalized[sticker.id].y - position.y) > 0.0005;
      }
    }

    return changed ? normalized : layout;
  }, [getStickerBounds]);

  const persistStickerLayout = useCallback((layout: StickerLayout) => {
    stickerLayoutMemory = layout;
    try {
      localStorage.setItem(STICKER_STORAGE_KEY, JSON.stringify(layout));
    } catch {}
  }, []);

  const persistStickerOrder = useCallback((order: StickerOrder) => {
    stickerOrderMemory = order;
    try {
      localStorage.setItem(STICKER_ORDER_STORAGE_KEY, JSON.stringify(order));
    } catch {}
  }, []);

  useLayoutEffect(() => {
    const current = stickerLayoutRef.current;
    if (current) {
      // Keep current in-memory layout as-is across remounts (e.g. language switch)
      // to avoid tiny re-normalization shifts.
      setStickerLayout((prev) => (prev ?? current));
      return;
    }

    try {
      const stored = parseStickerLayout(localStorage.getItem(STICKER_STORAGE_KEY));
      if (stored) {
        const normalizedStored = normalizeStickerLayoutToTopSection(stored);
        setStickerLayout(normalizedStored);
        stickerLayoutRef.current = normalizedStored;
        persistStickerLayout(normalizedStored);
        return;
      }
    } catch {}

    const shellRect = shellRef.current?.getBoundingClientRect();
    if (!shellRect || shellRect.width <= 0 || shellRect.height <= 0) return;
    const randomLayout = createRandomStickerLayout(shellRect);
    setStickerLayout(randomLayout);
    stickerLayoutRef.current = randomLayout;
    persistStickerLayout(randomLayout);
  }, [normalizeStickerLayoutToTopSection, persistStickerLayout]);

  useLayoutEffect(() => {
    if (stickerOrderMemory) {
      setStickerOrder(stickerOrderMemory);
      return;
    }

    try {
      const stored = parseStickerOrder(localStorage.getItem(STICKER_ORDER_STORAGE_KEY));
      if (stored) {
        setStickerOrder(stored);
        stickerOrderMemory = stored;
        return;
      }
    } catch {}
  }, []);

  useEffect(() => {
    stickerLayoutRef.current = stickerLayout;
    if (stickerLayout) {
      stickerLayoutMemory = stickerLayout;
    }
  }, [stickerLayout]);

  useEffect(() => {
    persistStickerOrder(stickerOrder);
  }, [persistStickerOrder, stickerOrder]);

  useEffect(() => {
    const handleResize = () => {
      const current = stickerLayoutRef.current;
      if (!current) return;

      const normalized = normalizeStickerLayoutToTopSection(current);
      if (normalized !== current) {
        stickerLayoutRef.current = normalized;
        setStickerLayout(normalized);
        persistStickerLayout(normalized);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [normalizeStickerLayoutToTopSection, persistStickerLayout]);

  useEffect(() => {
    return () => {
      if (langSwitchTimerRef.current !== null) {
        window.clearTimeout(langSwitchTimerRef.current);
      }
    };
  }, []);

  function onNavPress(href: string) {
    if (isActive(href)) {
      setPendingNavHref(null);
      setPendingFromPath(null);
      return;
    }
    setPendingNavHref(href);
    setPendingFromPath(pathname);
  }

  const switchToLanguage = useCallback((newLang: string) => {
    if (newLang === displayLang) return;
    const rest = pathname.split("/").slice(2);
    const newPath = `/${newLang}${rest.length ? `/${rest.join("/")}` : ""}`;
    try {
      sessionStorage.setItem(LANG_SWITCH_KEY, "1");
    } catch {}
    setDisplayLang(newLang);
    setPendingNavHref(null);
    setPendingFromPath(null);
    if (langSwitchTimerRef.current !== null) {
      window.clearTimeout(langSwitchTimerRef.current);
    }

    langSwitchTimerRef.current = window.setTimeout(() => {
      langSwitchTimerRef.current = null;
      router.push(newPath);
    }, LANGUAGE_DIAL_ANIMATION_MS);
  }, [displayLang, pathname, router]);

  const updateStickerPositionFromPointer = useCallback((
    id: StickerId,
    clientX: number,
    clientY: number,
    offsetX: number,
    offsetY: number,
  ) => {
    const shell = shellRef.current;
    const currentLayout = stickerLayoutRef.current;
    if (!shell || !currentLayout) return;

    const rect = shell.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const sticker = STICKER_BY_ID[id];
    const bounds = getStickerBounds(sticker, rect);
    const centerX = clamp(clientX - rect.left - offsetX, bounds.minCenterX, bounds.maxCenterX);
    const centerY = clamp(clientY - rect.top - offsetY, bounds.minCenterY, bounds.maxCenterY);

    const nextLayout: StickerLayout = {
      ...currentLayout,
      [id]: {
        x: centerX,
        y: centerY,
      },
    };

    stickerLayoutMemory = nextLayout;
    stickerLayoutRef.current = nextLayout;
    setStickerLayout(nextLayout);
  }, [getStickerBounds]);

  const finishStickerDrag = useCallback((pointerId: number) => {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== pointerId) return;
    dragStateRef.current = null;
    setDraggingStickerId(null);

    if (stickerLayoutRef.current) {
      persistStickerLayout(stickerLayoutRef.current);
    }
  }, [persistStickerLayout]);

  const onStickerPointerDown = useCallback((event: React.PointerEvent<HTMLButtonElement>, id: StickerId) => {
    const shell = shellRef.current;
    const currentLayout = stickerLayoutRef.current;
    if (!shell || !currentLayout) return;

    const rect = shell.getBoundingClientRect();
    const currentPosition = currentLayout[id];

    const centerX = currentPosition.x;
    const centerY = currentPosition.y;

    dragStateRef.current = {
      id,
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left - centerX,
      offsetY: event.clientY - rect.top - centerY,
    };

    setStickerOrder((currentOrder) => moveStickerToTop(currentOrder, id));
    setDraggingStickerId(id);
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
  }, []);

  const onStickerPointerMove = useCallback((event: React.PointerEvent<HTMLButtonElement>, id: StickerId) => {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.id !== id || dragState.pointerId !== event.pointerId) return;

    event.preventDefault();
    updateStickerPositionFromPointer(
      id,
      event.clientX,
      event.clientY,
      dragState.offsetX,
      dragState.offsetY,
    );
  }, [updateStickerPositionFromPointer]);

  const onStickerPointerUp = useCallback((event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    finishStickerDrag(event.pointerId);
  }, [finishStickerDrag]);

  const onStickerLostPointerCapture = useCallback((event: React.PointerEvent<HTMLButtonElement>) => {
    finishStickerDrag(event.pointerId);
  }, [finishStickerDrag]);

  const langOptions = [
    { value: "en", label: "EN" },
    { value: "zh", label: "中" },
  ];

  const iconCls = "w-2 h-2";
  const colorModeOptions: { value: ColorMode; label: React.ReactNode }[] = [
    { value: "system", label: <ComputerDesktopIcon className={iconCls} /> },
    { value: "light", label: <SunIcon className={iconCls} /> },
    { value: "dark", label: <MoonIcon className={iconCls} /> },
  ];

  return (
    <div className="min-h-screen page-grid flex flex-col items-center px-3 py-6 sm:py-10">
      {/* Printer Body */}
      <div className="w-full max-w-3xl relative">
        {/* Unified Header Housing - Wraps both brand and slit areas to share a single shadow */}
        <div
          ref={shellRef}
          className="printer-header-border dark:border dark:border-white/[0.06] rounded-t-[2.5rem] rounded-b-sm overflow-hidden relative z-10"
        >
          
          {/* Dark mode ambient glow — soft top light spill */}
          <div className="hidden dark:block absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute -top-[40%] left-1/2 -translate-x-1/2 w-[120%] h-[80%] bg-[radial-gradient(ellipse_at_center,rgba(100,120,255,0.07)_0%,rgba(80,100,220,0.03)_40%,transparent_70%)]" />
          </div>

          {/* Draggable shell stickers */}
          <div className="absolute inset-0 z-30 pointer-events-none" aria-label="shell stickers">
            {stickerLayout && stickerOrder.map((stickerId) => {
              const sticker = STICKER_BY_ID[stickerId];
              const position = stickerLayout[stickerId];
              const dragging = draggingStickerId === stickerId;
              if (!sticker || !position) return null;

              return (
                <StickerButton
                  key={stickerId}
                  sticker={sticker}
                  x={position.x}
                  y={position.y}
                  dragging={dragging}
                  resolvedMode={resolvedMode}
                  onPointerDown={onStickerPointerDown}
                  onPointerMove={onStickerPointerMove}
                  onPointerUp={onStickerPointerUp}
                  onLostPointerCapture={onStickerLostPointerCapture}
                />
              );
            })}
          </div>

          {/* Top part - Brand & Nav */}
          <div className="bg-printer-body dark:bg-printer-body-dark px-6 pt-6 pb-5 sm:px-10 sm:pt-10 relative">
            {/* Brand plate */}
            <div className="relative flex items-start justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute -inset-2 rounded-full bg-black/5 dark:bg-white/[0.08] shadow-inner" />
                  <Image
                    className="h-8 w-8 rounded-full ring-1 ring-black/10 dark:ring-white/[0.15] shadow-sm dark:shadow-[0_0_12px_rgba(100,120,255,0.1)] relative z-10"
                    src={avatar}
                    alt="Nooc"
                    priority
                  />
                </div>
                <div>
                  <div className="font-mono text-sm font-bold tracking-[0.25em] text-printer-ink dark:text-printer-ink-dark uppercase">
                    {dictionary.labels.brandName}
                  </div>
                  <div className="font-mono text-[9px] tracking-[0.1em] text-printer-ink-light dark:text-printer-ink-dark/40 uppercase mt-0.5">
                    {dictionary.labels.brandTagline}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="relative w-3.5 h-3.5 rounded-full bg-black/10 dark:bg-black/40 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/90 shadow-[0_0_8px_rgba(34,197,94,0.6),inset_0_-1px_2px_rgba(0,0,0,0.3)] animate-[pulse_2s_infinite]" style={{ animationDelay: indicatorDelay }} />
                    <div className="absolute inset-0 rounded-full border border-black/10 dark:border-white/5 shadow-inner pointer-events-none" />
                  </div>
                  <span className="font-mono text-[8px] text-printer-ink-light dark:text-printer-ink-dark/40 uppercase tracking-widest leading-none">
                    ON
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation row */}
            <div className="relative mt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 sm:gap-2">
              <nav className="relative flex items-center gap-2 sm:gap-2.5 flex-1 w-full py-1.5">
                {navItems.map((item, index) => {
                  const active = pendingNavHref ? pendingNavHref === item.href : isActive(item.href);
                  return (
                    <Link key={index} href={item.href}>
                      <button
                        onClick={() => onNavPress(item.href)}
                        className={classNames("printer-btn whitespace-nowrap", { "active": active })}
                      >
                        <span className="leading-none">{item.label}</span>
                      </button>
                    </Link>
                  );
                })}
              </nav>
              <div className="sm:hidden h-[1px] bg-black/10 dark:bg-white/10" />
              <div className="flex items-center justify-end gap-5 shrink-0 py-1">
                <RotaryDial
                  options={langOptions}
                  value={displayLang}
                  onChange={switchToLanguage}
                  title={displayLang === "en" ? "切换到中文" : "Switch to English"}
                />
                <RotaryDial
                  options={colorModeOptions}
                  value={mode}
                  onChange={setColorMode}
                  labelLayout="inline"
                  title={mode === "system" ? "System" : mode === "light" ? "Light" : "Dark"}
                />
              </div>
            </div>
          </div>

          {/* Bottom part - Paper feed slot cross section */}
          <div className="bg-printer-shell dark:bg-printer-shell-dark h-5 flex items-center justify-center relative">
            {/* Inset shadows to give depth to the slit area */}
            <div className="absolute inset-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)] dark:shadow-[inset_0_3px_6px_rgba(0,0,0,0.5)] pointer-events-none" />
            <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/[0.05] to-transparent dark:from-black/[0.2]" />
            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/[0.05] to-transparent dark:from-black/[0.2]" />
            {/* Paper exit slit */}
            <div className="absolute left-2 right-2 sm:left-8 sm:right-8 h-[6px] bg-black/60 dark:bg-black/90 rounded-[1px] shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)] dark:shadow-[inset_0_1px_4px_rgba(0,0,0,0.9)]" />
          </div>
        </div>
        {/* Cast shadow outside the printer shell bottom edge */}
        <div className="relative h-0 pointer-events-none" aria-hidden="true">
          <div className="printer-shell-bottom-shadow" />
        </div>
        {/* Printed paper output area — clipped so paper slides in from the slit */}
        <div className="printer-paper-wrap relative mx-3 sm:mx-10 -mt-[12px] z-20" style={{ clipPath: 'inset(0 -20px -56px -20px)' }}>
          <div className="paper-top-occlusion" aria-hidden="true" />
          <div ref={paperRef}>
            <div className="printer-paper-area bg-printer-paper dark:bg-printer-paper-dark dark:border dark:border-white/[0.04] thermal-texture min-h-[60vh] shadow-[0_4px_12px_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4),0_1px_3px_rgba(0,0,0,0.3)] relative z-0 flex flex-col overflow-hidden">
              <div className="absolute -top-1 left-0 right-0 h-1 bg-printer-paper dark:bg-printer-paper-dark" />

              {/* Perforation marks */}
              <div className="absolute left-0 top-0 bottom-0 w-4 flex flex-col items-center justify-start gap-6 pt-4 opacity-20 pointer-events-none">
                {Array.from({ length: 60 }).map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full border border-printer-ink/30 dark:border-printer-ink-dark/30 shrink-0" />
                ))}
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-4 flex flex-col items-center justify-start gap-6 pt-4 opacity-20 pointer-events-none">
                {Array.from({ length: 60 }).map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full border border-printer-ink/30 dark:border-printer-ink-dark/30 shrink-0" />
                ))}
              </div>

              <div className="printer-content-area flex-1 px-6 sm:px-10 py-8 relative z-10">{children}</div>

              <div className="px-6 sm:px-10 py-6 mt-4 border-t border-dashed border-printer-ink/10 dark:border-printer-ink-dark/10 relative z-10">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-printer-ink-light dark:text-printer-ink-dark/40">
                  <div className="font-mono text-[10px] tracking-widest uppercase order-2 sm:order-1">© {new Date().getFullYear()} Nooc</div>
                  <div className="font-mono text-[10px] tracking-widest uppercase flex items-center gap-4 order-1 sm:order-2">
                    <a href="https://github.com/noobnooc" target="_blank" rel="noopener" className="hover:text-printer-accent transition-colors">GitHub</a>
                    <a href="https://x.com/noobnooc" target="_blank" rel="noopener" className="hover:text-printer-accent transition-colors">X</a>
                    <a href="mailto:nooc@nooc.me" className="hover:text-printer-accent transition-colors">Email</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="paper-edge-bottom h-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
