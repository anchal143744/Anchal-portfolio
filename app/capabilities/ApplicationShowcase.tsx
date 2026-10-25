"use client";

import { useEffect, useRef, useState } from 'react';
import { applications, type Application } from './profile-data';
import './application-showcase.css';

const allApplications = applications.flatMap(group => group.items);
const rows = [allApplications.slice(0, 7), allApplications.slice(7)];
const PIXELS_PER_SECOND = 25;

function Logo({ app }: { app: Application }) {
  return app.logo ? <img src={app.logo} alt="" width="56" height="56" className={app.monochrome ? 'application-logo monochrome' : 'application-logo'} /> : <svg className="application-logo" viewBox="0 0 56 56" aria-hidden="true"><rect x="3" y="3" width="50" height="50" rx="12" fill="#39352e"/><text x="28" y="34" textAnchor="middle" fontSize="17" fontWeight="750" fill="#fff5e6">{app.mark}</text></svg>;
}

export default function ApplicationShowcase() {
  const panel = useRef<HTMLDivElement>(null);
  const [copies, setCopies] = useState(2);
  useEffect(() => {
    const root = panel.current!;
    let visible = false;
    const sync = () => { root.dataset.running = String(visible && !document.hidden); };
    const measure = () => {
      let needed = 2;
      root.querySelectorAll<HTMLElement>('.application-marquee').forEach(row => {
        const group = row.querySelector<HTMLElement>('.application-logo-group')!;
        const width = group.getBoundingClientRect().width;
        if (!width) return;
        row.style.setProperty('--loop-distance', `${width}px`);
        row.style.setProperty('--loop-duration', `${width / PIXELS_PER_SECOND}s`);
        needed = Math.max(needed, Math.ceil(row.clientWidth / width) + 1);
      });
      setCopies(previous => previous === needed ? previous : needed);
    };
    const resize = new ResizeObserver(measure); resize.observe(root);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(root); document.addEventListener('visibilitychange', sync);
    measure(); sync();
    return () => { resize.disconnect(); observer.disconnect(); document.removeEventListener('visibilitychange', sync); };
  }, []);

  return <>
    <p className="application-introduction">The interface, data, motion and verification technologies used across NEXORA, AI Operations and this portfolio.</p>
    <div className="application-showcase" ref={panel}>
      <div className="application-showcase-top"><span>IN THE PROJECT STACK</span></div>
      {/* The complete accessible inventory lives in the category details below. */}
      <div className="application-moving-rows" aria-hidden="true">{rows.map((apps, row) => <div className={`application-marquee row-${row}`} key={row}><div className="application-logo-track">{Array.from({ length: copies }, (_, copy) => <div className="application-logo-group" key={copy}>{apps.map(app => <div className="application-logo-item" key={app.name}><Logo app={app} /><span>{app.name}</span></div>)}</div>)}</div></div>)}</div>
      <div className="application-static-grid" aria-hidden="true">{allApplications.map(app => <div className="application-logo-item" key={app.name}><Logo app={app} /><span>{app.name}</span></div>)}</div>
    </div>
    <div className="application-category-details">{applications.map(group => <details key={group.title}><summary>{group.title}<span aria-hidden="true">+</span></summary><div className="application-detail-list">{group.items.map(app => <article key={app.name}><div className="application-detail-logo"><Logo app={app} /></div><div><h4>{app.name}</h4><p>{app.use}</p>{app.proficiency && <p className="app-proficiency">{app.proficiency}<span> · tool use</span></p>}</div></article>)}</div></details>)}</div>
  </>;
}
