export type PortfolioProject = {
  id: string;
  slug: string;
  category: string;
  title: string;
  shortTitle: string;
  sentence: string;
  featuredDescription: string;
  overview: string;
  problem: string;
  idea: string;
  solution: string;
  role: string;
  tools: string;
  status: string;
  ai: string;
  result: string;
  highlights: string[];
  tags: string[];
  image: string;
  cardMedia?: string;
  poster?: string;
  gallery?: { src: string; label: string }[];
  thumbnail: string;
  thumbnailAlt: string;
  imageComment: string;
  featured: boolean;
  featuredRank?: number;
};

export const portfolioProjects: PortfolioProject[] = [
  {
    "id": "ai-assisted-development",
    "slug": "ai-assisted-development",
    "category": "01 — Business Application",
    "title": "NEXORA AI OS\nA Connected Retail Workspace",
    "shortTitle": "NEXORA AI OS",
    "sentence": "An independent business-software project bringing retail records, stock movements and financial reporting into one local workspace.",
    "featuredDescription": "A connected retail workspace for customer records, inventory, sales and clear financial reporting.",
    "overview": "NEXORA AI OS is my independent business-software project for connecting everyday retail work in one focused workspace. Its implemented scope brings customer relationships, product stock, sales, invoices, recorded payments, expenses and financial reporting together for small-business owners and retail operators. The central product idea is continuity: a customer belongs to a sale, a completed sale affects inventory, and its invoice, payment history and reporting remain connected. The application runs locally through its desktop entry point, with genuine product screens demonstrated using clearly fictional business data.",
    "problem": "A retail business needs records that explain what is available, what has been sold, what remains unpaid and how recorded activity contributes to profit. Disconnected customer, product and payment information makes those relationships harder to follow, especially when a sale is only partly paid or goods are later returned. NEXORA began from this product hypothesis: a clearer operational workspace should make both the individual record and its effect on the wider business visible, with dashboard figures that can be traced to recorded activity.",
    "idea": "I approached NEXORA around the journey from business setup to an understandable financial result. Owners establish their business identity, reporting currency, workspace preferences and relevant dashboard widgets; permitted users then work with the records and actions available to their role. The interface groups CRM, inventory, sales and finance around shared business context, with searchable records, clear workflow states and links back to source information. Important product distinctions stay visible: draft sales do not affect stock or revenue, customer receipts are separate from profit, and returning goods is different from refunding cash. These choices connect each dashboard figure with the records that explain it.",
    "solution": "The connected retail flow supports customer and lead records, reviewed contact imports, workspace-scoped website lead intake and follow-ups with due dates, priorities and editable drafts. Products carry a SKU, selling price, opening cost, stock quantity and reorder threshold; receipts and adjustments create traceable movement history. Completing a draft sale updates stock, cost snapshots, its linked invoice and audit records together. Partial receipts, returns, refunds and reversals reconcile against the saved transaction history. Business details, private invoice source documents and registered signature images support invoice presentation, while expenses feed decimal-safe profit-and-loss reporting. The Next.js and React interface communicates with a NestJS service layer, with Prisma and PostgreSQL persisting the records. Server-side membership and ownership checks keep business and workspace scopes separate, while stable retry keys and transactional stock safeguards protect linked writes from duplicate processing and concurrent stock conflicts.",
    "role": "Independent product builder · Product direction and workflow design",
    "tools": "Next.js · React · TypeScript · NestJS · Prisma · PostgreSQL",
    "status": "Functional local retail application · Independent project",
    "ai": "My product decisions focused on making each business action understandable and traceable. Draft sales remain separate from completed transactions, payment receipts remain distinct from recognised revenue, and stock changes retain a movement history. NEXORA Intelligence connects recorded profit, reorder positions and due follow-ups to their source records through clear business rules. This gives an operator context for the next decision while keeping review and control with the user. I refined the requirements, workflow priorities and interface clarity through successive product iterations.",
    "result": "The outcome is a functional local retail application connecting customer, inventory, sales, payment and expense records with operational reporting. Documented verification includes source checks, real PostgreSQL and API workflows, encrypted backup-and-restore checks, and controlled browser journeys using disposable synthetic data. These checks support the implemented retail scope and its connected transaction model. Screenshots show the actual application with fictional demonstration data. NEXORA provides a concrete foundation for continued product development, with public deployment, signed standalone Windows delivery and further native/mobile acceptance as the next release milestones. The current focus remains reliable retail bookkeeping and business visibility.",
    "highlights": [
      "Business setup, workspace preferences and authorised context switching",
      "Customer and lead records with searchable contacts",
      "Scheduled follow-ups with editable message drafts",
      "Products, opening stock and traceable stock movements",
      "Draft-to-completed sales with linked invoices",
      "Partial payments, returns and payment corrections",
      "Private invoice source documents and signature images",
      "Decimal-safe profit, expense and customer-receipt reporting",
      "Source-linked business signals and reorder alerts",
      "Reviewed contact imports and workspace-scoped lead intake"
    ],
    "tags": [
      "Retail workflows",
      "Business software",
      "Product thinking"
    ],
    "image": "/nexora-laptop-demo.mp4",
    "thumbnail": "/nexora-laptop-demo.mp4",
    "thumbnailAlt": "Actual NEXORA application recording in a laptop mockup, using fictional demo data",
    "imageComment": "Verified six-second app recording composited into an original laptop mockup; repeated within an eighteen-second presentation",
    "featured": true,
    "featuredRank": 1
  },
  {
    "id": "e-commerce",
    "slug": "e-commerce",
    "category": "02 — Business Operations",
    "title": "AI Operations Platform\nFrom Enquiry To Execution",
    "shortTitle": "AI Operations Platform",
    "sentence": "A local B2B operations application connecting enquiries, conversations and follow-ups with controlled workflows, human approval and a recorded execution history.",
    "featuredDescription": "An enquiry-to-action workspace connecting customer context, human review and controlled internal workflows with a traceable execution history.",
    "overview": "AI Operations Platform is my independent product project for small B2B teams coordinating the work that follows a customer enquiry. It brings authenticated workspace access, leads, conversations, follow-ups, manual workflows, human review, internal notifications and activity into one application. The product follows a clear operational journey: capture the context, identify the next action, apply a policy, request approval when required and retain the result. Its current implementation runs locally with persisted business records and a supervised background worker. The portfolio demonstration uses an isolated workspace and fictional sample records to show the actual application without exposing customer information.",
    "problem": "An enquiry rarely ends with a single reply. A team may need to understand the conversation, assign a follow-up, check whether an action is allowed and confirm what happened afterwards. When that context is scattered, the next step becomes difficult to track and responsibility can become unclear. I approached this as a product problem: how could a small team move from an incoming enquiry to a controlled operational action while keeping the relationship, decision and outcome visible in the same workspace?",
    "idea": "I organised the experience around continuity and accountability. A lead holds the customer context, a conversation preserves the discussion, and a follow-up makes the next task visible. Workflows then add an explicit definition, a version and a policy before execution. Actions that need a decision enter Human Review; an approved internal action can continue through the worker and leave a notification and activity record. Clear pending, approved, rejected, running and completed states explain where work stands. The user stays responsible for consequential decisions, while the system records the transition between intent and result.",
    "solution": "The Next.js and React interface connects to a modular NestJS API, with Prisma and PostgreSQL persisting users, workspaces and operational records. Server-side sessions, active membership and role permissions establish the permitted business context for each request. Leads, conversations and follow-ups feed workspace dashboard counts and activity. Manual workflow definitions retain immutable versions, and policy evaluation determines whether a trigger is allowed, denied or requires approval. A transactional outbox commits queued work with its business state; a supervised worker processes supported dry-run and internal-notification actions with retry and idempotency safeguards. Human Review, in-product notifications and tenant-scoped audit records make the outcome inspectable. Settings supports general workspace details, a read-only Team view and the server's permission matrix. The demonstrated execution path remains internal; live customer delivery and provider-generated AI results are not represented as verified features.",
    "role": "Independent product builder · Product direction and workflow planning",
    "tools": "Next.js · React · TypeScript · NestJS · Prisma · PostgreSQL · Vitest · Playwright",
    "status": "Functional local B2B application · Controlled internal workflows",
    "ai": "My product decisions focused on making operational handoffs clear and consequential actions reviewable. Workflow versions preserve the definition behind an execution, policy outcomes make the permitted path explicit, and approval requests give a person the final decision where required. I prioritised readable states, connected records and a visible activity trail over implying invisible automation. My contribution centres on the product concept, requirements, workflow priorities, interface clarity and iterative review. Optional provider integrations are separate from the demonstrated local workflow and require further live validation.",
    "result": "The result is a working local operations application that connects persisted customer context with a controlled internal execution path. Repository evidence documents authentication, role and tenant boundaries, database/API journeys, worker recovery, internal notifications, audit history and browser acceptance across desktop and mobile widths. The portfolio presents genuine application screens with fictional data; sample counts are demonstration records rather than business outcomes. The next release gates are reviewed hosting, trusted public TLS, managed recovery and verified authentication-email delivery. External customer communication and live AI-provider results require separate configuration and acceptance before they can be presented as delivered capabilities.",
    "highlights": [
      "Authenticated signup, verification and workspace onboarding",
      "Persisted leads, conversations and follow-up records",
      "Workspace dashboard counts and operational activity",
      "Manual workflows with immutable definition versions",
      "Explicit allow, deny and approval-required policies",
      "Human approval and rejection with visible decision states",
      "Transactional outbox and supervised background worker",
      "Idempotent dry-run and internal-notification execution",
      "In-product notifications and tenant-scoped audit history",
      "Server-side sessions, membership and role permissions",
      "General settings, read-only Team view and permission matrix",
      "Documented database, recovery and browser verification"
    ],
    "tags": [
      "B2B workflows",
      "Human review",
      "Product thinking"
    ],
    "image": "/ai-operations-console-demo.mp4",
    "thumbnail": "/ai-operations-console-demo.mp4",
    "thumbnailAlt": "Actual AI Operations application recording displayed in an original console presentation with fictional demo records",
    "imageComment": "Genuine isolated AI Operations desktop-window footage composited into an original operations-console presentation",
    "featured": true,
    "featuredRank": 2
  },
  {
    "id": "client-web-projects",
    "slug": "client-web-projects",
    "category": "03 — Personal Website",
    "title": "Personal Portfolio\nProducts, Context And Process",
    "shortTitle": "Personal Portfolio",
    "sentence": "A personal website presenting my independent projects, professional background and approach to building digital products.",
    "featuredDescription": "A personal website organising project context, professional identity and case studies.",
    "overview": "This portfolio brings my education, interests and independent product projects into a consistent presentation, with focused summaries and deeper case studies.",
    "problem": "A list of technologies does not explain a project’s purpose or its current limits. Recruiters need a clear account of what was built and where my contribution fits.",
    "idea": "Connect concise project introductions with accessible case studies that distinguish product intent, implementation and remaining work.",
    "solution": "The existing Next.js/React application runs through Vinext and Vite. Reusable sections and shared project data support the home, work, about, capabilities, business, contact and resume pages; GSAP and Three.js support the established visual experience.",
    "role": "Independent product builder · Content direction and experience refinement",
    "tools": "React · Next.js · TypeScript · Vinext · Vite · GSAP · Three.js",
    "status": "Local website · Content refinement",
    "ai": "I organised the professional content, project narratives and case-study structure around a clear account of my work. My focus is on accurate positioning, readable information and a consistent experience across the existing portfolio.",
    "result": "The original visual design is retained. This iteration focuses on professional positioning, accurate project scope and readable content; it does not claim audience growth or recruitment outcomes.",
    "highlights": [
      "Shared project data and case studies",
      "Professional background and education",
      "Responsive presentation",
      "Existing motion and 3D visuals"
    ],
    "tags": [
      "React",
      "Content strategy",
      "Content strategy"
    ],
    "image": "/portfolio-case-home.png",
    "cardMedia": "/portfolio-product-demo.mp4",
    "thumbnail": "/portfolio-product-demo.mp4",
    "poster": "/portfolio-demo-poster.jpg",
    "gallery": [
      { "src": "/portfolio-case-home.png", "label": "Home — Anchal Sharma's actual portfolio" },
      { "src": "/portfolio-case-capabilities.png", "label": "Capabilities — product ideas and clear direction" },
      { "src": "/portfolio-case-about.png", "label": "About — the portfolio's animated introduction" },
      { "src": "/portfolio-case-business.png", "label": "Business — a product-focused perspective" },
      { "src": "/portfolio-case-contact.png", "label": "Contact — a clear next step" },
      { "src": "/portfolio-case-work.png", "label": "Work — three independent projects" }
    ],
    "thumbnailAlt": "Actual Anchal Sharma portfolio desktop recording in an original cinematic studio display",
    "imageComment": "Genuine portfolio window recording and page screenshots; original UI preserved",
    "featured": true,
    "featuredRank": 3
  }
];

export const featuredProjects = portfolioProjects
  .filter((project) => project.featured)
  .sort((first, second) => (first.featuredRank ?? 99) - (second.featuredRank ?? 99));

export function getProjectBySlug(slug: string) {
  return portfolioProjects.find((project) => project.slug === slug || project.id === slug);
}

export function isVideoSource(source: string) {
  return source.toLowerCase().endsWith(".mp4");
}
