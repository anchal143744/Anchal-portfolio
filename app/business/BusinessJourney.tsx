"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const stages = [
  [
    "01",
    "Purpose",
    "Start with a problem",
    "Ask which practical need makes the product worth exploring."
  ],
  [
    "02",
    "People",
    "Understand the user",
    "Consider who would use the product and what they need to accomplish."
  ],
  [
    "03",
    "Requirements",
    "Define the scope",
    "Turn the idea into explicit requirements without promising unbuilt features."
  ],
  [
    "04",
    "Workflow",
    "Map the next action",
    "Trace how information moves through the proposed business journey."
  ],
  [
    "05",
    "Boundaries",
    "Make limits visible",
    "Distinguish implemented behaviour from prototype screens and future work."
  ],
  [
    "06",
    "Records",
    "Connect information",
    "Explore how business records support consistent operational decisions."
  ],
  [
    "07",
    "Validation",
    "Inspect the result",
    "Review behaviour and available test evidence; document remaining gaps."
  ],
  [
    "08",
    "Refinement",
    "Improve the product",
    "Use feedback and AI-assisted iteration to develop the next version."
  ]
];

export function BusinessJourney() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const path = section.querySelector<SVGPathElement>(".business-journey-path");
    const nodes = Array.from(section.querySelectorAll<HTMLElement>(".business-journey-node"));
    const stageEls = Array.from(section.querySelectorAll<HTMLElement>(".business-stage"));
    const current = section.querySelector<HTMLElement>(".business-current");
    const progressLabel = section.querySelector<HTMLElement>(".business-progress");
    const ctx = gsap.context(() => {
      if (!path || !current || !progressLabel) return;
      const length = path.getTotalLength();
      nodes.forEach((node, index) => {
        const point = path.getPointAtLength((length * index) / (nodes.length - 1));
        const circle = node.querySelector("circle");
        const label = node.querySelector("text");
        circle?.setAttribute("cx", String(point.x));
        circle?.setAttribute("cy", String(point.y));
        label?.setAttribute("x", String(point.x + 16));
        label?.setAttribute("y", String(point.y + 4));
      });
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      gsap.set(stageEls, { autoAlpha: 0, y: 18 });
      let activeIndex = -1;
      const selectStage = (progress: number) => {
        const index = Math.min(stages.length - 1, Math.floor(progress * stages.length));
        if (index === activeIndex) return;
        const previousIndex = activeIndex;
        activeIndex = index;
        nodes.forEach((node, nodeIndex) => {
          node.classList.toggle("is-active", nodeIndex === index);
          node.classList.toggle("is-complete", nodeIndex < index);
          node.classList.toggle("is-future", nodeIndex > index);
        });
        if (previousIndex >= 0) gsap.to(stageEls[previousIndex], { autoAlpha: 0, y: -14, duration: .28, ease: "power2.in", overwrite: true });
        gsap.fromTo(stageEls[index], { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: .48, ease: "power3.out", overwrite: true });
        current.textContent = stages[index][1];
        progressLabel.textContent = `${String(index + 1).padStart(2, "0")} / 08`;
      };
      const timeline = gsap.timeline({ scrollTrigger: {
        trigger: section, start: "top top", end: () => `+=${window.innerHeight * 6.5}`, scrub: 1, pin: ".business-journey-sticky", anticipatePin: 1,
        onUpdate: (self) => selectStage(self.progress),
      }});
      timeline.to(path, { strokeDashoffset: 0, ease: "none", duration: 1 }, 0);
      selectStage(0);
    }, section);
    return () => ctx.revert();
  }, []);

  return <>
    <section className="business-journey" ref={sectionRef} aria-label="Business experience journey">
      <div className="business-journey-sticky">
        <div className="business-journey-grid" aria-hidden="true" />
        <div className="business-journey-visual" aria-label="Progress line of business experience">
          <div className="business-journey-labels"><p className="eyebrow">Business journey</p><p className="business-progress">01 / 08</p></div>
          <svg viewBox="0 0 460 640" role="img" aria-label="An orange line tracing a business-focused product approach">
            <path className="business-journey-construction" d="M55 570 C115 545 120 490 180 470 S220 390 280 355 S275 265 340 230 S355 125 405 72" />
            <path className="business-journey-path" d="M55 570 C115 545 120 490 180 470 S220 390 280 355 S275 265 340 230 S355 125 405 72" />
            {stages.map((stage) => <g className="business-journey-node" key={stage[0]}><circle cx="0" cy="0" r="8" /><text x="16" y="4">{stage[0]}</text></g>)}
          </svg>
          <p className="business-journey-key">Current focus <strong className="business-current">Purpose</strong></p>
        </div>
        <div className="business-journey-copy">
          {stages.map(([number, title, label, description]) => <article className="business-stage" key={number}>
            <p>{number} / {label}</p><h2>{title}</h2><span>{description}</span>
          </article>)}
        </div>
        <p className="business-journey-note" aria-hidden="true">Scroll controls the journey</p>
      </div>
    </section>
    <section className="business-journey-outro">
      <p className="eyebrow">The outcome</p><h2>Tech <em>×</em> Design <em>×</em> Commerce</h2>
      <p>Building digital experiences with the perspective of someone who understands the business behind them.</p>
    </section>
  </>;
}
