// Add only verified public destinations. Empty entries stay hidden.
export const portfolioDestinations = {
  instagram: "", // Full public profile URL.
  github: "https://github.com/anchal143744", // Full public profile URL.
  linkedin: "https://www.linkedin.com/in/anchal-sharma-dev/", // Full public profile URL.
  email: "mailto:anchalsharma1432006@gmail.com", // Email address or mailto: URL.
} as const;

export const homeSocials = [
  { id: "instagram", label: "Instagram", href: portfolioDestinations.instagram },
  { id: "github", label: "GitHub", href: portfolioDestinations.github },
  { id: "linkedin", label: "LinkedIn", href: portfolioDestinations.linkedin },
  { id: "email", label: "Email", href: portfolioDestinations.email },
] as const;
