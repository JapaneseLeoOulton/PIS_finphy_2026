import React, { useEffect, useMemo, useRef } from "react";
import { useAppStore } from "../state/store";
import { getStepById, steps } from "../data/steps";
import RealWienerWidget from "../widgets/WienerWidget.jsx";
import GBMSinglePathWidget from "../widgets/GBMSinglePathWidget.jsx";

function PlaceholderWidget({ params }) {
  return (
    <div className="pill">
      <h3>Placeholder</h3>
      <ul>
        <li>This step will render an interactive visualization.</li>
        <li>
          μ = {params?.mu ?? "—"}, σ = {params?.sigma ?? "—"}
        </li>
      </ul>
    </div>
  );
}

function WienerWidgetPlaceholder({ params }) {
  return (
    <div className="pill">
      <h3>Wiener Process</h3>
      <ul>
        <li>{"\\(W(t)\\)"} sample paths (Brownian motion).</li>
        <li>Variance grows linearly with time.</li>
        <li>
          T = {params?.T ?? "—"}, steps = {params?.steps ?? "—"}
        </li>
      </ul>
    </div>
  );
}

function GBMManyPathsWidget({ params }) {
  return (
    <div className="pill">
      <h3>GBM — Many Paths</h3>
      <ul>
        <li>Overlay many GBM paths to show dispersion.</li>
        <li>Outcome spread increases with σ and T.</li>
        <li>
          paths = {params?.paths ?? "—"}, T = {params?.T ?? "—"}
        </li>
      </ul>
    </div>
  );
}

function TerminalDistributionWidget({ params }) {
  return (
    <div className="pill">
      <h3>Terminal Distribution</h3>
      <ul>
        <li>Histogram of simulated terminal prices {"\\(S(T)\\)"}.</li>
        <li>Compare to theoretical lognormal shape.</li>
        <li>
          {"\\(S_0\\)"} = {params?.S0 ?? "—"}, σ = {params?.sigma ?? "—"}
        </li>
      </ul>
    </div>
  );
}

function DecisionTheoryWidget({ params }) {
  return (
    <div className="pill">
      <h3>Decision Theory</h3>
      <ul>
        <li>Choose an action by minimizing expected loss.</li>
        <li>{"\\(a^* = \\arg\\min_a \\mathbb{E}[L(a,X)]\\)"}</li>
        <li>
          μ = {params?.mu ?? "—"}, T = {params?.T ?? "—"}
        </li>
      </ul>
    </div>
  );
}

const WIDGET_REGISTRY = {
  PlaceholderWidget,
  WienerWidget: RealWienerWidget,
  GBMSinglePathWidget: GBMSinglePathWidget,
  GBMManyPathsWidget,
  TerminalDistributionWidget,
  DecisionTheoryWidget,
  WienerWidgetPlaceholder,
};

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

function FlowBlock({ block, params }) {
  if (!block) return null;

  if (block.type === "p") return <p style={{ whiteSpace: "pre-wrap" }}>{block.text}</p>;

  if (block.type === "math") return <div className="math">{block.tex}</div>;

  if (block.type === "img") {
    return (
      <img
        src={block.src}
        alt={block.alt ?? ""}
        style={{
          maxWidth: block.width ? `${block.width}px` : "100%",
          width: block.fullWidth ? "100%" : undefined,
          height: "auto",
          borderRadius: 10,
          display: "block",
          margin: "12px 0",
        }}
      />
    );
  }

  if (block.type === "widget") {
    const Widget = WIDGET_REGISTRY[block.key] ?? PlaceholderWidget;
    const mergedParams = { ...(params ?? {}), ...(block.params ?? {}) };
    return (
      <div className="vizBox" style={{ margin: "12px 0" }}>
        <Widget params={mergedParams} />
      </div>
    );
  }

  if (block.type === "divider") return <hr style={{ opacity: 0.25, margin: "14px 0" }} />;

  return null;
}

function toFlowFromDescription(step) {
  if (!step?.description) return [];
  return [{ type: "p", text: step.description }];
}

export default function StepPanel() {
  const { state } = useAppStore();
  const activeStepId = state.activeStepId;
  const params = state.params;

  const step = getStepById(activeStepId) ?? steps[0];

  const flow = useMemo(() => {
    if (Array.isArray(step.content) && step.content.length > 0) return step.content;
    return toFlowFromDescription(step);
  }, [step]);

  const mjRef = useRef(null);
  useMathJax(mjRef, [activeStepId, flow, params]);

  return (
    <section className="stepPanel" ref={mjRef}>
      <header className="stepHeader">
        <h2 className="stepTitle">{step.title}</h2>
        <p className="stepShort">{step.short}</p>
      </header>

      <div
        style={{
          padding: "20px",
          background: "#f9f9f9",
          borderRadius: "8px",
          margin: "20px 0",
          color: "#333",
        }}
      >
        <div style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
          {flow.map((block, i) => (
            <FlowBlock key={`${block.type}-${i}`} block={block} params={params} />
          ))}
        </div>
      </div>

      <p className="paramLine">
        Live parameters —{" "}
        <span className="pill">{"\\(S_0\\)"}: {params?.S0 ?? "—"}</span>{" "}
        <span className="pill">μ: {params?.mu ?? "—"}</span>{" "}
        <span className="pill">σ: {params?.sigma ?? "—"}</span>{" "}
        <span className="pill">T: {params?.T ?? "—"}</span>{" "}
        <span className="pill">steps: {params?.steps ?? "—"}</span>{" "}
        <span className="pill">paths: {params?.paths ?? "—"}</span>{" "}
        <span className="pill">seed: {params?.seed ?? "—"}</span>
      </p>
    </section>
  );
}