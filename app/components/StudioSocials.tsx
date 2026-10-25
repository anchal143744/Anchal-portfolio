import Link from "next/link";
import { homeSocials } from "../data/socials";

const paths: Record<string,string> = {
  github: "M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.23c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.6-2.81 5.62-5.49 5.92.43.37.82 1.1.82 2.22v3.3c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z",
  linkedin: "M4 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM2 9h4v13H2Zm7 0h4v2c1-2 3-2 4-2 4 0 5 2 5 6v7h-4v-7c0-2-1-3-2-3-2 0-3 1-3 3v7H9Z",
};
export default function StudioSocials(){
 const entries = ["github", "email", "linkedin"].map(id => homeSocials.find(s => s.id === id)!);
 const items: { id: string; label: string; href: string }[] = [...entries, { id: "resume", label: "Resume", href: "/resume" }];
 return <nav className="studio-socials" aria-label="Professional links">{items.map(s => {
  const content = <><svg viewBox="0 0 24 24" aria-hidden="true">{paths[s.id] ? <path d={paths[s.id]} fill="currentColor"/> : s.id === "email" ? <g fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="m3 6 9 7 9-7"/></g> : <g fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 2h8l4 4v16H6zM14 2v5h4M9 12h6M9 16h6"/></g>}</svg><span>{s.label}</span></>;
  const href = s.id === "email" && s.href && !s.href.startsWith("mailto:") ? `mailto:${s.href}` : s.href;
  return href ? <Link className="studio-social-item" key={s.id} href={href}>{content}</Link> : <span className="studio-social-item studio-social-unavailable" key={s.id} aria-disabled="true" title={`${s.label} destination not configured`}>{content}</span>;
 })}</nav>;
}
