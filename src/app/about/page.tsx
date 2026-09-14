import type { Metadata } from "next";
import { Navigation } from "@/components/navigation/Navigation";
import { AboutExperience } from "@/components/about/AboutExperience";

export const metadata: Metadata = {
  title: "About Anchal Sharma — AI Engineer & Product Builder",
  description: "Meet Anchal Sharma, an AI engineer, full-stack developer and product builder working across software engineering, design and creative technology.",
  openGraph: {
    title: "About Anchal Sharma — AI Engineer & Product Builder",
    description: "A digital portrait of an AI engineer and product builder working across software, design and creative technology.",
    type: "profile",
  },
};

export default function AboutPage() {
  return <><Navigation /><AboutExperience /></>;
}
