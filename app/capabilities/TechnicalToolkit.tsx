import { technologies } from './profile-data';
import './technical-toolkit.css';

const artwork: Record<string, [string | null, string]> = {
  HTML:['html5','Semantic markup'], CSS:['css3','Styling & layout'], JavaScript:['javascript','Browser interaction'], TypeScript:['typescript','Typed JavaScript'],
  React:['react','UI library'], 'Next.js':['nextjs','React framework'], 'Node.js':['nodejs','JavaScript runtime'],
  Python:['python','General-purpose scripting'], Java:['java','JVM language'], C:['c','Systems language'], 'C++':['cplusplus','Systems & object-oriented'], 'C#':['csharp','.NET language'],
  'PHP Fundamentals':['php','Server-side fundamentals'], SQL:[null,'Query language'], 'MySQL Fundamentals':['mysql','Database fundamentals'],
  NestJS:[null,'Application services'], PostgreSQL:[null,'Relational records'], Prisma:[null,'Data access'],
  GSAP:[null,'Portfolio motion'], 'Three.js':[null,'3D presentation'], Vitest:[null,'Automated project checks'], Playwright:[null,'Browser acceptance'],
};
const marks: Record<string,string> = {NestJS:'NJ',Prisma:'PR',GSAP:'GS','Three.js':'3D',Vitest:'VT',Playwright:'PW'};
const groups = [
  {id:'web',title:'Interfaces',names:['HTML','CSS','JavaScript','TypeScript'],copy:'Structure, styling and interaction across the project interfaces.'},
  {id:'frameworks',title:'Application layers',names:['React','Next.js','Node.js','NestJS'],copy:'Interface components, application structure and business services.'},
  {id:'data',title:'Data & records',names:['PostgreSQL','Prisma','SQL'],copy:'Persistent business records and the application layers that connect them.'},
  {id:'programming',title:'Motion & verification',names:['GSAP','Three.js','Vitest','Playwright'],copy:'Portfolio presentation and documented project-verification tooling.'},
];
const confirmed = new Set(technologies.flatMap(group => group.items));
const proof = [
  ['Requirement clarity','Define the purpose, boundaries and expected behaviour before extending a product.'],
  ['Workflow review','Examine how records, decisions and handoffs connect from one step to the next.'],
  ['Interface refinement','Review hierarchy, action labels and screen states to make the experience easier to follow.'],
];
export default function TechnicalToolkit() {
  return <>
    <div className="technology-directory">
      {groups.map((group,index) => <section className="technology-category" aria-labelledby={`technology-${group.id}`} key={group.id}>
        <div className="technology-category-heading"><p className="technology-number">0{index+1}</p><h3 id={`technology-${group.id}`}>{group.title}</h3><p>{group.copy}</p></div>
        <ul className="technology-list">{group.names.filter(name=>confirmed.has(name)).map(name=>{
          const [logo,role]=artwork[name];
          return <li className="technology-entry" key={name}>
            <span className="technology-icon" aria-hidden="true">{logo ? <img src={`/technology-logos/${logo}.svg`} alt="" width="32" height="32"/> : name === 'SQL' || name === 'PostgreSQL' ? <svg viewBox="0 0 40 40" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.7"><ellipse cx="20" cy="9" rx="12" ry="5"/><path d="M8 9v22c0 7 24 7 24 0V9M8 20c0 7 24 7 24 0"/></svg> : <svg viewBox="0 0 40 40" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="4" y="4" width="32" height="32" rx="8"/><text x="20" y="24" textAnchor="middle" fontSize="12" fontWeight="750" stroke="none" fill="currentColor">{marks[name] ?? name.slice(0,2)}</text></svg>}</span>
            <div><span className="technology-name">{name.replace(" Fundamentals", "")}</span><span className="technology-role">{name.endsWith(" Fundamentals") ? "Fundamentals" : role}</span></div>
          </li>;
        })}</ul>
      </section>)}
    </div>
    <p className="technical-note">My case studies connect the project stack with its product purpose, workflow decisions and the contribution behind each experience.</p>
    <div className="toolkit-proof">{proof.map(([heading,copy],i)=><article key={heading}><p className="toolkit-proof-index">0{i+1}</p><h3>{heading}<span aria-hidden="true">↗</span></h3><p>{copy}</p></article>)}</div>
  </>;
}
