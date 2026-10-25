import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

function htmlUrlForRoute(route = "/") {
  const filePath = route === "/" ? "index" : route.replace(/^\//, "");
  return new URL("../dist/client/" + filePath + ".html", import.meta.url);
}

async function readExportedHtml(route = "/") {
  const fileUrl = htmlUrlForRoute(route);
  await access(fileUrl);
  return readFile(fileUrl, "utf8");
}

test("exports the finished portfolio homepage", async () => {
  const html = await readExportedHtml("/");

  assert.match(html, /<title>Anchal Sharma \| Digital Product Builder<\/title>/i);
  assert.match(html, /Think/i);
  assert.match(html, /Build better/i);
  assert.match(html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " "), /digital products/i);
  assert.match(html, /View My Work/i);
  assert.match(html, /href="\/resume" class="resume-link"/i);
  assert.match(html, /What I do/i);
  assert.match(html, /<a(?=[^>]*class="[^"]*\bstudio-primary\b[^"]*")(?=[^>]*href="\/work")[^>]*>/i);
  assert.match(html, /id="featured-work"/i);
  assert.equal((html.match(/class="sw-card-slot"/g) || []).length, 3);
  assert.ok(html.indexOf('id="featured-work"') < html.indexOf('id="capabilities"'));
  for (const slug of ["ai-assisted-development", "e-commerce", "client-web-projects"]) {
    assert.ok(html.includes('href="/work?project=' + slug + '"'));
  }
  assert.doesNotMatch(
    html,
    /Your site is taking shape|Building your site|react-loading-skeleton/i,
  );
});

test("resume page exports the correct owner and an available PDF preview and download", async () => {
  const html = await readExportedHtml("/resume");

  assert.match(html, /<h1[^>]*>Anchal Sharma \/ Resume<\/h1>/i);
  assert.match(html, /<iframe(?=[^>]*src="\/assets\/anchal-sharma-resume\.pdf#view=FitH")(?=[^>]*title="Anchal Sharma resume")[^>]*>/i);
  assert.match(html, /<a(?=[^>]*href="\/assets\/anchal-sharma-resume\.pdf")(?=[^>]*download="Anchal-Sharma-Resume\.pdf")[^>]*>\s*Download Resume PDF\s*<\/a>/i);
  assert.doesNotMatch(html, /Verified resume coming soon/i);

  const pdf = await readFile(new URL("../dist/client/assets/anchal-sharma-resume.pdf", import.meta.url));
  assert.equal(pdf.subarray(0, 5).toString("ascii"), "%PDF-");
});

test("work page keeps project card media and case-study entry points wired", async () => {
  const html = await readExportedHtml("/work");

  assert.match(html, /nexora-laptop-demo\.mp4/i);
  assert.match(html, /ai-operations-console-demo\.mp4/i);
  assert.match(html, /portfolio-product-demo\.mp4/i);
  assert.match(html, /Personal Portfolio/i);
  assert.match(html, /VIEW CASE STUDY/i);
});

test("featured project detail pages are exported", async () => {
  const routes = [
    "/work/ai-assisted-development",
    "/work/e-commerce",
    "/work/client-web-projects",
  ];

  for (const route of routes) {
    const html = await readExportedHtml(route);
    assert.match(html, /Back to Work/i);
    assert.match(html, /Start a conversation/i);
  }
});

test("source does not contain unfinished visible replacement copy", async () => {
  const sourceFiles = [
    "../app/page.tsx",
    "../app/work/page.tsx",
    "../app/resume/page.tsx",
  ];
  const sources = await Promise.all(
    sourceFiles.map((path) =>
      readFile(new URL(path, import.meta.url), "utf8"),
    ),
  );

  for (const source of sources) {
    assert.doesNotMatch(source, /Replace this|Replace with|TODO|FIXME/);
  }
});
