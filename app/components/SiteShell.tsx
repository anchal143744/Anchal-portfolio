"use client";

import Link from "next/link";
import "./resume-glass.css";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/capabilities", label: "Capabilities" },
  { href: "/business", label: "Business" },
  { href: "/contact", label: "Contact" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  if (href === "/work") {
    return pathname.startsWith("/work") || pathname.startsWith("/projects");
  }

  return pathname === href || pathname.startsWith(href + "/");
}

export function Header() {
  const pathname = usePathname() ?? "/";
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="Anchal Sharma home">
        <span>Anchal</span>
        <span>Sharma</span>
      </Link>

      <button
        className="nav-toggle"
        type="button"
        aria-controls="primary-navigation"
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
      >
        {isMenuOpen ? "Close" : "Menu"}
      </button>

      <nav
        id="primary-navigation"
        className={isMenuOpen ? "site-nav is-open" : "site-nav"}
        aria-label="Primary navigation"
      >
        {navItems.map((item) => {
          const isActive = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={isActive ? "is-active" : undefined}
              onClick={() => setIsMenuOpen(false)}
              aria-current={isActive ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
        <Link href="/resume" className="resume-link" onClick={() => setIsMenuOpen(false)}>
          Resume ↗
        </Link>
      </nav>
    </header>
  );
}

export function Footer({ reveal = false }: { reveal?: boolean }) {
  const currentYear = new Date().getFullYear();
  const footerLinks = [
    { href: "/work", label: "Work" },
    { href: "/about", label: "About" },
    { href: "/business", label: "Business" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-left">
          <p className="footer-label">Let&apos;s Build Something</p>
          <h2>
            Have an idea?
            <br />
            Let&apos;s make it real.
          </h2>
        </div>

        <div className="footer-right">
          <p>
            A digital product, a business workflow or an early-career opportunity.
            Let&apos;s discuss the scope and where I can contribute.
          </p>
          <Link className="footer-cta" href="/contact">
            Start a Conversation {reveal ? <span className="footer-cta-arrow" aria-hidden="true">↗</span> : "↗"}
          </Link>
        </div>
      </div>

      <nav className="footer-contact-row" aria-label="Footer navigation">
        {footerLinks.map((item) => (
          <Link className="footer-contact-link" href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="footer-meta">
        <span>All Rights Reserved © {currentYear}</span>
        <span>India</span>
        <span>Designed + built with an AI-assisted workflow</span>
      </div>

      <div className="footer-signature" aria-hidden="true">
        {reveal ? <span className="footer-name-first">Anchal</span> : "Anchal"} <span>Sharma</span>
      </div>
    </footer>
  );
}
