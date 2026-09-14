"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import type { CaseStudy } from "@/data/case-studies";
import { Container, SectionLabel } from "@/components/ui/Primitives";
import { MotionProvider } from "@/components/motion/MotionProvider";

const CaseStudyScene = dynamic(() => import("./CaseStudyScene"), { ssr: false });

function StudyHeading({ number, label, heading, dark = false }: { number: string; label: string; heading: string; dark?: boolean }) {
  return <><SectionLabel light={dark}>{number} / {label}</SectionLabel><h2>{heading.split("\n").map((line, index) => <span key={line}>{index === 1 ? <em>{line}</em> : line}</span>)}</h2></>;
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: .72, ease: [.22,1,.36,1] }}>{children}</motion.div>;
}

export function CaseStudyPage({ study, previous, next }: { study: CaseStudy; previous: CaseStudy; next: CaseStudy }) {
  const reduced = useReducedMotion();
  const [activeLayer, setActiveLayer] = useState(0);
  return <div className={`case-study case-${study.tone}`} id="top">
    <MotionProvider />
    <section className="case-hero" aria-labelledby="case-title">
      <Container className="case-hero-grid">
        <motion.div className="case-hero-copy" initial={reduced ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .85, ease: [.22,1,.36,1] }}>
          <SectionLabel light={study.tone !== "sand"}>{study.number} / CASE STUDY</SectionLabel>
          <h1 id="case-title">{study.title}</h1><p className="case-subtitle">{study.subtitle}</p><h2>{study.statement}</h2><p className="case-description">{study.description}</p>
        </motion.div>
        <div className="case-scene" role="img" aria-label={`${study.title} ${study.visual} systems visualization`}>
          <div className="case-scene-fallback"><i /><i /><strong>{study.title.charAt(0)}</strong></div><CaseStudyScene study={study} /><span>IDEA → SYSTEM → EXPERIENCE</span>
        </div>
      </Container>
    </section>

    <section className="case-snapshot" aria-label="Project snapshot"><Container><dl>
      <div><dt>ROLE</dt><dd>{study.role.join(" / ")}</dd></div><div><dt>FOCUS</dt><dd>{study.focus.join(" / ")}</dd></div><div><dt>STACK</dt><dd>{study.technologies.join(" / ")}</dd></div><div><dt>STATUS</dt><dd>{study.status}</dd></div>
    </dl></Container></section>

    <section className="case-section case-problem"><Container><Reveal className="case-copy-grid"><div><StudyHeading number="01" label="THE PROBLEM" heading={study.problem.heading} /></div><div className="case-paragraphs">{study.problem.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></Reveal></Container></section>

    <section className="case-section case-idea"><Container><Reveal><StudyHeading number="02" label="THE IDEA" heading={study.idea.heading} /><div className="idea-layout"><p>{study.idea.text}</p><ol>{study.idea.flow.map((step,index) => <li key={step}><span>0{index+1}</span><strong>{step}</strong>{index < study.idea.flow.length-1 && <i>↓</i>}</li>)}</ol></div></Reveal></Container></section>

    <section className="case-section case-product"><Container><Reveal><StudyHeading number="03" label="PRODUCT" heading={study.product.heading} /><p className="section-intro">{study.product.intro}</p><div className="product-areas">{study.product.areas.map((area,index) => <article key={area.title}><span>0{index+1}</span><div className="product-glyph" aria-hidden="true"><i /><i /></div><h3>{area.title}</h3><p>{area.text}</p></article>)}</div></Reveal></Container></section>

    <section className="case-section case-architecture"><Container><Reveal><StudyHeading dark number="04" label="ARCHITECTURE" heading={study.architecture.heading} /><p className="section-intro">{study.architecture.intro}</p><div className="architecture-layout"><ol aria-label="Conceptual architecture layers">{study.architecture.layers.map((layer,index) => <li key={layer.label}><button className={activeLayer === index ? "active" : ""} onMouseEnter={() => setActiveLayer(index)} onFocus={() => setActiveLayer(index)} onClick={() => setActiveLayer(index)} aria-pressed={activeLayer === index}><span>0{index+1}</span><strong>{layer.label}</strong><i>↓</i></button></li>)}</ol><div className="architecture-detail" aria-live="polite"><span>ACTIVE LAYER / {String(activeLayer+1).padStart(2,"0")}</span><h3>{study.architecture.layers[activeLayer].label}</h3><p>{study.architecture.layers[activeLayer].detail}</p><div aria-hidden="true"><i /><i /><i /></div></div></div></Reveal></Container></section>

    {study.intelligence && <section className="case-section case-intelligence"><Container><Reveal><StudyHeading number="05" label="INTELLIGENCE" heading={study.intelligence.heading} /><p className="section-intro">{study.intelligence.intro}</p><div className="intelligence-flow">{study.intelligence.flow.map((item,index) => <article key={item.label}><span>0{index+1}</span><h3>{item.label}</h3><p>{item.detail}</p>{index < study.intelligence!.flow.length-1 && <i>→</i>}</article>)}</div></Reveal></Container></section>}

    <section className="case-section case-engineering"><Container><Reveal><StudyHeading number="06" label="ENGINEERING" heading={study.engineering.heading} /><div className="decision-layout"><p className="section-intro">{study.engineering.intro}</p><div>{study.engineering.decisions.map((decision,index) => <article key={decision.title}><span>0{index+1}</span><h3>{decision.title}</h3><p>{decision.text}</p></article>)}</div></div></Reveal></Container></section>

    <section className="case-section case-experience"><Container><Reveal><StudyHeading number="07" label="EXPERIENCE" heading={study.experience.heading} /><p className="section-intro">{study.experience.intro}</p><div className="experience-system"><div className="ui-fragment" aria-hidden="true"><span /><span /><div><i /><i /><i /></div><b>{study.title}</b></div><div>{study.experience.principles.map((principle,index) => <article key={principle.title}><span>0{index+1}</span><h3>{principle.title}</h3><p>{principle.text}</p></article>)}</div></div></Reveal></Container></section>

    <section className="case-section case-process"><Container><Reveal><StudyHeading number="08" label="BUILD" heading={"FROM QUESTION\nTO PRODUCT."} /><ol>{study.process.map((step,index) => <li key={step}><span>0{index+1}</span><strong>{step}</strong>{index < study.process.length-1 && <i>↓</i>}</li>)}</ol></Reveal></Container></section>

    <section className="case-section case-challenges"><Container><Reveal><StudyHeading number="09" label="CHALLENGES" heading={study.challenges.heading} /><p className="consideration-label">{study.challenges.label}</p><div>{study.challenges.items.map((item,index) => <article key={item.title}><span>0{index+1}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></Reveal></Container></section>

    <section className="case-section case-learnings"><Container><Reveal><StudyHeading dark number="10" label="LEARNINGS" heading={study.learnings.heading} /><p className="section-intro">{study.learnings.intro}</p><div>{study.learnings.items.map((item,index) => <article key={item.title}><span>0{index+1}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></Reveal></Container></section>

    <section className="case-closing"><Container><p>{study.closing}</p><div className="case-navigation"><Link href={`/work/${previous.slug}`}><span>PREVIOUS PROJECT</span>← {previous.title}</Link><Link href={`/work/${next.slug}`}><span>NEXT PROJECT</span>{next.title} →</Link></div><div className="case-footer"><Link href="/work">ALL WORK</Link><span>© {new Date().getFullYear()} ANCHAL SHARMA</span><a href="#top">BACK TO TOP ↑</a></div></Container></section>
  </div>;
}
