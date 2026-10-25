"use client";

import { useEffect, useRef } from "react";
import { skillGroups } from "./profile-data";

export default function CapabilityRows() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    if (!root.current || media.matches || !window.IntersectionObserver) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        // Animate only after intersection; HTML remains visible if enhancement fails.
        Array.from(entry.target.children).forEach((element, index) => {
          if (!element.animate) return;
          const animation = element.animate([
            { opacity: 0, transform: "translateY(8px)" },
            { opacity: 1, transform: "translateY(0)" },
          ], { duration: 380, delay: index * 45, easing: "cubic-bezier(.2,.7,.2,1)", fill: "backwards" });
          animations.add(animation);
          animation.onfinish = () => animations.delete(animation);
        });
      }
    }, { threshold: .12 });
    root.current.querySelectorAll(".discipline-row").forEach(row => observer.observe(row));
    const stop = () => {
      if (media.matches) { observer.disconnect(); animations.forEach(animation => animation.cancel()); animations.clear(); }
    };
    media.addEventListener("change", stop);
    return () => { observer.disconnect(); media.removeEventListener("change", stop); animations.forEach(animation => animation.cancel()); };
  }, []);

  return <div className="capability-editorial-list" ref={root}>{skillGroups.map((group, index) => {
    return <article className="discipline-row capability-editorial-row" key={group.id} id={group.id} aria-labelledby={`${group.id}-title`}>
      <div className="discipline-copy">
        <p className="capability-index">{String(index + 1).padStart(2, "0")} / {group.label}</p>
        <h3 id={`${group.id}-title`}>{group.title}</h3>
        <p className="discipline-description">{group.description}</p>
      </div>
      <div className="capability-editorial-skills">
        <p>Focus areas <span>→</span></p>
        <ul>{group.skills.map(item => <li key={item}>{item}</li>)}</ul>
      </div>
    </article>;
  })}</div>;
}
