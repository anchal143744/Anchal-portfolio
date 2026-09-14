import type { AnchorHTMLAttributes, ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`container ${className}`}>{children}</div>;
}

export function SectionLabel({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <p className={`section-label${light ? " light" : ""}`}>{children}</p>;
}

export function ButtonLink({ children, className = "", ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a className={`button-link ${className}`} {...props}>{children}<span aria-hidden="true">↗</span></a>;
}

export function Tag({ children }: { children: ReactNode }) { return <span className="tag">{children}</span>; }
