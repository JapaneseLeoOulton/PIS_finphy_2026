export const dictionary = [
  {
    term: "Brownian motion",
    definition: "Random motion caused by many microscopic collisions (physical intuition for randomness).",
    tex: String.raw`\( \text{random walk} \Rightarrow \text{diffusion} \)`,
  },
  {
    term: "Wiener process",
    definition: "A continuous-time stochastic process with independent Gaussian increments and continuous paths.",
    tex: String.raw`\( \Delta W \sim \mathcal{N}(0,\Delta t),\ W(0)=0 \)`,
  },
  {
    term: "Drift",
    definition: "The deterministic trend component in an SDE (expected direction of motion).",
    tex: String.raw`\( a(X,t)\,dt \)`,
  },
  {
    term: "Diffusion / Volatility",
    definition: "The random fluctuation strength in an SDE (spread/uncertainty).",
    tex: String.raw`\( b(X,t)\,dW \)`,
  },
  {
    term: "Poisson jump",
    definition: "A rare discontinuous shock event, used to model sudden market moves.",
    tex: String.raw`\( dN_t \in \{0,1\} \)`,
  },
];