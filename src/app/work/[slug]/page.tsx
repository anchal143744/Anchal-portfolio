import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/navigation/Navigation";
import { CaseStudyPage } from "@/components/case-study/CaseStudyPage";
import { caseStudies, getAdjacentProjects, getCaseStudy } from "@/data/case-studies";

export function generateStaticParams() { return caseStudies.map(({ slug }) => ({ slug })); }

type CaseStudyPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  const title = `${study.title} — ${study.subtitle} | Anchal Sharma`;
  return { title, description: study.description, alternates: { canonical: `/work/${study.slug}` }, openGraph: { title, description: study.description, type: "article" } };
}

export default async function ProjectCaseStudy({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();
  const { previous, next } = getAdjacentProjects(slug);
  return <><Navigation /><main><CaseStudyPage study={study} previous={previous} next={next} /></main></>;
}
