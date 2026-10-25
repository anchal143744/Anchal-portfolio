import type { Metadata } from "next";
import "./globals.css";
import PortfolioScroll from "./components/PortfolioScroll";

export const metadata: Metadata = {
  title: "Anchal Sharma | Digital Product Builder",
  description:
    "Anchal Sharma’s portfolio of independent digital products: NEXORA AI OS, AI Operations Platform and a personal website. AI-assisted building with a business focus.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <PortfolioScroll>{children}</PortfolioScroll>
      </body>
    </html>
  );
}
