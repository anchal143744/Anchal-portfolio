"use client";

import { useCallback, useEffect, useRef, type PointerEvent } from "react";
import { createPortal } from "react-dom";
import { portfolioProjects as caseStudies } from "../data/projects";

const nexoraProject = caseStudies.find((project) => project.id === "ai-assisted-development")!;

const autoIdStudioModal = {
  "sections": [
    [
      "01 — Overview",
      nexoraProject.overview
    ],
    [
      "02 — The Problem",
      nexoraProject.problem
    ],
    [
      "03 — Product Direction",
      nexoraProject.idea
    ],
    [
      "04 — Implementation",
      nexoraProject.solution
    ],
    [
      "05 — My Role",
      nexoraProject.role
    ],
    [
      "06 — Product Decisions",
      nexoraProject.ai
    ],
    [
      "07 — Project Stack",
      nexoraProject.tools
    ],
    [
      "09 — Validation",
      nexoraProject.result
    ],
    [
      "10 — Current Status",
      nexoraProject.status
    ]
  ],
  "features": nexoraProject.highlights,
  "gallery": [
    {
      "label": "NEXORA actual application capture inside a laptop mockup",
      "src": "/nexora-laptop-poster.jpg"
    },
    {
      "label": "NEXORA dashboard with fictional demonstration records",
      "src": "/nexora-case-dashboard.png"
    },
    {
      "label": "NEXORA contacts and leads in the isolated demo workspace",
      "src": "/nexora-case-crm.png"
    },
    {
      "label": "NEXORA product and stock records using fictional items",
      "src": "/nexora-case-inventory.png"
    },
    {
      "label": "NEXORA sales ledger with linked invoice balances",
      "src": "/nexora-case-sales.png"
    },
    {
      "label": "NEXORA profit and loss report calculated from demo transactions",
      "src": "/nexora-case-finance.png"
    },
    {
      "label": "NEXORA recorded stock movement history",
      "src": "/nexora-case-stock-history.png"
    },
    {
      "label": "NEXORA saved invoice preview for a fictional customer",
      "src": "/nexora-case-invoice.png"
    }
  ]
};

type CaseStudy = (typeof caseStudies)[number];

const autoIdProblemSteps = [
  "Customers",
  "Stock",
  "Sales",
  "Payments",
  "Reports"
];

const autoIdSolutionSteps = [
  [
    "01",
    "Set Up"
  ],
  [
    "02",
    "Connect"
  ],
  [
    "03",
    "Record"
  ],
  [
    "04",
    "Reconcile"
  ],
  [
    "05",
    "Review"
  ]
];

function getAutoIdImageFrameClass(image: string) {
  if (image.includes("nexora-laptop-poster")) {
    return "autoid-frame-wide";
  }

  if (image.includes("nexora-case-dashboard")) {
    return "autoid-frame-standard autoid-frame-small-overview";
  }

  if (image.includes("nexora-case-inventory")) {
    return "autoid-frame-standard autoid-frame-small-template";
  }

  if (image.includes("nexora-case-stock-history")) {
    return "autoid-frame-standard autoid-frame-small-account";
  }

  return "autoid-frame-standard";
}

const autoIdWalkthrough = [
  {
    "title": "Business Setup & Dashboard",
    "statement": "Start with a business identity. Keep the context visible.",
    "copy": "Owners configure the business name, reporting currency, country, timezone, modules and dashboard widgets before recording activity. The overview brings recognised revenue, gross profit, net profit or loss, customer receipts, relationships, stock status and due follow-ups into one workspace. Financial charts follow the selected reporting period; stock, relationships and receivables are current snapshots. Source links connect summary figures to the records behind them, so a business owner can move from an overview to the next relevant action.",
    "image": "/nexora-case-dashboard.png",
    "tags": [],
    "size": "large"
  },
  {
    "title": "CRM & Customer Follow-ups",
    "statement": "Keep the relationship and its next action together.",
    "copy": "Leads and customers share searchable contact records with a name, company and available email or phone details. Follow-ups connect a saved relationship to a task, due date and priority, with clear completion states and editable message drafts. Reviewed CSV imports let users inspect incoming contact data before committing it; a workspace-scoped website-intake connection supports backend-submitted enquiries. The relationship, its history and the next action remain available in the same business context, helping an operator decide whom to contact and what needs attention.",
    "image": "/nexora-case-crm.png",
    "tags": [
      "Leads & contacts",
      "Due follow-ups",
      "Reviewed imports"
    ],
    "size": "split"
  },
  {
    "title": "Products, Stock & Movement History",
    "statement": "Every quantity change should have an explanation.",
    "copy": "Each product has a SKU, selling price, recorded unit cost, opening quantity and reorder threshold. Receipts and adjustments are recorded as stock movements with reasons and a retained history. Completing a sale reduces available stock; returns restore the relevant quantities and recorded costs. Weighted-average inventory valuation connects stock value to its recorded cost rather than an assumed balance. Low-stock indicators compare actual quantities against configured thresholds, while transaction and concurrency safeguards protect the stock record when requests compete or are retried.",
    "image": "/nexora-case-inventory.png",
    "tags": [
      "Products & SKUs",
      "Receipts & adjustments",
      "Traceable stock ledger"
    ],
    "size": "feature"
  },
  {
    "title": "Sales, Invoices & Payment Records",
    "statement": "A draft, a completed sale and a payment mean different things.",
    "copy": "A draft sale can be reviewed before it affects stock or recognised revenue. Completion commits the stock reduction, cost snapshot, linked invoice and sale status together. Partial and full payment records reconcile against the invoice and keep the outstanding balance visible. Returns, refunds and reversals are separate operations because goods and cash affect different records. Invoice previews use saved customer, item and business details. Original PDF or image invoices can be stored and reviewed into a draft; uploading alone does not post a transaction or perform automatic OCR. Payment entries are bookkeeping records, not live money transfers.",
    "image": "/nexora-case-sales.png",
    "tags": [],
    "size": "split reverse"
  },
  {
    "title": "Financial Reporting & Grounded Signals",
    "statement": "Separate what the business earned from what it received.",
    "copy": "Profit and loss combines recognised sales, returns, recorded cost of goods and operating expenses within explicit reporting dates. Customer receipts and invoice debt remain separate, so receiving a later payment does not recognise the same sale twice. Decimal-safe calculations and configured currency precision support consistent totals. NEXORA Intelligence links period profit, low-stock positions and due follow-ups to their recorded sources. These deterministic business rules help an owner understand what changed, inspect the underlying record and choose the next action; the demonstrated signals are derived from saved activity rather than AI forecasts.",
    "image": "/nexora-case-finance.png",
    "tags": [],
    "size": "large"
  }
];

const autoIdSupportingScreens = [
  {
    "title": "A Traceable Stock Ledger",
    "image": "/nexora-case-stock-history.png"
  },
  {
    "title": "A Saved Invoice, Reconciled",
    "image": "/nexora-case-invoice.png"
  }
];

function AutoIdScrollParallax() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cursorRef = useRef({ x: 0, y: 0 });

  const updateParallax = useCallback(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      return;
    }

    const scrollParent = section.closest(".case-modal-scroll") as HTMLElement | null;
    const viewportHeight = scrollParent?.clientHeight ?? window.innerHeight;
    const rect = section.getBoundingClientRect();
    const parentRect = scrollParent?.getBoundingClientRect();
    const viewportTop = parentRect?.top ?? 0;
    const sectionMidpoint = rect.top - viewportTop + rect.height / 2;
    const progress = (sectionMidpoint - viewportHeight / 2) / viewportHeight;
    const scrollShift = Math.max(-1, Math.min(1, progress));
    const { x, y } = cursorRef.current;

    section.style.setProperty("--layer-one-x", `${scrollShift * -70 + x * -18}px`);
    section.style.setProperty("--layer-one-y", `${scrollShift * 18 + y * -10}px`);
    section.style.setProperty("--layer-two-x", `${scrollShift * 84 + x * 24}px`);
    section.style.setProperty("--layer-two-y", `${scrollShift * -22 + y * 12}px`);
    section.style.setProperty("--layer-three-x", `${scrollShift * -46 + x * -14}px`);
    section.style.setProperty("--layer-three-y", `${scrollShift * 12 + y * 8}px`);
    section.style.setProperty("--content-x", `${x * 10}px`);
    section.style.setProperty("--content-y", `${scrollShift * -14 + y * 7}px`);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const scrollParent = section.closest(".case-modal-scroll") as HTMLElement | null;
    const scrollTarget = scrollParent ?? window;

    updateParallax();
    scrollTarget.addEventListener("scroll", updateParallax, { passive: true });
    window.addEventListener("resize", updateParallax);

    return () => {
      scrollTarget.removeEventListener("scroll", updateParallax);
      window.removeEventListener("resize", updateParallax);
    };
  }, [updateParallax]);

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const section = event.currentTarget;
    const rect = section.getBoundingClientRect();

    cursorRef.current = {
      x: (event.clientX - rect.left) / rect.width - 0.5,
      y: (event.clientY - rect.top) / rect.height - 0.5,
    };
    updateParallax();
  };

  const handlePointerLeave = () => {
    cursorRef.current = { x: 0, y: 0 };
    updateParallax();
  };

  return (
    <section
      aria-label="NEXORA retail workflow transition"
      className="autoid-scroll-parallax"
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      ref={sectionRef}
    >
      <div className="autoid-parallax-layer layer-one">RECORDS</div>
      <div className="autoid-parallax-layer layer-two">WORKSPACE</div>
      <div className="autoid-parallax-layer layer-three">REPORTS</div>
      <div className="autoid-parallax-content">
        <span>Workflow Shift</span>
        <strong>One record connects to the next.</strong>
        <p>From a customer conversation to stock, sale, payment and a clearer report.</p>
      </div>
    </section>
  );
}

function AutoIdStudioCaseStudy() {
  return (
    <div className="autoid-case">
      <header className="autoid-hero">
        <p className="eyebrow">01 / Product Strategy + Workflow Design</p>
        <h2 id="case-modal-title">
          <span>NEXORA AI OS</span>
          <span>A Connected</span>
          <span>Retail Workspace</span>
        </h2>
        <p>
          An independent desktop product connecting customer relationships, inventory movements and retail transactions with a clearer view of business performance.
        </p>
        <div className="autoid-meta">
          <div>
            <span>Role</span>
            <p>Independent Product Builder</p>
          </div>
          <div>
            <span>Type</span>
            <p>Functional Local Retail Application</p>
          </div>
          <div>
            <span>Focus</span>
            <p>Product Thinking + Connected Workflows</p>
          </div>
        </div>
      </header>

      <section className="autoid-section autoid-problem">
        <p className="eyebrow">02 — The Problem</p>
        <h3>Business records need to tell the same story.</h3>
        <p>
          A retail operator needs to know what is available, what has been sold, which customer needs a follow-up and what remains unpaid. When those records are disconnected, the wider business picture becomes harder to explain. NEXORA began with a product question: how could the essential work of a small retail business share one clear, traceable context?
        </p>
        <div className="autoid-flow compact">
          {autoIdProblemSteps.map((step, index) => (
            <div key={step}>
              <span>{step}</span>
              {index < autoIdProblemSteps.length - 1 ? <b>→</b> : null}
            </div>
          ))}
        </div>
        <strong>Understand the record. Understand its effect on the business.</strong>
      </section>

      <section className="autoid-section autoid-two-col">
        <div>
          <p className="eyebrow">03 — The Idea</p>
          <h3>Build around the business journey, one state at a time.</h3>
        </div>
        <p>
          The product is designed for small-business owners and retail operators managing customers, products and sales. I focused the experience on a connected journey: establish the workspace, maintain relationships and stock, review a draft sale, complete it, reconcile receipts and understand the resulting report. Clear states make the effect of each action visible; business and workspace identity stay in view as users navigate.
        </p>
      </section>

      <section className="autoid-section autoid-solution">
        <p className="eyebrow">04 — The Solution</p>
        <h3>A connected workspace, backed by recorded activity.</h3>
        <p>
          NEXORA brings CRM, follow-ups, inventory, sales, invoices, manual payment records, expenses and reporting into one local application. Its Next.js and React interface uses TypeScript; NestJS services connect through Prisma to PostgreSQL. Server-side tenant, organisation, workspace and membership checks keep records in the correct business context. Retry keys, atomic transactions and stock-concurrency checks help preserve the relationship between a request and its resulting records.
        </p>
        <div className="autoid-flow steps">
          {autoIdSolutionSteps.map(([number, step], index) => (
            <div key={step}>
              <small>{number}</small>
              <span>{step}</span>
              {index < autoIdSolutionSteps.length - 1 ? <b>→</b> : null}
            </div>
          ))}
        </div>
      </section>

      <AutoIdScrollParallax />

      <section className="autoid-section autoid-walkthrough">
        <p className="eyebrow">05 — Product Walkthrough</p>
        <h3>The retail journey, explained screen by screen.</h3>
        <p>Actual NEXORA screens, captured in an isolated workspace with fictional demonstration records.</p>
        <div className="autoid-walkthrough-list">
          {autoIdWalkthrough.map((item) => (
            <article className={`autoid-feature ${item.size}`} key={item.title}>
              <div className="autoid-feature-copy">
                <h4>{item.title}</h4>
                <strong>{item.statement}</strong>
                <p>{item.copy}</p>
                {item.tags.length ? (
                  <div className="autoid-tags">
                    {item.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                ) : null}
              </div>
              <div
                className={`autoid-feature-image ${getAutoIdImageFrameClass(
                  item.image,
                )}`}
              >
                <img src={item.image} alt={`Actual NEXORA ${item.title} screen with fictional demonstration data`} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="autoid-section autoid-supporting">
        <p className="eyebrow">06 — Details Behind the Workflow</p>
        <div className="autoid-support-grid">
          {autoIdSupportingScreens.map((screen) => (
            <article key={screen.title}>
              <h4>{screen.title}</h4>
              <div
                className={`autoid-support-image ${getAutoIdImageFrameClass(
                  screen.image,
                )}`}
              >
                <img src={screen.image} alt={`Actual NEXORA preview: ${screen.title}; fictional demonstration data`} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="autoid-section autoid-role-ai">
        <div>
          <span>My Role</span>
          <ul>
            <li>Defined the product concept and retail problem</li>
            <li>Planned workflows, states and feature priorities</li>
            <li>Refined the interface and information hierarchy</li>
            <li>Directed feature priorities and implementation requirements</li>
            <li>Reviewed behaviour with synthetic business records</li>
            <li>Iterated on clarity, consistency and project scope</li>
          </ul>
        </div>
        <div>
          <span>Product Development</span>
          <ul>
            <li>Translated business needs into feature requirements</li>
            <li>Refined interface behaviour and workflow states</li>
            <li>Reviewed connected records and business rules</li>
            <li>Explored test scenarios and edge cases</li>
            <li>Evaluated and refined successive product iterations</li>
          </ul>
        </div>
        <strong>
          I shaped NEXORA around clear requirements, connected workflows and consistent business records. My contribution focused on product direction, feature priorities, interface clarity and iterative review.
        </strong>
      </section>

      <section className="autoid-outcome">
        <h3>From a business idea to a demonstrable retail product.</h3>
        <p>The result is a functional local application whose customer, stock, sale, payment and reporting records connect. Its most important product decisions are explicit: drafts do not post stock, receipts are distinct from revenue, and every stock movement retains a history.</p>
        <div>
          <article>
            <span>Connected Product</span>
            <p>Business setup, CRM, follow-ups, stock, sales, invoices, recorded payments, expenses and operational reports.</p>
          </article>
          <article>
            <span>Documented Verification</span>
            <p>Repository evidence covers source checks, real database/API workflows, encrypted backup restoration and controlled browser acceptance with disposable data.</p>
          </article>
          <article>
            <span>Current Stage</span>
            <p>A local retail application. Public hosting, signed standalone Windows delivery and external-provider acceptance remain future release milestones.</p>
          </article>
        </div>
        <p>The current release focuses on connected retail records and operational visibility. Broader purchasing, complete cash-flow accounting and live integrations are future extensions of that foundation.</p>
      </section>
    </div>
  );
}

const shopifyProcessSteps = [
  [
    "01",
    "Enquiry"
  ],
  [
    "02",
    "Organise"
  ],
  [
    "03",
    "Define"
  ],
  [
    "04",
    "Review"
  ],
  [
    "05",
    "Execute"
  ],
  [
    "06",
    "Audit"
  ]
];

const shopifyGallery = [
  {
    "title": "01 / Workspace & Operational Overview",
    "image": "/ai-operations-case-dashboard.png",
    "copy": "The journey begins with an account, local verification and workspace onboarding. Business records belong to the selected organisation and workspace, with server-side membership and role checks governing access. The dashboard brings saved leads, conversations, follow-ups and review activity into one operational context. Counts reflect the records available in that workspace, and clear empty, loading and unavailable states keep the interface understandable as data changes. The demonstrated environment uses fictional records in a separate disposable database."
  },
  {
    "title": "02 / Leads, Conversations & Follow-ups",
    "image": "/ai-operations-case-leads.png",
    "copy": "An enquiry becomes a saved lead with contact details, company, source, priority and status. Conversations retain the context needed to understand the relationship; follow-ups turn the next action into an explicit task. Search, filters and detail views help an operator move between the list and the underlying record. Changes persist through the application API in the selected workspace. These connected records support a deliberate handoff from an incoming question to an accountable next step, while customer communication remains a separate integration milestone."
  },
  {
    "title": "03 / Workflow Policy & Human Review",
    "image": "/ai-operations-case-workflows.png",
    "copy": "Manual workflows define a controlled action before it runs. Saved versions preserve the definition associated with an execution, so a later edit does not rewrite its history. Policy determines whether a request is allowed, blocked or sent for review. When approval is required, the request waits for an authorised person to approve or reject it. This makes a key product distinction visible: proposing an action, granting permission and completing execution are separate states, each with its own responsibility and record."
  },
  {
    "title": "04 / Execution, Notifications & Activity",
    "image": "/ai-operations-case-activity.png",
    "copy": "Approved internal work moves through a transactional outbox to a supervised background worker. The application records execution states and supports retry and recovery checks without treating a repeated request as a new business action. A successful internal-notification workflow creates an in-product notification; the Activity view retains the trace from the initiating request through the recorded outcome. The demonstrated result is an internal controlled action. Live AI-provider processing and externally delivered email or WhatsApp messages remain outside this release."
  }
];

const shopifyCapabilities = [
  "Authentication & onboarding",
  "Workspace-scoped leads",
  "Saved conversations",
  "Follow-up records",
  "Search & filters",
  "Versioned manual workflows",
  "Explicit policy outcomes",
  "Human approval & rejection",
  "Transactional outbox",
  "Supervised background worker",
  "Internal notifications",
  "Traceable activity records"
];

function ShopifyCaseStudy() {
  return (
    <div className="autoid-case shopify-case">
      <header className="autoid-hero shopify-hero">
        <p className="eyebrow">02 / Business Operations + Workflow Design</p>
        <h2 id="case-modal-title">
          <span>AI Operations</span>
          <span>From Enquiry</span>
          <span>To Accountable Action</span>
        </h2>
        <p>
          A local business application connecting enquiries, conversations, follow-ups and controlled internal workflows, with a clear record of the decisions behind each action.
        </p>
        <div className="autoid-meta">
          <div>
            <span>Role</span>
            <p>Independent Product Builder</p>
          </div>
          <div>
            <span>Type</span>
            <p>Functional Local Business Application</p>
          </div>
          <div>
            <span>Focus</span>
            <p>Operational Clarity + Human Control</p>
          </div>
        </div>
      </header>

      <section className="autoid-section autoid-two-col shopify-intro">
        <div>
          <p className="eyebrow">01 — Overview</p>
          <h3>One enquiry. A clear next step. A traceable outcome.</h3>
        </div>
        <p>
          AI Operations Platform is my independent product for small B2B teams coordinating the journey from an incoming enquiry to a reviewed operational action. Leads, conversations and follow-ups preserve relationship context; manual workflows, policies and approvals govern what happens next. A Next.js interface connects to NestJS services, with Prisma and PostgreSQL storing business records. The working local application includes authentication, workspace onboarding, operational record management and an internal execution path supported by a background worker, notifications and activity history.
        </p>
      </section>

      <section className="autoid-section shopify-challenge">
        <p className="eyebrow">02 — Challenge + Approach</p>
        <h3>Keep the handoff. Keep the context.</h3>
        <p>
          A team needs more than a list of enquiries: it needs to understand who is involved, what has been discussed, which follow-up is due and whether an action has permission to proceed. I organised the product around those transitions. Relationship records make the context visible; explicit workflow states separate a request from its approval and execution. Server-verified workspace context keeps records in the right business, immutable versions preserve the definition used for each run, and activity records explain the result. The central product principle is clear: policy controls the path, people review consequential actions and the application records what actually happened.
        </p>
        <div className="autoid-flow steps shopify-flow">
          {shopifyProcessSteps.map(([number, step], index) => (
            <div key={step}>
              <small>{number}</small>
              <span>{step}</span>
              {index < shopifyProcessSteps.length - 1 ? <b>→</b> : null}
            </div>
          ))}
        </div>
      </section>

      <section className="autoid-section shopify-gallery-section">
        <p className="eyebrow">03 — Product Walkthrough</p>
        <h3>The operational journey, screen by screen.</h3>
        <div className="shopify-gallery-grid">
          {shopifyGallery.map((item, index) => (
            <article
              className={`shopify-gallery-card ${
                index === shopifyGallery.length - 1 ? "wide" : ""
              }`}
              key={item.title}
            >
              <div className="shopify-gallery-media">
                <img src={item.image} width={1894} height={1056} alt={`Actual AI Operations Platform screen: ${item.title}; fictional demonstration data`} />
              </div>
              <div className="shopify-gallery-copy">
                <h4>{item.title}</h4>
                <p>{item.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="autoid-section autoid-role-ai shopify-role-ai">
        <div>
          <span>My Role</span>
          <ul>
            <li>Defined the business problem and product direction</li>
            <li>Mapped enquiry, follow-up and review journeys</li>
            <li>Prioritised workflow states and feature requirements</li>
            <li>Reviewed interface behaviour and connected records</li>
            <li>Refined clarity through successive product iterations</li>
            <li>Documented implemented scope and release priorities</li>
          </ul>
        </div>
        <div>
          <span>Tools / Platform</span>
          <ul>
            <li>Next.js</li>
            <li>NestJS</li>
            <li>Prisma</li>
            <li>PostgreSQL</li>
            <li>TypeScript + React</li>
          </ul>
        </div>
        <strong>
          I focused the product on operational clarity: preserve the context, make permission explicit and keep the outcome traceable.
        </strong>
      </section>

      <section className="autoid-section shopify-capabilities">
        <p className="eyebrow">04 — Key Capabilities</p>
        <div>
          {shopifyCapabilities.map((capability) => (
            <span key={capability}>{capability}</span>
          ))}
        </div>
      </section>

      <section className="autoid-outcome shopify-outcome">
        <h3>A connected journey, with decisions you can trace.</h3>
        <p>
          The result is a functional local application connecting saved operational records with a controlled internal workflow. Repository evidence documents PostgreSQL/API scenarios, browser journeys and worker recovery checks. The portfolio demonstration uses a separate database and fictional records to show the current product directly. Its next release priorities are a verified hosted environment, real authentication-email delivery and carefully scoped external integrations; live AI processing and customer-message delivery are future capabilities.
        </p>
        <div>
          <article>
            <span>Connected Workspace</span>
            <p>Authentication, onboarding, leads, conversations and follow-ups with persisted workspace records.</p>
          </article>
          <article>
            <span>Controlled Execution</span>
            <p>Versioned workflows, policy, approval, queued internal work, notifications and activity history.</p>
          </article>
          <article>
            <span>Next Steps</span>
            <p>Hosted release checks, verified email delivery and one focused external integration at a time.</p>
          </article>
        </div>
      </section>
    </div>
  );
}


export default function ProjectCaseModal({ activeCase, isClosing, closeModal, onNext, returnLabel = "Work" }: {
  activeCase: CaseStudy;
  isClosing: boolean;
  closeModal: () => void;
  onNext: (project: CaseStudy) => void;
  returnLabel?: string;
}) {
  const modalRef = useRef<HTMLElement>(null);
  const modalScrollRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(closeModal);
  useEffect(() => { closeRef.current = closeModal; }, [closeModal]);
  useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // The portal is a body child, so inert applies only to the background page.
    const overlay = modalRef.current?.parentElement;
    const siblings = [...document.body.children].filter((node): node is HTMLElement => node instanceof HTMLElement && node !== overlay);
    const previous = siblings.map(node => node.inert);
    siblings.forEach(node => { node.inert = true; });
    const frame = requestAnimationFrame(() => modalRef.current?.focus());
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); closeRef.current(); }
      if (event.key !== "Tab") return;
      const items = [...(modalRef.current?.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea, [tabindex="0"]') ?? [])].filter(node => node.getClientRects().length > 0);
      const first = items[0], last = items[items.length - 1];
      if (!first || !last) { event.preventDefault(); return; }
      if (event.shiftKey && (document.activeElement === first || document.activeElement === modalRef.current)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || document.activeElement === modalRef.current)) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", keydown);
    return () => {
      cancelAnimationFrame(frame); window.removeEventListener("keydown", keydown);
      document.body.style.overflow = overflow;
      siblings.forEach((node, index) => { node.inert = previous[index]; });
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, []);
  useEffect(() => {
    if (modalScrollRef.current) modalScrollRef.current.scrollTop = 0;
    modalRef.current?.focus({ preventScroll: true });
  }, [activeCase.id]);
  const activeIndex = activeCase
    ? caseStudies.findIndex((item) => item.id === activeCase.id)
    : -1;
  const nextCase =
    activeIndex >= 0 ? caseStudies[(activeIndex + 1) % caseStudies.length] : null;
  const activeModalSections =
    activeCase?.id === "ai-assisted-development"
      ? autoIdStudioModal.sections
      : activeCase?.id === "e-commerce"
        ? [
            ["01 — Overview", activeCase.overview],
            ["02 — The Challenge", activeCase.problem],
            ["03 — The Approach", activeCase.idea],
            ["04 — The Solution", activeCase.solution],
            ["05 — My Role", activeCase.role],
            ["06 — Development Approach", activeCase.ai],
            ["07 — Tools Used", activeCase.tools],
            [
              "09 — Process",
              "Enquiry → Conversation → Follow-up → Policy → Human Review → Internal Execution → Activity",
            ],
            ["10 — Final Result", activeCase.result],
          ]
      : activeCase
        ? [
            ["01 — Overview", activeCase.overview],
            ["02 — The Problem", activeCase.problem],
            ["03 — The Idea", activeCase.idea],
            ["04 — The Solution", activeCase.solution],
            ["05 — My Role", activeCase.role],
            ["06 — Development Approach", activeCase.ai],
            ["07 — Tools Used", activeCase.tools],
            [
              "09 — Process",
              "Idea → Plan → Build with AI → Debug → Test → Improve",
            ],
            ["10 — Final Result", activeCase.result],
          ]
        : [];
  const activeModalFeatures =
    activeCase?.id === "ai-assisted-development"
      ? autoIdStudioModal.features
      : activeCase?.id === "e-commerce"
        ? activeCase.highlights
      : activeCase?.highlights ?? [];
  const activeGallery =
    activeCase?.id === "ai-assisted-development"
      ? autoIdStudioModal.gallery
      : activeCase?.gallery ?? (activeCase
        ? [
            { label: `${activeCase.category} large preview`, src: activeCase.image },
            { label: `${activeCase.category} detail preview`, src: activeCase.image },
            { label: `${activeCase.category} alternate preview`, src: activeCase.image },
          ]
        : []);

  return createPortal(
        <div
          className="case-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="case-modal-title"
          data-state={isClosing ? "closing" : "open"}
          onMouseDown={closeModal}
        >
          <article
            className="case-modal"
            ref={modalRef}
            tabIndex={-1}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="case-modal-topbar">
              <span>Case Study</span>
              <button type="button" onClick={closeModal}>
                Close ×
              </button>
            </div>
            <button
              className="case-modal-x"
              type="button"
              aria-label="Close case study"
              onClick={closeModal}
            >
              ×
            </button>

            <div className="case-modal-scroll" ref={modalScrollRef}>
              {activeCase.id === "ai-assisted-development" ? (
                <AutoIdStudioCaseStudy />
              ) : activeCase.id === "e-commerce" ? (
                <ShopifyCaseStudy />
              ) : (
                <>
                  <header className="case-modal-header">
                    <p className="eyebrow">{activeCase.category.replace("—", "/")}</p>
                    <h2 id="case-modal-title">
                      {activeCase.title.split("\n").map((line) => (
                        <span key={line}>{line}</span>
                      ))}
                    </h2>
                    <p>{activeCase.sentence}</p>
                    <button
                      className="case-modal-close"
                      type="button"
                      onClick={closeModal}
                    >
                      Close ×
                    </button>
                    <div className="case-modal-meta">
                      <div>
                        <span>My Role</span>
                        <p>{activeCase.role}</p>
                      </div>
                      <div>
                        <span>Tools / Platform</span>
                        <p>{activeCase.tools}</p>
                      </div>
                      <div>
                        <span>Status / Type</span>
                        <p>{activeCase.status}</p>
                      </div>
                    </div>
                  </header>

                  <div className="case-modal-body">
                    {activeModalSections.map(([heading, copy]) => (
                      <section className="case-modal-section" key={heading}>
                        <span>{heading}</span>
                        <p>{copy}</p>
                      </section>
                    ))}

                    <section className="case-modal-section case-modal-features">
                      <span>08 — Key Features</span>
                      <ul>
                        {activeModalFeatures.map((highlight) => (
                          <li key={highlight}>{highlight}</li>
                        ))}
                      </ul>
                    </section>

                    <section className={`case-modal-gallery${activeCase.gallery ? " portfolio-capture-gallery" : ""}`}>
                      <span>11 — Project Gallery</span>
                      {activeCase.gallery && activeCase.cardMedia ? (
                        <div className="gallery-large"><video src={activeCase.cardMedia} poster={activeCase.poster} aria-label={activeCase.thumbnailAlt} controls muted playsInline preload="metadata" tabIndex={0} /></div>
                      ) : activeGallery[0] ? (
                        <div className="gallery-large">
                          <img src={activeGallery[0].src} alt={activeGallery[0].label} />
                        </div>
                      ) : null}
                      <div className="gallery-pair">
                        {(activeCase.gallery ? activeGallery : activeGallery.slice(1)).map((image) => (
                          <div key={image.label}>
                            <img src={image.src} alt={image.label} width={activeCase.gallery ? 1920 : undefined} height={activeCase.gallery ? 1080 : undefined} loading="lazy" />
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                </>
              )}

              <footer className="case-modal-footer">
                <button type="button" onClick={closeModal}>
                  ← Back to {returnLabel}
                </button>
                {nextCase ? (
                  <button
                    type="button"
                    onClick={() => {
                      onNext(nextCase);
                    }}
                  >
                    Next Case Study →
                  </button>
                ) : null}
              </footer>
            </div>
          </article>
        </div>, document.body);
}
