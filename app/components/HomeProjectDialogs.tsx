"use client";

import { createContext, useContext, useState, useCallback, useRef, useEffect, type ReactNode } from "react";
import ProjectCaseModal from "./ProjectCaseModal";
import { portfolioProjects, type PortfolioProject } from "../data/projects";

const ProjectDialogContext = createContext<((slug: string) => void) | null>(null);

export function HomeProjectDialogs({ children }: { children: ReactNode }) {
  const [project, setProject] = useState<PortfolioProject | null>(null);
  const [closing, setClosing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const open = useCallback((slug: string) => {
    const match = portfolioProjects.find(item => item.slug === slug);
    if (!match) return;
    if (timer.current) clearTimeout(timer.current);
    setClosing(false); setProject(match);
  }, []);
  const close = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setClosing(true);
    timer.current = setTimeout(() => { setProject(null); setClosing(false); }, matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 240);
  }, []);
  return <ProjectDialogContext.Provider value={open}>{children}
    {project && <ProjectCaseModal activeCase={project} isClosing={closing} closeModal={close} onNext={item => open(item.slug)} returnLabel="Home"/>}
  </ProjectDialogContext.Provider>;
}

export function HomeProjectLink({ slug, className, children }: { slug: string; className: string; children: ReactNode }) {
  const open = useContext(ProjectDialogContext);
  return <a href={`/work?project=${slug}`} className={className} aria-haspopup="dialog" onClick={event => {
    if (!open || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); open(slug);
  }}>{children}</a>;
}
