"use client";

import { stickyRestTop, visualScrollY, scrollToPosition } from "../lib/portfolio-scroll";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import "./hero-overlap.css";
import { headlineProgress, foregroundOffset } from "./hero-overlap-motion";

// Same reveal movement spread over 40% more native scroll distance.
const HERO_OVERLAP_DISTANCE_MULTIPLIER = 1.4;

export default function HeroOverlap({ hero, children }: { hero: ReactNode; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const root = ref.current!;
    const hold = root.querySelector<HTMLElement>(".hero-hold")!;
    const runway = root.querySelector<HTMLElement>(".hero-runway")!;
    const incoming = root.querySelector<HTMLElement>(".hero-foreground")!;
    const expertise = hold.querySelector<HTMLElement>(".studio-expertise")!;
    const header = document.querySelector<HTMLElement>(".site-header");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = matchMedia("(min-width: 1001px) and (min-height: 700px)");
    let frame = 0;
    let alive = true;
    let scrollFrame = 0;
    let enabled = false;
    let start = 0;
    let distance = 0;
    let extra = 0;
    let offset = 0;
    const headline = hold.querySelector<HTMLElement>("#studio-title");
    let paintedProgress = -1;
    const progressAtScroll = () => distance > 0 ? Math.max(0, Math.min(1, (visualScrollY() - start) / distance)) : 1;
    // One native-scroll sample per frame; no delayed progress or settling loop.
    const update = () => {
      cancelAnimationFrame(scrollFrame); scrollFrame = 0;
      const progress = progressAtScroll();
      const textProgress = reduced.matches ? 0 : progress;
      if (headline && textProgress !== paintedProgress) {
        paintedProgress = textProgress;
        root.style.setProperty("--ambient-progress", String(textProgress));
        for (let i = 0; i < 3; i++) headline.style.setProperty(`--line-progress-${i}`, String(headlineProgress(textProgress, i)));
      }
      const next = enabled ? foregroundOffset(progress, extra) : 0;
      if (next !== offset || !root.style.getPropertyValue("--foreground-offset")) {
        offset = next;
        root.style.setProperty("--foreground-offset", `${offset}px`);
      }
    };
    const onScroll = () => { if (!reduced.matches && !document.hidden && !scrollFrame && (enabled || progressAtScroll() !== paintedProgress)) scrollFrame = requestAnimationFrame(update); };
    const measure = () => {
      frame = 0;
      const top = header ? header.offsetHeight + stickyRestTop(header) + 12 : 100;
      root.style.setProperty("--hero-rest", `${top}px`);
      root.style.setProperty("--expertise-height", `${expertise.offsetHeight}px`);
      const height = hold.getBoundingClientRect().height;
      const viewport = Math.min(innerHeight, window.visualViewport?.height ?? innerHeight);
      enabled = desktop.matches && !reduced.matches && height <= viewport - top - 12;
      distance = height * HERO_OVERLAP_DISTANCE_MULTIPLIER;
      extra = distance - height;
      start = visualScrollY() + runway.getBoundingClientRect().top + parseFloat(getComputedStyle(runway).paddingTop) - top;
      root.style.setProperty("--hero-height", `${height}px`);
      root.style.setProperty("--hero-travel", `${distance}px`);
      root.dataset.overlap = String(enabled);
      update();
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    const observer = new ResizeObserver(schedule);
    observer.observe(hold); observer.observe(expertise);
    if (header) observer.observe(header);
    // Reverse keyboard navigation must not focus a hero link behind the paper layer.
    const revealFocus = (event: FocusEvent) => {
      if (root.dataset.overlap !== "true" || !(event.target instanceof HTMLElement)) return;
      if (incoming.getBoundingClientRect().top < event.target.getBoundingClientRect().bottom + 12) {
        const top = parseFloat(getComputedStyle(root).getPropertyValue("--hero-rest"));
        scrollToPosition({ top: Math.max(0, visualScrollY() + runway.getBoundingClientRect().top - top), behavior: "instant" });
        update();
      }
    };
    // Native anchors and keyboard focus must land in the final, unshifted flow.
    const revealIncoming = (target: HTMLElement) => {
      if (!enabled || offset === 0) return;
      const clearance = parseFloat(getComputedStyle(target).scrollMarginTop) || parseFloat(getComputedStyle(root).getPropertyValue("--hero-rest")) + 16;
      const destination = visualScrollY() + target.getBoundingClientRect().top - offset - clearance;
      scrollToPosition({ top: Math.max(start + distance, destination), behavior: "instant" });
      update();
    };
    const incomingFocus = (event: FocusEvent) => { if (event.target instanceof HTMLElement) revealIncoming(event.target); };
    const followHash = () => {
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target && incoming.contains(target)) revealIncoming(target);
    };
    const visibility = () => update();
    document.addEventListener("visibilitychange", visibility);
    hold.addEventListener("focusin", revealFocus);
    incoming.addEventListener("focusin", incomingFocus);
    window.addEventListener("hashchange", followHash);
    window.addEventListener("portfolio-scroll", onScroll, { passive: true });
    window.addEventListener("resize", schedule);
    window.visualViewport?.addEventListener("resize", schedule);
    reduced.addEventListener("change", schedule); desktop.addEventListener("change", schedule);
    document.fonts.ready.then(() => { if (alive) schedule(); });
    measure();
    followHash();
    return () => {
      alive = false; cancelAnimationFrame(frame); cancelAnimationFrame(scrollFrame); observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      hold.removeEventListener("focusin", revealFocus);
      incoming.removeEventListener("focusin", incomingFocus);
      window.removeEventListener("hashchange", followHash);
      window.removeEventListener("portfolio-scroll", onScroll);
      window.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("resize", schedule);
      reduced.removeEventListener("change", schedule); desktop.removeEventListener("change", schedule);
    };
  }, []);
  return <div className="hero-overlap" ref={ref}>
    <div className="hero-runway"><div className="hero-hold">{hero}</div></div>
    <div className="hero-foreground">{children}</div>
  </div>;
}
