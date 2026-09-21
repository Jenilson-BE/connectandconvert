# CONNECT & CONVERT — COMPLETE WEBSITE DEVELOPMENT PROMPT

## 1. ROLE AND PROJECT OBJECTIVE

You are a senior full-stack frontend engineer, UI/UX designer, creative director, and SEO specialist.

Build a complete, production-ready, premium digital marketing agency portfolio website for:

**Agency Name:** Connect & Convert

**Website Domain:** https://connectandconvert.tech

**Business Location:** India

**Business Stage:** New agency

**Business Type:** Digital Marketing Agency

**Primary Business Objective:**

1. Generate qualified business inquiries and leads.
2. Establish professional brand credibility.
3. Showcase digital marketing expertise and creative capabilities.
4. Present portfolio work and case studies transparently.
5. Build a foundation for future SEO and client acquisition.

**Primary CTA:** Let's Work Together

**Design Direction:** Unique Premium

**Visual Theme:** White + Purple Luxury

**Target Audience:** Businesses of different sizes and industries across India. The service and messaging should be suitable for businesses that need digital marketing, branding, and customer acquisition support.

---

# 2. MANDATORY DESIGN DIRECTION

Create an original premium digital marketing agency website.

Do not build a generic SaaS landing page, a standard template, or a simple collection of cards.

The design must feel:

* Premium
* Modern
* Editorial
* Creative
* Conversion-focused
* Confident but not exaggerated
* Professionally structured
* Visually memorable
* Responsive
* Fast and accessible

## Visual identity

Use a refined white and purple luxury aesthetic.

### Core colors

* Primary background: #FAF9FC
* Main dark color: #17121F
* Primary purple: #6D28D9
* Secondary violet: #A855F7
* Lavender accent: #E9D5FF
* Main text: #17121F
* Secondary text: #625A6D
* Borders: #E8E2EF
* White: #FFFFFF

Use CSS variables or a centralized theme configuration.

Do not scatter color values throughout the codebase.

### Design restrictions

* Do not use excessive glassmorphism.
* Do not make every section a card.
* Do not use excessive rounded containers.
* Do not add random gradients everywhere.
* Do not use unnecessary neon effects.
* Do not create a generic dashboard interface.
* Do not use excessive animations that affect readability.
* Do not repeat the same layout pattern in every section.
* Do not use fabricated marketing statistics or testimonials.
* Do not create excessive mobile whitespace.

Use premium spacing, typography, composition, subtle shadows, and carefully selected visual effects.

---

# 3. TECHNOLOGY STACK

Use the following stack unless there is a strong technical reason to change it.

## Frontend

* Next.js with App Router
* React
* TypeScript
* Tailwind CSS
* shadcn/ui where useful
* Framer Motion
* Lucide React icons

## Forms and validation

* React Hook Form
* Zod
* Client-side validation
* Server-side validation where backend processing exists

## Content

Use typed constants or structured content objects for:

* Services
* Navigation
* Portfolio projects
* Case studies
* FAQs
* Testimonials
* Footer links
* SEO metadata

Do not hardcode repeated content across multiple components.

## Deployment

* Vercel for frontend hosting
* Use a secure server-side form submission mechanism or a suitable backend/email provider.
* Use environment variables for secrets and external service configuration.

Do not expose API keys, SMTP credentials, or private configuration in client-side code.

---

# 4. WEBSITE ROUTES

Implement the following public routes.

## Core pages

* /
* /services
* /services/meta-ads
* /services/google-ads
* /services/seo
* /services/social-media-management
* /services/content-branding
* /services/whatsapp-automation
* /work
* /case-studies
* /about
* /contact
* /privacy-policy
* /terms-and-conditions

Use meaningful URLs, proper page metadata, and internal links.

If portfolio or case-study content is stored in structured data, use dynamic routes only where necessary. Do not create unnecessary complexity.

---

# 5. GLOBAL WEBSITE LAYOUT

Create reusable global components.

## Required components

* Navbar
* Mobile navigation
* Footer
* Primary CTA button
* Secondary CTA button
* Section heading
* Service link component
* Portfolio gallery
* FAQ accordion
* Contact form
* Scroll-to-top behavior where appropriate
* Page transition or reveal utilities
* Accessible focus styles
* Loading states
* Error states

## Navbar

Desktop:

* Logo / wordmark on the left.
* Services navigation.
* Work link.
* About link.
* Contact link.
* Primary CTA: Let's Work Together.
* Sticky or fixed behavior with a refined background transition.

Mobile:

* Logo.
* Accessible menu toggle.
* Navigation links.
* Prominent CTA.
* Clear close button.
* No horizontal overflow.
* Correct keyboard navigation and focus management.

The header should feel premium and lightweight.

Do not make the navbar excessively tall on mobile.

---

# 6. HOMEPAGE — COMPLETE SECTION SPECIFICATION

Create the homepage in the following order.

## SECTION 01 — HERO

### Objective

Immediately communicate the agency's value proposition and provide a clear next action.

### Suggested content

Eyebrow:

DIGITAL MARKETING • CREATIVE • GROWTH

Headline:

Connect with your audience.
Convert attention into growth.

Supporting copy:

We help businesses strengthen their digital presence through performance marketing, strategic content, and creative solutions designed around their business goals.

Primary CTA:

Let's Work Together

Secondary CTA:

Explore Our Services

### Layout

Create a unique asymmetric hero.

Desktop:

* Large editorial headline on the left.
* Creative marketing visual on the right.
* Purple visual accents.
* Carefully positioned supporting text.
* CTA buttons aligned with the content.
* Decorative typography or campaign-inspired labels.
* Strong whitespace and visual hierarchy.

Mobile:

* Stack content vertically.
* Keep headline readable.
* Use a compact but impactful visual.
* Maintain CTA visibility.
* Avoid oversized text causing horizontal overflow.

### Hero visual

Create an original abstract marketing-inspired visual, such as:

* Layered campaign frames.
* Abstract purple forms.
* Typography fragments.
* Creative direction board.
* Campaign performance-inspired visual motifs.
* Editorial composition.

The visual should support the agency brand, not distract from the headline.

Do not use unrelated stock photography as the main hero visual.

### Hero animation

* Smooth entrance animation.
* Headline reveal.
* Subtle movement of decorative elements.
* Respect prefers-reduced-motion.
* Avoid blocking page interaction.
* Ensure animations do not cause layout shifts.

---

## SECTION 02 — BRAND INTRODUCTION

### Section eyebrow

OUR PERSPECTIVE

### Heading

Marketing is more than being seen.

### Content

It's about reaching the right people, communicating meaningful value, and creating opportunities for businesses to grow.

Connect & Convert brings together marketing strategy, creative execution, and digital channels to help businesses communicate with their audiences and work toward their growth objectives.

### Layout

Use a large editorial statement with a supporting text block.

Include three principles:

1. Audience-first thinking
2. Creative and strategic execution
3. Continuous measurement and refinement

Avoid presenting unverified claims as established agency achievements.

---

## SECTION 03 — SERVICES

### Heading

Everything your digital presence needs to move forward.

### Supporting copy

From paid campaigns to content and automation, explore the services that can support your brand's digital growth journey.

### Services to implement

#### 01 — META ADS

Title:
Meta Ads

Description:
Strategic Facebook and Instagram advertising designed around audience targeting, creative testing, campaign objectives, and performance monitoring.

Include:

* Campaign planning
* Audience research
* Creative testing
* Campaign optimization
* Performance reporting

CTA:
Explore Meta Ads

#### 02 — GOOGLE ADS

Title:
Google Ads

Description:
Search advertising and campaign management designed to connect businesses with people actively searching for relevant products and services.

Include:

* Keyword research
* Search campaign setup
* Ad copy development
* Conversion tracking
* Performance analysis

CTA:
Explore Google Ads

#### 03 — SEO / AEO / GEO

Title:
SEO / AEO / GEO

Description:
Build search visibility and useful content that helps audiences discover your business across search engines and emerging answer-oriented search experiences.

Include:

* Technical SEO
* On-page optimization
* Content planning
* Structured data
* Search performance analysis

Do not promise guaranteed rankings or guaranteed inclusion in AI-generated answers.

CTA:
Explore SEO

#### 04 — SOCIAL MEDIA MANAGEMENT

Title:
Social Media Management

Description:
Build a consistent digital presence through content planning, creative publishing, audience engagement, and brand communication.

Include:

* Content calendar
* Social media strategy
* Creative coordination
* Publishing support
* Performance review

CTA:
Explore Social Media

#### 05 — CONTENT CREATION & BRANDING

Title:
Content Creation & Branding

Description:
Create meaningful brand experiences through visual content, creative direction, brand identity, and marketing communication.

Include:

* Brand identity direction
* Social media creatives
* Ad creative design
* Content concepts
* Brand messaging

CTA:
Explore Content & Branding

#### 06 — WHATSAPP MARKETING / AUTOMATION

Title:
WhatsApp Marketing & Automation

Description:
Support customer communication through appropriate WhatsApp marketing and automation workflows, with consent, relevant platform requirements, and responsible messaging practices.

Include:

* Inquiry workflows
* Customer communication
* Automated notifications
* Lead follow-up workflows
* Approved messaging integrations

Do not imply that unsolicited bulk messaging or policy-violating automation is supported.

CTA:
Explore WhatsApp Automation

### Services UI

Do not display all services as six identical basic cards.

Use an editorial numbered list or an asymmetric interactive layout.

Desktop:

* Large service titles.
* Numbered sections.
* Hover interactions.
* Supporting descriptions.
* Relevant visual or accent changes.

Mobile:

* Stacked service rows.
* Clear tap targets.
* Expandable descriptions or service page links.
* No inaccessible hover-only interactions.

---

## SECTION 04 — MARKETING APPROACH

### Heading

Different businesses. Different strategies.

### Content

Your business has its own audience, challenges, and growth objectives. We develop marketing approaches based on your goals, market, and available resources.

### Four-step framework

01 — Understand
Audience, positioning, objectives, and existing marketing activity.

02 — Strategize
Channel selection, messaging, creative direction, and campaign priorities.

03 — Execute
Develop creatives, launch campaigns, and implement agreed marketing activities.

04 — Measure & Refine
Review relevant performance indicators and identify improvements.

### UI

Create a distinctive process timeline.

Desktop:

* Horizontal or asymmetric timeline.
* Step numbers.
* Animated progress or line drawing.

Mobile:

* Vertical timeline.
* Clearly readable step content.
* Reduced animation complexity.

---

## SECTION 05 — CREATIVE WORK SHOWCASE

### Heading

Ideas built to make an impression.

### Supporting copy

Explore selected creative concepts, marketing projects, and visual explorations from Connect & Convert.

### Portfolio categories

* Meta Ad Creatives
* Branding
* Social Media Content
* Campaign Concepts
* Landing Page Concepts
* Marketing Strategy Samples

### Portfolio behavior

* Editorial grid or masonry-inspired composition.
* Different image sizes to create visual rhythm.
* Hover reveals project category and title.
* Accessible project links.
* Optimized images.
* Clear project details.

### Content rules

Support the following project statuses:

* Client Work
* Agency Work
* Concept Work

Every concept project must be clearly labeled.

Do not present hypothetical work as client work.

Do not fabricate campaign budgets, impressions, reach, conversions, or client outcomes.

Create a content structure that allows replacing placeholder data with actual projects later.

---

## SECTION 06 — WHY CONNECT & CONVERT?

### Heading

Built around your business goals.

### Principles

01 — Clear Communication
Keep goals, deliverables, and expectations visible.

02 — Tailored Strategies
Adapt the approach to each business and audience.

03 — Data-Informed Decisions
Use relevant campaign and marketing performance data.

04 — Long-Term Partnership
Build a structured working relationship with clients.

### UI

Use four visual blocks with a refined editorial composition.

Avoid exaggerated claims such as:

* India's #1 agency
* Guaranteed results
* 100% success rate
* Best digital marketing company

Only add such claims if they can be substantiated and are appropriate for the context.

---

## SECTION 07 — INDUSTRY APPLICATIONS

### Heading

Your industry. Your opportunity.

### Purpose

Demonstrate how marketing services may be adapted to different types of businesses.

### Industries

* Real Estate
* E-commerce & Retail
* Education
* Healthcare & Wellness
* Local Services
* Professional Services
* Startups

### UI

Use an interactive industry selector.

Desktop:

* Industry navigation on one side.
* Supporting content and visual on the other.
* Selected industry state.
* Smooth but restrained transitions.

Mobile:

* Touch-friendly industry selector.
* Accessible selected state.
* Stacked content.

Do not claim industry-specific experience unless actual documented work exists.

---

## SECTION 08 — WORK / PROOF

### Heading

Proof that speaks for itself.

### Initial new-agency implementation

Build an honest portfolio section that can accommodate:

* Agency projects
* Concept work
* Actual client projects
* Verified campaign results
* Testimonials with permission

Use empty states or polished content placeholders where data is not yet available.

Example empty state:

We're building our portfolio with meaningful creative and marketing work. Explore our capabilities or get in touch to discuss your project.

Do not populate the section with invented numbers or fabricated client logos.

### Future capabilities

Make it easy to add:

* Campaign objectives
* Budget
* Duration
* Target audience
* Channels
* Documented outcomes
* Creative samples
* Client testimonial

Only display information that is accurate and approved for publication.

---

## SECTION 09 — FAQ

### Heading

Questions before getting started?

Create an accessible accordion.

### FAQ content

1. What services does Connect & Convert offer?
2. Do you work with businesses of all sizes?
3. How does your marketing process work?
4. Do you provide customized marketing plans?
5. Do you offer Meta Ads and Google Ads management?
6. How can I get started?
7. How do you approach marketing performance measurement?
8. Do you offer WhatsApp marketing and automation?

Write concise, accurate answers.

Do not guarantee outcomes that depend on third-party platforms, market conditions, or client inputs.

Ensure accordion controls use correct accessible names, expanded states, and keyboard behavior.

---

## SECTION 10 — FINAL CTA

### Heading

Let's build something meaningful.

### Supporting copy

Have a business goal in mind? Let's discuss how Connect & Convert can support your next digital marketing initiative.

### Primary CTA

Let's Work Together

### Secondary CTA

Explore Our Services

### Design

Use a high-contrast dark ink or purple section.

Create a premium editorial CTA composition with:

* Large typography
* Minimal decorative elements
* Strong button hierarchy
* Adequate contrast
* Mobile-friendly spacing

---

# 7. CONTACT PAGE

Create a complete contact page designed for qualified inquiries.

## Hero

Eyebrow:
LET'S CONNECT

Headline:
Have a project in mind? Let's talk.

Supporting text:
Tell us a little about your business and what you'd like to achieve. We'll use your inquiry to understand how we can help.

## Contact form fields

* Full Name — required
* Business Name — required
* Email Address — required
* Phone / WhatsApp Number — optional or required based on business decision
* Services Interested In — multi-select or checkboxes
* Business Website — optional
* Marketing Goals — required
* Budget Range — optional
* Additional Message — optional

## Form requirements

* React Hook Form + Zod validation.
* Server-side validation.
* Accessible labels.
* Clear inline errors.
* Loading state.
* Success state.
* Failure state.
* Spam protection.
* Secure submission.
* Do not expose secrets in the browser.
* Prevent duplicate submissions where possible.

### Success message

Thank you for reaching out to Connect & Convert. We've received your inquiry and will review the details.

Do not claim that an email or message was sent unless the submission process confirms it.

### Form backend

Implement a clean integration boundary for the email or CRM provider.

Use environment variables for:

* Form submission endpoint
* Email provider configuration
* Notification recipient
* Any required API keys

If no backend provider is configured, implement a clearly documented setup state and do not silently claim delivery.

---

# 8. INDIVIDUAL SERVICE PAGES

Build reusable service page components while allowing unique content and visuals per service.

## Common service page structure

1. Breadcrumbs
2. Service hero
3. Service overview
4. What we can help with
5. Strategy / workflow
6. Suitable business goals
7. Relevant work or concept examples
8. FAQ
9. CTA
10. Footer

## Meta Ads page

Include:

* Paid social overview
* Campaign planning
* Creative testing
* Audience and funnel considerations
* Conversion tracking
* Optimization and reporting

## Google Ads page

Include:

* Search advertising overview
* Keyword strategy
* Ad copy
* Landing page alignment
* Conversion tracking
* Campaign review

## SEO page

Include:

* Technical SEO
* On-page SEO
* Content strategy
* Structured data
* AEO / GEO considerations
* Reporting and monitoring

Avoid guaranteed ranking claims.

## Social Media Management page

Include:

* Content strategy
* Publishing workflows
* Audience engagement
* Brand consistency
* Reporting

## Content & Branding page

Include:

* Brand identity
* Visual direction
* Social media creatives
* Campaign concepts
* Content planning

## WhatsApp Automation page

Include:

* Inquiry automation
* Customer communication
* Notifications
* Workflow design
* Consent and platform compliance

Do not encourage spam or unauthorized messaging.

Each service page must include an appropriate CTA to contact the agency.

---

# 9. ABOUT PAGE

Create a professional agency introduction page.

## Sections

### Hero

Who we are and what we aim to help businesses achieve.

### Our approach

Explain the connection between strategy, creative, and digital execution.

### Our values

* Clarity
* Creativity
* Continuous learning
* Responsible marketing
* Client collaboration

### Our capabilities

Present the six services with links.

### CTA

Let's Work Together

Since the agency is new:

* Do not invent team size.
* Do not create false founding history.
* Do not fabricate client achievements.
* Use real founder/team information once provided.

---

# 10. WORK AND CASE STUDIES

## Work page

Create a filterable portfolio gallery.

### Filters

* All
* Meta Ads
* Google Ads
* SEO
* Social Media
* Branding
* Concept Work

### Project data structure

Each project should support:

* id
* title
* slug
* category
* projectType
* shortDescription
* description
* coverImage
* gallery
* services
* clientName (optional)
* industry (optional)
* objectives (optional)
* outcomes (optional)
* published
* featured

Do not include invented information in the content data.

## Case study page

Support the following structure:

1. Project overview
2. Business challenge
3. Objectives
4. Strategy
5. Execution
6. Creative examples
7. Measurement approach
8. Documented results (when available)
9. Learnings
10. CTA

Clearly label hypothetical or concept case studies.

---

# 11. ANIMATION SYSTEM

Use Framer Motion selectively.

## Required animations

* Hero entrance animation
* Section reveal
* Text reveal where appropriate
* Service hover interaction
* Portfolio hover interaction
* FAQ expansion
* Mobile menu transition
* CTA hover states
* Subtle decorative motion

## Animation rules

* Avoid animation overload.
* Keep animation purposeful.
* Respect prefers-reduced-motion.
* Do not cause layout shifts.
* Do not delay access to important content.
* Avoid expensive continuous animations on mobile.
* Ensure keyboard and touch interactions work without relying on hover.

Create reusable motion variants only where they simplify the implementation.

---

# 12. RESPONSIVE DESIGN

Support:

* Mobile: 320px and above
* Tablet: 768px and above
* Desktop: 1024px and above
* Large desktop: 1280px and above

## Requirements

* No horizontal overflow.
* Proper text wrapping.
* Responsive typography.
* Responsive grids.
* Appropriate image sizing.
* Mobile-first layout decisions.
* Correct navigation behavior.
* Touch-friendly interactive elements.
* Avoid excessive vertical spacing.
* Keep CTA buttons usable on small screens.
* Check all pages, not just the homepage.

Test at common viewport sizes, including narrow mobile screens.

---

# 13. SEO IMPLEMENTATION

Implement foundational technical SEO.

## Metadata

Create unique metadata for:

* Home
* Services
* Each service page
* About
* Work
* Case studies
* Contact

Use relevant titles and descriptions without keyword stuffing.

## Structured data

Implement appropriate structured data, such as:

* Organization
* WebSite
* Service
* BreadcrumbList

Use only accurate information.

Do not add fabricated ratings, reviews, addresses, or business information.

## Technical SEO

* Generate sitemap.
* Configure robots.txt.
* Add canonical URLs where appropriate.
* Use semantic HTML.
* Implement descriptive image alt text.
* Add internal links.
* Avoid duplicate metadata.
* Ensure crawlable content.
* Optimize loading performance.

## India-focused SEO

Build content relevant to the agency's actual service coverage in India.

Do not create hundreds of thin city pages simply to target locations.

Create location-specific landing pages only when they contain useful, accurate information about services and coverage.

---

# 14. PERFORMANCE

Prioritize a fast and reliable user experience.

## Requirements

* Optimize images.
* Use modern image formats where appropriate.
* Lazy-load below-the-fold media.
* Avoid unnecessary third-party scripts.
* Reduce layout shifts.
* Use appropriate font loading.
* Keep JavaScript bundles reasonable.
* Avoid expensive animations.
* Test production builds.

Check:

* Largest Contentful Paint
* Cumulative Layout Shift
* Interaction to Next Paint
* Mobile performance
* Accessibility

Do not sacrifice accessibility or readability solely to optimize visual effects.

---

# 15. ACCESSIBILITY

Implement accessibility as a mandatory requirement.

* Use semantic HTML.
* Use proper heading hierarchy.
* Provide accessible button names.
* Use labels for all form fields.
* Ensure keyboard navigation.
* Provide visible focus states.
* Use sufficient color contrast.
* Provide alt text for meaningful images.
* Use decorative images appropriately.
* Ensure modals and menus manage focus.
* Use aria-expanded for expandable controls.
* Do not rely only on color to communicate state.
* Support reduced motion.

Test using keyboard navigation and an accessibility audit tool.

---

# 16. SECURITY AND PRIVACY

Implement basic website security practices.

* Validate all form inputs.
* Sanitize and handle user-submitted data appropriately.
* Add spam prevention.
* Protect API routes.
* Keep secrets server-side.
* Use HTTPS in deployment.
* Avoid exposing sensitive information in logs.
* Provide Privacy Policy and Terms pages.
* Add suitable cookie/analytics disclosures where needed.
* Do not store unnecessary personal information.
* Handle WhatsApp and marketing data responsibly.

Do not claim legal compliance without verifying the applicable requirements and actual implementation.

---

# 17. CONTENT MANAGEMENT APPROACH

Keep content easy to update.

Create typed constants or structured data modules.

Suggested files:

* lib/constants.ts
* lib/services.ts
* lib/portfolio.ts
* lib/case-studies.ts
* lib/faq.ts
* lib/seo.ts

Separate content from UI components where practical.

Do not introduce a CMS unless it is actually needed for the initial project.

The initial website can use static, code-managed content with a clean structure for future CMS integration.

---

# 18. RECOMMENDED FOLDER STRUCTURE

Use a clean Next.js project structure.

connect-and-convert/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── services/
│   │   ├── page.tsx
│   │   ├── meta-ads/
│   │   ├── google-ads/
│   │   ├── seo/
│   │   ├── social-media-management/
│   │   ├── content-branding/
│   │   └── whatsapp-automation/
│   ├── work/
│   ├── case-studies/
│   ├── about/
│   ├── contact/
│   ├── privacy-policy/
│   └── terms-and-conditions/
├── components/
│   ├── layout/
│   ├── sections/
│   ├── services/
│   ├── portfolio/
│   ├── forms/
│   └── ui/
├── lib/
│   ├── constants.ts
│   ├── services.ts
│   ├── portfolio.ts
│   ├── case-studies.ts
│   ├── faq.ts
│   ├── seo.ts
│   └── utils.ts
├── public/
│   ├── images/
│   ├── icons/
│   └── fonts/
└── package.json

Adapt the structure to the installed Next.js version and project conventions.

---

# 19. BRAND ASSETS

Prepare the website to support:

* Agency logo
* Wordmark
* Favicon
* Social sharing image
* Portfolio images
* Service illustrations
* Custom creative assets

If actual brand assets are unavailable:

* Use a temporary text-based wordmark.
* Use placeholder visuals that are clearly replaceable.
* Do not invent an official logo or claim it is final.
* Keep image paths and content centralized.

Create a consistent image aspect ratio strategy for portfolio items.

---

# 20. ANALYTICS AND CONVERSION TRACKING

Prepare the website for measurement.

Track, where configured:

* Primary CTA clicks
* Contact form submissions
* WhatsApp CTA clicks
* Service page engagement
* Portfolio interactions

Use a consent-aware implementation where applicable.

Do not add unnecessary tracking scripts.

Make analytics IDs configurable through environment variables.

Document the setup requirements.

---

# 21. DEVELOPMENT WORKFLOW

Follow this implementation order:

## Step 1 — Project setup

* Initialize or inspect the Next.js project.
* Configure TypeScript.
* Configure Tailwind CSS.
* Install required dependencies.
* Establish folder structure.
* Configure fonts.
* Configure global theme variables.

## Step 2 — Design foundation

* Create global colors.
* Typography scale.
* Spacing system.
* Button variants.
* Container system.
* Responsive breakpoints.
* Motion utilities.

## Step 3 — Global layout

* Navbar.
* Mobile navigation.
* Footer.
* Shared buttons.
* Base page layout.

## Step 4 — Homepage

Implement the homepage sections in the defined order.

Ensure each section has:

* Responsive layout.
* Accessible content.
* Appropriate visual hierarchy.
* Content constants.
* Meaningful interactions.

## Step 5 — Internal pages

Build:

* Services overview.
* Six service pages.
* Work.
* Case studies.
* About.
* Contact.
* Legal pages.

## Step 6 — SEO and metadata

* Metadata.
* Sitemap.
* Robots.
* Structured data.
* Canonicals.
* Internal links.

## Step 7 — Form integration

* Validation.
* Submission handling.
* Success and error states.
* Security measures.
* Provider configuration documentation.

## Step 8 — QA and optimization

* TypeScript checks.
* Lint checks.
* Production build.
* Responsive testing.
* Accessibility testing.
* Link testing.
* Performance review.

---

# 22. QUALITY ASSURANCE CHECKLIST

Before considering the project complete, verify:

## Visual quality

* [ ] Unique premium layout.
* [ ] White and purple luxury theme.
* [ ] Consistent typography.
* [ ] No excessive glassmorphism.
* [ ] No generic repeated layouts.
* [ ] Proper shadows and spacing.
* [ ] High-quality visual assets.
* [ ] Consistent responsive composition.

## Functionality

* [ ] All navigation links work.
* [ ] All CTAs work.
* [ ] Mobile menu works.
* [ ] Service pages load.
* [ ] Portfolio links work.
* [ ] FAQ accordion works.
* [ ] Contact form validates correctly.
* [ ] Success and error states work.
* [ ] No console errors.

## Responsive behavior

* [ ] Mobile layout tested.
* [ ] Tablet layout tested.
* [ ] Desktop layout tested.
* [ ] No horizontal overflow.
* [ ] Typography scales correctly.
* [ ] Images remain proportionate.
* [ ] Touch interactions work.

## SEO

* [ ] Metadata implemented.
* [ ] Sitemap configured.
* [ ] Robots configured.
* [ ] Semantic HTML.
* [ ] Appropriate structured data.
* [ ] Internal linking.
* [ ] Image alt text.

## Accessibility

* [ ] Keyboard navigation.
* [ ] Focus states.
* [ ] Form labels.
* [ ] Color contrast.
* [ ] Accessible accordions.
* [ ] Reduced-motion support.

## Production

* [ ] Production build succeeds.
* [ ] Environment variables documented.
* [ ] No exposed secrets.
* [ ] Form submission behavior verified.
* [ ] Deployment configuration documented.
* [ ] Error handling implemented.

---

# 23. IMPORTANT IMPLEMENTATION INSTRUCTIONS

1. Do not stop after creating only a homepage mockup.
2. Implement the complete requested website structure.
3. Do not leave major sections as non-functional visual placeholders without clearly documenting what remains.
4. Do not fabricate business achievements, clients, reviews, or campaign results.
5. Use real content where provided and clearly labeled placeholders where content is missing.
6. Keep components maintainable and reusable.
7. Do not add unnecessary dependencies.
8. Do not introduce dark mode unless specifically requested later.
9. Prioritize mobile responsiveness.
10. Keep the visual design distinctive and premium.
11. Ensure the primary CTA is visible and meaningful throughout the website.
12. Ensure the contact form is implemented securely.
13. Test the application before reporting completion.
14. Report all remaining configuration requirements and limitations.
15. Do not claim deployment or successful delivery without actually verifying it.

---

# 24. FINAL DELIVERABLE

Deliver a complete Connect & Convert portfolio website that:

* Looks premium and original.
* Uses a white and purple luxury design.
* Communicates the agency's six services.
* Supports business lead generation.
* Demonstrates expertise honestly.
* Includes a complete responsive homepage.
* Includes internal service and portfolio pages.
* Has working navigation and interactions.
* Includes a secure contact form integration boundary.
* Has foundational SEO.
* Meets accessibility and performance expectations.
* Is organized for future content and feature expansion.

Start by inspecting the existing project, then implement the design and functionality systematically. Do not overwrite existing work without understanding the current codebase and preserving useful functionality.
