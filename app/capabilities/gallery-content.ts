import { skillGroups } from "./profile-data";

const overview = [
  {id:'chapter-development',label:'Development & AI',title:'AI-Assisted Product Building',description:'I shape and refine independent products through clear requirements, workflow priorities and review, with a defined scope for each iteration.',skills:['Responsive websites','Interface components','Small web applications','AI-assisted coding & debugging','Basic API integration']},
  {id:'chapter-design',label:'Design & Media',title:'Interface & Product Presentation',description:'Project context, information hierarchy and presentation shaped around interface clarity.',skills:['Interface design','Content organisation','Project presentation','Product summaries','Case-study writing']},
  {id:'chapter-commerce',label:'E-Commerce',title:'E-Commerce',description:'Independent projects exploring retail records, reporting and proposed B2B handoffs.',skills:['Retail product exploration','Operational interfaces','Product presentation','Inventory management','Implementation boundaries']},
  {id:'chapter-business',label:'Business & Operations',title:'Business & Operations',description:'Business interests explored through problem statements, product purpose and workflow decisions.',skills:['Customer communication','Problem framing','Design requirements','Product scope','Practical problem-solving']},
];

export const chapters = overview.map((chapter, index) => {
  const group = skillGroups[index < 2 ? index : index + 1];
  const interfaceSkills = new Set(["Landing Page Design", "Website Visuals", "Visual Design", "Interface design"]);
  const sections = index === 1 ? [
    { title: "Interface design", skills: group.skills.filter(skill => interfaceSkills.has(skill)) },
    { title: "Content & presentation", skills: group.skills.filter(skill => !interfaceSkills.has(skill)) },
    { title: "Product communication", id: "video-media", description: skillGroups[2].description, skills: skillGroups[2].skills },
  ] : [{ title: "Practical skills", skills: group.skills }];
  return { ...chapter, detailId: group.id, detailDescription: group.description, sections };
});
