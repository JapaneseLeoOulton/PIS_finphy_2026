export const steps = [
  {
    id: "intro",
    title: "Intro & Intuition",
    short: "Why model price randomness?",
    description: `Geometric Brownian Motion (GBM) is a mathematical framework that is used for modelling the price of stock prices. Originally derived from observations in nature, GBM uses a physical understanding of randomised motion to account for fluctuations in price. This project explores how the discovery of Brownian motion has led to our current usable model for financial modelling.

Stochastic differential equations represent a very powerful mathematical framework for modelling systems, and it is influenced both by deterministic forces and random fluctuations. 

In physics and finance, we understand many quantities evolve over time, from particle positions, to temperature distributions and stock prices. When the future of this evolution is perfectly predictable from initial conditions, we can use ordinary differential equations (ODEs). A simple example is exponential growth, $\\frac{dx}{dt} = kx$, which tells us exactly what $x(t)$ will be at any moment in time given the initial value and growth constant k.

However, this deterministic framework breaks down when confronted with the reality of financial markets. Markets are not clockwork mechanisms. They are influenced by an endless stream of unpredictable factors: economic news releases, geopolitical events, shifts in investor sentiment, regulatory changes, and countless individual trading decisions. Each of these introduces its own small element of randomness that cannot be captured by deterministic equations alone. To model these systems realistically, we need to use a mathematical tool that can incorporate both the underlying trends and the inherent uncertainty, and this is where stochastic differential equations enter the picture.`,
    widgetKey: "PlaceholderWidget",
    pinsByDefault: false,
  },

  {
  id: "history",
  title: "Background & History",
  short: "Origins of GBM and Monte Carlo",
  description: `Physicists have used these same ideas for a while. Many Monte Carlo techniques were first
developed in physics (particularly in the Manhattan Project) before being adopted by finance.
The conceptual similarities between a particle undergoing molecular collisions and a stock
price buffeted by market forces is remarkable.

However, Brownian motion showed no uses to the financial industry until mathematician Norbert Wiener
defined the Wiener process in 1918. Wiener defined a way to calculate the probability of a particle
taking a specific set of paths - this is known as the Wiener process.

The basic Wiener process can take negative values, which made it unsuitable for direct stock price
modelling. Stock prices, after all, cannot fall below zero, a company's value may plummet, but it cannot
become negative. Therefore, the mathematical framework was adapted to create Geometric Brownian Motion (GBM),
which ensures price changes are proportional to the current price level.

As early as c. 60 BC, humans had at least commented on the erratic behaviour of partides within a fluid. In his poem De Rerum
Natura (‘On the Nature of Things’), Lucretius describes dust particles illuminated by a setting sun. This is likely the first recorded
observation of the stochastic process that applies modern financial systems. Although what Lucretius saw was likely caused not
by true Brownian motion but by air currents, he at least "perfectly describes and explains the Brownian movement by a wrong
example". Crucially, Lucretius concludes that microscopic collisions cause general macroscopic motion. This forms the basis for
stochastic analysis. Mathematically, Lucretius' observations mirror (at least in a logical sense) a discrete random walks, where the
position X,, after n steps is defined by

Xz = 3 Zi
i=1

where Z; represents the Lucretius’ ‘invisible’ collisions. Formally we now call Z; stochastic increments. Note that 7 € N. The
next known observation of stochastic motion arrives from the Dutch Physicist Jans Igenhousz. He notes the imegular movement
of finely powdered charcoal suspended in alcohol. Some historians daim this as the first experimental discovery of what Brown
has been accredited for. However, our analysis of primary sources reveals this is likely not the case. Strict Brownian motion
requires a state of thermal equilibrium, yet in Ingenhousz’s analysis, the use of uncovered alcohol created rapid evaporation.
Instead, convection currents drove what |genhousz saw. Notably, the charcoal particles he observed where roughly 100m. Our
calculations justify why this indicates he was not the first to discover Brownian motion. The \\textbf{Stokes-Einstein Equation}
shows that the diffusion coefficient D, which measures the strength of random ‘jiggling’, is inversely proportional to the
particle's radius a,

kpT
p=—
6rna
To explain why Ingenhousz's observation of 100m. charcoal particles (where a = 50jm) fails the criteria for Brownian motion,
we calculate the root mean square (RMS) displacement Az over a time interval ¢:

y (Az?) = V2Dt

Using the viscosity of ethanol (7 1.2 x 10—? Pa - s) at room temperature (T' = 293 K), the diffusion coefficient for a particle
of this size is approximately D = 3.5 x 107° m?/s. For an observation period of ¢ = 1s, the displacement is:

Az = 4/2(3.5 x L07)(1) = 8.4 x 107? m = 0.084um

Because the displacement (0.0841) is less than 0.1% of the particle's diameter (100jm), the motion would be imperceptible
under the microscopes of 1784, Therfore, the “violent" motion Ingenhousz saw was not stochastic diffusion, but likely
convection caused by evaporation. In financial terms, this is the equivalent of a “high-beta" environment where the volatility of a
single stock is completely drowned out by a massive market-wide trend. The underlying stochasticity exists, but the Péclet-like
ratio of the market indicates that the systemic dnft 4 has overwhelmed the idiosyncratic diffusion ¢.`,
  widgetKey: "PlaceholderWidget",
  pinsByDefault: false,
},

  {
    id: "brownian",
    title: "Brownian Motion",
    short: "Wiener process foundations",
    description: `However, Brownian motion showed no uses to the financial industry until mathematician Norbert Wiener
defined the Wiener process in 1918. Wiener defined a way to calculate the probability of a particle
taking a specific set of paths - this is known as the Wiener process.

Although physically Brownian motion represents the motion of a particle, the Wiener process generalises
the idea of a particle to just represent some variable, \\( W \\). This variable can adopt a range of meanings,
including representing the stock price in financial modelling.

The Wiener process is characterised by the following properties:

\\( W(0) = 0 \\) almost surely.
This means that the initial value of our variable \\( W \\) (in this case the price of the stock) starts
from a value of 0.

\\( W \\) has independent increments: for every \\( t > 0 \\):
\\( W_{t+u} - W_t,\\; u \\ge 0, \\) are independent of the past values \\( W_s,\\; s < t. \\)

\\( W \\) has Gaussian increments - a time step \\( u \\) results in an increment that is normally distributed
with mean 0 and variance \\( u \\).

\\( W \\) has almost surely continuous paths: \\( W_t \\) is almost surely continuous in \\( t \\).
i.e. \\( W \\) has no sudden jumps - it passes through all intermediate values to get from one point
to another.

In the above conditions, "almost surely" is a probability term - this means that the probability
of the condition being true is 100%.

The basic Wiener process can take negative values, which made it unsuitable for direct stock price
modelling. Therefore the mathematical framework was adapted to create Geometric Brownian Motion
(GBM), which allows price changes proportional to the current price.`,
    widgetKey: "WienerWidget",
    pinsByDefault: true,
  },

  {
    id: "sde",
    title: "SDE formulation",
    short: "Drift + diffusion",
    description: `A stochastic differential equation combines two fundamentally different components, a deterministic part which represents what would happen on average, and a stochastic part capturing unpredictable fluctuations. The general form of an SDE can be written as:
$dX = a(X,t)dt + b(X,t)dW$

This deceptively simple equation is a lot more sophisticated than it may look. The term $a(X,t)$ is called the drift coefficient. It represents the deterministic tendency of the system, essentially the direction and rate at which X would evolve in the absence of any random perturbations. In a financial context, this might represent the expected return on an asset. The drift can depend on both the current state X and time t, allowing for complex, path-dependent behaviour.

The term $b(X,t)$ is the diffusion coefficient, sometimes called the volatility function. It determines the magnitude of random fluctuations, essentially, how much the system can be knocked around by random forces. Crucially, this can also depend on the current state, meaning that uncertainty itself can be state-dependent. In financial markets, we often observe that volatility increases during periods of market stress, for example an asset that has fallen sharply would likely exhibit greater price swings than one trading calmly.

The term $dW$ represents an infinitesimal increment of Brownian motion, which we explored in the previous section. This is the source of all randomness in the equation.

Mathematically, $dW$ behaves like $\\sqrt{dt}$ multiplied by a standard normal random variable $Z$. This scaling is important, because it means that over longer time intervals, the random effects accumulate in a specific way, growing proportionally to the square root of time rather than linearly. This is fundamentally different from deterministic systems and reflects the diffusive nature of random processes.

One might wonder why we write $dX$ rather than a traditional derivative like
$$
\\frac{dX}{dt}.
$$
This is because paths generated by SDEs are typically not differentiable in the classical sense. Brownian motion, despite being continuous, has such irregular, jagged paths that they have infinite variation, so you cannot compute a traditional derivative at any point.

The notation $dX$ represents an infinitesimal change interpreted in a specific mathematical sense, either through Itô calculus or Stratonovich calculus (but those are far too complex for you to do at this stage), which provide rigorous foundations for manipulating these objects.`,
    widgetKey: "PlaceholderWidget",
    pinsByDefault: false,
  },

  {
    id: "gbm-sim",
    title: "GBM + Simulation",
    short: "Discretize and simulate paths",
    description: `In GBM, the stock price \\( S_t \\) typically follows the stochastic differential equation:

\\[
  dS_t = \\mu S_t \\, dt + \\sigma S_t \\, dW_t
\\]

This model ensures that asset prices have a natural lower bound of 0. However, it does allow
the percentage change in price to become negative, i.e. the price is allowed to fall.

This seemingly small modification, multiplying both drift and diffusion terms by \\( S \\),
has some profound consequences. The parameter \\( \\mu \\) represents the average growth
rate or expected return of the asset. This is the deterministic trend component.
If we removed all randomness (set \\( \\sigma = 0 \\)), the solution would be simple
exponential growth:

\\[
  S(t) = S_0 e^{\\mu t}
\\]

The parameter \\( \\sigma \\) represents the volatility, a measure of how severely and
frequently the price fluctuates around its trend. Higher volatility means greater
uncertainty and larger random swings.

In the GBM model, volatility is constant, though more sophisticated models relax
this assumption. The key insight is that volatility is multiplicative, and it scales
with the current price \\( S \\). This is realistic: a £100 stock experiencing 20%
volatility will have absolute price swings ten times larger than a £10 stock with
the same percentage volatility.

The multiplicative structure ensures that \\( S \\) remains strictly positive for all time,
provided it starts positive. This is a mathematical guarantee that emerges from the
properties of the exponential function.

Even if the random term \\( dW \\) pushes strongly negative in a particular instant,
the proportional nature of the equation prevents the price from crossing zero.
The percentage change in price can certainly be negative when the stock falls,
but the price itself has a natural floor at zero.

Although GBM does have an exact analytical solution, most SDEs encountered in practice do not.
The drift and diffusion coefficients may be nonlinear functions of \\( X \\), or they could be
time-dependent. In these cases, we must resort to using numerical methods. The most fundamental
numerical method for SDEs is the Euler-Maruyama method.

The key idea here is that instead of trying to solve the equation all at once, we break time
into tiny steps and solve it piece by piece. This is called discretisation. We divide the time
interval \\( [0, T] \\) into \\( N \\) small steps of size
\\[
  \\Delta t = \\frac{T}{N}.
\\]
We then approximate the continuous SDE by a discrete-time recursion:

\\[
  X(t + \\Delta t) = X(t) + a(X(t), t)\\,\\Delta t + b(X(t), t)\\,\\sqrt{\\Delta t}\\,Z.
\\]

Here, \\( Z \\) is a standard normal random variable, drawn independently at each time step.
For Geometric Brownian Motion specifically, the Euler-Maruyama scheme becomes

\\[
  S(t + \\Delta t) = S(t) + \\mu S(t)\\,\\Delta t + \\sigma S(t)\\,\\sqrt{\\Delta t}\\,Z.
\\]

The algorithm is straightforward. We begin with the initial condition \\( S_0 \\).
At each time step, we draw a random number \\( Z \\) from a standard normal distribution.
We then update the price using the formula above. We repeat this process for \\( N \\) steps
until we reach the final time \\( T \\). The result is a single simulated path, with one
possible trajectory that the stock price might follow given the model parameters.`,
    widgetKey: "GBMSinglePathWidget",
    pinsByDefault: true,
  },

  {
    id: "outcomes",
    title: "Outcomes & Decisions",
    short: "Terminal distribution and choices",
    description: `A single simulated path doesn't tell us much. It only represents one possible future out of infinitely many. The true power of stochastic simulation comes from generating many paths and analysing their statistical properties. This is where Monte Carlo comes in.

The procedure is as follows, we run the Euler-Maruyama algorithm thousands or millions of times, each time with independently drawn random numbers. Each run produces a different trajectory $S_1(t), S_2(t), ..., S_m(t)$. From this group of runs, we can compute the mean final price, the variance, percentiles for risk assessment, probabilities of extreme outcomes etc.

Monte Carlo methods are particularly valuable because they scale well to high-dimensional problems. For a portfolio of n correlated assets, we can simply simulate all processes simultaneously at each time step.`,
    widgetKey: "TerminalDistributionWidget",
    pinsByDefault: true,
  },

  {
    id: "limits",
    title: "Limitations & Extensions",
    short: "Disaster shocks and beyond GBM",
    description: `Although the GBM model provides the foundation for the Black-Scholes option pricing formula,
it has well-documented shortcomings when confronted with real market data. Geometric
Brownian Motion is excellent for modelling small-scale, continuous random fluctuations,
but it is fundamentally poor at capturing the extreme market movements that matter most
for risk management.

The problem lies in the assumption of continuous paths. In GBM, prices evolve smoothly
as an accumulation of many small steps, and there are no sudden jumps. However, real
financial markets exhibit fat tails. Extreme events occur far more frequently than
the normal distribution predicts.

The 1987 Black Monday crash, the 2008 financial crisis, and the March 2020 COVID-19
market crash all involved movements that GBM would assign probabilities of less
than one in several million years.

Furthermore, GBM assumes constant volatility \\( \\sigma \\), independent of price level
or time. Typically, we know high volatility periods tend to be followed by more high
volatility. Volatility also typically increases when markets fall, known as the
leverage effect.

To address these limitations, researchers have developed more sophisticated models,
but GBM remains a useful starting point for understanding market dynamics.

Although the GBM model provides a framework for mathematical modelling, it is most useful as a vehicle
for the Black-Scholes Model. Geometric Brownian Motion by itself is excellent for modelling small-scale,
random shocks, but is extremely poor at capturing extreme market jumps. This is due to the path in GBM
being continuous, whereas real markets often exhibit sharp discontinuities. For example, the Geometric
Brownian Motion model would not predict events such as the 2020 COVID-19 stock crash or the 2008
financial crash.

The general GBM model as described above exists in many modified forms including the Geometric
Fractional Brownian Motion model (GFBM), the Subdiffusive GBM (sGBM) and the Mean-Reverting GBM.
The GFBM model incorporates an additional parameter called the Hurst parameter \\( H \\), which varies
between 0 and 1. Standard GBM has \\( H = 0.5 \\).

If \\( H > 0.5 \\), the process being modelled has long-range dependence which means there is positive
correlation between future and past increments. For example, a rise in stock price is likely to be
followed by another rise. If \\( H < 0.5 \\), it indicates that the process tends to return to a
long-range average.`,
    widgetKey: "DecisionTheoryWidget",
    pinsByDefault: false,
  },
];

export const stepOrder = steps.map((s) => s.id);

export function getStepById(id) {
  return steps.find((s) => s.id === id) ?? null;
}