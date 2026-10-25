import { Footer, Header } from "../components/SiteShell";

export default function ResumePage() {
  return (
    <>
      <Header />
      <main className="page-main resume-page resume-minimal-page resume-viewer-page">
        <section id="resume-preview" className="resume-preview-section" aria-labelledby="resume-title">
          <h1 id="resume-title" className="resume-viewer-kicker">Anchal Sharma / Resume</h1>
          <div className="resume-paper-wrap">
            <p className="resume-viewer-document-label">AI Product Builder | AI Solutions | Product Management</p>
            <div className="resume-paper">
              <iframe
                src="/assets/anchal-sharma-resume.pdf#view=FitH"
                title="Anchal Sharma resume"
                style={{ aspectRatio: "210 / 297", height: "auto" }}
              />
            </div>
          </div>
          <div className="resume-viewer-actions">
            <a className="button primary" href="/assets/anchal-sharma-resume.pdf" download="Anchal-Sharma-Resume.pdf">
              Download Resume PDF
            </a>
            <a className="resume-viewer-open" href="/assets/anchal-sharma-resume.pdf" target="_blank" rel="noopener noreferrer">
              Open PDF in a new tab ↗
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
