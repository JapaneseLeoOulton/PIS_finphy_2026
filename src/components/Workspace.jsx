import React, { useEffect, useMemo, useRef } from "react";
import { useAppStore } from "../state/store";
import { workspaceCards } from "../data/workspaceCards";
import { VISUALS } from "../visuals";
import { dictionary } from "../data/dictionary";

function useMathJax(containerRef, deps = []) {
  useEffect(() => {
    const mj = window.MathJax;
    const el = containerRef?.current;
    if (!mj || !el) return;
    mj.typesetClear?.([el]);
    mj.typesetPromise?.([el]).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

function VisualCard({ card, onJump }) {
  const Visual = VISUALS?.[card.visualKey] ?? null;

  return (
    <div className="wsCard">
      <div className="wsCardTop">
        <div className="wsCardText">
          <div className="wsCardTitle">{card.title}</div>
          {card.takeaway ? <div className="wsCardTakeaway">{card.takeaway}</div> : null}
          {card.equationTex ? <div className="wsCardEq">{card.equationTex}</div> : null}
        </div>

        <button
          type="button"
          className="btn btnSecondary wsJumpBtn"
          onClick={() => onJump(card.jumpTo)}
        >
          Jump
        </button>
      </div>

      <div className="wsCardVisual">
        {Visual ? <Visual width={card.width ?? 320} height={card.height ?? 150} /> : null}
      </div>
    </div>
  );
}

function DictionaryView({ items }) {
  if (!Array.isArray(items) || items.length === 0) {
    return <div className="wsDictEmpty">No dictionary entries yet.</div>;
  }

  return (
    <div className="wsDict">
      {items.map((it, idx) => (
        <div className="wsDictItem" key={`${it.term}-${idx}`}>
          <div className="wsDictTerm"><strong>{it.term}</strong></div>
          <div className="wsDictDef">{it.definition}</div>
          {it.tex ? <div className="wsDictTex">{it.tex}</div> : null}
        </div>
      ))}
    </div>
  );
}

export default function Workspace() {
  const { state, setActiveStep, setWorkspaceMode } = useAppStore();
  const mode = state.workspaceMode ?? "visual";

  const mjRef = useRef(null);

  const cards = useMemo(() => (Array.isArray(workspaceCards) ? workspaceCards : []), []);
  const dictItems = useMemo(() => (Array.isArray(dictionary) ? dictionary : []), []);

  useMathJax(mjRef, [mode, cards, dictItems, state.activeStepId]);

  return (
    <div className="workspace" ref={mjRef}>
      <div className="wsHeader">
        <h2 className="wsTitle">Workspace</h2>
        <p className="wsSub">Storyboard visuals or dictionary</p>
      </div>

      <div className="wsModeRow">
        <button
          type="button"
          className={`btn btnSecondary ${mode === "visual" ? "isActive" : ""}`}
          onClick={() => setWorkspaceMode("visual")}
        >
          Visual
        </button>

        <button
          type="button"
          className={`btn btnSecondary ${mode === "dictionary" ? "isActive" : ""}`}
          onClick={() => setWorkspaceMode("dictionary")}
        >
          Dictionary
        </button>
      </div>

      {mode === "visual" ? (
        <div className="wsStack">
          {cards.map((card) => (
            <VisualCard key={card.id} card={card} onJump={(stepId) => setActiveStep(stepId)} />
          ))}
        </div>
      ) : (
        <DictionaryView items={dictItems} />
      )}
    </div>
  );
}