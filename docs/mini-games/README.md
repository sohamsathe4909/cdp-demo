# Mini-games: verified repository handoff

Audited 2026-09-30 on branch `shubhgames`, HEAD `5a22749`. This document describes this checkout, not the original game repositories. See [WORKING-GUIDE.md](WORKING-GUIDE.md) before changing a game.

> Subsequent Founder Interrogation update: the library now has eight pitches, including the approved GoZoomo correction. See [FOUNDER-VIDEO-UPDATE.md](FOUNDER-VIDEO-UPDATE.md) for current media, behavior and validation. Audit results below describe the original baseline unless noted.

## Scope and starting state

Exactly **26 games across five hubs** are present: Venture Capital 6, Private Wealth 5, Investment Banking 5, Equity Research 5, Future of Finance 5. They are routes inside the existing platform, not independently deployed applications.

Excluded: Deal Sprint, Panic Trade, Wealth Architect, Term Sheet Builder, Fintech Launch, the platform-native VC Game, and the standalone Venture Capital simulation. These are separate products; this audit neither changed nor removed them. No implementations for those excluded products were identified in this checkout's application route tree. Do not infer that they were renamed into these mini-games.

No `AGENTS.md` was found in the repository or checked ancestor directories. The user's scope and preservation instructions govern this handoff. The working tree was already dirty:

```text
 M apps/platform/src/components/auth/login-form.tsx
?? apps/platform/src/app/dev-login/
```

These local login changes were preserved byte-for-byte. This task adds only this README and the working guide. No credentials, database changes, deployment, push, or history rewrite were used. Git could not read the user's global ignore file in this sandbox; repository status/diff commands otherwise worked.

## Repository and route architecture

```text
package.json / pnpm-lock.yaml / pnpm-workspace.yaml / turbo.json
apps/platform/                  Next.js application (port 3000)
  src/app/layout.tsx             document, global CSS, Google Fonts links
  src/app/(app)/layout.tsx       server auth lookup and AppShell
  src/app/(app)/mini-games/
    layout.tsx                  .mini-games-scope typography wrapper
    page.tsx                    authenticated catalogue + initial progress
    <hub>/page.tsx              five independent pathway hubs
    <hub>/<game>/page.tsx       metadata + client implementation import
  src/components/mini-games/    shared shells, catalogue, result-sync hook
  src/app/api/mini-games/progress/route.ts
  public/images/                hub raster illustrations
  public/pitch-videos/           Founder Interrogation video library
packages/types/src/index.ts     shared platform and mini-game types
infrastructure/
  supabase/migrations/0007_mini_games.sql
  caddy/Caddyfile
```

Only `apps/platform` and `packages/types` currently exist as workspace packages (plus the workspace root). The `apps/sims/*` workspace glob does not mean simulation packages exist here. There is no separate mini-game package, Vite root, game server, iframe, or mini-game-specific deployment entry point.

`@/*` resolves to `apps/platform/src/*`; `@cdp/types` resolves to `packages/types/src/index.ts`. Next also transpiles `@cdp/types`. All game entry pages have real imports, and all 26 implementations call `useMiniGameResultSync`. The five Future of Finance games have their own local `*Frame` components; other games use `MiniGameShell` directly or through `VcGameShell`.

The inherited `AppShell` supplies the sticky platform header, desktop sidebar, mobile navigation, and an outer `<main>`. Game state lives in local React state/reducers; there is no additional global game provider in these layouts. Drag-and-drop contexts and GSAP contexts are local to their game components. The app's restored-page handler checks the session on a browser back/forward-cache restore.

## Verified inventory

Path conventions used below:

- **M** = `apps/platform/src/app/(app)/mini-games`.
- Each game URL corresponds to `M/<hub>/<slug>/page.tsx`.
- The implementation, primary CSS module, `_data/`, `_lib/`, and optional `_components/` live together in that game's directory, **except Founder Interrogation**, whose implementation directory is `vc-games/founder-interrogation-dev`.
- Data filenames below are relative to that implementation directory's `_data/`. Logic filenames are relative to `_lib/`. Implementation links point to the actual files.

### Venture Capital: 6 games

Hub: `/mini-games/vc-games` maps to `M/vc-games/page.tsx`; hub style: `M/vc-games/vc-games.module.css`.

| Game / exact URL | Implementation | CSS module |
| --- | --- | --- |
| Deal Speed Round<br>`/mini-games/vc-games/deal-speed-round` | [DealSpeedRound.tsx](<../../apps/platform/src/app/(app)/mini-games/vc-games/deal-speed-round/DealSpeedRound.tsx>) | [deal-speed-round.module.css](<../../apps/platform/src/app/(app)/mini-games/vc-games/deal-speed-round/deal-speed-round.module.css>) |
| The Pitch Sprint<br>`/mini-games/vc-games/the-pitch-sprint` | [ThePitchSprint.tsx](<../../apps/platform/src/app/(app)/mini-games/vc-games/the-pitch-sprint/ThePitchSprint.tsx>) | [the-pitch-sprint.module.css](<../../apps/platform/src/app/(app)/mini-games/vc-games/the-pitch-sprint/the-pitch-sprint.module.css>) |
| Build the Pitch<br>`/mini-games/vc-games/build-the-pitch` | [BuildThePitch.tsx](<../../apps/platform/src/app/(app)/mini-games/vc-games/build-the-pitch/BuildThePitch.tsx>) | [build-the-pitch.module.css](<../../apps/platform/src/app/(app)/mini-games/vc-games/build-the-pitch/build-the-pitch.module.css>)<br>[vc-field-guide.module.css](<../../apps/platform/src/app/(app)/mini-games/vc-games/build-the-pitch/_components/vc-field-guide.module.css>) |
| Investor Match<br>`/mini-games/vc-games/investor-match` | [InvestorMatch.tsx](<../../apps/platform/src/app/(app)/mini-games/vc-games/investor-match/InvestorMatch.tsx>) | [investor-match.module.css](<../../apps/platform/src/app/(app)/mini-games/vc-games/investor-match/investor-match.module.css>) |
| The Reference Call<br>`/mini-games/vc-games/the-reference-call` | [TheReferenceCall.tsx](<../../apps/platform/src/app/(app)/mini-games/vc-games/the-reference-call/TheReferenceCall.tsx>) | [the-reference-call.module.css](<../../apps/platform/src/app/(app)/mini-games/vc-games/the-reference-call/the-reference-call.module.css>) |
| Founder Interrogation<br>`/mini-games/vc-games/founder-interrogation` | [FounderInterrogation.tsx](<../../apps/platform/src/app/(app)/mini-games/vc-games/founder-interrogation-dev/FounderInterrogation.tsx>) | [founder-interrogation.module.css](<../../apps/platform/src/app/(app)/mini-games/vc-games/founder-interrogation-dev/founder-interrogation.module.css>) |

| Game directory | Authored data (`_data/`) | Main state / calculation files (`_lib/`) |
| --- | --- | --- |
| `deal-speed-round` | `signals.ts` | `deal-speed-round-state.ts` |
| `the-pitch-sprint` | `pitch-sets.ts` | `pitch-sprint-state.ts` |
| `build-the-pitch` | `burn-runway-scenarios.ts`, `math-puzzle-scenarios.ts`, `revenue-growth-scenarios.ts`, `valuation-ownership-scenarios.ts`, `vc-field-guide.ts` | `build-pitch-state.ts` |
| `investor-match` | `investor-match-scenarios.ts` | `investor-match-state.ts` |
| `the-reference-call` | `founder-pitch-transcripts.ts`, `reference-call-transcripts.ts` | `reference-call-state.ts` |
| `founder-interrogation-dev` | `founder-pitch-videos.ts` | `founder-interrogation-state.ts` |

### Private Wealth: 5 games

Hub: `/mini-games/private-wealth-games` maps to `M/private-wealth-games/page.tsx`; hub style: `M/private-wealth-games/private-wealth-games.module.css`.

| Game / exact URL | Implementation | CSS module |
| --- | --- | --- |
| Client Dossier<br>`/mini-games/private-wealth-games/client-dossier` | [ClientDossier.tsx](<../../apps/platform/src/app/(app)/mini-games/private-wealth-games/client-dossier/ClientDossier.tsx>) | [client-dossier.module.css](<../../apps/platform/src/app/(app)/mini-games/private-wealth-games/client-dossier/client-dossier.module.css>) |
| Would You Push Back?<br>`/mini-games/private-wealth-games/would-you-push-back` | [WouldYouPushBack.tsx](<../../apps/platform/src/app/(app)/mini-games/private-wealth-games/would-you-push-back/WouldYouPushBack.tsx>) | [would-you-push-back.module.css](<../../apps/platform/src/app/(app)/mini-games/private-wealth-games/would-you-push-back/would-you-push-back.module.css>) |
| Panic Call<br>`/mini-games/private-wealth-games/panic-call` | [PanicCall.tsx](<../../apps/platform/src/app/(app)/mini-games/private-wealth-games/panic-call/PanicCall.tsx>) | [panic-call.module.css](<../../apps/platform/src/app/(app)/mini-games/private-wealth-games/panic-call/panic-call.module.css>) |
| Rebalance the Drift<br>`/mini-games/private-wealth-games/rebalance-the-drift` | [RebalanceTheDrift.tsx](<../../apps/platform/src/app/(app)/mini-games/private-wealth-games/rebalance-the-drift/RebalanceTheDrift.tsx>) | [rebalance-the-drift.module.css](<../../apps/platform/src/app/(app)/mini-games/private-wealth-games/rebalance-the-drift/rebalance-the-drift.module.css>) |
| Client Timeline<br>`/mini-games/private-wealth-games/client-timeline` | [ClientTimeline.tsx](<../../apps/platform/src/app/(app)/mini-games/private-wealth-games/client-timeline/ClientTimeline.tsx>) | [client-timeline.module.css](<../../apps/platform/src/app/(app)/mini-games/private-wealth-games/client-timeline/client-timeline.module.css>) |

| Game directory | Authored data (`_data/`) | Main state / calculation files (`_lib/`) |
| --- | --- | --- |
| `client-dossier` | `client-dossiers.ts` | `client-dossier-state.ts` |
| `would-you-push-back` | `push-back-sets.ts` | `push-back-state.ts` |
| `panic-call` | `panic-call-scenarios.ts` | `panic-call-state.ts` |
| `rebalance-the-drift` | `rebalance-scenarios.ts` | `allocation-math.ts`, `rebalance-state.ts` |
| `client-timeline` | `client-timeline-scenarios.ts` | `client-timeline-state.ts` |

### Investment Banking: 5 games

Hub: `/mini-games/investment-banking-games` maps to `M/investment-banking-games/page.tsx`; hub style: `M/investment-banking-games/investment-banking-games.module.css`.

| Game / exact URL | Implementation | CSS module |
| --- | --- | --- |
| The Comps Screen<br>`/mini-games/investment-banking-games/the-comps-screen` | [TheCompsScreen.tsx](<../../apps/platform/src/app/(app)/mini-games/investment-banking-games/the-comps-screen/TheCompsScreen.tsx>) | [the-comps-screen.module.css](<../../apps/platform/src/app/(app)/mini-games/investment-banking-games/the-comps-screen/the-comps-screen.module.css>) |
| Counteroffer<br>`/mini-games/investment-banking-games/counteroffer` | [Counteroffer.tsx](<../../apps/platform/src/app/(app)/mini-games/investment-banking-games/counteroffer/Counteroffer.tsx>) | [counteroffer.module.css](<../../apps/platform/src/app/(app)/mini-games/investment-banking-games/counteroffer/counteroffer.module.css>) |
| Bidding War<br>`/mini-games/investment-banking-games/bidding-war` | [BiddingWar.tsx](<../../apps/platform/src/app/(app)/mini-games/investment-banking-games/bidding-war/BiddingWar.tsx>) | [bidding-war.module.css](<../../apps/platform/src/app/(app)/mini-games/investment-banking-games/bidding-war/bidding-war.module.css>) |
| Football Field Builder<br>`/mini-games/investment-banking-games/football-field-builder` | [FootballFieldBuilder.tsx](<../../apps/platform/src/app/(app)/mini-games/investment-banking-games/football-field-builder/FootballFieldBuilder.tsx>) | [football-field-builder.module.css](<../../apps/platform/src/app/(app)/mini-games/investment-banking-games/football-field-builder/football-field-builder.module.css>) |
| The All-Nighter<br>`/mini-games/investment-banking-games/the-all-nighter` | [AllNighter.tsx](<../../apps/platform/src/app/(app)/mini-games/investment-banking-games/the-all-nighter/AllNighter.tsx>) | [the-all-nighter.module.css](<../../apps/platform/src/app/(app)/mini-games/investment-banking-games/the-all-nighter/the-all-nighter.module.css>) |

| Game directory | Authored data (`_data/`) | Main state / calculation files (`_lib/`) |
| --- | --- | --- |
| `the-comps-screen` | `comps-scenarios.ts` | `comps-screen-state.ts` |
| `counteroffer` | `counteroffer-scenarios.ts` | `counteroffer-scoring.ts`, `counteroffer-state.ts` |
| `bidding-war` | `bidding-war-scenarios.ts` | `bidding-war-resolution.ts`, `bidding-war-state.ts` |
| `football-field-builder` | `football-field-scenarios.ts` | `football-field-scoring.ts`, `football-field-state.ts` |
| `the-all-nighter` | `all-nighter-scenarios.ts` | `all-nighter-engine.ts`, `all-nighter-state.ts` |

### Equity Research: 5 games

Hub: `/mini-games/equity-research-games` maps to `M/equity-research-games/page.tsx`; hub style: `M/equity-research-games/equity-research-games.module.css`.

| Game / exact URL | Implementation | CSS module |
| --- | --- | --- |
| Read the Chart<br>`/mini-games/equity-research-games/read-the-chart` | [ReadTheChart.tsx](<../../apps/platform/src/app/(app)/mini-games/equity-research-games/read-the-chart/ReadTheChart.tsx>) | [read-the-chart.module.css](<../../apps/platform/src/app/(app)/mini-games/equity-research-games/read-the-chart/read-the-chart.module.css>) |
| Thesis Defense<br>`/mini-games/equity-research-games/thesis-defense` | [ThesisDefense.tsx](<../../apps/platform/src/app/(app)/mini-games/equity-research-games/thesis-defense/ThesisDefense.tsx>) | [thesis-defense.module.css](<../../apps/platform/src/app/(app)/mini-games/equity-research-games/thesis-defense/thesis-defense.module.css>) |
| The Analyst Note Editor<br>`/mini-games/equity-research-games/the-analyst-note-editor` | [AnalystNoteEditor.tsx](<../../apps/platform/src/app/(app)/mini-games/equity-research-games/the-analyst-note-editor/AnalystNoteEditor.tsx>) | [analyst-note-editor.module.css](<../../apps/platform/src/app/(app)/mini-games/equity-research-games/the-analyst-note-editor/analyst-note-editor.module.css>) |
| Model Update Reflex<br>`/mini-games/equity-research-games/model-update-reflex` | [ModelUpdateReflex.tsx](<../../apps/platform/src/app/(app)/mini-games/equity-research-games/model-update-reflex/ModelUpdateReflex.tsx>) | [model-update-reflex.module.css](<../../apps/platform/src/app/(app)/mini-games/equity-research-games/model-update-reflex/model-update-reflex.module.css>) |
| Variant Perception<br>`/mini-games/equity-research-games/variant-perception` | [VariantPerception.tsx](<../../apps/platform/src/app/(app)/mini-games/equity-research-games/variant-perception/VariantPerception.tsx>) | [variant-perception.module.css](<../../apps/platform/src/app/(app)/mini-games/equity-research-games/variant-perception/variant-perception.module.css>) |

| Game directory | Authored data (`_data/`) | Main state / calculation files (`_lib/`) |
| --- | --- | --- |
| `read-the-chart` | `chart-scenarios.ts` | `read-the-chart-state.ts` |
| `thesis-defense` | `thesis-defense-scenarios.ts` | `thesis-defense-state.ts` |
| `the-analyst-note-editor` | `analyst-note-scenarios.ts` | `analyst-note-state.ts` |
| `model-update-reflex` | `model-update-scenarios.ts` | `model-update-state.ts` |
| `variant-perception` | `variant-perception-scenarios.ts` | `variant-perception-state.ts` |

### Future of Finance: 5 games

Hub: `/mini-games/future-of-finance-games` maps to `M/future-of-finance-games/page.tsx`; hub style: `M/future-of-finance-games/future-of-finance-games.module.css`.

| Game / exact URL | Implementation | CSS module |
| --- | --- | --- |
| Fraud Signal Triage<br>`/mini-games/future-of-finance-games/fraud-signal-triage` | [FraudSignalTriage.tsx](<../../apps/platform/src/app/(app)/mini-games/future-of-finance-games/fraud-signal-triage/FraudSignalTriage.tsx>) | [fraud-signal-triage.module.css](<../../apps/platform/src/app/(app)/mini-games/future-of-finance-games/fraud-signal-triage/fraud-signal-triage.module.css>) |
| Read the Order Book<br>`/mini-games/future-of-finance-games/read-the-order-book` | [ReadTheOrderBook.tsx](<../../apps/platform/src/app/(app)/mini-games/future-of-finance-games/read-the-order-book/ReadTheOrderBook.tsx>) | [read-the-order-book.module.css](<../../apps/platform/src/app/(app)/mini-games/future-of-finance-games/read-the-order-book/read-the-order-book.module.css>) |
| Smart Contract Audit<br>`/mini-games/future-of-finance-games/smart-contract-audit` | [SmartContractAudit.tsx](<../../apps/platform/src/app/(app)/mini-games/future-of-finance-games/smart-contract-audit/SmartContractAudit.tsx>) | [smart-contract-audit.module.css](<../../apps/platform/src/app/(app)/mini-games/future-of-finance-games/smart-contract-audit/smart-contract-audit.module.css>) |
| Liquidity Pool Balancer<br>`/mini-games/future-of-finance-games/liquidity-pool-balancer` | [LiquidityPoolBalancer.tsx](<../../apps/platform/src/app/(app)/mini-games/future-of-finance-games/liquidity-pool-balancer/LiquidityPoolBalancer.tsx>) | [liquidity-pool-balancer.module.css](<../../apps/platform/src/app/(app)/mini-games/future-of-finance-games/liquidity-pool-balancer/liquidity-pool-balancer.module.css>) |
| Build the Trading Algorithm<br>`/mini-games/future-of-finance-games/build-the-trading-algorithm` | [BuildTheTradingAlgorithm.tsx](<../../apps/platform/src/app/(app)/mini-games/future-of-finance-games/build-the-trading-algorithm/BuildTheTradingAlgorithm.tsx>) | [build-the-trading-algorithm.module.css](<../../apps/platform/src/app/(app)/mini-games/future-of-finance-games/build-the-trading-algorithm/build-the-trading-algorithm.module.css>) |

| Game directory | Authored data (`_data/`) | Main state / calculation files (`_lib/`) |
| --- | --- | --- |
| `fraud-signal-triage` | `fraud-triage-scenarios.ts` | `fraud-triage-state.ts` |
| `read-the-order-book` | `order-book-scenarios.ts` | `order-book-state.ts` |
| `smart-contract-audit` | `smart-contract-scenarios.ts` | `smart-contract-state.ts` |
| `liquidity-pool-balancer` | `liquidity-pool-scenarios.ts` | `liquidity-pool-state.ts` |
| `build-the-trading-algorithm` | `trading-scenarios.ts` | `simulate-trading-strategy.ts`, `trading-state.ts` |

The public Founder Interrogation route imports `../founder-interrogation-dev/FounderInterrogation`. The `-dev` directory has no `page.tsx`; it is a live implementation dependency, not a second route or disposable prototype.

## Shared code, dependencies, and styling

The root pins **pnpm 12.4.2**; `pnpm-lock.yaml` is the lockfile and Turbo orchestrates root `dev`, `build`, and `lint`. The platform declares Next **15.5.26**, React/React DOM `^19.0.0`, TypeScript `^5.8.2`, and Tailwind `^4.0.9`. These are package declarations, not a claim that every resolved dependency equals the lower bound.

| Dependency or shared area | Verified use and impact |
| --- | --- |
| React / React DOM / Next | Client game state, portals, links, metadata, image optimization, layouts and routes. |
| `@dnd-kit/core`, `@dnd-kit/utilities` | Build the Pitch and The Comps Screen drag/drop controls. Preserve their alternative controls and sensors. |
| `gsap`, `@gsap/react` | Build the Pitch, Investor Match/outcomes, The Pitch Sprint reveal, The Reference Call result entrance, Founder Interrogation player, Client Timeline. |
| `lucide-react` | Game/platform icons. |
| `@supabase/ssr`, `@supabase/supabase-js` | Platform authentication and optional shared progress persistence, not per-game standalone services. |
| `@cdp/types` | `MiniGameHub`, `MiniGameProgress`, `MiniGameProgressPayload`, `MiniGameResultInput`; catalogue IDs and API result shapes must agree. |
| `components/mini-games/MiniGameShell.tsx` + CSS | Shared header/back-link layout. `VcGameShell` wraps it with the VC hub destination. |
| `components/mini-games/MiniGameHubPortalLink.tsx` | All five hubs' return-to-catalogue link. |
| `vc-games/_lib/use-entry-enter-shortcut.ts` | Also imported by all 20 non-VC games. A change here affects every pathway. |
| `vc-games/_lib/select-unseen-item.ts` | Rotation helper shared across pathways. A checked-in `.js` sibling also exists; see maintenance risks. |
| VC `VcPrimaryButton`, `CountdownBar`, `DecisionControls`, `_lib/decision-controls.ts` | Also used by Private Wealth components. Folder location does not imply VC-only scope. |
| `private-wealth-games/_lib/use-private-wealth-tts.ts` | Browser Speech Synthesis support; Client Dossier adds a local wrapper. Voice availability depends on the browser/OS. |

Platform dependencies `motion` and `recharts` exist, but the mini-game subtree has no direct imports of them in the audited source. Do not add a second dependency manifest for a game.

Each hub has its own `<hub>.module.css`; each game has the CSS module listed above. `globals.css` supplies `.mini-games-scope`, Lato body text, Rethink Sans headings, a visible-focus rule, and scoped reduced-motion CSS. `.mini-games-catalog` opts back into the platform's Archivo font. The root document links Google Fonts; offline font fidelity is therefore not guaranteed. JS animation code also contains reduced-motion branches; CSS alone does not suppress GSAP animations or gameplay timers.

Timed behavior exists in Deal Speed Round, The Pitch Sprint, Client Dossier, Would You Push Back?, Panic Call, The Reference Call, and The All-Nighter. The All-Nighter reconciles against `performance.now()` and visibility changes. Preserve authored timings, cleanup and focus transitions; do not equate reduced motion with disabling game rules.

## Assets and media

All **21 literal mini-game raster/video asset references** checked exist under `apps/platform/public`:

- Six VC hub PNGs in `images/vc-games/`, named for the six route slugs.
- Five Private Wealth hub PNGs in `images/private-wealth-games/`, named `<slug>-hub-v2.png`.
- Founder Interrogation: `pitch-videos/pitch-01.mp4` through `pitch-08.mp4`, and matching `pitch-videos/thumbnails/pitch-01.jpg` through `pitch-08.jpg` (expanded after the initial audit).

Equity Research, Investment Banking, and Future of Finance hub art is authored markup/SVG in their local `_components/*HubArt.tsx` or `FutureFinanceCardArt.tsx`. Game charts and illustrations are also local components; a missing PNG with a similar name is not automatically a missing dependency. Hub screenshots showed the supplied illustrations rendering.

Founder Interrogation's live library is `M/vc-games/founder-interrogation-dev/_data/founder-pitch-videos.ts`, rendered by `PitchLibrary`, `PitchPlayer`, and `PitchReveal`. Browser HTML5 video controls, end/explicit-end decision gating, and watched IDs are part of its current behavior.

**Existing media hold:** [the media README](../../apps/platform/public/pitch-videos/README.md) contains a 2026-09-19 handoff saying edits to remove opening company-name mentions are pending, reveal text is a draft, and current MP4 exports are not finished publication media. This audit verified file presence, not full playback, audio anonymity, codecs, or factual reveal copy. That README's source-repository path and reference to “both” Founder routes are stale for this merged checkout; the inventory above is authoritative. Do not infer that the original MOV masters or editor's source directory exist here.

## Platform navigation and authentication

1. `components/layout/app-sidebar.tsx` links to `/mini-games`.
2. The catalogue in `components/mini-games/mini-games-board.tsx` uses `lib/data/games.ts` (`gamesMeta`, exactly 26 entries). Filter pills select pathways; the filtered view exposes a link to that pathway's full hub. Catalogue cards link directly to games.
3. VC, IB, ER and Future of Finance hubs use local `_data/games.ts` registries and card components. Private Wealth's five card links are inline in its `page.tsx`. All currently available hub cards are full-card Next `Link` elements rendered as native anchors, without nested interactive controls.
4. A game's initial header returns to its own hub. Founder Interrogation walks back through videos/library/intro; The Reference Call can first return to mode selection; Future of Finance frames first return to the introduction during play. These are deliberate intermediate states, not destinations to other pathways.
5. Every hub's portal link returns to `/mini-games`. `lib/mini-game-return.ts` currently has an empty `rememberMiniGameReturnPath()` and a constant `/mini-games` return value. “Back to Careers” logic in the portal component is not active with this implementation. Do not assume a source repository's remembered-career navigation survived the merge.

The catalogue and game registries are separate representations and need coordinated changes when a route/title changes. The progress API accepts a hub/slug only if its full href appears in `gamesMeta`. `gameId` in that metadata (for example `ib-the-comps-screen`) is not the API's route slug (`the-comps-screen`). The current careers syllabus, dashboard learning-activity flow, and header search do not consume mini-game results or register these 26 games as lessons.

With Supabase configured, `src/middleware.ts` refreshes cookies, calls `auth.getUser()`, and redirects unauthenticated `/mini-games*` requests to `/login?redirectTo=...`. `(app)/layout.tsx` separately checks the server user. `src/proxy.ts` only re-exports this middleware as `proxy`; the pinned Next 15 build reports a Middleware entry. It is not a second mini-game auth implementation.

Without usable Supabase configuration, middleware passes through and the Supabase client helpers return the existing demo user. The fallback is not itself limited to development. The pre-existing local `/dev-login` addition is limited to development with no configured Supabase and redirects to the dashboard. This is offline preview behavior, not real account provisioning. No Supabase credentials were present in the audited environment; only `.env.local.example` was found.

## State and persistence

### Per-game browser state

Reducers and transient component state own the active run. Browser persistence primarily remembers rotation history, not resumable runs. The following keys are literal existing contracts; preserve spelling and version semantics.

| Game | Main localStorage key | Saved fields |
| --- | --- | --- |
| Deal Speed Round | `cdp:vc-games:deal-speed-round:v1` | version, bestStreak, recentSignalIds |
| The Pitch Sprint | `cdp:vc-games:the-pitch-sprint:v1` | version, lastSetId |
| Build the Pitch | `cdp:vc-games:build-the-pitch` | version, seenSectionIds, seenScenarioIdsBySection, lastTileOrders |
| Investor Match | `cdp:vc-games:investor-match` | version, recentScenarioIds, lastOfferOrders |
| The Reference Call | `cdp:vc-games:the-reference-call` | version, seenReferenceCallIds, seenFounderPitchIds |
| Founder Interrogation | `cdp:vc-games:founder-interrogation-dev` | version, watchedPitchIds |
| Client Dossier | `cdp:private-wealth-games:client-dossier:v2` | version, seenSetIds |
| Would You Push Back? | `cdp:private-wealth-games:would-you-push-back:v1` | version, seenSetIds |
| Panic Call | `cdp:private-wealth-games:panic-call:v1` | version, seenScenarioIds |
| Rebalance the Drift | `cdp:private-wealth-games:rebalance-the-drift:v1` | version, seenScenarioIds |
| Client Timeline | `cdp:private-wealth-games:client-timeline:v1` | version, seenScenarioIds |
| The Comps Screen | `cdp:investment-banking-games:the-comps-screen:v1` | version, seenScenarioIds, lastCandidateOrders |
| Counteroffer | `cdp:investment-banking-games:counteroffer:v1` | version, seenScenarioIds |
| Bidding War | `cdp:investment-banking-games:bidding-war:v1` | version, seenScenarioIds |
| Football Field Builder | `cdp:investment-banking-games:football-field-builder:v1` | version, seenScenarioIds |
| The All-Nighter | `cdp:investment-banking-games:all-nighter:v1` | version, seenScenarioIds |
| Read the Chart | `cdp:equity-research-games:read-the-chart:v1` | version, seenScenarioIds |
| Thesis Defense | `cdp:equity-research-games:thesis-defense:v1` | version, seenScenarioIds |
| The Analyst Note Editor | `cdp:equity-research-games:the-analyst-note-editor:v1` | version, seenScenarioIds |
| Model Update Reflex | `cdp:equity-research-games:model-update-reflex:v1` | version, seenScenarioIds |
| Variant Perception | `cdp:equity-research-games:variant-perception:v1` | version, seenScenarioIds |
| Fraud Signal Triage | `cdp:future-of-finance-games:fraud-signal-triage:v1` | version, seenScenarioIds |
| Read the Order Book | `cdp:future-of-finance-games:read-the-order-book:v1` | version, seenScenarioIds |
| Smart Contract Audit | `cdp:future-of-finance-games:smart-contract-audit:v1` | version, seenScenarioIds |
| Liquidity Pool Balancer | `cdp:future-of-finance-games:liquidity-pool-balancer:v1` | version, seenScenarioIds |
| Build the Trading Algorithm | `cdp:future-of-finance-games:build-the-trading-algorithm:v1` | version, seenScenarioIds |

Guide flags additionally use `cdp:private-wealth-games:rebalance-the-drift:guide:v1` and `cdp:investment-banking-games:the-all-nighter:guide:v1` (version/seen). The All-Nighter's history key uses `all-nighter`, while its route and guide key use `the-all-nighter`. Founder Interrogation's key deliberately retains `founder-interrogation-dev`.

Reads/writes are generally guarded with parsers, hydration flags and try/catch so storage remains optional. No `sessionStorage` use was found in the mini-game subtree. TTS settings and active decisions should not be assumed persisted just because scenario history is saved. Refreshing a game normally returns to its introduction rather than restoring the active run.

### Cross-game results and backend

```text
game's result-state effect
  -> useMiniGameResultSync (hub/slug from pathname)
  -> recordMiniGameResult
       -> localStorage: cdp:mini-games:progress:v1
       -> POST /api/mini-games/progress
            -> authenticated user's mini_game_progress row, if configured

/mini-games server page -> getMiniGameProgress(user.id)
  -> MiniGamesBoard -> merge server rows with this browser's mirror
```

`lib/mini-games.ts` validates mirror entries, clamps numeric values, increments plays/completed runs, keeps max score/streak, and stores latest outcome/timestamps. The result hook suppresses identical hub/game/outcome/score/streak payloads within **1,500 ms** in one mounted hook. It is not a durable per-run idempotency protocol. POST is fire-and-forget with `keepalive`; failures do not interrupt play.

`GET /api/mini-games/progress` returns `{ persisted, items }`. POST authenticates, validates the hub/slug, clamps scores/streaks, truncates outcomes, then reads and upserts a per-user summary. Without Supabase it returns `ok: true, persisted: false` without a database write. Read failures also fall back to `persisted: false`; that flag does not prove migration 0007 alone is the problem.

`infrastructure/supabase/migrations/0007_mini_games.sql` defines `public.mini_game_progress`, primary key `(user_id, hub, game_id)`, and authenticated own-row RLS. It was read, **not applied**. No live database or RLS behavior was tested.

The catalogue merges server and local rows **even when server persistence is available**. Whichever row has more plays wins; server wins equal counts. Counts are not added. Local history is not queued for later upload: a future POST reports only its new run, not all previous offline runs. All mini-game storage keys are origin-wide and **not scoped by user**. Platform logout does not clear them.

The progress endpoint is separate from `/api/progress` (learning activity) and `/api/careers/[careerId]/progress` (syllabus). It does not call `record_learning_activity` or advance career curricula. There is no global scoring scale: some games send percentages, some outcomes only; Client Dossier/Would You Push Back? report response tendencies. Do not treat the catalogue's “best” number as a cross-game mastery score or change authored game scoring to match it.

## Commands and deployment boundary

Run from the repository root unless stated. On Windows PowerShell use `pnpm.cmd` when execution policy blocks the `pnpm.ps1` wrapper; on other shells use `pnpm`.

| Task | Command | Status / limitation |
| --- | --- | --- |
| Install | `pnpm.cmd install --frozen-lockfile` | Pinned install succeeded in this conversation's local setup. No reinstall needed for this audit. Requires registry access for package-manager verification/downloads. |
| Run workspace | `pnpm.cmd dev` | Turbo runs platform's `next dev --port 3000`; types package has no dev server. |
| Run platform | `pnpm.cmd --filter platform dev` | App and all five hubs/26 games together. |
| Build workspace | `pnpm.cmd build` | Turbo runs platform build; no separate game build. |
| Build platform | `pnpm.cmd --filter platform build` | Underlying `next build` passed in this audit. |
| Start built app | `pnpm.cmd --filter platform start` | `next start --port 3000`; requires a completed build. Not a deployment. |
| Type-check | `pnpm.cmd --filter platform exec tsc --noEmit --incremental false` | Passed through the direct equivalent below; includes imported shared types. |
| Lint | `pnpm.cmd lint` or `pnpm.cmd --filter platform lint` | Configured, but not operational unattended: `next lint` prompts to create ESLint configuration; none or ESLint dependency is checked in. |
| Automated tests | No configured root/platform test command | No `*.test.*`/`*.spec.*`, Playwright/Vitest/Jest configuration or test-runner dependency found. `*-test-fixture.ts` files are data, not executable suites. |

Verified direct equivalents, from `apps/platform`, avoid this machine's pnpm wrapper/version-fetch problem without changing package versions:

```powershell
node node_modules/next/dist/bin/next dev --hostname 127.0.0.1 --port 3000
node node_modules/next/dist/bin/next build
node node_modules/typescript/bin/tsc --noEmit --incremental false
node node_modules/next/dist/bin/next lint
```

The last command is included to reproduce the lint blocker, not as a passing check. `packages/types` declares `typecheck: tsc --noEmit` but has no local `tsconfig.json` or TypeScript dependency; use the platform check for this merged tree. Do not advertise a successful independent types-package check.

`.npmrc` sets `ignore-scripts=true`; workspace configuration lists `sharp` in `allowBuilds`. Preserve those policies. Do not bypass package-manager integrity verification just to make a wrapper work.

`next.config.ts` enables React strict mode, transpiles the types workspace, and allows Unsplash images. There are no game-specific rewrites or base paths. Caddy routes the main site/API to `platform:3000`, `/socket.io*` to a gateway, and `/sims/equity*`, `/sims/venture*`, `/sims/pw*` to other services. Those service names are configuration references, not proof of implemented/running packages in this checkout. No tracked Docker/Compose, Vercel config or CI workflow was found. Deployment state and external services are **unverified**; nothing was deployed.

## Baseline results and limits

Environment: Windows PowerShell, Node `v24.19.0`, existing installed workspace dependencies. Checks used the unconfigured/offline Supabase fallback. Browser automation used existing Playwright Core `1.62.1` from another local tool installation and its Chromium `151.0.7922.34`; it was not added as a project dependency. Only the browser tool was reused, not source-repository game code or assumptions.

| Check | Result |
| --- | --- |
| Route/import inventory | **PASS:** 26 game pages, five hub pages, catalogue; no duplicate normalized page/handler route paths. All implementation imports resolve. |
| Local import/asset inspection | **PASS:** TypeScript module resolution plus CSS-path checks found no unresolved local imports; 21 literal `/images/` and `/pitch-videos/` references exist. Dynamic/external URL correctness is not implied. |
| TypeScript | **PASS:** `tsc --noEmit --incremental false`, exit 0. |
| Production build | **PASS:** `next build`, exit 0, 51/51 generated entries; route report contains catalogue, five hubs, all 26 games, progress API and Middleware. Only webpack cache large-string warnings observed. Build's “Linting” heading does not establish a configured lint suite. |
| Lint | **BLOCKED:** standalone `next lint` prompted for ESLint setup and exited 1 without configuration changes. |
| Content validation | **PASS:** 19 existing validator functions across 18 games, run against authored data through a temporary TypeScript-to-CommonJS harness. Counts below. This is not a complete game-engine test suite. |
| Hub desktop/mobile | **PASS with visual issue below:** Chromium at 1440x1000 and 390x1000; expected 6/5/5/5/5 anchors, no nested controls, no document horizontal overflow, screenshots reviewed. |
| Hub keyboard/focus | **PASS:** Tab reached every game card at both widths; computed visible focus outlines and screenshots confirmed focus. Full keyboard-only gameplay is unverified. |
| Hub reduced motion | **PASS (sampled cards):** emulated reduce; each hub's sampled card animation/transition duration computed as `0.00001s`. Active-game JS animation behavior is not fully tested. |
| Game pages and returns | **PASS:** all 26 loaded HTTP 200 without captured `pageerror` exceptions; each initial-screen hub anchor was clicked and reached the correct hub. Full playthroughs and every intermediate-state return are unverified. |
| Offline progress API | **PASS:** GET 200 with empty/non-persisted results; valid demo POST 200/non-persisted; unknown hub 400; unknown game 404; malformed JSON 400; subsequent GET unchanged. No live data written. |
| Installed automated suites | **NOT AVAILABLE:** none configured. |
| Live auth/database, media review, exhaustive game behavior | **UNVERIFIED:** no credentials or live writes; no full video/audio review or all-scenario playthrough. |

| Existing validator | Authored items checked | Result |
| --- | --- | --- |
| `validateModelUpdateScenarios` | 4 | Pass |
| `validateChartScenarios` | 8 | Pass |
| `validateAnalystNoteScenarios` | 4 | Pass |
| `validateThesisDefenseScenarios` | 3 | Pass |
| `validateVariantScenarios` | 1 | Pass |
| `validateTradingScenarios` | 4 | Pass |
| `validateTriageScenarios` | 4 | Pass |
| `validateLiquidityPoolScenarios` | 4 | Pass |
| `validateOrderBookScenarios` | 5 | Pass |
| `validateSmartContractScenarios` | 5 | Pass |
| `validateBiddingWarScenarios` | 4 | Pass |
| `validateCounterofferScenarios` | 4 | Pass |
| `validateFootballFieldScenarios` | 8 | Pass |
| `validateAllNighterScenarios` | 3 | Pass |
| `validateCompsScenarios` | 4 | Pass |
| `validateClientTimelineScenarios` | 4 | Pass |
| `validateRebalanceScenario` | 5 | Pass |
| `validateFounderPitchTranscripts` | 10 | Pass |
| `validateReferenceCallTranscripts` | 10 | Pass |

Temporary audit scripts, JSON results and screenshots were written outside the repository to `%TEMP%/cdp-mini-games-audit`. They are local evidence, not durable repository tooling. The tables record the results; future contributors must rerun relevant checks rather than depend on that directory. The development server was restored on port 3000 after the build.

## Confirmed issues and follow-up risks

### Confirmed by code or browser

1. **Lint/test tooling gap.** No unattended lint baseline or installed automated game suite. Six `*-test-fixture.ts` data files exist for Bidding War, Football Field Builder, The All-Nighter, Model Update Reflex, Liquidity Pool Balancer and Build the Trading Algorithm; they are not tests. Establish approved tooling before claiming regression coverage.
2. **Comps Screen hub badge overlaps its category.** On the Investment Banking hub at 390px, the “Start here” badge overlaps “Comparable companies”. Browser rectangles intersected: badge y=460.625, height=24; category y=469.344, height=10. Source: `investment-banking-games/_components/InvestmentBankingGameCard.tsx` and `investment-banking-games.module.css`. Left unchanged.
3. **Nested main landmarks after integration.** `AppShell` renders `<main>` and the game shell/frame renders another. All 26 initial game pages had two `<main>` elements. This is a semantic/accessibility integration defect, not a missing route. Review shared-shell impact before fixing.
4. **Browser progress crosses account boundaries on the same origin.** The local mirror and scenario keys contain no user ID; logout leaves them intact, and catalogue merge always includes local rows. A different user's display can inherit this device's progress. Confirmed design behavior from code; authenticated multi-account reproduction was not attempted.
5. **Offline progress is not later backfilled.** There is no retry queue or upload of the mirror. The migration comment suggesting later sync must not be read as guaranteed recovery of old offline runs. Only new runs are posted.
6. **Founder media documentation records an unresolved publication hold and stale paths.** See Assets above. Do not treat successful asset loads as clearance of the existing media review.
7. **Unconfigured production uses demo auth too.** The existing `isSupabaseConfigured()` fallback is not gated by `NODE_ENV`. Review deployment configuration before any eventual production release; this audit did not change platform auth.

### Risks requiring targeted tests, not established runtime failures

- Result sync's 1.5-second payload dedupe has no stable run ID. Identical rapid legitimate completions may be suppressed; remount/retry can be counted twice. Backend read-then-upsert counters can race between concurrent requests. No live concurrency tests were run.
- The duplicate `vc-games/_lib/select-unseen-item.js` and `.ts` currently implement the same algorithm but can drift or resolve differently across tools. They are not duplicate routes. Verify consumers/resolution before any cleanup.
- Active-game mobile layouts, keyboard alternatives for drag/drop, dialogs/focus restoration, TTS, timers under backgrounding, all scoring branches, retry behavior, storage corruption/quota denial, and full reduced-motion GSAP behavior need per-game testing when work begins.
- Real Supabase login/cookie refresh, RLS ownership and actual application of migration 0007 remain unverified. The successful offline baseline does not establish those behaviors.
- Full simulations, gateway services and deployed routing are outside this audit. Do not recreate, remove or alter them based on missing workspace packages alone.

No application behavior was changed to address these findings.
