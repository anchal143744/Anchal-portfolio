export const site = {
  name: "Anchal Sharma",
  emailAddress: "anchalsharma1432006@gmail.com",
  email: "mailto:anchalsharma1432006@gmail.com",
  resumeUrl: "/resume/Anchal-Sharma-Resume.pdf",
  resumeAvailable: true,
  profileImage: "/images/profile/anchal-sharma.jpeg" as string | null,
  profileImageAlt: "Professional portrait of Anchal Sharma",
  profileImagePosition: "58% 12%",
  role: ["AI Engineer", "Software Developer", "Full-Stack Developer"],
  availability: "Open to full-time, remote and collaborations",
  location: ["Based in India", "Working globally"],
  channels: {
    github: { label: "GitHub", href: "https://github.com/", configured: false },
    linkedin: { label: "LinkedIn", href: "https://www.linkedin.com/in/anchal-sharma-b7a2b8279/", configured: true },
  },
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/anchal-sharma-b7a2b8279/" },
    { label: "Email", href: "mailto:anchalsharma1432006@gmail.com" },
  ],
} as const;
