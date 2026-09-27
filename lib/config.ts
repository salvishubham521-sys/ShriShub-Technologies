export const brand = {
  name: process.env.NEXT_PUBLIC_BRAND_NAME || "Nexora",
  tagline: "Web products, designed and delivered with clarity.",
  description:
    "A professional platform for buying custom websites and web applications with transparent scope, contracts, secure payments and project tracking.",
};

export const services = [
  {
    slug: "portfolio",
    name: "Portfolio / Profile",
    short: "Personal brand sites for professionals, creators and students.",
    price: 24999,
    delivery: "7–10 days",
    revisions: 2,
    features: ["Responsive pages", "About + projects", "Contact form", "SEO basics", "Deployment support"],
  },
  {
    slug: "hotel",
    name: "Hotel Website",
    short: "Premium hotel and resort sites with enquiry and booking-ready flows.",
    price: 44999,
    delivery: "14–21 days",
    revisions: 3,
    features: ["Rooms & amenities", "Gallery", "Booking enquiry", "WhatsApp CTA", "Admin-ready architecture"],
  },
  {
    slug: "college",
    name: "College Website",
    short: "Institutional websites for colleges, schools and departments.",
    price: 59999,
    delivery: "21–30 days",
    revisions: 3,
    features: ["Departments", "Faculty", "Notices", "Admissions", "Events", "CMS-ready structure"],
  },
  {
    slug: "project",
    name: "Project Website",
    short: "Student, research, startup and demonstration projects.",
    price: 19999,
    delivery: "5–10 days",
    revisions: 2,
    features: ["Project showcase", "Documentation", "Demo pages", "Responsive UI", "Deployment"],
  },
  {
    slug: "business",
    name: "Business Website",
    short: "Conversion-focused websites for companies and local businesses.",
    price: 34999,
    delivery: "10–18 days",
    revisions: 3,
    features: ["Up to 8 pages", "Lead capture", "SEO foundations", "Analytics-ready", "CMS-ready structure"],
  },
  {
    slug: "custom",
    name: "Custom Web App",
    short: "For SaaS ideas, dashboards, booking platforms and AI-powered products.",
    price: 79999,
    delivery: "Quote after discovery",
    revisions: 3,
    features: ["AI-assisted discovery", "Role-based architecture", "Database-backed app", "Admin area", "API integrations"],
  },
] as const;

export const projectStatuses = [
  "Requirement Submitted",
  "Requirement Reviewed",
  "Contract Pending",
  "Payment Pending",
  "Project Started",
  "Design Phase",
  "Development Phase",
  "Testing",
  "Client Review",
  "Revisions",
  "Completed",
  "Delivered",
] as const;
