const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");

const gameRoot = path.resolve(__dirname, "..");
const publicRoot = path.resolve(gameRoot, "../../../../../../public");

// Use the repository's existing TypeScript compiler; no test dependency needed.
function loadTs(relativePath) {
  const filename = path.join(gameRoot, relativePath);
  const output = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const loaded = new Module(filename, module);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(path.dirname(filename));
  loaded._compile(output, filename);
  return loaded.exports;
}

const { FOUNDER_PITCH_VIDEOS: pitches } = loadTs("_data/founder-pitch-videos.ts");
const {
  founderInterrogationReducer: reduce,
  INITIAL_FOUNDER_INTERROGATION_STATE: initial,
  parseFounderInterrogationPersistence: parse,
  FOUNDER_INTERROGATION_STORAGE_KEY: storageKey,
  FOUNDER_INTERROGATION_STORAGE_VERSION: storageVersion,
} = loadTs("_lib/founder-interrogation-state.ts");
const original = require("./original-five.json");

test("eight unique, ordered canonical IDs use anonymous local assets", () => {
  assert.deepEqual(pitches.map(p => p.id), Array.from({ length: 8 }, (_, i) => `pitch-${i + 1}`));
  assert.deepEqual(pitches.map(p => p.realCompanyName), [
    "Flipkart", "Koo", "LocalOye", "PepperTap", "GoZoomo", "Nykaa", "Zerodha", "Stayzilla",
  ]);
  for (const [index, pitch] of pitches.entries()) {
    const number = String(index + 1).padStart(2, "0");
    assert.deepEqual(Object.keys(pitch).sort(), ["id", "outcome", "realCompanyName", "thumbnailUrl", "videoUrl"]);
    assert.equal(pitch.videoUrl, `/pitch-videos/pitch-${number}.mp4`);
    assert.equal(pitch.thumbnailUrl, `/pitch-videos/thumbnails/pitch-${number}.jpg`);
    assert.ok(pitch.outcome.trim().length > 0);
    for (const url of [pitch.videoUrl, pitch.thumbnailUrl]) {
      assert.ok(fs.statSync(path.join(publicRoot, url)).size > 0, url);
    }
  }
});

test("original content and IDs remain intact except the approved GoZoomo correction", () => {
  assert.deepEqual(pitches.slice(0, 4), original.slice(0, 4));
  const { realCompanyName, outcome, ...fifth } = pitches[4];
  const { realCompanyName: oldName, outcome: oldOutcome, ...oldFifth } = original[4];
  assert.deepEqual(fifth, oldFifth);
  assert.equal(realCompanyName, "GoZoomo");
  assert.doesNotMatch(outcome, /Zoomcar|Nasdaq/i);
});

test("existing version-1 watched history accepts new pitches without wiping old IDs", () => {
  assert.equal(storageKey, "cdp:vc-games:founder-interrogation-dev");
  assert.equal(storageVersion, 1);
  const oldIds = original.map(p => p.id);
  const saved = parse({ version: 1, watchedPitchIds: [...oldIds, "pitch-1"] });
  assert.deepEqual(saved.watchedPitchIds, oldIds);
  let state = reduce(initial, { type: "HYDRATE", payload: saved });
  state = reduce(state, { type: "ENTER_LIBRARY" });
  for (const pitch of pitches.slice(5)) {
    state = reduce(state, { type: "OPEN_PITCH", pitchId: pitch.id });
    state = reduce(state, { type: "MAKE_DECISION_READY" });
    state = reduce(state, { type: "DECIDE", decision: "accept" });
    state = reduce(state, { type: "BACK_TO_VIDEOS" });
  }
  assert.deepEqual(state.watchedPitchIds, pitches.map(p => p.id));
  assert.deepEqual(parse({ version: 1, watchedPitchIds: state.watchedPitchIds }).watchedPitchIds, state.watchedPitchIds);
});

for (const pitch of Array.from({ length: 8 }, (_, i) => `pitch-${i + 1}`)) {
  test(`${pitch}: both decisions require readiness, lock once, and reset on reopening`, () => {
    for (const decision of ["accept", "reject"]) {
      let state = reduce(initial, { type: "ENTER_LIBRARY" });
      state = reduce(state, { type: "OPEN_PITCH", pitchId: pitch });
      assert.equal(state.phase, "watching");
      assert.equal(state.decision, null);
      assert.strictEqual(reduce(state, { type: "DECIDE", decision }), state);
      assert.deepEqual(state.watchedPitchIds, []);
      state = reduce(state, { type: "MAKE_DECISION_READY" });
      assert.equal(state.phase, "decision-ready");
      state = reduce(state, { type: "DECIDE", decision });
      assert.equal(state.phase, "reveal");
      assert.equal(state.decision, decision);
      assert.deepEqual(state.watchedPitchIds, [pitch]);
      assert.strictEqual(reduce(state, { type: "DECIDE", decision: decision === "accept" ? "reject" : "accept" }), state);
      state = reduce(state, { type: "BACK_TO_VIDEOS" });
      assert.equal(state.activePitchId, null);
      assert.equal(state.decision, null);
      state = reduce(state, { type: "OPEN_PITCH", pitchId: pitch });
      assert.equal(state.phase, "watching");
      assert.equal(state.decision, null);
      assert.deepEqual(state.watchedPitchIds, [pitch]);
    }
  });
}

test("manual selection allows replay of watched pitches without adding a rotation rule", () => {
  let state = reduce(initial, { type: "HYDRATE", payload: { version: 1, watchedPitchIds: ["pitch-1"] } });
  state = reduce(state, { type: "ENTER_LIBRARY" });
  state = reduce(state, { type: "OPEN_PITCH", pitchId: "pitch-1" });
  state = reduce(state, { type: "MAKE_DECISION_READY" });
  state = reduce(state, { type: "DECIDE", decision: "reject" });
  assert.deepEqual(state.watchedPitchIds, ["pitch-1"]);
  state = reduce(state, { type: "BACK_TO_VIDEOS" });
  state = reduce(state, { type: "OPEN_PITCH", pitchId: "pitch-8" });
  assert.equal(state.phase, "watching");
  assert.equal(state.decision, null);
  assert.equal(state.activePitchId, "pitch-8");
});

test("invalid or unsupported saved history remains optional", () => {
  for (const value of [null, [], {}, { version: 2, watchedPitchIds: [] }, { version: 1, watchedPitchIds: [5] }]) {
    assert.equal(parse(value), null);
  }
});
