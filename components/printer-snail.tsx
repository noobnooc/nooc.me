"use client";

import { useEffect, useRef } from "react";

/**
 * A small decorative snail that slowly crawls back and forth along the very top
 * edge of the printer shell.
 *
 * The turn-around is the tricky part: rotating a flat SVG about the Y axis goes
 * razor-thin at 90°, which reads as a flipping sheet of paper. Instead, the body
 * (foot + shell) stays put and only the head + eye-stalks sweep from one end to
 * the other, passing through a "looking-at-you" pose in the middle. It is a
 * continuous in-plane translate + lean — it never thins out, so it reads as the
 * snail physically turning its head around rather than a card flipping.
 *
 * Everything is driven from one requestAnimationFrame clock so we can:
 *  - keep the motion slow,
 *  - run the muscular squash only while travelling (never during the turn),
 *  - and leave the shell completely static.
 */
export default function PrinterSnail() {
  const laneRef = useRef<HTMLDivElement>(null);
  const walkerRef = useRef<HTMLDivElement>(null);
  const softRef = useRef<SVGGElement>(null);
  const headRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const lane = laneRef.current;
    const walker = walkerRef.current;
    const soft = softRef.current;
    const head = headRef.current;
    if (!lane || !walker || !soft || !head) return;

    // Timing / pose constants
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
        lift = -Math.sin(Math.PI * p) * 5; // rise so the eyes peek over the shell
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
  }, []);

  return (
    <div className="snail-lane" ref={laneRef} aria-hidden="true">
      <div className="snail-walker" ref={walkerRef}>
        <svg
          className="snail-svg"
          viewBox="0 0 60 36"
          preserveAspectRatio="xMidYMax meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Foot (symmetric) — muscular squash is applied here while crawling */}
          <g className="snail-soft" ref={softRef}>
            <path
              className="snail-foot"
              d="M8 34 C3.5 34 3.5 29.4 9 28.2 C18 26.5 42 26.5 51 28.2 C56.5 29.4 56.5 34 52 34 Z"
            />
          </g>

          {/* Head + eye-stalks — drawn BEFORE the shell so it ducks behind the
              shell during the turn instead of riding over it. Drawn centered;
              JS sweeps it to the leading end. */}
          <g className="snail-head" ref={headRef}>
            <path
              className="snail-neck"
              d="M24.5 31 C23.5 25 25 22.8 30 22.8 C35 22.8 36.5 25 35.5 31 Z"
            />
            <g className="snail-stalk snail-stalk-back">
              <path
                className="snail-stalk-line"
                fill="none"
                d="M28 24 C27 19 26.8 15 26.5 11"
              />
              <circle className="snail-eye" cx="26.5" cy="10.4" r="2.4" />
              <circle className="snail-eye-pupil" cx="27" cy="10.1" r="1.05" />
            </g>
            <g className="snail-stalk snail-stalk-front">
              <path
                className="snail-stalk-line"
                fill="none"
                d="M32 23.6 C33 18 33.4 14 33.8 9.2"
              />
              <circle className="snail-eye" cx="33.8" cy="8.8" r="2.6" />
              <circle className="snail-eye-pupil" cx="34.4" cy="8.4" r="1.2" />
            </g>
          </g>

          {/* Shell — completely static, drawn last so it sits over the head */}
          <g className="snail-shell">
            <circle className="snail-shell-disc" cx="30" cy="19" r="12" />
            <path
              className="snail-shell-spiral"
              fill="none"
              d="M30 19 C30 16.6 33 16.6 33 19.6 C33 23.6 27 23.6 27 18.6 C27 13.2 35.6 13.2 35.6 19.6 C35.6 27 23 27 23 18.6 C23 10.2 38.6 10.2 38.6 19.6"
            />
            <ellipse className="snail-shell-shine" cx="25" cy="13.5" rx="3" ry="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}
