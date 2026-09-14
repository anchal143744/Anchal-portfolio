import type { Metadata } from "next";
import { Navigation } from "@/components/navigation/Navigation";
import { LabExperience } from "@/components/lab/LabExperience";

export const metadata: Metadata = {
  title: "Lab — Anchal Sharma | AI, Creative Technology & Interactive Experiments",
  description: "Experiments by Anchal Sharma across AI, WebGL, creative technology, interaction design and software systems.",
  openGraph: { title: "Lab — Anchal Sharma", description: "AI, creative technology and interactive experiments.", type: "website" },
};

export default function LabPage() { return <><Navigation/><LabExperience/></>; }
