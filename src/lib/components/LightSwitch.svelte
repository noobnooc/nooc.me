<script lang="ts">
  /**
   * Desktop-only light switch: a pull cord on the right edge of the screen
   * toggles dark mode like an old incandescent bulb hanging on the left.
   *
   * Pulling the cord in light mode blacks out the whole screen, then the
   * bulb sputters awake revealing the dark theme. Pulling again makes the
   * bulb flicker and die, and daylight fades back in.
   *
   * The bulb / room-shading layers are shown purely via CSS (`dark` class +
   * `lg` breakpoint), so they are correct on first paint with no JS.
   */
  let {
    isDark,
    ontoggle,
    lang = "en",
  }: {
    isDark: boolean;
    /** Called mid-transition, while the screen is fully black. */
    ontoggle: (dark: boolean) => void;
    lang?: string;
  } = $props();

  let busy = $state(false);
  let pulled = $state(false);
  let blackoutElement: HTMLDivElement | undefined = $state();

  let title = $derived(
    isDark
      ? lang === "zh"
        ? "拉绳关灯"
        : "Pull the cord to turn the light off"
      : lang === "zh"
        ? "拉绳开灯"
        : "Pull the cord to turn the light on",
  );

  // Blackout opacity over time — an old bulb sputtering awake…
  const FLICKER_ON: Keyframe[] = [
    { opacity: 1, offset: 0 },
    { opacity: 1, offset: 0.08 },
    { opacity: 0.45, offset: 0.14 },
    { opacity: 0.9, offset: 0.22 },
    { opacity: 0.15, offset: 0.32 },
    { opacity: 0.75, offset: 0.4 },
    { opacity: 0.85, offset: 0.47 },
    { opacity: 0.08, offset: 0.56 },
    { opacity: 0.5, offset: 0.66 },
    { opacity: 0, offset: 0.76 },
    { opacity: 0.18, offset: 0.86 },
    { opacity: 0, offset: 1 },
  ];

  function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function run(
    element: Element,
    keyframes: Keyframe[],
    options: KeyframeAnimationOptions,
  ) {
    const animation = element.animate(keyframes, { fill: "forwards", ...options });
    try {
      await animation.finished;
    } catch {
      // Cancelled mid-flight (e.g. rapid re-toggle) — the caller re-syncs.
    }
  }

  async function pull() {
    if (busy || !blackoutElement) return;
    busy = true;
    const toDark = !isDark;
    blackoutElement.getAnimations().forEach((animation) => animation.cancel());

    // Tug the cord down.
    pulled = true;
    await wait(170);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      ontoggle(toDark);
      pulled = false;
      busy = false;
      return;
    }

    if (toDark) {
      // Lights out — the room goes pitch black…
      await run(blackoutElement, [{ opacity: 0 }, { opacity: 1 }], {
        duration: 150,
        easing: "ease-in",
      });
      ontoggle(true); // swap the theme under cover of darkness
      pulled = false; // cord springs back up
      await wait(140); // a beat of total darkness
      // …then the old bulb sputters awake.
      await run(blackoutElement, FLICKER_ON, { duration: 780, easing: "linear" });
    } else {
      // Daylight returns instantly, then the bulb clicks off and fades away
      // (the CSS transitions on the bulb/shading layers do the "lamp dying").
      ontoggle(false);
      await wait(120);
      pulled = false;
      await wait(650); // keep the switch busy until the bulb has been hoisted away
    }

    busy = false;
  }
</script>

<!-- Room shading — the further from the bulb, the darker the page -->
<div class="lamp-shade hidden lg:block fixed inset-0 z-[90] pointer-events-none" aria-hidden="true"></div>
<div class="lamp-warmth hidden lg:block fixed inset-0 z-[90] pointer-events-none" aria-hidden="true"></div>

<!-- The bulb, hanging left of the content column -->
<div
  class="bulb-root hidden lg:block fixed top-0 left-[max(8px,calc(50%-532px))] z-[95] pointer-events-none"
  aria-hidden="true"
>
  <div class="bulb-sway relative">
    <div class="bulb-glow absolute"></div>
    <svg width="100" height="190" viewBox="0 0 100 190" fill="none" class="bulb-svg relative block">
      <defs>
        <radialGradient id="light-switch-glass" cx="0.5" cy="0.42" r="0.7">
          <stop offset="0" stop-color="#fff8dd" />
          <stop offset="0.45" stop-color="#ffe9a8" />
          <stop offset="0.8" stop-color="#ffc86e" stop-opacity="0.75" />
          <stop offset="1" stop-color="#ff9d3f" stop-opacity="0.35" />
        </radialGradient>
      </defs>
      <!-- twisted hanging wire -->
      <path d="M50 -2 V64" class="bulb-wire" />
      <path d="M50 -2 V64" class="bulb-wire-braid" />
      <!-- socket -->
      <rect x="42" y="62" width="16" height="6" rx="1.5" class="bulb-cap" />
      <rect x="40" y="68" width="20" height="21" rx="2.5" class="bulb-socket" />
      <path d="M41 73.5 H59 M41 78 H59 M41 82.5 H59" class="bulb-socket-thread" />
      <!-- glass -->
      <path
        d="M44 89 L44 100 C44 108 32 112 29 124 A23 23 0 1 0 71 124 C68 112 56 108 56 100 L56 89 Z"
        fill="url(#light-switch-glass)"
        class="bulb-glass"
      />
      <!-- filament -->
      <path d="M46 100 V119 M54 100 V119" class="bulb-filament-post" />
      <path d="M46 119 l2 7 2 -7 2 7 2 -7" class="bulb-filament" />
      <!-- dead-glass overlay, shown the instant the lamp switches off -->
      <path
        d="M44 89 L44 100 C44 108 32 112 29 124 A23 23 0 1 0 71 124 C68 112 56 108 56 100 L56 89 Z"
        class="bulb-glass-dead"
      />
      <!-- glass glint -->
      <path d="M38 122 a16 16 0 0 1 6 -9" class="bulb-glint" />
    </svg>
  </div>
</div>

<!-- The pull cord, hanging right of the content column -->
<div class="hidden lg:block fixed -top-12 right-[calc(50%-468px)] z-[95] cord-sway">
  <button
    type="button"
    role="switch"
    aria-checked={isDark}
    aria-label={title}
    {title}
    onclick={pull}
    class="cord-group block cursor-pointer focus:outline-none"
    class:pulled
  >
    <svg width="28" height="270" viewBox="0 0 28 270" fill="none" class="block">
      <line x1="14" y1="0" x2="14" y2="197" class="cord-rope" />
      <line x1="14" y1="0" x2="14" y2="197" class="cord-rope-braid" />
      <circle cx="14" cy="199" r="2.6" class="cord-knot" />
      <!-- wooden handle -->
      <path
        d="M11.2 203 h5.6 c1.6 0 2.7 1 2.9 2.6 l1.5 21.5 c0.2 3.1 -2.2 5.6 -7.2 5.6 s-7.4 -2.5 -7.2 -5.6 l1.5 -21.5 c0.2 -1.6 1.3 -2.6 2.9 -2.6 z"
        class="cord-handle"
      />
      <path d="M11.5 208 l-0.9 16" class="cord-handle-shine" />
    </svg>
  </button>
</div>

<!-- Blackout curtain the flicker animations run on -->
<div
  bind:this={blackoutElement}
  class="hidden lg:block fixed inset-0 z-[100] bg-black opacity-0 pointer-events-none"
  aria-hidden="true"
></div>

<style>
  /* ---------------- room lighting ---------------- */

  /* The bulb hangs at max(58px, 50% - 482px), 135px — gradients are centred there.
     Both layers appear instantly when dark mode arrives (hidden behind the
     blackout curtain anyway) but fade away gently when the lamp is switched
     off in daylight. */
  .lamp-shade,
  .lamp-warmth {
    opacity: 0;
    transition: opacity 420ms ease;
  }
  :global(.dark) .lamp-shade,
  :global(.dark) .lamp-warmth {
    opacity: 1;
    transition: none;
  }

  /* Light falls off with distance from the bulb */
  .lamp-shade {
    background: radial-gradient(
      140% 140% at max(58px, 50% - 482px) 135px,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.05) 22%,
      rgba(0, 0, 0, 0.16) 45%,
      rgba(0, 0, 0, 0.3) 72%,
      rgba(0, 0, 0, 0.4) 100%
    );
  }

  /* Warm incandescent spill close to the bulb */
  .lamp-warmth {
    background: radial-gradient(
      620px circle at max(58px, 50% - 482px) 135px,
      rgba(255, 190, 110, 0.14),
      rgba(255, 185, 105, 0.05) 45%,
      transparent 72%
    );
    mix-blend-mode: screen;
  }

  /* ---------------- bulb ---------------- */

  /* Lowered down from above the screen when the lamp arrives; when switched
     off it dies first (grey glass) and is then hoisted back up out of view. */
  .bulb-root {
    visibility: hidden;
    transform: translateY(-240px);
    transition:
      transform 540ms cubic-bezier(0.5, 0, 0.85, 0.6) 180ms,
      visibility 0s linear 720ms;
  }
  :global(.dark) .bulb-root {
    visibility: visible;
    transform: translateY(0);
    transition: transform 680ms cubic-bezier(0.22, 1.18, 0.36, 1) 80ms;
  }

  .bulb-sway {
    transform-origin: 50px 0;
    animation: light-switch-sway 9s ease-in-out infinite;
  }

  .bulb-svg {
    filter: none;
    transition: filter 130ms ease-out;
  }
  :global(.dark) .bulb-svg {
    filter: drop-shadow(0 0 18px rgba(255, 190, 100, 0.4));
  }

  .bulb-glow {
    left: -8px;
    top: 75px;
    width: 116px;
    height: 116px;
    border-radius: 9999px;
    background: radial-gradient(
      closest-side,
      rgba(255, 216, 130, 0.55),
      rgba(255, 190, 100, 0.2) 55%,
      transparent 100%
    );
    filter: blur(6px);
    opacity: 0;
    transition: opacity 130ms ease-out;
  }
  :global(.dark) .bulb-glow {
    opacity: 1;
    animation: light-switch-shimmer 4s ease-in-out infinite;
  }

  .bulb-wire {
    stroke: rgba(210, 216, 235, 0.35);
    stroke-width: 2.4;
  }
  .bulb-wire-braid {
    stroke: rgba(15, 17, 24, 0.6);
    stroke-width: 2.4;
    stroke-dasharray: 3 3;
  }
  .bulb-cap {
    fill: #3a3d49;
  }
  .bulb-socket {
    fill: #8f7a4f;
  }
  .bulb-socket-thread {
    stroke: rgba(0, 0, 0, 0.35);
    stroke-width: 1;
  }
  .bulb-glass {
    stroke: rgba(255, 232, 180, 0.55);
    stroke-width: 0.8;
  }
  .bulb-filament-post {
    stroke: rgba(160, 120, 70, 0.8);
    stroke-width: 1;
  }
  .bulb-filament {
    stroke: #8a7f70;
    stroke-width: 1.5;
    stroke-linecap: round;
    stroke-linejoin: round;
    filter: none;
    transition:
      stroke 130ms ease-out,
      filter 130ms ease-out;
  }
  :global(.dark) .bulb-filament {
    stroke: #ffcf7a;
    filter: drop-shadow(0 0 4px rgba(255, 190, 90, 0.95));
  }
  /* Grey glass overlay revealed the instant the lamp dies */
  .bulb-glass-dead {
    fill: #cfccc4;
    opacity: 0.88;
    transition: opacity 130ms ease-out;
  }
  :global(.dark) .bulb-glass-dead {
    opacity: 0;
  }
  .bulb-glint {
    stroke: rgba(255, 255, 255, 0.55);
    stroke-width: 1.6;
    stroke-linecap: round;
  }

  /* ---------------- pull cord ---------------- */

  .cord-sway {
    transform-origin: top center;
    animation: light-switch-sway 8s ease-in-out -2s infinite;
  }

  .cord-group {
    /* springy release */
    transition: transform 600ms cubic-bezier(0.18, 1.6, 0.4, 1);
  }
  .cord-group.pulled {
    transform: translateY(46px);
    /* taut, quick pull */
    transition: transform 170ms cubic-bezier(0.55, 0, 0.9, 0.7);
  }
  .cord-group:not(.pulled):hover {
    transform: translateY(4px);
  }

  .cord-rope {
    stroke: rgba(74, 62, 48, 0.55);
    stroke-width: 2.4;
  }
  :global(.dark) .cord-rope {
    stroke: rgba(215, 220, 238, 0.3);
  }
  .cord-rope-braid {
    stroke: rgba(255, 255, 255, 0.5);
    stroke-width: 2.4;
    stroke-dasharray: 2.5 2.5;
  }
  :global(.dark) .cord-rope-braid {
    stroke: rgba(10, 12, 18, 0.55);
  }
  .cord-knot {
    fill: #7a6248;
  }
  :global(.dark) .cord-knot {
    fill: #9a8062;
  }
  .cord-handle {
    fill: #a97c50;
    stroke: rgba(0, 0, 0, 0.28);
    stroke-width: 1;
  }
  :global(.dark) .cord-handle {
    fill: #c09468;
  }
  .cord-handle-shine {
    stroke: rgba(255, 255, 255, 0.4);
    stroke-width: 1.4;
    stroke-linecap: round;
  }
  .cord-group:focus-visible .cord-handle {
    stroke: var(--color-printer-accent);
    stroke-width: 2;
  }

  @keyframes light-switch-sway {
    0%,
    100% {
      transform: rotate(-0.9deg);
    }
    50% {
      transform: rotate(0.9deg);
    }
  }

  @keyframes light-switch-shimmer {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.82;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .bulb-sway,
    .cord-sway,
    .bulb-glow {
      animation: none !important;
    }
    .bulb-root {
      transition: none !important;
    }
  }
</style>
