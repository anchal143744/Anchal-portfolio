import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import test from 'node:test';
import { portfolioProjects } from '../app/data/projects.ts';

const readRoute = route => readFile(new URL(`../dist/client/${route}.html`, import.meta.url), 'utf8');
const text = html => html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#x27;|&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();

test('Work preserves every project, original order, metadata, media and full detail destination', async () => {
  const html = await readRoute('work');
  assert.equal((html.match(/class="work-card"/g) ?? []).length, portfolioProjects.length);
  let previous = -1;
  for (const project of portfolioProjects) {
    const position = html.indexOf(`id="${project.id}"`);
    assert.ok(position > previous, `${project.id} stays in original order`);
    previous = position;
    for (const field of ['shortTitle', 'sentence', 'overview', 'role', 'tools', 'status', 'ai']) {
      assert.ok(text(html).includes(text(project[field])), `${project.id}: ${field} retained`);
    }
    for (const highlight of project.highlights) assert.ok(text(html).includes(highlight));
    assert.ok(html.includes(`href="/work/${project.slug}"`));
    const detail = text(await readRoute(`work/${project.slug}`));
    for (const field of ['problem', 'idea', 'solution', 'ai', 'result']) {
      assert.ok(detail.includes(text(project[field])), `${project.id}: full ${field} accessible`);
    }
    await access(new URL('../public' + (project.cardMedia ?? project.image), import.meta.url));
  }
  assert.equal((html.match(/class="archive-category-card archive-/g) ?? []).length, 8, 'all archive entries remain');
});
