import { steps } from "../data/steps";
import { useAppStore } from "../state/store";

export default function FlowchartNav() {
  const { state, setActiveStep } = useAppStore();

  return (
    <nav aria-label="Learning pipeline steps">
      <ol className="stepList">
        {steps.map((step) => {
          const isActive = state.activeStepId === step.id;

          return (
            <li key={step.id} className="stepRow">
              <button
                type="button"
                className={["stepBtn", isActive ? "active" : ""].filter(Boolean).join(" ")}
                onClick={() => setActiveStep(step.id)}
                aria-current={isActive ? "step" : undefined}
              >
                <span
                  className={["dot", isActive ? "active" : ""].filter(Boolean).join(" ")}
                  aria-hidden="true"
                />
                <span className="meta">
                  <span className="stepTitle">{step.title}</span>
                  <span className="stepShort">{step.short}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
