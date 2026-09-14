"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ResumeLink } from "@/components/ui/ResumeLink";

const links = [["HOME", "/"], ["WORK", "/work"], ["CAPABILITIES", "/#capabilities"], ["ABOUT", "/about"], ["CONTACT", "/contact"]];

export function Navigation() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const caseDark = isHome || pathname === "/lab" || pathname === "/contact" || pathname === "/work/nexora-ai" || pathname === "/work/rudranix";
  const isActive = (href: string) => href === "/work" ? pathname.startsWith("/work") : href.includes("#") ? false : pathname === href;
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 48);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <>
    <header className={`nav${compact ? " compact" : ""}${caseDark ? " case-nav-dark" : ""}${isHome ? " v3-nav" : ""}${open ? " menu-open" : ""}`}>
      <Link className="nav-brand" href="/" aria-label="Anchal Sharma, home"><span className="brand-mark">AS</span><span className="brand-identity"><b>ANCHAL SHARMA</b><small>BUILD · LEARN · CREATE</small></span></Link>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {links.map(([label, href]) => <Link key={label} href={href} aria-current={isActive(href) ? "page" : undefined}>{label}</Link>)}
      </nav>
      <div className="nav-actions"><ResumeLink className="nav-resume" /><Link className="nav-connect" href="/contact">LET&apos;S CONNECT</Link></div>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label="Toggle navigation">
        <span>{open ? "CLOSE" : "MENU"}</span><i aria-hidden="true" /><i aria-hidden="true" /><i aria-hidden="true" />
      </button>
    </header>
    <AnimatePresence>{open && <motion.nav id="mobile-menu" className="mobile-nav" aria-label="Mobile navigation" initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }}>
      {links.map(([label, href], index) => <motion.div key={label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * .05 }}><Link href={href} aria-current={isActive(href) ? "page" : undefined} onClick={() => setOpen(false)}>{label}<span>0{index + 1}</span></Link></motion.div>)}
      <ResumeLink className="mobile-resume" />
    </motion.nav>}</AnimatePresence>
  </>;
}
