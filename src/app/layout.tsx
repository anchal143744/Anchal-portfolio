import type { Metadata } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-sans", subsets: ["latin"] });
const instrument = Instrument_Serif({ variable: "--font-serif", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });

export const metadata: Metadata = {
  title: "Anchal Sharma — AI-Powered Full-Stack Developer",
  description: "Anchal Sharma builds websites, full-stack applications, AI-powered products, automation systems and modern digital experiences.",
  keywords: ["Anchal Sharma", "AI-Powered Full-Stack Developer", "Product Builder", "Product Engineer"],
  alternates: { canonical: "/" },
  openGraph: { title: "Anchal Sharma — AI-Powered Full-Stack Developer", description: "Websites, full-stack applications and intelligent digital products built through engineering, product thinking and thoughtful experience design.", type: "website" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="en" className={`${geist.variable} ${instrument.variable}`}><body>{children}</body></html>;
}
