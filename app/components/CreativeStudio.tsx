"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import StudioAmbientGlow from "./StudioAmbientGlow";
import StudioSocials from "./StudioSocials";
import "./creative-studio.css";

const skills = [
  ["Digital Product Builder", "Ideas, workflows & prototypes", "/work"],
  ["AI-Assisted Building", "Requirements, workflows & review", "/work"],
  ["Interface Thinking", "Clarity, structure & usability", "/work"],
  ["Business Thinking", "Practical needs & product value", "/work"],
] as const;

export default function CreativeStudio() {
  const section = useRef<HTMLElement>(null);
  const portrait = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".site-header");
    if (!header) return;
    const measure = () => {
      const css = getComputedStyle(header);
      const bounds = header.getBoundingClientRect();
      section.current?.closest<HTMLElement>(".home-page")?.style.setProperty("--studio-content-width", `${bounds.width - parseFloat(css.paddingLeft) - parseFloat(css.paddingRight)}px`);
      const height = header.offsetHeight + (parseFloat(css.marginTop) || 0) + (parseFloat(css.marginBottom) || 0);
      section.current?.style.setProperty("--studio-header-space", `${height}px`);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    window.addEventListener("resize", measure);
    measure();
    return () => { observer.disconnect(); window.removeEventListener("resize", measure); };
  }, []);

  useEffect(() => {
    const panel = portrait.current!;
    const media = matchMedia("(min-width: 761px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    let x = 0;
    let y = 0;
    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      panel.style.setProperty("--tilt-x", "0deg");
      panel.style.setProperty("--tilt-y", "0deg");
    };
    const move = (event: PointerEvent) => {
      if (!media.matches || event.pointerType !== "mouse") return;
      const rect = panel.parentElement!.getBoundingClientRect();
      x = Math.max(-3, Math.min(3, -(event.clientY - rect.top - rect.height / 2) / rect.height * 6));
      y = Math.max(-3, Math.min(3, (event.clientX - rect.left - rect.width / 2) / rect.width * 6));
      if (!frame) frame = requestAnimationFrame(() => {
        frame = 0;
        panel.style.setProperty("--tilt-x", `${x}deg`);
        panel.style.setProperty("--tilt-y", `${y}deg`);
      });
    };
    const host = panel.parentElement!;
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", reset);
    host.addEventListener("pointercancel", reset);
    media.addEventListener("change", reset);
    window.addEventListener("blur", reset);
    return () => {
      reset();
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", reset);
      host.removeEventListener("pointercancel", reset);
      media.removeEventListener("change", reset);
      window.removeEventListener("blur", reset);
    };
  }, []);

  return <section ref={section} className="creative-studio" id="home" aria-labelledby="studio-title">
    <StudioAmbientGlow />
    <div className="studio-main">
      <div className="studio-intro">
        <p className="studio-kicker">PRODUCTS • WORKFLOWS • AI • BUSINESS</p>
        <h1 id="studio-title"><span>Think</span><span>Bold<span className="studio-dot">.</span></span><span className="studio-build">Build better<span className="studio-dot">.</span></span></h1>
        <p className="studio-copy">I turn business ideas into digital products<br className="studio-copy-break" /> through product thinking and AI-assisted building.</p>
        <div className="studio-actions">
          <Link href="/work" className="studio-primary home-button">View My Work <span aria-hidden="true">↗</span></Link>
          <Link href="/contact" className="studio-secondary home-button">Let’s Talk <span aria-hidden="true">↗</span></Link>
        </div>
        <StudioSocials />
      </div>
      <div className="studio-visual">
        <div ref={portrait} className="studio-portrait-panel studio-photo-panel" aria-hidden="true">
        <span className="studio-orange-backdrop" aria-hidden="true" />
        </div>
      </div>
    </div>

  </section>;
}

export function StudioExpertise() {
  return (<div className="studio-expertise">
      <p className="studio-selector-heading">What I do</p>
      <div className="studio-skills" aria-label="Four disciplines">
        {skills.map(([title, description, href], i) => <Link href={href} key={title}>
          <span className="studio-number">0{i + 1}</span>
          <h2>{title}</h2><span className="studio-skill-arrow" aria-hidden="true">↗</span>
          <p>{description}</p>
        </Link>)}
      </div>
    </div>);
}
