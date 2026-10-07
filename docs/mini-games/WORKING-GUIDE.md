# Working on the merged mini-games

Read [README.md](README.md) for the verified 26-game inventory, implementation paths, audit results and known issues. This guide governs the mini-game scope described there; it does not authorize changes to other CDP products.

## Before editing

1. Read current repository/ancestor instructions, then check `git branch --show-current` and `git status --short`. Preserve unrelated or user changes. At the initial audit the branch was `shubhgames`, with local login-form and `/dev-login` work already present.
2. Confirm the requested game and exact change. Locate its current `page.tsx` import, implementation, CSS, `_data`, `_lib`, and shared consumers. Do not assume the source repositories' paths or build commands apply here.
3. Review the current behavior before implementing: entry screen, instructions, scenario selection, decision controls, timer, feedback, result screen, replay, persistence and return path. Save representative desktop/mobile screenshots when visuals are involved.
4. Read the game's result-sync effect as well as its authored rules. The catalogue's summary score is not necessarily the game's own grade; some games deliberately have no right/wrong score.
5. Establish a relevant baseline using the commands below. Label unavailable checks explicitly. Do not use production credentials or live database writes to test a UI change.

Useful PowerShell searches from the repository root:

```powershell
git branch --show-current
git status --short
rg --files --hidden -g AGENTS.md -g '!node_modules' -g '!.git' -g '!.next'
rg --files --hidden 'apps/platform/src/app/(app)/mini-games'
rg -n --hidden 'useMiniGameResultSync|localStorage|sessionStorage' 'apps/platform/src/app/(app)/mini-games'
rg -n --hidden 'MiniGameShell|VcGameShell|select-unseen-item|use-entry-enter-shortcut' apps/platform/src
```

Quote paths containing `(app)` in PowerShell. Prefer targeted reads over copying an entire source repository into this one.

## Change boundaries

- Preserve game rules, scoring, scenarios, timers, feedback, visuals and animations unless the user requests their modification. Do not silently “standardize” scores or timings across games.
- Keep changes within the requested game and required dependencies. Review every consumer before editing shared helpers, CSS globals, shells, result sync, types or catalogue metadata.
- Keep all five independent pathway hubs. Available cards must remain native full-card links, with usable focus, browser open-in-new-tab behavior, accessible names and no nested buttons/anchors. Do not replace them with click handlers on generic containers.
- Every game must retain a working path to its own hub. Intermediate “Back to introduction”, “Choose Mode” and “Back to Videos” states must eventually reach that hub. Test both direct URL entry and navigation from its hub.
- Preserve `vc-games/founder-interrogation-dev`: the real public Founder Interrogation page imports it. Its storage key also includes `-dev`. Do not rename folders or keys as cosmetic cleanup.
- Do not touch Deal Sprint, Panic Trade, Wealth Architect, Term Sheet Builder, Fintech Launch, full simulations, platform-native VC Game or standalone Venture Capital simulation as part of these 26 games.
- Do not deploy, push, rewrite history, apply SQL/migrations, change databases, or alter unrelated platform features without an explicit instruction. Environment values and secrets never belong in these docs or screenshots.

## Where changes belong

| Requested change | Start here; inspect dependencies before editing |
| --- | --- |
| Game interaction, timer, phase or scoring | Its implementation and `_lib` reducer/engine/scoring files; `_data` is the authored source of scenarios and feedback. |
| Game visuals | Its CSS module and local `_components`; avoid global palette/type changes. |
| Hub card | Hub `page.tsx`, local `_data/games.ts` and card/art component; PW links are inline. Check all cards at both widths. |
| Title, URL or game identity | Page metadata, hub registry, `src/lib/data/games.ts`, back links, API hub/slug validation, and persistence compatibility. These are distinct representations. |
| Shared back/header UI | `components/mini-games/MiniGameShell.tsx`, `vc-games/_components/VcGameShell.tsx`, or the five Future of Finance `*Frame.tsx` files; inspect platform AppShell too. |
| Progress | Game's sync effect, `use-mini-game-result-sync.ts`, `lib/mini-games.ts`, `lib/mini-games-server.ts`, API and shared types. Database changes require separate authorization. |
| Rotation/Enter shortcut | Shared helpers physically inside `vc-games/_lib`; all pathways import them. |
| Speech | Private Wealth shared TTS hook and the game's wrapper/callers. Test cancellation on navigation. |
| Founder media | The actual `founder-interrogation-dev/_data/founder-pitch-videos.ts`, player/library/reveal, and `public/pitch-videos`. Read the current [Founder update](FOUNDER-VIDEO-UPDATE.md) and its audio-review limitations. |

Do not remove imports because a folder looks experimental. The `.js` sibling of `select-unseen-item.ts` also needs resolution/consumer review before any cleanup. A file named `*-test-fixture.ts` is not evidence that tests are running.

## Local operation and checks

From the repository root:

```powershell
pnpm.cmd install --frozen-lockfile
pnpm.cmd --filter platform dev
pnpm.cmd --filter platform exec tsc --noEmit --incremental false
pnpm.cmd --filter platform build
```

Root `pnpm.cmd dev` / `pnpm.cmd build` use Turbo and currently target the same application. Use `pnpm` instead of `pnpm.cmd` on non-Windows shells. Do not change the pinned pnpm version, lockfile or script policy just to work around local setup.

If pnpm's wrapper is blocked but dependencies are installed, from `apps/platform`:

```powershell
node node_modules/next/dist/bin/next dev --hostname 127.0.0.1 --port 3000
node node_modules/typescript/bin/tsc --noEmit --incremental false
node node_modules/next/dist/bin/next build
```

Stop the local dev server before building into the same `.next` directory, then restart it after verification. Do not delete source files, tracked work, or another application's server process as a cleanup shortcut.

For offline preview, leave Supabase unconfigured and use `/mini-games` directly or the existing development-only `/dev-login` link. This uses sample identity/data and does not test real authentication. If credentials are already configured, do not overwrite them or exercise writes; use an isolated local environment with explicit test configuration.

**Lint is not ready:** `pnpm.cmd --filter platform lint` delegates to `next lint` and currently prompts for ESLint setup. Do not answer that prompt or install/configure a linter as an incidental game change. Record it as blocked unless tooling setup is within the requested scope. A successful build is not a substitute for a working lint configuration.

**No project-wide test command exists yet.** Founder Interrogation now has a focused Node/browser suite; see [its update handoff](FOUNDER-VIDEO-UPDATE.md). The initial audit executed existing content validators using a temporary TypeScript harness and ran temporary Chromium browser checks. That tooling is not committed. For future logic work, select meaningful checks for the changed behavior; if a repeatable suite is requested, add an explicit runner/configuration and real assertions rather than inventing a `pnpm test` claim.

The existing `_lib/validate-*.ts` functions cover 18 games (The Reference Call has two validators). Some are called by data imports or scenario selection; some return issue arrays rather than throw. Ensure returned issues are checked. Use the inventory to find their actual current data exports. These validators check content structure and constraints, not all reducer/scoring/timing behavior.

## Verification for a game change

Use an isolated browser context so checks do not clear or alter the user's saved progress. Confirm the offline/test backend before completing runs. If necessary, intercept progress POSTs in browser tests; report that real persistence was not exercised.

1. **Routes and cards:** open the owning hub, open the card by mouse and keyboard, visit the game directly, refresh, complete/retry as relevant, and return to its own hub. Inspect back behavior in active and result phases, not only the intro.
2. **Desktop/mobile:** inspect the hub at approximately 1440px and 390px and at any affected breakpoint. Check document overflow, card text/art collisions, tap targets, sticky platform header/sidebar and game-area width. The platform shell reduces available desktop width relative to the original standalone games.
3. **Keyboard and focus:** Tab/Shift+Tab, Enter/Space where appropriate, game shortcuts, drag/drop alternatives, dialogs, disabled controls and focus after transitions. Native anchors and a CSS focus rule are necessary but not complete keyboard-gameplay testing.
4. **Reduced motion:** emulate `prefers-reduced-motion: reduce` before loading. Check CSS transitions and JS/GSAP branches, including intro/results. Preserve functional timers and authored decision windows.
5. **Rules and results:** exercise changed decision branches, score/outcome boundaries, scenario selection, locks against duplicate actions and retry/reset. Verify result sync exactly as applicable; do not infer all scenarios are covered from one successful run.
6. **Storage:** preserve existing key/version formats. Test fresh state, reload, seen-history rotation, malformed/unsupported stored values and denied storage when relevant. Run state is generally not persisted. Never clear all origin storage in the user's browser.
7. **Integration:** check browser console/errors and network failures; type-check and build as appropriate. If a shared component changed, test all affected consumers/pathways. Compare unrelated diff files with the starting baseline.

For persistence work, explicitly test account isolation, offline-to-online transitions, duplicate submissions and concurrent updates in an authorized test backend. The current origin-wide mirror, lack of offline replay and non-atomic counters are documented limitations, not behaviors to silently change during a visual edit.

For Founder Interrogation media work, first read the existing media README and the corrected paths in this handoff. Before claiming readiness, review complete audio/video anonymity, all eight library cards, playback/error/autoplay handling, explicit/natural-end decision gating, Accept/Reject locks, reveal, watched persistence, back navigation, focus and reduced motion. The previous source README's “both routes” instruction does not create a second route here.

## Handoff after future changes

Report the requested change, files/shared consumers affected, preserved behavior, exact checks and results, any unverified or blocked checks, and remaining risks. Update the inventory only when actual paths/contracts change. Distinguish a confirmed defect from a test hypothesis and a source comment from observed behavior.

Before finishing, run `git diff --check` and `git status --short`. Preserve existing work and leave unrelated platform features, simulations, credentials and deployment state untouched.
