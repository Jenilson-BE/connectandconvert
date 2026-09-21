import { CaseStudy } from "./types";

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "d2c-performance-creative-matrix",
    slug: "d2c-performance-creative-matrix",
    title: "Performance Creative Matrix for Emerging D2C Lifestyle Brands",
    subtitle:
      "A systematic approach to testing visual hooks, angles, and direct-response formats to discover sustainable customer acquisition pathways.",
    category: "Meta Ads & Creative Strategy",
    projectType: "Concept Work",
    readTime: "5 min read",
    heroImage: "/images/case-studies/d2c-matrix.svg",
    overview:
      "This case exploration details our structured creative testing methodology for early-stage and growing consumer goods brands. Instead of relying on random artistic intuition, we treat creative production as a continuous hypothesis-testing laboratory.",
    challenge:
      "New consumer brands frequently struggle with escalating ad costs, creative fatigue within 10-14 days of launch, and unclear signals regarding why an ad succeeded or failed. Most agencies produce one or two ad concepts and exhaust the client's budget before finding a repeatable angle.",
    objectives: [
      "Establish an agile creative production workflow producing 8-12 variations weekly",
      "Deconstruct ad creative into isolated variables (First 3-second hook, core value proposition, CTA)",
      "Develop clear gating metrics to eliminate non-performers before scaling budgets",
      "Create high-retaining video and carousel formats tailored for mobile consumption",
    ],
    strategy: [
      {
        title: "Variable Isolation Methodology",
        description:
          "We separate creative testing into distinct tiers: Hook Testing (varying the opening visuals and headline while keeping the core message constant) and Angle Testing (focusing on pain relief vs. social proof vs. economic value).",
      },
      {
        title: "Funnel-Aligned Creative Allocation",
        description:
          "Top-of-funnel creatives focus strictly on category education and thumb-stopping curiosity. Middle-of-funnel introduces social proof and comparison charts. Bottom-of-funnel features FAQ handling, unboxing, and risk reversal.",
      },
      {
        title: "Data-Driven Iteration Cycles",
        description:
          "Using 3-second hook rate, thumbstop ratio, and outbound click-through rates, we identify the exact frame where viewers drop off and engineer stronger retention points.",
      },
    ],
    execution: [
      {
        title: "Concept Development & Storyboarding",
        points: [
          "Developed 4 distinct creative angles: 'The Hidden Cause', 'Founder's Discovery', '3-Step Routine', and 'Customer Honest Reaction'.",
          "Scripted dynamic direct-response copy adhering to strict mobile screen readability guidelines.",
          "Designed high-contrast typography overlays legible even on mute.",
        ],
      },
      {
        title: "Structured Sandbox Campaign Launch",
        points: [
          "Deployed creatives in an isolated CBO testing environment with equal baseline exposure.",
          "Monitored initial 1,000 impressions per creative to gauge organic engagement signals.",
          "Systematically tagged winners and graduated them into scaling campaigns.",
        ],
      },
    ],
    creativeSamples: [
      { caption: "Angle 1: Split-Screen Comparison (Product vs Alternative)", type: "Static Graphic" },
      { caption: "Angle 2: 3-Step Routine Showcase with Customer Voiceover", type: "Vertical Video (9:16)" },
      { caption: "Angle 3: Ingredient Transparency Breakdown Carousel", type: "Multi-Card Carousel" },
    ],
    measurement: [
      "Thumbstop Ratio (3-Second Video Views / Total Impressions)",
      "Outbound Click-Through Rate (CTR) and Cost Per Click (CPC)",
      "Landing Page View Rate to ensure ad-to-page alignment",
      "Cost per First-Time Customer Acquisition",
    ],
    learnings: [
      "Native, candid mobile visuals frequently outperform glossy corporate video production on Meta platforms.",
      "Clear typographic captions are mandatory: over 70% of initial mobile feed impressions occur with audio muted.",
      "A winning angle can yield multiple winning ads simply by refreshing the first 3 seconds of the visual.",
    ],
  },
  {
    id: "intent-driven-search-real-estate",
    slug: "intent-driven-search-real-estate",
    title: "Engineering Intent-Driven Google Search Funnels for Premium Real Estate",
    subtitle:
      "Eliminating wasted ad spend and capturing high-intent homebuyers through rigorous negative keyword modeling and instant Telegram qualification.",
    category: "Google Ads & Automation",
    projectType: "Concept Work",
    readTime: "6 min read",
    heroImage: "/images/case-studies/real-estate-intent.svg",
    overview:
      "Real estate search advertising in India is among the most competitive and expensive digital categories. This case study details our framework for isolating qualified luxury buyers while preventing ad spend leakage on irrelevant search queries.",
    challenge:
      "Real estate developers often suffer from broad keyword matching that triggers ads on searches like 'cheap 1 BHK rent', 'government housing scheme', or 'property job vacancies'. Furthermore, long web inquiry forms result in high lead drop-off and delayed sales response.",
    objectives: [
      "Construct a granular keyword hierarchy focused purely on verified commercial intent",
      "Build a multi-layered negative keyword list blocking all non-buying queries",
      "Bridge search intent with immediate Telegram automated brochure dispatch",
      "Achieve transparent tracking through Google Tag Manager and offline conversion imports",
    ],
    strategy: [
      {
        title: "Granular Single-Intent Ad Groups",
        description:
          "Instead of grouping all keywords into broad themes, we separated campaigns by configuration, geography, and investment intent (e.g., '3 BHK Luxury Penthouse [City]' vs 'Pre-launch Commercial Office Space').",
      },
      {
        title: "Aggressive Pre-Qualification Copywriting",
        description:
          "We explicitly included price baselines and location specifics inside ad headlines and descriptions, deliberately deterring clicks from unqualified searchers.",
      },
      {
        title: "Frictionless Telegram Qualification Bridge",
        description:
          "Landing page CTA gave prospects the choice to receive the complete digital brochure, floor plans, and pricing instantly on Telegram, where an automated bot collected qualification details.",
      },
    ],
    execution: [
      {
        title: "Negative Keyword Architecture",
        points: [
          "Cataloged 200+ negative keywords spanning rentals, student housing, careers, construction materials, and low-budget terms.",
          "Implemented automated daily search term screening to capture emerging negative keywords.",
        ],
      },
      {
        title: "Landing Page & Messaging Alignment",
        points: [
          "Designed a fast-loading, mobile-optimized property showcase page with high-resolution floor plans.",
          "Integrated Telegram bot webhooks for sub-5-second brochure delivery.",
        ],
      },
    ],
    creativeSamples: [
      { caption: "Responsive Search Ad: High-intent luxury copy with dynamic location insertion", type: "Search Copy" },
      { caption: "Telegram Automated Qualification Flow: Instant floor plan and brochure dispatch", type: "Bot Flow" },
    ],
    measurement: [
      "Search Impression Share and Top of Page Rate",
      "Cost Per Qualified Lead (prospects meeting budget criteria)",
      "Response Time: Time elapsed between lead inquiry and first communication",
      "Sales counselor engagement rate",
    ],
    learnings: [
      "Transparency in ad copy (such as stating 'Starting at ₹1.5 Cr') prevents accidental clicks and saves substantial ad spend.",
      "Responding within 2 minutes via Telegram yields 3x higher conversation engagement than attempting a cold phone call 4 hours later.",
    ],
  },
];
