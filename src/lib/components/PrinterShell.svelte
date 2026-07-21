<script lang="ts">
  import { afterNavigate, goto } from "$app/navigation";
  import { page } from "$app/state";
  import { onMount } from "svelte";
  import type { Snippet } from "svelte";
  import type { Dictionary, Language } from "$lib/dictionaries";
  import PrinterSnail from "./PrinterSnail.svelte";
  import SocialHoverCard from "./SocialHoverCard.svelte";
  import RotaryDial from "./RotaryDial.svelte";
  import Stickers from "./Stickers.svelte";

  type ColorMode = "system" | "light" | "dark";

  let {
    lang,
    dictionary,
    children,
  }: {
    lang: Language;
    dictionary: Dictionary;
    children: Snippet;
  } = $props();

  let navItems = $derived([
    { label: dictionary.labels.home, href: dictionary.urls.home },
    { label: dictionary.labels.life, href: dictionary.urls.life },
    { label: dictionary.labels.posts, href: dictionary.urls.posts },
    { label: dictionary.labels.works, href: dictionary.urls.works },
    { label: dictionary.labels.about, href: dictionary.urls.about },
  ]);

  // ------------------------------------------------------------------
  // Navigation active/pending state
  // ------------------------------------------------------------------
  let pendingNavHref = $state<string | null>(null);

  function isActive(href: string): boolean {
    const pathname = page.url.pathname;
    if (href === dictionary.urls.home) return pathname === href;
    return pathname.startsWith(href);
  }

  function onNavPress(href: string) {
    pendingNavHref = isActive(href) ? null : href;
  }

  // ------------------------------------------------------------------
  // Color mode — the inline script in app.html applies the stored mode
  // before paint; this just handles user toggling afterwards.
  // ------------------------------------------------------------------
  let colorMode = $state<ColorMode>("system");

  onMount(() => {
    const stored = document.documentElement.dataset.colorMode;
    if (stored === "light" || stored === "dark" || stored === "system") {
      colorMode = stored;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onMediaChange = () => {
      if (colorMode === "system") {
        document.documentElement.classList.toggle("dark", media.matches);
      }
    };
    media.addEventListener("change", onMediaChange);
    return () => media.removeEventListener("change", onMediaChange);
  });

  function setColorMode(mode: ColorMode) {
    colorMode = mode;
    try {
      localStorage.setItem("color-mode", mode);
    } catch {}
    document.documentElement.dataset.colorMode = mode;
    const dark =
      mode === "dark" ||
      (mode === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
  }

  // ------------------------------------------------------------------
  // Language switch — let the dial animate before navigating.
  // ------------------------------------------------------------------
  const LANGUAGE_DIAL_ANIMATION_MS = 220;
  // svelte-ignore state_referenced_locally -- initial value; kept in sync by the effect below
  let displayLang = $state<string>(lang);
  let langSwitchTimer: ReturnType<typeof setTimeout> | undefined;

  $effect(() => {
    displayLang = lang;
  });

  function switchToLanguage(newLang: string) {
    if (newLang === displayLang) return;
    const rest = page.url.pathname.split("/").slice(2);
    const newPath = `/${newLang}${rest.length ? `/${rest.join("/")}` : ""}`;
    displayLang = newLang;
    pendingNavHref = null;
    clearTimeout(langSwitchTimer);
    langSwitchTimer = setTimeout(() => goto(newPath), LANGUAGE_DIAL_ANIMATION_MS);
  }

  // ------------------------------------------------------------------
  // Paper feed animation on navigation, with a subtle paper-jam stutter.
  // ------------------------------------------------------------------
  const FEED_PX = 60; // how many pixels the paper slides down

  let paperElement: HTMLDivElement;

  function generatePaperFeedKeyframes(): { offset: number; transform: string }[] {
    const keyframes = [{ offset: 0, transform: `translateY(-${FEED_PX}px)` }];

    const stutterCount = 2 + Math.floor(Math.random() * 2);
    const offsets = Array.from(
      { length: stutterCount },
      () => 0.15 + Math.random() * 0.6,
    ).sort((a, b) => a - b);

    for (const offset of offsets) {
      const linearPx = FEED_PX * (1 - offset); // remaining distance
      const jitter = (Math.random() - 0.4) * 8; // small random deviation
      const y = -Math.max(0, Math.min(FEED_PX, linearPx + jitter));
      keyframes.push({ offset, transform: `translateY(${y}px)` });
    }

    keyframes.push({ offset: 1, transform: "translateY(0px)" });
    return keyframes;
  }

  afterNavigate((navigation) => {
    pendingNavHref = null;
    if (navigation.type === "enter" || !paperElement) return;

    paperElement.animate(generatePaperFeedKeyframes(), {
      duration: 350 + Math.random() * 200, // 350-550ms, snappy
      easing: "linear",
      fill: "backwards",
    });
  });

  // Keep the indicator light's pulse in sync with wall-clock time so it
  // doesn't visually reset on client-side navigations.
  let indicatorDelay = $state("0ms");
  onMount(() => {
    indicatorDelay = `-${Date.now() % 2000}ms`;
  });

  const currentYear = new Date().getFullYear();
</script>

<div class="min-h-screen page-grid flex flex-col items-center px-3 py-6 sm:py-10">
  <!-- Printer Body -->
  <div class="w-full max-w-3xl relative">
    <!-- Snail crawling along the very top edge of the printer shell -->
    <PrinterSnail />

    <!-- Unified header housing — wraps both brand and slit areas to share a single shadow -->
    <div
      class="printer-header-border dark:border dark:border-white/[0.06] rounded-t-[2.5rem] rounded-b-sm overflow-hidden relative z-10"
    >
      <!-- Dark mode ambient glow — soft top light spill -->
      <div
        class="hidden dark:block absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div
          class="absolute -top-[40%] left-1/2 -translate-x-1/2 w-[120%] h-[80%] bg-[radial-gradient(ellipse_at_center,rgba(100,120,255,0.07)_0%,rgba(80,100,220,0.03)_40%,transparent_70%)]"
        ></div>
      </div>

      <!-- Draggable shell stickers -->
      <Stickers />

      <!-- Top part - Brand & Nav -->
      <div
        class="bg-printer-body dark:bg-printer-body-dark px-6 pt-6 pb-5 sm:px-10 sm:pt-10 relative"
      >
        <!-- Brand plate -->
        <div class="relative flex items-start justify-between mb-8">
          <div class="flex items-center gap-4">
            <div class="relative">
              <div
                class="absolute -inset-2 rounded-full bg-black/5 dark:bg-white/[0.08] shadow-inner"
              ></div>
              <img
                class="h-8 w-8 rounded-full ring-1 ring-black/10 dark:ring-white/[0.15] shadow-sm dark:shadow-[0_0_12px_rgba(100,120,255,0.1)] relative z-10"
                src="/static/avatar.webp"
                alt="Nooc"
                width="32"
                height="32"
              />
            </div>
            <div>
              <div
                class="font-mono text-sm font-bold tracking-[0.25em] text-printer-ink dark:text-printer-ink-dark uppercase"
              >
                {dictionary.labels.brandName}
              </div>
              <div
                class="font-mono text-[9px] tracking-[0.1em] text-printer-ink-light dark:text-printer-ink-dark/40 uppercase mt-0.5"
              >
                {dictionary.labels.brandTagline}
              </div>
            </div>
          </div>

          <div class="flex items-start gap-6">
            <div class="flex flex-col items-center gap-1.5">
              <div
                class="relative w-3.5 h-3.5 rounded-full bg-black/10 dark:bg-black/40 flex items-center justify-center"
              >
                <div
                  class="w-2.5 h-2.5 rounded-full bg-green-500/90 shadow-[0_0_8px_rgba(34,197,94,0.6),inset_0_-1px_2px_rgba(0,0,0,0.3)] animate-[pulse_2s_infinite]"
                  style:animation-delay={indicatorDelay}
                ></div>
                <div
                  class="absolute inset-0 rounded-full border border-black/10 dark:border-white/5 shadow-inner pointer-events-none"
                ></div>
              </div>
              <span
                class="font-mono text-[8px] text-printer-ink-light dark:text-printer-ink-dark/40 uppercase tracking-widest leading-none"
              >
                ON
              </span>
            </div>
          </div>
        </div>

        <!-- Navigation row -->
        <div
          class="relative mt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 sm:gap-2"
        >
          <nav class="relative flex items-center gap-2 sm:gap-2.5 flex-1 w-full py-1.5">
            {#each navItems as item (item.href)}
              <a
                href={item.href}
                onclick={() => onNavPress(item.href)}
                class={[
                  "printer-btn whitespace-nowrap",
                  (pendingNavHref
                    ? pendingNavHref === item.href
                    : isActive(item.href)) && "active",
                ]}
              >
                <span class="leading-none">{item.label}</span>
              </a>
            {/each}
          </nav>
          <div class="sm:hidden h-[1px] bg-black/10 dark:bg-white/10"></div>
          <div class="flex items-center justify-end gap-5 shrink-0 py-1">
            <RotaryDial
              options={[
                { value: "en", label: "EN" },
                { value: "zh", label: "中" },
              ]}
              value={displayLang}
              onchange={switchToLanguage}
              title={displayLang === "en" ? "切换到中文" : "Switch to English"}
            />
            <RotaryDial
              options={[
                { value: "system", icon: "computer" },
                { value: "light", icon: "sun" },
                { value: "dark", icon: "moon" },
              ]}
              value={colorMode}
              onchange={(mode) => setColorMode(mode as ColorMode)}
              labelLayout="inline"
              title={colorMode === "system"
                ? "System"
                : colorMode === "light"
                  ? "Light"
                  : "Dark"}
            />
          </div>
        </div>
      </div>

      <!-- Bottom part - Paper feed slot cross section -->
      <div
        class="bg-printer-shell dark:bg-printer-shell-dark h-5 flex items-center justify-center relative"
      >
        <!-- Inset shadows to give depth to the slit area -->
        <div
          class="absolute inset-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)] dark:shadow-[inset_0_3px_6px_rgba(0,0,0,0.5)] pointer-events-none"
        ></div>
        <div
          class="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/[0.05] to-transparent dark:from-black/[0.2]"
        ></div>
        <div
          class="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/[0.05] to-transparent dark:from-black/[0.2]"
        ></div>
        <!-- Paper exit slit -->
        <div
          class="absolute left-2 right-2 sm:left-8 sm:right-8 h-[6px] bg-black/60 dark:bg-black/90 rounded-[1px] shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)] dark:shadow-[inset_0_1px_4px_rgba(0,0,0,0.9)]"
        ></div>
      </div>
    </div>

    <!-- Cast shadow outside the printer shell bottom edge -->
    <div class="relative h-0 pointer-events-none" aria-hidden="true">
      <div class="printer-shell-bottom-shadow"></div>
    </div>

    <!-- Printed paper output area — clipped so paper slides in from the slit -->
    <div
      class="printer-paper-wrap relative mx-3 sm:mx-10 -mt-[12px] z-20"
      style:clip-path="inset(0 -20px -56px -20px)"
    >
      <div class="paper-top-occlusion" aria-hidden="true"></div>
      <div bind:this={paperElement}>
        <div
          class="printer-paper-area bg-printer-paper dark:bg-printer-paper-dark dark:border dark:border-white/[0.04] thermal-texture min-h-[60vh] shadow-[0_4px_12px_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4),0_1px_3px_rgba(0,0,0,0.3)] relative z-0 flex flex-col overflow-hidden"
        >
          <div
            class="absolute -top-1 left-0 right-0 h-1 bg-printer-paper dark:bg-printer-paper-dark"
          ></div>

          <!-- Perforation marks -->
          <div
            class="absolute left-0 top-0 bottom-0 w-4 flex flex-col items-center justify-start gap-6 pt-4 opacity-20 pointer-events-none"
          >
            {#each Array.from({ length: 60 }), i (i)}
              <div
                class="w-1.5 h-1.5 rounded-full border border-printer-ink/30 dark:border-printer-ink-dark/30 shrink-0"
              ></div>
            {/each}
          </div>
          <div
            class="absolute right-0 top-0 bottom-0 w-4 flex flex-col items-center justify-start gap-6 pt-4 opacity-20 pointer-events-none"
          >
            {#each Array.from({ length: 60 }), i (i)}
              <div
                class="w-1.5 h-1.5 rounded-full border border-printer-ink/30 dark:border-printer-ink-dark/30 shrink-0"
              ></div>
            {/each}
          </div>

          <div class="printer-content-area flex-1 px-6 sm:px-10 py-8 relative z-10">
            {@render children()}
          </div>

          <div
            class="px-6 sm:px-10 py-6 mt-4 border-t border-dashed border-printer-ink/10 dark:border-printer-ink-dark/10 relative z-10"
          >
            <div
              class="flex flex-col sm:flex-row items-center justify-between gap-4 text-printer-ink-light dark:text-printer-ink-dark/40"
            >
              <div
                class="font-mono text-[10px] tracking-widest uppercase order-2 sm:order-1"
              >
                © {currentYear} Nooc
              </div>
              <div
                class="font-mono text-[10px] tracking-widest uppercase flex items-center gap-4 order-1 sm:order-2"
              >
                <SocialHoverCard
                  kind="github"
                  href="https://github.com/noobnooc"
                  {lang}
                  {dictionary}
                  class="hover:text-printer-accent transition-colors"
                >
                  GitHub
                </SocialHoverCard>
                <SocialHoverCard
                  kind="x"
                  href="https://x.com/noobnooc"
                  {lang}
                  {dictionary}
                  class="hover:text-printer-accent transition-colors"
                >
                  X
                </SocialHoverCard>
                <SocialHoverCard
                  kind="email"
                  href="mailto:nooc@nooc.me"
                  {lang}
                  {dictionary}
                  align="right"
                  class="hover:text-printer-accent transition-colors"
                >
                  Email
                </SocialHoverCard>
              </div>
            </div>
          </div>
        </div>
        <div class="paper-edge-bottom h-0"></div>
      </div>
    </div>
  </div>
</div>
