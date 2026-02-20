import { useRef, useState, useEffect, useCallback } from "react";
import Plot from "react-plotly.js";

const MAX_STEPS = 5000;

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

export default function GBMSinglePathWidget({ params = {} }) {
  const {
    S0 = 100,
    mu = 0.1,
    sigma = 0.2,
    T = 1,
    steps: rawSteps = 252,
    seed = 42,
  } = params;

  const steps = Math.min(Math.max(2, Math.round(rawSteps)), MAX_STEPS);
  const dt = T / steps;

  // UI state
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(300);
  const [showEnvelope, setShowEnvelope] = useState(true);
  const [showDecomp, setShowDecomp] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [tick, setTick] = useState(0);

  // Simulation refs
  const rngRef = useRef(null);
  const kRef = useRef(0);
  const tArrRef = useRef([]);
  const WRef = useRef([0]);
  const SRef = useRef([S0]);
  const logSRef = useRef([Math.log(S0)]);
  const dwRef = useRef(0);

  // Animation refs
  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);
  const stepsPerSecRef = useRef(speed);

  useEffect(() => {
    stepsPerSecRef.current = speed;
  }, [speed]);

  const initSim = useCallback(() => {
    rngRef.current = mulberry32(Number(seed) || 0);
    kRef.current = 0;

    // Use exact dt multiples (avoid rounding)
    tArrRef.current = Array.from({ length: steps + 1 }, (_, i) => i * dt);

    WRef.current = [0];
    SRef.current = [Number(S0) || 100];
    logSRef.current = [Math.log(Number(S0) || 100)];
    dwRef.current = 0;

    lastTimeRef.current = null;
  }, [seed, steps, dt, S0]);

  useEffect(() => {
    initSim();
    setTick((t) => t + 1);
  }, [initSim]);

  const stepSim = useCallback(() => {
    const k = kRef.current;
    if (k >= steps) return false;

    const dw = boxMuller(rngRef.current) * Math.sqrt(dt);
    dwRef.current = dw;

    const prevW = WRef.current[k] ?? 0;
    const W = prevW + dw;

    const drift = (mu - 0.5 * sigma * sigma) * dt;
    const prevLogS = logSRef.current[k] ?? Math.log(Number(S0) || 100);
    const logS = prevLogS + drift + sigma * dw;
    const S = Math.exp(logS);

    WRef.current.push(W);
    SRef.current.push(S);
    logSRef.current.push(logS);

    kRef.current = k + 1;
    return true;
  }, [steps, dt, mu, sigma, S0]);

  const animate = useCallback(
    (timestamp) => {
      if (lastTimeRef.current === null) lastTimeRef.current = timestamp;

      const elapsed = timestamp - lastTimeRef.current;
      const msPerStep = 1000 / Math.max(1, stepsPerSecRef.current);

      const stepsToRunRaw = Math.floor(elapsed / msPerStep);
      if (stepsToRunRaw > 0) {
        const MAX_ADVANCE_PER_FRAME = 4000;
        const stepsToRun = Math.min(stepsToRunRaw, MAX_ADVANCE_PER_FRAME);

        lastTimeRef.current += stepsToRun * msPerStep;

        let ran = 0;
        for (let i = 0; i < stepsToRun; i++) {
          if (!stepSim()) break;
          ran++;
        }

        if (ran > 0) setTick((t) => t + 1);
      }

      if (kRef.current < steps) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setPlaying(false);
      }
    },
    [stepSim, steps]
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

  // Slice current state
  const k = kRef.current;
  const tSlice = tArrRef.current.slice(0, k + 1);
  const WSlice = WRef.current.slice(0, k + 1);
  const SSlice = SRef.current.slice(0, k + 1);
  const logSSlice = logSRef.current.slice(0, k + 1);

  const t_k = tSlice[k] ?? 0;
  const W_k = WSlice[k] ?? 0;
  const baseS0 = Number.isFinite(Number(S0)) ? Number(S0) : 100;
  const S_k = SSlice[k] ?? baseS0;
  const logS_k = logSSlice[k] ?? Math.log(Number(S0) || 100);

  const driftCum = (mu - 0.5 * sigma * sigma) * t_k;
  const diffCum = sigma * W_k;

  // LEFT plot traces: W(t)
  const leftTraces = [
    { x: tSlice, y: WSlice, mode: "lines", name: "W(t)", line: { width: 2 } },
  ];

  if (showEnvelope && tArrRef.current.length > 1) {
    const envT = tArrRef.current;
    const upper = envT.map((t) => Math.sqrt(t));
    const lower = envT.map((t) => -Math.sqrt(t));
    leftTraces.push({
      x: envT,
      y: envT.map(() => 0),
      mode: "lines",
      name: "mean = 0",
      line: { dash: "dash", width: 1 },
      opacity: 0.35,
    });
    leftTraces.push({
      x: envT,
      y: upper,
      mode: "lines",
      name: "+√t",
      line: { dash: "dot", width: 1 },
      opacity: 0.45,
    });
    leftTraces.push({
      x: envT,
      y: lower,
      mode: "lines",
      name: "−√t",
      line: { dash: "dot", width: 1 },
      opacity: 0.45,
    });
  }

  // RIGHT plot traces: S(t) or log decomposition
  const rightTraces = [];
  const logS0 = Math.log(Number(S0) || 100);

  if (showDecomp) {
    const driftTrace = tSlice.map((t) => logS0 + (mu - 0.5 * sigma * sigma) * t);
    const diffTrace = tSlice.map((_, i) => logS0 + sigma * (WSlice[i] ?? 0));
    const sumTrace = tSlice.map(
      (t, i) => logS0 + (mu - 0.5 * sigma * sigma) * t + sigma * (WSlice[i] ?? 0)
    );

    rightTraces.push({
      x: tSlice,
      y: logSSlice,
      mode: "lines",
      name: "log S(t)",
      line: { width: 2 },
    });
    rightTraces.push({
      x: tSlice,
      y: driftTrace,
      mode: "lines",
      name: "log S₀ + drift",
      line: { dash: "dash", width: 1.5 },
      opacity: 0.75,
    });
    rightTraces.push({
      x: tSlice,
      y: diffTrace,
      mode: "lines",
      name: "log S₀ + diffusion",
      line: { dash: "dot", width: 1.5 },
      opacity: 0.75,
    });
    rightTraces.push({
      x: tSlice,
      y: sumTrace,
      mode: "lines",
      name: "log S₀ + D + N",
      line: { dash: "dashdot", width: 1 },
      opacity: 0.55,
    });
  } else {
    rightTraces.push({
      x: tSlice,
      y: SSlice,
      mode: "lines",
      name: "S(t)",
      line: { width: 2 },
    });
  }

  const commonLayout = {
    margin: { t: 10, r: 10, l: 52, b: 50 },
    legend: { orientation: "h", y: -0.22 },
    autosize: true,
  };

  const leftLayout = {
    ...commonLayout,
    xaxis: { title: "Time", range: [0, T] },
    yaxis: { title: "W(t)" },
  };

  const rightLayout = {
    ...commonLayout,
    xaxis: { title: "Time", range: [0, T] },
    yaxis: { title: showDecomp ? "log S(t)" : "S(t)" },
  };

  const plotConfig = { responsive: true, displayModeBar: false };

  return (
    <div className="widget">
      <div className="widgetHeader">
        <span className="widgetTitle">GBM — single path (built from increments)</span>
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
          <label>Speed: {speed} steps/s</label>
          <input
            type="range"
            min={1}
            max={3000}
            value={speed}
            onChange={(e) => setSpeed(+e.target.value)}
          />
        </div>

        <div className="controlGroup">
          <label>
            <input
              type="checkbox"
              checked={showDecomp}
              onChange={(e) => setShowDecomp(e.target.checked)}
            />{" "}
            Show decomposition
          </label>
        </div>
      </div>

      <div className="grid2">
        <div className="panel">
          <div className="panelTitle">Brownian Path Builder</div>

          <div className="controls controlsTight">
            <label>
              <input
                type="checkbox"
                checked={showEnvelope}
                onChange={(e) => setShowEnvelope(e.target.checked)}
              />{" "}
              Show envelope
            </label>
          </div>

          <div className="plotWrap plotH300">
            <Plot
              data={leftTraces}
              layout={leftLayout}
              config={plotConfig}
              useResizeHandler
              style={{ width: "100%", height: "100%" }}
            />
          </div>

          <div className="metaRow">
            <div className="statBox">
              <span>dt</span>
              <strong>{dt.toFixed(5)}</strong>
            </div>
            <div className="statBox">
              <span>k</span>
              <strong>{k}</strong>
            </div>
            <div className="statBox">
              <span>t</span>
              <strong>{t_k.toFixed(4)}</strong>
            </div>
            <div className="statBox">
              <span>ΔW</span>
              <strong>{(dwRef.current ?? 0).toFixed(4)}</strong>
            </div>
            <div className="statBox">
              <span>W(t)</span>
              <strong>{W_k.toFixed(4)}</strong>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panelTitle">Price Output</div>

          <div className="plotWrap plotH300">
            <Plot
              data={rightTraces}
              layout={rightLayout}
              config={plotConfig}
              useResizeHandler
              style={{ width: "100%", height: "100%" }}
            />
          </div>

          <div className="metaRow">
            <div className="statBox">
              <span>S(t)</span>
              <strong>{S_k.toFixed(4)}</strong>
            </div>
            <div className="statBox">
              <span>log S(t)</span>
              <strong>{logS_k.toFixed(4)}</strong>
            </div>
            <div className="statBox">
              <span>Cum. drift</span>
              <strong>{driftCum.toFixed(4)}</strong>
            </div>
            <div className="statBox">
              <span>Cum. diffusion</span>
              <strong>{diffCum.toFixed(4)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
