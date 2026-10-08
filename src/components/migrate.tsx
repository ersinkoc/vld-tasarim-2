"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, MoveRight, Copy, Check } from "lucide-react";
import { useState } from "react";
import { SectionHeader, Reveal } from "@/components/ui/reveal";

const STEPS = [
  {
    n: "01",
    title: "Swap the import",
    body: "Point zod at @oxog/vld/v4. Schemas, types and errors keep working — 28/28 parity tests say so.",
  },
  {
    n: "02",
    title: "Run your suite",
    body: "Existing tests stay green. Benchmarks get 3× headroom on the same hardware.",
  },
  {
    n: "03",
    title: "Delete a dependency",
    body: "Drop zod from package.json. Your node_modules just lost weight — 0 runtime deps left behind.",
  },
];

export function Migrate() {
  const [copied, setCopied] = useState(false);

  return (
    <section id="migrate" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          kicker="migration"
          title={
            <>
              The shortest migration{" "}
              <span className="text-shimmer">you&apos;ll ever ship.</span>
            </>
          }
          sub="No rewrites. No new mental model. One line changed, one benchmark to brag about."
        />

        {/* the one-line diff */}
        <Reveal delay={0.15} className="mt-14">
          <div className="card-line mx-auto max-w-3xl overflow-hidden rounded-2xl bg-code-bg">
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <span className="font-mono text-[11px] uppercase tracking-widest text-code-fg/50">
                your-file.ts — 1 line changed
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-acid-bright">
                <span className="h-1.5 w-1.5 animate-blink-dot rounded-full bg-acid-bright" />
                diff
              </span>
            </div>
            <div className="space-y-1 px-5 py-5 font-mono text-[13px] leading-7 sm:text-sm">
              <div className="flex items-center gap-3">
                <span className="w-4 select-none text-danger">−</span>
                <span className="text-danger-soft/75 line-through decoration-danger-soft/40">
                  import {"{ z }"} from <span className="text-danger-soft">&quot;zod&quot;</span>;
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-4 select-none text-acid">+</span>
                <span className="rounded bg-acid/10 px-2 py-0.5">
                  <span className="text-acid-bright">import {"{ z }"} from</span>{" "}
                  <span className="font-semibold text-acid-bright">&quot;@oxog/vld/v4&quot;</span>;
                </span>
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 }}
                  className="hidden items-center gap-1 rounded-full bg-acid/20 px-2.5 py-0.5 text-[11px] font-semibold text-acid-bright sm:inline-flex"
                >
                  <MoveRight size={12} /> that&apos;s it. seriously.
                </motion.span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* steps */}
        <div className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={0.1 + i * 0.08}>
              <div className="card-line group relative h-full overflow-hidden rounded-2xl bg-surface p-6">
                <span className="font-mono text-xs text-acid">{s.n}</span>
                <h3 className="mt-2.5 font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
                <span className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-acid/[0.07] blur-2xl transition-all duration-500 group-hover:bg-acid/[0.16]" />
              </div>
            </Reveal>
          ))}
        </div>

        {/* install strip */}
        <Reveal delay={0.2} className="mt-10">
          <div className="mx-auto flex max-w-3xl flex-col items-center justify-between gap-4 rounded-2xl border border-line bg-surface px-6 py-5 sm:flex-row">
            <code className="font-mono text-sm">
              <span className="text-acid">$</span> npm install @oxog/vld
            </code>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText("npm install @oxog/vld").catch(() => {});
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1600);
                }}
                className="flex items-center gap-1.5 rounded-full border border-line px-4 py-2 font-mono text-xs text-muted transition-colors hover:border-acid/40 hover:text-acid"
              >
                {copied ? <Check size={13} className="text-acid" /> : <Copy size={13} />}
                {copied ? "copied" : "copy"}
              </button>
              <Link
                href="https://github.com/ersinkoc/vld/blob/main/docs/migration-zod.md"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-1.5 rounded-full bg-acid px-4 py-2 font-mono text-xs font-semibold text-[#04110a] transition-transform hover:scale-[1.03]"
              >
                migration guide
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
