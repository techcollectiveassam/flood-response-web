# CI Integration (Deferred)

This repository does not currently configure a CI provider. The commands below are the expected pipeline and can be wired into GitHub Actions, GitLab CI, or another provider when one is chosen.

## Normal pipeline

Run on pushes and pull requests:

```bash
npm ci
npx tsc -b
npm run lint
npm run test:run
npm run check:i18n
npm run build
```

`check:i18n` validates catalog shape, key parity, ICU syntax, argument parity, and plural/select branches. It does not block on machine-drafted translations.

## Release or deploy gate

Run before a release or deploy:

```bash
npm ci
npm run check:i18n:release
```

`check:i18n:release` includes the normal catalog validation and also reads `src/lib/i18n/review-status.json`. It fails while any machine-drafted key remains.

If releases are tag-driven, attach this gate to the tag workflow. If releases are deploy-driven, attach it to the deploy workflow instead.

> Current status: the release gate fails by design because machine-drafted keys remain. Normal development CI should run only `check:i18n`.

## Optional GitHub Actions examples

These are examples only. They are not active workflows.

### Normal CI

```yaml
name: CI

on:
  push:
    branches: ['**']
  pull_request:

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npx tsc -b
      - run: npm run lint
      - run: npm run test:run
      - run: npm run check:i18n
      - run: npm run build
```

### Release translation gate

```yaml
name: Release translation gate

on:
  push:
    tags: ['v*']
  workflow_dispatch:

jobs:
  i18n-release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run check:i18n:release
```

If the project later uses a deploy workflow instead of tagged releases, move the `check:i18n:release` step into that workflow.

## Translation sync

Crowdin credentials are not needed for CI checks. They are only needed when running a Crowdin sync. See `crowdin.yml` and `TRANSLATORS.md`.
