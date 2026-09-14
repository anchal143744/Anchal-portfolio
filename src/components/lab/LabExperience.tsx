"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { labCategories, labExperiments, type LabExperiment } from "@/data/lab";

const LabScene = dynamic(() => import("./LabScene"), { ssr: false });
type Filter = typeof labCategories[number];
const pipeline = [
  ["USER INPUT", "The request and intended outcome enter the system."], ["CONTEXT", "Relevant constraints and information are assembled."],
  ["REASONING", "Possible actions are evaluated in sequence."], ["ACTION", "A bounded operation is selected and executed."], ["RESULT", "The outcome returns with evidence and state."],
];

function IntelligencePreview() {
  const [active, setActive] = useState(0);
  useEffect(() => { if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; const timer = window.setInterval(() => setActive(v => (v + 1) % pipeline.length), 1800); return () => clearInterval(timer); }, []);
  return <div className="intelligence-preview"><div className="ai-flow" aria-label="AI reasoning pipeline">{pipeline.map(([name], i) => <button key={name} onClick={() => setActive(i)} className={active === i ? "active" : ""} aria-pressed={active === i}><span>0{i + 1}</span><strong>{name}</strong><i aria-hidden="true" /></button>)}</div><div className="ai-detail" aria-live="polite"><span>ACTIVE STAGE / 0{active + 1}</span><strong>{pipeline[active][0]}</strong><p>{pipeline[active][1]}</p></div></div>;
}

function SpatialPreview() {
  const [visible, setVisible] = useState(false); const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { const node = ref.current; if (!node || window.matchMedia("(max-width: 600px), (prefers-reduced-motion: reduce)").matches) return; const o = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "150px" }); o.observe(node); return () => o.disconnect(); }, []);
  return <div ref={ref} className="spatial-preview">{visible && <LabScene />}<div className="spatial-fallback"><i /><i /><strong>S</strong></div><span>POINTER / SPATIAL FIELD</span></div>;
}

function MotionPreview() {
  const [point, setPoint] = useState({ x: 0, y: 0 });
  return <div className="motion-preview" onPointerMove={e => { const r = e.currentTarget.getBoundingClientRect(); setPoint({ x: (e.clientX-r.left-r.width/2)*.06, y: (e.clientY-r.top-r.height/2)*.04 }); }} onPointerLeave={() => setPoint({x:0,y:0})}>
    {["VELOCITY","RHYTHM","RESPONSE"].map((word,i) => <motion.span key={word} animate={{ x: point.x*(i+1), y: point.y*(i+1), skewX: point.x*.08 }} transition={{ type:"spring", stiffness:110, damping:18 }}>{word}</motion.span>)}
  </div>;
}

function GenerativePreview() {
  const [density,setDensity]=useState(4), [speed,setSpeed]=useState(3), [complexity,setComplexity]=useState(2);
  const count = density * 4;
  return <div className="generative-preview" style={{ "--lab-speed": `${8-speed}s` } as React.CSSProperties}><div className="generative-field" aria-hidden="true">{Array.from({length:count},(_,i)=><i key={i} style={{ left:`${(i*37)%94}%`, top:`${(i*61)%90}%`, transform:`scale(${.45+((i*complexity)%7)/10})`, animationDelay:`-${(i%6)*.4}s` }} />)}</div><div className="lab-controls"><label>DENSITY <input aria-label="Generative density" type="range" min="2" max="7" value={density} onChange={e=>setDensity(+e.target.value)} /></label><label>SPEED <input aria-label="Generative speed" type="range" min="1" max="6" value={speed} onChange={e=>setSpeed(+e.target.value)} /></label><label>COMPLEXITY <input aria-label="Generative complexity" type="range" min="1" max="5" value={complexity} onChange={e=>setComplexity(+e.target.value)} /></label></div></div>;
}

function SystemPreview() {
  const layers = [["INPUT","Signals and intent"],["APPLICATION","Product logic and state"],["INTELLIGENCE","Context and orchestration"],["SERVICES","Bounded capabilities"],["DATA","Durable system memory"]]; const [active,setActive]=useState(0);
  return <div className="system-preview"><div role="list" aria-label="Conceptual system architecture">{layers.map(([name],i)=><button role="listitem" key={name} className={active===i?"active":""} onMouseEnter={()=>setActive(i)} onFocus={()=>setActive(i)} onClick={()=>setActive(i)}><span>0{i+1}</span>{name}</button>)}</div><p aria-live="polite"><strong>{layers[active][0]}</strong>{layers[active][1]}</p></div>;
}

function InterfacePreview() {
  const [mode,setMode]=useState(0); const modes=["OBSERVE","CONNECT","RESOLVE"];
  return <div className="interface-preview"><div className="interface-window"><span>LAB / STATE 0{mode+1}</span><div className={`interface-core mode-${mode}`}><i/><i/><strong>{modes[mode]}</strong></div><p>{mode===0?"Read the system before acting.":mode===1?"Make relationships legible.":"Return a clear next step."}</p></div><div role="group" aria-label="Interface state">{modes.map((m,i)=><button key={m} className={mode===i?"active":""} aria-pressed={mode===i} onClick={()=>setMode(i)}>{m}</button>)}</div></div>;
}

function Preview({ visual }: { visual: LabExperiment["visual"] }) {
  if (visual === "intelligence") return <IntelligencePreview />; if (visual === "spatial") return <SpatialPreview />; if (visual === "motion") return <MotionPreview />; if (visual === "generative") return <GenerativePreview />; if (visual === "system") return <SystemPreview />; return <InterfacePreview />;
}

function Experiment({ experiment }: { experiment: LabExperiment }) {
  return <motion.article id={experiment.slug} className={`lab-experiment lab-${experiment.visual}`} layout initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} transition={{duration:.5}}>
    <div className="experiment-meta"><span>{experiment.number}</span><p>{experiment.type}<br/>{experiment.status}</p></div>
    <div className="experiment-title"><h2>{experiment.title}</h2><p>{experiment.description}</p><div>{experiment.technologies.map(t=><span key={t}>{t}</span>)}</div></div>
    <div className="experiment-stage"><Preview visual={experiment.visual}/></div>
    <div className="experiment-foot"><span>{experiment.interaction}</span><a href={`#${experiment.slug}`} aria-label={`Learn more about ${experiment.title}`}>LEARN MORE <b>↗</b></a></div>
  </motion.article>;
}

export function LabExperience() {
  const [filter,setFilter]=useState<Filter>("ALL"); const reduced=useReducedMotion();
  const shown=labExperiments.filter(e=>filter==="ALL"||e.categories.includes(filter as Exclude<Filter,"ALL">));
  return <main className="lab-page">
    <section className="lab-hero"><div className="container"><motion.p className="section-label" initial={reduced?false:{opacity:0}} animate={{opacity:1}}>05 / LAB</motion.p><motion.h1 initial={reduced?false:{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{duration:.9}}><span>BUILD.</span><span>BREAK.</span><span>LEARN.</span><em>REPEAT.</em></motion.h1><p>A space for experiments at the intersection of AI, creative technology, interaction design and engineering.</p><div className="lab-axis" aria-hidden="true"><i/><i/><strong>+</strong></div><a href="#experiments">ENTER THE LAB ↓</a></div></section>
    <section id="experiments" className="lab-archive"><div className="container lab-filter-bar"><p>EXPERIMENT INDEX</p><div role="group" aria-label="Filter lab experiments">{labCategories.map(category=><button key={category} className={filter===category?"active":""} aria-pressed={filter===category} onClick={()=>setFilter(category)}>{category}</button>)}</div><span>{String(shown.length).padStart(2,"0")} / 06</span></div>
      <div className="container"><AnimatePresence mode="popLayout">{shown.map(experiment=><Experiment key={experiment.id} experiment={experiment}/>)}</AnimatePresence></div>
    </section>
    <section className="lab-outro"><div className="container"><p>THE LAB REMAINS OPEN</p><h2>CURIOSITY<br/><em>IS A SYSTEM.</em></h2><p>Experiments are not finished answers. They are a way to discover better questions.</p><footer><span>ANCHAL SHARMA © 2026</span><Link href="/work">SELECTED WORK ↗</Link></footer></div></section>
  </main>;
}
