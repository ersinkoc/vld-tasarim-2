"use client";

import { useEffect, useRef } from "react";

/**
 * The signature hero backdrop: streams of glowing data packets racing
 * left→right through a "validation gate". Valid packets flash green and
 * continue; invalid ones flash red, drop and dissolve — VLD's job, on canvas.
 */
export function DataStreamCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let running = true;
    let visible = true;
    let turbo = 1;
    let dark = true;

    type Packet = {
      lane: number;
      x: number;
      speed: number;
      len: number;
      valid: boolean;
      state: "run" | "drop" | "burst";
      t: number;
      vy: number;
      alpha: number;
    };

    const LANES = 7;
    const packets: Packet[] = [];
    const bursts: { x: number; y: number; t: number; valid: boolean }[] = [];
    let gateX = 0;

    const readTheme = () => {
      dark = document.documentElement.classList.contains("dark");
    };

    readTheme();
    const observer = new MutationObserver(readTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gateX = w * 0.7;
    };

    const laneY = (i: number) => ((i + 0.5) / LANES) * h;

    const spawn = (initial = false): Packet => {
      const lane = Math.floor(Math.random() * LANES);
      return {
        lane,
        x: initial ? Math.random() * w : -60 - Math.random() * 200,
        speed: 0.8 + Math.random() * 2.4,
        len: 14 + Math.random() * 30,
        valid: Math.random() > 0.22,
        state: "run",
        t: 0,
        vy: 0,
        alpha: 0.5 + Math.random() * 0.5,
      };
    };

    const POOL = 26;
    for (let i = 0; i < POOL; i++) packets.push(spawn(true));

    const frame = () => {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      if (!visible) return;

      ctx.clearRect(0, 0, w, h);
      const step = (reduced ? 0.25 : 1) * turbo;

      // faint lane traces
      ctx.lineWidth = 1;
      for (let i = 0; i < LANES; i++) {
        ctx.strokeStyle = dark
          ? `rgba(232,242,236,${0.028 + (i % 2) * 0.012})`
          : `rgba(11,20,16,${0.035 + (i % 2) * 0.012})`;
        ctx.beginPath();
        ctx.moveTo(0, laneY(i));
        ctx.lineTo(w, laneY(i));
        ctx.stroke();
      }

      // validation gate
      const gatePulse = 0.5 + 0.5 * Math.sin(Date.now() / 900);
      const gate = ctx.createLinearGradient(gateX, 0, gateX, h);
      const ga = dark ? 0.22 + gatePulse * 0.12 : 0.16 + gatePulse * 0.08;
      gate.addColorStop(0, `rgba(0,230,140,0)`);
      gate.addColorStop(0.5, dark ? `rgba(0,230,140,${ga})` : `rgba(0,168,107,${ga})`);
      gate.addColorStop(1, `rgba(0,230,140,0)`);
      ctx.strokeStyle = gate;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(gateX, h * 0.04);
      ctx.lineTo(gateX, h * 0.96);
      ctx.stroke();

      // gate ticks
      ctx.lineWidth = 1;
      ctx.strokeStyle = dark ? "rgba(0,230,140,0.28)" : "rgba(0,168,107,0.3)";
      for (let i = 0; i <= 12; i++) {
        const y = (i / 12) * h;
        const tick = i % 3 === 0 ? 7 : 4;
        ctx.beginPath();
        ctx.moveTo(gateX - tick, y);
        ctx.lineTo(gateX + tick, y);
        ctx.stroke();
      }

      // packets
      for (let i = 0; i < packets.length; i++) {
        const p = packets[i];

        if (p.state === "run") {
          p.x += p.speed * step * 2.2;
          if (p.x + p.len >= gateX && p.x < gateX) {
            p.state = "burst";
            p.t = 0;
            bursts.push({ x: gateX, y: laneY(p.lane), t: 0, valid: p.valid });
          }
          if (p.x > w + 80) packets[i] = spawn();

          const head = p.state === "run" ? p.x + p.len : p.x;
          const nearGate = Math.max(0, 1 - Math.abs(p.x + p.len / 2 - gateX) / (w * 0.35));
          const g = nearGate * 0.5;
          const grad = ctx.createLinearGradient(p.x, 0, head, 0);
          grad.addColorStop(0, "rgba(120,150,140,0)");
          grad.addColorStop(1, p.valid
            ? (dark ? `rgba(0,230,140,${(0.14 + g * 0.8) * p.alpha})` : `rgba(0,168,107,${(0.16 + g * 0.7) * p.alpha})`)
            : (dark ? `rgba(255,92,122,${(0.14 + g * 0.8) * p.alpha})` : `rgba(225,29,72,${(0.16 + g * 0.7) * p.alpha})`));
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2;
          ctx.lineCap = "round";
          const y = laneY(p.lane);
          ctx.beginPath();
          ctx.moveTo(p.x, y);
          ctx.lineTo(head, y);
          ctx.stroke();
        } else if (p.state === "drop") {
          p.t += 0.016 * step;
          p.x += p.speed * step * 0.8;
          p.vy += 0.16 * step;
          const y = laneY(p.lane) + p.vy * p.t * 30;
          ctx.strokeStyle = dark ? `rgba(255,92,122,${Math.max(0, 0.7 - p.t)})` : `rgba(225,29,72,${Math.max(0, 0.65 - p.t)})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(p.x, y);
          ctx.lineTo(p.x + p.len * 0.7, y - 3);
          ctx.stroke();
          if (p.t > 0.9) packets[i] = spawn();
        } else if (p.state === "burst") {
          p.t += 0.05 * step;
          if (p.t >= 1) {
            p.state = p.valid ? "run" : "drop";
            if (p.valid) p.x = gateX;
            p.vy = 0;
            p.t = 0;
          }
        }
      }

      // gate bursts
      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i];
        b.t += 0.035 * step;
        if (b.t >= 1) {
          bursts.splice(i, 1);
          continue;
        }
        const r = 4 + b.t * 26;
        ctx.strokeStyle = b.valid
          ? (dark ? `rgba(0,230,140,${0.55 * (1 - b.t)})` : `rgba(0,168,107,${0.5 * (1 - b.t)})`)
          : (dark ? `rgba(255,92,122,${0.55 * (1 - b.t)})` : `rgba(225,29,72,${0.5 * (1 - b.t)})`);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      turbo += (1 - turbo) * 0.04;
    };

    const onTurbo = () => { turbo = 4.2; };
    window.addEventListener("vld:turbo", onTurbo);

    const io = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting; },
      { threshold: 0.02 }
    );
    io.observe(canvas);

    const onVis = () => { visible = !document.hidden; };
    document.addEventListener("visibilitychange", onVis);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    resize();
    raf = requestAnimationFrame(frame);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("vld:turbo", onTurbo);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}
