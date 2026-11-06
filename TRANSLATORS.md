# Translation Guide

This project uses ICU message syntax through `i18next-icu`. English is the source catalog.

## Ground rules

- Developers only edit `src/lib/i18n/locales/en.json`.
- Do not rename keys.
- Do not change ICU placeholders, plural/select structure, or dotted keys.
- Keep every key present in `as.json`, `hi.json`, and `bn.json`.
- Run `npm run check:i18n` after changing a catalog.

## Plural rules

Assamese, Hindi, and Bengali select `one` for both `0` and `1`. If zero needs special wording, use an exact branch without changing English:

```json
"{count, plural, =0 {No requests} one {One request} other {# requests}}"
```

`=0` branches are allowed in a translation even when English does not have one. Do not add unsupported plural keywords such as `zero`; use `=0`.

## Assamese is not Bengali

- Use Assamese vocabulary and the Assamese letters `ৰ` and `ৱ`.
- Never copy Bengali text into the Assamese catalog.
- Keep the language names as endonyms: `English`, `অসমীয়া`, `हिन्दी`, `বাংলা`.

## Numerals

- Dates, numbers, currency, relative time, lists, and collation use the locale's explicit numbering system.
- Assamese and Bengali display Bengali numerals; Hindi displays Devanagari numerals.
- Phone numbers, IDs, codes, and search text stay as plain ASCII strings.
- Do not use `Intl.NumberFormat` for identifiers.

## Review status

`src/lib/i18n/review-status.json` tracks machine-drafted keys per locale. A key absent from that file is treated as human-written or reviewed. This is temporary until Crowdin or Weblate tracks review state.

## Sync workflow

After the first Crowdin/Weblate sync:

1. Run `npm run check:i18n`.
2. Inspect `git diff`.
3. Confirm only values changed, never keys or ICU placeholders.
