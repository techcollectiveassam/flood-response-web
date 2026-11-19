# AGENTS.md

## Project Overview

Flood response frontend for coordinating emergency relief in Assam. Built by TechCollective Assam.

**Status**: Early-stage scaffolding. Architecture, routing, styling, and test infrastructure are established. Feature pages are being built out.

**Architecture reference**: This project follows the [Bulletproof React](https://github.com/alan2207/bulletproof-react) architecture pattern.

## Setup & Dev Commands

- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Build for production: `npm run build` (runs `tsc -b && vite build`)
- Run tests (watch mode): `npm test`
- Run tests (single run): `npm run test:run`
- Run tests with coverage: `npm run test:coverage`
- Lint: `npm run lint`
- Validate translations: `npm run check:i18n`
- Run the release translation gate: `npm run check:i18n:release`

## Change Workflow

Build in small, self-contained increments that are easy to review.

- Prefer one UI block or one behavior per change/commit. For example: app header, drawer footer, drawer header, scroll shell, menu groups.
- Before implementation, assess the scope of the request. If it spans multiple components, screens, or behaviors, propose a phased plan made of small, reviewable increments and get approval before coding.
- Split phases at natural UI or behavior boundaries, not arbitrary line counts.
- Keep each increment compiling, lint-clean, and tested before moving on.
- When implementing a phased plan, finish one increment, run its gate, then stop and ask the user to review it. After review, ask whether to commit, then wait for the user's response before proceeding to the next increment.
- Add only the supporting code needed for that increment. Defer routes, integrations, and unrelated refactors.
- When a temporary scaffold is required, keep it isolated and replace it in a later increment.
- Before committing, run `npx tsc -b`, `npm run lint`, `npm run test:run`, and `npm run check:i18n`.
- CI is intentionally not configured yet. When a provider is chosen, wire the normal and release pipelines described in `docs/ci.md`. Normal CI should run `check:i18n`; release or deploy workflows should run `check:i18n:release`.
- In the handoff, state the commands run and any intentionally deferred behavior.
- Do not commit unless explicitly asked.

## Pending Work

`TODO.md` is the canonical summary of deferred work. Read it when the user asks what is pending, or when planning a large implementation that may overlap deferred work. It is not a mandatory pre-work checklist.

## Tech Stack

- **React 19** with **TypeScript 6** (strict: `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`, `verbatimModuleSyntax`)
- **Vite 8** bundler with `@vitejs/plugin-react`
- **Tailwind CSS v4** — CSS-first config (`@import "tailwindcss"`, `@theme inline`, `@custom-variant`). There is NO `tailwind.config.js`.
- **shadcn/ui v4** using the **`base-nova`** style with **`@base-ui/react`** headless primitives (NOT Radix UI)
- **react-i18next** with **i18next** and **i18next-icu** for translation and ICU messages
- **React Router v8** (`createBrowserRouter` data router pattern)
- **TanStack Query** and **Zod** — planned for the first API integration; neither is installed yet
- **Vitest 5** with jsdom, Testing Library, jest-dom matchers
- **ESLint 10** with flat config (`eslint.config.js`)

## Architecture

### Unidirectional Codebase Flow

Code flows in one direction: **shared → features → app**.

- `src/components`, `src/hooks`, `src/lib`, `src/types`, `src/utils` = **shared layer** (can be imported by anything)
- `src/features/*` = **feature layer** (can import shared, CANNOT import from `src/app` or other features)
- `src/app` = **application layer** (can import from features and shared)

```
shared (components, hooks, lib, types, utils)
    ↓
features (self-contained domain modules)
    ↓
app (router, layouts, providers, top-level composition)
```

### Directory Structure

```
src/
├── app/                    # Application layer
│   ├── router.tsx          # Root router config (createBrowserRouter)
│   ├── components/         # App-scoped components (error boundaries, global nav)
│   ├── layouts/            # App-scoped layouts (root-layout)
│   └── routes/             # Application route definitions
├── assets/                 # Static files (images, fonts, etc.)
├── components/             # Shared components used across the entire application
│   ├── feedback/           # Loading spinners, skeletons, progress indicators
│   └── ui/                 # shadcn/ui primitives (managed by shadcn CLI)
├── config/                 # Global configuration, exported env variables
├── features/<name>/        # Feature-based modules (self-contained domain slices)
│   ├── api/                # API request declarations and hooks for this feature
│   ├── components/         # Feature-specific components
│   ├── hooks/              # Feature-specific hooks
│   ├── layouts/            # Feature-specific layouts
│   ├── pages/              # Route page components
│   ├── routes.tsx          # Feature route definitions (RouteObject[])
│   ├── stores/             # Feature-specific state stores
│   ├── types/              # Feature-specific TypeScript types
│   └── utils/              # Feature-specific utility functions
├── hooks/                  # Shared custom hooks
├── lib/                    # Reusable libraries preconfigured for the app (api-client, auth, etc.)
├── stores/                 # Global state stores
├── testing/                # Test setup, utilities, and mocks
│   ├── setup.ts            # Vitest setup (jest-dom, cleanup)
│   ├── test-utils.tsx      # Custom renderWithProviders + RTL re-exports
│   └── mocks/              # MSW handlers and mock data (when needed)
├── types/                  # Shared TypeScript types
└── utils/                  # Shared utility functions
```

> Not every feature needs all subfolders. Only include folders that are necessary for the feature.

### Key Architectural Patterns

1. **Feature-Sliced Architecture**: Each domain feature lives in `src/features/<name>/` with its own routes, pages, layouts, components, hooks, types, stores, and utils. Features are self-contained.

2. **No Cross-Feature Imports**: Features must NEVER import from other features. Compose features together at the application level (`src/app/`).

3. **No Barrel Files**: Do NOT create `index.ts` barrel files to re-export from directories. Import files directly. Barrel files hurt Vite tree-shaking and cause performance issues.

4. **Route Registration**: Each feature exports a `RouteObject[]` (e.g., `sosRoutes`) which is spread into the root router in `src/app/router.tsx`. Feature routes use nested layouts.

5. **Code Splitting**: Split at the route level. Feature page components use `React.lazy()` with named-export adapters wrapped in `<Suspense fallback={<DelayedFallback />}>`. Do NOT over-split — only split at route boundaries.

6. **Layout Nesting**: `RootLayout` → feature `Layout` → page component, all connected via `<Outlet />`.

### Routing

- Use React Router `Link` for internal destinations and `<a>` only for external URLs.
- Derive navigation active state from the current location; never hard-code it in menu configuration.
- Until a destination exists, keep the requested placeholder UI isolated. Do not mark placeholder links as current or add navigation behavior prematurely.
- Close transient navigation UI after successful internal navigation.

## Code Conventions

### File & Component Naming

- **Files**: kebab-case (e.g., `sos-list-page.tsx`, `delayed-fallback.tsx`)
- **Components**: PascalCase named function exports (e.g., `export function SosListPage()`)
- **Constants & utilities**: camelCase (e.g., `sosRoutes`, `cn`)
- **Types**: PascalCase with descriptive suffix (e.g., `DelayedFallbackProps`)

### Import Rules

- Use `@/*` path alias for all imports from `src/` (e.g., `import { cn } from '@/lib/utils'`)
- Use explicit `import type { ... }` for type-only imports (`verbatimModuleSyntax` is enforced)
- Relative imports only within the same feature module
- NEVER import across features — compose at the app level instead

### Component Patterns

- Use standard function declarations: `export function ComponentName() { ... }`
- Define prop types as `type ComponentNameProps = { ... }` above the component
- **Colocate** things as close as possible to where they are used
- **Avoid large components with nested render functions** — extract UI units into separate components
- **Limit the number of props** a component accepts. Use composition via `children` or slots instead
- **Wrap 3rd-party components** to adapt them to the app's needs, making future changes easier
- Use `cn()` from `@/lib/utils` for all conditional/merged class names
- Style with Tailwind utility classes and shadcn semantic tokens (`bg-background`, `text-foreground`, `text-muted-foreground`)

### Styling

- Tailwind CSS v4 with CSS-first configuration in `src/index.css`
- Theme uses OKLCH color space with light/dark mode support via `.dark` class
- Use shadcn's `components.json` (style: `base-nova`, icon library: `lucide`)
- Add new UI components via `npx shadcn@latest add <component-name>`

### Accessibility & Responsive UI

- Use semantic elements and native controls; every icon-only control needs an accessible name.
- Preserve keyboard navigation and visible focus indicators.
- Use `aria-current` only for the actual current route.
- Validate interactive controls at mobile viewport sizes, including safe-area insets and a minimum 44px touch target where practical.
- Respect reduced-motion preferences for new animations or transitions.

### Internationalization

- English is the source catalog at `src/lib/i18n/locales/en.json`. Do not add new hard-coded UI strings.
- Do not edit `as.json`, `hi.json`, or `bn.json` manually; use Crowdin or Weblate. See `TRANSLATORS.md`.
- Catalogs are flat, use dotted keys, and must contain every English key. Never nest objects or arrays.
- Use ICU syntax for plurals and selects. `as`, `hi`, and `bn` select `one` for `0` and `1`; use `=0` for zero-specific wording.
- Use `useTranslation()` from `react-i18next` in components. Do not pass a language prop through component trees.
- Locale routes are prefixed (`/en`, `/as`, `/hi`, `/bn`). Use the helpers in `src/lib/i18n/locale-segment.ts` instead of hand-parsing paths.
- On language change, persist the preference and navigate to the same path under the new locale.
- Every numeric, search, and form input must call `normalizeDigits` from `src/lib/normalize-digits.ts` on change and paste. Use `type="text"` with `inputMode="numeric"` for numeric entry because `type="number"` often rejects Bengali and Devanagari digits.
- Use `src/lib/i18n/formatters.ts` for dates, numbers, currency, relative time, lists, and collation. Phone numbers, IDs, and codes bypass Intl formatting and render as plain ASCII strings.
- Run `npm run check:i18n` after changing a catalog. Run `npm run check:i18n:release` only for release-gate checks.
- Review tracking lives in `src/lib/i18n/review-status.json`, outside `locales/`. Do not import it from application code.

## API Layer

When implementing API integration, follow these rules.

> TanStack Query and Zod are preferred for API work, but are not currently installed. Add them explicitly as part of the first approved API integration increment.

### HTTP Client

1. **Single HTTP client**: `src/lib/api-client.ts` is the only place that configures HTTP transport. Create one preconfigured client (Ky, Axios, or a thin `fetch` wrapper — choose one) with the base URL, default headers, credentials/CSRF, timeout, and auth handling. Do not create per-feature clients or a second client for a special case.

2. **No HTTP in UI**: Never call `fetch`, Ky, Axios, or another HTTP client from components, pages, layouts, or hooks. Components use feature query/mutation hooks; those hooks call fetchers from the same feature's `api/` folder.

3. **Central configuration**: Read the backend base URL from typed config under `src/config/`, backed by a `VITE_` environment variable. Do not hardcode URLs or read `import.meta.env` directly in features and components.

4. **Authentication**: Prefer HttpOnly cookies. Attach bearer tokens or CSRF headers in the shared client, never per request. Handle session expiry centrally (refresh once, then redirect or sign out).

### Feature API Modules

5. **Placement**: Each endpoint lives in `src/features/<name>/api/<verb>-<resource>.ts` (for example `get-sos-requests.ts`, `create-sos-request.ts`). Each declaration owns:
   - Request and response Zod schemas plus their inferred types
   - A fetcher that calls the endpoint through the shared client
   - The TanStack Query query or mutation hook
   - The query key factory for that resource

6. **No cross-feature API imports**: A feature must not import another feature's `api/` modules. If two features genuinely share an endpoint contract, promote the shared contract and types to the shared layer deliberately instead of reaching across features.

7. **Naming**: Use verb-first file names. Name hooks after the action and resource (for example `useGetSosRequests`, `useCreateSosRequest`) and expose typed query key factories (for example `sosKeys.list(filters)`), not ad-hoc key arrays.

### Server State

8. **TanStack Query owns server state**: Create one `QueryClient` in the application providers. Set deliberate defaults such as a sensible `staleTime` and retries only for network/5xx failures, never for 4xx. Do not copy fetched data into Zustand, Jotai, React Context, or local state.

9. **Query keys and invalidation**: Colocate a typed key factory with the feature API. Include every filter or parameter that changes the response. Mutations must invalidate or update the affected keys; do not rely on refetch-on-focus for correctness.

10. **UI states**: Derive loading, error, and empty states from the query (`isPending`, `isError`, `error`, `data`). Do not hand-roll duplicate loading/error booleans. Mutation hooks expose `isPending` and surface failures where the action was triggered.

### Validation & Types

11. **Zod at boundaries, not everywhere**: Validate untrusted data — API responses, user input and forms, URL/search params, and persisted storage — where a mismatch would cause a bug or unsafe rendering. Do not wrap trusted internal-only values or every function call in a schema.

12. **Single source of truth for types**: Derive types from schemas with `z.infer` instead of hand-writing matching interfaces. Keep feature-specific API types with the API declaration or in the feature's `types/` folder. Move a type to `src/types/` only when multiple features use it. Use `import type` for type-only imports.

13. **Parse at the edge**: Parse once when data enters the app, then pass the validated type inward. Map validation failures to the normalized error contract; never expose schema details or raw validation output to users.

### Error Contract

14. **One normalized error shape**: The shared client must normalize failures into a consistent shape with `status`, `code`, optional `fieldErrors`, and `cause`. Distinguish network/timeout failures, HTTP status failures, and validation failures so callers can handle them predictably.

15. **Localized messages**: Map errors to catalog keys with `getApiErrorKey` from `src/lib/api-error.ts`. Add new `apiError.*` keys to `en.json` only; other locales go through Crowdin or Weblate. Never render raw server messages, English-only fallbacks, response bodies, or stack traces.

16. **Layered handling**: The shared client handles cross-cutting concerns such as auth expiry and logging. Feature code renders inline error/retry states and mutation feedback. Do not show the same failure twice (for example, a global toast plus an inline error) without a deliberate reason.

## State Management

Categorize state by type — do NOT put everything into a single global store:

> Zustand and Jotai are preferred options if global client state becomes necessary, but are not currently installed. Add one deliberately when its first approved use requires it.

| State Type | Where | Tools |
|---|---|---|
| **Component State** | Local to the component | `useState`, `useReducer` |
| **Application State** | Global UI state (modals, notifications, theme) | Zustand, Jotai, or React Context + hooks |
| **Server Cache State** | Data fetched from the API | TanStack Query (react-query) |
| **Form State** | Form inputs and validation | React Hook Form + Zod |
| **URL State** | URL params and query strings | React Router (`useParams`, `useSearchParams`) |

Key principles:
- Keep state as close as possible to where it is being used
- Do not put everything in a single global state — split by usage area
- Server data belongs to TanStack Query. Never copy fetched lists or entities into a global store or component state; keep only explicit drafts or form edits locally.
- Use state initializer functions for expensive computations: `useState(() => expensiveFn())`, not `useState(expensiveFn())`
- Prefer composition and lifting state up before reaching for context or global state

## Testing

### Strategy

Prioritize **integration tests** over unit tests. Integration tests provide the most confidence that the application works correctly.

| Test Type | When to Use | Tools |
|---|---|---|
| **Unit Tests** | Shared components, utility functions, complex isolated logic | Vitest + Testing Library |
| **Integration Tests** | Feature workflows, page-level behavior, connected components | Vitest + Testing Library + MSW |
| **E2E Tests** | Critical user journeys, full-stack flows | Playwright |

### Guidelines

- Import from `@/testing/test-utils` (NOT directly from `@testing-library/react`)
- Use `renderWithProviders()` to render components (mounts `I18nextProvider` with the shared i18n instance)
- Test user behavior, NOT implementation details — test what the user sees, not internal state
- Use MSW (Mock Service Worker) for API mocking instead of mocking `fetch` directly. Mock at the HTTP boundary; do not mock the shared API client or feature API hooks in page tests. MSW is not installed yet — add it with the first API integration.
- When TanStack Query is added, extend `renderWithProviders()` with a fresh `QueryClientProvider` per test and disable retries so failures surface immediately.
- Mocks are automatically restored after each test (`restoreMocks: true`)
- Place test files alongside source files as `<filename>.test.tsx`
- Coverage excludes: `src/testing/**`, `src/types/**`, and test files

### Test Commands

```bash
npm test              # Watch mode
npm run test:run      # Single run
npm run test:coverage # With coverage report
```

### Change-Level Verification

- Add or update a behavior-focused test when changing navigation, accessibility attributes, forms, API behavior, or error states.
- For visual-only scaffolding, lint, build, and a manual keyboard/mobile check are sufficient unless the change has non-trivial interaction.

## Error Handling

1. **API Errors**: Normalize every failure in the API layer (see **API Layer → Error Contract**). Handle auth/session expiry centrally. Render localized messages using `getApiErrorKey` from `src/lib/api-error.ts`. Show inline retry states for queries and feedback at the action point for mutations. Never display raw server messages or response bodies.

2. **Validation Errors**: Response-schema failures are API errors and use the generic localized message (log details for developers). Form field errors stay with the form and map to the relevant fields.

3. **In-App Errors**: Use React error boundaries. Place multiple error boundaries in different areas of the app — don't rely on a single top-level boundary. Contain errors locally without disrupting the entire application.

4. **Error Tracking**: Use tools like Sentry for production error monitoring. Upload source maps for accurate stack traces, and scrub PII and tokens before sending events.

## Security

- Store auth tokens in HttpOnly cookies (NOT localStorage) when possible
- Sanitize all user inputs before rendering to prevent XSS attacks
- Never store secrets or API keys in source code or client-exposed `VITE_*` variables; keep them in server-only environment variables. `VITE_*` is only for non-sensitive public configuration.
- For authorization, implement RBAC (role-based) or PBAC (permission-based) access control as needed

## Performance

- **Code split at route level only** — avoid over-splitting which increases request count
- **Colocate state** near where it's used to prevent unnecessary re-renders
- **Use the `children` prop** as a basic optimization to isolate VDOM structures from parent re-renders
- Lazy load images not in the viewport; use modern formats (WebP)
- Use `srcset` for responsive image loading
- Monitor Web Vitals via Lighthouse / Pagespeed Insights

## Environment Variables

- Prefix all client-side env vars with `VITE_`. These values are public; never store secrets, API keys, or credentials in them.
- Read env vars through typed exports in `src/config/` (for example `src/config/pwa.ts`). Do not call `import.meta.env` directly in features or components.
- `VITE_API_BASE_URL`: Backend origin/base path for API requests. Add it when API integration begins and document its expected format in both `.env.example` and the README table.
- `VITE_SUSPENSE_FALLBACK_DELAY`: Delay in ms before showing loading spinners (default: 200)
- Keep `.env.example` and the README environment table in sync when adding or changing variables.
- See `.env.example` for the full list

## Boundaries & Constraints (Do Not...)

- Do NOT import across features. Features must be independent. Compose them at the app level.
- Do NOT create barrel files (`index.ts` that re-export). Import files directly for better tree-shaking.
- Do NOT use Radix UI primitives. This project uses `@base-ui/react` via shadcn's `base-nova` style.
- Do NOT create a `tailwind.config.js` or `tailwind.config.ts`. Tailwind v4 uses CSS-first config in `src/index.css`.
- Do NOT import from `@testing-library/react` directly in tests. Always import from `@/testing/test-utils`.
- Do NOT modify `src/components/ui/` files manually. These are managed by the shadcn CLI.
- Do NOT add components to `src/app/components/` unless they are truly app-scoped (error boundaries, global navigation).
- Do NOT use default exports for components. Always use named exports.
- Do NOT use `require()` or CommonJS patterns. The project uses ESM (`"type": "module"`).
- Do NOT store sensitive values in source or client-exposed `VITE_*` variables. Use server-only environment variables; `VITE_*` is only for non-sensitive public configuration.
- Do NOT add nested render functions inside components. Extract them into separate components.
- Do NOT import from `src/app/` inside `src/features/` or shared modules (violates unidirectional flow).
- Do NOT put all state in a single global store. Categorize state by type and keep it local when possible.
- Do NOT call `fetch`, Ky, Axios, or any HTTP client inside components, pages, layouts, or feature hooks. Go through the feature's API module.
- Do NOT create a second HTTP client or per-feature client instance. Extend the shared client in `src/lib/api-client.ts`.
- Do NOT import another feature's `api/` module. Promote genuinely shared contracts to the shared layer.
- Do NOT hardcode API URLs. Read them from typed config backed by `VITE_*` variables.
- Do NOT hand-write API response types that duplicate a Zod schema. Derive them with `z.infer`.
- Do NOT store server data in global client state. TanStack Query owns server state.
- Do NOT render raw API or server error messages. Use localized `apiError.*` keys via `getApiErrorKey`.
- Do NOT mock `fetch`, the API client, or feature API hooks directly in tests. Mock the HTTP boundary with MSW.
- Do NOT edit non-English catalogs manually. Use Crowdin or Weblate.
- Do NOT import `review-status.json` from application code; only `scripts/check-i18n-release.mjs` reads it.
- Do NOT format phone numbers, IDs, or codes with Intl formatters. Render them as plain ASCII strings.
- Do NOT hand-parse locale-prefixed paths. Use `src/lib/i18n/locale-segment.ts`.
