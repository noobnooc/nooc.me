<script lang="ts">
  import { onMount } from "svelte";
  import type { Snippet } from "svelte";
  import { fly } from "svelte/transition";
  import type { Dictionary, Language } from "$lib/dictionaries";
  import { ensureSocialStats, social } from "$lib/social-state.svelte";
  import Icon from "./Icon.svelte";

  let {
    kind,
    href,
    lang,
    dictionary,
    align = "center",
    side = "top",
    class: className = "",
    children,
  }: {
    kind: "github" | "x" | "email";
    href: string;
    lang: Language;
    dictionary: Dictionary;
    align?: "center" | "left" | "right";
    /** Where the card opens relative to the link. The printed paper is
     * clipped at its top edge, so links near the top should use "bottom". */
    side?: "top" | "bottom";
    class?: string;
    children: Snippet;
  } = $props();

  const OPEN_DELAY_MS = 120;
  const CLOSE_DELAY_MS = 160;

  let open = $state(false);
  let openTimer: ReturnType<typeof setTimeout> | undefined;
  let closeTimer: ReturnType<typeof setTimeout> | undefined;

  function show() {
    ensureSocialStats();
    clearTimeout(closeTimer);
    openTimer = setTimeout(() => (open = true), OPEN_DELAY_MS);
  }

  function hide() {
    clearTimeout(openTimer);
    closeTimer = setTimeout(() => (open = false), CLOSE_DELAY_MS);
  }

  // Warm up the live stats while idle so an open card never waits on the
  // network.
  onMount(() => {
    const idle = setTimeout(ensureSocialStats, 2500);
    return () => {
      clearTimeout(idle);
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
    };
  });

  let stats = $derived(social.stats);

  function formatCount(value: number): string {
    return new Intl.NumberFormat(lang === "zh" ? "zh-CN" : "en-US", {
      notation: value >= 10000 ? "compact" : "standard",
      maximumFractionDigits: 1,
    }).format(value);
  }

  // Contribution heatmap: column-major grid of GitHub-style weeks
  // (top = Sunday), newest week in the last column. -1 marks padding cells
  // beyond the data range.
  const HEATMAP_WEEKS = 17;
  const LEVEL_OPACITY = [0.07, 0.25, 0.45, 0.68, 0.92];

  let heatmapCells = $derived.by(() => {
    const { levels, endDate } = stats.github;
    const days = [...levels].map(Number);
    const endWeekday = new Date(`${endDate}T00:00:00Z`).getUTCDay();
    const padded = days.concat(Array(6 - endWeekday).fill(-1));
    const size = HEATMAP_WEEKS * 7;
    const cells = padded.slice(-size);
    return cells.length < size
      ? Array(size - cells.length).fill(-1).concat(cells)
      : cells;
  });

  const postmark = new Date().toISOString().split("T")[0];

  const alignClasses = {
    center: "left-1/2 -translate-x-1/2",
    left: "left-0",
    right: "right-0",
  };
</script>

<!-- Mouse handlers only track hover intent; keyboard access goes through
  the anchor's focus/blur, so the wrapper stays presentational. -->
<span
  role="presentation"
  class="relative inline-flex"
  onmouseenter={show}
  onmouseleave={hide}
  onkeydown={(event) => {
    if (event.key === "Escape") {
      clearTimeout(openTimer);
      open = false;
    }
  }}
>
  <a
    {href}
    target={kind === "email" ? undefined : "_blank"}
    rel={kind === "email" ? undefined : "noopener"}
    class={className}
    onfocus={show}
    onblur={hide}
  >
    {@render children()}
  </a>

  {#if open}
    <div
      transition:fly={{ y: side === "top" ? 6 : -6, duration: 160 }}
      class={[
        "absolute z-50 w-64",
        side === "top" ? "bottom-full mb-2.5" : "top-full mt-2.5",
        alignClasses[align],
      ]}
      aria-hidden="true"
    >
      <div
        class="rounded-sm border border-printer-ink/15 dark:border-printer-ink-dark/15 bg-printer-paper dark:bg-printer-paper-dark thermal-texture shadow-[0_10px_28px_rgba(0,0,0,0.16),0_2px_6px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_28px_rgba(0,0,0,0.55),0_2px_6px_rgba(0,0,0,0.4)] px-4 py-3 text-left normal-case tracking-normal"
      >
        <!-- Receipt header -->
        <div
          class="flex items-center justify-between gap-2 pb-2 mb-2.5 border-b border-dashed border-printer-ink/15 dark:border-printer-ink-dark/15"
        >
          <span
            class="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.25em] uppercase text-printer-ink-light dark:text-printer-ink-dark/50"
          >
            <Icon
              name={kind === "email" ? "mail" : kind}
              class="w-3 h-3 shrink-0"
            />
            {kind === "email" ? "MAIL" : kind === "github" ? "GITHUB" : "X"}
          </span>
          <span
            class="font-mono text-[9px] tracking-widest text-printer-ink-light dark:text-printer-ink-dark/40"
          >
            {kind === "email" ? postmark : `@${stats[kind].handle}`}
          </span>
        </div>

        {#if kind === "github"}
          <div class="flex items-baseline gap-1.5 mb-2">
            <span
              class="font-mono text-xs font-bold text-printer-ink dark:text-printer-ink-dark"
            >
              {stats.github.name}
            </span>
            <span
              class="font-mono text-[10px] text-printer-ink-light dark:text-printer-ink-dark/40"
            >
              @{stats.github.handle}
            </span>
          </div>

          <div class="grid grid-cols-3 gap-2 mb-2.5">
            {#each [
              [dictionary.social.followers, stats.github.followers],
              [dictionary.social.repos, stats.github.publicRepos],
              [dictionary.social.contributions, stats.github.totalContributions],
            ] as [label, value] (label)}
              <div>
                <div
                  class="font-mono text-sm font-bold text-printer-ink dark:text-printer-ink-dark leading-tight"
                >
                  {formatCount(value as number)}
                </div>
                <div
                  class="font-mono text-[8px] tracking-wider uppercase text-printer-ink-light dark:text-printer-ink-dark/40 leading-tight"
                >
                  {label}
                </div>
              </div>
            {/each}
          </div>

          <!-- Dot-matrix contribution heatmap -->
          <div class="grid grid-flow-col grid-rows-7 gap-[2px] w-fit">
            {#each heatmapCells as level, i (i)}
              <span
                class="w-[5px] h-[5px] rounded-[1px] bg-printer-ink dark:bg-printer-ink-dark"
                style:opacity={level < 0 ? 0 : LEVEL_OPACITY[level]}
              ></span>
            {/each}
          </div>
          <div
            class="font-mono text-[8px] tracking-wider uppercase text-printer-ink-light dark:text-printer-ink-dark/40 mt-1.5"
          >
            {dictionary.social.recentActivity}
          </div>
        {:else if kind === "x"}
          <div class="flex items-baseline gap-1.5">
            <span
              class="font-mono text-xs font-bold text-printer-ink dark:text-printer-ink-dark"
            >
              {stats.x.name}
            </span>
            <span
              class="font-mono text-[10px] text-printer-ink-light dark:text-printer-ink-dark/40"
            >
              {dictionary.social.since(stats.x.joined)}
            </span>
          </div>
          {#if stats.x.bio}
            <p
              class="font-serif text-[11px] text-printer-ink/70 dark:text-printer-ink-dark/60 mt-1 leading-snug line-clamp-2"
            >
              {stats.x.bio}
            </p>
          {/if}

          <div
            class="grid grid-cols-3 gap-2 mt-2.5 pt-2 border-t border-dotted border-printer-ink/10 dark:border-printer-ink-dark/10"
          >
            {#each [
              [dictionary.social.followers, stats.x.followers],
              [dictionary.social.following, stats.x.following],
              [dictionary.social.posts, stats.x.posts],
            ] as [label, value] (label)}
              <div>
                <div
                  class="font-mono text-sm font-bold text-printer-ink dark:text-printer-ink-dark leading-tight"
                >
                  {formatCount(value as number)}
                </div>
                <div
                  class="font-mono text-[8px] tracking-wider uppercase text-printer-ink-light dark:text-printer-ink-dark/40 leading-tight"
                >
                  {label}
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <!-- Printed envelope slip -->
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0 pt-1">
              <div
                class="font-mono text-[8px] tracking-[0.25em] uppercase text-printer-ink-light dark:text-printer-ink-dark/40"
              >
                {dictionary.social.emailTo}
              </div>
              <div
                class="font-mono text-xs font-bold text-printer-ink dark:text-printer-ink-dark mt-0.5 truncate"
              >
                Nooc
              </div>
              <div
                class="font-mono text-[10px] text-printer-ink/70 dark:text-printer-ink-dark/60 truncate"
              >
                {href.replace("mailto:", "")}
              </div>
            </div>
            <!-- Stamp -->
            <div
              class="shrink-0 w-10 h-12 rounded-[2px] border border-dashed border-printer-accent/50 dark:border-printer-accent-dark/50 flex flex-col items-center justify-center gap-1 rotate-2"
            >
              <Icon
                name="send"
                class="w-3.5 h-3.5 text-printer-accent dark:text-printer-accent-dark"
              />
              <span
                class="font-mono text-[7px] tracking-widest uppercase text-printer-accent dark:text-printer-accent-dark"
              >
                HELLO
              </span>
            </div>
          </div>
          <div
            class="font-mono text-[9px] text-printer-ink-light dark:text-printer-ink-dark/40 mt-2.5 pt-2 border-t border-dotted border-printer-ink/10 dark:border-printer-ink-dark/10"
          >
            {dictionary.social.emailHint}
          </div>
        {/if}
      </div>

      <!-- Pointer notch -->
      <div
        class={[
          "absolute w-2 h-2 rotate-45 border-printer-ink/15 dark:border-printer-ink-dark/15 bg-printer-paper dark:bg-printer-paper-dark",
          side === "top"
            ? "top-full -mt-[1px] -translate-y-1/2 border-b border-r"
            : "bottom-full -mb-[1px] translate-y-1/2 border-t border-l",
          align === "center"
            ? "left-1/2 -translate-x-1/2"
            : align === "left"
              ? "left-5"
              : "right-5",
        ]}
      ></div>
    </div>
  {/if}
</span>
