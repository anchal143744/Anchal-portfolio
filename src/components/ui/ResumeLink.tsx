import { site } from "@/data/site";

export function ResumeLink({ className = "" }: { className?: string }) {
  if (!site.resumeAvailable) {
    return <span className={`resume-link resume-pending ${className}`} role="link" aria-disabled="true" aria-label="Resume currently unavailable">
      <span>RESUME</span>
    </span>;
  }
  return <a className={`resume-link ${className}`} href={site.resumeUrl} target="_blank" rel="noopener noreferrer" aria-label="Open Anchal Sharma resume in a new tab">
    <span>RESUME ↓</span>
  </a>;
}
