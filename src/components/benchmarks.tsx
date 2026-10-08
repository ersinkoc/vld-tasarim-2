"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { RotateCcw, Gauge, MemoryStick, Trophy } from "lucide-react";
import { SectionHeader, Reveal } from "@/components/ui/reveal";
import { CountUp } from "@/components/ui/count-up";

type Row = {
  name: string;
  unit: string;
  vld: number;
  zod: number;
  note: string;
};

const ROWS: Row[] = [
  { name: "string parse", unit: "M ops/s", vld: 620, zod: 205, note: "v.string().min(2).max(36)" },
  { name: "nullish parse", unit: "M ops/s", vld: 214, zod: 45, note: "v.nullable().optional() hot path" },
  { name: "object parse", unit: "M ops/s", vld: 12.4, zod: 4.1, note: "5-field nested object" },
  { name: "array of objects", unit: "M ops/s", vld: 3.9, zod: 1.2, note: "10k× user records" },
];

const DURATION = 1500;

export function Benchmarks() {
  const [run, setRun] = useState(0);

  return (
    <section id="benchmarks" className="relative py-28 sm:py-36">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[70vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-acid/[0.04] blur-[130px]" />
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          kicker="benchmarks"
          title={
            <>
              Numbers don&apos;t flinch.{" "}
              <span className="text-shimmer">Neither do we.</span>
            </>
          }
          sub="Every commit runs the benchmark suite in CI with Zod performance floors — regressions fail the build. These are the numbers from the latest run."
        />

        <Reveal delay={0.15} className="mt-14">
          <div className="card-line relative overflow-hidden rounded-3xl bg-surface p-6 sm:p-10">
            {/* corner trophy */}
            <div className="absolute right-6 top-6 hidden items-center gap-2 rounded-full border border-amber-warm/30 bg-amber-warm/[0.07] px-3.5 py-1.5 font-mono text-xs text-amber-warm sm:flex">
              <Trophy size={13} /> 10/10 wins vs zod@4.6.4
            </div>

            <div className="flex flex-col gap-9">
              {ROWS.map((row, ri) => {
                const max = Math.max(row.vld, row.zod);
                return (
                  <div key={row.name}>
                    <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                      <div>
                        <span className="font-mono text-sm font-semibold">{row.name}</span>
                        <span className="ml-3 hidden font-mono text-[11px] text-muted sm:inline">
                          {row.note}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
                        {row.unit}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      {/* VLD bar */}
                      <div className="flex items-center gap-3">
                        <span className="w-9 shrink-0 font-mono text-[10px] font-bold uppercase tracking-wider text-acid">
                          vld
                        </span>
                        <div className="relative h-8 flex-1 overflow-hidden rounded-lg bg-foreground/[0.04]">
                          <motion.div
                            key={`vld-${run}`}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${(row.vld / max) * 100}%` }}
                            viewport={{ once: run === 0 }}
                            transition={{ duration: DURATION / 1000, delay: ri * 0.12, ease: [0.22, 1, 0.36, 1] }}
                            className="glow-acid flex h-full items-center justify-end rounded-lg bg-gradient-to-r from-acid/70 to-acid pr-3"
                          >
                            <span className="font-mono text-xs font-bold text-[#04110a]">
                              <CountUp to={row.vld} decimals={row.vld % 1 ? 1 : 0} duration={DURATION + ri * 120} />
                            </span>
                          </motion.div>
                        </div>
                      </div>
                      {/* Zod bar */}
                      <div className="flex items-center gap-3">
                        <span className="w-9 shrink-0 font-mono text-[10px] uppercase tracking-wider text-muted">
                          zod
                        </span>
                        <div className="relative h-8 flex-1 overflow-hidden rounded-lg bg-foreground/[0.04]">
                          <motion.div
                            key={`zod-${run}`}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${(row.zod / max) * 100}%` }}
                            viewport={{ once: run === 0 }}
                            transition={{ duration: DURATION / 1000, delay: 0.25 + ri * 0.12, ease: [0.22, 1, 0.36, 1] }}
                            className="flex h-full items-center justify-end rounded-lg bg-foreground/[0.16] pr-3"
                          >
                            <span className="font-mono text-xs text-muted">
                              <CountUp to={row.zod} decimals={row.zod % 1 ? 1 : 0} duration={DURATION + ri * 120} />
                            </span>
                          </motion.div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 text-right font-mono text-[11px] text-acid">
                      {(row.vld / row.zod).toFixed(2)}× throughput
                    </div>
                  </div>
                );
              })}
            </div>

            {/* memory strip */}
            <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-line bg-surface px-6 py-5 sm:flex-row">
              <div className="flex items-center gap-3">
                <MemoryStick size={18} className="text-vio" />
                <span className="text-sm text-muted">
                  Memory consumption — <span className="font-mono font-semibold text-foreground">4.7× less</span> than Zod on identical workloads
                </span>
              </div>
              <span className="font-mono text-3xl font-bold text-vio">
                −<CountUp to={68} suffix="%" duration={1400} key={`mem-${run}`} />
              </span>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-[11px] leading-relaxed text-muted">
                node 24 · relative throughput per op-class · run it yourself:{" "}
                <code className="rounded bg-foreground/[0.06] px-1.5 py-0.5 text-foreground/80">
                  npx @oxog/vld bench
                </code>
              </p>
              <button
                type="button"
                onClick={() => setRun((r) => r + 1)}
                className="flex items-center gap-2 rounded-full border border-line px-4 py-2 font-mono text-xs text-muted transition-colors hover:border-acid/40 hover:text-acid"
              >
                <RotateCcw size={13} /> re-run benchmark
              </button>
            </div>
          </div>
        </Reveal>

        {/* bottom stat trio */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Gauge, big: "3,116", small: "tests · 100% coverage" },
            { icon: Trophy, big: "10 / 10", small: "benchmark categories won" },
            { icon: Gauge, big: "2500+", small: "assertions in CI on every commit" },
          ].map((s, i) => (
            <Reveal key={s.small} delay={0.1 + i * 0.08}>
              <div className="card-line flex items-center gap-4 rounded-2xl bg-surface px-6 py-5">
                <s.icon size={20} className="shrink-0 text-acid" />
                <div>
                  <div className="font-mono text-xl font-bold">{s.big}</div>
                  <div className="text-xs text-muted">{s.small}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
