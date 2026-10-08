"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Copy, Check, Zap } from "lucide-react";
import { DataStreamCanvas } from "@/components/data-stream-canvas";
import { HeroTerminal } from "@/components/hero-terminal";
import { CountUp } from "@/components/ui/count-up";
import { Magnetic } from "@/components/ui/magnetic";

const STATS = [
  { value: 3.03, decimals: 2, suffix: "×", label: "faster than Zod 4" },
  { value: 0, decimals: 0, suffix: "", label: "runtime dependencies" },
  { value: 27, decimals: 0, suffix: "+", label: "error languages" },
  { value: 3116, decimals: 0, suffix: "", label: "tests · 100% cov." },
];

export function Hero() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <section id="top" className="relative flex min-h-svh flex-col overflow-hidden pt-16">
      {/* layered backdrop */}
      <div className="absolute inset-0 -z-10">
        <div className="bg-grid bg-grid-fade absolute inset-0" />
        <div className="absolute left-1/2 top-[-20%] h-[60vh] w-[80vw] -translate-x-1/2 rounded-full bg-acid/[0.07] blur-[120px] dark:bg-acid/[0.08]" />
        <div className="absolute right-[-10%] top-[30%] h-[40vh] w-[40vw] rounded-full bg-vio/[0.06] blur-[100px]" />
        <DataStreamCanvas />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-5 pb-16 pt-14 text-center sm:px-8">
        {/* version badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href="#benchmarks"
            className="group inline-flex items-center gap-2.5 rounded-full border border-acid/30 bg-acid/[0.06] py-1.5 pl-2 pr-4 text-xs transition-colors hover:bg-acid/[0.12]"
          >
            <span className="flex items-center gap-1 rounded-full bg-acid px-2 py-0.5 font-mono text-[10px] font-bold text-[#04110a]">
              <Zap size={10} strokeWidth={3} /> v3.0
            </span>
            <span className="font-mono text-muted transition-colors group-hover:text-foreground">
              now <span className="text-acid">3.03×</span> faster —{" "}
              <span className="hidden sm:inline">true Zod 4.6 </span>drop-in
            </span>
            <ArrowRight size={12} className="text-acid transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {/* headline */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 text-balance text-[13.5vw] font-bold leading-[0.95] tracking-[-0.03em] sm:text-7xl md:text-[86px]"
        >
          Validate everything.
          <br />
          At{" "}
          <span className="text-shimmer">lightning speed.</span>
        </motion.h1>

        {/* subcopy */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted sm:text-lg"
        >
          VLD is a zero-dependency TypeScript schema validator — the drop-in Zod
          replacement that parses{" "}
          <span className="font-mono text-foreground">millions of ops/sec</span>,{" "}
          speaks <span className="font-mono text-foreground">27+ languages</span>, and
          ships a Result pattern your control flow will love.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3.5"
        >
          <Magnetic>
            <Link
              href="#playground"
              className="glow-acid group inline-flex items-center gap-2 rounded-full bg-acid px-7 py-3.5 text-sm font-semibold text-[#04110a] transition-transform hover:scale-[1.02] active:scale-95"
            >
              Try it live
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Magnetic>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText("npm i @oxog/vld").catch(() => {});
              setCopied(true);
            }}
            className="group inline-flex items-center gap-2.5 rounded-full border border-line bg-surface px-6 py-3.5 font-mono text-sm transition-colors hover:border-acid/40"
          >
            <span className="text-acid">npm i @oxog/vld</span>
            {copied ? (
              <Check size={14} className="text-acid" />
            ) : (
              <Copy size={14} className="text-muted transition-colors group-hover:text-foreground" />
            )}
          </button>
        </motion.div>

        {/* stats strip */}
        <motion.dl
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.46, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 grid w-full max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4"
        >
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1 bg-background/80 px-3 py-4 backdrop-blur">
              <dd className="font-mono text-2xl font-bold text-acid sm:text-[26px]">
                <CountUp to={s.value} decimals={s.decimals} suffix={s.suffix} duration={1900} />
              </dd>
              <dt className="text-[11px] uppercase tracking-wider text-muted">{s.label}</dt>
            </div>
          ))}
        </motion.dl>

        {/* the live terminal */}
        <div className="mt-14 w-full">
          <HeroTerminal />
        </div>
      </div>
    </section>
  );
}
