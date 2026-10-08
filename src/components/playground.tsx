"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  v,
  setLocale,
  setLocaleAsync,
  getLocale,
  getSupportedLocales,
  type Locale,
} from "@oxog/vld";
import {
  CircleCheck,
  CircleX,
  Globe,
  RotateCcw,
  Bomb,
  Braces,
} from "lucide-react";
import { SectionHeader, Reveal } from "@/components/ui/reveal";

/* ---------- schemas (the real library, in your browser) ---------- */

const userSchema = v.object({
  name: v.string().min(2, "Name needs at least 2 characters"),
  email: v.string().email(),
  age: v.number().int().min(0).max(150),
  role: v.enum(["admin", "user", "guest"]),
  website: v.string().url().optional(),
});

const postSchema = v.object({
  title: v.string().min(3).max(120),
  tags: v.array(v.string()).max(5),
  published: v.boolean(),
  views: v.number().int().min(0),
});

const paymentSchema = v.object({
  amount: v.number().positive(),
  currency: v.enum(["USD", "EUR", "TRY", "GBP"]),
  method: v.enum(["card", "transfer", "crypto"]),
  reference: v.string().regex(/^[A-Z]{2}-\d{6}$/, "Format: AB-123456"),
});

const SCHEMAS = {
  user: {
    label: "User",
    schema: userSchema,
    sample: {
      name: "Ada Lovelace",
      email: "ada@lovelace.dev",
      age: 36,
      role: "admin",
      website: "https://ada.dev",
    },
  },
  post: {
    label: "Post",
    schema: postSchema,
    sample: {
      title: "Why VLD parses 620M ops/sec",
      tags: ["typescript", "performance"],
      published: true,
      views: 421337,
    },
  },
  payment: {
    label: "Payment",
    schema: paymentSchema,
    sample: {
      amount: 149.9,
      currency: "TRY",
      method: "card",
      reference: "EK-311642",
    },
  },
} as const;

type SchemaKey = keyof typeof SCHEMAS;

const LANG_LABELS: Record<string, string> = {
  en: "English",
  tr: "Türkçe",
  de: "Deutsch",
  es: "Español",
  fr: "Français",
  it: "Italiano",
  pt: "Português",
  ja: "日本語",
  ko: "한국어",
  zh: "中文",
  ru: "Русский",
  ar: "العربية",
  hi: "हिन्दी",
  id: "Bahasa Indonesia",
  nl: "Nederlands",
  pl: "Polski",
  sv: "Svenska",
  fi: "Suomi",
  da: "Dansk",
  uk: "Українська",
  cs: "Čeština",
  vi: "Tiếng Việt",
  th: "ไทย",
  bn: "বাংলা",
  fa: "فارسی",
  he: "עברית",
  el: "Ελληνικά",
};

function mutate(json: string): string {
  // "break it": corrupt one field at a time, rotating through sabotage modes
  let obj: Record<string, unknown>;
  try {
    obj = JSON.parse(json);
  } catch {
    return json;
  }
  const sabotage: Array<() => void> = [
    () => {
      for (const k of Object.keys(obj)) {
        if (/email/i.test(k)) obj[k] = "definitely-not-an-email";
      }
    },
    () => {
      for (const k of Object.keys(obj)) {
        if (typeof obj[k] === "number") obj[k] = -42;
      }
    },
    () => {
      for (const k of Object.keys(obj)) {
        if (typeof obj[k] === "string" && obj[k].length > 3) obj[k] = "x";
      }
    },
    () => {
      delete obj[Object.keys(obj)[0]];
    },
    () => {
      obj.extra = "unexpected guest";
    },
  ];
  const idx = Math.floor(Math.random() * sabotage.length);
  sabotage[idx]();
  return JSON.stringify(obj, null, 2);
}

type Issue = { path: string; code: string; message: string };

export function Playground() {
  const [schemaKey, setSchemaKey] = useState<SchemaKey>("user");
  const [json, setJson] = useState(() => JSON.stringify(SCHEMAS.user.sample, null, 2));
  const [locale, setLocaleState] = useState("en");
  const [result, setResult] = useState<
    | { ok: true; data: unknown; ms: number; ops: number }
    | { ok: false; issues: Issue[]; jsonError?: string; ms: number; ops: number }
    | null
  >(null);
  const [runId, setRunId] = useState(0);

  const run = useCallback(
    async (text: string, key: SchemaKey, loc: string) => {
      setRunId((n) => n + 1);
      const { schema } = SCHEMAS[key];

      if (loc !== getLocale()) {
        try {
          await setLocaleAsync(loc as Locale);
        } catch {
          try {
            setLocale(loc as Locale);
          } catch {
            /* keep english */
          }
        }
      }

      let data: unknown;
      try {
        data = JSON.parse(text);
      } catch (e) {
        setResult({
          ok: false,
          issues: [],
          jsonError: e instanceof Error ? e.message : "Invalid JSON",
          ms: 0,
          ops: 0,
        });
        return;
      }

      // measure a real batch — small enough to never block, big enough to be honest
      const N = 500;
      const t0 = performance.now();
      let last: ReturnType<typeof schema.safeParse> | null = null;
      for (let i = 0; i < N; i++) last = schema.safeParse(data);
      const total = performance.now() - t0;
      const perOp = total / N;
      const ops = perOp > 0 ? 1000 / perOp : 0; // ops per millisecond

      if (last?.success) {
        setResult({ ok: true, data: last.data, ms: perOp, ops });
      } else if (last && !last.success) {
        const issues = last.error.issues.map((i) => ({
          path: i.path.join(".") || "root",
          code: i.code,
          message: i.message,
        }));
        setResult({ ok: false, issues, ms: perOp, ops });
      }
    },
    []
  );

  /* re-run on any change, debounced */
  useEffect(() => {
    const t = setTimeout(() => void run(json, schemaKey, locale), 140);
    return () => clearTimeout(t);
  }, [json, schemaKey, locale, run]);

  /* supported locales, discovered straight from the library */
  const langOptions = useMemo(() => {
    let all: string[] = ["en"];
    try {
      all = (getSupportedLocales() as string[] | undefined) ?? ["en"];
    } catch {
      /* english fallback */
    }
    return all
      .filter((l) => LANG_LABELS[l])
      .sort((a, b) => LANG_LABELS[a].localeCompare(LANG_LABELS[b]));
  }, []);

  const pickSchema = (key: SchemaKey) => {
    setSchemaKey(key);
    setJson(JSON.stringify(SCHEMAS[key].sample, null, 2));
  };

  return (
    <section id="playground" className="relative py-28 sm:py-36">
      {/* backdrop flourish */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-15%] top-[20%] h-[50vh] w-[45vw] rounded-full bg-vio/[0.05] blur-[110px]" />
        <div className="absolute right-[-10%] bottom-[10%] h-[40vh] w-[35vw] rounded-full bg-acid/[0.05] blur-[110px]" />
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          kicker="live playground"
          title={
            <>
              Don&apos;t take our word for it.{" "}
              <span className="text-gradient-vio">Break it.</span>
            </>
          }
          sub="This page embeds the actual @oxog/vld library, running in your browser right now. Edit the JSON, switch the error language, watch it validate on every keystroke."
        />

        <Reveal delay={0.15} className="mt-14">
          <div className="card-line overflow-hidden rounded-3xl bg-surface">
            {/* toolbar */}
            <div className="flex flex-wrap items-center gap-3 border-b border-line px-5 py-3.5">
              <div className="flex items-center gap-1.5">
                <Braces size={14} className="text-acid" />
                {(Object.keys(SCHEMAS) as SchemaKey[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => pickSchema(key)}
                    className={`whitespace-nowrap rounded-full px-3.5 py-1.5 font-mono text-xs transition-colors ${
                      schemaKey === key
                        ? "bg-acid font-semibold text-[#04110a]"
                        : "border border-line text-muted hover:text-foreground"
                    }`}
                  >
                    {SCHEMAS[key].label}
                  </button>
                ))}
              </div>

              <div className="ml-auto flex flex-wrap items-center gap-2">
                <div className="relative flex items-center">
                  <Globe size={13} className="pointer-events-none absolute left-2.5 text-muted" />
                  <select
                    value={locale}
                    onChange={(e) => setLocaleState(e.target.value)}
                    aria-label="Error message language"
                    className="cursor-pointer appearance-none rounded-full border border-line bg-surface py-1.5 pl-7 pr-7 font-mono text-xs outline-none transition-colors hover:border-acid/40 focus:border-acid"
                  >
                    {langOptions.map((l) => (
                      <option key={l} value={l} className="bg-background text-foreground">
                        {LANG_LABELS[l]} ({l})
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => setJson((j) => mutate(j))}
                  className="whitespace-nowrap flex items-center gap-1.5 rounded-full border border-danger/30 bg-danger/[0.06] px-3.5 py-1.5 font-mono text-xs text-danger transition-colors hover:bg-danger/[0.14]"
                >
                  <Bomb size={12} /> break it
                </button>
                <button
                  type="button"
                  onClick={() => setJson(JSON.stringify(SCHEMAS[schemaKey].sample, null, 2))}
                  className="whitespace-nowrap flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 font-mono text-xs text-muted transition-colors hover:text-foreground"
                >
                  <RotateCcw size={12} /> reset
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2">
              {/* editor */}
              <div className="relative border-b border-line bg-code-bg lg:border-b-0 lg:border-r">
                <div className="flex items-center justify-between px-5 pt-3.5">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-code-fg/50">
                    input.json
                  </span>
                  <span className="font-mono text-[11px] text-code-fg/50">
                    {json.length} chars
                  </span>
                </div>
                <textarea
                  value={json}
                  onChange={(e) => setJson(e.target.value)}
                  spellCheck={false}
                  aria-label="JSON input"
                  className="h-[340px] w-full resize-none bg-code-bg px-5 py-4 font-mono text-[13px] leading-relaxed text-code-fg outline-none"
                />
                <div className="pointer-events-none absolute bottom-3 left-5 font-mono text-[10px] uppercase tracking-widest text-code-fg/35">
                  ● editable — go ahead
                </div>
              </div>

              {/* result */}
              <div className="relative min-h-[340px] bg-code-bg">
                <div className="flex items-center justify-between px-5 pt-3.5">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-code-fg/50">
                    result
                  </span>
                  {result && (
                    <span className="font-mono text-[11px] text-code-fg/55">
                      {result.ms > 0 && (
                        <>
                          {(result.ms * 1000).toFixed(1)} µs/op ·{" "}
                          <span className="text-acid-bright">
                            {result.ops >= 1000
                              ? `${(result.ops / 1000).toFixed(1)}M ops/s`
                              : `${result.ops.toFixed(0)}k ops/s`}
                          </span>{" "}
                          · measured in-browser
                        </>
                      )}
                    </span>
                  )}
                </div>

                <div className="px-5 py-4">
                  <AnimatePresence mode="wait">
                    {result === null && (
                      <motion.div
                        key="boot"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="font-mono text-sm text-code-fg/50"
                      >
                        booting validator…
                      </motion.div>
                    )}

                    {result?.ok && (
                      <motion.div
                        key={`ok-${runId}`}
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="flex items-center gap-2.5 rounded-xl border border-acid/30 bg-acid/[0.07] px-4 py-3">
                          <CircleCheck size={18} className="shrink-0 text-acid-bright" />
                          <span className="font-mono text-sm font-semibold text-acid-bright">
                            Valid — schema satisfied
                          </span>
                        </div>
                        <pre className="mt-3 overflow-x-auto rounded-xl border border-line bg-code-bg p-4 font-mono text-[12.5px] leading-relaxed text-code-fg">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </motion.div>
                    )}

                    {result && !result.ok && (
                      <motion.div
                        key={`err-${runId}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        {result.jsonError ? (
                          <div className="flex items-center gap-2.5 rounded-xl border border-danger/40 bg-danger/[0.08] px-4 py-3">
                            <CircleX size={18} className="shrink-0 text-danger" />
                            <span className="font-mono text-sm text-danger-soft">
                              JSON parse error — {result.jsonError}
                            </span>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2.5 rounded-xl border border-danger/40 bg-danger/[0.08] px-4 py-3">
                              <CircleX size={18} className="shrink-0 text-danger" />
                              <span className="font-mono text-sm font-semibold text-danger-soft">
                                {result.issues.length} issue
                                {result.issues.length > 1 ? "s" : ""} found
                              </span>
                            </div>
                            <ul className="mt-3 flex flex-col gap-2">
                              {result.issues.map((issue, i) => (
                                <motion.li
                                  key={`${issue.path}-${i}`}
                                  initial={{ opacity: 0, x: -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.05 }}
                                  className="rounded-xl border border-danger/20 bg-danger/[0.04] px-4 py-2.5"
                                >
                                  <div className="flex items-center gap-2">
                                    <code className="rounded-md bg-danger/20 px-1.5 py-0.5 font-mono text-[11px] text-danger-soft">
                                      {issue.path}
                                    </code>
                                    <span className="font-mono text-[10px] uppercase tracking-wider text-code-fg/40">
                                      {issue.code}
                                    </span>
                                  </div>
                                  <p className="mt-1.5 font-mono text-[12.5px] text-code-fg/90">
                                    {issue.message}
                                  </p>
                                </motion.li>
                              ))}
                            </ul>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
