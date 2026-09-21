export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  number: string;
  tagline: string;
  description: string;
  deliverables: string[];
  workflow: {
    step: string;
    title: string;
    description: string;
  }[];
  suitableFor: string[];
  faqs: {
    question: string;
    answer: string;
  }[];
  ctaText: string;
}

export type ProjectStatus = "Client Work" | "Agency Work" | "Concept Work";

export type ProjectCategory =
  | "Meta Ads"
  | "Google Ads"
  | "SEO"
  | "Social Media"
  | "Branding"
  | "Concept Work";

export interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
  category: ProjectCategory;
  projectType: ProjectStatus;
  shortDescription: string;
  description: string;
  coverImage: string;
  gallery?: string[];
  services: string[];
  clientName?: string;
  industry?: string;
  objectives?: string[];
  outcomes?: string[];
  published: boolean;
  featured: boolean;
}

export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  projectType: ProjectStatus;
  readTime: string;
  heroImage: string;
  overview: string;
  challenge: string;
  objectives: string[];
  strategy: {
    title: string;
    description: string;
  }[];
  execution: {
    title: string;
    points: string[];
  }[];
  creativeSamples?: {
    caption: string;
    type: string;
  }[];
  measurement: string[];
  learnings: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

export interface ContactFormData {
  fullName: string;
  businessName: string;
  email: string;
  phone?: string;
  services: string[];
  businessWebsite?: string;
  marketingGoals: string;
  budgetRange?: string;
  additionalMessage?: string;
  honeypot?: string;
}
