"use client";

import { visualScrollY, scrollToPosition } from "../lib/portfolio-scroll";

import { useEffect, useRef, type ReactNode } from "react";
import "./footer-reveal.css";

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const phase = (progress: number, start: number, end: number) => {
  const value = clamp((progress - start) / (end - start));
  return value * value * (3 - 2 * value);
};

export default function FooterReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = ref.current!;
    const footer = wrapper.querySelector<HTMLElement>(".site-footer")!;
    const lastSlide = document.querySelector<HTMLElement>(".home-final-slide");
    const lastSection = lastSlide?.querySelector<HTMLElement>(".contact-cta");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const roomy = matchMedia("(min-width: 768px) and (min-height: 760px)");
    let frame = 0;
    let enabled = false;
    const layers = [
      { selector: ".footer-left", start: 0.15, end: 0.6, y: 60, opacity: 0.35, scale: true },
      { selector: ".footer-right p", start: 0.15, end: 0.5, y: 36, opacity: 0.5 },
      { selector: ".footer-cta", start: 0.22, end: 0.58, y: 42, opacity: 0.5 },
      ...Array.from({ length: 4 }, (_, i) => ({ selector: `.footer-contact-link:nth-child(${i + 1})`, start: 0.3 + i * 0.025, end: 0.66 + i * 0.025, y: 20, opacity: 0.6 })),
      { selector: ".footer-meta", start: 0.38, end: 0.75, y: 16, opacity: 0.6 },
    ].map(layer => ({ ...layer, element: wrapper.querySelector<HTMLElement>(layer.selector)! }));

    const update = () => {
      frame = 0;
      const rect = wrapper.getBoundingClientRect();
      const top = parseFloat(getComputedStyle(wrapper).scrollMarginTop) || 0;
      // The footer owns its full document space. Its boundary never crosses main.
      const progress = clamp((innerHeight - rect.top) / Math.min(footer.offsetHeight, innerHeight - top));

      const motion = !reduced.matches;
      const distance = innerWidth <= 980 ? 0.6 : 1;
      layers.forEach(layer => {
        const settled = motion ? phase(progress, enabled ? layer.start : 0, enabled ? layer.end : 0.65) : 1;
        layer.element.style.setProperty("--footer-y", `${(1 - settled) * (enabled ? layer.y * distance : 12)}px`);
        layer.element.style.setProperty("--footer-opacity", String(layer.opacity + (1 - layer.opacity) * settled));
        layer.element.style.setProperty("--footer-scale", String(enabled && 'scale' in layer ? 0.97 + 0.03 * settled : 1));
      });
      const nameProgress = motion && enabled ? phase(progress, 0.15, 1) : 1;
      footer.style.setProperty("--footer-name-y", `${(1 - nameProgress) * 24}px`);
      footer.style.setProperty("--footer-name-x", `${(1 - nameProgress) * 18 * distance}px`);
      footer.style.setProperty("--footer-line", String(motion ? phase(progress, 0, 0.75) : 1));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const measure = () => {
      const top = parseFloat(getComputedStyle(wrapper).scrollMarginTop) || 0;
      // Fall back to flow if text enlargement or content makes the footer too tall.
      enabled = roomy.matches && !reduced.matches && footer.offsetHeight <= innerHeight - top + 1;
      wrapper.dataset.layered = String(enabled);
      wrapper.style.setProperty("--footer-height", `${footer.offsetHeight}px`);
      if (lastSlide && lastSection) {
        const fits = roomy.matches && !reduced.matches && lastSection.offsetHeight <= innerHeight - top + 1;
        lastSlide.dataset.sticky = String(fits);
        lastSlide.style.setProperty("--slide-height", `${lastSection.offsetHeight}px`);
      }
      schedule();
    };
    const revealFocusedLink = () => {
      if (!enabled) return;
      const top = parseFloat(getComputedStyle(wrapper).scrollMarginTop) || 0;
      const destination = visualScrollY() + wrapper.getBoundingClientRect().top - top;
      if (visualScrollY() < destination) scrollToPosition({ top: destination, behavior: "instant" });
    };
    wrapper.addEventListener("focusin", revealFocusedLink);
    const observer = new ResizeObserver(measure);
    observer.observe(footer);
    if (lastSection) observer.observe(lastSection);
    window.addEventListener("portfolio-scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    reduced.addEventListener("change", measure);
    roomy.addEventListener("change", measure);
    measure();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      wrapper.removeEventListener("focusin", revealFocusedLink);
      window.removeEventListener("portfolio-scroll", schedule);
      window.removeEventListener("resize", measure);
      reduced.removeEventListener("change", measure);
      roomy.removeEventListener("change", measure);
    };
  }, []);

  return <div className="footer-reveal" ref={ref}>{children}</div>;
}
