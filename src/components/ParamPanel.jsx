import { useAppStore } from "../state/store";

function clampNumber(v, min, max) {
  const n = Number(v);
  if (Number.isNaN(n)) return min;
  return Math.min(max, Math.max(min, n));
}

export default function ParamPanel() {
  const { state, setParam, resetParams } = useAppStore();
  const p = state.params;

  return (
    <div className="paramPanel">
      <div className="paramGrid">
        {/* S0 */}
        <label className="paramField">
          <span className="paramLabel">S0</span>
          <input
            className="paramInput"
            type="number"
            step="1"
            min="1"
            value={p.S0}
            onChange={(e) => setParam("S0", clampNumber(e.target.value, 1, 1e9))}
          />
        </label>

        {/* mu */}
        <label className="paramField">
          <span className="paramLabel">μ</span>
          <input
            className="paramInput"
            type="number"
            step="0.01"
            min="-1"
            max="1"
            value={p.mu}
            onChange={(e) => setParam("mu", clampNumber(e.target.value, -1, 1))}
          />
          <input
            className="paramRange"
            type="range"
            step="0.01"
            min="-0.5"
            max="0.5"
            value={p.mu}
            onChange={(e) => setParam("mu", Number(e.target.value))}
          />
        </label>

        {/* sigma */}
        <label className="paramField">
          <span className="paramLabel">σ</span>
          <input
            className="paramInput"
            type="number"
            step="0.01"
            min="0"
            max="2"
            value={p.sigma}
            onChange={(e) => setParam("sigma", clampNumber(e.target.value, 0, 2))}
          />
          <input
            className="paramRange"
            type="range"
            step="0.01"
            min="0"
            max="1"
            value={p.sigma}
            onChange={(e) => setParam("sigma", Number(e.target.value))}
          />
        </label>

        {/* T */}
        <label className="paramField">
          <span className="paramLabel">T</span>
          <input
            className="paramInput"
            type="number"
            step="0.1"
            min="0.01"
            max="10"
            value={p.T}
            onChange={(e) => setParam("T", clampNumber(e.target.value, 0.01, 10))}
          />
          <input
            className="paramRange"
            type="range"
            step="0.05"
            min="0.1"
            max="5"
            value={p.T}
            onChange={(e) => setParam("T", Number(e.target.value))}
          />
        </label>

        {/* steps */}
        <label className="paramField">
          <span className="paramLabel">steps</span>
          <input
            className="paramInput"
            type="number"
            step="1"
            min="10"
            max="5000"
            value={p.steps}
            onChange={(e) => setParam("steps", Math.round(clampNumber(e.target.value, 10, 5000)))}
          />
        </label>

        {/* paths */}
        <label className="paramField">
          <span className="paramLabel">paths</span>
          <input
            className="paramInput"
            type="number"
            step="100"
            min="10"
            max="200000"
            value={p.paths}
            onChange={(e) => setParam("paths", Math.round(clampNumber(e.target.value, 10, 200000)))}
          />
        </label>

        {/* seed */}
        <label className="paramField">
          <span className="paramLabel">seed</span>
          <input
            className="paramInput"
            type="number"
            step="1"
            min="0"
            max="999999"
            value={p.seed}
            onChange={(e) => setParam("seed", Math.round(clampNumber(e.target.value, 0, 999999)))}
          />
          <button
            type="button"
            className="btn secondary smallBtn"
            onClick={() => setParam("seed", Math.floor(Math.random() * 1_000_000))}
          >
            Randomize
          </button>
        </label>
      </div>

      <div className="paramActions">
        <button type="button" className="btn secondary" onClick={resetParams}>
          Reset parameters
        </button>
      </div>
    </div>
  );
}
