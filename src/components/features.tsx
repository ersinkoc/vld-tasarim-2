"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Package,
  Braces,
  TreePine,
  Puzzle,
  FileJson,
  Languages,
  ArrowLeftRight,
  CircleCheck,
} from "lucide-react";
import { SectionHeader, Reveal } from "@/components/ui/reveal";

/* ---------- spotlight card ---------- */
function SpotlightCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState({ x: -400, y: -400 });

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
      onMouseLeave={() => setPos({ x: -400, y: -400 })}
      className={`card-line group relative overflow-hidden rounded-2xl bg-surface transition-colors duration-300 ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(420px circle at ${pos.x}px ${pos.y}px, color-mix(in oklab, var(--acid) 9%, transparent), transparent 65%)`,
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}

/* ---------- drop-in swap demo ---------- */
const SWAPS = ['"@oxog/vld/v4"', '"@oxog/vld/mini"', '"@oxog/vld"'];

function DropInDemo() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % SWAPS.length), 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="mt-5 overflow-hidden rounded-xl border border-line bg-code-bg">
      <div className="px-4 pt-3.5 font-mono text-[12.5px] leading-7">
        <div className="text-danger-soft/80 line-through decoration-danger-soft/50">
          <span className="text-vio">import</span> {"{ z }"} <span className="text-vio">from</span>{" "}
          &quot;zod&quot;;
        </div>
        <div className="flex items-center gap-2">
          <span className="text-acid-bright">import {"{ z }"}</span>
          <span className="text-vio">from</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={idx}
              initial={{ opacity: 0, y: 8, filter: "blur(3px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(3px)" }}
              transition={{ duration: 0.3 }}
              className="rounded bg-acid/20 px-1.5 font-semibold text-acid-bright"
            >
              {SWAPS[idx]}
            </motion.span>
          </AnimatePresence>
          <span className="text-code-fg">;</span>
        </div>
        <div className="mt-1 text-code-fg/45">{"// that's the whole migration"}</div>
      </div>
      <div className="mt-3 flex items-center gap-2 border-t border-line px-4 py-2.5">
        <CircleCheck size={13} className="text-acid-bright" />
        <span className="font-mono text-[11px] text-acid-bright">28/28 Zod 4.5 parity tests passing</span>
      </div>
    </div>
  );
}

/* ---------- result pattern demo ---------- */
function ResultDemo() {
  return (
    <div className="mt-5 overflow-hidden rounded-xl border border-line bg-code-bg px-4 py-3.5 font-mono text-[12.5px] leading-7">
      <div>
        <span className="text-vio">const</span> <span className="text-foreground">r</span> ={" "}
        <span className="text-foreground">User</span>.
        <span className="text-acid-bright">safeParse</span>(req.body);
      </div>
      <div>
        <span className="text-vio">if</span> (<span className="text-foreground">r</span>.
        <span className="text-acid-bright">ok</span>) {"{"}
      </div>
      <div className="pl-5 text-code-fg/55">
        return <span className="text-acid-bright">json</span>({"{ user: r."}<span className="text-foreground">data</span>
        {" }"})
      </div>
      <div>
        {"}"}
        <span className="text-code-fg"> → </span>
        <span className="rounded bg-acid/20 px-1.5 text-acid-bright">Ok&lt;User&gt;</span>
        <span className="text-code-fg"> | </span>
        <span className="rounded bg-danger/20 px-1.5 text-danger-soft">Err&lt;VldError&gt;</span>
      </div>
    </div>
  );
}

/* ---------- i18n cycler ---------- */
const WORDS = ["Validation", "Doğrulama", "Validierung", "Validación", "検証", "검증", "Валидация", "تحقق صحة", "Validação", "验证"];

function I18nDemo() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % WORDS.length), 1400);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="mt-4 flex h-10 items-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          initial={{ y: 22, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -22, opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="font-mono text-2xl font-bold text-acid"
        >
          {WORDS[i]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

/* ---------- grid ---------- */
export function Features() {
  return (
    <section id="features" className="relative py-28 sm:py-36">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-[-12%] top-[15%] h-[45vh] w-[40vw] rounded-full bg-acid/[0.05] blur-[110px]" />
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          kicker="arsenal"
          title={
            <>
              A tiny library with{" "}
              <span className="text-gradient-vio">an unfair arsenal.</span>
            </>
          }
          sub="Everything you'd expect from a modern validator — and a few things you wouldn't. All of it in a package with zero runtime dependencies."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* drop-in — hero of the grid */}
          <Reveal className="sm:col-span-2 lg:row-span-2" y={36}>
            <SpotlightCard className="flex h-full flex-col p-6 sm:p-7">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-acid/10 text-acid">
                <ArrowLeftRight size={19} />
              </span>
              <h3 className="mt-4 text-xl font-bold">Drop-in Zod replacement</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Keep your schemas. Keep your types. Swap one import path and watch
                your benchmarks rewrite themselves — Zod 4 subpath parity included.
              </p>
              <div className="mt-auto">
                <DropInDemo />
              </div>
            </SpotlightCard>
          </Reveal>

          {/* result pattern */}
          <Reveal className="sm:col-span-2" delay={0.06} y={36}>
            <SpotlightCard className="h-full p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold">Result pattern, built-in</h3>
                  <p className="mt-1.5 text-sm text-muted">
                    <code className="font-mono text-acid">Ok</code> /{" "}
                    <code className="font-mono text-danger">Err</code> /{" "}
                    <code className="font-mono">tryCatch</code> /{" "}
                    <code className="font-mono">match</code> — no thrown
                    exceptions in your hot path.
                  </p>
                </div>
              </div>
              <ResultDemo />
            </SpotlightCard>
          </Reveal>

          {/* zero deps */}
          <Reveal delay={0.1} y={36}>
            <SpotlightCard className="h-full p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-acid/10 text-acid">
                <Package size={19} />
              </span>
              <div className="mt-4 font-mono text-3xl font-bold text-acid">0</div>
              <h3 className="mt-1 font-bold">runtime dependencies</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                Pure TypeScript. Nothing to audit, nothing to break your lockfile.
              </p>
            </SpotlightCard>
          </Reveal>

          {/* i18n */}
          <Reveal delay={0.14} y={36}>
            <SpotlightCard className="h-full p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-vio/10 text-vio">
                <Languages size={19} />
              </span>
              <div className="mt-4 font-mono text-3xl font-bold text-vio">27+</div>
              <h3 className="mt-1 font-bold">languages, lazy-loaded</h3>
              <I18nDemo />
              <p className="mt-1 text-xs text-muted">error messages your users actually read</p>
            </SpotlightCard>
          </Reveal>

          {/* type inference */}
          <Reveal delay={0.18} y={36}>
            <SpotlightCard className="h-full p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-acid/10 text-acid">
                <Braces size={19} />
              </span>
              <h3 className="mt-4 font-bold">Static type inference</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                <code className="rounded bg-foreground/[0.06] px-1 font-mono text-xs text-acid">
                  v.infer&lt;typeof S&gt;
                </code>{" "}
                — your schema is your type. One source of truth.
              </p>
            </SpotlightCard>
          </Reveal>

          {/* mini */}
          <Reveal delay={0.22} y={36}>
            <SpotlightCard className="h-full p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-vio/10 text-vio">
                <TreePine size={19} />
              </span>
              <h3 className="mt-4 font-bold">Tree-shakeable mini API</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                Bundle-constrained? Import only what you parse. The rest never
                ships.
              </p>
            </SpotlightCard>
          </Reveal>

          {/* plugins */}
          <Reveal delay={0.26} y={36}>
            <SpotlightCard className="h-full p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-acid/10 text-acid">
                <Puzzle size={19} />
              </span>
              <h3 className="mt-4 font-bold">Plugin system</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                Extend schemas with your own kernels, formats and transforms —
                first-class hooks.
              </p>
            </SpotlightCard>
          </Reveal>

          {/* codecs */}
          <Reveal delay={0.3} y={36}>
            <SpotlightCard className="h-full p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-vio/10 text-vio">
                <FileJson size={19} />
              </span>
              <h3 className="mt-4 font-bold">Bidirectional codecs</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                JSON, base64, hex — parse, encode and decode with the same fluent
                chains.
              </p>
            </SpotlightCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
