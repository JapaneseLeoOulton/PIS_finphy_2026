// src/visuals/miniterminal.jsx
import React, { useEffect, useRef } from "react";

export default function MiniTerminal({ width = 320, height = 150 }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const pad = 10;
    const box = { x: pad, y: pad, w: width - 2 * pad, h: height - 2 * pad };

    // Plot area inside box
    const plot = {
      x: box.x + 10,
      y: box.y + 18,
      w: box.w - 20,
      h: box.h - 30,
    };

    // "Theory" for Wiener terminal: W_T ~ N(0, T) with T=1
    const T = 1;
    const sigma = Math.sqrt(T);

    // Histogram settings
    const BIN_COUNT = 18;
    const X_MIN = -3.2 * sigma;
    const X_MAX = 3.2 * sigma;
    const BIN_W = (X_MAX - X_MIN) / BIN_COUNT;

    const counts = new Array(BIN_COUNT).fill(0);
    let n = 0;

    const MAX_SAMPLES = 5000;
    const SAMPLES_PER_FRAME = 5;

    let phase = "fill"; // "fill" -> "hold" -> "fade"
    let holdFrames = 0;
    let fade = 1;

    function normal01() {
      const u1 = Math.random() || 1e-12;
      const u2 = Math.random();
      return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    }

    function pdfNormal(x) {
      const s2 = sigma * sigma;
      return Math.exp(-(x * x) / (2 * s2)) / Math.sqrt(2 * Math.PI * s2);
    }

    function reset() {
      for (let i = 0; i < BIN_COUNT; i++) counts[i] = 0;
      n = 0;
      phase = "fill";
      holdFrames = 10;
      fade = 1;
    }

    function mapX(x) {
      return plot.x + ((x - X_MIN) / (X_MAX - X_MIN)) * plot.w;
    }

    function mapY(y, yMax) {
      return plot.y + plot.h - (y / yMax) * plot.h;
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // border
      ctx.strokeStyle = "rgba(17,24,39,0.12)";
      ctx.lineWidth = 1;
      ctx.strokeRect(box.x + 0.5, box.y + 0.5, box.w - 1, box.h - 1);

      // title
      ctx.fillStyle = "rgba(17,24,39,0.85)";
      ctx.font = "11px system-ui, -apple-system, Segoe UI, Roboto, Arial";
      ctx.fillText("Terminal distribution builds (Monte Carlo)", box.x + 8, box.y + 14);

      // compute density histogram heights
      const dens = new Array(BIN_COUNT).fill(0);
      if (n > 0) {
        for (let i = 0; i < BIN_COUNT; i++) {
          dens[i] = counts[i] / (n * BIN_W); // density estimate
        }
      }

      const pdfPeak = pdfNormal(0);
      const histPeak = dens.reduce((m, v) => (v > m ? v : m), 0);
      const yMax = Math.max(pdfPeak, histPeak, 0.01) * 1.15;

      // theory pdf line (behind)
      ctx.beginPath();
      for (let i = 0; i <= 140; i++) {
        const x = X_MIN + ((X_MAX - X_MIN) * i) / 140;
        const y = pdfNormal(x);
        const X = mapX(x);
        const Y = mapY(y, yMax);
        if (i === 0) ctx.moveTo(X, Y);
        else ctx.lineTo(X, Y);
      }
      ctx.globalAlpha = 0.35 * fade;
      ctx.strokeStyle = "rgba(17,24,39,1)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // histogram bars (front)
      for (let i = 0; i < BIN_COUNT; i++) {
        const x0 = X_MIN + i * BIN_W;
        const x1 = x0 + BIN_W;

        const X0 = mapX(x0);
        const X1 = mapX(x1);
        const w = Math.max(1, X1 - X0 - 1);

        const hVal = dens[i];
        const Y = mapY(hVal, yMax);
        const H = plot.y + plot.h - Y;

        ctx.globalAlpha = 0.75 * fade;
        ctx.fillStyle = "rgba(17,24,39,1)";
        ctx.fillRect(X0 + 0.5, Y, w, H);
        ctx.globalAlpha = 1;
      }

      // axis baseline
      ctx.beginPath();
      ctx.moveTo(plot.x, plot.y + plot.h + 0.5);
      ctx.lineTo(plot.x + plot.w, plot.y + plot.h + 0.5);
      ctx.strokeStyle = "rgba(17,24,39,0.18)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // tiny n label
      ctx.fillStyle = "rgba(17,24,39,0.7)";
      ctx.font = "11px system-ui, -apple-system, Segoe UI, Roboto, Arial";
      ctx.fillText(`n = ${n}`, box.x + box.w - 52, box.y + 14);
    }

    function tick() {
      if (phase === "fill") {
        for (let s = 0; s < SAMPLES_PER_FRAME; s++) {
          const z = normal01();
          const wT = sigma * z;

          const idx = Math.floor((wT - X_MIN) / BIN_W);
          if (idx >= 0 && idx < BIN_COUNT) {
            counts[idx] += 1;
          }
          n += 1;

          if (n >= MAX_SAMPLES) break;
        }
        if (n >= MAX_SAMPLES) {
          phase = "hold";
          holdFrames = Math.round(0.5 * 60); // ~0.5s at 60fps
        }
      } else if (phase === "hold") {
        holdFrames -= 1;
        if (holdFrames <= 0) phase = "fade";
      } else if (phase === "fade") {
        fade -= 0.05;
        if (fade <= 0) reset();
      }

      draw();
      rafRef.current = requestAnimationFrame(tick);
    }

    reset();
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [width, height]);

  return <canvas ref={canvasRef} />;
}