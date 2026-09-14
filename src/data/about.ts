export type AboutCapability = { title: string; items: string[] };

export const about = {
  identity: {
    name: "Anchal Sharma",
    roles: ["AI Engineer", "Full-Stack Developer", "Product Builder"],
    statement: "I build intelligent software and digital products at the intersection of engineering, AI, design and human experience.",
  },
  intro: [
    "I am drawn to difficult, layered problems — the kind that ask for more than a clean interface or a clever line of code. I learn the system, find what matters, and shape it into something people can use.",
    "My practice moves between AI, full-stack engineering, product thinking and design. That range is intentional: meaningful products emerge when technical decisions and human experience are considered together.",
  ],
  thinking: ["I start with the problem.", "Understand the system.", "Design the experience.", "Build the solution.", "Refine what matters."],
  capabilities: [
    { title: "AI Systems", items: ["AI applications", "Agents", "LLM workflows", "Automation", "Intelligent interfaces"] },
    { title: "Software Systems", items: ["Full-stack applications", "APIs", "Databases", "Architecture", "Integrations"] },
    { title: "Products", items: ["Problem discovery", "Product thinking", "Prototyping", "Iteration"] },
    { title: "Experiences", items: ["UI / UX", "Interaction", "Design systems", "3D interfaces"] },
  ] satisfies AboutCapability[],
  principles: [
    ["Clarity over complexity", "Reduce cognitive load without hiding the depth a reliable system needs."],
    ["Systems before features", "Understand relationships, constraints and consequences before adding surface area."],
    ["Experience matters", "Engineering quality includes how clearly and confidently a person can use the result."],
    ["Build → test → learn", "Working prototypes reveal more than assumptions. Each cycle should sharpen the next."],
    ["Technology should serve people", "Capability is valuable only when it is responsible, accessible and useful."],
  ],
  evolution: ["Learn", "Build", "Break", "Understand", "Rebuild", "Improve"],
  exploring: [
    ["AI Agents", "Deepening"], ["LLM Systems", "Building"], ["Multi-step Workflows", "Exploring"],
    ["3D Web Experiences", "Building"], ["Product Engineering", "Deepening"], ["System Architecture", "Learning"],
    ["Modern Frontend", "Refining"],
  ],
  beyond: {
    title: "Good products are human first.",
    copy: "A system can be technically impressive and still fail the person using it. I care about usability, trust, accessibility and emotional clarity because responsible technology should help people feel capable — not overwhelmed.",
    values: ["Usability", "Trust", "Accessibility", "Clarity", "Emotional experience", "Responsible technology"],
  },
  philosophy: {
    title: "Make complexity feel simple.",
    copy: "Technology becomes meaningful when people can understand it, trust it and use it without fighting the system.",
  },
  future: {
    title: "Still building.",
    copy: "I want to keep exploring the space where intelligent systems, thoughtful products and human-centered design meet.",
    directions: ["AI", "Product", "Engineering", "Design", "Impact"],
  },
} as const;

export const aboutSections = [
  ["intro", "01 / Who I am"], ["thinking", "02 / How I think"], ["capabilities", "03 / What I build"],
  ["principles", "04 / Principles"], ["evolution", "05 / Evolution"], ["exploring", "06 / Exploring"],
  ["beyond", "07 / Beyond code"], ["future", "08 / What’s next"],
] as const;
