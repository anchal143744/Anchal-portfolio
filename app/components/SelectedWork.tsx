"use client";

import { stickyRestTop } from "../lib/portfolio-scroll";
import Link from "next/link";
import { HomeProjectLink } from "./HomeProjectDialogs";
import { useEffect, useRef, type CSSProperties } from "react";
import { featuredProjects, isVideoSource } from "../data/projects";
import "./selected-work.css";

const projects = featuredProjects.slice(0, 3);
const stackedQuery = "(min-width: 768px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)";

export default function SelectedWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current!;
    const heading = headingRef.current!;
    const navigation = document.querySelector<HTMLElement>(".site-header");
    const media = matchMedia(stackedQuery);
    let frame = 0;
    const measure = () => {
      frame = 0;
      const navTop = navigation ? stickyRestTop(navigation) : 0;
      const top = (navigation?.offsetHeight || 0) + navTop + 24;
      const headingHeight = heading.offsetHeight;
      const cardHeight = Math.min(600, innerHeight - top - headingHeight - 24 - (projects.length - 1) * 14 - 24);
      section.style.setProperty("--sw-top", `${top}px`);
      section.style.setProperty("--sw-heading-height", `${headingHeight}px`);
      section.style.setProperty("--sw-card-height", `${Math.max(0, cardHeight)}px`);
      const fits = [...section.querySelectorAll<HTMLElement>(".sw-copy")].every(copy => {
        const style = getComputedStyle(copy);
        const required = [...copy.children].reduce((height, child) => {
          const css = getComputedStyle(child);
          return height + child.getBoundingClientRect().height + (parseFloat(css.marginTop) || 0) + (parseFloat(css.marginBottom) || 0);
        }, parseFloat(style.paddingTop) + parseFloat(style.paddingBottom));
        return required <= cardHeight - 2;
      });
      section.dataset.stacked = String(media.matches && cardHeight >= 400 && fits);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    // Keeping the normal card heights during focus avoids a scroll jump. Each
    // sticky wrapper becomes relative, and focus is then brought into view.
    const revealFocus = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".sw-card-slot")) return;
      section.dataset.keyboard = "true";
      requestAnimationFrame(() => target.scrollIntoView({ block: "center", behavior: "instant" }));
    };
    const restoreStack = (event: FocusEvent) => {
      if (!section.contains(event.relatedTarget as Node | null)) delete section.dataset.keyboard;
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(heading);
    section.querySelectorAll(".sw-copy").forEach(copy => observer.observe(copy));
    if (navigation) observer.observe(navigation);
    media.addEventListener("change", schedule);
    window.addEventListener("resize", schedule);
    section.addEventListener("focusin", revealFocus);
    section.addEventListener("focusout", restoreStack);
    measure();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      media.removeEventListener("change", schedule);
      window.removeEventListener("resize", schedule);
      section.removeEventListener("focusin", revealFocus);
      section.removeEventListener("focusout", restoreStack);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current!;
    const cards = [...section.querySelectorAll<HTMLElement>(".sw-card-slot")];
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const states = cards.flatMap((card, index) => {
      const video = card.querySelector("video");
      return video ? [{ video, index, eligible: false }] : [];
    });
    let frame = 0;
    const update = () => {
      frame = 0;
      const pin = section.querySelector<HTMLElement>(".sw-heading-pin")!;
      const lastCard = cards[cards.length - 1].getBoundingClientRect();
      // Once the last card leaves its sticky position, move the heading by
      // the same amount. Read the untransformed wrapper to avoid feedback.
      const release = section.dataset.stacked === "true" && section.dataset.keyboard !== "true"
        ? Math.min(0, lastCard.top - pin.getBoundingClientRect().top - headingRef.current!.offsetHeight - 24 - (cards.length - 1) * 14)
        : 0;
      section.style.setProperty("--sw-heading-release", `${release}px`);
      const heading = headingRef.current!.getBoundingClientRect();
      const navigation = document.querySelector(".site-header")?.getBoundingClientRect();
      const top = Math.max(0, navigation?.bottom || 0, heading.bottom);
      const rects = cards.map(card => card.getBoundingClientRect());
      states.forEach(state => {
        const { video, index } = state;
        const rect = video.getBoundingClientRect();
        // Sticky cards remain in the viewport even when the next card covers
        // them. Count only the exposed video area, below the pinned heading.
        const bottom = Math.min(innerHeight, rect.bottom, ...rects.slice(index + 1).map(card => card.top));
        const visibleHeight = Math.max(0, bottom - Math.max(top, rect.top));
        const visibleWidth = Math.max(0, Math.min(innerWidth, rect.right) - Math.max(0, rect.left));
        const visible = rect.height > 0 && rect.width > 0 &&
          visibleHeight * visibleWidth / (rect.height * rect.width) >= 0.45;
        const eligible = visible && !document.hidden && !motion.matches;
        if (!eligible) {
          state.eligible = false;
          video.pause();
          if (video.readyState >= 1 && video.currentTime > 0) video.currentTime = 0;
        } else if (!state.eligible && video.readyState >= 1) {
          state.eligible = true;
          video.muted = true;
          video.currentTime = 0;
          void video.play().catch(() => { /* Leave a static preview if autoplay is blocked. */ });
        }
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const listeners = states.map(state => {
      state.video.addEventListener("loadedmetadata", schedule);
      return () => {
        state.video.removeEventListener("loadedmetadata", schedule);
        state.video.pause();
      };
    });
    const observer = new ResizeObserver(schedule);
    observer.observe(section);
    window.addEventListener("portfolio-scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", schedule);
    motion.addEventListener("change", schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("portfolio-scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", schedule);
      motion.removeEventListener("change", schedule);
      listeners.forEach(remove => remove());
    };
  }, []);

  return (
    <section className="sw-section" id="featured-work" aria-labelledby="featured-work-title" ref={sectionRef}>

        <div className="sw-heading-pin">
        <header className="sw-heading" ref={headingRef}>
          <p className="sw-eyebrow">Selected Work</p>
          <h2 id="featured-work-title">Selected projects.<br />Built with purpose.</h2>
          <Link className="sw-all" href="/work">View all projects <span aria-hidden="true">↗</span></Link>
        </header>
        </div>
        <div className="sw-stack" aria-label="Selected projects">
            {projects.map((project, index) => (
              <article className="sw-card-slot" key={project.id} style={{ "--sw-index": index, "--sw-timeline": `--sw-card-${index}`, "--sw-next-timeline": `--sw-card-${index + 1}` } as CSSProperties}>
                <div className="sw-card">
                <div className="sw-copy">
                  <span className="sw-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <p className="sw-category">{project.category.replace(/^\d+\s*—\s*/, "")}</p>
                  <h3>{project.shortTitle}</h3>
                  <p className="sw-description">{project.featuredDescription}</p>
                  <ul className="sw-tags" aria-label="Project tags">{project.tags.slice(0, 3).map(tag => <li key={tag}>{tag}</li>)}</ul>
                  <HomeProjectLink className="sw-case" slug={project.slug}>View case study <span aria-hidden="true">↗</span><span className="sw-sr-only">: {project.shortTitle}</span></HomeProjectLink>
                </div>
                <div className="sw-artwork">
                  {isVideoSource(project.thumbnail) ? <video src={project.thumbnail} poster={project.poster} aria-label={project.thumbnailAlt} muted playsInline loop preload="metadata" controls={false} disablePictureInPicture disableRemotePlayback tabIndex={-1} style={{ pointerEvents: "none" }} /> : <img src={project.thumbnail} alt={project.thumbnailAlt} loading="lazy" />}
                </div>
                </div>
              </article>
            ))}
        </div>
    </section>
  );
}
