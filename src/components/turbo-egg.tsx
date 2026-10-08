"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Zap } from "lucide-react";

/**
 * Easter egg: hit "v" three times in quick succession → TURBO MODE.
 * The hero data-stream overclocks for a few seconds. See footer hint.
 */
export function TurboEgg() {
  const [active, setActive] = useState(false);
  const strikes = useRef<number[]>([]);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      if (e.key.toLowerCase() !== "v" || e.metaKey || e.ctrlKey || e.altKey) return;

      const now = Date.now();
      strikes.current = strikes.current.filter((t) => now - t < 900);
      strikes.current.push(now);

      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => (strikes.current = []), 950);

      if (strikes.current.length >= 3) {
        strikes.current = [];
        window.dispatchEvent(new CustomEvent("vld:turbo"));
        setActive(true);
        if (clearTimer.current) clearTimeout(clearTimer.current);
        clearTimer.current = setTimeout(() => setActive(false), 3200);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (resetTimer.current) clearTimeout(resetTimer.current);
      if (clearTimer.current) clearTimeout(clearTimer.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0, y: -24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 320, damping: 22 }}
          className="glow-acid fixed left-1/2 top-20 z-[90] flex -translate-x-1/2 items-center gap-2.5 rounded-full bg-acid px-5 py-2.5 font-mono text-sm font-bold text-[#04110a]"
        >
          <Zap size={15} strokeWidth={3} className="animate-pulse" />
          TURBO MODE ENGAGED
          <span className="opacity-70">· data stream ×4</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
