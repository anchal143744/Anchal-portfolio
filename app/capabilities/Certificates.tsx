import type { Certificate } from "./profile-data";

export default function Certificates({items,number}:{items:Certificate[];number:string}) {
  if (!items.length) return null;
  return <section className="profile-section" id="certificates" aria-labelledby="certificate-title">
    <p className="discipline-number">{number} / Certificates &amp; learning</p>
    <h2 id="certificate-title">Learning, documented.</h2>
    <div className="profile-grid certificate-grid">{items.map(item => <article className="profile-tile" key={item.id}>
      {item.preview && <a href={item.file} aria-label={`${item.kind === "Programme enrolment" ? "View Enrolment Document" : "View Certificate"}: ${item.title}`}><img className="certificate-preview" src={item.preview} alt={item.title} loading="lazy" /></a>}
      <p className="profile-label">{item.kind}</p><h3>{item.title}</h3><p>{item.issuer}</p>
      {item.description && <p>{item.description}</p>}
      {item.issued && <p>Issued: {item.issued}</p>}
      <a className="profile-link" href={item.file}>{item.kind === "Programme enrolment" ? "View Enrolment Document" : "View Certificate"} ↗</a>
      {item.verification && <a className="profile-link" href={item.verification}>Verify Certificate ↗</a>}
    </article>)}</div>
  </section>;
}
