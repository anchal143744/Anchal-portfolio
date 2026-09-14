"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/data/projects";
import { technologies } from "@/data/technologies";
import { site } from "@/data/site";
import { ButtonLink, Container, SectionLabel, Tag } from "@/components/ui/Primitives";

const capabilities = [
  { number: "01", title: "AI SYSTEMS", items: ["AI agents", "LLM applications", "AI workflows", "Automation", "Intelligent systems"] },
  { number: "02", title: "ENGINEERING", items: ["Full-stack applications", "APIs & databases", "Architecture", "Integrations", "Scalable systems"] },
  { number: "03", title: "EXPERIENCE", items: ["UI / UX", "Interaction design", "Design systems", "Digital experiences"] },
];

const pipeline = ["PROBLEM", "RESEARCH", "PRODUCT", "ARCHITECTURE", "ENGINEERING", "AI", "EXPERIENCE"];

function Philosophy() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>(".philosophy-line");
      lines.forEach((line) => gsap.fromTo(line, { opacity: .13, x: 45 }, { opacity: 1, x: 0, scrollTrigger: { trigger: line, start: "top 78%", end: "top 43%", scrub: .7 } }));
    }, root);
    return () => ctx.revert();
  }, []);
  return <section ref={root} className="philosophy" aria-label="Working philosophy"><Container>
    <p className="philosophy-line"><span>I DON&apos;T JUST</span> WRITE CODE.</p>
    <p className="philosophy-line">I DESIGN <em>SYSTEMS.</em></p>
    <p className="philosophy-line">I BUILD <em>PRODUCTS.</em></p>
    <p className="philosophy-line">I SOLVE <em>PROBLEMS.</em></p>
  </Container></section>;
}

function ProjectVisual({ title, index }: { title: string; index: number }) {
  return <div className="project-visual" aria-label={`${title} concept visual`}>
    <div className="visual-index">SYSTEM / 0{index + 1}</div>
    <div className="visual-orbit"><i /><i /><i /><span>{index === 0 ? "N" : index === 1 ? "E" : "R"}</span></div>
    <div className="visual-status"><span>LIVE CONCEPT</span><span>↗ {String(72 + index * 9).padStart(3, "0")}</span></div>
  </div>;
}

export function HomeSections() {
  const reduced = useReducedMotion();
  const reveal = reduced ? {} : { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-10%" }, transition: { duration: .75 } };
  return <>
    <section className="proof" id="proof"><Container className="proof-grid">
      {[["03+", "Major Projects"], ["10+", "Technologies"], ["∞", "Ideas in Progress"], ["01", "Mission"]].map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
    </Container></section>

    <Philosophy />

    <section className="capabilities section" id="capabilities"><Container>
      <SectionLabel>01 / CAPABILITIES</SectionLabel>
      <div className="section-heading"><h2>FROM IDEA<br /><em>TO SYSTEM.</em></h2><p>I move between intelligence, infrastructure and interface — shaping the whole product, not just one layer.</p></div>
      <div className="capability-list">{capabilities.map((cap) => <motion.article key={cap.title} {...reveal}>
        <span>{cap.number}</span><h3>{cap.title}</h3><ul>{cap.items.map((item) => <li key={item}>{item}</li>)}</ul><b aria-hidden="true">↗</b>
      </motion.article>)}</div>
    </Container></section>

    <section className="work section" id="work"><Container>
      <SectionLabel>02 / SELECTED WORK</SectionLabel>
      <div className="section-heading work-heading"><h2>WORK THAT<br /><em>MATTERS.</em></h2><p>Selected product systems at the intersection of artificial intelligence, engineering and human experience.</p></div>
      <div className="projects">{projects.map((project, index) => <motion.article className={`project-card ${project.tone}`} key={project.title} {...reveal}>
        <div className="project-info"><span className="project-number">PROJECT / {project.number}</span><p>{project.category}</p><h3>{project.title}</h3><p className="project-description">{project.description}</p><div className="tags">{project.technologies.map((tag) => <Tag key={tag}>{tag}</Tag>)}</div><a href="#contact" aria-label={`View ${project.title} project`}>VIEW PROJECT <span>↗</span></a></div>
        <ProjectVisual title={project.title} index={index} />
      </motion.article>)}</div>
    </Container></section>

    <section className="engineering section" id="engineering"><Container>
      <SectionLabel light>03 / ENGINEERING</SectionLabel>
      <div className="engineering-intro"><h2>FROM IDEA<br /><em>TO SYSTEM.</em></h2><p>Every useful product is a chain of decisions. I work across the chain — translating ambiguity into architecture, code and experience.</p></div>
      <ol className="pipeline">{pipeline.map((step, index) => <motion.li key={step} initial={reduced ? false : { opacity: .25 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: index * .08 }}><span>0{index + 1}</span><strong>{step}</strong>{index < pipeline.length - 1 && <i aria-hidden="true">↓</i>}</motion.li>)}</ol>
    </Container></section>

    <section className="technology section"><Container>
      <SectionLabel>THE TECHNOLOGY</SectionLabel>
      <div className="section-heading tech-heading"><h2>THE SYSTEMS<br /><em>BEHIND THE WORK.</em></h2><p>Selected tools, chosen for fit — never fashion.</p></div>
      <div className="technology-list">{technologies.map((technology, index) => <motion.div key={technology} whileHover={{ x: 8 }}><span>{String(index + 1).padStart(2, "0")}</span><strong>{technology}</strong><i aria-hidden="true">●</i></motion.div>)}</div>
    </Container></section>

    <section className="manifesto"><Container><motion.div {...reveal}>
      <p>PRODUCT PHILOSOPHY / 01</p><h2>MAKE COMPLEXITY<br /><em>FEEL SIMPLE.</em></h2><blockquote>“Good technology should not make people think about the technology. It should make difficult things feel effortless.”</blockquote>
    </motion.div></Container></section>

    <section className="about section" id="about"><Container>
      <SectionLabel>04 / ABOUT</SectionLabel><div className="about-grid"><h2>A DEVELOPER.<br />A BUILDER.<br /><em>A CONSTANT LEARNER.</em></h2><div><p>I’m Anchal Sharma — an AI engineer and full-stack product builder interested in the space where capable systems meet clear, human experiences.</p><p>I think in products: the problem, the system behind it, and the interaction that makes it useful.</p><ButtonLink href="#contact">MORE ABOUT ME</ButtonLink></div></div>
    </Container></section>

    <footer className="final-cta" id="contact"><Container>
      <div className="footer-orbit" aria-hidden="true"><i /><i /><span>A.</span></div><p>AVAILABLE FOR AMBITIOUS IDEAS</p><h2>HAVE A PROBLEM<br /><em>WORTH SOLVING?</em></h2><ButtonLink href={site.email}>LET&apos;S BUILD IT</ButtonLink>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} ANCHAL SHARMA</span><div>{site.social.map((item) => <a key={item.label} href={item.href}>{item.label} ↗</a>)}</div><a href="#top">BACK TO TOP ↑</a></div>
    </Container></footer>
  </>;
}
