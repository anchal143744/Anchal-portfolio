import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer, Header } from "../../components/SiteShell";
import { getProjectBySlug, isVideoSource, portfolioProjects } from "../../data/projects";

type ProjectDetailProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return portfolioProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project | Anchal Sharma",
    };
  }

  return {
    title: project.shortTitle + " | Anchal Sharma",
    description: project.featuredDescription,
  };
}

function ProjectDetailMedia({ src, alt, poster }: { src: string; alt: string; poster?: string }) {
  if (isVideoSource(src)) {
    return <video src={src} poster={poster} style={poster ? { objectFit: "contain" } : undefined} aria-label={alt} muted playsInline loop controls preload="metadata" />;
  }

  return <img src={src} alt={alt} loading="eager" />;
}

export default async function ProjectDetailPage({ params }: ProjectDetailProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const mediaSrc = project.cardMedia ?? project.image;
  const detailSections = [
    ["Overview", project.overview],
    ["Challenge", project.problem],
    ["Approach", project.idea],
    ["Solution", project.solution],
    [project.id === "ai-assisted-development" ? "Product Decisions" : "Development Approach", project.ai],
    ["Final Result", project.result],
  ];

  return (
    <>
      <Header />
      <main className="project-detail-page">
        <section className="project-detail-hero">
          <div className="project-detail-copy">
            <Link className="back-link" href="/work">
              ← Back to Work
            </Link>
            <p className="home-eyebrow">{project.category}</p>
            <h1>
              {project.title.split("\n").map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h1>
            <p>{project.sentence}</p>
          </div>
          <div className="project-detail-media">
            <ProjectDetailMedia src={mediaSrc} alt={project.thumbnailAlt} poster={project.poster} />
          </div>
        </section>

        <section className="project-detail-meta" aria-label="Project metadata">
          <article>
            <span>My Role</span>
            <p>{project.role}</p>
          </article>
          <article>
            <span>Tools / Platform</span>
            <p>{project.tools}</p>
          </article>
          <article>
            <span>Status / Type</span>
            <p>{project.status}</p>
          </article>
        </section>

        <section className="project-detail-body">
          {detailSections.map(([heading, copy]) => (
            <article key={heading}>
              <span>{heading}</span>
              <p>{copy}</p>
            </article>
          ))}
        </section>

        <section className="project-detail-highlights">
          <div>
            <p className="home-eyebrow">Key Highlights</p>
            <h2>What this project covers.</h2>
          </div>
          <ul>
            {project.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </section>

        {project.gallery ? <section className="project-detail-captures portfolio-capture-gallery" aria-label="Actual portfolio page screenshots">
          <p className="home-eyebrow">Inside the portfolio</p>
          <div className="gallery-pair">{project.gallery.map((image) => <figure key={image.src}><img src={image.src} alt={image.label} width="1920" height="1080" loading="lazy" /><figcaption>{image.label}</figcaption></figure>)}</div>
        </section> : null}

        <section className="project-detail-next">
          <Link href="/work">View all projects ↗</Link>
          <Link href="/contact">Start a conversation ↗</Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
