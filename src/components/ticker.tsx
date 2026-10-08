"use client";

import { Zap } from "lucide-react";

const ITEMS = [
  "3.03× faster",
  "zero dependencies",
  "drop-in zod",
  "27+ languages",
  "result pattern",
  "plugin system",
  "tree-shakeable mini",
  "codecs built-in",
  "3,116 tests",
  "10/10 benchmark wins",
];

function Row({ reverse = false }: { reverse?: boolean }) {
  return (
    <div className="flex overflow-hidden">
      <div
        className={`flex shrink-0 items-center gap-8 pr-8 ${
          reverse ? "animate-marquee-rev" : "animate-marquee"
        }`}
      >
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-8 whitespace-nowrap font-mono text-sm uppercase tracking-[0.2em] text-muted"
          >
            {item}
            <Zap size={11} className="fill-acid text-acid" />
          </span>
        ))}
      </div>
    </div>
  );
}

export function Ticker({ reverse = false }: { reverse?: boolean }) {
  return (
    <div className="relative border-y border-line bg-surface/50 py-3.5">
      <Row reverse={reverse} />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}
