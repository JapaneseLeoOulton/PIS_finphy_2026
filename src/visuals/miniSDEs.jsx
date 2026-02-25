// src/visuals/miniSDEs.jsx
import React, { useEffect, useRef } from "react";

export default function MiniSDEs({ width = 320, height = 150 }) {
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
    const midY = box.y + box.h * 0.58;

    // Make it readable
    const STEPS_PER_SEC = 7;     // slower so you can see it
    const STEP_DT = 1 / STEPS_PER_SEC;

    const driftDx = 5.0;         // bigger deterministic push
    const noiseStd = 9.0;        // bigger random kick

    const trailMax = 60;

    let x = box.x + 18;
    let y = midY;

    let xDet = x;                // deterministic-only position
    let yDet = midY;

    const noisyTrail = [];
    const detTrail = [];

    // store the last decomposition "L" segment for a few frames
    let lastL = null; // {x0,y0, x1,y1, x2,y2, ttl}
    const L_TTL_FRAMES = 14;

    function normal01() {
      const u1 = Math.random() || 1e-12;
      const u2 = Math.random();
      return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    }

    function reset() {
      x = box.x + 18;
      y = midY;
      xDet = x;
      yDet = midY;

      noisyTrail.length = 0;
      detTrail.length = 0;

      noisyTrail.push({ x, y });
      detTrail.push({ x: xDet, y: yDet });

      lastL = null;
    }

    function drawArrowHead(x1, y1, x0, y0, size = 8) {
      const ang = Math.atan2(y1 - y0, x1 - x0);
      const a1 = ang + Math.PI * 0.85;
      const a2 = ang - Math.PI * 0.85;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x1 + size * Math.cos(a1), y1 + size * Math.sin(a1));
      ctx.lineTo(x1 + size * Math.cos(a2), y1 + size * Math.sin(a2));
      ctx.closePath();
      ctx.fill();
    }

    let acc = 0;

    function tick(ts) {
      if (!tick.last) tick.last = ts;
      const dt = (ts - tick.last) / 1000;
      tick.last = ts;

      acc += dt;

      while (acc >= STEP_DT) {
        acc -= STEP_DT;

        // --- one Euler step: x += driftDx, y += noise ---
        const prevX = x;
        const prevY = y;

        const dx = driftDx;
        const dy = noiseStd * normal01();

        // deterministic baseline advances
        xDet += dx;
        // yDet stays constant (pure drift in this toy)

        // noisy advances
        x += dx;
        y += dy;

        // clamp y
        const yMin = box.y + 22;
        const yMax = box.y + box.h - 18;
        if (y < yMin) y = yMin;
        if (y > yMax) y = yMax;

        noisyTrail.push({ x, y });
        detTrail.push({ x: xDet, y: yDet });

        while (noisyTrail.length > trailMax) noisyTrail.shift();
        while (detTrail.length > trailMax) detTrail.shift();

        // store the L-shaped decomposition for visibility
        lastL = {
          x0: prevX,
          y0: prevY,
          x1: prevX + dx,
          y1: prevY,
          x2: prevX + dx,
          y2: prevY + dy,
          ttl: L_TTL_FRAMES,
        };

        // loop reset
        if (x > box.x + box.w - 18) {
          reset();
          break;
        }
      }

      // fade TTL
      if (lastL) {
        lastL.ttl -= 1;
        if (lastL.ttl <= 0) lastL = null;
      }

      // --- draw ---
      ctx.clearRect(0, 0, width, height);

      // border
      ctx.strokeStyle = "rgba(17,24,39,0.12)";
      ctx.lineWidth = 1;
      ctx.strokeRect(box.x + 0.5, box.y + 0.5, box.w - 1, box.h - 1);

      // labels
      ctx.fillStyle = "rgba(17,24,39,0.85)";
      ctx.font = "11px system-ui, -apple-system, Segoe UI, Roboto, Arial";
      ctx.fillText("drift (deterministic)", box.x + 8, box.y + 14);
      ctx.fillText("noise (random)", box.x + 155, box.y + 14);

      // deterministic path (thin dashed)
      ctx.beginPath();
      for (let i = 0; i < detTrail.length; i++) {
        const p = detTrail[i];
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = "rgba(17,24,39,0.35)";
      ctx.setLineDash([5, 4]);
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.setLineDash([]);

      // noisy path (thick solid)
      ctx.beginPath();
      for (let i = 0; i < noisyTrail.length; i++) {
        const p = noisyTrail[i];
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = "rgba(17,24,39,0.9)";
      ctx.lineWidth = 3;
      ctx.stroke();

      // current point
      const cur = noisyTrail[noisyTrail.length - 1];
      ctx.beginPath();
      ctx.arc(cur.x, cur.y, 4.2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(17,24,39,0.95)";
      ctx.fill();

      // last-step decomposition "L" (thick and persistent)
      if (lastL) {
        const alpha = Math.min(1, lastL.ttl / L_TTL_FRAMES);

        // drift segment (horizontal)
        ctx.globalAlpha = 0.9 * alpha;
        ctx.strokeStyle = "rgba(17,24,39,0.95)";
        ctx.fillStyle = "rgba(17,24,39,0.95)";
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(lastL.x0, lastL.y0);
        ctx.lineTo(lastL.x1, lastL.y1);
        ctx.stroke();
        drawArrowHead(lastL.x1, lastL.y1, lastL.x0, lastL.y0, 8);

        // noise segment (vertical)
        ctx.globalAlpha = 0.55 * alpha;
        ctx.strokeStyle = "rgba(17,24,39,0.8)";
        ctx.fillStyle = "rgba(17,24,39,0.8)";
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(lastL.x1, lastL.y1);
        ctx.lineTo(lastL.x2, lastL.y2);
        ctx.stroke();
        drawArrowHead(lastL.x2, lastL.y2, lastL.x1, lastL.y1, 8);

        ctx.globalAlpha = 1;
      }

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