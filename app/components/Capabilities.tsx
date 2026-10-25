"use client";

import { visualScrollY, scrollToPosition } from "../lib/portfolio-scroll";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { HomeProjectLink } from "./HomeProjectDialogs";
import { capabilities } from "../data/capabilities";
import "./capabilities.css";

export default function Capabilities() {
  const [selected, setSelected] = useState(0);
  const [hasSelectedKey, setHasSelectedKey] = useState(false);
  const [instructionVerb, setInstructionVerb] = useState("Select");
  const demoUsed = useRef(false);
  const ref = useRef<HTMLElement>(null);
  const animations = useRef(new Set<Animation>());
  const detailRef = useRef<HTMLDivElement>(null);
  const firstPanel = useRef(true);
  const item = capabilities[selected];
  useEffect(() => {
    if (firstPanel.current) { firstPanel.current = false; return; }
    const panel = detailRef.current;
    if (!panel || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const animation = panel.animate([{ opacity: .35, transform: "translateY(4px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 220, easing: "ease-out" });
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const stop = () => animation.cancel();
    reduced.addEventListener("change", stop);
    return () => { stop(); reduced.removeEventListener("change", stop); };
  }, [selected]);
  useEffect(() => {
    let frame = 0;
    let anchorTimer = 0;
    const header = document.querySelector<HTMLElement>(".site-header");
    const headerBottom = () => header ? Math.max(header.getBoundingClientRect().bottom, (parseFloat(getComputedStyle(header).top) || 0) + header.offsetHeight) : 80;
    const measureHeader = () => {
      ref.current?.style.setProperty("--kp-header-offset", `${headerBottom() + 20}px`);
    };
    measureHeader();
    const headerObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measureHeader) : undefined;
    if (header) headerObserver?.observe(header);
    window.addEventListener("resize", measureHeader);
    const followAnchor = () => {
      const hash = window.location.hash.slice(1);
      const index = capabilities.findIndex(capability => capability.anchor === hash);
      if (index < 0 && hash !== "creative-toolkit" && hash !== "capabilities") return;
      cancelAnimationFrame(frame);
      window.clearTimeout(anchorTimer);
      frame = requestAnimationFrame(() => {
        if (index >= 0) setSelected(index);
        // Let the browser finish its native fragment scroll before positioning the heading.
        anchorTimer = window.setTimeout(() => {
          measureHeader();
          const heading = ref.current?.querySelector(".kp-intro");
          if (heading) scrollToPosition({ top: visualScrollY() + heading.getBoundingClientRect().top - headerBottom() - 20, behavior: "instant" });
        }, 120);
      });
    };
    followAnchor(); window.addEventListener("hashchange", followAnchor);
    return () => { cancelAnimationFrame(frame); window.clearTimeout(anchorTimer); headerObserver?.disconnect(); window.removeEventListener("resize", measureHeader); window.removeEventListener("hashchange", followAnchor); };
  }, []);

  useEffect(() => {
    const section = ref.current!;
    const stage = section.querySelector<HTMLElement>(".kp-stage")!;
    const tilt = section.querySelector<HTMLElement>(".kp-tilt")!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const fine = matchMedia("(hover: hover) and (pointer: fine) and (min-width: 901px)");
    let frame = 0, visible = false, entered = false;
    let x = 0, y = 0;
    const running = animations.current;
    const animate = (element: Element, frames: Keyframe[], options: KeyframeAnimationOptions) => {
      try { const animation = element.animate(frames, options); running.add(animation); animation.onfinish = () => { running.delete(animation); animation.cancel(); }; } catch { /* Finished styles are the default. */ }
    };
    const reset = () => { cancelAnimationFrame(frame); frame = 0; tilt.style.removeProperty("--kp-x"); tilt.style.removeProperty("--kp-y"); };
    const stop = () => { reset(); running.forEach(animation => animation.cancel()); running.clear(); };
    const update = () => { frame = 0; if (!visible || reduced.matches || !fine.matches || document.hidden) return; tilt.style.setProperty("--kp-x", `${-y * 4}deg`); tilt.style.setProperty("--kp-y", `${x * 4}deg`); };
    const move = (event: PointerEvent) => {
      if (!visible || reduced.matches || !fine.matches || event.pointerType === "touch") return;
      const box = stage.getBoundingClientRect();
      x = Math.max(-1, Math.min(1, (event.clientX - box.left) / box.width * 2 - 1));
      y = Math.max(-1, Math.min(1, (event.clientY - box.top) / box.height * 2 - 1));
      if (!frame) frame = requestAnimationFrame(update);
    };
    const observer = typeof IntersectionObserver !== "undefined" ? new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      section.dataset.motionVisible = String(visible && !document.hidden);
      if (!visible) { stop(); return; }
      if (entered) return;
      entered = true;
      if (reduced.matches) return;
      const easing = "cubic-bezier(.16,1,.3,1)";
      animate(section.querySelector(".kp-intro")!, [{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 600, easing });
      animate(section.querySelector(".kp-arrival")!, [{ opacity: 0, transform: "translateY(20px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 750, easing });
      section.querySelectorAll(".kp-settle").forEach((key, i) => animate(key, [{ transform: "translateZ(6px)" }, { transform: "translateZ(0)" }], { duration: 500, delay: 70 * i, easing }));
    }, { threshold: .12 }) : undefined;
    observer?.observe(section);
    const visibility = () => { section.dataset.motionVisible = String(visible && !document.hidden); if (document.hidden) stop(); };
    stage.addEventListener("pointermove", move); stage.addEventListener("pointerleave", reset);
    reduced.addEventListener("change", stop); fine.addEventListener("change", reset); document.addEventListener("visibilitychange", visibility);
    return () => { stop(); observer?.disconnect(); stage.removeEventListener("pointermove", move); stage.removeEventListener("pointerleave", reset); reduced.removeEventListener("change", stop); fine.removeEventListener("change", reset); document.removeEventListener("visibilitychange", visibility); };
  }, []);
  useEffect(() => {
    const stage = ref.current!.querySelector<HTMLElement>(".kp-stage")!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = matchMedia("(any-pointer: coarse)");
    const fine = matchMedia("(any-pointer: fine)");
    const wording = () => setInstructionVerb(coarse.matches && fine.matches ? "Select" : coarse.matches ? "Tap" : fine.matches ? "Click" : "Select");
    wording();
    coarse.addEventListener("change", wording);
    fine.addEventListener("change", wording);
    let timer = 0;
    let demonstration: Animation | undefined;
    const cancel = () => {
      demoUsed.current = true;
      window.clearTimeout(timer);
      demonstration?.cancel();
    };
    const visibility = () => { if (document.hidden) cancel(); };
    const observer = typeof IntersectionObserver !== "undefined" ? new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || entry.intersectionRatio < .5) {
        if (timer || demonstration) cancel();
        return;
      }
      if (demoUsed.current) return;
      if (reduced.matches || document.hidden || stage.matches(":hover") || stage.contains(document.activeElement)) { cancel(); return; }
      if (timer) return;
      // Wait until the 750ms entrance and key settling have completed.
      timer = window.setTimeout(() => {
        timer = 0;
        if (demoUsed.current) return;
        demoUsed.current = true;
        // Read the live selection, including direct anchors, without activating it.
        const face = stage.querySelector('.kp-key[aria-pressed="true"] .kp-face');
        try {
          demonstration = face?.animate([
            { transform: "translateZ(16px)" },
            { transform: "translateZ(10px)", offset: .45 },
            { transform: "translateZ(16px)" },
          ], { duration: 500, easing: "ease-in-out" });
          if (demonstration) demonstration.onfinish = () => demonstration?.cancel();
        } catch { /* The controls remain complete without animation support. */ }
      }, 850);
    }, { threshold: [0, .5] }) : undefined;
    observer?.observe(stage);
    const events = ["pointerover", "pointerdown", "focusin", "keydown", "click"] as const;
    events.forEach(event => stage.addEventListener(event, cancel));
    reduced.addEventListener("change", cancel);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      window.clearTimeout(timer); demonstration?.cancel(); observer?.disconnect();
      events.forEach(event => stage.removeEventListener(event, cancel));
      reduced.removeEventListener("change", cancel);
      document.removeEventListener("visibilitychange", visibility);
      coarse.removeEventListener("change", wording); fine.removeEventListener("change", wording);
    };
  }, []);
  const select = (index: number, button: HTMLButtonElement) => {
    setHasSelectedKey(true);
    setSelected(index);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const face = button.querySelector(".kp-face")!;
    try {
      const press = face.animate([{ transform: "translateZ(16px)" }, { transform: "translateZ(5px)", offset: .35 }, { transform: "translateZ(16px)" }], { duration: 260, easing: "ease-out" });
      animations.current.add(press); press.onfinish = () => { animations.current.delete(press); press.cancel(); };
    } catch { /* Selection remains usable without animation support. */ }
  };
  return <section className="kp-section" id="capabilities" aria-labelledby="keypad-title" ref={ref}>
    <span id="creative-toolkit" className="kp-anchor" aria-hidden="true"/>
    {capabilities.map(capability => <span key={capability.anchor} id={capability.anchor} className="kp-anchor" aria-hidden="true"/>)}
    <div className="kp-layout">
      <header className="kp-intro"><p className="kp-eyebrow">Capabilities</p><h2 id="keypad-title">Four strengths.<br/>One product mindset.</h2><p className="kp-description">From shaping a product idea to refining its interface, connecting workflows and giving every feature a clear business purpose.</p></header>
      <div className="kp-stage" role="group" aria-label="Choose a capability" aria-describedby="keypad-instruction">
        <p className="kp-hint" id="keypad-instruction">{instructionVerb} a key to explore my approach.<span aria-hidden="true">↘</span></p>
        <div className="kp-arrival"><div className="kp-perspective"><div className="kp-tilt"><div className="kp-board">
          <div className="kp-brand" aria-hidden="true"><span>AS / TOOLKIT</span><span>01 — 04</span></div>
          <div className="kp-grid">{capabilities.map((item, index) => <div className="kp-settle" key={item.key} style={{ "--key-index": index } as CSSProperties}><button className="kp-key" type="button" aria-pressed={selected === index} aria-controls="keypad-details" onClick={event => select(index, event.currentTarget)}>
            <span className="kp-face"><span className="kp-key-meta" aria-hidden="true"><span>0{index + 1}</span><span className="kp-led"/></span><svg viewBox="0 0 24 24" aria-hidden="true"><path d={item.icon}/></svg><span className="kp-label">{item.key}</span></span>
          </button></div>)}</div><span className="kp-edge" aria-hidden="true">DESIGN. BUILD. CREATE.</span>
        </div></div></div>
          {!hasSelectedKey && <span className="kp-touch-cue" aria-hidden="true">
            <svg viewBox="0 0 56 64" focusable="false">
              <circle className="kp-touch-ring" cx="21" cy="15" r="11" fill="none" stroke="currentColor" strokeWidth="2"/>
              <path d="M17 37V16a4 4 0 0 1 8 0v17-7a4 4 0 0 1 8 0v8-5a4 4 0 0 1 8 0v7-3a4 4 0 0 1 8 0v11c0 8-5 14-13 14h-8c-5 0-8-3-11-7L8 39a4 4 0 0 1 6-5l3 3Z" fill="#fffaf1" stroke="#24211c" strokeWidth="2.5" strokeLinejoin="round"/>
            </svg>
          </span>}
        </div>
      </div>
      <div className="kp-details" id="keypad-details">
        <div className="kp-detail" ref={detailRef}>
          <p className="kp-detail-index">{item.key}</p><h3>{item.title}</h3><p>{item.description}</p>
          <h4>My Focus</h4><ul className="kp-scope">{item.scope.map(scope => <li key={scope}>{scope}</li>)}</ul>
          {item.tags.length > 0 && <ul className="kp-tags" aria-label="Skills">{item.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>}
          {"slug" in item ? <HomeProjectLink slug={item.slug} className="kp-work-link">{item.link} <span aria-hidden="true">↗</span></HomeProjectLink> : <Link href={item.href} className="kp-work-link">{item.link} <span aria-hidden="true">↗</span></Link>}
        </div>
      </div>
      <span className="sw-sr-only" role="status" aria-live="polite" aria-atomic="true">{`${item.title} selected.`}</span>
    </div>
  </section>;
}
