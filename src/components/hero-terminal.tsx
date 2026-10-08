"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";

type Line = { kind: "cmd" | "code" | "ok" | "err" | "blank" | "comment"; text: string };

const SCRIPT: Line[] = [
  { kind: "cmd", text: "npm install @oxog/vld" },
  { kind: "blank", text: "" },
  { kind: "code", text: 'import { v } from "@oxog/vld";' },
  { kind: "blank", text: "" },
  { kind: "code", text: "const User = v.object({" },
  { kind: "code", text: '  name:  v.string().min(2),' },
  { kind: "code", text: "  email: v.string().email()," },
  { kind: "code", text: "});" },
  { kind: "blank", text: "" },
  { kind: "code", text: 'User.parse({ name: "Ada", email: "ada@dev.tr" });' },
  { kind: "ok", text: "✓ valid · 0.0006 ms · ~620M ops/s" },
  { kind: "blank", text: "" },
  { kind: "code", text: 'User.parse({ name: "X", email: "nope" });' },
  { kind: "err", text: '✗ email → "Geçersiz e-posta adresi" (tr)' },
  { kind: "comment", text: "// 27+ languages · zero dependencies · 3.03× faster" },
];

/* ---- tiny TS tokenizer: enough color to feel alive ---- */
const RULES: [RegExp, string][] = [
  [/^(import|from|const|new|return|export|await|async)\b/, "text-vio-soft"],
  [/^"([^"\\]|\\.)*"/, "text-acid-bright"],
  [/^'([^'\\]|\\.)*'/, "text-acid-bright"],
  [/^`([^`\\]|\\.)*`/, "text-acid-bright"],
  [/^\/\/.*$/, "text-code-fg/45"],
  [/^✓[^\n]*/, "text-acid-bright"],
  [/^✗[^\n]*/, "text-danger-soft"],
  [/^\d+(\.\d+)?(ms|×|M)?/, "text-amber-soft"],
  [/^[A-Z][A-Za-z0-9_]*/, "text-code-fg"],
  [/^[a-zA-Z_][\w$]*/, ""],
  [/^\s+/, ""],
  [/^./, "text-code-fg"],
];

function tokenize(line: string, kind: Line["kind"]) {
  if (kind === "cmd") {
    return [
      <span key="p" className="text-acid-bright">$ </span>,
      <span key="t">{line}</span>,
    ];
  }
  if (kind === "ok" || kind === "err" || kind === "comment") {
    const cls =
      kind === "ok" ? "text-acid-bright" : kind === "err" ? "text-danger-soft" : "text-code-fg/45";
    return <span className={cls}>{line}</span>;
  }
  const out: React.ReactNode[] = [];
  let rest = line;
  let key = 0;
  while (rest.length > 0) {
    let matched = false;
    for (const [re, cls] of RULES) {
      const m = re.exec(rest);
      if (m) {
        out.push(
          m[0].trim() ? (
            <span key={key++} className={cls}>
              {m[0]}
            </span>
          ) : (
            <span key={key++}>{m[0]}</span>
          )
        );
        rest = rest.slice(m[0].length);
        matched = true;
        break;
      }
    }
    if (!matched) {
      out.push(<span key={key++}>{rest[0]}</span>);
      rest = rest.slice(1);
    }
  }
  return out;
}

export function HeroTerminal() {
  const [li, setLi] = useState(0); // line index
  const [ci, setCi] = useState(0); // char index within line
  const [holding, setHolding] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const visibleRef = useRef(true);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => (visibleRef.current = e.isIntersecting), {
      threshold: 0.1,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (holding) {
      const t = setTimeout(() => {
        setLi(0);
        setCi(0);
        setHolding(false);
      }, 4200);
      return () => clearTimeout(t);
    }
    if (li >= SCRIPT.length) {
      const t = setTimeout(() => setHolding(true), 600);
      return () => clearTimeout(t);
    }
    const line = SCRIPT[li];
    const delay = line.kind === "blank" ? 60 : line.kind === "ok" || line.kind === "err" ? 26 : 17 + Math.random() * 22;
    const t = setTimeout(() => {
      if (!visibleRef.current) return;
      if (ci < line.text.length) {
        setCi(ci + 1);
      } else {
        setLi(li + 1);
        setCi(0);
      }
    }, delay);
    return () => clearTimeout(t);
  }, [li, ci, holding]);

  const rendered = useMemo(() => {
    const done = SCRIPT.slice(0, li).map((l, i) => ({ l, i, text: l.text }));
    const current = SCRIPT[li];
    return { done, current, partial: current ? current.text.slice(0, ci) : "" };
  }, [li, ci]);

  const totalChars = SCRIPT.reduce((a, l) => a + l.text.length, 0);
  const typedChars =
    SCRIPT.slice(0, li).reduce((a, l) => a + l.text.length, 0) + ci;
  const progress = holding ? 1 : typedChars / totalChars;

  return (
    <motion.div
      ref={boxRef}
      initial={{ opacity: 0, y: 60, rotateX: 14 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformPerspective: 1200 }}
      className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-line bg-code-bg shadow-2xl shadow-black/40"
    >
      {/* title bar */}
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-[11px] text-code-fg/50">
          vld — live — zsh
        </span>
        <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-acid-bright">
          <span className="h-1.5 w-1.5 animate-blink-dot rounded-full bg-acid-bright" />
          running
        </span>
      </div>

      {/* progress hairline */}
      <div className="h-px w-full bg-line">
        <div
          className="h-px bg-acid transition-[width] duration-150"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* scan line sweep */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-full overflow-hidden">
        <div className="h-16 w-full animate-scan bg-gradient-to-b from-transparent via-acid/[0.06] to-transparent" />
      </div>

      <div className="min-h-[320px] px-5 py-4 font-mono text-[12.5px] leading-[1.75] text-code-fg sm:text-[13px]">
        {rendered.done.map(({ l, i, text }) => (
          <div key={i} className="whitespace-pre">
            {tokenize(text, l.kind)}
          </div>
        ))}
        {!holding && rendered.current && (
          <div className="whitespace-pre">
            {tokenize(rendered.partial, rendered.current.kind)}
            <span className="ml-0.5 inline-block h-[1.1em] w-[7px] translate-y-[3px] animate-caret bg-acid-bright" />
          </div>
        )}
        {holding && (
          <div className="whitespace-pre">
            <span className="text-acid">$ </span>
            <span className="inline-block h-[1.1em] w-[7px] translate-y-[3px] animate-caret bg-acid-bright" />
          </div>
        )}
      </div>

      {/* corner ornament */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rotate-45 bg-gradient-to-br from-acid/20 to-transparent blur-xl" />
    </motion.div>
  );
}
