import type { CaseStudy } from "./types";

export const rudranixCaseStudy: CaseStudy = {
  slug: "rudranix", number: "03", title: "RUDRANIX", subtitle: "PREMIUM DIGITAL BRAND EXPERIENCE", visual: "material", tone: "burgundy",
  statement: "Turning a brand into a product experience.", description: "A digital product and brand experience concept exploring the intersection of technology, product design and modern commerce.",
  category: "Brand / Product / Commerce", role: ["Creative Developer", "Product Designer", "Full-Stack Developer"], focus: ["Brand System", "Commerce", "Interaction", "3D"], status: "Concept in development", technologies: ["Next.js", "TypeScript", "Three.js", "Design Systems"],
  problem: { heading: "WHY THIS\nNEEDS TO EXIST.", paragraphs: ["Premium digital commerce often separates brand expression from product utility. The editorial story lives on one side; finding, understanding and choosing a product lives on the other.", "Rudranix explores how identity, material storytelling and clear commerce interactions can behave as one coherent product system."] },
  idea: { heading: "FROM IDENTITY\nTO INTERACTION.", text: "The concept translates brand character into a repeatable interface language, then uses that language to make exploration and choice feel intentional.", flow: ["IDENTITY", "MATERIAL", "SYSTEM", "EXPERIENCE"] },
  product: { heading: "EDITORIAL FEEL.\nPRODUCT CLARITY.", intro: "Each area balances atmosphere with the directness expected from a useful digital product.", areas: [
    { title: "COLLECTION STORIES", text: "Narrative entry points that connect intent, material and product." }, { title: "PRODUCT EXPLORATION", text: "Focused views with tactile depth and clear decision information." }, { title: "CURATED DISCOVERY", text: "A smaller, more intentional alternative to endless catalog grids." }, { title: "COMMERCE FLOW", text: "Quiet, predictable interactions around selection and progression." },
  ] },
  architecture: { heading: "BRAND AS\nA SYSTEM.", intro: "Conceptual architecture — a proposed frontend and content model for a future commerce implementation.", layers: [
    { label: "AUDIENCE", detail: "People move between inspiration, evaluation and decision." }, { label: "EXPERIENCE SYSTEM", detail: "Editorial modules, product views and motion rules." }, { label: "DESIGN TOKENS", detail: "Typography, color, material, spacing and interaction behavior." }, { label: "PRODUCT MODEL", detail: "Collections, products, variants and structured storytelling fields." }, { label: "COMMERCE SERVICES", detail: "Future catalog, availability and checkout integrations." }, { label: "CONTENT / ASSETS", detail: "Optimized media and reusable editorial content." },
  ] },
  engineering: { heading: "CRAFT WITH\nCONSTRAINTS.", intro: "The engineering challenge is preserving atmosphere without compromising discoverability, accessibility or load performance.", decisions: [
    { title: "COMPOSABLE EDITORIAL", text: "A bounded module system supports variety without one-off page code." }, { title: "PROGRESSIVE 3D", text: "Material depth enhances key moments while static composition remains complete." }, { title: "ASSET BUDGETS", text: "Responsive formats, lazy loading and explicit visual budgets keep the experience usable." }, { title: "SEMANTIC COMMERCE", text: "Product information and actions remain navigable without motion or pointer input." },
  ] },
  experience: { heading: "LUXURY WITHOUT\nFRICTION.", intro: "Premium interaction comes from rhythm, restraint and confidence—not hidden controls or prolonged transitions.", principles: [
    { title: "EDITORIAL RHYTHM", text: "Large moments alternate with concise decision surfaces." }, { title: "TACTILE RESPONSE", text: "Depth and motion acknowledge intent without delaying it." }, { title: "CLEAR PATHS", text: "Discovery remains expressive; selection remains direct." }, { title: "SYSTEM CONSISTENCY", text: "The same material and typographic rules carry from story to product." },
  ] },
  process: ["DISCOVER", "DEFINE", "DESIGN", "ARCHITECT", "BUILD", "TEST", "REFINE"],
  challenges: { heading: "RESTRAINT IS\nTHE HARD PART.", label: "DESIGN CONSIDERATIONS", items: [
    { title: "ATMOSPHERE VS SPEED", text: "Which moments deserve rich media, and where should typography do the work?" }, { title: "VARIETY VS SYSTEM", text: "How can pages feel curated without creating brittle one-off layouts?" }, { title: "BRAND VS USABILITY", text: "How far can interaction bend before product understanding suffers?" },
  ] },
  learnings: { heading: "WHAT I WOULD\nREFINE NEXT.", intro: "The concept is strongest when the brand system makes product choices clearer—not merely more dramatic.", items: [
    { title: "PROTOTYPE WITH CONTENT", text: "Use real product constraints before expanding the visual system." }, { title: "BUDGET MOTION", text: "Assign animation only to moments that improve orientation or material understanding." }, { title: "TEST DISCOVERY", text: "Measure whether the editorial route helps people find the right product with confidence." },
  ] }, closing: "A premium experience is a system of deliberate decisions.",
};
