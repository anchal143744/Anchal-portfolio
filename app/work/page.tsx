"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ProjectCaseModal from "../components/ProjectCaseModal";
import { Footer, Header } from "../components/SiteShell";
import { portfolioProjects as caseStudies } from "../data/projects";

import WorkCard from "./WorkCard";
import "./work.css";

type CaseStudy = (typeof caseStudies)[number];

type PerspectiveCard = {
  category: string;
  title: string;
  action: string;
} & ({ project: string; href?: never } | { href: string; project?: never });

const galleryItems: PerspectiveCard[] = [
  { category: "Product", title: "Product Direction", action: "View NEXORA Case Study", project: "ai-assisted-development" },
  { category: "Product", title: "Feature Prioritisation", action: "View AI Operations", project: "e-commerce" },
  { category: "Experience", title: "Interface Clarity", action: "Explore My Portfolio", project: "client-web-projects" },
  { category: "Workflows", title: "Connected Retail Workflows", action: "Explore NEXORA", project: "ai-assisted-development" },
  { category: "Workflows", title: "Human Review & Control", action: "View AI Operations", project: "e-commerce" },
  { category: "Business", title: "Business-led Decisions", action: "Explore My Business Approach", href: "/business" },
  { category: "Experience", title: "Iterative Product Refinement", action: "View Portfolio Case Study", project: "client-web-projects" },
  { category: "Communication", title: "Product Storytelling", action: "Read Portfolio Case Study", project: "client-web-projects" },
];
const perspectiveCategories = ["All", ...new Set(galleryItems.map(item => item.category))];

const guideMessages = {
  welcome: {
    label: "AS / Guide",
    title: "You've entered Anchal's project space.",
    body:
      "Explore three independent projects, their business context and their current implementation boundaries.",
    action: "Explore around ↓",
    compactTitle: "Welcome to the build zone.",
    compactBody: "Ideas become real here. Explore the work ↓",
  },
  development: {
    label: "AI + Development",
    title: "Built with AI in the workflow.",
    body: "The idea and direction still start here. →",
    action: "",
    compactTitle: "Built with AI.",
    compactBody: "The direction still starts here. →",
  },
};

export default function WorkPage() {
  const [category, setCategory] = useState("All");
  const [archiveCategory, setArchiveCategory] = useState("All");
  const categories = ["All", ...new Set(caseStudies.map(item => item.category.split(" — ")[1]))];
  const visibleProjects = caseStudies.filter(item => category === "All" || item.category.split(" — ")[1] === category);
  const [activeCase, setActiveCase] = useState<CaseStudy | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isGuideVisible, setIsGuideVisible] = useState(false);
  const [isGuideBubbleOpen, setIsGuideBubbleOpen] = useState(false);
  const [isGuideSpotlight, setIsGuideSpotlight] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const lastTriggerRef = useRef<HTMLAnchorElement | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const guideIntroTimeoutRef = useRef<number | null>(null);
  const guideCloseTimeoutRef = useRef<number | null>(null);

  // Homepage links open the same case study used by the Work cards.
  useEffect(() => {
    let frame = 0;
    const openLinkedProject = () => {
      const archive = new URL(window.location.href).searchParams.get("archive");
      if (archive && galleryItems.some(item => item.category === archive)) {
        frame = requestAnimationFrame(() => setArchiveCategory(archive));
      }
      const slug = new URL(window.location.href).searchParams.get("project");
      const project = caseStudies.find(item => item.slug === slug);
      if (!project) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        lastTriggerRef.current = document.getElementById(project.id)?.querySelector<HTMLAnchorElement>(".case-link") ?? null;
        setIsClosing(false);
        setIsGuideBubbleOpen(false);
        setActiveCase(project);
      });
    };
    openLinkedProject();
    window.addEventListener("popstate", openLinkedProject);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("popstate", openLinkedProject); };
  }, []);

  const closeModal = useCallback(() => {
    if (!activeCase || isClosing) {
      return;
    }

    const url = new URL(window.location.href);
    if (url.searchParams.has("project")) {
      url.searchParams.delete("project");
      window.history.replaceState(window.history.state, "", url);
    }
    setIsClosing(true);
    closeTimeoutRef.current = window.setTimeout(() => {
      setActiveCase(null);
      setIsClosing(false);
    }, 240);
  }, [activeCase, isClosing, setActiveCase, setIsClosing]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
      }
      if (guideIntroTimeoutRef.current) {
        window.clearTimeout(guideIntroTimeoutRef.current);
      }
      if (guideCloseTimeoutRef.current) {
        window.clearTimeout(guideCloseTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const hasSeenGuide = window.sessionStorage.getItem("portfolioGuideSeen") === "true";

    if (hasSeenGuide) {
      guideIntroTimeoutRef.current = window.setTimeout(() => {
        setIsGuideVisible(true);
      }, 0);
      return;
    }

    guideIntroTimeoutRef.current = window.setTimeout(() => {
      setIsGuideVisible(true);
      setIsGuideSpotlight(true);
      setIsGuideBubbleOpen(true);
      window.sessionStorage.setItem("portfolioGuideSeen", "true");

      guideCloseTimeoutRef.current = window.setTimeout(() => {
        setIsGuideBubbleOpen(false);
        setIsGuideSpotlight(false);
      }, 5000);
    }, 500);
  }, []);

  useEffect(() => {
    const footer = document.querySelector(".site-footer");

    if (!footer) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          setIsGuideBubbleOpen(false);
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(footer);

    return () => {
      observer.disconnect();
    };
  }, []);



  return (
    <>
      <Header />
      <main className="page-main work-page">
        <section className="page-hero">
          <p className="eyebrow">Selected Work</p>
          <h1>Things I&apos;ve built<br />&amp; created<span className="work-period">.</span></h1>
          <p>
            Three independent projects exploring retail operations, B2B workflows
            and professional product presentation.
          </p>
        </section>

        <div className="work-filters" role="group" aria-label="Filter projects by category">
          {categories.map(name => <button key={name} type="button" aria-pressed={category === name} onClick={() => setCategory(name)}>{name}</button>)}
        </div>
        <p className="work-count" role="status">{visibleProjects.length} of {caseStudies.length} entries</p>
        <section className="work-collection" aria-label="Project collection">
          {caseStudies.map(item => <WorkCard key={item.id} item={item}
            hidden={!visibleProjects.includes(item)} onOpen={event => {
              lastTriggerRef.current = event.currentTarget;
              setIsClosing(false);
              setIsGuideBubbleOpen(false);
              setActiveCase(item);
            }} />)}
        </section>

        <section className="creative-archive" id="creative-archive">
          <div className="archive-head">
            <p className="eyebrow">My Product Perspective</p>
            <h2>The thinking behind the products.</h2>
            <p>
              I connect product direction, interface clarity and business workflows
              to give ideas a practical shape. Explore the decisions behind NEXORA,
              AI Operations and this portfolio, from feature priorities to the way
              each product tells its story.
            </p>
          </div>
          <div className="work-filters archive-filters" role="group" aria-label="Filter product perspectives">
            {perspectiveCategories.map(
              (item) => (
                <button type="button" key={item} aria-pressed={archiveCategory === item} onClick={() => setArchiveCategory(item)}>{item}</button>
              ),
            )}
          </div>
          <div className="masonry-grid">
            {galleryItems.map(({ category, title, action, project, href: pageHref }, index) => {
              const href = project ? `/work?project=${project}` : pageHref;
              return <article hidden={archiveCategory !== "All" && archiveCategory !== category} key={`${category}-${title}`} className={`archive-category-card archive-${["cream", "dark", "dark", "orange"][index % 4]}`}>
                <p className="archive-category-label">{category} / Focus</p>
                <h3>{title}</h3>
                <a href={href} aria-haspopup={project ? "dialog" : undefined} onClick={event => {
                  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                  if (project) {
                    event.preventDefault();
                    const entry = caseStudies.find(item => item.slug === project);
                    if (entry) { setIsClosing(false); setIsGuideBubbleOpen(false); setActiveCase(entry); }
                  }
                }}>{action} <span aria-hidden="true">↗</span></a>
              </article>;
            })}
          </div>
        </section>

      </main>
      {activeCase && <ProjectCaseModal activeCase={activeCase} isClosing={isClosing} closeModal={closeModal} onNext={project => { setIsClosing(false); setIsGuideBubbleOpen(false); setActiveCase(project); }} />}
      {isGuideVisible && !activeCase && !isFooterVisible ? (
        <aside
          className={`rs-guide ${isGuideBubbleOpen ? "is-open" : ""} ${
            isGuideSpotlight ? "is-spotlight" : ""
          }`}
          aria-label="AS portfolio guide"
        >
          {isGuideBubbleOpen ? (
            <div className="rs-guide-bubble">
              <button
                className="rs-guide-close"
                type="button"
                onClick={() => {
                  if (guideCloseTimeoutRef.current) {
                    window.clearTimeout(guideCloseTimeoutRef.current);
                  }
                  setIsGuideBubbleOpen(false);
                  setIsGuideSpotlight(false);
                }}
              >
                × Close
              </button>
              <p>{guideMessages.welcome.label}</p>
              <h2>
                <span className="guide-copy-full">{guideMessages.welcome.title}</span>
                <span className="guide-copy-compact">
                  {guideMessages.welcome.compactTitle}
                </span>
              </h2>
              <span className="guide-copy-full">{guideMessages.welcome.body}</span>
              <span className="guide-copy-compact">
                {guideMessages.welcome.compactBody}
              </span>
              <strong className="guide-copy-full">{guideMessages.welcome.action}</strong>
            </div>
          ) : null}
          <button
            className="rs-guide-button"
            type="button"
            aria-label="Open portfolio guide"
            onClick={() => {
              setIsGuideSpotlight(false);
              setIsGuideBubbleOpen((isOpen) => !isOpen);
            }}
          >
            <span className="rs-guide-character" aria-hidden="true">
              <span className="rs-guide-cap" />
              <span className="rs-guide-face">
                <b>AS</b>
                <i />
              </span>
              <span className="rs-guide-shadow" />
            </span>
          </button>
        </aside>
      ) : null}
      <Footer />
    </>
  );
}
