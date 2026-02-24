import React, { useEffect } from "react";
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
        <li>μ = {params?.mu ?? "—"}, σ = {params?.sigma ?? "—"}</li>
      </ul>
    </div>
  );
}

function WienerWidgetPlaceholder({ params }) {
  return (
    <div className="pill">
      <h3>Wiener Process</h3>
      <ul>
        <li>Sample paths of Brownian motion \(W(t)\).</li>
        <li>Variance grows linearly with time.</li>
        <li>T = {params?.T ?? "—"}, steps = {params?.steps ?? "—"}</li>
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
        <li>paths = {params?.paths ?? "—"}, T = {params?.T ?? "—"}</li>
      </ul>
    </div>
  );
}

function TerminalDistributionWidget({ params }) {
  return (
    <div className="pill">
      <h3>Terminal Distribution</h3>
      <ul>
        <li>Histogram of simulated terminal prices \(S(T)\).</li>
        <li>Compare to theoretical lognormal shape.</li>
        <li>S₀ = {params?.S0 ?? "—"}, σ = {params?.sigma ?? "—"}</li>
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
        <li>μ = {params?.mu ?? "—"}, T = {params?.T ?? "—"}</li>
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
};

export default function StepPanel() {
  const { state } = useAppStore();
  const activeStepId = state.activeStepId;
  const params = state.params;

  const step = getStepById(activeStepId) ?? steps[0];
  const WidgetComponent = WIDGET_REGISTRY[step.widgetKey] ?? PlaceholderWidget;

  
  useEffect(() => {
    if (window.MathJax?.typesetPromise) {
      window.MathJax.typesetPromise();
    }
  }, [activeStepId, step?.description]);

  return (
    <section className="stepPanel">
      <header className="stepHeader">
        <h2 className="stepTitle">{step.title}</h2>
        <p className="stepShort">{step.short}</p>
      </header>

      <div className="vizBox">
        <WidgetComponent params={params} />
      </div>

      {step.description && (
        <div
          style={{
            padding: "20px",
            background: "#f9f9f9",
            borderRadius: "8px",
            margin: "20px 0",
            color: "#333",
          }}
        >
          <p style={{ whiteSpace: "pre-wrap", fontSize: "1.1rem", lineHeight: "1.6" }}>
            {step.description}
          </p>
        </div>
      )}

      <p className="paramLine">
        Live parameters —{" "}
        <span className="pill">S₀: {params?.S0 ?? "—"}</span>{" "}
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