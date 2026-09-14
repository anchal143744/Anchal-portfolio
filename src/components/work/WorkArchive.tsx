"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { projects, type ProjectFilter } from "@/data/projects";
import { Container, SectionLabel, Tag } from "@/components/ui/Primitives";
import { MotionProvider } from "@/components/motion/MotionProvider";

const WorkScene = dynamic(() => import("./WorkScene"), { ssr: false });
const filters = ["ALL", "AI", "ENGINEERING", "PRODUCT", "DESIGN"] as const;
type Filter = (typeof filters)[number];

export function WorkArchive() {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [activeId, setActiveId] = useState(projects[0].id);
  const reduced = useReducedMotion();
  const visibleProjects = useMemo(() => filter === "ALL" ? projects : projects.filter((project) => project.filters.includes(filter as ProjectFilter)), [filter]);
  const activeProject = projects.find((project) => project.id === activeId) ?? visibleProjects[0] ?? projects[0];

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>("[data-project]");
    const observer = new IntersectionObserver((entries) => {
      const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (current) setActiveId((current.target as HTMLElement).dataset.project as typeof activeId);
    }, { rootMargin: "-20% 0px -20%", threshold: [.2, .5, .8] });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [visibleProjects]);

  return <div className="work-page" id="top">
    <MotionProvider />
    <section className="work-intro" aria-labelledby="work-title"><Container>
      <motion.div className="work-intro-grid" initial={reduced ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, ease: [.22, 1, .36, 1] }}>
        <SectionLabel>02 / SELECTED WORK</SectionLabel>
        <h1 id="work-title">BUILT TO<br />MAKE AN<br /><em>IMPACT.</em></h1>
        <p>Products, systems and experiences built at the intersection of AI, engineering and design.</p>
        <span className="archive-note">DIGITAL ARCHIVE<br />2026 — ONGOING</span>
      </motion.div>
      <div className="project-index" aria-label="Project index">{projects.map((project) => <a href={`#${project.id}`} key={project.id}><span>{project.number}</span><strong>{project.title}</strong><small>{project.subtitle}</small><i>↓</i></a>)}</div>
    </Container></section>

    <section className="archive" aria-label="Selected project archive"><Container>
      <div className="archive-toolbar">
        <p>FILTER THE ARCHIVE</p>
        <div role="group" aria-label="Filter projects by discipline">{filters.map((item) => <button key={item} type="button" className={filter === item ? "active" : ""} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>)}</div>
        <span>{String(visibleProjects.length).padStart(2, "0")} PROJECTS</span>
      </div>
    </Container>

    <div className="archive-body">
      <div className={`shared-stage ${activeProject.tone}`} aria-hidden="true">
        <div className="stage-fallback"><i /><i /><strong>{activeProject.title.charAt(0)}</strong></div>
        <WorkScene mode={activeProject.visual} />
        <span>ACTIVE SYSTEM / {activeProject.number}</span>
      </div>
      <AnimatePresence mode="popLayout" initial={false}>
        {visibleProjects.map((project, index) => <motion.article
          layout
          data-project={project.id}
          id={project.id}
          key={project.id}
          className={`archive-project ${project.tone} ${index % 2 ? "reverse" : ""}`}
          initial={reduced ? false : { opacity: 0, y: 35, filter: "blur(5px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: .55, ease: [.22, 1, .36, 1] }}
          onMouseEnter={() => setActiveId(project.id)}
        >
          <Container className="archive-project-inner">
            <div className="project-editorial">
              <div className="project-kicker"><span>{project.number}</span><p>{project.status}<br />{project.year}</p></div>
              <h2>{project.title}</h2>
              <h3>{project.subtitle}</h3>
              <p className="archive-description">{project.description}</p>
              <div className="archive-tags">{project.technologies.map((technology) => <Tag key={technology}>{technology}</Tag>)}</div>
              <Link className="case-link" href={project.href} aria-label={`Explore ${project.title} case study`}>EXPLORE {project.title} <span>↗</span></Link>
            </div>
            <div className="stage-space" role="img" aria-label={`${project.title}: ${project.visual} product concept visualization`}>
              <p>{project.visual === "architectural" ? "AI AGENTS → WORKFLOWS → AUTOMATION → OPERATIONS" : project.visual === "organic" ? "GUIDANCE / CARE / ACCESS" : "TECHNOLOGY / PRODUCT / COMMERCE"}</p>
            </div>
          </Container>
        </motion.article>)}
      </AnimatePresence>
    </div></section>

    <section className="work-outro"><Container><p>THE NEXT SYSTEM IS<br />STILL UNWRITTEN.</p><h2>HAVE A PROBLEM<br /><em>WORTH SOLVING?</em></h2><a href="mailto:hello@anchal.dev">LET&apos;S BUILD IT <span>↗</span></a><div><span>© {new Date().getFullYear()} ANCHAL SHARMA</span><Link href="/">RETURN HOME ↑</Link></div></Container></section>
  </div>;
}
