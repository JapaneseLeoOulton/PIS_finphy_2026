export const steps = [
  {
    id: "intuition",
    title: "Intuition",
    short: "Why model price randomness?",
    widgetKey: "PlaceholderWidget",
    pinsByDefault: false,
  },
  {
    id: "history",
    title: "Background & History",
    short: "Origins of GBM",
    widgetKey: "PlaceholderWidget",
    pinsByDefault: false,
  },
  {
    id: "wiener",
    title: "Wiener Process W(t)",
    short: "Random walk foundation",
    widgetKey: "WienerWidget",
    pinsByDefault: true,
  },
  {
    id: "sde",
    title: "SDE Formulation",
    short: "Stochastic differential equation",
    widgetKey: "PlaceholderWidget",
    pinsByDefault: false,
  },
  {
    id: "gbm-solution",
    title: "GBM Solution & Discretization",
    short: "Closed-form GBM path",
    widgetKey: "GBMSinglePathWidget",
    pinsByDefault: true,
  },
  {
    id: "simulation",
    title: "Simulation",
    short: "Many paths at once",
    widgetKey: "GBMManyPathsWidget",
    pinsByDefault: false,
  },
  {
    id: "terminal-distribution",
    title: "Terminal Distribution",
    short: "Lognormal at time T",
    widgetKey: "TerminalDistributionWidget",
    pinsByDefault: true,
  },
  {
    id: "decision-theory",
    title: "Decision Theory",
    short: "Expected loss minimization",
    widgetKey: "DecisionTheoryWidget",
    pinsByDefault: false,
  },
];

export const stepOrder = steps.map((s) => s.id);

export function getStepById(id) {
  return steps.find((s) => s.id === id) ?? null;
}