"use client";

import { useEffect, useRef } from "react";
import "./studio-ambient-glow.css";

export default function StudioAmbientGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const layer = ref.current;
    if (!layer || typeof IntersectionObserver === "undefined") return;
    let visible = false;
    let covered = false;
    const hero = layer.closest<HTMLElement>(".creative-studio");
    const sync = () => {
      const running = String(visible && !covered && !document.hidden);
      layer.dataset.running = running;
      if (hero) hero.dataset.decorativeRunning = running;
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(layer);
    // Sticky content can remain in the viewport while Projects covers it.
    // Observe that coverage without participating in the scroll-progress calculation.
    const foreground = layer.closest(".hero-overlap")?.querySelector(".hero-foreground");
    const coverObserver = new IntersectionObserver(([entry]) => { covered = entry.isIntersecting; sync(); }, { rootMargin: "0px 0px -95% 0px" });
    if (foreground) coverObserver.observe(foreground);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect(); coverObserver.disconnect();
      if (hero) delete hero.dataset.decorativeRunning;
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);
  return <div ref={ref} className="studio-ambient" aria-hidden="true">
    <div className="studio-orbit-grid" />
    <div className="studio-orbit-glow" />
    <div className="studio-orbit studio-orbit-outer" />
    <div className="studio-orbit studio-orbit-inner" />
  </div>;
}
