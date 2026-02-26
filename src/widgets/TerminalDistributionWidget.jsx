// src/widgets/TerminalDistributionWidget.jsx
import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import Plot from "react-plotly.js";

function mulberry32(seed) {
  let s = seed >>> 0;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function boxMuller(rng) {
  const u1 = rng() || 1e-12;
  const u2 = rng();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function clamp(x, a, b) {
  return Math.min(b, Math.max(a, x));
}

function normalPdf(x, m, s) {
  const z = (x - m) / s;
  return Math.exp(-0.5 * z * z) / (s * Math.sqrt(2 * Math.PI));
}

function lognormalPdf(x, m, s) {
  // X = exp(Y), Y ~ N(m,s^2)
  if (x <= 0) return 0;
  const y = Math.log(x);
  return normalPdf(y, m, s) / x;
}

export default function TerminalDistributionWidget({ params = {} }) {
  // --- universal params
  const {
    S0 = 100,
    mu = 0.08,
    sigma = 0.2,
    T = 1,
    seed = 42,
  } = params;

  // --- widget UI state
  const [playing, setPlaying] = useState(false);
  const [pathsPerSec, setPathsPerSec] = useState(1500);
  const [nPathsTarget, setNPathsTarget] = useState(5000);
  const [bins, setBins] = useState(70);
  const [view, setView] = useState("S"); // "S" or "logS"
  const [tick, setTick] = useState(0); // rerender trigger

  // --- simulation refs
  const rngRef = useRef(null);
  const nRef = useRef(0);
  const samplesRef = useRef([]); // store S_T
  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);
  const rateRef = useRef(pathsPerSec);

  useEffect(() => {
    rateRef.current = pathsPerSec;
  }, [pathsPerSec]);

  const mLog = useMemo(() => {
    const s0 = Number.isFinite(+S0) ? +S0 : 100;
    return Math.log(s0) + (mu - 0.5 * sigma * sigma) * T;
  }, [S0, mu, sigma, T]);

  const sLog = useMemo(() => Math.max(1e-9, Math.abs(sigma) * Math.sqrt(Math.max(0, T))), [sigma, T]);

  const initSim = useCallback(() => {
    rngRef.current = mulberry32(Number(seed) || 0);
    nRef.current = 0;
    samplesRef.current = [];
    lastTimeRef.current = null;
  }, [seed]);

  // reset when universal params change
  useEffect(() => {
    initSim();
    setPlaying(false);
    setTick((t) => t + 1);
  }, [initSim, S0, mu, sigma, T]);

  const pushNSamples = useCallback(
    (count) => {
      const s0 = Number.isFinite(+S0) ? +S0 : 100;

      for (let i = 0; i < count; i++) {
        const z = boxMuller(rngRef.current);
        const logST = Math.log(s0) + (mu - 0.5 * sigma * sigma) * T + sigma * Math.sqrt(T) * z;
        const ST = Math.exp(logST);
        samplesRef.current.push(ST);
      }
      nRef.current += count;
    },
    [S0, mu, sigma, T]
  );

  const animate = useCallback(
    (ts) => {
      if (lastTimeRef.current === null) lastTimeRef.current = ts;

      const elapsedMs = ts - lastTimeRef.current;
      const rate = Math.max(10, rateRef.current); // paths/s
      const wantAdd = Math.floor((elapsedMs * rate) / 1000);

      if (wantAdd > 0) {
        // Prevent huge single-frame bursts
        const MAX_ADD_PER_FRAME = 10000;
        const remaining = Math.max(0, nPathsTarget - nRef.current);
        const addNow = Math.min(wantAdd, remaining, MAX_ADD_PER_FRAME);

        if (addNow > 0) {
          pushNSamples(addNow);
          setTick((t) => t + 1);
        }

        // advance time proportionally to how many we actually added
        const usedMs = (addNow * 1000) / rate;
        lastTimeRef.current += usedMs;
      }

      if (nRef.current < nPathsTarget) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setPlaying(false);
      }
    },
    [nPathsTarget, pushNSamples]
  );

  useEffect(() => {
    if (playing) {
      lastTimeRef.current = null;
      rafRef.current = requestAnimationFrame(animate);
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, animate]);

  const handleReset = () => {
    setPlaying(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    initSim();
    setTick((t) => t + 1);
  };

  // Snapshot array (avoid relying on a mutable ref during plotting)
  const samples = useMemo(() => samplesRef.current.slice(), [tick]);

  const xData = useMemo(() => {
    if (view === "logS") return samples.map((v) => Math.log(v));
    return samples;
  }, [samples, view]);

  // Reference curve domain
  const curveX = useMemo(() => {
    // choose a sensible x-range using +/- 4 sd in log-space
    const loLog = mLog - 4 * sLog;
    const hiLog = mLog + 4 * sLog;

    if (view === "logS") {
      const n = 250;
      const xs = [];
      for (let i = 0; i < n; i++) xs.push(loLog + (i * (hiLog - loLog)) / (n - 1));
      return xs;
    }

    // for S-space, exponentiate that log range
    const lo = Math.exp(loLog);
    const hi = Math.exp(hiLog);
    const n = 250;
    const xs = [];
    for (let i = 0; i < n; i++) xs.push(lo + (i * (hi - lo)) / (n - 1));
    return xs;
  }, [view, mLog, sLog]);

  const refY = useMemo(() => {
    if (curveX.length === 0) return [];
    if (view === "logS") return curveX.map((x) => normalPdf(x, mLog, sLog));
    return curveX.map((x) => lognormalPdf(x, mLog, sLog));
  }, [curveX, view, mLog, sLog]);

  // Empirical quick stats
  const stats = useMemo(() => {
    const n = samples.length;
    if (n === 0) return null;

    const sorted = samples.slice().sort((a, b) => a - b);
    const mean = samples.reduce((a, b) => a + b, 0) / n;
    const median = sorted[Math.floor(n / 2)];
    const p05 = sorted[Math.floor(0.05 * (n - 1))];
    const p95 = sorted[Math.floor(0.95 * (n - 1))];
    return { n, mean, median, p05, p95 };
  }, [samples]);

  const histTrace = {
    x: xData,
    type: "histogram",
    nbinsx: clamp(Math.round(bins), 10, 250),
    histnorm: "probability density",
    opacity: 0.85,
    name: view === "logS" ? "log(S_T)" : "S_T",
  };

  const refTrace = {
    x: curveX,
    y: refY,
    type: "scatter",
    mode: "lines",
    name: view === "logS" ? "Normal reference" : "Lognormal reference",
    line: { width: 2 },
    opacity: 0.9,
  };

  const layout = {
    margin: { t: 42, r: 18, l: 62, b: 55 },
    autosize: true,
    bargap: 0.06,
    legend: { orientation: "h", y: -0.22 },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    xaxis: {
      title: view === "logS" ? "log(S_T)" : "S_T",
      zeroline: false,
      showgrid: true,
    },
    yaxis: {
      title: "Density",
      zeroline: false,
      showgrid: true,
    },
    title: {
      text:
        view === "logS"
          ? "Histogram of log(S_T) + Normal reference"
          : "Histogram of S_T + Lognormal reference",
      font: { size: 14 },
    },
  };

  const config = { responsive: true, displayModeBar: false };

  return (
    <div className="widget">
      <div className="widgetHeader" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="widgetTitle">Terminal Distribution (animated)</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" onClick={() => setPlaying((p) => !p)}>
            {playing ? "Pause" : "Play"}
          </button>
          <button type="button" onClick={handleReset}>Reset</button>
        </div>
      </div>

      <div className="controls">
        <div className="controlGroup">
          <label>View</label>
          <select value={view} onChange={(e) => setView(e.target.value)}>
            <option value="S">S_T (Lognormal)</option>
            <option value="logS">log(S_T) (Normal)</option>
          </select>
        </div>

        <div className="controlGroup">
          <label>Target outputs: {nPathsTarget}</label>
          <input
            type="range"
            min={200}
            max={30000}
            step={100}
            value={nPathsTarget}
            onChange={(e) => setNPathsTarget(+e.target.value)}
          />
        </div>

        <div className="controlGroup">
          <label>Speed: {pathsPerSec} paths/s</label>
          <input
            type="range"
            min={50}
            max={8000}
            step={50}
            value={pathsPerSec}
            onChange={(e) => setPathsPerSec(+e.target.value)}
          />
        </div>

        <div className="controlGroup">
          <label>Bins: {bins}</label>
          <input
            type="range"
            min={10}
            max={220}
            step={1}
            value={bins}
            onChange={(e) => setBins(+e.target.value)}
          />
        </div>
      </div>

      <div className="grid2">
        <div className="panel">
          <div className="panelTitle">Histogram build-up</div>

          <div className="plotWrap plotH300">
            <Plot
              data={[histTrace, refTrace]}
              layout={layout}
              config={config}
              useResizeHandler
              style={{ width: "100%", height: "100%" }}
            />
          </div>

          <div className="metaRow">
            <div className="statBox">
              <span>Generated</span>
              <strong>{nRef.current} / {nPathsTarget}</strong>
            </div>

            <div className="statBox">
              <span>μ</span>
              <strong>{Number(mu).toFixed(4)}</strong>
            </div>
            <div className="statBox">
              <span>σ</span>
              <strong>{Number(sigma).toFixed(4)}</strong>
            </div>
            <div className="statBox">
              <span>T</span>
              <strong>{Number(T).toFixed(4)}</strong>
            </div>

            {stats && (
              <>
                <div className="statBox">
                  <span>Mean</span>
                  <strong>{stats.mean.toFixed(2)}</strong>
                </div>
                <div className="statBox">
                  <span>Median</span>
                  <strong>{stats.median.toFixed(2)}</strong>
                </div>
                <div className="statBox">
                  <span>5%–95%</span>
                  <strong>{stats.p05.toFixed(2)} – {stats.p95.toFixed(2)}</strong>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="panel">
          <div className="panelTitle">Reference (what “ideal” looks like)</div>
          <div className="content">
            <p>
              Under GBM, the terminal log-price is Normal:
              {" "}{"\\(\\log S_T \\sim \\mathcal{N}(m, s^2)\\)"}
              {" "}with{" "}{"\\(m = \\log S_0 + (\\mu - \\tfrac{1}{2}\\sigma^2)T\\)"}{" "}
              and{" "}{"\\(s = \\sigma\\sqrt{T}\\)"}.
            </p>
            <p>
              That means{" "}{"\\(S_T\\)"}{" "}is Lognormal. The curve you see is the model’s
              theoretical PDF overlayed on the empirical histogram (density-normalized).
            </p>
            <p style={{ opacity: 0.75 }}>
              Tip: switch to <strong>log(S_T)</strong> view — the bell shape is often easier to spot.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}