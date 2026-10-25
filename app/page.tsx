"use client";

import { HomeProjectDialogs } from "./components/HomeProjectDialogs";
import { useEffect } from "react";
import FooterReveal from "./components/FooterReveal";
import { Footer, Header } from "./components/SiteShell";
import CreativeStudio, { StudioExpertise } from "./components/CreativeStudio";
import HeroOverlap from "./components/HeroOverlap";
import SelectedWork from "./components/SelectedWork";
import Capabilities from "./components/Capabilities";
import Experience from "./components/Experience";
import AboutFeature from "./components/AboutFeature";
import "./home-colors.css";
import "./home-dark.css";


export default function Home() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hero = document.querySelector<HTMLElement>(".creative-studio");
    const depthItems = Array.from(document.querySelectorAll<HTMLElement>(".home-depth"));

    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        document.body.classList.toggle("is-hero-out", !entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    if (hero) {
      heroObserver.observe(hero);
    }

    const updateDepth = () => {
      if (reducedMotion.matches) {
        return;
      }

      const viewportHeight = window.innerHeight || 1;

      depthItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const depth = (center - viewportHeight / 2) / viewportHeight;
        item.style.setProperty("--scroll-depth", depth.toFixed(3));
      });
    };

    let scrollFrame = 0;
    const handleScroll = () => {
      if (scrollFrame) {
        return;
      }

      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = 0;
        updateDepth();
      });
    };

    const handleVisibilityChange = () => {
      document.body.classList.toggle("is-motion-paused", document.hidden);
    };

    updateDepth();
    handleVisibilityChange();
    window.addEventListener("portfolio-scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      heroObserver.disconnect();
      window.removeEventListener("portfolio-scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (scrollFrame) {
        window.cancelAnimationFrame(scrollFrame);
      }
    };
  }, []);

  return (
    <HomeProjectDialogs>
      <Header />
      <main className="home-page">
        <HeroOverlap hero={<><CreativeStudio /><StudioExpertise /></>}>
        <SelectedWork />

        <Capabilities />

        <Experience />

        <AboutFeature />

        </HeroOverlap>
      </main>
      <FooterReveal><Footer reveal /></FooterReveal>
    </HomeProjectDialogs>
  );
}
