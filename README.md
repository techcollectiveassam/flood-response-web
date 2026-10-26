# Flood Response Frontend

Frontend for Flood Response and Relief Coordination, built by TechCollective Assam.

## Stack

- React 19, TypeScript, and Vite
- React Router data router
- Tailwind CSS v4 and shadcn/ui (`base-nova`)
- Vitest and Testing Library

## Getting started

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` when you need to override local environment settings.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run build` | Type-check and create a production build. |
| `npm run lint` | Lint the source code. |
| `npm run test:run` | Run the test suite once. |
| `npm run test:coverage` | Run tests with coverage reporting. |

## Project structure

The codebase follows a shared → features → app dependency flow. SOS functionality lives in `src/features/sos`; application routing and layouts live in `src/app`; reusable UI and utilities live under `src/components` and `src/lib`.

See [AGENTS.md](AGENTS.md) for the architectural conventions and contribution guidance.
