# Flood Response Frontend

Frontend for Flood Response and Relief Coordination, built by TechCollective Assam.

> **Project status:** early-stage frontend scaffolding. The application shell and SOS route structure are in place, but authentication, backend integration, and most user workflows are not implemented yet.

## Stack

- React 19, TypeScript, and Vite
- React Router data router
- react-i18next, i18next, and i18next-icu
- Tailwind CSS v4 and shadcn/ui (`base-nova`)
- Vitest and Testing Library

## Prerequisites

- Node.js `22.22.2+` (on the 22.x line), `24.15+`, or `26+` — the locked dependencies (react-router, jsdom) require these minimums; Node 20 is no longer supported
- npm (bundled with Node.js)

## Getting started

```bash
npm install
npm run dev
```

The development server prints its local URL (normally `http://localhost:5173`) after it starts.

## Environment variables

Copy `.env.example` to `.env.local` only when you need to override a value.

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_SUSPENSE_FALLBACK_DELAY` | `200` | Delay in milliseconds before route loading feedback is shown. |

Never commit `.env.local` or credentials.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run preview` | Serve the production build locally. |
| `npm run build` | Type-check and create a production build. |
| `npm run lint` | Lint the source code. |
| `npm test` | Run tests in watch mode. |
| `npm run test:run` | Run the test suite once. |
| `npm run test:coverage` | Run tests with coverage reporting. |
| `npm run check:i18n` | Validate catalog shape, key parity, and ICU messages. |
| `npm run check:i18n:release` | Run the release gate, including review-status checks. |

## Current routes

| Route | Status |
| --- | --- |
| `/` | Redirects to the preferred locale home page. |
| `/{locale}` | Localized home page (`en`, `as`, `hi`, `bn`). |
| `/{locale}/sos` | SOS request list scaffold. |
| `/{locale}/sos/new` | Create SOS request scaffold. |
| `/sos`, `/sos/new` | Legacy redirects to the preferred locale. |
| `/{locale}/*` | Localized 404 page. |

## Internationalization

English is the source catalog at `src/lib/i18n/locales/en.json`. Catalogs are flat, use dotted keys, and are validated by `npm run check:i18n`.

- Do not edit non-English catalogs manually; use Crowdin or Weblate.
- See [TRANSLATORS.md](TRANSLATORS.md) for translation rules.
- Review tracking lives in `src/lib/i18n/review-status.json`, outside `locales/`.
- Use `normalizeDigits` for numeric, search, and form inputs so Bengali and Devanagari digits become ASCII before validation or submission.
- Use the Intl helpers in `src/lib/i18n/formatters.ts` for dates, numbers, currency, relative time, lists, and collation. Phone numbers, IDs, and codes must render as plain ASCII strings.

## Deployment and SEO

Production hosting must rewrite every path, including `/{locale}/...`, to the SPA entry point (`index.html`). Without a catch-all rewrite, deep links and localization URLs will return a hosting 404.

Localized `canonical` and `hreflang` tags are rendered on the client. They are not equivalent to server-rendered SEO: crawlers that do not execute JavaScript may not see them. Prerendering or SSR is the future fix.

## Release gate

`npm run check:i18n:release` fails while `review-status.json` contains machine-drafted keys. CI is intentionally not configured yet. When a CI provider is chosen, run `npm run check:i18n` on normal pushes and pull requests, and run `npm run check:i18n:release` in the release or deploy workflow. See [docs/ci.md](docs/ci.md) for the expected commands and optional GitHub Actions examples. If releases are not tag-driven, attach the release gate to the deploy workflow instead. Normal development CI should run only `check:i18n` so machine-drafted content does not block development.

## Project structure

The codebase follows a shared → features → app dependency flow. SOS functionality lives in `src/features/sos`; application routing and layouts live in `src/app`; reusable UI and utilities live under `src/components` and `src/lib`.

## Contributing

See [AGENTS.md](AGENTS.md) for architecture and contribution conventions. Before handing off a change, run:

```bash
npm run lint
npm run test:run
npm run check:i18n
npm run build
```
