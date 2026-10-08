"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Star } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { GithubIcon } from "@/components/icons";

const LINKS = [
  { href: "#playground", label: "Playground" },
  { href: "#benchmarks", label: "Benchmarks" },
  { href: "#features", label: "Features" },
  { href: "#migrate", label: "Migrate" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-[60] transition-all duration-300 ${
        scrolled ? "glass border-b border-line" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="#top" className="group flex items-center gap-2.5">
          <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-code-bg">
            <svg viewBox="0 0 64 64" className="h-5 w-5">
              <path d="M36 8 16 36h12l-4 20 24-30H34l6-18z" fill="var(--acid)" />
            </svg>
            <span className="absolute inset-0 rounded-lg border border-acid/40 opacity-0 transition-opacity group-hover:opacity-100" />
          </span>
          <span className="font-mono text-lg font-bold tracking-tight">
            vld
            <span className="text-acid">.</span>
          </span>
          <span className="hidden rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-muted sm:inline-block">
            v3.0.11
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-3.5 py-1.5 text-sm text-muted transition-colors hover:bg-surface hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/ersinkoc/vld"
            target="_blank"
            rel="noreferrer"
            className="group hidden items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm transition-colors hover:border-acid/40 sm:flex"
          >
            <GithubIcon className="h-4 w-4" />
            <span className="font-mono text-xs text-muted">Star</span>
            <span className="flex items-center gap-1 font-mono text-xs text-acid">
              <Star size={11} className="fill-acid" />
              17
            </span>
          </a>
          <ThemeToggle />
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-full border border-line bg-surface md:hidden"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="glass overflow-hidden border-b border-line md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-muted transition-colors hover:bg-surface hover:text-foreground"
                >
                  {l.label}
                </Link>
              ))}
              <a
                href="https://github.com/ersinkoc/vld"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-muted"
              >
                <GithubIcon className="h-4 w-4" /> GitHub
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
