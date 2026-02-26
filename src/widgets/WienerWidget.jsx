import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Plot from "react-plotly.js";

// --- MathJax helper (requires MathJax v3 loaded in index.html) ---
function useMathJax(containerRef, deps = []) {
  useEffect(() => {
    const mj = window.MathJax;
    const el = containerRef?.current;
    if (!mj || !el) return;

    mj.typesetClear?.([el]);
    mj.typesetPromise?.([el]).catch((err) => console.error("MathJax typeset failed:", err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

function mulberry32(seed) {
  let s = seed >>> 0;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeRng(seed) {
  const rand = mulberry32(seed);
  return function normal() {
    const u1 = rand() || 1e-10;
    const u2 = rand();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  };
}

const MAX_STEPS = 5000;
const MAX_SIM_PATHS = 5000;
const MAX_BG_PATHS = 60;
const BIN_COUNT = 40;

function buildHistogram(samples, T, binCount) {
  if (samples.length === 0) return { xs: [], ys: [], pdfXs: [], pdfYs: [], binW: 1 };

  const std = Math.sqrt(T);
  const lo = -4 * std;
  const hi = 4 * std;
  const binW = (hi - lo) / binCount;

  const counts = new Array(binCount).fill(0);
  for (const v of samples) {
    const idx = Math.floor((v - lo) / binW);
    if (idx >= 0 && idx < binCount) counts[idx]++;
  }

  const n = samples.length;
  const xs = [];
  const ys = [];
  for (let i = 0; i < binCount; i++) {
    xs.push(lo + i * binW + binW / 2);
    ys.push(counts[i] / (n * binW)); // density
  }

  const pdfXs = [];
  const pdfYs = [];
  const grid = 120;
  for (let i = 0; i <= grid; i++) {
    const x = lo + ((hi - lo) * i) / grid;
    pdfXs.push(x);
    pdfYs.push(Math.exp(-(x * x) / (2 * T)) / Math.sqrt(2 * Math.PI * T));
  }

  return { xs, ys, pdfXs, pdfYs, binW };
}

export default function WienerWidget({ params = {} }) {
  const { T: pT = 1, steps: pSteps = 252, paths: pPaths = 200, seed: pSeed = 0 } = params;

  const [speed, setSpeed] = useState(40);
  const [targetPaths, setTargetPaths] = useState(Math.min(Number(pPaths) || 1, MAX_SIM_PATHS));
  const [showEnvelope, setShowEnvelope] = useState(true);
  const [playing, setPlaying] = useState(false);

  const T = Math.max(1e-6, Number(pT) || 1);
  const steps = Math.max(2, Math.min(Number(pSteps) || 252, MAX_STEPS));
  const dt = T / steps;

  const timeArr = useRef([]);
  const mjWrapRef = useRef(null);

  useEffect(() => {
    timeArr.current = Array.from({ length: steps + 1 }, (_, i) => (i * T) / steps);
  }, [T, steps]);

  // Simulation state in refs for performance
  const rngRef = useRef(null);
  const curPathRef = useRef([0]);
  const curStepRef = useRef(0);
  const curDWRef = useRef(0);
  const bgPathsRef = useRef([]);
  const terminalSamplesRef = useRef([]);
  const simCountRef = useRef(0);

  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);

  // Re-render tick
  const [, setRenderTick] = useState(0);
  const forceRender = useCallback(() => setRenderTick((x) => x + 1), []);

  const initSim = useCallback(() => {
    rngRef.current = makeRng(Number(pSeed) || 0);
    curPathRef.current = [0];
    curStepRef.current = 0;
    curDWRef.current = 0;
    bgPathsRef.current = [];
    terminalSamplesRef.current = [];
    simCountRef.current = 0;
    lastTimeRef.current = null;
  }, [pSeed]);

  useEffect(() => {
    initSim();
    forceRender();
  }, [initSim, forceRender]);

  // Keep targetPaths synced when params.paths changes
  useEffect(() => {
    setTargetPaths(Math.min(Math.max(1, Number(pPaths) || 1), MAX_SIM_PATHS));
  }, [pPaths]);

  const advanceSteps = useCallback(
    (count) => {
      if (!rngRef.current) return;
      const normal = rngRef.current;

      let changed = false;

      for (let i = 0; i < count; i++) {
        if (simCountRef.current >= targetPaths) {
          setPlaying(false);
          return;
        }

        const k = curStepRef.current;

        if (k >= steps) {
          // Finish current path: record terminal value, store as background, start new path
          const wT = curPathRef.current[curPathRef.current.length - 1] ?? 0;
          terminalSamplesRef.current.push(wT);
          simCountRef.current += 1;

          if (bgPathsRef.current.length < MAX_BG_PATHS) {
            bgPathsRef.current.push([...curPathRef.current]);
          }

          curPathRef.current = [0];
          curStepRef.current = 0;
          curDWRef.current = 0;
          changed = true;
          continue;
        }

        const dw = normal() * Math.sqrt(dt);
        curDWRef.current = dw;

        const prev = curPathRef.current[curPathRef.current.length - 1] ?? 0;
        curPathRef.current.push(prev + dw);
        curStepRef.current = k + 1;

        changed = true;
      }

      if (changed) forceRender();
    },
    [steps, dt, targetPaths, forceRender]
  );

  useEffect(() => {
    if (!playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    function loop(ts) {
      if (lastTimeRef.current === null) lastTimeRef.current = ts;

      const elapsed = ts - lastTimeRef.current;
      const msPerStep = 1000 / Math.max(1, speed);

      const stepsToAdvance = Math.floor(elapsed / msPerStep);
      if (stepsToAdvance > 0) {
        lastTimeRef.current += stepsToAdvance * msPerStep;
        advanceSteps(stepsToAdvance);
      }

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, speed, advanceSteps]);

  const handleReset = () => {
    setPlaying(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    initSim();
    forceRender();
  };

  // Derived view state
  const tArr = timeArr.current;
  const curPath = curPathRef.current;
  const curK = curStepRef.current;
  const curW = curPath[curPath.length - 1] ?? 0;
  const curDW = curDWRef.current;

  const curT = curK * dt;
  const theoryStdAtT = Math.sqrt(Math.max(curT, 0));

  const n = simCountRef.current;
  const samples = terminalSamplesRef.current;

  const sampleMean = n > 0 ? samples.reduce((a, b) => a + b, 0) / n : 0;

  let sampleVar = 0;
  if (n > 1) {
    const m = sampleMean;
    const s2 = samples.reduce((acc, x) => acc + (x - m) * (x - m), 0);
    sampleVar = s2 / (n - 1);
  }

  const lastWT = n > 0 ? samples[n - 1] : 0;
  const z = T > 0 ? lastWT / Math.sqrt(T) : 0;

  // LaTeX strings
  const latexHeader = useMemo(() => {
    return String.raw`$$
dW_t \sim \mathcal{N}(0,\,dt), \qquad
W_{t+dt}=W_t+\Delta W, \qquad
W_T \sim \mathcal{N}(0,\,T)
$$`;
  }, []);

  const latexStatsLeft = useMemo(() => {
    return String.raw`
\(
\Delta t = ${dt.toFixed(4)},\;
k = ${curK},\;
t_k = ${curT.toFixed(3)},\;
\Delta W_k = ${curDW.toFixed(4)},\;
W(t_k) = ${curW.toFixed(4)},\;
\sqrt{t_k} = ${theoryStdAtT.toFixed(3)}
\)
`;
  }, [dt, curK, curT, curDW, curW, theoryStdAtT]);

  const latexStatsRight = useMemo(() => {
    return String.raw`
\(
n = ${n},\;
\hat{\mu} = ${sampleMean.toFixed(4)},\;
\widehat{\mathrm{Var}} = ${sampleVar.toFixed(4)},\;
\mathrm{Var}[W_T] = T = ${T.toFixed(4)},\;
z = \frac{W_T}{\sqrt{T}} = ${z.toFixed(3)}
\)
`;
  }, [n, sampleMean, sampleVar, T, z]);

  // Re-typeset when math changes (renderTick forces updates during animation)
  useMathJax(mjWrapRef, [latexHeader, latexStatsLeft, latexStatsRight, showEnvelope, curK, n]);

  // Left plot traces (path builder)
  const leftTraces = [];

  // Background completed paths
  for (const bp of bgPathsRef.current) {
    leftTraces.push({
      x: tArr,
      y: bp,
      type: "scatter",
      mode: "lines",
      line: { width: 0.8 },
      opacity: 0.2,
      showlegend: false,
      hoverinfo: "skip",
    });
  }

  // Mean and envelope
  if (showEnvelope) {
    const sqrtArr = tArr.map((tt) => Math.sqrt(tt)); // tt to avoid accidental 't' issues
    leftTraces.push({
      x: tArr,
      y: tArr.map(() => 0),
      type: "scatter",
      mode: "lines",
      line: { dash: "dot", width: 1.5 },
      name: "mean = 0",
      showlegend: true,
      hoverinfo: "skip",
    });
    leftTraces.push({
      x: tArr,
      y: sqrtArr,
      type: "scatter",
      mode: "lines",
      line: { dash: "dash", width: 1.5 },
      name: "+√t",
      showlegend: true,
      hoverinfo: "skip",
    });
    leftTraces.push({
      x: tArr,
      y: sqrtArr.map((v) => -v),
      type: "scatter",
      mode: "lines",
      line: { dash: "dash", width: 1.5 },
      name: "-√t",
      showlegend: true,
      hoverinfo: "skip",
    });
  }

  // Highlighted current path (only drawn up to current step)
  const hx = tArr.slice(0, curK + 1);
  const hy = curPath.slice(0, curK + 1);

  leftTraces.push({
    x: hx,
    y: hy,
    type: "scatter",
    mode: "lines",
    line: { width: 2.6 },
    opacity: 0.9,
    name: "current path",
    showlegend: true,
    hoverinfo: "skip",
  });

  const leftLayout = {
    autosize: true,
    margin: { l: 44, r: 12, t: 10, b: 44 },
    xaxis: { title: "Time", range: [0, T] },
    yaxis: { title: "W(t)" },
    legend: { orientation: "h", y: -0.22 },
    showlegend: true,
  };

  // Right plot traces (terminal distribution)
  const { xs, ys, pdfXs, pdfYs, binW } = buildHistogram(samples, T, BIN_COUNT);
  const rightTraces = [];

  if (xs.length > 0) {
    rightTraces.push({
      x: xs,
      y: ys,
      type: "bar",
      width: binW * 0.95,
      opacity: 0.55,
      name: "W_T histogram (density)",
      showlegend: true,
      hoverinfo: "skip",
    });
  }

  // Always show theory PDF line
  rightTraces.push({
    x: pdfXs,
    y: pdfYs,
    type: "scatter",
    mode: "lines",
    line: { width: 2 },
    name: "N(0,T) PDF",
    showlegend: true,
    hoverinfo: "skip",
  });

  const rightLayout = {
    autosize: true,
    margin: { l: 44, r: 12, t: 10, b: 44 },
    xaxis: { title: "W_T" },
    yaxis: { title: "density" },
    barmode: "overlay",
    legend: { orientation: "h", y: -0.22 },
    showlegend: true,
  };

  return (
    <div className="widget" ref={mjWrapRef}>
      <div className="widgetHeader">
        <span className="widgetTitle">Wiener process — from increments to distribution</span>
      </div>

      <div className="panel" style={{ marginBottom: 12 }}>
        <div className="panelTitle">Model</div>
        <div style={{ padding: "6px 0" }}>{latexHeader}</div>
      </div>

      <div className="controls">
        <div className="controlGroup">
          <button type="button" onClick={() => setPlaying((p) => !p)}>
            {playing ? "Pause" : "Play"}
          </button>
          <button type="button" onClick={handleReset}>
            Reset
          </button>
        </div>

        <div className="controlGroup">
          <label>
            Speed: {speed} steps/s
            <input
              type="range"
              min={1}
              max={20000}
              value={speed}
              onChange={(e) => setSpeed(+e.target.value)}
            />
          </label>
        </div>

        <div className="controlGroup">
          <label>
            Paths: {targetPaths}
            <input
              type="range"
              min={1}
              max={MAX_SIM_PATHS}
              value={targetPaths}
              onChange={(e) => setTargetPaths(+e.target.value)}
            />
          </label>
        </div>

        <div className="controlGroup">
          <label>
            <input
              type="checkbox"
              checked={showEnvelope}
              onChange={(e) => setShowEnvelope(e.target.checked)}
            />{" "}
            Show uncertainty envelope
          </label>
        </div>
      </div>

      <div className="grid2">
        <div className="panel">
          <div className="panelTitle">Path builder</div>

          <div className="metaRow">
            <span className="statBox">{latexStatsLeft}</span>
          </div>

          <div className="plotWrap" style={{ width: "100%", height: "320px" }}>
            <Plot
              data={leftTraces}
              layout={leftLayout}
              useResizeHandler
              style={{ width: "100%", height: "100%" }}
              config={{ responsive: true, displayModeBar: false }}
            />
          </div>
        </div>

        <div className="panel">
          <div className="panelTitle">Terminal distribution \( W_T \)</div>

          <div className="metaRow">
            <span className="statBox">{latexStatsRight}</span>
          </div>

          <div className="plotWrap" style={{ width: "100%", height: "320px" }}>
            <Plot
              data={rightTraces}
              layout={rightLayout}
              useResizeHandler
              style={{ width: "100%", height: "100%" }}
              config={{ responsive: true, displayModeBar: false }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}