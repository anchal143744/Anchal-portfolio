"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { projects } from "@/data/projects";
import { home } from "@/data/home";
import { site } from "@/data/site";
import { ResumeLink } from "@/components/ui/ResumeLink";
import { HomeHero } from "./HomeHero";

function Label({ children }: { children: string }) { return <p className="v2-label">{children}</p>; }

function SelectedWork() {
  return <section id="selected-work" className="v2-work v3-work"><div className="container">
    <div className="v2-section-head"><div><Label>03 / SELECTED WORK</Label><h2>PRODUCTS<br/><em>IN DEVELOPMENT.</em></h2></div><p>Two focused systems exploring enterprise intelligence and human-centered health technology—presented honestly as work in progress.</p></div>
    <div className="v2-project-grid v4-project-grid">{projects.filter(project => project.id === "nexora-ai" || project.id === "eva-x").map(project => <article key={project.id} className={`v2-project ${project.tone}`}><Link href={project.href} aria-label={`View ${project.title} case study`}>
      <div className="v2-project-visual" aria-hidden="true"><span>{project.number}</span><i/><i/><strong>{project.title.charAt(0)}</strong><small>{project.visual.toUpperCase()}</small></div>
      <div className="v2-project-info"><p>{project.status.toUpperCase()} · {project.role.toUpperCase()}</p><h3>{project.title}</h3><span>{project.description}</span><small>{project.technologies.slice(0,3).join(" · ")}</small><b>OPEN CASE STUDY ↗</b></div>
    </Link></article>)}</div><Link className="v2-text-link" href="/work">VIEW ALL WORK ↗</Link>
  </div></section>;
}

function CapabilityVisual({ active }: { active: number }) {
  return <div className={`v2-cap-visual mode-${active}`} aria-hidden="true"><div className="v2-cap-grid"/><span className="v2-node n1"/><span className="v2-node n2"/><span className="v2-node n3"/><i className="v2-line l1"/><i className="v2-line l2"/><i className="v2-line l3"/><strong>0{active + 1}</strong><p>{["PRODUCT / INTELLIGENCE","FRONTEND / BACKEND","AI / AUTOMATION","SERVICES / DATA","INTERFACE / EXPERIENCE","SYSTEM / DEPLOYMENT"][active]}</p></div>;
}

function Capabilities() {
  const [active, setActive] = useState(0);
  return <section id="capabilities" className="v2-capabilities v3-capabilities"><div className="container"><div className="v2-section-head"><div><Label>02 / CAPABILITIES</Label><h2>ONE PRODUCT.<br/><em>THE WHOLE SYSTEM.</em></h2></div><p>Six connected disciplines—from product intent and interface architecture to intelligent workflows, services and deployment.</p></div>
    <div className="v2-cap-system"><div className="v2-cap-list">{home.capabilities.map((cap, index) => <button key={cap.title} type="button" aria-pressed={active === index} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(index)}><span>{cap.number}</span><strong>{cap.title}</strong><small>{cap.items.join(" · ")}</small><i>↗</i></button>)}</div><CapabilityVisual active={active}/></div>
  </div></section>;
}

function Footer() {
  return <footer className="v2-footer"><div><strong>{site.name.toUpperCase()}</strong><span>{site.role.join(" · ").toUpperCase()}</span></div><nav aria-label="Footer navigation">{[["HOME","/"],["WORK","/work"],["CAPABILITIES","/#capabilities"],["ABOUT","/about"],["CONTACT","/contact"]].map(([label,href])=><Link key={label} href={href}>{label}</Link>)}</nav><div>{site.social.map(item=><a key={item.label} href={item.href}>{item.label}</a>)}<ResumeLink/></div><small>© 2026 {site.name}.</small></footer>;
}

export function HomeExperience() {
  const reduced = useReducedMotion();
  const reveal = reduced ? {} : { initial: { opacity: 0, y: 22 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: .25 }, transition: { duration: .7 } };
  return <main className="v2-home v4-home"><HomeHero/><Capabilities/><SelectedWork/>
    <section className="v2-philosophy v3-philosophy"><div className="container"><Label>04 / PHILOSOPHY</Label><motion.h2 {...reveal}>BUILD WITH<br/><em>PURPOSE.</em></motion.h2><p>{home.philosophy}</p><div className="v3-principles" aria-label="Engineering principles">{home.principles.map(item=><span key={item}>{item.toUpperCase()}</span>)}</div><div className="v2-philosophy-orbit" aria-hidden="true"><i/><i/><strong>A.</strong></div></div></section>
    <section className="v2-about-line v3-about"><div className="container"><div><p>05 / ABOUT</p><h2>ENGINEERING WITH<br/><em>PRODUCT JUDGMENT.</em></h2></div><div><strong>Computer Science undergraduate focused on AI, software engineering and full-stack development. I turn complex problems into practical, user-focused products.</strong><Link href="/about">READ MORE ↗</Link></div></div></section>
    <section className="v2-contact v3-contact"><div className="container"><Label>06 / LET&apos;S CONNECT</Label><motion.h2 {...reveal}>LET&apos;S BUILD<br/><em>SOMETHING MEANINGFUL.</em></motion.h2><p>Have an idea, product or problem worth solving?</p><Link className="v2-contact-link" href="/contact">LET&apos;S CONNECT ↗</Link><div className="v2-contact-orbit" aria-hidden="true"><i/><i/></div><Footer/></div></section>
  </main>;
}
