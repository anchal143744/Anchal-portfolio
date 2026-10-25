import { capabilityAreas } from "./capability-content";

export const skillGroups = capabilityAreas.map(area => ({
  id: area.id, title: area.title, label: area.nav, description: area.description, skills: [...area.items],
}));

export const technologies = [
  { title: "Interfaces", items: ["HTML", "CSS", "JavaScript", "TypeScript"] },
  { title: "Application layers", items: ["React", "Next.js", "Node.js", "NestJS"] },
  { title: "Data & records", items: ["PostgreSQL", "Prisma", "SQL"] },
  { title: "Motion & verification", items: ["GSAP", "Three.js", "Vitest", "Playwright"] },
];

export type Application = { name: string; mark: string; logo?: string; monochrome?: boolean; use: string; proficiency?: string };
// Project technologies are described in context, without personal proficiency ratings.
export const applications: { title: string; items: Application[] }[] = [
  { title: "Interfaces", items: [
    { name: "HTML", mark: "HT", logo: "/technology-logos/html5.svg", use: "Page structure and semantic content in the project interfaces." },
    { name: "CSS", mark: "CS", logo: "/technology-logos/css3.svg", use: "Responsive layouts, visual styling and presentation across the projects." },
    { name: "JavaScript", mark: "JS", logo: "/technology-logos/javascript.svg", use: "Browser behaviour and interactive project experiences." },
    { name: "TypeScript", mark: "TS", logo: "/technology-logos/typescript.svg", use: "Typed application code across the product interfaces and services." },
    { name: "React", mark: "RE", logo: "/technology-logos/react.svg", use: "Component-based interfaces in NEXORA, AI Operations and this portfolio." },
    { name: "Next.js", mark: "NX", logo: "/technology-logos/nextjs.svg", monochrome: true, use: "React application structure and routing within the projects." },
  ]},
  { title: "Services & data", items: [
    { name: "Node.js", mark: "ND", logo: "/technology-logos/nodejs.svg", use: "JavaScript runtime supporting the project tooling and services." },
    { name: "NestJS", mark: "NJ", use: "Structured application services in NEXORA and AI Operations." },
    { name: "Prisma", mark: "PR", use: "The data-access layer connecting application services with saved business records." },
    { name: "PostgreSQL", mark: "PG", use: "Persistent relational records behind the business applications." },
  ]},
  { title: "Motion & presentation", items: [
    { name: "GSAP", mark: "GS", use: "Scroll and motion behaviour within the portfolio's established visual experience." },
    { name: "Three.js", mark: "3D", use: "3D presentation within the portfolio's established visual experience." },
  ]},
  { title: "Project verification", items: [
    { name: "Vitest", mark: "VT", use: "Automated checks documented in the AI Operations project repository." },
    { name: "Playwright", mark: "PW", use: "Browser acceptance checks documented for the business applications." },
  ]},
];

export type Certificate = {
  id: string; title: string; issuer: string;
  kind: "Course completion" | "Project completion" | "Programme enrolment" | "Participation" | "Award";
  description?: string; issued?: string; preview?: string; file: string; verification?: string;
};
export const certificates: Certificate[] = [];
export type Participation = {
  title: string; organizer: string; participation: string; date?: string; teamName?: string;
  project?: string; contribution?: string; photos?: { src: string; alt: string }[];
  certificate?: string; projectLink?: string; award?: string;
};
export const events: Participation[] = [];

export const productPractice = [
  { label: "NEXORA / Retail journeys", title: "A sale is more than a button.", description: "Drafts, completed sales, stock changes and payment records represent different moments in a retail journey. Clear states help a user understand what an action changes.", href: "/work/ai-assisted-development", link: "View NEXORA case study" },
  { label: "AI Operations / Human review", title: "Consequential actions need a clear decision point.", description: "Connected enquiries and follow-ups need readable handoffs. Workflow policies, human review and activity history make the path from a request to its outcome easier to inspect.", href: "/work/e-commerce", link: "View AI Operations case study" },
  { label: "Portfolio / Interface clarity", title: "Every screen should explain its next step.", description: "Hierarchy, concise content and meaningful action labels connect a project introduction with a deeper case study. The experience should help a reader understand both the product and my contribution.", href: "/work/client-web-projects", link: "View portfolio case study" },
  { label: "Business / Product purpose", title: "Scope is a product decision.", description: "A focused product begins with a useful problem and deliberate priorities. I consider user context, feature value and the next practical step before expanding an idea.", href: "/business", link: "Explore my business approach" },
];

export const experience = [
  { title: "NEXORA AI OS", description: "Product direction and interface review for a local retail workspace connecting customers, inventory, sales and reporting.", href: "/work/ai-assisted-development", link: "View NEXORA case study" },
  { title: "AI Operations Platform", description: "Workflow planning for an enquiry-to-action application with connected records, human review and traceable activity.", href: "/work/e-commerce", link: "View AI Operations case study" },
  { title: "Personal Portfolio", description: "Professional positioning, case-study structure and experience refinement across a personal website.", href: "/work/client-web-projects", link: "View portfolio case study" },
];
