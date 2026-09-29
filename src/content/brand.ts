export const brand = {
  name: "Almonzir Ali",
  descriptor: "Digital Solutions",
  promise: "Almonzir Ali turns ideas into modern digital products: websites, mobile apps, cloud platforms and the systems behind them.",
  location: "Cairo, Egypt",
  timeZone: "Africa/Cairo",
  // From the verified CV. Update here and it changes everywhere.
  email: "monzirali@outlook.com",
  links: [
    { label: "LinkedIn", handle: "almonzir-ali", href: "https://www.linkedin.com/in/almonzir-ali-144b5922b" },
    { label: "GitHub", handle: "monzir-hub", href: "https://github.com/monzir-hub" },
  ],
} as const;

export const nav = [
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
