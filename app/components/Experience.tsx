"use client";

import { useEffect, useRef } from "react";
import "./experience.css";

const stories = [
  { marker: "01 / Independent product experience", label: "NEXORA AI OS + AI Operations Platform", title: "From business idea to working product.", copy: "I shaped NEXORA and AI Operations around practical business needs, defining product purpose, feature requirements and interface direction. Across retail records and enquiry workflows, my contribution connects the bigger idea to the details: what each screen explains, which action comes next and how the journey holds together.", tags: ["Product direction", "Feature planning", "Interface decisions"] },
  { marker: "02 / Business-led product decisions", label: "Product thinking + iterative refinement", title: "Making every feature earn its place.", copy: "Across my applications and this portfolio, I turn broad ideas into focused product decisions. I review priorities, navigation and workflow states, then refine each iteration around clarity and practical use. Customer context, meaningful handoffs and human review guide how I think about the next step, keeping the experience connected to its business purpose.", tags: ["Scope & priorities", "Workflow review", "Iterative refinement"] },
];

function ProductBrief() {
  return <svg viewBox="0 0 540 350" focusable="false">
    <ellipse cx="276" cy="310" rx="204" ry="16" fill="#c7bcac" opacity=".35"/>
    <g className="exp-object" transform="rotate(-3 270 175)">
      <rect x="91" y="43" width="350" height="251" rx="17" fill="#393733"/>
      <rect x="87" y="35" width="350" height="251" rx="17" fill="#242321"/>
      <text x="111" y="66" fill="#f4f1ea" fontSize="11" fontWeight="700" letterSpacing="2">PRODUCT / DIRECTION</text>
      <circle cx="409" cy="62" r="4" fill="#ff6a00"/>
      <g className="exp-paper">
        <rect x="107" y="79" width="310" height="178" rx="8" fill="#fcfaf6" stroke="#d9d4c9"/>
        <text x="126" y="104" fontSize="9" letterSpacing="1.8" fill="#55514b">THE PRODUCT BRIEF</text>
        <text x="126" y="131" fontSize="22" fontWeight="900">A clear idea.</text>
        <text x="126" y="155" fontSize="22" fontWeight="900">A considered product.</text>
        <path d="M127 175H397" stroke="#d9d4c9"/>
        <text x="127" y="197" fontSize="12" fontWeight="800">NEXORA AI OS</text>
        <text x="127" y="218" fontSize="11" fontWeight="800">AI OPERATIONS PLATFORM</text>
        <circle cx="382" cy="199" r="11" fill="#ff6a00"/>
        <path d="m377 199 4 4 7-8" fill="none" stroke="#171717" strokeWidth="2"/>
        <text x="127" y="239" fontSize="10" fill="#55514b">Independent product projects</text>
      </g>
    </g>
    <g className="exp-object" transform="translate(55 272) rotate(-7)">
      <rect width="180" height="66" rx="7" fill="#ff6a00"/>
      <text x="15" y="25" fontSize="10" fontWeight="800" letterSpacing="1">START WITH PURPOSE.</text>
      <text x="15" y="44" fontSize="10">Shape the next decision.</text>
    </g>
    <g className="exp-sample"><g className="exp-object" transform="translate(361 235) rotate(7)">
      <rect width="134" height="72" rx="7" fill="#fcfaf6" stroke="#c6bfb3"/>
      <text x="13" y="24" fontSize="9" letterSpacing="1" fill="#55514b">MY FOCUS</text>
      <text x="13" y="43" fontSize="11" fontWeight="800">Clarity. Flow.</text>
      <text x="13" y="58" fontSize="11" fontWeight="800">Purpose.</text>
    </g></g>
  </svg>;
}

function DecisionMap() {
  return <svg viewBox="0 0 540 350" focusable="false">
    <ellipse cx="274" cy="315" rx="211" ry="16" fill="#c7bcac" opacity=".35"/>
    <g className="exp-object" transform="rotate(2 270 175)">
      <rect x="52" y="32" width="438" height="281" rx="18" fill="#393733"/>
      <rect x="48" y="24" width="438" height="281" rx="18" fill="#242321"/>
      <text x="72" y="54" fontSize="11" fontWeight="700" letterSpacing="2" fill="#f4f1ea">THE DECISION PROCESS</text>
      <text x="436" y="54" fontSize="9" fill="#b5aaa0">01—04</text>
      <path d="M247 124h39m-8-5 8 5-8 5M372 166v37m-5-8 5 8 5-8M287 246h-39m8-5-8 5 8 5" fill="none" stroke="#ff6a00" strokeWidth="2"/>
      {[
        { x: 72, y: 79, n: "01", title: "PURPOSE", detail: "Understand the need." },
        { x: 287, y: 79, n: "02", title: "PRIORITY", detail: "Choose what matters." },
        { x: 287, y: 201, n: "03", title: "REVIEW", detail: "Question each step." },
        { x: 72, y: 201, n: "04", title: "REFINE", detail: "Make the next version clearer." },
      ].map(step => <g key={step.n} className={step.n === "03" ? "exp-package" : undefined}>
        <g className="exp-object" transform={`translate(${step.x} ${step.y})`}>
          <rect y="5" width="175" height="85" rx="9" fill={step.n === "04" ? "#b34b00" : "#b5aaa0"}/>
          <rect width="175" height="85" rx="9" fill={step.n === "04" ? "#ff6a00" : "#fcfaf6"}/>
          <text x="14" y="21" fontSize="9" fontWeight="700" fill={step.n === "04" ? "#171717" : "#777064"}>{step.n}</text>
          <text x="14" y="45" fontSize="17" fontWeight="900">{step.title}</text>
          <text x="14" y="65" fontSize="9">{step.detail}</text>
        </g>
      </g>)}
    </g>
  </svg>;
}

export default function Experience() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const section = ref.current!;
    const rail = section.querySelector<HTMLElement>(".exp-stories")!;
    const rows = [...section.querySelectorAll<HTMLElement>(".exp-story")];
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = matchMedia("(max-width: 700px)");
    const seen = new Set<HTMLElement>();
    const animations = new Map<HTMLElement, Animation>();
    let observer: IntersectionObserver | undefined;
    let frame = 0;
    let active = false;
    const finish = (row: HTMLElement) => { seen.add(row); animations.get(row)?.cancel(); animations.delete(row); };
    const clamp = (value: number) => Math.max(0, Math.min(1, value));
    const update = () => {
      frame = 0;
      if (document.hidden || reduced.matches) return;
      const rect = rail.getBoundingClientRect();
      const reading = innerHeight * .55;
      rail.style.setProperty("--exp-progress", String(clamp((reading - rect.top) / rect.height)));
      rows.forEach(row => {
        const box = row.getBoundingClientRect();
        row.dataset.active = String(box.top <= reading);
        if (box.bottom <= 0) finish(row);
        if (!mobile.matches) {
          const progress = clamp((innerHeight - box.top) / (innerHeight + box.height));
          row.style.setProperty("--exp-paper", `${progress * 16}px`);
          row.style.setProperty("--exp-float", `${8 - progress * 16}px`);
          row.style.setProperty("--exp-sample", `${4 - progress * 8}px`);
        }
      });
    };
    const schedule = () => { if (!frame && active && !document.hidden && !reduced.matches) frame = requestAnimationFrame(update); };
    const configure = () => {
      observer?.disconnect(); animations.forEach(animation => animation.cancel()); animations.clear();
      rows.forEach(row => { row.style.removeProperty("--exp-paper"); row.style.removeProperty("--exp-float"); row.style.removeProperty("--exp-sample"); });
      if (reduced.matches) { rows.forEach(row => { finish(row); row.dataset.active = "true"; }); rail.style.setProperty("--exp-progress", "1"); return; }
      try {
        observer = new IntersectionObserver(entries => entries.forEach(entry => {
          const row = entry.target as HTMLElement;
          if (entry.boundingClientRect.bottom <= 0) { finish(row); return; }
          if (entry.intersectionRatio >= .15) { seen.add(row); animations.get(row)?.play(); observer?.unobserve(row); }
        }), { threshold: [0, .15] });
        rows.forEach(row => {
          if (seen.has(row) || row.contains(document.activeElement) || row.getBoundingClientRect().bottom <= 0) return;
          const animation = row.animate([{ opacity: 0, transform: `translateY(${mobile.matches ? 10 : 22}px)` }, { opacity: 1, transform: "translateY(0)" }], { duration: 600, easing: "cubic-bezier(.16,1,.3,1)", fill: "both" });
          animation.pause(); animation.currentTime = 0; animation.onfinish = () => finish(row); animations.set(row, animation); observer!.observe(row);
        });
      } catch { animations.forEach(animation => animation.cancel()); animations.clear(); }
      update();
    };
    const focus = (event: FocusEvent) => { const row = (event.target as HTMLElement).closest<HTMLElement>(".exp-story"); if (row) finish(row); };
    configure();
    const visibility = typeof IntersectionObserver !== "undefined" ? new IntersectionObserver(([entry]) => { active = entry.isIntersecting; if (active) schedule(); else { cancelAnimationFrame(frame); frame = 0; } }) : undefined;
    visibility?.observe(section);
    window.addEventListener("portfolio-scroll", schedule, { passive: true }); window.addEventListener("resize", schedule); document.addEventListener("visibilitychange", schedule);
    reduced.addEventListener("change", configure); mobile.addEventListener("change", configure); section.addEventListener("focusin", focus);
    return () => { observer?.disconnect(); visibility?.disconnect(); cancelAnimationFrame(frame); animations.forEach(animation => animation.cancel()); window.removeEventListener("portfolio-scroll", schedule); window.removeEventListener("resize", schedule); document.removeEventListener("visibilitychange", schedule); reduced.removeEventListener("change", configure); mobile.removeEventListener("change", configure); section.removeEventListener("focusin", focus); };
  }, []);
  return <section className="experience-section exp-section" id="experience" ref={ref} aria-labelledby="experience-title">
    <header className="exp-heading"><p>Experience</p><h2 id="experience-title">Product thinking.<br className="exp-heading-break"/> Put into <span>practice.</span></h2></header>
    <div className="exp-stories"><div className="exp-track" aria-hidden="true"><i/></div>
      {stories.map((story, index) => <article className="exp-story" key={story.marker} aria-labelledby={`exp-title-${index}`}>
        <p className="exp-marker"><span aria-hidden="true"/>{story.marker}</p>
        <div className="exp-row"><div className="exp-copy"><p className="exp-category">{story.label}</p><h3 id={`exp-title-${index}`}>{story.title}</h3><p className="exp-description">{story.copy}</p><ul className="exp-tags" aria-label="Areas of experience">{story.tags.map(tag=><li key={tag}>{tag}</li>)}</ul></div>
        <div className="exp-visual" aria-hidden="true">{index === 0 ? <ProductBrief/> : <DecisionMap/>}<span className="exp-art-caption">{index === 0 ? "PURPOSE → REQUIREMENTS → PRODUCT" : "CONTEXT → PRIORITY → REVIEW → REFINE"}</span></div></div>
      </article>)}
    </div>
  </section>;
}
