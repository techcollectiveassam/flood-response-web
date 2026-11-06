# TODO

Last updated: 2026-11-01

## Navigation follow-up

- [ ] Wire the primary "Report" CTA (desktop and mobile headers) to
      `/{locale}/sos/new`. It is currently an inert placeholder (`href="#"`).
- [ ] Replace remaining placeholder nav/menu/footer destinations (`to: '#'`)
      with real locale-prefixed routes once those pages exist.

## i18n follow-up

- [ ] Native review of 129 machine-drafted keys: 43 each for `as`, `hi`, `bn`.
      Source: `src/lib/i18n/review-status.json`.
      `npm run check:i18n:release` stays red until this list is empty.
- [ ] Assamese quality review: use Assamese vocabulary and `ৰ`/`ৱ`; never copy Bengali.
- [ ] Crowdin/Weblate first sync + round-trip check.
      Blocked: no `CROWDIN_PROJECT_ID` / `CROWDIN_PERSONAL_TOKEN`.
- [ ] Choose a CI provider and wire normal checks (`check:i18n`).
      Wire `check:i18n:release` into the release or deploy pipeline.
      See `docs/ci.md`.
- [ ] SSR/prerender for localized SEO. Client-rendered `hreflang`/`canonical` is not equivalent.
- [ ] Hosting rewrite: send every path, including `/{locale}/...`, to `index.html`.
- [ ] Optional: integrate the live timer into the desktop header (hook exists only).
- [ ] Optional: localize the hardcoded sheet `Close` label if the shadcn sheet is adapted.

## PWA rollout follow-up

- [ ] Flip `VITE_PWA_ENABLED=true` in the deployment environment when PWA goes live.
- [ ] When offline-sync caches are introduced, name them OUTSIDE
      `APP_CACHE_PREFIXES` (they survive the kill switch) or intentionally add
      them to the list (they die on disable). Decide then.
- [ ] Keep the cache prefix list in `src/lib/pwa/tombstone-sw.js` in sync with
      `src/lib/pwa/cleanup.ts`.
- [ ] The tombstone service worker must never gain a fetch handler.

## Verification

```bash
npx tsc -b
npm run lint
npm run test:run
npm run check:i18n
npm run check:i18n:release  # expected to fail until drafts are reviewed
npm run build
```
