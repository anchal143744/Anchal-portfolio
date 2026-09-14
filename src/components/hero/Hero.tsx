"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Suspense } from "react";
import { ButtonLink, Container } from "@/components/ui/Primitives";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { ResumeLink } from "@/components/ui/ResumeLink";

const IntelligenceScene = dynamic(() => import("@/components/three/IntelligenceScene"), { ssr: false });

export function Hero() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, .2], [0, reduced ? 0 : 110]);
  const scale = useTransform(scrollYProgress, [0, .18], [1, reduced ? 1 : .88]);
  return <section className="hero" id="top" aria-labelledby="hero-title">
    <MotionProvider />
    <Container className="hero-inner">
      <motion.div className="hero-copy" initial={reduced ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9, ease: [.22, 1, .36, 1] }}>
        <p className="eyebrow">AI ENGINEER <i /> FULL-STACK DEVELOPER <i /> PRODUCT BUILDER</p>
        <h1 id="hero-title"><span>BUILDING</span><span>INTELLIGENT</span><em>SYSTEMS.</em></h1>
        <p className="hero-description">I design and engineer AI-powered products, scalable software systems, and thoughtful digital experiences — from the first idea to the final interaction.</p>
        <div className="hero-actions"><ButtonLink href="#work">EXPLORE MY WORK</ButtonLink><ResumeLink className="hero-resume" /></div>
      </motion.div>
      <motion.div className="sculpture" style={{ y, scale }} aria-hidden="true">
        <div className="sculpture-fallback"><span /><span /><span /></div>
        <Suspense fallback={null}><IntelligenceScene /></Suspense>
      </motion.div>
      <p className="vertical-statement" aria-hidden="true">IDEAS <span /> SYSTEMS <span /> INTELLIGENCE <span /> EXPERIENCE</p>
      <a href="#proof" className="scroll-cue">SCROLL TO EXPLORE <span>↓</span></a>
    </Container>
  </section>;
}
