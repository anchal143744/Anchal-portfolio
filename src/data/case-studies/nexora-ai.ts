import type { CaseStudy } from "./types";

export const nexoraCaseStudy: CaseStudy = {
  slug: "nexora-ai", number: "01", title: "NEXORA AI", subtitle: "ENTERPRISE AI OPERATING SYSTEM", visual: "architectural", tone: "dark",
  statement: "Designing the infrastructure for intelligent work.",
  description: "An AI-first operating system concept bringing workflows, agents, automation and enterprise operations into one connected experience.",
  category: "AI Systems / Enterprise Product", role: ["AI Engineer", "Product Builder", "Full-Stack Developer"], focus: ["AI Systems", "Product", "Engineering", "UX"], status: "Concept in development", technologies: ["Next.js", "TypeScript", "Python", "PostgreSQL", "AI / LLMs"],
  problem: { heading: "WHY THIS\nNEEDS TO EXIST.", paragraphs: ["Modern work is split across tools, tabs and disconnected automation. People move information between systems while context—and often intent—gets lost.", "Nexora explores a different model: one environment where workflows, agents and operational knowledge can work together without making the interface feel like infrastructure."] },
  idea: { heading: "FROM COMPLEXITY\nTO CLARITY.", text: "The product concept turns fragmented operational signals into contextual intelligence, then makes the next useful action clear to a person.", flow: ["CHAOS", "INFORMATION", "INTELLIGENCE", "ACTION"] },
  product: { heading: "ONE SYSTEM.\nMANY POSSIBILITIES.", intro: "Five connected product areas create one operating model rather than five isolated features.", areas: [
    { title: "AI WORKFLOWS", text: "Composable flows that connect intent, data and repeatable work." }, { title: "AI AGENTS", text: "Role-aware assistants designed around bounded responsibilities." }, { title: "AUTOMATION", text: "Observable execution with clear triggers, states and human control." }, { title: "OPERATIONS", text: "A shared view of work, exceptions and decisions." }, { title: "INSIGHTS", text: "Contextual signals that explain what changed and what needs attention." },
  ] },
  architecture: { heading: "BUILT AS\nA SYSTEM.", intro: "Conceptual architecture — a proposed separation of experience, orchestration and execution. It does not represent deployed infrastructure.", layers: [
    { label: "USER", detail: "People define intent, review context and retain control of consequential actions." }, { label: "PRODUCT EXPERIENCE", detail: "A coherent interface for workspaces, agents, workflows and operational views." }, { label: "APPLICATION LAYER", detail: "Permissions, state, domain logic and product-level coordination." }, { label: "AI ORCHESTRATION", detail: "Model routing, context assembly, guardrails and tool selection." }, { label: "AGENTS / WORKFLOWS", detail: "Bounded tasks, explicit steps and observable execution states." }, { label: "SERVICES", detail: "Integrations and domain services exposed through controlled interfaces." }, { label: "DATA / INFRASTRUCTURE", detail: "Persistent product state, audit context and operational data." },
  ] },
  intelligence: { heading: "INTELLIGENCE\nBY DESIGN.", intro: "AI is treated as a system of context, constraints and observable actions—not a chat box added after the product is designed.", flow: [
    { label: "INPUT", detail: "A request, event or operational change enters the system." }, { label: "CONTEXT", detail: "Relevant workspace knowledge and permissions are assembled." }, { label: "REASONING", detail: "A model proposes the next step within defined boundaries." }, { label: "ACTION", detail: "Tools or workflows execute with visible state and human checkpoints." }, { label: "RESULT", detail: "The outcome is returned with traceable context for review." },
  ] },
  engineering: { heading: "WHERE IDEAS\nBECOME SOFTWARE.", intro: "The engineering model prioritizes boundaries, observability and graceful failure before scale claims.", decisions: [
    { title: "MODULAR FRONTEND", text: "Domain-oriented interfaces keep agent, workflow and operations surfaces independently evolvable." }, { title: "CONTRACT-FIRST SERVICES", text: "Typed boundaries make integrations and failure states explicit." }, { title: "AUDITABLE EXECUTION", text: "Workflows expose state, inputs and outcomes instead of hiding them behind magic." }, { title: "SECURITY BY BOUNDARY", text: "Permissions, tool access and consequential actions require explicit product-level controls." },
  ] },
  experience: { heading: "COMPLEX SYSTEMS.\nSIMPLE EXPERIENCES.", intro: "The interface should reveal complexity only when it helps someone decide. The default view stays calm, contextual and reversible.", principles: [
    { title: "HIERARCHY", text: "Urgency, state and ownership remain visible without competing for attention." }, { title: "PROGRESSIVE DISCLOSURE", text: "System detail appears when requested, not as permanent interface noise." }, { title: "HUMAN CONTROL", text: "Actions are reviewable and meaningful automation states are never hidden." }, { title: "ACCESSIBLE BY DEFAULT", text: "Keyboard paths, contrast and non-motion communication are part of the system." },
  ] },
  process: ["DISCOVER", "DEFINE", "DESIGN", "ARCHITECT", "BUILD", "TEST", "REFINE"],
  challenges: { heading: "THE HARD PART\nWAS NOT THE CODE.", label: "DESIGN CONSIDERATIONS", items: [
    { title: "AI RELIABILITY", text: "How should the product communicate uncertainty and failure without eroding trust?" }, { title: "INFORMATION LOAD", text: "How can operational depth remain available without making every screen dense?" }, { title: "SYSTEM BOUNDARIES", text: "Where should agents stop, workflows begin and people intervene?" }, { title: "OBSERVABILITY", text: "How can users understand what the system did without reading technical logs?" },
  ] },
  learnings: { heading: "WHAT I WOULD\nDO DIFFERENTLY.", intro: "This is a concept still being shaped. The unresolved questions are part of the value of the work.", items: [
    { title: "START NARROWER", text: "Prove one operational loop deeply before expanding the platform surface." }, { title: "DESIGN FAILURE FIRST", text: "Map uncertainty, interruption and recovery before polishing ideal flows." }, { title: "MEASURE UNDERSTANDING", text: "Test whether people can predict system behavior—not only whether they can complete a task." },
  ] }, closing: "Technology becomes powerful when complexity becomes usable.",
};
