export type ProjectFilter = "AI" | "ENGINEERING" | "PRODUCT" | "DESIGN";
export type Project = {
  id: "nexora-ai" | "eva-x" | "rudranix";
  number: string;
  title: string;
  subtitle: string;
  category: string;
  role: string;
  description: string;
  technologies: string[];
  filters: ProjectFilter[];
  featured: boolean;
  visual: "architectural" | "organic" | "material";
  href: string;
  status: "In development" | "Prototype" | "Case study";
  year: "2026";
  tone: "dark" | "sand" | "burgundy";
};
export const projects: Project[] = [
  { id: "nexora-ai", number: "01", title: "NEXORA AI", subtitle: "Enterprise AI Platform", category: "Enterprise AI Platform", role: "Full-Stack Developer", description: "An AI-powered enterprise platform for workflow automation and intelligent business operations.", technologies: ["NEXT.JS", "NESTJS", "POSTGRESQL", "PRISMA"], filters: ["AI", "ENGINEERING", "PRODUCT"], featured: true, visual: "architectural", href: "/work/nexora-ai", status: "In development", year: "2026", tone: "dark" },
  { id: "eva-x", number: "02", title: "EVA X", subtitle: "AI Health Platform", category: "AI Health Platform", role: "Full-Stack Developer", description: "An AI-powered women’s health platform designed for personalized guidance and support.", technologies: ["NEXT.JS", "NESTJS", "POSTGRESQL", "AI SERVICES"], filters: ["AI", "PRODUCT", "DESIGN"], featured: true, visual: "organic", href: "/work/eva-x", status: "In development", year: "2026", tone: "sand" },
  { id: "rudranix", number: "03", title: "RUDRANIX", subtitle: "Premium Digital Brand Experience", category: "Digital Brand Experience", role: "Creative Developer · Product Designer", description: "A digital product and brand experience exploring the intersection of technology, product design and modern commerce.", technologies: ["CREATIVE DEV", "THREE.JS", "UI/UX", "BRAND SYSTEM"], filters: ["ENGINEERING", "PRODUCT", "DESIGN"], featured: true, visual: "material", href: "/work/rudranix", status: "Case study", year: "2026", tone: "burgundy" },
];
