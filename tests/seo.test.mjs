import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { once } from "node:events";
import { request } from "node:http";
import { after, before, test } from "node:test";

// Integration checks against the real production output. Run npm run build first.
let server;
let origin;
let output = "";
const site = "https://nyaysaathi.in";

before(async () => {
  const probe = createServer();
  probe.listen(0, "127.0.0.1");
  await once(probe, "listening");
  const port = probe.address().port;
  await new Promise((resolve) => probe.close(resolve));
  origin = `http://127.0.0.1:${port}`;
  server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], { stdio: ["ignore", "pipe", "pipe"] });
  for (const stream of [server.stdout, server.stderr]) stream.on("data", (chunk) => { output += chunk; });
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(`Server stopped: ${output}`);
    try { if ((await fetch(`${origin}/robots.txt`, { signal: AbortSignal.timeout(2000) })).ok) return; } catch { /* booting */ }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(`Server did not become ready: ${output}`);
});

after(async () => {
  if (server && server.exitCode === null) {
    const stopped = once(server, "exit");
    server.kill();
    await stopped;
  }
});

function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))].map(([tag]) =>
    Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [key, value])),
  );
}

test("sitemap contains only healthy, canonical, indexable pages with unique titles", async () => {
  const response = await fetch(`${origin}/sitemap.xml`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /xml/);
  const urls = [...(await response.text()).matchAll(/<loc>(.*?)<\/loc>/g)].map(([, url]) => url);
  assert.equal(new Set(urls).size, urls.length);
  assert.equal(urls.length, 35);
  const titles = new Set();
  const localLinks = new Set();
  for (const url of urls) {
    assert.ok(url.startsWith(`${site}/`));
    assert.doesNotMatch(url, /admin-lawyersite|track-appointment|\/insights|\/videos|\?/);
    const path = new URL(url).pathname;
    const page = await fetch(`${origin}${path}`);
    assert.equal(page.status, 200, path);
    assert.doesNotMatch(page.headers.get("x-robots-tag") ?? "", /noindex/, path);
    const html = await page.text();
    assert.doesNotMatch(html, /Nagpur|Gondia|Bhandara|Tumsar|Wardha|Amravati|Maharashtra/i, `${path}: specific locations must not appear on public pages`);
    const meta = tags(html, "meta");
    const canonical = tags(html, "link").filter((tag) => tag.rel === "canonical");
    assert.deepEqual(canonical.map((tag) => new URL(tag.href).href), [new URL(url).href], path);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${path}: one primary heading`);
    const title = html.match(/<title>(.*?)<\/title>/)?.[1];
    assert.ok(title, path);
    assert.ok(!titles.has(title), `${path}: duplicate title`);
    titles.add(title);
    assert.ok(meta.find((tag) => tag.name === "description")?.content, path);
    assert.ok(meta.some((tag) => tag.name === "robots" && !tag.content.includes("noindex")), path);
    assert.equal(new URL(meta.find((tag) => tag.property === "og:url")?.content).href, new URL(url).href, path);
    assert.ok(meta.find((tag) => tag.property === "og:image")?.content.startsWith(site), path);
    assert.ok(meta.find((tag) => tag.name === "twitter:card")?.content === "summary_large_image", path);
    for (const [, json] of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
      const parsed = JSON.parse(json);
      for (const item of Array.isArray(parsed) ? parsed : [parsed]) {
        assert.ok(item["@context"], path);
        if (item["@type"] === "BreadcrumbList") {
          for (const crumb of item.itemListElement) assert.ok(crumb.item.startsWith(site), path);
        }
      }
    }
    for (const link of tags(html, "a")) {
      if (link.href?.startsWith("/") && !link.href.startsWith("//")) localLinks.add(link.href.split(/[?#]/)[0] || "/");
    }
  }
  for (const path of localLinks) assert.equal((await fetch(`${origin}${path}`)).status, 200, `Broken internal link: ${path}`);
});

test("robots advertises sitemap and permits crawlers to read noindex directives", async () => {
  const robots = await (await fetch(`${origin}/robots.txt`)).text();
  assert.match(robots, /Allow: \//);
  assert.match(robots, /Disallow: \/api\//);
  assert.match(robots, /Sitemap: https:\/\/nyaysaathi\.in\/sitemap\.xml/);
  assert.doesNotMatch(robots, /Disallow: \/(admin-lawyersite|track-appointment)/);
});

test("private utility and unfinished editorial pages are excluded from indexing", async () => {
  for (const path of ["/admin-lawyersite", "/admin-lawyersite/appointments", "/track-appointment?ref=example"]) {
    const response = await fetch(`${origin}${path}`);
    assert.equal(response.status, 200, path);
    assert.match(response.headers.get("x-robots-tag"), /noindex/, path);
  }
  for (const path of ["/insights", "/insights/navigating-mergers-acquisitions-2024", "/videos", "/videos/understanding-corporate-liability"]) {
    const response = await fetch(`${origin}${path}`);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.ok(tags(html, "meta").some((tag) => tag.name === "robots" && tag.content.includes("noindex")), path);
    if (path.startsWith("/videos")) assert.doesNotMatch(html, /"@type":"VideoObject"/);
  }
});

test("booking variants canonicalize and missing services return real 404s", async () => {
  const html = await (await fetch(`${origin}/consultation?service=family-law`)).text();
  assert.equal(tags(html, "link").find((tag) => tag.rel === "canonical")?.href, `${site}/consultation`);
  assert.equal((await fetch(`${origin}/legal-services/does-not-exist`)).status, 404);
  assert.equal((await fetch(`${origin}/practice-areas/does-not-exist`)).status, 404);
  const oldCoverage = await fetch(`${origin}/legal-help-maharashtra`, { redirect: "manual" });
  assert.equal(oldCoverage.status, 308);
  assert.equal(oldCoverage.headers.get("location"), "/legal-help");
});

test("www permanently redirects with the path and query preserved", async () => {
  // node:http preserves the explicit Host header; fetch may replace it.
  const response = await new Promise((resolve, reject) => {
    const req = request(`${origin}/legal-services/family-law?source=search`, { headers: { host: "www.nyaysaathi.in" } }, (res) => { res.resume(); resolve(res); });
    req.on("error", reject);
    req.end();
  });
  assert.equal(response.statusCode, 308);
  assert.equal(response.headers.location, `${site}/legal-services/family-law?source=search`);
});

test("sharing image is a real image response", async () => {
  const response = await fetch(`${origin}/opengraph-image`);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "image/png");
  assert.ok((await response.arrayBuffer()).byteLength > 1000);
});
