"use client";

import { useEffect, useRef } from "react";
import "./technology-bar.css";

const TECHNOLOGIES = ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "NestJS", "Prisma", "PostgreSQL", "GSAP", "Three.js", "SQL", "Codex"];
const PIXELS_PER_SECOND = 35;

export default function TechnologyBar() {
  const root = useRef<HTMLElement>(null);
  const animation = useRef<Animation | null>(null);
  useEffect(() => {
    const bar = root.current!;
    const track = bar.querySelector<HTMLElement>(".technology-track")!;
    const list = track.querySelector<HTMLElement>(".technology-list")!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = true, frame = 0, alive = true, width = 0;
    const sync = () => {
      if (!visible || document.hidden || reduced.matches || bar.matches(":hover, :focus-within")) animation.current?.pause();
      else animation.current?.play();
    };
    const measure = () => {
      frame = 0;
      if (reduced.matches) { animation.current?.cancel(); animation.current = null; width = 0; delete bar.dataset.animated; return; }
      bar.dataset.animated = "true";
      const nextWidth = list.getBoundingClientRect().width;
      if (nextWidth === width && animation.current) { sync(); return; }
      const old = animation.current;
      const duration = width / PIXELS_PER_SECOND * 1000;
      const phase = duration && old ? (Number(old.currentTime || 0) % duration) / duration : 0;
      old?.cancel();
      width = nextWidth;
      try {
        animation.current = track.animate([{ transform: "translateX(0)" }, { transform: `translateX(-${width}px)` }], { duration: width / PIXELS_PER_SECOND * 1000, iterations: Infinity, easing: "linear" });
        animation.current.currentTime = phase * width / PIXELS_PER_SECOND * 1000;
        sync();
      } catch { delete bar.dataset.animated; }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    const resize = new ResizeObserver(schedule); resize.observe(list); resize.observe(bar);
    const observer = typeof IntersectionObserver !== "undefined" ? new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }) : undefined;
    observer?.observe(bar);
    const focusOut = () => queueMicrotask(() => { if (alive) sync(); });
    bar.addEventListener("pointerenter", sync); bar.addEventListener("pointerleave", sync);
    bar.addEventListener("focusin", sync); bar.addEventListener("focusout", focusOut);
    document.addEventListener("visibilitychange", sync); reduced.addEventListener("change", schedule);
    document.fonts.ready.then(() => { if (alive) schedule(); });
    measure();
    return () => {
      alive = false; cancelAnimationFrame(frame); animation.current?.cancel(); animation.current = null;
      resize.disconnect(); observer?.disconnect();
      bar.removeEventListener("pointerenter", sync); bar.removeEventListener("pointerleave", sync);
      bar.removeEventListener("focusin", sync); bar.removeEventListener("focusout", focusOut);
      document.removeEventListener("visibilitychange", sync); reduced.removeEventListener("change", schedule);
    };
  }, []);
  return <section className="technology-bar" ref={root} aria-labelledby="technology-label">
    <div className="technology-heading"><h2 id="technology-label">Technologies in my projects</h2>
    </div>
    <div className="technology-viewport"><div className="technology-track">
      {[false, true].map(duplicate => <ul className="technology-list" key={String(duplicate)} aria-hidden={duplicate || undefined}>{TECHNOLOGIES.map(name => <li key={name}>{name}<span aria-hidden="true">·</span></li>)}</ul>)}
    </div></div>
  </section>;
}
