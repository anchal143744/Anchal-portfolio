"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { about, aboutSections } from "@/data/about";
import { ProfilePortrait } from "./ProfilePortrait";

const AboutScene = dynamic(() => import("./AboutScene"), { ssr: false });
const reveal = { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: .18 }, transition: { duration: .75, ease: [.22, 1, .36, 1] as [number, number, number, number] } };

function Label({ children }: { children: string }) { return <p className="section-label">{children}</p>; }

function Progress() {
  const [active, setActive] = useState("intro");
  useEffect(() => {
    const nodes = aboutSections.map(([id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); }), { rootMargin: "-35% 0px -55%", threshold: 0 });
    nodes.forEach(node => observer.observe(node)); return () => observer.disconnect();
  }, []);
  return <nav className="about-progress" aria-label="About page sections">{aboutSections.map(([id, label]) => <a key={id} href={`#${id}`} className={active === id ? "active" : ""} aria-current={active === id ? "location" : undefined}><i /><span>{label}</span></a>)}</nav>;
}

export function AboutExperience() {
  const reduced = useReducedMotion();
  return <main className="about-page">
    <Progress />
    <section className="about-hero">
      <div className="container about-hero-grid">
        <div className="about-hero-copy">
          <Label>03 / ABOUT</Label>
          <motion.h1 initial={reduced ? false : { opacity: 0, y: 45 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9 }}><span>I BUILD</span><span>WITH</span><em>PURPOSE.</em></motion.h1>
          <div className="about-identity"><p>{about.identity.name}</p><div>{about.identity.roles.map(role => <span key={role}>{role}</span>)}</div></div>
          <p className="about-statement">{about.identity.statement}</p>
        </div>
        <div className="about-form" aria-hidden="true"><AboutScene /><div className="about-form-fallback"><i /><i /><strong>A.</strong></div><span>LEARNING / SYSTEMS / EVOLUTION</span></div>
      </div>
    </section>

    <section id="intro" className="about-section about-intro container">
      <motion.div {...reveal}><Label>01 / WHO I AM</Label><h2>CURIOUS BY NATURE.<br /><em>BUILT BY PRACTICE.</em></h2></motion.div>
      <div className="about-intro-grid"><ProfilePortrait /><motion.div {...reveal}>{about.intro.map(p => <p key={p}>{p}</p>)}<p className="portrait-note">THE PERSON BEHIND THE SYSTEMS</p></motion.div></div>
    </section>

    <section id="thinking" className="thinking-section"><div className="container"><Label>02 / HOW I THINK</Label>{about.thinking.map((line, i) => <motion.p key={line} initial={reduced ? false : { opacity: .16, x: i % 2 ? 34 : -34 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ amount: .75 }} transition={{ duration: .65 }}>{line}</motion.p>)}</div></section>

    <section id="capabilities" className="about-section about-capabilities container"><Label>03 / WHAT I BUILD</Label><h2>THE WORK MOVES<br /><em>ACROSS DISCIPLINES.</em></h2><div className="about-capability-list">{about.capabilities.map((capability, i) => <motion.article key={capability.title} {...reveal}><span>0{i + 1}</span><h3>{capability.title}</h3><ul>{capability.items.map(item => <li key={item}>{item}</li>)}</ul></motion.article>)}</div></section>

    <section id="principles" className="about-section principles-section"><div className="container"><Label>04 / PRINCIPLES</Label><h2>HOW I <em>BUILD.</em></h2><div className="principles-list">{about.principles.map(([title, copy], i) => <motion.article key={title} {...reveal}><span>0{i + 1}</span><h3>{title}</h3><p>{copy}</p></motion.article>)}</div></div></section>

    <section id="evolution" className="about-section evolution-section container"><Label>05 / EVOLUTION</Label><div className="evolution-heading"><h2>PROGRESS IS<br /><em>ITERATIVE.</em></h2><p>Growth is not a straight line. It is a loop of curiosity, making, failure and better questions.</p></div><ol>{about.evolution.map((step, i) => <motion.li key={step} {...reveal}><span>0{i + 1}</span><strong>{step}</strong><i aria-hidden="true">↓</i></motion.li>)}</ol></section>

    <section id="exploring" className="about-section exploring-section"><div className="container"><Label>06 / CURRENTLY EXPLORING</Label><h2>LEARNING IN<br /><em>PUBLIC MOTION.</em></h2><div>{about.exploring.map(([area, status], i) => <motion.article key={area} {...reveal}><span>0{i + 1}</span><h3>{area}</h3><p><i />{status}</p></motion.article>)}</div></div></section>

    <section id="beyond" className="about-section beyond-section container"><Label>07 / BEYOND CODE</Label><div className="beyond-grid"><motion.h2 {...reveal}>GOOD PRODUCTS<br />ARE <em>HUMAN FIRST.</em></motion.h2><motion.div {...reveal}><p>{about.beyond.copy}</p><ul>{about.beyond.values.map(value => <li key={value}>{value}</li>)}</ul></motion.div></div></section>

    <section className="about-manifesto"><div className="container"><motion.h2 {...reveal}>MAKE COMPLEXITY<br /><em>FEEL SIMPLE.</em></motion.h2><p>{about.philosophy.copy}</p></div></section>

    <section id="future" className="about-section future-section"><div className="container"><Label>08 / WHAT&apos;S NEXT</Label><h2>STILL<br /><em>BUILDING.</em></h2><p>{about.future.copy}</p><div className="future-directions">{about.future.directions.map((item, i) => <span key={item}>0{i + 1} / {item}</span>)}</div><Link className="about-work-link" href="/work">EXPLORE THE WORK <span>↗</span></Link><footer><span>ANCHAL SHARMA © 2026</span><a href="mailto:hello@anchal.dev">LET&apos;S CONNECT ↗</a></footer></div></section>
  </main>;
}
