# vld-website

Marketing & playground site for [**@oxog/vld**](https://github.com/ersinkoc/vld) — the ultra-fast, zero-dependency TypeScript schema validator and drop-in Zod replacement.

## Stack (latest as of Oct 2026)

| Package    | Version |
| ---------- | ------- |
| Next.js    | 16.4.0 (Turbopack, Cache Components) |
| React      | 19.3.0  |
| TypeScript | 6.0.3   |
| Tailwind CSS | 4.3.3 (CSS-first config) |
| Motion     | 14.0.0  |
| next-themes | 0.4.6  |
| lucide-react | 1.53.0 |

> TypeScript is pinned to the latest version the toolchain supports (`typescript-eslint` caps at `<6.1.0`); TS 7 exists but breaks `npm run lint`.

The **live playground embeds the real `@oxog/vld` library** — validation, locale discovery (`getSupportedLocales`) and lazy `setLocaleAsync` all run in the visitor's browser, with real per-op timing measured via `performance.now()`.

## Develop

```bash
npm install
npm run dev   # http://localhost:3000
npm run build # static production build
npm start
```

## What's inside

- **Hero** — canvas "data stream": glowing packets race through a validation gate (valid → green pulse, invalid → drop & dissolve). Auto-typing terminal demo below the fold.
- **Live playground** — schema picker, editable JSON, error messages in 27+ languages, "break it" sabotage button.
- **Benchmarks** — animated race bars (620M ops/s string parse, 4.7× less memory…), re-runnable.
- **Bento features** — spotlight hover cards, Zod→VLD import swap animation, Result pattern demo, i18n word cycler.
- **Migration** — the one-line diff (`"zod"` → `"@oxog/vld/v4"`).
- **Dark / light mode** — class-based via next-themes; code panels stay dark by design, with dedicated bright accent tokens (`--acid-bright`, `--danger-soft`, …) for legibility on them.
- **Easter egg** — hit <kbd>V</kbd> three times quickly → TURBO MODE overclocks the hero canvas.

Everything animates via CSS keyframes (defined in `globals.css` `@theme`) or Motion; `prefers-reduced-motion` is respected globally.
