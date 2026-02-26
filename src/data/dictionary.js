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
  {
    term: "Stochastic",
    definition: "Containing randomness; not perfectly predictable.",
    tex: String.raw`\( X_t \text{ is random} \)`,
  },
  {
    term: "Deterministic",
    definition: "Having no randomness; fully determined by the starting conditions.",
    tex: String.raw`\( \frac{dx}{dt}=kx \)`,
  },
  {
    term: "Increment",
    definition: "The change in a quantity over a small interval.",
    tex: String.raw`\( \Delta X = X_{t+\Delta t}-X_t \)`,
  },
  {
    term: "Independent increments",
    definition: "Changes over separate time intervals do not affect each other.",
    tex: String.raw`\( W_{t+u}-W_t \perp W_s,\ s<t \)`,
  },
  {
    term: "Gaussian",
    definition: "Normally distributed; bell-shaped around a mean value.",
    tex: String.raw`\( X \sim \mathcal{N}(\mu,\sigma^2) \)`,
  },
  {
    term: "Variance",
    definition: "A measure of how spread out values are around the mean.",
    tex: String.raw`\( \mathrm{Var}(X)=\mathbb{E}[(X-\mathbb{E}[X])^2] \)`,
  },
  {
    term: "Diffusion coefficient",
    definition: "A parameter controlling how quickly randomness spreads out.",
    tex: String.raw`\( D=\frac{k_B T}{6\pi\eta a} \)`,
  },
  {
    term: "Volatility",
    definition: "How strongly and unpredictably a price fluctuates.",
    tex: String.raw`\( \sigma \)`,
  },
  {
    term: "Thermal equilibrium",
    definition: "A balanced state where temperature is uniform and there is no net heat flow.",
    tex: String.raw`\( T=\text{constant} \)`,
  },
  {
    term: "Convection currents",
    definition: "Bulk fluid motion caused by temperature or density differences, not true Brownian motion.",
    tex: String.raw`\( \text{fluid flow} \neq \text{diffusion} \)`,
  },
  {
    term: "Root mean square (RMS) displacement",
    definition: "A typical size of random displacement after some time.",
    tex: String.raw`\( \sqrt{\langle \Delta x^2 \rangle} \)`,
  },
  {
    term: "State-dependent",
    definition: "Depending on the current value of the variable itself.",
    tex: String.raw`\( b(X,t) \)`,
  },
  {
    term: "Path-dependent",
    definition: "Depending on the history of the process, not just its current value.",
    tex: String.raw`\( X_t \text{ depends on past path} \)`,
  },
  {
    term: "Infinitesimal",
    definition: "An extremely small change, used in calculus and differential equations.",
    tex: String.raw`\( dt,\ dW \)`,
  },
  {
    term: "Differentiable in the classical sense",
    definition: "Smooth enough to have an ordinary derivative at each point.",
    tex: String.raw`\( \frac{dX}{dt} \)`,
  },
  {
    term: "Non-differentiable",
    definition: "Too jagged to have an ordinary derivative, even if still continuous.",
    tex: String.raw`\( W_t \text{ continuous but not differentiable} \)`,
  },
  {
    term: "Itô calculus",
    definition: "The main calculus used for stochastic processes like Brownian motion.",
    tex: String.raw`\( dX=a\,dt+b\,dW \)`,
  },
  {
    term: "Stratonovich calculus",
    definition: "An alternative stochastic calculus, often closer to ordinary chain rule intuition.",
    tex: String.raw`\( \circ\, dW \)`,
  },
  {
    term: "Euler–Maruyama method",
    definition: "A numerical method for approximating solutions of SDEs step by step.",
    tex: String.raw`\( X_{n+1}=X_n+a\Delta t+b\sqrt{\Delta t}Z \)`,
  },
  {
    term: "Discrete-time recursion",
    definition: "A rule that updates a quantity one step at a time.",
    tex: String.raw`\( X_{n+1}=f(X_n) \)`,
  },
  {
    term: "Empirical distribution",
    definition: "A distribution built from simulated or observed data rather than an exact formula.",
    tex: String.raw`\( \{X_1,\dots,X_n\} \)`,
  },
  {
    term: "Lognormal",
    definition: "A distribution where the logarithm of the variable is normally distributed.",
    tex: String.raw`\( \log X \sim \mathcal{N}(\mu,\sigma^2) \)`,
  },
  {
    term: "Right-skewed",
    definition: "Having a long tail extending toward larger values.",
    tex: String.raw`\( \text{mean} > \text{median} \)`,
  },
  {
    term: "Percentile",
    definition: "A value below which a given percentage of outcomes fall.",
    tex: String.raw`\( P(X \le x_p)=p \)`,
  },
  {
    term: "Risk hedge / Hedging",
    definition: "Reducing risk by taking an offsetting position or decision.",
    tex: String.raw`\( \text{reduce downside risk} \)`,
  },
  {
    term: "Loss function",
    definition: "A rule that measures how bad an estimate or decision is.",
    tex: String.raw`\( L(a,X) \)`,
  },
  {
    term: "Expected loss",
    definition: "The average loss across all possible outcomes.",
    tex: String.raw`\( \mathbb{E}[L(a,X)] \)`,
  },
  {
    term: "Quadratic / Squared loss",
    definition: "A loss that penalises larger errors more strongly by squaring them.",
    tex: String.raw`\( L(a,X)=(a-X)^2 \)`,
  },
  {
    term: "Absolute error",
    definition: "A loss that measures the size of an error without squaring it.",
    tex: String.raw`\( L(a,X)=|a-X| \)`,
  },
  {
    term: "VaR",
    definition: "Value at Risk: a threshold loss exceeded only with a chosen small probability.",
    tex: String.raw`\( \mathrm{VaR}_{\alpha}(X)=q_{\alpha}(X) \)`,
  },
  {
    term: "CVaR",
    definition: "Conditional Value at Risk: the average loss in the worst tail cases beyond VaR.",
    tex: String.raw`\( \mathrm{CVaR}_{\alpha}=\mathbb{E}[X \mid X \ge \mathrm{VaR}_{\alpha}] \)`,
  },
  {
    term: "Fat tails",
    definition: "More extreme outcomes than a normal distribution would predict.",
    tex: String.raw`\( P(|X| \text{ large}) \text{ is bigger than Gaussian} \)`,
  },
  {
    term: "Discontinuity / Discontinuous",
    definition: "A sudden jump with no smooth passage through intermediate values.",
    tex: String.raw`\( \Delta X \neq 0 \text{ instantly} \)`,
  },
  {
    term: "Jump–diffusion",
    definition: "A model combining continuous Brownian motion with occasional sudden jumps.",
    tex: String.raw`\( dS_t=\mu S_tdt+\sigma S_tdW_t+(J-1)S_tdN_t \)`,
  },
  {
    term: "Poisson process",
    definition: "A counting process for random events occurring independently over time.",
    tex: String.raw`\( N(t)\sim \mathrm{Poisson}(\lambda t) \)`,
  },
  {
    term: "Multiplicative jumps",
    definition: "Jumps that scale the price by a factor rather than adding a fixed amount.",
    tex: String.raw`\( S_t=S_{t^-}J \)`,
  },
  {
    term: "Idiosyncratic diffusion",
    definition: "Random fluctuations specific to one asset rather than the whole market.",
    tex: String.raw`\( \sigma\, dW_t \)`,
  },
  {
    term: "Systemic drift",
    definition: "The broad market-wide trend affecting many assets together.",
    tex: String.raw`\( \mu\, dt \)`,
  },
];