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

## Change Workflow

Build in small, self-contained increments that are easy to review.

- Prefer one UI block or one behavior per change/commit. For example: app header, drawer footer, drawer header, scroll shell, menu groups.
- Before implementation, assess the scope of the request. If it spans multiple components, screens, or behaviors, propose a phased plan made of small, reviewable increments and get approval before coding.
- Split phases at natural UI or behavior boundaries, not arbitrary line counts.
- Keep each increment compiling, lint-clean, and tested before moving on.
- Add only the supporting code needed for that increment. Defer routes, integrations, and unrelated refactors.
- When a temporary scaffold is required, keep it isolated and replace it in a later increment.
- Before committing, run `npx tsc -b`, `npm run lint`, and `npm run test:run`.
- In the handoff, state the commands run and any intentionally deferred behavior.
- Do not commit unless explicitly asked.

## Tech Stack

- **React 19** with **TypeScript 6** (strict: `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`, `verbatimModuleSyntax`)
- **Vite 8** bundler with `@vitejs/plugin-react`
- **Tailwind CSS v4** — CSS-first config (`@import "tailwindcss"`, `@theme inline`, `@custom-variant`). There is NO `tailwind.config.js`.
- **shadcn/ui v4** using the **`base-nova`** style with **`@base-ui/react`** headless primitives (NOT Radix UI)
- **React Router v8** (`createBrowserRouter` data router pattern)
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

- Put user-facing copy in `src/lib/i18n.ts`; do not add new hard-coded UI strings.
- A functional locale change must update app-wide copy and document language, with the chosen locale persisted.
- Presentational language selectors are allowed during scaffolding, but must not imply that translation is already active.

## API Layer

When implementing API integration, follow these patterns:

> TanStack Query and Zod are preferred when API work begins, but are not currently installed. Add dependencies explicitly as part of the first approved API integration.

1. **Single API Client**: Create a single preconfigured API client instance in `src/lib/api-client.ts`. Use an interceptor to handle errors globally (e.g., notification toasts, auth redirects, token refresh).

2. **Request Declarations**: Each API call should be defined as a structured declaration inside the feature's `api/` folder, consisting of:
   - Types and validation schemas (using Zod) for request and response data
   - A fetcher function that calls the endpoint using the API client
   - A React hook that wraps the fetcher using a data-fetching library (e.g., TanStack Query)

3. **Naming Convention**: Name API files descriptively: `get-sos-requests.ts`, `create-sos-request.ts`, `update-sos-request.ts`, `delete-sos-request.ts`.

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
- Use `renderWithProviders()` to render components (wraps with all app providers)
- Test user behavior, NOT implementation details — test what the user sees, not internal state
- Use MSW (Mock Service Worker) for API mocking instead of mocking fetch directly
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

1. **API Errors**: Handle via API client interceptors. Display notification toasts, handle auth errors (logout/token refresh), and log errors.

2. **In-App Errors**: Use React error boundaries. Place multiple error boundaries in different areas of the app — don't rely on a single top-level boundary. Contain errors locally without disrupting the entire application.

3. **Error Tracking**: Use tools like Sentry for production error monitoring. Upload source maps for accurate stack traces.

## Security

- Store auth tokens in HttpOnly cookies (NOT localStorage) when possible
- Sanitize all user inputs before rendering to prevent XSS attacks
- Never store secrets or API keys in source code — use environment variables via `import.meta.env.VITE_*`
- For authorization, implement RBAC (role-based) or PBAC (permission-based) access control as needed

## Performance

- **Code split at route level only** — avoid over-splitting which increases request count
- **Colocate state** near where it's used to prevent unnecessary re-renders
- **Use the `children` prop** as a basic optimization to isolate VDOM structures from parent re-renders
- Lazy load images not in the viewport; use modern formats (WebP)
- Use `srcset` for responsive image loading
- Monitor Web Vitals via Lighthouse / Pagespeed Insights

## Environment Variables

- Prefix all client-side env vars with `VITE_`
- `VITE_SUSPENSE_FALLBACK_DELAY`: Delay in ms before showing loading spinners (default: 200)
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
- Do NOT store sensitive values in source. Use environment variables via `import.meta.env.VITE_*`.
- Do NOT add nested render functions inside components. Extract them into separate components.
- Do NOT import from `src/app/` inside `src/features/` or shared modules (violates unidirectional flow).
- Do NOT put all state in a single global store. Categorize state by type and keep it local when possible.
- Do NOT mock `fetch` directly in tests. Use MSW (Mock Service Worker) for API mocking.
