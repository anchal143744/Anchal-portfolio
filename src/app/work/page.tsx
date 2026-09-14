import type { Metadata } from "next";
import { Navigation } from "@/components/navigation/Navigation";
import { WorkArchive } from "@/components/work/WorkArchive";

export const metadata: Metadata = {
  title: "Selected Work — Anchal Sharma",
  description: "A digital archive of AI products, engineered systems, and considered digital experiences by Anchal Sharma.",
};

export default function WorkPage() {
  return <><Navigation /><main><WorkArchive /></main></>;
}
