# Flood Response Frontend

Frontend for Flood Response and Relief Coordination, built by TechCollective Assam.

> **Project status:** early-stage frontend scaffolding. The application shell and SOS route structure are in place, but authentication, backend integration, and most user workflows are not implemented yet.

## Stack

- React 19, TypeScript, and Vite
- React Router data router
- Tailwind CSS v4 and shadcn/ui (`base-nova`)
- Vitest and Testing Library

## Prerequisites

- Node.js `20.19+` or `22.12+`
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

## Current routes

| Route | Status |
| --- | --- |
| `/` | Application shell with a scaffolded home page. |
| `/sos` | SOS request list scaffold. |
| `/sos/new` | Create SOS request scaffold. |

## Project structure

The codebase follows a shared → features → app dependency flow. SOS functionality lives in `src/features/sos`; application routing and layouts live in `src/app`; reusable UI and utilities live under `src/components` and `src/lib`.

## Contributing

See [AGENTS.md](AGENTS.md) for architecture and contribution conventions. Before handing off a change, run:

```bash
npm run lint
npm run test:run
npm run build
```
