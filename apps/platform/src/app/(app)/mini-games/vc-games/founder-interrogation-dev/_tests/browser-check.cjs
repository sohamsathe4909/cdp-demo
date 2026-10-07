/*
 * Run against an offline development server on localhost:3000.
 * Uses an already-installed Playwright Core, supplied with PLAYWRIGHT_CORE_PATH;
 * does not install dependencies or write to Supabase. Artifacts go to TEMP.
 */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const { chromium } = require(process.env.PLAYWRIGHT_CORE_PATH || "playwright-core");

const origin = process.env.FOUNDER_TEST_ORIGIN || "http://localhost:3000";
assert.ok(["localhost", "127.0.0.1"].includes(new URL(origin).hostname), "Use a local server");
const route = `${origin}/mini-games/vc-games/founder-interrogation`;
const storageKey = "cdp:vc-games:founder-interrogation-dev";
const artifacts = path.join(os.tmpdir(), "cdp-founder-update", "browser");
fs.mkdirSync(artifacts, { recursive: true });
const filename = path.resolve(__dirname, "../_data/founder-pitch-videos.ts");
const loaded = new Module(filename, module);
loaded._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText, filename);
const pitches = loaded.exports.FOUNDER_PITCH_VIDEOS;
assert.equal(pitches.length, 8);

async function run() {
  const browser = await chromium.launch({ headless: true });
  const report = { browser: browser.version(), games: [], layouts: [], errors: [] };
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const submissions = [];
    // Always intercept result writes, including if the local environment changes.
    await context.route("**/api/mini-games/progress", async route => {
      if (route.request().method() === "POST") submissions.push(route.request().postDataJSON());
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, persisted: false, items: [] }) });
    });
    await context.route("**/*", async route => {
      if (!["GET", "HEAD"].includes(route.request().method()) && !route.request().url().includes("/api/mini-games/progress")) return route.abort();
      return route.fallback();
    });
    const page = await context.newPage();
    page.on("pageerror", error => report.errors.push(error.message));
    const videoRequests = [];
    page.on("request", request => {
      if (new URL(request.url()).pathname.endsWith(".mp4")) videoRequests.push(new URL(request.url()).pathname);
    });
    await page.goto(route);
    await page.getByRole("button", { name: "Browse Pitches" }).click();
    await page.waitForTimeout(600);
    assert.equal(await page.locator('button[aria-label^="Pitch "]').count(), 8);
    assert.deepEqual(videoRequests, [], "The library must not download all videos");

    for (const [index, pitch] of pitches.entries()) {
      const label = `Pitch ${String(index + 1).padStart(2, "0")}`;
      const requestStart = videoRequests.length;
      await page.getByRole("button", { name: label, exact: true }).click();
      const video = page.locator("video");
      await page.waitForFunction(() => document.querySelector("video")?.readyState >= 1);
      const metadata = await video.evaluate(v => ({
        src: new URL(v.currentSrc).pathname,
        width: v.videoWidth, height: v.videoHeight, duration: v.duration,
        controls: v.controls, preload: v.preload, poster: new URL(v.poster).pathname,
        error: v.error?.message || null,
      }));
      assert.equal(metadata.src, pitch.videoUrl);
      assert.equal(metadata.poster, pitch.thumbnailUrl);
      assert.equal(metadata.width, 1920);
      assert.equal(metadata.height, 1080);
      assert.equal(metadata.controls, true);
      assert.equal(metadata.preload, "metadata");
      assert.equal(metadata.error, null);
      assert.ok(metadata.duration > 0);
      assert.equal(await page.getByRole("button", { name: "Accept", exact: true }).count(), 0);
      assert.equal(await page.getByRole("heading", { name: pitch.realCompanyName, exact: true }).count(), 0);
      const posterResponse = await context.request.get(`${origin}${pitch.thumbnailUrl}`);
      assert.equal(posterResponse.status(), 200);

      await video.evaluate(async v => {
        v.pause();
        v.currentTime = 0;
        v.playbackRate = 1;
        v.volume = 0.5;
        v.muted = false;
        v.dataset.naturalEnded = "false";
        v.addEventListener("ended", () => { v.dataset.naturalEnded = "true"; }, { once: true });
        await v.play();
      });
      await page.waitForFunction(() => document.querySelector("video")?.currentTime > 0.1);
      await video.evaluate(v => v.pause());
      const pausedAt = await video.evaluate(v => v.currentTime);
      await page.waitForTimeout(150);
      assert.equal(await video.evaluate(v => v.paused), true);
      assert.ok(Math.abs(await video.evaluate(v => v.currentTime) - pausedAt) < 0.1);
      assert.equal(await page.getByRole("button", { name: "Accept", exact: true }).count(), 0, "Pause must not unlock decisions");

      // Complete playback from near the start, without seeking to the end.
      await video.evaluate(async v => { v.playbackRate = 16; await v.play(); });
      await page.waitForFunction(() => document.querySelector("video")?.dataset.naturalEnded === "true", { }, { timeout: 90000 });
      await page.getByRole("button", { name: "Accept", exact: true }).waitFor();
      assert.equal(await video.evaluate(v => v.paused), true);

      // Native replay preserves already-unlocked decisions.
      await video.evaluate(async v => { v.currentTime = 0; v.playbackRate = 1; await v.play(); });
      await page.waitForFunction(() => document.querySelector("video")?.currentTime > 0.1);
      assert.equal(await page.getByRole("button", { name: "Accept", exact: true }).count(), 1);
      await video.evaluate(v => v.pause());

      const before = submissions.length;
      await page.getByRole("button", { name: "Accept", exact: true }).click();
      await page.getByRole("heading", { name: pitch.realCompanyName, exact: true }).waitFor();
      assert.equal(await page.getByText(pitch.outcome, { exact: true }).count(), 1);
      await page.waitForTimeout(200);
      assert.equal(submissions.length, before + 1);
      assert.equal(submissions.at(-1).outcome, "pitch-accepted");
      await page.getByRole("button", { name: "Back to Videos", exact: true }).last().click();
      await page.getByRole("button", { name: `${label}, watched`, exact: true }).click();
      await page.waitForFunction(() => document.querySelector("video")?.readyState >= 1);
      assert.equal(await page.getByRole("button", { name: "Accept", exact: true }).count(), 0);
      // The explicit end action unlocks early; reject shows the same authored reveal.
      await page.getByRole("button", { name: "End Pitch & Decide", exact: true }).click();
      await page.getByRole("button", { name: "Reject", exact: true }).click();
      await page.getByRole("heading", { name: pitch.realCompanyName, exact: true }).waitFor();
      assert.equal(await page.getByText(pitch.outcome, { exact: true }).count(), 1);
      await page.getByRole("button", { name: "Back to Videos", exact: true }).last().click();
      await page.getByRole("button", { name: `${label}, watched`, exact: true }).click();
      await page.waitForFunction(() => document.querySelector("video")?.readyState >= 1);
      assert.equal(await page.getByRole("button", { name: "Accept", exact: true }).count(), 0);
      await video.evaluate(v => { v.pause(); v.currentTime = v.duration; });
      await page.getByRole("button", { name: "Accept", exact: true }).waitFor();
      await page.getByRole("button", { name: "Back to Videos", exact: true }).first().click();
      assert.ok(videoRequests.slice(requestStart).every(url => url === pitch.videoUrl));
      report.games.push({ id: pitch.id, ...metadata, pause: true, resume: true, naturalEnd: true, seekToEnd: true, replay: true, earlyEnd: true, bothReveals: true });
      console.log(`PASS ${pitch.id}: media, pause/resume, natural end, replay, both reveals`);
    }

    await page.reload();
    await page.getByRole("button", { name: "Browse Pitches" }).click();
    await page.waitForFunction(key => JSON.parse(localStorage.getItem(key)).watchedPitchIds.length === 8, storageKey);
    assert.equal(await page.locator('button[aria-label$=", watched"]').count(), 8);

    for (const width of [1440, 768, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.waitForTimeout(600);
      await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
      const layout = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, cards: document.querySelectorAll('button[aria-label^="Pitch "]').length }));
      assert.equal(layout.cards, 8);
      assert.equal(layout.width, layout.scrollWidth);
      await page.screenshot({ path: path.join(artifacts, `library-${width}.png`), fullPage: true });
      report.layouts.push(layout);
    }

    // Check keyboard operation through the same existing library button.
    const first = page.getByRole("button", { name: "Pitch 01, watched", exact: true });
    await first.focus();
    await page.keyboard.press("Enter");
    await page.locator("video").waitFor();
    await page.getByRole("button", { name: "Back to Videos", exact: true }).first().click();
    await page.getByRole("button", { name: "Game Intro", exact: true }).click();
    await page.getByRole("link", { name: "The Deal Room", exact: false }).click();
    await page.waitForURL("**/mini-games/vc-games");
    assert.deepEqual(report.errors, []);
    console.log("PASS storage reload, desktop/tablet/mobile layout bounds, keyboard and hub return");
  } finally {
    fs.writeFileSync(path.join(artifacts, "report.json"), JSON.stringify(report, null, 2));
    await browser.close();
  }
}

run().catch(error => { console.error(error); process.exitCode = 1; });
