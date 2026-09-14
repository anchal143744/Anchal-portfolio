export type LabCategory = "AI" | "3D" | "INTERACTION" | "CREATIVE CODE" | "SYSTEMS";
export type LabVisual = "intelligence" | "spatial" | "motion" | "generative" | "system" | "interface";

export type LabExperiment = {
  id: string;
  number: string;
  title: string;
  type: string;
  description: string;
  technologies: string[];
  status: "EXPERIMENT" | "PROTOTYPE" | "CONCEPT" | "EXPLORATION";
  featured: boolean;
  slug: string;
  visual: LabVisual;
  interaction: string;
  categories: LabCategory[];
};

export const labCategories = ["ALL", "AI", "3D", "INTERACTION", "CREATIVE CODE", "SYSTEMS"] as const;

export const labExperiments: LabExperiment[] = [
  { id: "intelligence", number: "01", title: "INTELLIGENCE", type: "AI EXPERIMENT", description: "Exploring how an autonomous system can move through context, reasoning and action across a multi-step task.", technologies: ["AI", "LLM", "WORKFLOW", "TYPESCRIPT"], status: "EXPLORATION", featured: true, slug: "intelligence", visual: "intelligence", interaction: "Select a stage to inspect the reasoning flow.", categories: ["AI", "SYSTEMS"] },
  { id: "spatial", number: "02", title: "SPATIAL", type: "3D / WEBGL EXPERIMENT", description: "A responsive digital sculpture studying material, depth and spatial interaction in the browser.", technologies: ["THREE.JS", "R3F", "DREI", "WEBGL"], status: "PROTOTYPE", featured: false, slug: "spatial", visual: "spatial", interaction: "Move across the field to influence the form.", categories: ["3D", "INTERACTION", "CREATIVE CODE"] },
  { id: "motion", number: "03", title: "MOTION", type: "INTERACTION EXPERIMENT", description: "An editorial typography study shaped by pointer velocity, proximity and controlled magnetic movement.", technologies: ["MOTION", "POINTER", "TYPOGRAPHY"], status: "EXPERIMENT", featured: false, slug: "motion", visual: "motion", interaction: "Move through the words to change their cadence.", categories: ["INTERACTION", "CREATIVE CODE"] },
  { id: "generative", number: "04", title: "GENERATIVE", type: "CREATIVE CODE EXPERIMENT", description: "A procedural field where a small set of parameters creates shifting visual behavior.", technologies: ["CANVAS", "PROCEDURAL", "TYPESCRIPT"], status: "EXPLORATION", featured: false, slug: "generative", visual: "generative", interaction: "Adjust density, speed and complexity.", categories: ["CREATIVE CODE", "INTERACTION"] },
  { id: "system", number: "05", title: "SYSTEM", type: "ARCHITECTURE EXPERIMENT", description: "A tactile model for reading the layers and responsibilities inside a connected software system.", technologies: ["ARCHITECTURE", "AI", "SERVICES", "DATA"], status: "CONCEPT", featured: false, slug: "system", visual: "system", interaction: "Focus a layer to reveal its role.", categories: ["SYSTEMS", "AI", "INTERACTION"] },
  { id: "interface", number: "06", title: "INTERFACE", type: "UI INTERACTION EXPERIMENT", description: "An interface fragment exploring progressive disclosure, state and calm feedback without visual noise.", technologies: ["REACT", "UI / UX", "MOTION"], status: "PROTOTYPE", featured: false, slug: "interface", visual: "interface", interaction: "Switch the interface state to inspect its response.", categories: ["INTERACTION", "SYSTEMS"] },
];
