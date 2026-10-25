import { Footer, Header } from "../components/SiteShell";
import { BusinessJourney } from "./BusinessJourney";

export default function BusinessPage() {
  return <>
    <Header />
    <main className="page-main business-page business-scroll-page">
      <section className="business-intro" aria-labelledby="business-title">
        <div className="business-intro-meta" aria-hidden="true"><span>Business / 01</span><span>Business thinking</span></div>
        <div className="business-intro-copy">
          <p className="eyebrow">Business / 01</p>
          <h1 id="business-title">I ask what<br />works.<br />Then <em>build.</em></h1>
          <p>Business-focused product thinking<br />through independent projects.</p>
        </div>
        <div className="business-intro-signals" aria-label="Business focus">
          <p>Business product interests</p>
          <span>Retail workflows</span><small>Customers · Stock · Sales · Reporting</small>
          <i>−</i>
          <span>Enquiries<br />Operations</span><small>Conversations · Follow-ups · Human review</small>
          <small className="business-intro-summary">Purpose · People · Workflows · Decisions · Products</small>
        </div>
        <p className="business-intro-scroll" aria-hidden="true">Scroll to explore <i>↓</i></p>
      </section>
      <BusinessJourney />
    </main>
    <Footer />
  </>;
}
