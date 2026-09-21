import { ServiceItem } from "./types";

export const SERVICES: ServiceItem[] = [
  {
    id: "meta-ads",
    slug: "meta-ads",
    number: "01",
    title: "Meta Ads Management",
    shortTitle: "Meta Ads",
    tagline: "High-impact Facebook & Instagram advertising engineered for measurable business growth.",
    description:
      "Strategic Facebook and Instagram advertising designed around meticulous audience targeting, continuous creative testing, disciplined campaign architecture, and full-funnel performance monitoring.",
    deliverables: [
      "Target audience research & custom persona mapping",
      "Full-funnel campaign architecture (Top, Middle, Bottom funnel)",
      "High-converting ad creative direction & copy variations",
      "Rapid creative testing matrix (Hooks, Angles, Formats)",
      "Meta Pixel & Conversions API (CAPI) tracking setup",
      "Weekly budget pacing, bid adjustments & optimization",
      "Transparent performance dashboards with actionable insights",
    ],
    workflow: [
      {
        step: "01",
        title: "Audience & Competitor Audit",
        description:
          "We analyze your past account data, ideal customer profile, competitor positioning, and highest-converting angles to establish our benchmark.",
      },
      {
        step: "02",
        title: "Creative & Messaging Strategy",
        description:
          "We conceptualize thumb-stopping visual hooks, direct-response copy, and multi-format assets (Static, Carousels, Reels) tailored for your offering.",
      },
      {
        step: "03",
        title: "Campaign Setup & CAPI Tracking",
        description:
          "We construct a clean campaign hierarchy, configure server-side tracking, and launch structured split-tests with defined conversion parameters.",
      },
      {
        step: "04",
        title: "Optimization & Scaling",
        description:
          "We monitor cost per acquisition, trim underperforming assets, double down on winning creative concepts, and scale budgets methodically.",
      },
    ],
    suitableFor: [
      "Direct-to-consumer (D2C) brands looking to increase store orders",
      "Real estate developers requiring pre-qualified buyer inquiries",
      "Service businesses seeking steady inbound consultation requests",
      "B2B and SaaS companies aiming to generate marketing qualified leads",
    ],
    faqs: [
      {
        question: "What minimum ad budget do you recommend for Meta Ads?",
        answer:
          "We recommend a minimum monthly media spend that allows sufficient conversion volume for the algorithm to exit the learning phase. During our initial consultation, we help determine the optimal budget based on your target cost per acquisition and industry benchmarks.",
      },
      {
        question: "Do you supply the creatives or do we need to provide them?",
        answer:
          "We provide creative direction, storyboard concepts, graphic design, and direct-response copywriting. If you have existing brand assets or raw footage, we repurpose and enhance them for high performance.",
      },
      {
        question: "How do you handle iOS privacy and attribution challenges?",
        answer:
          "We implement Meta's Conversions API (server-side tracking) alongside first-party UTM parameters and Google Analytics 4, ensuring resilient data capture and reliable attribution.",
      },
    ],
    ctaText: "Discuss Meta Ads Strategy",
  },
  {
    id: "google-ads",
    slug: "google-ads",
    number: "02",
    title: "Google Ads & Search Marketing",
    shortTitle: "Google Ads",
    tagline: "Capture high-intent prospects actively searching for your solutions at the precise moment of intent.",
    description:
      "Search advertising and performance campaign management designed to connect your business with buyers at their peak decision moment, backed by rigorous negative keyword filtering and landing page alignment.",
    deliverables: [
      "Commercial intent keyword research & search query grouping",
      "Search, Performance Max (PMax), and Display campaign setup",
      "Compelling responsive search ad (RSA) copy with custom extensions",
      "Negative keyword lists to eliminate wasted ad spend",
      "Google Tag Manager & Enhanced Conversion tracking setup",
      "Landing page conversion rate alignment recommendations",
      "Transparent search term reports and ROI tracking",
    ],
    workflow: [
      {
        step: "01",
        title: "Intent Mapping & Keyword Modeling",
        description:
          "We uncover the exact search terms your most profitable prospects use, filtering out informational noise to focus strictly on transactional queries.",
      },
      {
        step: "02",
        title: "Ad Copy & Extension Crafting",
        description:
          "We author resonant ad copy featuring unique value propositions, clear social proof, and site extensions that maximize ad real estate and quality scores.",
      },
      {
        step: "03",
        title: "Conversion Tracking & Launch",
        description:
          "We implement server-assisted conversion tags, phone call tracking, and value-based bidding parameters before publishing campaigns.",
      },
      {
        step: "04",
        title: "Query Mining & Bid Optimization",
        description:
          "We actively monitor the search terms report to add negative keywords, adjust target CPA/ROAS bids, and refine match types.",
      },
    ],
    suitableFor: [
      "Local service providers needing immediate inbound phone calls",
      "B2B service firms targeting high-ticket commercial keywords",
      "Healthcare clinics, educational institutes, and consultancies",
      "E-commerce stores aiming to dominate Google Shopping & PMax",
    ],
    faqs: [
      {
        question: "How quickly can we expect results from Google Search Ads?",
        answer:
          "Because Search Ads capture existing demand, qualified clicks and inquiries begin flowing as soon as campaigns are approved. Fine-tuning for optimal cost per lead generally takes 2 to 4 weeks of query mining.",
      },
      {
        question: "How do you prevent wasted ad spend on irrelevant searches?",
        answer:
          "We build exhaustive initial negative keyword libraries and review search query reports multiple times weekly to block junk impressions and maintain high buyer intent.",
      },
      {
        question: "Do you manage Performance Max campaigns?",
        answer:
          "Yes. We configure structured asset groups with verified audience signals and ensure proper brand exclusions so Performance Max doesn't cannibalize organic branded traffic.",
      },
    ],
    ctaText: "Plan Your Google Search Campaign",
  },
  {
    id: "seo",
    slug: "seo",
    number: "03",
    title: "SEO, AEO & GEO Search Visibility",
    shortTitle: "SEO / AEO / GEO",
    tagline: "Build enduring organic visibility across search engines and AI-driven answer engines.",
    description:
      "Modern search engine optimization combined with Answer Engine Optimization (AEO) and Generative Engine Optimization (GEO). We build useful, authoritative content and technical infrastructure that helps audiences discover you on Google and conversational AI platforms.",
    deliverables: [
      "Comprehensive technical SEO audit and Core Web Vitals optimization",
      "High-intent keyword opportunity mapping and search intent clustering",
      "On-page optimization (Semantic headings, metadata, internal links)",
      "Structured data implementation (Organization, Service, FAQ Schema)",
      "AEO & GEO content structuring for AI answer summaries (ChatGPT, Perplexity, Gemini)",
      "Content calendar designed for topical authority in your niche",
      "Monthly organic traffic, keyword visibility, and search console audits",
    ],
    workflow: [
      {
        step: "01",
        title: "Technical Architecture & Crawlability",
        description:
          "We ensure your site is fast, clean, mobile-responsive, indexable, and free of crawl errors, redirect loops, or broken links.",
      },
      {
        step: "02",
        title: "Topical Authority & Content Strategy",
        description:
          "We build topic clusters that establish deep topical relevance around your core services rather than chasing isolated vanity keywords.",
      },
      {
        step: "03",
        title: "Semantic Content & Schema Deployment",
        description:
          "We enrich pages with clear entity signals, JSON-LD structured schemas, and direct-answer formatting favored by LLMs and search engines.",
      },
      {
        step: "04",
        title: "Monitoring, Iteration & Refinement",
        description:
          "We track organic rankings, search impressions, click-through rates, and emerging AI citation signals to continually refine pages.",
      },
    ],
    suitableFor: [
      "Brands wanting to lower long-term customer acquisition costs",
      "Businesses needing strong regional and India-wide search prominence",
      "Companies wanting to be cited when potential clients research options via AI",
      "Content-driven organizations seeking compounding organic inbound traffic",
    ],
    faqs: [
      {
        question: "What is AEO and GEO, and why does it matter now?",
        answer:
          "Answer Engine Optimization (AEO) and Generative Engine Optimization (GEO) focus on structuring content with clear entity relationships, concise definitions, and authoritative citations so AI engines like ChatGPT, Perplexity, and Google AI Overviews cite your brand when answering user queries.",
      },
      {
        question: "Do you guarantee #1 rankings on Google?",
        answer:
          "No ethical agency guarantees specific rank positions because search algorithms constantly evolve. We focus on transparent, proven white-hat methodologies, technical excellence, and topical authority that generate qualified, sustainable organic leads.",
      },
      {
        question: "How long does SEO take to produce measurable impact?",
        answer:
          "Initial technical and indexing improvements typically take 4 to 8 weeks to register, while meaningful organic traffic and authority gains generally compound over 3 to 6 months.",
      },
    ],
    ctaText: "Explore Organic Visibility",
  },
  {
    id: "social-media-management",
    slug: "social-media-management",
    number: "04",
    title: "Social Media Management & Growth",
    shortTitle: "Social Media",
    tagline: "Build a consistent, credible digital presence that cultivates trust and audience resonance.",
    description:
      "Consistent, editorial social media publishing designed to elevate brand authority. From strategic monthly content calendars and aesthetic creative direction to community engagement and audience nurturing.",
    deliverables: [
      "Strategic monthly content calendar with clear thematic pillars",
      "Custom graphic design, carousel layouts, and short-form video concepts",
      "Direct, authentic copy tuned for LinkedIn, Instagram, and X",
      "Hashtag research, optimal posting schedule, and publishing management",
      "Community engagement guidelines and comment moderation support",
      "Trend curation relevant to your specific market segment",
      "Monthly engagement rate and follower growth breakdown",
    ],
    workflow: [
      {
        step: "01",
        title: "Brand Voice & Visual Aesthetic",
        description:
          "We define your brand's unique social tone of voice, visual template guidelines, color hierarchy, and typography for recognizable consistency.",
      },
      {
        step: "02",
        title: "Content Pillar Architecture",
        description:
          "We structure content into distinct pillars: educational insights, behind-the-scenes authority, case explorations, and community conversations.",
      },
      {
        step: "03",
        title: "Monthly Asset Creation & Review",
        description:
          "We prepare creatives, carousels, and copy in advance for client review and approval before scheduling across active channels.",
      },
      {
        step: "04",
        title: "Engagement & Performance Analysis",
        description:
          "We monitor reach, save rates, profile visits, and direct messages, adjusting topics to maximize audience interest and inbound inquiries.",
      },
    ],
    suitableFor: [
      "Founders and businesses wanting to establish professional credibility",
      "Brands needing consistent, high-quality digital touchpoints",
      "Companies preparing for funding, partnerships, or major campaign launches",
      "Local businesses wanting an active, trustworthy community presence",
    ],
    faqs: [
      {
        question: "Which platforms do you focus on?",
        answer:
          "We specialize in Instagram, LinkedIn, and X (Twitter), selecting the exact platforms that align with where your target buyers and decision-makers spend their attention.",
      },
      {
        question: "Do we get to review and approve posts before they go live?",
        answer:
          "Yes, absolutely. All content is scheduled in advance on a shared calendar, giving your team full preview and revision opportunities before publication.",
      },
      {
        question: "Can social media management directly generate sales?",
        answer:
          "Organic social media builds the essential trust, credibility, and brand validation that makes your paid ads and direct sales conversations convert at significantly higher rates.",
      },
    ],
    ctaText: "Elevate Your Social Presence",
  },
  {
    id: "content-branding",
    slug: "content-branding",
    number: "05",
    title: "Content Creation & Brand Identity",
    shortTitle: "Content & Branding",
    tagline: "Visual identity, creative direction, and messaging that position your brand as a market leader.",
    description:
      "Transform how the world perceives your business. We craft distinctive brand identities, editorial visual directions, high-converting ad creative concepts, and compelling marketing copywriting that commands premium value.",
    deliverables: [
      "Brand identity guidelines (Color palette, typography, design motifs)",
      "Core messaging framework, value proposition & tagline development",
      "High-converting ad creative concepts and storyboards",
      "Editorial digital collateral (Brochures, pitch decks, landing page visual assets)",
      "Conversion copywriting for websites, landing pages, and email sequences",
      "Asset library organized for long-term marketing execution",
    ],
    workflow: [
      {
        step: "01",
        title: "Brand Discovery & Market Mapping",
        description:
          "We interrogate your core mission, target audience expectations, and competitor aesthetics to uncover your distinct visual white space.",
      },
      {
        step: "02",
        title: "Concept & Identity Exploration",
        description:
          "We develop cohesive creative directions, experimenting with typographic harmony, color symbolism, and layout compositions.",
      },
      {
        step: "03",
        title: "Collateral & Ad Asset Production",
        description:
          "We translate the approved brand language into usable marketing assets: ad creatives, social kits, and conversion landing page elements.",
      },
      {
        step: "04",
        title: "Brand Book Delivery & Rollout",
        description:
          "We compile comprehensive brand guidelines and ready-to-use asset packages, ensuring consistency across every internal and external touchpoint.",
      },
    ],
    suitableFor: [
      "New businesses needing a polished, trustworthy market debut",
      "Established companies undergoing a modern digital rebranding",
      "Brands struggling with low conversion rates due to disjointed visuals",
      "Founders wanting distinctive creative assets that stand out from competitors",
    ],
    faqs: [
      {
        question: "What deliverables are included in a brand identity project?",
        answer:
          "Deliverables include full visual identity guidelines (color tokens, typography pairing, logo usage rules), social media creative templates, direct-response ad creative concepts, and foundational messaging copy.",
      },
      {
        question: "How do branding and performance marketing work together?",
        answer:
          "Great branding amplifies performance marketing. Clear typography, cohesive palettes, and persuasive messaging dramatically improve ad click-through rates and landing page conversions.",
      },
    ],
    ctaText: "Build Your Brand Identity",
  },
  {
    id: "telegram-automation",
    slug: "telegram-automation",
    number: "06",
    title: "Telegram Marketing & Automation",
    shortTitle: "Telegram Automation",
    tagline: "High-converting Telegram subscriber funnels and automated communication workflows.",
    description:
      "Accelerate subscriber acquisition and streamline community management. We design high-converting Click-to-Telegram ad campaigns, automated welcome bots, and broadcast lead nurturing funnels that convert attention into dedicated members.",
    deliverables: [
      "Click-to-Telegram performance ad campaign setup & optimization",
      "Automated welcome bots & interactive member qualification trees",
      "Invite link tracking with multi-source attribution",
      "Channel content strategy and community broadcast scheduling",
      "Private VIP channel access management & subscriber automation",
      "CRM & Google Sheets webhook integration for lead synchronization",
      "Subscriber acquisition cost & retention analytics reporting",
    ],
    workflow: [
      {
        step: "01",
        title: "Funnel & Audience Architecture",
        description:
          "We map out your target audience persona, define compelling community entry hooks, and plan the complete subscriber onboarding journey.",
      },
      {
        step: "02",
        title: "Ad Creatives & Tracking Setup",
        description:
          "We craft direct-response ad creatives, generate unique parameterized Telegram invite links, and configure conversion tracking pixels.",
      },
      {
        step: "03",
        title: "Bot Integration & Routing Logic",
        description:
          "We build intuitive automated Telegram bots that welcome incoming subscribers, qualify inquiries, and distribute resources instantly.",
      },
      {
        step: "04",
        title: "Testing & Live Scaling",
        description:
          "We test redirect pathways, verify server-side join event logs, optimize cost per subscriber, and scale winning ad angles.",
      },
    ],
    suitableFor: [
      "Trading & financial education communities seeking rapid verified growth",
      "VIP masterminds and private knowledge-sharing circles",
      "Brands wanting direct, unthrottled communication channels with their audience",
      "Course creators and coaches scaling subscriber acquisition",
    ],
    faqs: [
      {
        question: "How do Click-to-Telegram ads work?",
        answer:
          "Targeted prospects click on Meta or Google ads and are routed directly to your custom landing page or Telegram channel invite link with tracking parameters, ensuring seamless 1-click joining and accurate attribution.",
      },
      {
        question: "Can we track which ad creative generated which Telegram subscriber?",
        answer:
          "Yes. We use unique parameterized invite links and server-side tracking so you can accurately measure cost per subscriber and conversion rates by creative angle.",
      },
      {
        question: "Do you configure automated response bots?",
        answer:
          "Yes. We set up Telegram bots that automatically greet new members, deliver promised resources or lead magnets, and guide prospects toward paid offerings.",
      },
    ],
    ctaText: "Scale Your Telegram Community",
  },
];


