import { Footer, Header } from "../components/SiteShell";
import AboutTypography from "./AboutTypography";
import { IdeaPullTransition } from "./IdeaPullTransition";

const worlds = [
  {
    number: "01",
    action: "Build",
    title: "AI-Assisted Building",
    copy: "Websites · Apps · Tools · Prototypes",
  },
  {
    number: "02",
    action: "Create",
    title: "Interface Thinking",
    copy: "Structure · Clarity · Usability · Flow",
  },
  {
    number: "03",
    action: "Operate",
    title: "Business Workflows",
    copy: "Enquiries · Records · Reviews · Actions",
  },
  {
    number: "04",
    action: "Run",
    title: "Business",
    copy: "Products · Problems · Value · Decisions",
  },
];

const process = ["Idea", "Build", "Break", "Solve", "Improve", "Ship"];

const education = [
  {
    year: "Expected 2027",
    title: "Computer Science Engineering",
    place: "Rayat Bahra University, Mohali",
  },
  {
    year: "2021–2022",
    title: "12th PCM",
    place: "",
  },
];

const languages = [
  { name: "Punjabi", level: "Native" },
  { name: "Hindi", level: "Fluent" },
  { name: "English", level: "Professional Working Proficiency" },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="page-main about-page">
        <AboutTypography />

        <IdeaPullTransition />

        <section className="about-worlds about-section">
          <div className="about-section-head">
            <p className="eyebrow">02 / How I Move</p>
            <h2>Build. Create. Operate. Run.</h2>
          </div>

          <div className="about-world-grid">
            {worlds.map((world) => (
              <article key={world.action} className="about-world-card">
                <span>{world.number}</span>
                <strong>{world.action}</strong>
                <h3>{world.title}</h3>
                <p>{world.copy}</p>
                <b aria-hidden="true">↗</b>
              </article>
            ))}
          </div>
        </section>

        <section className="about-learning about-section">
          <div>
            <p className="eyebrow">03 / How I Learn</p>
            <h2>
              I learn
              <br />
              by making.
            </h2>
          </div>
          <div>
            <p>
              I learn through independent projects: defining requirements, exploring
              workflows, checking behaviour and refining the result.
            </p>
            <div className="about-process" aria-label="Learning process">
              {process.map((step) => (
                <div className={step === "Build" ? "is-ai-step" : ""} key={step}>
                  <strong>{step}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="about-story-panel about-section">
          <div>
            <p className="eyebrow">04 / My Story</p>
            <h2>
              More than
              <br />
              technology.
            </h2>
          </div>
          <div className="about-story-copy">
            <p>
              I’m Anchal Sharma, a B.Tech Computer Science Engineering student with
              expected graduation in 2027 and an interest in business technology. My work includes NEXORA AI OS,
              AI Operations Platform and this personal portfolio.
            </p>
            <p>
              I focus on what a product does, who it serves and what still needs improvement.
            </p>
          </div>
        </section>

        <section className="about-marquee" aria-label="Still learning statement">
          <div className="about-marquee-track">
            {Array.from({ length: 2 }).map((_, index) => (
              <div className="about-marquee-group" aria-hidden={index === 1} key={index}>
                <span>I&apos;m still learning.</span>
                <b>✦</b>
                <span>Still building.</span>
                <b>✦</b>
                <span>Still making.</span>
                <b>✦</b>
              </div>
            ))}
          </div>
        </section>

        <section className="about-education about-section">
          <div className="education-intro">
            <div>
              <p className="eyebrow">05 / Education</p>
              <h2>
                Where I
                <br />
                learn.
              </h2>
            </div>
            <p>
              Formal learning gives me the foundation. Building gives me the
              application.
            </p>
          </div>

          <div className="education-timeline">
            {education.map((item) => (
              <article key={item.title}>
                <span>{item.year}</span>
                <h3>{item.title}</h3>
                {item.place ? <p>{item.place}</p> : null}
              </article>
            ))}
          </div>

        </section>

        <section className="about-languages about-section" aria-label="Languages and communication">
          <p className="eyebrow">Languages / Communication</p>
          <div className="language-strip">
            {languages.map((language) => (
              <article key={language.name}>
                <strong>{language.name}</strong>
                <span>{language.level}</span>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
