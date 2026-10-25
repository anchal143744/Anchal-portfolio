"use client";
import { useEffect, useRef, useState, useId } from 'react';
import './skills-gallery.css';
import { chapters } from './gallery-content';
function Illustration({index}:{index:number}) {const silverId = useId(); return <svg viewBox="0 0 400 340" className="gallery-fallback" aria-hidden="true"><defs><linearGradient id={silverId} x2="1" y2="1"><stop stopColor="#fafafa"/><stop offset=".5" stopColor="#a6a9ac"/><stop offset="1" stopColor="#ededed"/></linearGradient></defs><ellipse cx="200" cy="282" rx="112" ry="14" fill="#292724" opacity=".08"/>{index===0?<g transform="translate(80 70) rotate(-7 120 90)">{[2,1,0].map(i=><rect key={i} x={i*14} y={-i*15} width="225" height="155" rx="10" fill={`url(#${silverId})`} stroke="#74716b"/>)}<rect x="15" y="18" width="190" height="12" fill="#262624"/><rect x="15" y="48" width="65" height="80" fill="#ff6800"/><path d="M100 55h95m-95 28h80m-80 28h90" stroke="#555" strokeWidth="8"/></g>:index===1?<g><rect x="85" y="65" width="235" height="170" rx="40" fill="none" stroke={`url(#${silverId})`} strokeWidth="22"/><path d="m176 108 65 40-65 40z" fill="#ff6800"/>{['#f6efe0','#262624','#ff6800'].map((c,i)=><circle key={c} cx={145+i*55} cy="242" r="17" fill={c} stroke="#888"/>)}</g>:index===2?<g><path d="m75 240 120-45 140 42-126 50z" fill="#a9aaab"/><path d="m120 105 90-30 86 38-90 32z" fill="#f9f5eb"/><path d="m120 105 86 40v109l-86-42z" fill="#c7bdac"/><path d="m206 145 90-32v104l-90 37z" fill="#eee4d2"/><path d="m157 93 90 39v60l22-8v-60l-89-39z" fill="#ff6800"/></g>:<g>{[[95,190],[175,190],[255,190],[135,110],[215,110],[175,30]].map(([x,y],i)=><g key={i}><path d={`M${x} ${y}l28-12 45 15-28 12z`} fill="#e7e8e9"/><path d={`M${x} ${y}l45 15v53l-45-15z`} fill={i===4?'#ff6800':'#a5a8aa'}/><path d={`M${x+45} ${y+15}l28-12v53l-28 12z`} fill="#555957"/></g>)}</g>}</svg>}
export default function SkillsGallery() {
  const root = useRef<HTMLElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const navigate = useRef<(index: number) => void>(() => {});
  const refresh = useRef<() => void>(() => {});
  const pause = useRef(false);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = root.current!;
    const canvasHost = host.current!;
    const sticky = el.querySelector<HTMLElement>('.gallery-sticky')!;
    const viewport = el.querySelector<HTMLElement>('.gallery-window')!;
    const track = el.querySelector<HTMLElement>('.gallery-track')!;
    const objectStage = el.querySelector<HTMLElement>('.gallery-object-stage')!;
    const articles = Array.from(el.querySelectorAll<HTMLElement>('.gallery-chapter'));
    const copies = articles.map(a => a.querySelector<HTMLElement>('.gallery-copy')!);
    const header = document.querySelector<HTMLElement>('.site-header');
    const media = matchMedia('(min-width: 1000px) and (min-height: 720px) and (prefers-reduced-motion: no-preference)');
    let start = 0, travel = 0, range = 1, progress = 0, current = -1, time = 0, last = 0;
    let horizontal = false, visible = false, disposed = false, loading = false, frame = 0, scrollFrame = 0;
    let chapterTops: number[] = [];
    let scene: ReturnType<typeof import('./gallery-scene')['createGalleryScene']> | undefined;

    const draw = () => {
      if (visible && !document.hidden) scene?.draw(Math.max(current, 0), horizontal ? time : 0, horizontal ? progress : -1);
    };
    const tick = (now: number) => {
      frame = 0;
      if (!visible || document.hidden || !horizontal || pause.current || !scene) { last = 0; return; }
      time += last ? Math.min((now - last) / 1000, .05) : 0;
      last = now;
      draw();
      frame = requestAnimationFrame(tick);
    };
    const schedule = () => {
      if (frame) return;
      draw();
      if (!frame && scene && visible && !document.hidden && horizontal && !pause.current) frame = requestAnimationFrame(tick);
    };
    const update = () => {
      scrollFrame = 0;
      progress = horizontal ? Math.max(0, Math.min(1, (scrollY - start) / range)) : 0;
      const next = horizontal ? Math.round(progress * 3) : chapterTops.reduce((best, top, i) => Math.abs(top - scrollY - innerHeight * .3) < Math.abs(chapterTops[best] - scrollY - innerHeight * .3) ? i : best, 0);
      track.style.transform = horizontal ? `translate3d(${-progress * travel}px,0,0)` : '';
      el.style.setProperty('--gallery-progress', `${(horizontal ? progress : next / 3) * 100}%`);
      el.style.setProperty('--object-parallax', `${horizontal ? progress * -10 : 0}px`);
      if (next !== current) {
        current = next;
        setActive(next); // Chapter changes only; continuous progress stays outside React.
      }
      articles.forEach((article, index) => {
        const hidden = horizontal && index !== next;
        // A focused chapter link is never made inert by incidental scrolling.
        article.toggleAttribute('inert', hidden && !article.contains(document.activeElement));
        article.classList.toggle('chapter-active', index === next);
      });
      const parent = horizontal ? objectStage : articles[next].querySelector('.gallery-visual')!;
      if (canvasHost.parentElement !== parent) parent.appendChild(canvasHost);
      schedule();
    };
    const measure = () => {
      if (disposed) return;
      const top = Math.ceil((header?.getBoundingClientRect().bottom || 88) + 20);
      el.style.setProperty('--gallery-top', `${top}px`);
      el.classList.toggle('gallery-horizontal', media.matches);
      // Measure the actual text in its desktop column, then opt out if it cannot fit.
      const contentHeight = Math.max(...copies.map(copy => copy.scrollHeight));
      const needed = Math.max(440, contentHeight + 64) + 136;
      horizontal = media.matches && needed <= innerHeight - top - 16;
      el.classList.toggle('gallery-horizontal', horizontal);
      el.style.setProperty('--gallery-height', `${Math.min(680, innerHeight - top - 16)}px`);
      travel = horizontal ? track.scrollWidth - viewport.clientWidth : 0;
      range = Math.max(1, travel);
      el.style.setProperty('--gallery-distance', `${range}px`);
      start = el.getBoundingClientRect().top + scrollY - top;
      chapterTops = articles.map(article => article.getBoundingClientRect().top + scrollY);
      update();
    };
    const onScroll = () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(update); };
    const onVisibility = () => {
      last = 0;
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
      else schedule();
    };
    refresh.current = () => { cancelAnimationFrame(frame); frame = 0; last = 0; schedule(); };
    navigate.current = index => {
      index = Math.max(0, Math.min(3, index));
      if (horizontal) window.scrollTo({ top: start + range * index / 3, behavior: 'instant' });
      else articles[index].scrollIntoView({ behavior: 'instant', block: 'start' });
      update();
    };
    const onHash = () => {
      const index = chapters.findIndex(chapter => `#${chapter.id}` === location.hash);
      if (index >= 0) navigate.current(index);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
      else { cancelAnimationFrame(frame); frame = 0; last = 0; }
    });
    observer.observe(sticky);
    const loader = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || loading) return;
      loading = true;
      import('./gallery-scene').then(module => {
        if (disposed) return;
        try {
          scene = module.createGalleryScene(canvasHost);
          canvasHost.classList.add('ready');
          el.classList.add('gallery-webgl');
          scene.canvas.addEventListener('webglcontextlost', () => {
            canvasHost.classList.remove('ready');
            el.classList.remove('gallery-webgl');
            cancelAnimationFrame(frame); frame = 0;
            scene?.dispose(); scene = undefined;
          }, { once: true });
          update();
        } catch { canvasHost.replaceChildren(); }
      }).catch(() => {});
    }, { rootMargin: '400px' });
    loader.observe(el);
    const resize = new ResizeObserver(measure);
    resize.observe(el); if (header) resize.observe(header);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    window.addEventListener('hashchange', onHash);
    document.addEventListener('visibilitychange', onVisibility);
    media.addEventListener('change', measure);
    measure(); onHash();
    document.fonts.ready.then(() => { if (!disposed) { measure(); onHash(); } });
    return () => {
      disposed = true;
      cancelAnimationFrame(frame); cancelAnimationFrame(scrollFrame);
      observer.disconnect(); loader.disconnect(); resize.disconnect(); scene?.dispose();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
      window.removeEventListener('hashchange', onHash);
      document.removeEventListener('visibilitychange', onVisibility);
      media.removeEventListener('change', measure);
    };
  }, []);

  return <section className="skills-gallery" ref={root} aria-label="Interactive skills gallery">
    <div className="gallery-sticky">
      <nav className="chapter-nav" aria-label="Capability chapters">
        {chapters.map((chapter, index) => <a href={`#${chapter.id}`} aria-current={active === index ? 'step' : undefined} key={chapter.id} onClick={event => {
          event.preventDefault(); history.replaceState(null, '', `#${chapter.id}`); navigate.current(index);
        }}><span>0{index + 1}</span><span>{chapter.label}</span></a>)}
      </nav>
      <div className="gallery-stage">
        <div className="gallery-window"><div className="gallery-track">
          {chapters.map((chapter, index) => <article className="gallery-chapter" id={chapter.id} key={chapter.id}>
            <div className="gallery-copy">
              <p className="gallery-number">0{index + 1} / Explore a discipline</p>
              <h2>{chapter.title}</h2><p>{chapter.description}</p>
              <ul>{chapter.skills.map(skill => <li key={skill}>{skill}</li>)}</ul>
              <a className="gallery-details-link" href={`#${chapter.detailId}`}>See all skills <span aria-hidden="true">↘</span></a>
            </div>
            <div className="gallery-visual"><Illustration index={index} /></div>
          </article>)}
        </div></div>
        <div className="gallery-object-stage" aria-hidden="true">
          <div className="gallery-object-accent" />
          <div className="gallery-desktop-fallback"><Illustration index={active} /></div>
          <div ref={host} className="gallery-canvas" />
        </div>
      </div>
      <div className="gallery-controls">
        <div><button onClick={() => navigate.current(active - 1)} disabled={active === 0} aria-label="Previous chapter">←</button><span aria-live="polite">0{active + 1} / 04</span><button onClick={() => navigate.current(active + 1)} disabled={active === 3} aria-label="Next chapter">→</button></div>
        <button aria-pressed={paused} onClick={() => { pause.current = !paused; setPaused(!paused); refresh.current(); }}>{paused ? 'Resume motion' : 'Pause motion'}</button>
      </div>
      <div className="gallery-progress" aria-hidden="true" />
    </div>
  </section>;
}
