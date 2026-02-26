export const workspaceCards = [
  {
    id: "phys-brown",
    title: "Physical Brownian motion",
    takeaway: "A large tracer particle jitters due to many small random collisions.",
    equationTex: "",
    visualKey: "miniBrown",
    jumpTo: "brownian",
    width: 300,
    height: 150,
  },

  
  {
    id: "wiener",
    title: "Wiener process",
    takeaway: "Continuous-time limit of random walk; increments are Gaussian.",
    equationTex: String.raw`\( \Delta W \sim \mathcal{N}(0,\Delta t) \)`,
    visualKey: "miniWiener",
    jumpTo: "brownian",
    width: 300,
    height: 150,
  },
  {
    id: "sde",
    title: "SDE (drift + diffusion)",
    takeaway: "Trend plus uncertainty that spreads over time.",
    equationTex: String.raw`\( dX = a(X,t)\,dt + b(X,t)\,dW \)`,
    visualKey: "miniSDEs",
    jumpTo: "sde",
    width: 300,
    height: 150,
  },
  {
    id: "terminal",
    title: "Terminal distribution",
    takeaway: "Many paths produce a distribution at time \(T\).",
    equationTex: String.raw`\( W_T \sim \mathcal{N}(0,T) \)`,
    visualKey: "miniTerminal",
    jumpTo: "outcomes",
    width: 300,
    height: 150,
  },

];