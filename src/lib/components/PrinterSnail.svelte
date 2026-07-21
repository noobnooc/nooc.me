<script lang="ts">
  import { onMount } from "svelte";

  /**
   * A small decorative robo-snail that slowly crawls back and forth along the
   * very top edge of the printer shell. It's built from the printer's own
   * parts: a plastic body, antenna LEDs for eyes, and a roll of thermal paper
   * for a shell.
   *
   * The turn-around is the tricky part: rotating a flat SVG about the Y axis
   * goes razor-thin at 90°, which reads as a flipping sheet of paper. Instead,
   * the body (foot + shell) stays put and only the head + antennas sweep
   * from one end to the other, passing through a "looking-at-you" pose in the
   * middle. It never thins out, so it reads as the snail physically turning
   * its head around rather than a card flipping.
   */
  let lane: HTMLDivElement;
  let walker: HTMLDivElement;
  let soft: SVGGElement;
  let head: SVGGElement;

  onMount(() => {
    const TRAVEL = 46000; // ms to cross the top once (very slow)
    const TURN = 2400; // ms for the head to sweep to the other end
    const PERIOD = 2 * TRAVEL + 2 * TURN;
    const REST_LEAN = 12; // deg the head leans into the travel direction
    const HEAD_REACH = 14; // user-units the head sits ahead of the shell
    const HEAD_PIVOT = "30 28"; // neck base, in svg user units

    const easeInOut = (p: number) => 0.5 - 0.5 * Math.cos(Math.PI * p);

    const setSoft = (sx: number, sy: number) =>
      soft.setAttribute(
        "transform",
        `translate(30 34) scale(${sx.toFixed(4)} ${sy.toFixed(4)}) translate(-30 -34)`,
      );
    const setHead = (side: number, lift: number, lean: number) =>
      head.setAttribute(
        "transform",
        `translate(${(side * HEAD_REACH).toFixed(3)} ${lift.toFixed(3)}) rotate(${lean.toFixed(3)} ${HEAD_PIVOT})`,
      );

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Rest pose: centered, facing right.
    const placeStatic = () => {
      walker.style.transform = `translate3d(${(span / 2).toFixed(2)}px,0,0)`;
      setSoft(1, 1);
      setHead(1, 0, REST_LEAN);
    };

    // Travel range — kept fresh with a ResizeObserver so it survives the
    // initial layout settling and responsive width changes.
    let span = 0;
    const measure = () => {
      span = Math.max(0, lane.clientWidth - walker.offsetWidth);
      if (reduce.matches) placeStatic();
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(lane);
    ro.observe(walker);

    let raf = 0;
    let start = 0;

    const frame = (now: number) => {
      if (!start) start = now;
      measure(); // cheap read; self-heals across initial layout settling
      const t = (now - start) % PERIOD;

      let posPx: number;
      let side: number; // +1 head at right end, -1 at left end
      let lean: number; // deg
      let lift = 0; // head lift during the turn (user units, negative = up)
      let crawl = -1; // travel progress 0..1, or -1 while turning

      if (t < TRAVEL) {
        const p = t / TRAVEL;
        posPx = p * span;
        side = 1;
        lean = REST_LEAN;
        crawl = p;
      } else if (t < TRAVEL + TURN) {
        const p = (t - TRAVEL) / TURN;
        const e = easeInOut(p);
        posPx = span;
        side = 1 - 2 * e; // +1 -> -1
        lean = REST_LEAN * (1 - 2 * e); // lean right -> upright -> lean left
        lift = -Math.sin(Math.PI * p) * 5; // rise so the LEDs peek over the roll
      } else if (t < 2 * TRAVEL + TURN) {
        const p = (t - (TRAVEL + TURN)) / TRAVEL;
        posPx = (1 - p) * span;
        side = -1;
        lean = -REST_LEAN;
        crawl = p;
      } else {
        const p = (t - (2 * TRAVEL + TURN)) / TURN;
        const e = easeInOut(p);
        posPx = 0;
        side = -1 + 2 * e; // -1 -> +1
        lean = -REST_LEAN * (1 - 2 * e);
        lift = -Math.sin(Math.PI * p) * 3;
      }

      let sx = 1;
      let sy = 1;
      let bob = 0;
      if (crawl >= 0) {
        // Peristaltic squash + a faint bob — only while travelling.
        const w = Math.sin(crawl * (TRAVEL / 1500) * Math.PI * 2);
        sx = 1 + 0.03 * w;
        sy = 1 - 0.03 * w;
        bob = -Math.max(0, -w) * 0.5;
      }

      walker.style.transform = `translate3d(${posPx.toFixed(2)}px, ${bob.toFixed(2)}px, 0)`;
      setSoft(sx, sy);
      setHead(side, lift, lean);

      raf = requestAnimationFrame(frame);
    };

    if (reduce.matches) {
      placeStatic();
      return () => ro.disconnect();
    }

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf) {
        start = 0;
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  });
</script>

<div class="snail-lane" bind:this={lane} aria-hidden="true">
  <div class="snail-walker" bind:this={walker}>
    <svg
      class="snail-svg"
      viewBox="0 0 60 36"
      preserveAspectRatio="xMidYMax meet"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Foot (symmetric) — muscular squash is applied here while crawling.
           A dashed tread line makes it read as a soft rubber track. -->
      <g class="snail-soft" bind:this={soft}>
        <path
          class="snail-foot"
          d="M8 34 C3.5 34 3.5 29.4 9 28.2 C18 26.5 42 26.5 51 28.2 C56.5 29.4 56.5 34 52 34 Z"
        />
        <path class="snail-tread" fill="none" d="M10.5 32.3 H49.5" />
      </g>

      <!-- Head + antenna LEDs — drawn BEFORE the shell so it ducks behind the
           paper roll during the turn instead of riding over it. Drawn
           centered; JS sweeps it to the leading end. -->
      <g class="snail-head" bind:this={head}>
        <path
          class="snail-neck"
          d="M24.5 31 C23.5 25 25 22.8 30 22.8 C35 22.8 36.5 25 35.5 31 Z"
        />
        <path class="snail-seam" fill="none" d="M26.8 26.6 C28.2 25.7 31.8 25.7 33.2 26.6" />
        <g class="snail-stalk snail-stalk-back">
          <path
            class="snail-stalk-line"
            fill="none"
            d="M28 24 C27 19 26.8 15 26.5 11"
          />
          <circle class="snail-led snail-led-back" cx="26.5" cy="10.4" r="2" />
          <circle class="snail-led-glint" cx="27.1" cy="9.8" r="0.55" />
        </g>
        <g class="snail-stalk snail-stalk-front">
          <path
            class="snail-stalk-line"
            fill="none"
            d="M32 23.6 C33 18 33.4 14 33.8 9.2"
          />
          <circle class="snail-led snail-led-front" cx="33.8" cy="8.8" r="2.2" />
          <circle class="snail-led-glint" cx="34.5" cy="8.2" r="0.6" />
        </g>
      </g>

      <!-- Shell: a roll of thermal paper on a spindle — completely static,
           drawn last so it sits over the head -->
      <g class="snail-shell">
        <circle class="snail-roll" cx="30" cy="19" r="12" />
        <path
          class="snail-roll-spiral"
          fill="none"
          d="M30 19 C30 16.6 33 16.6 33 19.6 C33 23.6 27 23.6 27 18.6 C27 13.2 35.6 13.2 35.6 19.6 C35.6 27 23 27 23 18.6 C23 10.2 38.6 10.2 38.6 19.6"
        />
        <circle class="snail-roll-core" cx="30" cy="19" r="2.7" />
        <circle class="snail-roll-hole" cx="30" cy="19" r="1.1" />
        <rect
          class="snail-roll-tape"
          x="35.9"
          y="9.9"
          width="5.6"
          height="3"
          rx="1"
          transform="rotate(40 38.7 11.4)"
        />
        <ellipse class="snail-roll-shine" cx="25" cy="13.5" rx="3" ry="2" />
      </g>
    </svg>
  </div>
</div>
