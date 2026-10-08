"use client";

import { ArrowUpRight, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Reveal } from "@/components/ui/reveal";
import { Magnetic } from "@/components/ui/magnetic";
import { GithubIcon } from "@/components/icons";

export function Cta() {
  const [copied, setCopied] = useState(false);

  return (
    <section className="relative px-5 pb-28 pt-4 sm:px-8">
      <Reveal>
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-line">
          {/* aurora backdrop */}
          <div className="absolute inset-0 -z-10 bg-code-bg">
            <div className="absolute left-[10%] top-[-40%] h-[80%] w-[55%] animate-aurora rounded-full bg-acid/[0.16] blur-[90px]" />
            <div className="absolute right-[5%] top-[-20%] h-[70%] w-[45%] animate-aurora rounded-full bg-vio/[0.14] blur-[90px] [animation-delay:-7s]" />
            <div className="bg-grid absolute inset-0 opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
          </div>

          <div className="flex flex-col items-center px-6 py-20 text-center sm:py-24">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-acid-bright">
              ship faster today
            </span>
            <h2 className="mt-5 max-w-2xl text-balance text-4xl font-bold leading-[1.02] tracking-tight sm:text-6xl">
              Your schemas deserve{" "}
              <span className="text-shimmer">jet fuel.</span>
            </h2>
            <p className="mt-5 max-w-xl text-pretty text-muted">
              One install. One import. 3× the speed. The rest of your app won&apos;t
              even notice — your users will.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
              <Magnetic strength={0.3}>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText("npm i @oxog/vld").catch(() => {});
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1600);
                  }}
                  className="glow-acid group flex items-center gap-3 rounded-full bg-acid px-7 py-4 font-mono text-sm font-bold text-[#04110a] transition-transform hover:scale-[1.02] active:scale-95"
                >
                  npm i @oxog/vld
                  {copied ? (
                    <Check size={15} />
                  ) : (
                    <Copy size={15} className="opacity-70 transition-opacity group-hover:opacity-100" />
                  )}
                </button>
              </Magnetic>
              <Magnetic strength={0.3}>
                <a
                  href="https://github.com/ersinkoc/vld"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 rounded-full border border-line bg-surface px-7 py-4 text-sm font-semibold transition-colors hover:border-acid/40"
                >
                  <GithubIcon className="h-4 w-4" />
                  Star on GitHub
                  <ArrowUpRight size={15} className="text-acid" />
                </a>
              </Magnetic>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-wider text-code-fg/55">
              <span>MIT license</span>
              <span className="text-acid-bright">·</span>
              <span>zero deps</span>
              <span className="text-acid-bright">·</span>
              <span>27+ languages</span>
              <span className="text-acid-bright">·</span>
              <span>ESM + CJS</span>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
