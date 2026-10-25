"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function BusinessMotion() {
  useEffect(() => {
    const page = document.querySelector<HTMLElement>(".business-page");
    if (!page || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    page.classList.add("motion-ready");
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }), { threshold: 0.12, rootMargin: "0px 0px -6%" });
    page.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => observer.observe(element));
    const hero = page.querySelector<HTMLElement>(".b-journey-hero");
    const path = hero?.querySelector<HTMLElement>(".b-journey-path");
    const signal = hero?.querySelector<HTMLElement>(".b-journey-signal");
    const nodes = hero ? Array.from(hero.querySelectorAll<HTMLElement>(".b-journey-nodes li")) : [];
    const caption = hero?.querySelector<HTMLElement>(".b-journey-caption");
    const ctx = gsap.context(() => {
      if (!hero || !path || !signal || !caption || !nodes.length) return;
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .fromTo(".b-hero-details, .b-hero-footer", { opacity: 0 }, { opacity: 1, duration: .55 })
        .fromTo(".b-hero-copy .eyebrow", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .55 }, "-=.35")
        .fromTo(".b-hero-copy h1 span", { opacity: 0, yPercent: 115 }, { opacity: 1, yPercent: 0, duration: .82, stagger: .12 }, "-=.25")
        .fromTo(".b-hero-copy > p:last-child", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .55 }, "-=.5")
        .fromTo(path, { scaleY: 0 }, { scaleY: 1, duration: 1.35, transformOrigin: "top" }, "-=.55")
        .fromTo(nodes, { opacity: 0, x: 22 }, { opacity: 1, x: 0, duration: .52, stagger: .14 }, "-=.95");
      gsap.to(signal, { top: "100%", duration: 5.5, ease: "none", repeat: -1, repeatDelay: .8 });
      ScrollTrigger.create({ trigger: hero, start: "top top", end: "bottom top", scrub: .35, onUpdate: (self) => {
        const index = Math.min(nodes.length - 1, Math.floor(self.progress * nodes.length));
        nodes.forEach((node, nodeIndex) => node.classList.toggle("is-active", nodeIndex === index));
        caption.textContent = nodes[index].dataset.caption ?? "";
        gsap.set(signal, { top: `${Math.max(4, self.progress * 100)}%` });
      }});
      const move = (event: PointerEvent) => {
        if (window.innerWidth <= 680) return;
        const x = (event.clientX / window.innerWidth - .5) * 10, y = (event.clientY / window.innerHeight - .5) * 8;
        gsap.to(".b-journey-visual", { x, y, duration: .8, ease: "power2.out" });
        gsap.to(".b-hero-copy", { x: x * -.25, y: y * -.18, duration: .8, ease: "power2.out" });
      };
      window.addEventListener("pointermove", move);
      return () => window.removeEventListener("pointermove", move);
    }, page);
    return () => { observer.disconnect(); ctx.revert(); page.classList.remove("motion-ready"); };
  }, []);
  return null;
}
