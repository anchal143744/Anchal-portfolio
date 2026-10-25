import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
const normalize = value => value.replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/&#x27;|&#39;/g,"'").replace(/&quot;/g,'"').replace(/\s+/g,' ').trim();
test('Capabilities preserves unique original information and the requested sequence', async () => {
  const html=await readFile(new URL('../dist/client/capabilities.html',import.meta.url),'utf8');
  const content=normalize(html);
  const original=JSON.parse(await readFile(new URL('./fixtures/capabilities-original.json',import.meta.url),'utf8'));
  const aliases = {
    'Landing Pages':'Landing Page Development', 'Basic APIs':'Basic API Integration',
    'Responsive Web Design':'Responsive Interfaces', 'AI-Assisted Development':'AI-Assisted Web Development',
    'Social Media Creatives':'Social Media Posts', 'Song / Music Videos':'Song / Music Video Creation',
    'Shopify Customization':'Store Customization', 'Day-to-Day Business Management':'Business Operations',
  };
  for(const group of [...original.coreAreas,...original.toolkit]) {
    for(const item of group.items) assert.ok(content.includes(aliases[item] ?? item), `Retained or consolidated: ${item}`);

  }
  for (const phrase of ['with AI assistance', 'generating and understanding code', 'debugging and refining interfaces', 'photo editing', 'hands-on with Shopify', 'Running flex printing and clothing businesses']) {
    assert.ok(content.includes(phrase), `Preserved description meaning: ${phrase}`);
  }
  for(const step of original.process) assert.ok(content.includes(normalize(step[2])));
  let previous=-1;
  for(const id of ['development','design-media','video-media','commerce','business','applications','technologies','participation','experience']) {
    const position=html.indexOf(`id="${id}"`); assert.ok(position>previous,`${id} in sequence`); previous=position;
  }
  assert.ok(content.includes('Hackathon participation'));
  assert.ok(content.includes('One Gen'));
  assert.ok(content.includes('self-formed team'));
  assert.ok(content.includes('Programme enrolment'));
  assert.ok(content.includes('Build a Full Website using WordPress'));
  assert.ok(content.includes('May 10, 2024'));
  assert.ok(html.includes('/certificates/ediglobe-ai-enrolment.jpg'));
  assert.ok(html.includes('/certificates/coursera-wordpress-project.png'));
  assert.ok(html.includes('https://coursera.org/verify/HMBDD8386TSB'));
  for(const route of ['/work','/work/e-commerce','/work/business-work','/contact']) assert.ok(html.includes(`href="${route}"`));
});

test('Confirmed applications and technical categories are complete without invented levels', async () => {
  const html = await readFile(new URL('../dist/client/capabilities.html', import.meta.url), 'utf8');
  const apps = html.split('id="applications"')[1].split('id="technologies"')[0];
  const names = ['Visual Studio Code', 'ChatGPT', 'Claude', 'Codex', 'Adobe Photoshop', 'Canva', 'Adobe Premiere Pro', 'DaVinci Resolve', 'WordPress', 'Shopify', 'Wix', 'Microsoft Excel', 'Microsoft Word', 'Microsoft PowerPoint'];
  for (const name of names) assert.equal(apps.split(`<h4>${name}</h4>`).length - 1, 1, name);
  assert.equal((apps.match(/class="app-proficiency"/g) || []).length, 3);
  for (const name of ['ChatGPT', 'Claude', 'Codex']) assert.match(apps, new RegExp(`<h4>${name}</h4>[\\s\\S]*?Expert[\\s\\S]*?</article>`));
  for (const name of ['Figma', 'Lightroom', 'After Effects', 'Postman']) assert.ok(!apps.includes(name));
  const tech = html.split('id="technologies"')[1].split('id="participation"')[0];
  for(const name of ['HTML','CSS','JavaScript','TypeScript','React','Next.js','Node.js','Python','Java','C','C++','C#','PHP','SQL','MySQL']) assert.ok(tech.includes(name),name);
  assert.ok(tech.includes('Query language'));
  assert.equal((tech.match(/class="technology-role">Fundamentals</g)||[]).length,2);
  assert.ok(html.includes('View Enrolment Document'));
  assert.ok(tech.includes('independent language proficiency'));
});
