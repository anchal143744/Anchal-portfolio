import type { CaseStudy } from "./types";

export const evaCaseStudy: CaseStudy = {
  slug: "eva-x", number: "02", title: "EVA X", subtitle: "AI-POWERED WOMEN’S HEALTH PLATFORM", visual: "organic", tone: "sand",
  statement: "Making personal guidance feel clear, calm and human.", description: "A personalized digital health experience concept designed around intelligent guidance, care and accessible information.",
  category: "AI Product / Digital Health", role: ["Product Builder", "Full-Stack Developer", "Experience Designer"], focus: ["Personalization", "Accessibility", "AI", "UX"], status: "Product exploration", technologies: ["React", "TypeScript", "PostgreSQL", "AI / LLMs"],
  problem: { heading: "WHY THIS\nNEEDS TO EXIST.", paragraphs: ["Personal health information is often fragmented, clinical or difficult to interpret. Finding a relevant answer can require moving through disconnected sources without a clear sense of what applies.", "EVA X explores how a digital product can organize information around the person while staying careful about uncertainty and never presenting itself as medical diagnosis."] },
  idea: { heading: "FROM QUESTIONS\nTO GUIDANCE.", text: "The concept transforms scattered questions into structured context, understandable information and a clear next step—without overstating what AI knows.", flow: ["QUESTION", "CONTEXT", "GUIDANCE", "CHOICE"] },
  product: { heading: "PERSONAL BY DESIGN.\nCALM BY DEFAULT.", intro: "The product areas support understanding and continuity rather than creating another high-density health dashboard.", areas: [
    { title: "GUIDED CHECK-INS", text: "Short, contextual prompts that help a person express what matters." }, { title: "PERSONAL CONTEXT", text: "A user-controlled picture of preferences, history and current priorities." }, { title: "EXPLAINED INFORMATION", text: "Plain-language summaries with visible uncertainty and source boundaries." }, { title: "CARE PATHS", text: "Non-diagnostic next-step guidance designed to support informed conversations." },
  ] },
  architecture: { heading: "BUILT AROUND\nTRUST.", intro: "Conceptual architecture — a privacy-conscious product model, not a claim of deployed clinical infrastructure.", layers: [
    { label: "PERSON", detail: "The user controls what context is shared and can inspect or remove it." }, { label: "EXPERIENCE LAYER", detail: "Accessible check-ins, guidance and information surfaces." }, { label: "PRODUCT LOGIC", detail: "Consent, preferences, content boundaries and interaction state." }, { label: "AI GUIDANCE", detail: "Context-limited language assistance with safety-oriented response constraints." }, { label: "CONTENT SYSTEM", detail: "Structured, reviewable information separated from generated language." }, { label: "PRIVATE DATA", detail: "Minimized personal state with explicit retention and access rules." },
  ] },
  intelligence: { heading: "PERSONALIZATION\nWITH BOUNDARIES.", intro: "Intelligence helps organize and explain. It does not diagnose, prescribe or replace qualified care.", flow: [
    { label: "QUESTION", detail: "The person expresses a need in their own language." }, { label: "CONSENTED CONTEXT", detail: "Only relevant, user-approved context is considered." }, { label: "RETRIEVAL", detail: "Structured information grounds the response path." }, { label: "GUIDANCE", detail: "The system returns a clear explanation with limits." }, { label: "ESCALATION", detail: "Appropriate care-seeking guidance remains visible when needed." },
  ] },
  engineering: { heading: "CARE IN\nTHE DETAILS.", intro: "Technical choices are evaluated through privacy, readability and predictable behavior.", decisions: [
    { title: "MINIMIZED STATE", text: "Store only what the experience needs, with clear ownership and deletion paths." }, { title: "STRUCTURED CONTENT", text: "Keep reviewed information distinct from generated summaries." }, { title: "EXPLICIT UNCERTAINTY", text: "Represent model limits and unavailable context in the UI contract." }, { title: "RESILIENT EXPERIENCE", text: "Core information remains available when personalization or animation is unavailable." },
  ] },
  experience: { heading: "INFORMATION\nWITHOUT OVERLOAD.", intro: "Soft visual language is paired with rigorous hierarchy, accessible contrast and plain, non-alarming language.", principles: [
    { title: "CALM HIERARCHY", text: "One primary idea per view, supported by optional detail." }, { title: "PLAIN LANGUAGE", text: "Explain terms without flattening meaningful nuance." }, { title: "RESPONSIVE CARE", text: "Touch targets, reading widths and navigation are designed for private mobile use." }, { title: "NO COLOR-ONLY MEANING", text: "Important states use text and structure as well as restrained color." },
  ] },
  process: ["DISCOVER", "DEFINE", "DESIGN", "ARCHITECT", "BUILD", "TEST", "REFINE"],
  challenges: { heading: "TRUST IS\nTHE INTERFACE.", label: "DESIGN CONSIDERATIONS", items: [
    { title: "MEDICAL BOUNDARIES", text: "How can guidance be useful without implying diagnosis or clinical authority?" }, { title: "PERSONALIZATION", text: "How much context creates relevance before it begins to feel invasive?" }, { title: "EMOTIONAL LOAD", text: "How should language and motion adapt when the subject may feel sensitive?" },
  ] },
  learnings: { heading: "WHAT I WOULD\nVALIDATE NEXT.", intro: "The most important next work is not more interface—it is evidence that the product is understandable and appropriately bounded.", items: [
    { title: "TEST LANGUAGE EARLY", text: "Validate comprehension and emotional tone before adding feature depth." }, { title: "MAKE CONSENT CONTINUOUS", text: "Treat privacy choices as part of every relevant interaction, not a settings screen." }, { title: "PROTOTYPE ESCALATION", text: "Test how the experience moves from information to appropriate human support." },
  ] }, closing: "Careful technology begins by respecting what it cannot know.",
};
