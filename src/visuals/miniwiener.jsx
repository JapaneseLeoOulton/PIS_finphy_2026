// src/visuals/miniwiener.jsx
import React, { useEffect, useRef } from "react";

export default function MiniWiener({ width = 320, height = 150 }) {
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

    // Layout
    const pad = 10;
    const leftW = Math.floor(width * 0.38);
    const rightW = width - leftW - pad;

    const left = { x: pad, y: pad, w: leftW - pad, h: height - 2 * pad };
    const right = { x: leftW, y: pad, w: rightW, h: height - 2 * pad };

    // Wiener path state (discrete)
    const N = 48; // segments per loop
    const dt = 1 / N;

    let k = 0;
    let W = 0;
    const path = [{ x: 0, y: 0 }];

    // sampled increment for the dot
    let sampleX = 0; // in "sigma" units
    let sampleHold = 0;

    // RNG + normal
    function rand() {
      return Math.random();
    }
    function normal01() {
      const u1 = rand() || 1e-12;
      const u2 = rand();
      return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    }

    // Helper: gaussian pdf
    function phi(x) {
      return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
    }

    // Mapping for left pdf plot
    const xMin = -3.2;
    const xMax = 3.2;

    function mapLeftX(x) {
      return left.x + ((x - xMin) / (xMax - xMin)) * left.w;
    }
    function mapLeftY(pdf) {
      // pdf range approx [0, 0.4], map to left panel height
      const pMax = 0.42;
      return left.y + left.h - (pdf / pMax) * left.h;
    }

    // Mapping for right path plot
    function mapRightX(i) {
      return right.x + (i / N) * (right.w - pad);
    }
    function mapRightY(wVal) {
      // auto-scale based on typical √t scale ~ √1 = 1. Use fixed visual scale.
      const scale = 2.2; // vertical half-range in "W units"
      const mid = right.y + right.h * 0.5;
      return mid - (wVal / scale) * (right.h * 0.45);
    }

    function reset() {
      k = 0;
      W = 0;
      path.length = 0;
      path.push({ x: 0, y: 0 });
      sampleHold = 0;
      sampleX = 0;
    }

    function drawPanels() {
      // background
      ctx.clearRect(0, 0, width, height);

      // subtle panel borders
      ctx.strokeStyle = "rgba(17,24,39,0.12)";
      ctx.lineWidth = 1;
      ctx.strokeRect(left.x + 0.5, left.y + 0.5, left.w - 1, left.h - 1);
      ctx.strokeRect(right.x + 0.5, right.y + 0.5, right.w - 1, right.h - 1);

      // labels (tiny)
      ctx.fillStyle = "rgba(17,24,39,0.8)";
      ctx.font = "11px system-ui, -apple-system, Segoe UI, Roboto, Arial";
      ctx.fillText("ΔW ~ N(0, Δt)", left.x + 8, left.y + 14);
      ctx.fillText("W(t) builds by adding ΔW", right.x + 8, right.y + 14);
    }

    function drawGaussianAndSample() {
      // draw gaussian curve
      ctx.beginPath();
      let first = true;
      for (let i = 0; i <= 120; i++) {
        const x = xMin + ((xMax - xMin) * i) / 120;
        const y = phi(x);
        const X = mapLeftX(x);
        const Y = mapLeftY(y);
        if (first) {
          ctx.moveTo(X, Y);
          first = false;
        } else {
          ctx.lineTo(X, Y);
        }
      }
      ctx.strokeStyle = "rgba(17,24,39,0.85)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // axis line
      const y0 = mapLeftY(0);
      ctx.beginPath();
      ctx.moveTo(left.x + 6, y0);
      ctx.lineTo(left.x + left.w - 6, y0);
      ctx.strokeStyle = "rgba(17,24,39,0.18)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // sample dot at x=sampleX on pdf
      const dotX = mapLeftX(sampleX);
      const dotY = mapLeftY(phi(sampleX));

      ctx.beginPath();
      ctx.arc(dotX, dotY, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(17,24,39,0.95)";
      ctx.fill();

      // vertical guide
      ctx.beginPath();
      ctx.moveTo(dotX, dotY);
      ctx.lineTo(dotX, y0);
      ctx.strokeStyle = "rgba(17,24,39,0.2)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    function drawPath() {
      // centerline
      const mid = right.y + right.h * 0.5;
      ctx.beginPath();
      ctx.moveTo(right.x + 6, mid);
      ctx.lineTo(right.x + right.w - 6, mid);
      ctx.strokeStyle = "rgba(17,24,39,0.18)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // draw envelope ±√t (optional but subtle)
      ctx.beginPath();
      for (let i = 0; i <= N; i++) {
        const t = i / N;
        const env = Math.sqrt(t);
        const X = mapRightX(i);
        const Y = mapRightY(env);
        if (i === 0) ctx.moveTo(X, Y);
        else ctx.lineTo(X, Y);
      }
      ctx.strokeStyle = "rgba(17,24,39,0.14)";
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.3;
      ctx.stroke();

      ctx.beginPath();
      for (let i = 0; i <= N; i++) {
        const t = i / N;
        const env = -Math.sqrt(t);
        const X = mapRightX(i);
        const Y = mapRightY(env);
        if (i === 0) ctx.moveTo(X, Y);
        else ctx.lineTo(X, Y);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // path line (built segments)
      ctx.beginPath();
      for (let i = 0; i < path.length; i++) {
        const X = mapRightX(i);
        const Y = mapRightY(path[i].y);
        if (i === 0) ctx.moveTo(X, Y);
        else ctx.lineTo(X, Y);
      }
      ctx.strokeStyle = "rgba(17,24,39,0.9)";
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // current point
      const i = path.length - 1;
      const X = mapRightX(i);
      const Y = mapRightY(path[i].y);
      ctx.beginPath();
      ctx.arc(X, Y, 3.4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(17,24,39,0.95)";
      ctx.fill();
    }

    function tick() {
      // update: hold sample a bit to make it readable
      if (sampleHold <= 0) {
        const z = normal01(); // standard normal
        sampleX = Math.max(xMin, Math.min(xMax, z)); // keep dot on plot bounds

        // increment: ΔW = √dt * Z
        const dW = Math.sqrt(dt) * z;
        W += dW;

        k += 1;
        path.push({ x: k / N, y: W });

        // hold for a few frames
        sampleHold =40;

        // reset when finished
        if (k >= N) {
          // brief pause, then reset
          sampleHold = 25;
          // schedule reset by setting k beyond N and checking below
        }
      } else {
        sampleHold -= 1;
        if (k >= N && sampleHold === 0) reset();
      }

      drawPanels();
      drawGaussianAndSample();
      drawPath();

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