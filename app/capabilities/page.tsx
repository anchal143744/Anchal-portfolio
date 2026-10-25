import { Footer, Header } from "../components/SiteShell";
import { workProcess } from "./capability-content";
import { productPractice, experience } from "./profile-data";
import CapabilityRows from "./CapabilityRows";
import TechnicalToolkit from "./TechnicalToolkit";
import ApplicationShowcase from "./ApplicationShowcase";
import SandHeading from "./SandHeading";
import "./capabilities-page.css";

function CapabilityMarqueeItems() {
  return <>{Array.from({ length: 10 }, (_, index) => (
    <span className="capability-marquee-item" key={index}>What I bring.<i>✦</i></span>
  ))}</>;
}

export default function CapabilitiesPage() {
  return <><Header /><main className="disciplines-page">
    <section className="disciplines-intro" id="capabilities-introduction">
      <p className="discipline-eyebrow">Product direction, experience &amp; business thinking</p>
      <SandHeading />
      <p>I’m Anchal Sharma, a digital product builder with a business-first mindset. I shape ideas through clear requirements, considered interfaces and connected workflows, bringing purpose and direction to each product decision.</p>

    </section>
    <section className="profile-section capability-inventory" aria-label="What I bring">
      <div className="capability-marquee" aria-hidden="true">
        <div className="capability-marquee-track">
          <div className="capability-marquee-group"><CapabilityMarqueeItems /></div>
          <div className="capability-marquee-group"><CapabilityMarqueeItems /></div>
        </div>
      </div>
      <CapabilityRows />
    </section>
    <section className="profile-section" id="applications" aria-labelledby="applications-title">
      <p className="discipline-number">02 / Project ecosystem</p><h2 id="applications-title">Behind the product experience.</h2>
      <ApplicationShowcase />
    </section>
    <section className="profile-section" id="technologies" aria-labelledby="technology-title">
      <p className="discipline-number">03 / Technology in context</p><h2 id="technology-title">The stack, in context.</h2>
      <p className="technical-introduction">A view of the technologies supporting my applications and portfolio. My contribution focuses on product requirements, workflow decisions and experience review.</p>
      <TechnicalToolkit />
    </section>
    <section className="profile-section" id="certificates" aria-labelledby="practice-title">
      <p className="discipline-number">04 / Product practice</p><h2 id="practice-title">Practical decisions. Visible in the work.</h2>
      <div className="profile-grid certificate-grid">{productPractice.map(item=><article className="profile-tile" key={item.title}>
        <p className="profile-label">{item.label}</p><h3>{item.title}</h3><p>{item.description}</p><a className="profile-link" href={item.href}>{item.link} ↗</a>
      </article>)}</div>
    </section>
    <section className="profile-section" id="participation" aria-labelledby="participation-title">
      <p className="discipline-number">05 / Foundation &amp; direction</p><h2 id="participation-title">A technical foundation. A product focus.</h2>
      <article className="participation-entry"><div><p className="profile-label">Academic foundation</p><h3>B.Tech · Computer Science &amp; Engineering</h3><p>Rayat Bahra University, Mohali. Expected graduation 2027.</p></div>
        <div><p className="profile-label">Professional direction</p><h3>Digital Product Builder</h3><p>Product requirements, interface clarity and business workflows shape my independent work. I’m interested in how thoughtful product decisions can make everyday operations easier to understand.</p><a className="profile-link" href="/about">Explore my background ↗</a></div>
      </article>
    </section>
    <section className="profile-section" id="experience" aria-labelledby="experience-title">
      <p className="discipline-number">06 / Independent product experience</p><h2 id="experience-title">Explore the work behind the strengths.</h2>
      <div className="profile-grid">{experience.map(item=><article className="profile-tile" key={item.title}><h3>{item.title}</h3><p>{item.description}</p><a className="profile-link" href={item.href}>{item.link} ↗</a></article>)}</div>
      <details className="discipline-more profile-process"><summary><span className="more-closed">How I approach projects</span><span className="more-open">Hide project approach</span><span className="more-symbol" aria-hidden="true">+</span></summary><ol>{workProcess.map(([number,title,description])=><li key={number}><strong>{number} / {title}</strong><p>{description}</p></li>)}</ol></details>
    </section>
  </main><Footer /></>;
}
