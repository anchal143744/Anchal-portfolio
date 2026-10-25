import { Footer, Header } from "../components/SiteShell";
import ContactForm from "./ContactForm";
import { portfolioDestinations } from "../data/socials";
import "./contact.css";

export default function ContactPage() {
  return <>
    <Header />
    <main className="contact-destination">
      <div className="contact-page" id="contact-details">
      <div className="contact-content">
        <section className="contact-intro" aria-labelledby="contact-title">
          <p className="contact-kicker">LET’S CONNECT</p>
          <h1 id="contact-title">Have an idea?<br />Let’s make<br /><span>it real.</span></h1>
          <p className="contact-summary">A product opportunity, a business workflow or a role where practical product thinking matters. Let’s connect.</p>
          <div className="contact-services" aria-label="Project areas">
            <span>Digital products</span><span>AI-assisted building</span><span>Business workflows</span>
          </div>
          <div className="contact-guidance">
            <h2>A good place to start</h2>
            <p>Share your goal, the kind of help you need, and any timeline or budget you have in mind.</p>
            <p className="contact-email"><a href={portfolioDestinations.email}>{portfolioDestinations.email.replace(/^mailto:/, "")}</a></p>
          </div>
        </section>
        <ContactForm />
      </div>
      </div>
    </main>
    <Footer />
  </>;
}
