"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import type { PortfolioProject } from "../data/projects";

function OperationsMedia() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const pauseWhenHidden = () => { if (document.hidden) element.pause(); };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) element.pause();
    }, { threshold: 0 });
    observer.observe(element);
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", pauseWhenHidden); element.pause(); };
  }, []);
  return <div className="work-media work-media-operations">
    <div className="operations-media-heading"><span>Product walkthrough</span><span className="operations-demo-label">Local demo</span></div>
    <div className="operations-demo-frame">
      <video ref={video} src="/ai-operations-console-demo.mp4" poster="/ai-operations-console-poster.jpg" width="1280" height="720" controls muted loop playsInline preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} aria-label="AI Operations product walkthrough: actual application footage with fictional demonstration data" />
    </div>
    <div className="operations-screen-strip">
      <figure><img src="/ai-operations-case-leads.png" alt="Actual AI Operations lead records in a fictional demo workspace" width="1894" height="1056" loading="lazy" /><figcaption><span>01</span> Customer context</figcaption></figure>
      <figure><img src="/ai-operations-case-workflows.png" alt="Actual AI Operations workflow controls using fictional demo data" width="1894" height="1056" loading="lazy" /><figcaption><span>02</span> Workflow control</figcaption></figure>
    </div>
    <div className="work-media-caption operations-media-footer"><span>Actual app capture · Fictional demo data</span><button type="button" onClick={() => {
      const element = video.current;
      if (!element) return;
      if (element.paused) void element.play().catch(() => setPlaying(false));
      else element.pause();
    }}>{playing ? "Pause demo" : "Play demo"}<span aria-hidden="true">{playing ? " Ⅱ" : " ▶"}</span></button></div>
  </div>;
}

function ProjectMedia({ item }: { item: PortfolioProject }) {
  const video = useRef<HTMLVideoElement>(null);
  const [showVideo, setShowVideo] = useState(false);
  const isAutoId = item.id === "ai-assisted-development";
  const isBusiness = item.id === "business-work";
  const isShopify = item.id === "e-commerce";
  const hasScreenshot = isAutoId || isShopify;
  const source = item.cardMedia ?? item.image;
  const isVideo = source.endsWith(".mp4");
  useEffect(() => {
    const element = video.current;
    if (!element || (hasScreenshot && !showVideo)) return;
    let visible = false;
    const sync = () => {
      if (visible && !document.hidden) {
        element.currentTime = 0;
        void element.play().catch(() => {});
      } else element.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold: .05 });
    observer.observe(element);
    document.addEventListener("visibilitychange", sync);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", sync); element.pause(); };
  }, [showVideo, hasScreenshot]);
  return <div className={`work-media ${isAutoId ? "work-media-app" : ""}`}>
    <div className="work-media-stage">
      {isAutoId && !showVideo && <img src="/nexora-laptop-poster.jpg" alt="Actual NEXORA application displayed inside a laptop mockup with fictional demo data" />}
      {isShopify && !showVideo && <div className="work-store-screens">
        <img src="/ai-operations-case-leads.png" alt="Actual AI Operations lead records in a fictional demo workspace" loading="lazy" />
        <img src="/ai-operations-case-workflows.png" alt="Actual AI Operations workflow controls using fictional demo data" loading="lazy" />
      </div>}
      {isBusiness ? <div className="work-business-photos">
        <img src="/business-flex-printer.jpg" alt="Large-format flex printing machine producing a banner" loading="lazy" />
        <img src="/business-lucky-flex-cards.jpg" alt="Lucky Flex business cards displaying printing and signage services" loading="lazy" />
      </div> : isVideo ? <video hidden={hasScreenshot && !showVideo} ref={video} src={source} poster={item.poster} muted loop playsInline preload={hasScreenshot && !showVideo ? "none" : "metadata"} aria-label={item.thumbnailAlt} />
        : <img src={source} alt={item.thumbnailAlt} loading="lazy" />}
    </div>
    <div className="work-media-caption">
      <span>{isAutoId && !showVideo ? "NEXORA AI OS / actual application preview" : isShopify && !showVideo ? "AI Operations / actual application screens" : isBusiness ? "Flex printing / production & business identity" : item.shortTitle + " / preview"}</span>
      {hasScreenshot && <button type="button" onClick={() => setShowVideo(value => !value)}>{showVideo ? (isShopify ? "Show screenshots" : "Show original visual") : "Watch preview"}<span aria-hidden="true"> ↗</span></button>}
    </div>
  </div>;
}

export default function WorkCard({ item, hidden, onOpen }: {
  item: PortfolioProject; hidden: boolean; onOpen: (event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  const card = useRef<HTMLElement>(null);
  const seen = useRef(false);
  useEffect(() => {
    const element = card.current;
    if (!element || hidden || seen.current || !window.IntersectionObserver) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animation: Animation | undefined;
    const reveal = () => { animation?.finish(); seen.current = true; };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      seen.current = true;
      observer.disconnect();
      if (!reduced.matches && !element.contains(document.activeElement)) {
        animation = element.animate([{ opacity: 0, transform: "translateY(16px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 480, easing: "cubic-bezier(.2,.7,.2,1)" });
      }
    }, { threshold: .06 });
    observer.observe(element);
    element.addEventListener("focusin", reveal);
    reduced.addEventListener("change", reveal);
    return () => { observer.disconnect(); animation?.cancel(); element.removeEventListener("focusin", reveal); reduced.removeEventListener("change", reveal); };
  }, [hidden]);

  return <article ref={card} className={`work-card${item.id === "e-commerce" ? " work-card-operations" : ""}`} id={item.id} hidden={hidden}>
    {item.id === "e-commerce" ? <OperationsMedia/> : <ProjectMedia item={item} />}
    <div className="work-card-copy">
      <p className="work-category">{item.category}</p>
      <h2>{item.shortTitle}</h2>
      <p className="work-purpose">{item.featuredDescription}</p>
      <dl className="work-meta">
        <div><dt>My contribution</dt><dd>{item.role}</dd></div>
        <div><dt>{item.id === "e-commerce" ? "Product stack" : "Tools & platforms"}</dt><dd>{item.id === "e-commerce" ? <ul className="operations-stack" aria-label="Technologies used in AI Operations">{item.tools.split(" · ").map(tool => <li key={tool}>{tool}</li>)}</ul> : item.tools}</dd></div>
      </dl>
      <details className="work-disclosure">
        <summary><span className="details-open">{item.id === "e-commerce" ? "Explore product capabilities" : "View details"}</span><span className="details-close">Hide details</span><span className="details-symbol" aria-hidden="true">+</span></summary>
        <div className="work-full-details">
          <h3>{item.title.replaceAll("\n", " ")}</h3>
          <p>{item.sentence}</p>
          <p>{item.overview}</p>
          <h4>Key highlights</h4>
          <ul>{item.highlights.map(text => <li key={text}>{text}</li>)}</ul>
          <p className="work-tags">{item.tags.map(tag => <span key={tag}>{tag}</span>)}</p>
          <p><strong>Project type: </strong>{item.status}</p>
          <h4>{item.id === "e-commerce" ? "Product decisions" : "AI's role"}</h4><p>{item.ai}</p>
        </div>
      </details>
      <a className="case-link work-action" href={`/work/${item.slug}`} aria-haspopup="dialog" onClick={event => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault(); onOpen(event);
      }}>{item.id === "ai-assisted-development" || item.id === "e-commerce" ? "View Case Study" : item.id === "client-web-projects" ? "Explore Projects" : item.id === "video-media" ? "View Collection" : "Explore Business Work"} <span aria-hidden="true">↗</span></a>
    </div>
  </article>;
}
