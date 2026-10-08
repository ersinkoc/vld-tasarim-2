"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { GithubIcon, NpmIcon, XIcon } from "@/components/icons";

const COLS = [
  {
    title: "Ecosystem",
    links: [
      { label: "GitHub", href: "https://github.com/ersinkoc/vld" },
      { label: "npm", href: "https://www.npmjs.com/package/@oxog/vld" },
      { label: "Changelog", href: "https://github.com/ersinkoc/vld/releases" },
      { label: "Issues", href: "https://github.com/ersinkoc/vld/issues" },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "Documentation", href: "https://github.com/ersinkoc/vld#readme" },
      { label: "Migrate from Zod", href: "https://github.com/ersinkoc/vld/blob/main/docs/migration-zod.md" },
      { label: "Benchmarks", href: "https://github.com/ersinkoc/vld/tree/main/benchmarks" },
      { label: "Examples", href: "https://github.com/ersinkoc/vld/tree/main/examples" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line">
      <div className="mx-auto max-w-6xl px-5 pb-10 pt-16 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <Link href="#top" className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-code-bg">
                <svg viewBox="0 0 64 64" className="h-5 w-5">
                  <path d="M36 8 16 36h12l-4 20 24-30H34l6-18z" fill="var(--acid)" />
                </svg>
              </span>
              <span className="font-mono text-lg font-bold">
                vld<span className="text-acid">.</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Ultra-fast TypeScript schema validation. Built by{" "}
              <a
                href="https://github.com/ersinkoc"
                target="_blank"
                rel="noreferrer"
                className="text-foreground underline decoration-acid/40 underline-offset-4 hover:decoration-acid"
              >
                Ersin Koç
              </a>{" "}
              and contributors.
            </p>
            <div className="mt-5 flex items-center gap-2.5">
              {[
                { icon: GithubIcon, href: "https://github.com/ersinkoc/vld", label: "GitHub" },
                { icon: NpmIcon, href: "https://www.npmjs.com/package/@oxog/vld", label: "npm" },
                { icon: XIcon, href: "https://x.com", label: "X" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-acid/40 hover:text-acid"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                {col.title}
              </h4>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-muted transition-colors hover:text-acid"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 sm:flex-row">
          <p className="font-mono text-[11px] text-muted">
            MIT © 2026 Ersin Koç — vld.oxog.dev
          </p>
          <p className="flex items-center gap-1.5 font-mono text-[11px] text-muted">
            crafted with <Heart size={11} className="fill-danger text-danger" /> using Next.js 16 ·
            Tailwind 4 · Motion 14
          </p>
          <p className="hidden font-mono text-[11px] text-muted/50 lg:block">
            psst — hit <kbd className="rounded border border-line px-1.5 py-0.5 text-acid">V</kbd>{" "}
            three times
          </p>
        </div>
      </div>

      {/* giant watermark */}
      <div aria-hidden="true" className="pointer-events-none relative -mb-[4vw] select-none overflow-hidden">
        <div className="text-outline whitespace-nowrap text-center font-mono text-[26vw] font-bold leading-[0.8] tracking-tighter opacity-[0.35]">
          VLD
        </div>
      </div>
    </footer>
  );
}
