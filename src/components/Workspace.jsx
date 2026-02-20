import { useState, useCallback } from "react";
import { useAppStore } from "../state/store";

const PARAM_KEYS = ["S0", "mu", "sigma", "T", "steps", "paths", "seed"];

const SHELF_CARDS = [
  { label: "Latest Wiener", hint: "Run the animation to populate" },
  { label: "Latest GBM", hint: "Run the animation to populate" },
  { label: "Latest Terminal Dist", hint: "Run the animation to populate" },
];

export default function Workspace() {
  const { state, resetParams } = useAppStore();
  const params = state?.params ?? {};

  const [snapshot, setSnapshot] = useState(null);
  const [comparing, setComparing] = useState(false);

  const handleSnapshot = useCallback(() => {
    setSnapshot({ ...params });
  }, [params]);

  const handleToggleCompare = useCallback(() => {
    setComparing((v) => !v);
  }, []);

  return (
    <div className="workspace">
      <div className="wsHeader">
        <h2 className="wsTitle">Workspace</h2>
        <p className="wsSub">Accumulating results &amp; comparison</p>
      </div>

      <section className="wsSection">
        <h3 className="wsSectionTitle">Compare Runs</h3>
        <div className="compareRow">
          <button type="button" className="btn btnSecondary" onClick={handleToggleCompare}>
            {comparing ? "Hide Delta" : "Show Delta"}
          </button>
          <button type="button" className="btn btnSecondary" onClick={handleSnapshot}>
            Snapshot current params
          </button>
        </div>

        {comparing && (
          <div className="deltaGrid">
            {PARAM_KEYS.map((key) => {
              const cur = params[key];
              const snap = snapshot?.[key];
              const diff =
                snapshot !== null &&
                typeof cur === "number" &&
                typeof snap === "number"
                  ? cur - snap
                  : null;

              return (
                <div className="deltaItem" key={key}>
                  <span className="deltaKey">{key}</span>
                  <span className="deltaVal">now: {cur ?? "—"}</span>
                  <span className="deltaVal">
                    snap: {snapshot !== null ? (snap ?? "—") : "none"}
                  </span>
                  <span className="deltaVal">
                    Δ: {diff !== null ? (diff >= 0 ? "+" : "") + diff.toPrecision(4) : "—"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="wsSection">
        <h3 className="wsSectionTitle">Quick Actions</h3>
        <div className="wsActions">
          <button type="button" className="btn" onClick={resetParams}>
            Reset params
          </button>
        </div>
      </section>

      <section className="wsSection">
        <h3 className="wsSectionTitle">Key Results Shelf</h3>
        <div className="shelf">
          {SHELF_CARDS.map((card) => (
            <div className="shelfCard" key={card.label}>
              <p className="shelfTitle">{card.label}</p>
              <p className="muted">(no results yet)</p>
              <p className="muted">{card.hint}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
