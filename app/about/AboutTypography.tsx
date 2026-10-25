"use client";

import { visualScrollY } from "../lib/portfolio-scroll";
import { useEffect, useRef, type CSSProperties } from 'react';
import './about-typography.css';

// Words and deterministic palette are editable here. This is an independent
// implementation of the supplied brief; no demo/CDN code or GSAP controls are used.
export const aboutWords = ['design.', 'prototype.', 'solve.', 'build.', 'develop.', 'debug.', 'learn.', 'cook.', 'ship.', 'prompt.', 'collaborate.', 'create.', 'inspire.', 'follow.', 'innovate.', 'test.', 'optimize.', 'teach.', 'visualize.', 'transform.', 'scale.', 'do it.'];
export const aboutPalette = { hueStart: 260, hueEnd: 20, saturation: 90, lightness: 70 };

export default function AboutTypography() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const section = root.current!;
    const layout = section.querySelector<HTMLElement>('.about-word-layout')!;
    const prefix = section.querySelector<HTMLElement>('.about-word-prefix')!;
    const items = Array.from(section.querySelectorAll<HTMLElement>('.about-word-list li'));
    const header = document.querySelector<HTMLElement>('.site-header');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let centers: number[] = [], top = 0, bottom = 0, stickyTop = 0, lineHeight = 1;
    let frame = 0, visible = false, disposed = false;
    const update = () => {
      frame = 0;
      if (!visible || document.hidden) return;
      // The same clamped line follows CSS sticky entry and release, including endpoints.
      const center = Math.min(Math.max(visualScrollY() + stickyTop, top), bottom - lineHeight) + lineHeight / 2;
      items.forEach((item, index) => {
        const proximity = reduced.matches ? 1 : Math.max(0, 1 - Math.abs(centers[index] - center) / (lineHeight * 1.25));
        item.style.opacity = String(reduced.matches ? 1 : .2 + .8 * proximity * proximity);
      });
    };
    const measure = () => {
      if (disposed) return;
      const headerBottom = header?.getBoundingClientRect().bottom || 88;
      lineHeight = items[0].getBoundingClientRect().height;
      const alignment = headerBottom + (innerHeight - headerBottom) * .48;
      stickyTop = Math.max(headerBottom + 20, alignment - lineHeight / 2);
      section.style.setProperty('--word-sticky-top', `${stickyTop}px`);
      const contentTop = section.getBoundingClientRect().top + visualScrollY() + parseFloat(getComputedStyle(section).paddingTop);
      section.style.setProperty('--word-lead', `${Math.max(24, stickyTop - contentTop)}px`);
      // Read only after responsive spacing has settled; these are document coordinates.
      const bounds = layout.getBoundingClientRect();
      top = bounds.top + visualScrollY(); bottom = bounds.bottom + visualScrollY();
      centers = items.map(item => { const r = item.getBoundingClientRect(); return r.top + visualScrollY() + r.height / 2; });
      update();
    };
    const schedule = () => { if (visible && !document.hidden && !frame) frame = requestAnimationFrame(update); };
    const visibility = () => { if (document.hidden) {cancelAnimationFrame(frame);frame=0;} else schedule(); };
    const observer = new IntersectionObserver(([entry]) => {visible = entry.isIntersecting;if(visible)update();else{cancelAnimationFrame(frame);frame=0;}});
    observer.observe(section);
    const resize = new ResizeObserver(measure);resize.observe(layout);resize.observe(prefix);if(header)resize.observe(header);
    window.addEventListener('portfolio-scroll', schedule, {passive:true});window.addEventListener('resize',measure);
    document.addEventListener('visibilitychange',visibility);reduced.addEventListener('change',measure);
    measure();document.fonts.ready.then(()=>{if(!disposed)measure();});
    return()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();resize.disconnect();window.removeEventListener('portfolio-scroll',schedule);window.removeEventListener('resize',measure);document.removeEventListener('visibilitychange',visibility);reduced.removeEventListener('change',measure);};
  }, []);
  return <section className="about-typography" id="about-top" ref={root} aria-label="We can create something new">
    <div className="about-word-grid" aria-hidden="true" />
    <div className="about-word-inner">
      <h1 className="about-word-accessible">We can {aboutWords.map(word=>word.replace(/\.$/,'')).join(', ')}. Let’s talk about your next project.</h1>
      <div className="about-word-layout" aria-hidden="true">
        <p className="about-word-prefix">we can</p>
        <ul className="about-word-list">{aboutWords.map((word,index)=>{
          const hue=aboutPalette.hueStart+(aboutPalette.hueEnd-aboutPalette.hueStart)*index/(aboutWords.length-1);
          return <li key={word} style={{'--word-colour':`hsl(${hue} ${aboutPalette.saturation}% ${aboutPalette.lightness}%)`} as CSSProperties}>{word}</li>;
        })}</ul>
      </div>
    </div>
  </section>;
}
