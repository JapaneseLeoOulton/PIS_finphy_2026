// src/widgets/TerminalDistributionWidget.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import Plot from "react-plotly.js";

/**
 * TerminalDistributionWidget
 * - Simulate terminal prices S(T) under GBM (analytic terminal form)
 * - Show terminal distribution (histogram) + decision line "a"
 * - Show estimated expected loss curve E[L(a,S(T))] vs a
 * - Loss choices: squared, absolute, quantile (pinball)
 * - Animate dot/line moving to minimizer a*
 */

// ---------- RNG helpers ----------
function mulberry32(seed) {
  let s = seed >>> 0;
  return () => {
    s |= 0;
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function boxMuller(rng) {
  // standard normal
  const u1 = rng();
  const u2 = rng();
  const r = Math.sqrt(-2 * Math.log(u1 + 1e-300));
  const theta = 2 * Math.PI * u2;
  return r * Math.cos(theta);
}

// ---------- math helpers ----------
function clamp(x, lo, hi) {
  return Math.max(lo, Math.min(hi, x));
}

function quantile(sortedArr, q) {
  // q in [0,1], sortedArr ascending
  const n = sortedArr.length;
  if (n === 0) return NaN;
  const pos = (n - 1) * q;
  const i = Math.floor(pos);
  const frac = pos - i;
  if (i + 1 < n) return sortedArr[i] * (1 - frac) + sortedArr[i + 1] * frac;
  return sortedArr[i];
}

function mean(arr) {
  let s = 0;
  for (let i = 0; i < arr.length; i++) s += arr[i];
  return s / Math.max(1, arr.length);
}

function expectedLoss(samples, a, mode, tau) {
  // samples: array of S(T)
  const n = samples.length;
  if (n === 0) return NaN;

  let acc = 0;
  if (mode === "squared") {
    for (let i = 0; i < n; i++) {
      const d = a - samples[i];
      acc += d * d;
    }
    return acc / n;
  }

  if (mode === "absolute") {
    for (let i = 0; i < n; i++) acc += Math.abs(a - samples[i]);
    return acc / n;
  }

  // pinball / quantile loss:
  // ρ_tau(u) = u*(tau - I[u<0]) where u = S - a  (or a - S; be consistent)
  // We'll use u = S - a:
  // if S >= a => u>=0 => tau*u
  // if S < a  => u<0  => (tau-1)*u = (1-tau)*(a-S)
  for (let i = 0; i < n; i++) {
    const u = samples[i] - a;
    acc += u >= 0 ? tau * u : (tau - 1) * u;
  }
  return acc / n;
}

// animate a -> target
function animateTo(setter, from, to, ms = 450) {
  const start = performance.now();
  const dur = Math.max(50, ms);
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }
  function tick(now) {
    const t = clamp((now - start) / dur, 0, 1);
    const v = from + (to - from) * easeOutCubic(t);
    setter(v);
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ---------- component ----------
export default function TerminalDistributionWidget({ params }) {
  const S0 = Number(params?.S0 ?? 100);
  const mu = Number(params?.mu ?? 0.08);
  const sigma = Number(params?.sigma ?? 0.2);
  const T = Number(params?.T ?? 1);
  const seed = Number(params?.seed ?? 42);

  // Keep widget fast: cap paths
  const pathsRaw = Number(params?.paths ?? 5000);
  const paths = clamp(pathsRaw, 200, 20000);

  const [lossMode, setLossMode] = useState("squared"); // "squared" | "absolute" | "quantile"
  const [tau, setTau] = useState(0.95); // for quantile loss
  const [a, setA] = useState(S0);

  // recompute samples when params change
  const samples = useMemo(() => {
    const rng = mulberry32(seed);
    const out = new Array(paths);
    const drift = (mu - 0.5 * sigma * sigma) * T;
    const vol = sigma * Math.sqrt(Math.max(T, 0));
    for (let i = 0; i < paths; i++) {
      const z = boxMuller(rng);
      out[i] = S0 * Math.exp(drift + vol * z);
    }
    return out;
  }, [S0, mu, sigma, T, seed, paths]);

  const sorted = useMemo(() => {
    const s = samples.slice().sort((x, y) => x - y);
    return s;
  }, [samples]);

  const q05 = useMemo(() => quantile(sorted, 0.05), [sorted]);
  const q50 = useMemo(() => quantile(sorted, 0.5), [sorted]);
  const q95 = useMemo(() => quantile(sorted, 0.95), [sorted]);
  const m = useMemo(() => mean(samples), [samples]);

  // recommended range for "a" slider
  const aMin = useMemo(() => (Number.isFinite(q05) ? q05 : Math.min(...samples)), [q05, samples]);
  const aMax = useMemo(() => (Number.isFinite(q95) ? q95 : Math.max(...samples)), [q95, samples]);

  // keep 'a' in range when data updates
  useEffect(() => {
    const lo = aMin;
    const hi = aMax;
    if (!Number.isFinite(lo) || !Number.isFinite(hi) || lo >= hi) return;
    setA((prev) => clamp(prev, lo, hi));
  }, [aMin, aMax]);

  // build loss curve on a grid
  const { gridA, gridLoss, aStar, lossAtA, lossAtAStar, labelStat } = useMemo(() => {
    const lo = aMin;
    const hi = aMax;
    const nGrid = 90; // keep smooth but fast
    const xs = [];
    const ys = [];

    if (!Number.isFinite(lo) || !Number.isFinite(hi) || lo >= hi) {
      return {
        gridA: [],
        gridLoss: [],
        aStar: a,
        lossAtA: expectedLoss(samples, a, lossMode, tau),
        lossAtAStar: NaN,
        labelStat: "",
      };
    }

    for (let i = 0; i < nGrid; i++) {
      const x = lo + (hi - lo) * (i / (nGrid - 1));
      xs.push(x);
      ys.push(expectedLoss(samples, x, lossMode, tau));
    }

    // argmin
    let idx = 0;
    for (let i = 1; i < ys.length; i++) if (ys[i] < ys[idx]) idx = i;

    const astar = xs[idx];
    const statLabel =
      lossMode === "squared"
        ? "Squared loss → mean"
        : lossMode === "absolute"
          ? "Absolute loss → median"
          : "Asymmetric loss → quantile";

    return {
      gridA: xs,
      gridLoss: ys,
      aStar: astar,
      lossAtA: expectedLoss(samples, a, lossMode, tau),
      lossAtAStar: ys[idx],
      labelStat: statLabel,
    };
  }, [samples, a, lossMode, tau, aMin, aMax]);

  // what "optimal statistic" is, for the little label
  const aStarTarget = useMemo(() => {
    if (lossMode === "squared") return m;
    if (lossMode === "absolute") return q50;
    return quantile(sorted, tau);
  }, [lossMode, m, q50, sorted, tau]);

  // button: animate to a*
  const onFindOptimum = () => {
    const target = Number.isFinite(aStarTarget) ? aStarTarget : aStar;
    if (!Number.isFinite(target)) return;
    animateTo(setA, a, clamp(target, aMin, aMax), 520);
  };

  // keep plot widths responsive (Plotly likes explicit sizes sometimes)
  const plotStyle = { width: "100%", height: 320 };

  return (
    <div className="pill" style={{ padding: 14 }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <h3 style={{ margin: 0, flex: "1 1 auto" }}>Decision from Terminal Distribution</h3>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <label style={{ fontSize: 13 }}>
            Loss:
            <select
              value={lossMode}
              onChange={(e) => setLossMode(e.target.value)}
              style={{ marginLeft: 6 }}
            >
              <option value="squared">Squared (MSE)</option>
              <option value="absolute">Absolute (MAE)</option>
              <option value="quantile">Asymmetric / Quantile</option>
            </select>
          </label>

          {lossMode === "quantile" && (
            <label style={{ fontSize: 13 }}>
              τ:
              <input
                type="range"
                min="0.05"
                max="0.95"
                step="0.01"
                value={tau}
                onChange={(e) => setTau(Number(e.target.value))}
                style={{ marginLeft: 6, verticalAlign: "middle" }}
              />
              <span style={{ marginLeft: 6 }}>{tau.toFixed(2)}</span>
            </label>
          )}

          <button onClick={onFindOptimum} style={{ padding: "6px 10px", borderRadius: 10 }}>
            Find optimal a*
          </button>
        </div>
      </div>

      <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {/* LEFT: terminal distribution */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 10 }}>
          <div style={{ fontSize: 13, marginBottom: 6 }}>
            Terminal distribution (samples of {"\\(S(T)\\)"})
          </div>

          <Plot
            data={[
              {
                type: "histogram",
                x: samples,
                nbinsx: 40,
                opacity: 0.85,
                name: "S(T)",
              },
            ]}
            layout={{
              margin: { l: 45, r: 15, t: 10, b: 35 },
              showlegend: false,
              xaxis: { title: "Terminal price S(T)" },
              yaxis: { title: "Count" },
              shapes: [
                // decision a
                {
                  type: "line",
                  x0: a,
                  x1: a,
                  y0: 0,
                  y1: 1,
                  yref: "paper",
                  line: { width: 3 },
                },
                // interval markers (5% and 95%)
                {
                  type: "line",
                  x0: q05,
                  x1: q05,
                  y0: 0,
                  y1: 1,
                  yref: "paper",
                  line: { width: 1, dash: "dot" },
                },
                {
                  type: "line",
                  x0: q95,
                  x1: q95,
                  y0: 0,
                  y1: 1,
                  yref: "paper",
                  line: { width: 1, dash: "dot" },
                },
              ],
              annotations: [
                {
                  x: a,
                  y: 1,
                  yref: "paper",
                  text: "a",
                  showarrow: true,
                  arrowhead: 2,
                  ax: 0,
                  ay: -25,
                },
              ],
            }}
            style={plotStyle}
            config={{ displayModeBar: false, responsive: true }}
          />

          <div style={{ marginTop: 8, fontSize: 13, display: "grid", gap: 4 }}>
            <div>
              a = <b>{a.toFixed(2)}</b>
            </div>
            <div>
              mean ≈ {m.toFixed(2)} · median ≈ {q50.toFixed(2)} · 90% interval ≈ [{q05.toFixed(2)},{" "}
              {q95.toFixed(2)}]
            </div>
          </div>

          <div style={{ marginTop: 8, fontSize: 13 }}>
            {labelStat} ·{" "}
            <span>
              a* ≈ <b>{(Number.isFinite(aStarTarget) ? aStarTarget : aStar).toFixed(2)}</b>
            </span>
          </div>
        </div>

        {/* RIGHT: expected loss curve */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 10 }}>
          <div style={{ fontSize: 13, marginBottom: 6 }}>
            Estimated expected loss {"\\(\\hat{\\mathbb{E}}[L(a,S(T))]\\)"} vs a
          </div>

          <Plot
            data={[
              {
                type: "scatter",
                mode: "lines",
                x: gridA,
                y: gridLoss,
                name: "E[L]",
              },
              {
                type: "scatter",
                mode: "markers",
                x: [a],
                y: [lossAtA],
                name: "current",
                marker: { size: 10 },
              },
              {
                type: "scatter",
                mode: "markers",
                x: [Number.isFinite(aStarTarget) ? clamp(aStarTarget, aMin, aMax) : aStar],
                y: [expectedLoss(samples, Number.isFinite(aStarTarget) ? aStarTarget : aStar, lossMode, tau)],
                name: "a*",
                marker: { size: 12, symbol: "diamond" },
              },
            ]}
            layout={{
              margin: { l: 55, r: 15, t: 10, b: 35 },
              showlegend: false,
              xaxis: { title: "a" },
              yaxis: { title: "Estimated expected loss" },
            }}
            style={plotStyle}
            config={{ displayModeBar: false, responsive: true }}
          />

          <div style={{ marginTop: 8, fontSize: 13, display: "grid", gap: 4 }}>
            <div>
              {"\\(\\hat{\\mathbb{E}}[L(a,S(T))]\\)"} ≈ <b>{lossAtA.toFixed(4)}</b>
            </div>
            <div>
              {"\\(\\hat{\\mathbb{E}}[L(a^*,S(T))]\\)"} ≈{" "}
              <b>
                {expectedLoss(
                  samples,
                  Number.isFinite(aStarTarget) ? aStarTarget : aStar,
                  lossMode,
                  tau
                ).toFixed(4)}
              </b>
            </div>
          </div>

          {/* slider */}
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 13, marginBottom: 4 }}>Move a</div>
            <input
              type="range"
              min={aMin}
              max={aMax}
              step={(aMax - aMin) / 500}
              value={a}
              onChange={(e) => setA(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </div>

      <div style={{ marginTop: 10, fontSize: 13, opacity: 0.9 }}>
        Decision rule: {"\\(a^* = \\arg\\min_a\\ \\mathbb{E}[L(a,S(T))]\\)"} (estimated via Monte Carlo).
      </div>
    </div>
  );
}