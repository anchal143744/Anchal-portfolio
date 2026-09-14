"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { ResumeLink } from "@/components/ui/ResumeLink";
import { site } from "@/data/site";
import { home } from "@/data/home";
import { technologies } from "@/data/technologies";
import { ProfilePortrait } from "./ProfilePortrait";

const HomeHeroScene = dynamic(() => import("./HomeHeroScene"), { ssr: false });

function HeroScene() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(max-width: 620px), (prefers-reduced-motion: reduce)").matches) return;
    const frame = requestAnimationFrame(() => setEnabled(true));
    return () => cancelAnimationFrame(frame);
  }, []);
  return <div className="v4-scene" aria-hidden="true">{enabled && <HomeHeroScene />}<div className="v4-scene-fallback"><i/><i/></div></div>;
}

export function HomeHero() {
  const reduced = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const artX = useSpring(pointerX, { stiffness: 70, damping: 22 });
  const artY = useSpring(pointerY, { stiffness: 70, damping: 22 });
  const reveal = (delay: number) => reduced ? {} : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: .75, delay, ease: [.22, 1, .36, 1] as const } };
  return <section className="v4-hero" id="top" aria-labelledby="home-title">
    <div className="v4-hero-atmosphere" aria-hidden="true" />
    <div className="container v4-hero-grid">
      <div className="v4-copy">
        <motion.p className="v4-eyebrow" {...reveal(.05)}>{home.hero.eyebrow}</motion.p>
        <motion.h1 id="home-title" {...reveal(.12)}><span>ANCHAL</span><em>SHARMA</em></motion.h1>
        <motion.p className="v4-role" {...reveal(.2)}>AI-POWERED FULL-STACK DEVELOPER</motion.p>
        <motion.p className="v4-description" {...reveal(.27)}>{home.hero.introduction}</motion.p>
        <motion.div className="v4-actions" {...reveal(.34)}><Link href="#selected-work" className="v4-primary">EXPLORE MY WORK <span>→</span></Link><ResumeLink className="v4-secondary" /></motion.div>
        <motion.div className="v4-cap-strip" {...reveal(.42)}>{home.hero.capabilityStrip.map(([a,b], index)=><div key={a}><span className="v4-cap-icon" aria-hidden="true">{["◇","⌁","↗","✦"][index]}</span><strong>{a}<br/>{b}</strong></div>)}</motion.div>
      </div>
      <motion.div className="v4-art" style={reduced ? undefined : { x: artX, y: artY }} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: .2 }} onPointerMove={(event) => {
        if (reduced) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        pointerX.set(((event.clientX - bounds.left) / bounds.width - .5) * 8);
        pointerY.set(((event.clientY - bounds.top) / bounds.height - .5) * 6);
      }} onPointerLeave={() => { pointerX.set(0); pointerY.set(0); }}>
        <HeroScene />
        <ProfilePortrait src={site.profileImage ?? undefined} alt={site.profileImageAlt} objectPosition={site.profileImagePosition}/>
        <span className="v4-light-sweep" aria-hidden="true" />
        <div className="v4-sphere-copy" aria-hidden="true"><span>IDEAS</span><span>TECHNOLOGY</span><span>PEOPLE</span><span>IMPACT</span></div>
        <div className="v4-glass-copy" aria-hidden="true"><span>BUILD</span><span>SOLVE</span><span>CREATE</span><span>IMPACT</span></div>
        <p className="v4-location">BASED IN<br/><b>INDIA</b><br/><br/>OPEN TO<br/><b>FULL-TIME<br/>REMOTE<br/>COLLABORATIONS</b></p>
      </motion.div>
      <div className="v4-bottom">
        <p className="v4-scroll">SCROLL TO EXPLORE <i aria-hidden="true"/></p>
        <blockquote>“Better Technology.<br/>A More Inclusive Tomorrow.”</blockquote>
        <div className="v4-tech"><span>TECHNOLOGIES I WORK WITH</span><p>{technologies.slice(0,7).join("  ·  ")}</p></div>
      </div>
    </div>
  </section>;
}
