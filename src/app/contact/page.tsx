import type { Metadata } from "next";
import { Navigation } from "@/components/navigation/Navigation";
import { ContactExperience } from "@/components/contact/ContactExperience";

export const metadata: Metadata = {
  title: "Contact Anchal Sharma — AI Engineer & Product Builder",
  description: "Get in touch with Anchal Sharma about AI systems, software, product engineering and creative technology.",
  openGraph: { title:"Contact Anchal Sharma — AI Engineer & Product Builder", description:"Start a conversation about AI systems, software, product engineering or creative technology.", type:"website" },
};

export default function ContactPage(){ return <><Navigation/><ContactExperience/></>; }
