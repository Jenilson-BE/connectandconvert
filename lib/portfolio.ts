import { PortfolioProject } from "./types";

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: "lumina-skincare-meta-ads",
    slug: "lumina-skincare-meta-ads",
    title: "Lumina Organic Botanicals — Performance Creative Framework",
    category: "Meta Ads",
    projectType: "Concept Work",
    shortDescription:
      "A structured Meta Ad creative testing framework designed for a premium direct-to-consumer skincare line, highlighting ingredient transparency and direct hook variations.",
    description:
      "This agency concept project demonstrates our methodology for multi-angle creative testing. We conceptualized 6 distinct hook styles (Ingredient Breakdown, Dermatologist Comparison, Routine Showcase, and Customer Reviews) across 9:16 vertical video and 4:5 static formats.",
    coverImage: "/images/portfolio/lumina-cover.svg",
    services: ["Meta Ads", "Content Creation & Branding"],
    industry: "E-commerce & D2C",
    objectives: [
      "Test audience resonance across 3 core demographic segments",
      "Develop direct-response visual assets optimized for mobile feeds",
      "Structure testing matrix to identify winning cost-per-click hooks",
    ],
    outcomes: [
      "Documented 12 ready-to-run creative variations",
      "Established brand visual consistency across product catalog",
    ],
    published: true,
    featured: true,
  },
  {
    id: "aethel-residences-google-ads",
    slug: "aethel-residences-google-ads",
    title: "Aethel Residences — High-Intent Search Lead Capture",
    category: "Google Ads",
    projectType: "Agency Work",
    shortDescription:
      "Campaign architecture and landing page intent alignment targeting luxury residential property buyers and NRI investors.",
    description:
      "A comprehensive Google Search campaign framework engineered to capture high-intent commercial keywords while excluding price-sensitive bargain hunters through strict negative keyword lists and qualifying ad copy.",
    coverImage: "/images/portfolio/aethel-cover.svg",
    services: ["Google Ads", "Telegram Marketing & Automation"],
    industry: "Real Estate",
    objectives: [
      "Capture searches for luxury 3 & 4 BHK apartments in metro locations",
      "Prevent ad spend leakage on rental and affordable housing queries",
      "Route inquiries instantly to sales counselors via Telegram webhook",
    ],
    outcomes: [
      "Complete 50+ negative keyword library organized by category",
      "High quality score ad copy variations with tailored site extensions",
    ],
    published: true,
    featured: true,
  },
  {
    id: "apex-legal-seo-visibility",
    slug: "apex-legal-seo-visibility",
    title: "Apex Corporate Law — Topical Authority & AEO Foundation",
    category: "SEO",
    projectType: "Concept Work",
    shortDescription:
      "Information architecture, semantic schema deployment, and AI-answer optimization designed for a corporate advisory practice.",
    description:
      "A strategic search visibility architecture engineered for both traditional search engines and AI answer engines (ChatGPT, Gemini, Perplexity). Structures complex legal insights into clear, citeable question-and-answer schemas.",
    coverImage: "/images/portfolio/apex-cover.svg",
    services: ["SEO / AEO / GEO", "Content Creation & Branding"],
    industry: "Professional Services",
    objectives: [
      "Structure topic clusters around commercial contracts and regulatory compliance",
      "Implement deep JSON-LD LegalService and FAQPage schemas",
      "Format key definitions to earn direct citation in generative AI responses",
    ],
    outcomes: [
      "Comprehensive 20-topic semantic content blueprint",
      "Full technical audit checklist addressing Core Web Vitals",
    ],
    published: true,
    featured: true,
  },
  {
    id: "novara-wellness-social",
    slug: "novara-wellness-social",
    title: "Novara Holistic Wellness — Editorial Brand Storytelling",
    category: "Social Media",
    projectType: "Agency Work",
    shortDescription:
      "A 30-day curated content calendar, carousel designs, and brand voice guidelines built for a luxury wellness retreat.",
    description:
      "Designed to transition an aspiring wellness center into an authoritative lifestyle destination. The project established a serene, typographic aesthetic paired with practical mindfulness carousels and founder insights.",
    coverImage: "/images/portfolio/novara-cover.svg",
    services: ["Social Media Management", "Content Creation & Branding"],
    industry: "Healthcare & Wellness",
    objectives: [
      "Create a consistent, premium Instagram grid aesthetic",
      "Develop educational carousel frameworks that encourage saves and shares",
      "Streamline community engagement and direct message qualification",
    ],
    outcomes: [
      "30 curated post templates ready for deployment",
      "Cohesive brand voice handbook and response guidelines",
    ],
    published: true,
    featured: true,
  },
  {
    id: "zenith-fintech-brand-identity",
    slug: "zenith-fintech-brand-identity",
    title: "Zenith Capital — Modern B2B Brand Identity & Digital Collateral",
    category: "Branding",
    projectType: "Concept Work",
    shortDescription:
      "A refined typographic identity, color token system, and conversion pitch deck for an emerging fintech advisory firm.",
    description:
      "Constructed around themes of precision, stability, and digital clarity. Features a deep obsidian and royal violet color system, modern editorial typography, and modular landing page visual blocks.",
    coverImage: "/images/portfolio/zenith-cover.svg",
    services: ["Content Creation & Branding"],
    industry: "Startups",
    objectives: [
      "Build a memorable, high-trust visual identity for enterprise clients",
      "Establish typography and color rules that scale across digital touchpoints",
      "Design pitch collateral communicating complex financial structures simply",
    ],
    outcomes: [
      "Complete 32-page brand style guide and token specifications",
      "Master digital asset kit in vector and responsive web formats",
    ],
    published: true,
    featured: true,
  },
  {
    id: "pulse-edtech-telegram-funnel",
    slug: "pulse-edtech-telegram-funnel",
    title: "Pulse Academy — Click-to-Telegram Automated Community Admissions",
    category: "Concept Work",
    projectType: "Concept Work",
    shortDescription:
      "An automated student inquiry and syllabus download funnel built using Telegram bot workflows.",
    description:
      "Replaced static inquiry web forms with an instant, interactive Telegram bot funnel. Prospective students receive immediate syllabus downloads while the automation collects graduation year, course interests, and career goals.",
    coverImage: "/images/portfolio/pulse-cover.svg",
    services: ["Telegram Marketing & Automation", "Meta Ads"],
    industry: "Education",
    objectives: [
      "Reduce prospect response lag from hours to under 5 seconds",
      "Qualify prospective student intent through interactive Telegram buttons",
      "Sync qualified leads into counselor CRM with zero manual data entry",
    ],
    outcomes: [
      "Interactive 4-step bot conversation flowchart and fallback routing",
      "Custom invite link tracking and instant webhook CRM synchronization",
    ],
    published: true,
    featured: false,
  },
];
