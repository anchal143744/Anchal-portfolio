import { homeSocials } from "../data/socials";

const icons = {
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" /></>,
  github: <path d="M9 19c-4 1-4-2-6-2m12 5v-4a3.5 3.5 0 0 0-1-2.7c3.3-.4 6.7-1.6 6.7-7A5.4 5.4 0 0 0 19.2 4 5 5 0 0 0 19 0s-1.2-.4-4 1.5a14 14 0 0 0-7 0C5.2-.4 4 0 4 0a5 5 0 0 0-.2 4A5.4 5.4 0 0 0 2.3 8.3c0 5.4 3.4 6.6 6.7 7A3.5 3.5 0 0 0 8 18v4" />,
  linkedin: <><rect x="3" y="8" width="4" height="13" /><circle cx="5" cy="4" r="2" /><path d="M11 21V8h4v2c4-4 7-1 7 3v8h-4v-7c0-3-3-3-3 0v7Z" /></>,
  email: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m3 5 9 7 9-7" /></>,
};

export default function HeroSocials() {
  const configured = homeSocials.filter(({ href }) => Boolean(href));
  if (!configured.length) return null;
  return <nav className="hero-socials" aria-label="Social profiles">
    {configured.map(({ id, label, href }) => <a key={id} href={id === "email" && !href.startsWith("mailto:") ? `mailto:${href}` : href}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[id]}</svg>
      {label}
    </a>)}
  </nav>;
}
