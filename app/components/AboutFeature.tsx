"use client";

import Link from "next/link";
import AlienSculpture from "./AlienSculpture";
import TechnologyBar from "./TechnologyBar";
import { useEffect, useRef } from "react";
import "./about-feature.css";

export default function AboutFeature() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const section = ref.current!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = matchMedia("(min-width: 901px)");
    const running = new Set<Animation>();
    let entered = false;
    const finish = () => { running.forEach(animation => animation.cancel()); running.clear(); };
    const reveal = () => {
      if (entered) return;
      entered = true;
      if (reduced.matches) return;
      const layers = [[".about-feature-heading", 14, 0], [".about-feature-portrait", 18, 70], [".about-feature-background", 10, 130], [".about-feature-approach", 10, 200]] as const;
      layers.forEach(([selector, movement, delay]) => {
        try {
          const animation = section.querySelector(selector)!.animate([
            { opacity: 0, transform: `translateY(${desktop.matches ? movement : 6}px)` },
            { opacity: 1, transform: "translateY(0)" },
          ], { duration: selector === ".about-feature-portrait" ? 700 : 550, delay: desktop.matches ? delay : 0, easing: "cubic-bezier(.2,.7,.2,1)", fill: "backwards" });
          running.add(animation);
          animation.onfinish = () => { running.delete(animation); animation.cancel(); };
        } catch { finish(); }
      });
    };
    const observer = typeof IntersectionObserver !== "undefined" ? new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) reveal(); else if (entered) finish();
    }, { threshold: .08 }) : undefined;
    observer?.observe(section);
    const visibility = () => { if (document.hidden) finish(); };
    section.addEventListener("focusin", finish);
    reduced.addEventListener("change", finish);
    document.addEventListener("visibilitychange", visibility);
    return () => { finish(); observer?.disconnect(); section.removeEventListener("focusin", finish); reduced.removeEventListener("change", finish); document.removeEventListener("visibilitychange", visibility); };
  }, []);

  return <><TechnologyBar /><section className="about-feature" id="about-preview" aria-labelledby="about-preview-title" ref={ref}>
    <div className="about-feature-inner">
      <header className="about-feature-heading">
        <p className="about-feature-eyebrow">On-screen experience</p>
        <h2 id="about-preview-title">Technical thinking.<br/>Creative work.</h2>
      </header>
      <div className="about-feature-composition">
        <div className="about-feature-portrait">
          <AlienSculpture />
        </div>
        <div className="about-feature-note about-feature-background">
          <h3>Independent product building</h3>
          <p>I’m Anchal Sharma, a B.Tech Computer Science Engineering student at Rayat Bahra University, Mohali, with expected graduation in 2027. My independent projects explore how digital products can make business information and everyday workflows easier to manage.</p>
        </div>
        <div className="about-feature-note about-feature-approach">
          <h3>Product and business thinking</h3>
          <p>My interests connect AI-assisted product building, interface clarity and entrepreneurship. I focus on product requirements, workflow decisions and iterative review while deepening my understanding of each project's behaviour, limitations and business context.</p>
        </div>
      </div>
      <ul className="about-feature-facts" aria-label="Experience at a glance"><li>Independent projects</li><li>2 products + portfolio</li><li>B.Tech CSE · Expected 2027</li></ul>
      <Link className="about-feature-link" href="/about">Explore my background <span aria-hidden="true">↗</span></Link>
    </div>
  </section></>;
}
