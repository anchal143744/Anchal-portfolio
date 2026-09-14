import { evaCaseStudy } from "./eva-x";
import { nexoraCaseStudy } from "./nexora-ai";
import { rudranixCaseStudy } from "./rudranix";

export const caseStudies = [nexoraCaseStudy, evaCaseStudy, rudranixCaseStudy];
export type CaseStudySlug = (typeof caseStudies)[number]["slug"];
export function getCaseStudy(slug: string) { return caseStudies.find((study) => study.slug === slug); }
export function getAdjacentProjects(slug: string) {
  const index = caseStudies.findIndex((study) => study.slug === slug);
  return { previous: caseStudies[(index - 1 + caseStudies.length) % caseStudies.length], next: caseStudies[(index + 1) % caseStudies.length] };
}
export type { CaseStudy, ArchitectureLayer, DetailItem } from "./types";
