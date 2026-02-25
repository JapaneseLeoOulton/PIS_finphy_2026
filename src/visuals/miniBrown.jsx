// src/visuals/miniBrown.js
import React, { useEffect, useRef } from "react";

export default function MiniBrown({ width = 320, height = 150 }) {
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

    const tracer = {
      x: width * 0.5,
      y: height * 0.5,
      vx: 0,
      vy: 0,
      r: 10,
    };

    const smallN = 40;
    const small = Array.from({ length: smallN }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 2.4,
      vy: (Math.random() - 0.5) * 2.4,
      r: 2.2,
    }));

    const trail = [];
    const trailMax = 80;

    const damp = 0.985;
    const kickStrength = 0.55;

    function step() {
      ctx.clearRect(0, 0, width, height);

      // update small particles
      for (const p of small) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < p.r) {
          p.x = p.r;
          p.vx *= -1;
        }
        if (p.x > width - p.r) {
          p.x = width - p.r;
          p.vx *= -1;
        }
        if (p.y < p.r) {
          p.y = p.r;
          p.vy *= -1;
        }
        if (p.y > height - p.r) {
          p.y = height - p.r;
          p.vy *= -1;
        }

        // collision with tracer -> kick
        const dx = tracer.x - p.x;
        const dy = tracer.y - p.y;
        const dist = Math.hypot(dx, dy);
        const minDist = tracer.r + p.r;

        if (dist > 0 && dist < minDist) {
          const nx = dx / dist;
          const ny = dy / dist;

          tracer.vx += nx * kickStrength * (Math.random() * 0.6 + 0.7);
          tracer.vy += ny * kickStrength * (Math.random() * 0.6 + 0.7);

          // push the small particle away a bit
          p.x = tracer.x - nx * minDist;
          p.y = tracer.y - ny * minDist;

          // randomize small particle velocity slightly (keeps motion lively)
          p.vx += (Math.random() - 0.5) * 0.6;
          p.vy += (Math.random() - 0.5) * 0.6;
        }
      }

      // update tracer
      tracer.vx *= damp;
      tracer.vy *= damp;
      tracer.x += tracer.vx;
      tracer.y += tracer.vy;

      // keep tracer inside box
      if (tracer.x < tracer.r) {
        tracer.x = tracer.r;
        tracer.vx *= -0.6;
      }
      if (tracer.x > width - tracer.r) {
        tracer.x = width - tracer.r;
        tracer.vx *= -0.6;
      }
      if (tracer.y < tracer.r) {
        tracer.y = tracer.r;
        tracer.vy *= -0.6;
      }
      if (tracer.y > height - tracer.r) {
        tracer.y = height - tracer.r;
        tracer.vy *= -0.6;
      }

      // trail
      trail.push({ x: tracer.x, y: tracer.y });
      while (trail.length > trailMax) trail.shift();

      // draw trail
      ctx.beginPath();
      for (let i = 0; i < trail.length; i++) {
        const t = trail[i];
        if (i === 0) ctx.moveTo(t.x, t.y);
        else ctx.lineTo(t.x, t.y);
      }
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#111827";
      ctx.stroke();
      ctx.globalAlpha = 1;

      // draw small particles
      for (const p of small) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(17,24,39,0.25)";
        ctx.fill();
      }

      // draw tracer
      ctx.beginPath();
      ctx.arc(tracer.x, tracer.y, tracer.r, 0, Math.PI * 2);
      ctx.fillStyle = "#111827";
      ctx.fill();

      // border
      ctx.strokeStyle = "rgba(17,24,39,0.12)";
      ctx.lineWidth = 1;
      ctx.strokeRect(0.5, 0.5, width - 1, height - 1);

      rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [width, height]);

  return <canvas ref={canvasRef} />;
}