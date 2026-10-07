# Founder Interrogation video update — 2026-09-30

## Git handoff

The duplicate `updated pitches/` source folder was removed after the source/destination checks below. All eight canonical videos remain. The five obsolete temporary video backups were also deleted; prior committed versions remain in Git history.

The current MP4 files use Git LFS because several exceed GitHub's regular-file size limit. After cloning, use `git lfs install` and `git lfs pull` before running/building the app. Build checkouts must materialize the media rather than serve LFS pointer files. No history migration or media re-encoding was performed. The source-folder statements below record the state during verification, before duplicate cleanup.

## Scope and source mapping

The public route is `/mini-games/vc-games/founder-interrogation`. Its page imports the live implementation from `apps/platform/src/app/(app)/mini-games/vc-games/founder-interrogation-dev/` (called `F` below). Do not rename that implementation folder or its storage key.

Sources remain in `apps/platform/public/pitch-videos/updated pitches/`. Each was copied byte-for-byte to the existing public asset directory; none was transcoded or deleted. Canonical IDs are **unpadded** in this repository. Padded numbers are filenames and display labels only.

| ID | Exact source filename | Destination under `public/pitch-videos/` | Action |
| --- | --- | --- | --- |
| pitch-1 | `Ayush pitch Flipkart.mp4` | `pitch-01.mp4` | Replaced |
| pitch-2 | `shaun pitch koo.mp4` | `pitch-02.mp4` | Replaced |
| pitch-3 | `viraj pitch localoye.mp4` | `pitch-03.mp4` | Replaced |
| pitch-4 | `vishnu pitch peppertap.mp4` | `pitch-04.mp4` | Replaced |
| pitch-5 | `ketan pitch gozoomo.mp4` | `pitch-05.mp4` | Replaced; approved company/outcome correction |
| pitch-6 | `Vaishnavi pitch nyka.mp4` | `pitch-06.mp4` | Added: Nykaa |
| pitch-7 | `abhijeet pitch zerodha .mp4` | `pitch-07.mp4` | Added: Zerodha |
| pitch-8 | `riddhi pitch stayziilla .mp4` | `pitch-08.mp4` | Added: Stayzilla |

The existing first five JPEG thumbnails are preserved. New `thumbnails/pitch-06.jpg` through `pitch-08.jpg` were extracted at three seconds, scaled to 640px wide and visually inspected. All eight videos are 1920×1080, landscape 16:9, H.264/yuv420p with AAC 48 kHz stereo audio. Durations in ID order are 62.549, 64.704, 84.544, 47.381, 86.144, 56.981, 60.587 and 71.872 seconds. Full audio/video decoding passed for all eight source files; copies were SHA-256 verified. The existing `object-fit: contain` player needs no change.

## Data, content and unchanged behavior

`F/_data/founder-pitch-videos.ts` uses exactly `id`, `videoUrl`, optional `thumbnailUrl`, `realCompanyName`, and `outcome`. All eight entries use the same renderer and schema. The library maps the array without a hardcoded five-card limit. No special-case player or route was added.

This engine has **no authored script, transcript, interrogation questions, founder responses, branching feedback, timer, or correctness score**. The user's three scripts and fifteen question/response pairs are preserved in [founder-interrogation-source-notes.json](founder-interrogation-source-notes.json), outside the application bundle. They are user-provided pitch material, not independently verified verbatim transcriptions. No script was invented from a filename and no new question phase was introduced.

Pitch 1–4 entries are unchanged. Pitch 5 retains its ID and asset paths; only its company and outcome changed from the incorrect Zoomcar story to the user-approved GoZoomo correction. There were no existing script/question fields to modify. New entries add the five existing production fields only.

Inspected files: public `founder-interrogation/page.tsx`; `F/FounderInterrogation.tsx`; all four `F/_components` (Intro, Library, Player, Reveal); data manifest; reducer/persistence parser; CSS module; shared VC shell and result-sync hook; existing assets/media README. Only the manifest, Founder media, local tests and documentation change in this update. Player, reducer, CSS, shared components, other games and platform code are unchanged.

| Action | Preserved behavior |
| --- | --- |
| Open pitch | New video element keyed by pitch ID; starts in `watching`; requests unmuted autoplay with native controls, `preload="metadata"`. Browser policy can require Play. |
| Play, pause, resume | Native media behavior; no game phase change. There are no `onPlay`, `onPause` or `onTimeUpdate` state handlers. |
| Natural end | `onEnded` pauses media and enables Accept/Reject. |
| Seek to end | `onSeeked` enables decisions within 0.05 seconds of duration. |
| End Pitch & Decide | Pauses immediately and enables decisions without requiring full playback. |
| Replay while decision-ready | Decisions remain enabled; completion is not reset. |
| Accept or Reject | Locks the choice, shows the same company-specific historical outcome and records the pitch as watched. No right/wrong judgment. |
| Back to Videos / reopen | Clears active pitch and choice. Reopening starts in `watching`; previous readiness does not leak. Watched badges remain. |
| Return to hub | Back to Videos → Game Intro → The Deal Room. |

Selection is manual, with repeat viewing allowed. There is no unseen-item rotation, exhaustion reset or selection migration to change. Storage remains `cdp:vc-games:founder-interrogation-dev`, version 1, containing only `watchedPitchIds`. Existing five-ID histories accept IDs 6–8 without wiping data. No playback position, timestamp, choice or in-progress phase is persisted. The unchanged platform hook reports game-level `pitch-accepted`/`pitch-rejected` results.

## Reveal research

The user authorized research for the missing historical outcomes. Text is paraphrased, date-qualified historical context, separate from the supplied forward-looking scripts:

- **GoZoomo:** used-car marketplace closure in 2016 after unsustainable unit economics, with the decision to return remaining capital. Sources: [MediaNama's founder confirmation](https://www.medianama.com/2016/08/223-gozoomo-shuts-down/) (indexed text available; direct fetch returned 403) and [Venture Intelligence's account](https://blog.ventureintelligence.com/why-gozoomo-shut-down-returned-vc-money-and-what-it-means/).
- **Nykaa:** FSN E-Commerce Ventures completed its IPO and listed on NSE/BSE in November 2021. Primary source: [company annual report 2021–22, printed page 37 / PDF page 22](https://archives.nseindia.com/corporate/NYKAA_16072022203103_SEIntimationAnnualReportandAGMNotice.pdf).
- **Zerodha:** grew without external funding; FY2023–24 reported revenue Rs. 8,320 crore and profit Rs. 4,700 crore. Primary sources: [company philosophy](https://www.zerodha.com/about/philosophy) and [September 2024 business update](https://zerodha.com/z-connect/business-updates/business-updates-14-years-of-zerodha-the-pivot).
- **Stayzilla:** February 2017 suspension of new bookings/operations in their existing form, proposed change of model, and founder's stated supply/demand and discounting challenges. Source: [YourStory's contemporary report quoting the founder](https://yourstory.com/2017/02/stayzilla-reboot). The reveal does not claim that the proposed reboot happened.

## Repeatable checks

From the repository root, using installed dependencies:

```powershell
node --test 'apps/platform/src/app/(app)/mini-games/vc-games/founder-interrogation-dev/_tests/founder-interrogation.test.cjs'
```

This uses Node's built-in test runner and the existing TypeScript compiler. `original-five.json` is an immutable pre-change fixture, including the deliberately incorrect old Zoomcar text for regression comparison. Thirteen tests cover manifest/schema/assets, original-content preservation, approved correction, both decisions, locking, resetting, manual replay and old-history compatibility.

The browser check requires an **already installed** Playwright Core and Chromium. No dependency or browser installer was added. Set `PLAYWRIGHT_CORE_PATH` to that installation and run against the offline local dev server:

```powershell
$env:FOUNDER_TEST_ORIGIN = 'http://127.0.0.1:3000'
node 'apps/platform/src/app/(app)/mini-games/vc-games/founder-interrogation-dev/_tests/browser-check.cjs'
```

The test intercepts progress writes, uses isolated browser storage, and writes reports/screenshots under the system temporary directory `cdp-founder-update/browser`. It checks all eight media/posters, pause/resume, natural ended events, seek-to-end, replay, both reveals, reopening, saved badges, keyboard navigation and desktop/tablet/mobile library bounds. Natural playback runs accelerated, not by dispatching a synthetic `ended` event. No production data is mutated.

Platform commands remain in [WORKING-GUIDE.md](WORKING-GUIDE.md). Lint has no existing configuration and prompts for setup; that unrelated configuration is not changed here.

## Accessibility and review limits

Existing native keyboard media controls and accessible anonymous video label are retained. The current game has no captions, text transcript UI or subtitle tracks for any pitch; this update does not introduce a new accessibility mechanism. The supplied scripts are not caption files and have not been aligned to recordings.

Neutral public filenames and library labels do not expose companies before the decision. New thumbnails have no visible company identifier. Full spoken-audio anonymity and semantic agreement between scripts and recordings have not been independently verified; successful decoding/playback does not establish either. The supplied scripts contain company names and therefore must not simply be rendered before the reveal. Source files remain in the user-requested public source folder but are never referenced by the game's player or library.

The existing three-column mobile grid is preserved; at 390px cards are narrow and some thumbnail labels/watched badges are clipped. No player styling or global layout redesign is part of this task. The player itself remains contained and does not crop footage.

## Final verification results

- **PASS:** 13 focused Node tests, including unchanged first four entries, the allowed fifth-entry correction, all eight canonical IDs/schema/assets, old five-ID history compatibility and both decision branches.
- **PASS:** Chromium 151.0.7922.34 browser flow for all eight videos: metadata/posters, real playback, pause without advancement, resume, natural end at accelerated playback, seeking to the end, replay with readiness retained, early end, correct Accept/Reject reveals and fresh state when reopening. No JavaScript page errors. No MP4 requests in the library; only the selected video's URL requested during each scenario.
- **PASS:** watched badges survive reload; all eight cards fit document bounds at 1440, 768 and 390px. Desktop/mobile screenshots inspected. Reduced-motion setting, keyboard selection, visible focus outlines and hub return checked.
- **PASS:** supplemental checks on every video: unmuted audio bytes decoded in Chromium, fullscreen enter/exit, mobile player `object-fit: contain`, keyboard Tab/Shift+Tab and Enter. Audio decoding does not imply a human listening review.
- **PASS with existing limitation:** intentionally intercepted missing video produces a native media error, does not auto-enable decisions and permits back navigation. There is no custom load-error message or retry button; the existing player is unchanged.
- **PASS:** eight SHA-256 source/destination matches and original source files intact; all eight source files had already passed full FFmpeg audio/video decoding. No media dependencies, conversion or external uploads added.
- **PASS:** platform `tsc --noEmit --incremental false`, production `next build` (51/51 generated entries), and `git diff --check`.
- **BLOCKED:** `next lint` exits at the existing ESLint setup prompt. No linter setup was added.
- **PRESERVED:** previous login-form and dev-login edits match their pre-update SHA-256 hashes. No unrelated game/platform implementation changed; no push, deployment or database write performed.
- **RUNNING:** the local development server was restarted on `http://127.0.0.1:3000` after the build.

Browser testing used isolated contexts and intercepted result writes; live Supabase persistence and other browser engines were not tested. Complete audio anonymity and verbatim script agreement remain unverified, as described above.
