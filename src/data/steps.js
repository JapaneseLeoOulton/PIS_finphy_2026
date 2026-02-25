export const steps = [
  {
    id: "intro",
    title: "Intro & Intuition",
    short: "Why model price randomness?",
    widgetKey: "PlaceholderWidget",
    pinsByDefault: false,
    description: `Geometric Brownian Motion (GBM) is a mathematical framework that is used for modelling the price of stock prices. Originally derived from observations in nature, GBM uses a physical understanding of randomised motion to account for fluctuations in price. This project explores how the discovery of Brownian motion has led to our current usable model for financial modelling.

Stochastic differential equations represent a very powerful mathematical framework for modelling systems, and it is influenced both by deterministic forces and random fluctuations. 

In physics and finance, we understand many quantities evolve over time, from particle positions, to temperature distributions and stock prices. When the future of this evolution is perfectly predictable from initial conditions, we can use ordinary differential equations (ODEs). A simple example is exponential growth, $\\frac{dx}{dt} = kx$, which tells us exactly what $x(t)$ will be at any moment in time given the initial value and growth constant k.

However, this deterministic framework breaks down when confronted with the reality of financial markets. Markets are not clockwork mechanisms. They are influenced by an endless stream of unpredictable factors: economic news releases, geopolitical events, shifts in investor sentiment, regulatory changes, and countless individual trading decisions. Each of these introduces its own small element of randomness that cannot be captured by deterministic equations alone. To model these systems realistically, we need to use a mathematical tool that can incorporate both the underlying trends and the inherent uncertainty, and this is where stochastic differential equations enter the picture.`,
    content: [
      {
        type: "p",
        text: `Geometric Brownian Motion (GBM) is a mathematical framework that is used for modelling the price of stock prices. Originally derived from observations in nature, GBM uses a physical understanding of randomised motion to account for fluctuations in price. This project explores how the discovery of Brownian motion has led to our current usable model for financial modelling.

Stochastic differential equations represent a very powerful mathematical framework for modelling systems, and it is influenced both by deterministic forces and random fluctuations. 

In physics and finance, we understand many quantities evolve over time, from particle positions, to temperature distributions and stock prices. When the future of this evolution is perfectly predictable from initial conditions, we can use ordinary differential equations (ODEs). A simple example is exponential growth, $\\frac{dx}{dt} = kx$, which tells us exactly what $x(t)$ will be at any moment in time given the initial value and growth constant k.

However, this deterministic framework breaks down when confronted with the reality of financial markets. Markets are not clockwork mechanisms. They are influenced by an endless stream of unpredictable factors: economic news releases, geopolitical events, shifts in investor sentiment, regulatory changes, and countless individual trading decisions. Each of these introduces its own small element of randomness that cannot be captured by deterministic equations alone. To model these systems realistically, we need to use a mathematical tool that can incorporate both the underlying trends and the inherent uncertainty, and this is where stochastic differential equations enter the picture.`,
      },
      { type: "widget", key: "PlaceholderWidget" },
    ],
  },

  {
    id: "history",
    title: "Background & History",
    short: "Origins of GBM and Monte Carlo",
    widgetKey: "PlaceholderWidget",
    pinsByDefault: false,
    description: `Physicists have used these same ideas for a while. Many Monte Carlo techniques were first
developed in physics (particularly in the Manhattan Project) before being adopted by finance.
The conceptual similarities between a particle undergoing molecular collisions and a stock
price buffeted by market forces is remarkable.

As early as c. 60 BC, humans had at least commented on the erratic behaviour of particles within a fluid. In his poem De Rerum
Natura (‘On the Nature of Things’), Lucretius describes dust particles illuminated by a setting sun. This is likely the first recorded
observation of the stochastic process that applies modern financial systems. Although what Lucretius saw was likely caused not
by true Brownian motion but by air currents, he at least "perfectly describes and explains the Brownian movement by a wrong
example". Crucially, Lucretius concludes that microscopic collisions cause general macroscopic motion. This forms the basis for
stochastic analysis. Mathematically, Lucretius' observations mirror (at least in a logical sense) a discrete random walks, where the
position $X_n$ after n steps is defined by

$X_n = \\sum_{i=1}^{n} Z_i$

where $Z_i$ represents the Lucretius’ ‘invisible’ collisions. Formally we now call $Z_i$ stochastic increments. Note that $n \\in N$. The
next known observation of stochastic motion arrives from the Dutch Physicist Jan Ingenhousz. He notes the irregular movement
of finely powdered charcoal suspended in alcohol. Some historians claim this as the first experimental discovery of what Brown
has been accredited for. However, our analysis of primary sources reveals this is likely not the case. Strict Brownian motion
requires a state of thermal equilibrium, yet in Ingenhousz’s analysis, the use of uncovered alcohol created rapid evaporation.
Instead, convection currents drove what Ingenhousz saw. Notably, the charcoal particles he observed where roughly 100μm. Our
calculations justify why this indicates he was not the first to discover Brownian motion. The **Stokes-Einstein Equation**
shows that the diffusion coefficient D, which measures the strength of random ‘jiggling’, is inversely proportional to the
particle's radius a,

$$D = \\frac{k_B T}{6\\pi\\eta a}$$

To explain why Ingenhousz's observation of 100μm charcoal particles (where a = 50μm) fails the criteria for Brownian motion,
we calculate the root mean square (RMS) displacement $\\Delta x$ over a time interval t:

$$\\sqrt{\\langle \\Delta x^2 \\rangle} = \\sqrt{2Dt}$$

Using the viscosity of ethanol ($\\eta \\approx 1.2 \\times 10^{-3}$ Pa·s) at room temperature (T = 293 K), the diffusion coefficient for a particle
of this size is approximately $D = 3.5 \\times 10^{-15}$ m²/s. For an observation period of t = 1s, the displacement is:

$$\\Delta x = \\sqrt{2(3.5 \\times 10^{-15})(1)} = 8.4 \\times 10^{-8} m = 0.084\\mu m$$

Because the displacement (0.084μm) is less than 0.1% of the particle's diameter (100μm), the motion would be imperceptible
under the microscopes of 1784. Therefore, the “violent" motion Ingenhousz saw was not stochastic diffusion, but likely
convection caused by evaporation. In financial terms, this is the equivalent of a “high-beta" environment where the volatility of a
single stock is completely drowned out by a massive market-wide trend. The underlying stochasticity exists, but the Péclet-like
ratio of the market indicates that the systemic drift $\\mu$ has overwhelmed the idiosyncratic diffusion $\\sigma$.

Whilst Norbert Wiener is lauded for his contributions to financial physics, before him there was Louis Bachelier (1870-1946). In his dissertation (written in Paris in 1900) and his subsequent work, he predicted much that was to come in financial physics, namely random walks and Brownian Motion. In his thesis, he had worked out the Wiener process and linked it mathematically to the diffusion equation, before both Einstein and Wiener.

Bachelier assumed that the movement of a price of an infinitesimal time period dt followed a normal distribution with a mean of 0. He established in his mathematical formulation that the total displacement x after time t is a random variable. Bachelier also argued that the variance must be proportional to the time elapsed in order for the process to be consistent, leading to the equation:
$Var(x) = \\sigma^2 t$
where $\\sigma$ is the volatility. This led to the insight that the 'scatter' of the random work grows proportionally to $t^{0.5}$, not t.

Another groundbreaking discovery that Bachelier made is the connection between probability and calculus. He showed that the way a probability distribution spreads out over time is identical to the way in which heat spreads out in one dimension. He showed that the probability density P satisfies the heat equation:
$$\\frac{\\delta P}{\\delta t} = D(\\frac{\\delta^2 P}{\\delta x^2})$$

In the context of finance, D represents the diffusion coefficient, which is related to the market volatility.

Whilst Bachelier remained unknown compared to Einstein and Wiener during and after his, nowadays he is recognised internationally as the father of financial mathematics.

However, Brownian motion showed no uses to the financial industry until mathematician Norbert Wiener
defined the Wiener process in 1918. Wiener defined a way to calculate the probability of a particle
taking a specific set of paths - this is known as the Wiener process.

The basic Wiener process can take negative values, which made it unsuitable for direct stock price
modelling. Stock prices, after all, cannot fall below zero, a company's value may plummet, but it cannot
become negative. Therefore, the mathematical framework was adapted to create Geometric Brownian Motion (GBM),
which ensures price changes are proportional to the current price level.`,
    content: [
      {
        type: "p",
        text: `Physicists have used these same ideas for a while. Many Monte Carlo techniques were first
developed in physics (particularly in the Manhattan Project) before being adopted by finance.
The conceptual similarities between a particle undergoing molecular collisions and a stock
price buffeted by market forces is remarkable.

As early as c. 60 BC, humans had at least commented on the erratic behaviour of particles within a fluid. In his poem De Rerum
Natura (‘On the Nature of Things’), Lucretius describes dust particles illuminated by a setting sun. This is likely the first recorded
observation of the stochastic process that applies modern financial systems. Although what Lucretius saw was likely caused not
by true Brownian motion but by air currents, he at least "perfectly describes and explains the Brownian movement by a wrong
example". Crucially, Lucretius concludes that microscopic collisions cause general macroscopic motion. This forms the basis for
stochastic analysis. Mathematically, Lucretius' observations mirror (at least in a logical sense) a discrete random walks, where the
position $X_n$ after n steps is defined by

$X_n = \\sum_{i=1}^{n} Z_i$

where $Z_i$ represents the Lucretius’ ‘invisible’ collisions. Formally we now call $Z_i$ stochastic increments. Note that $n \\in N$. The
next known observation of stochastic motion arrives from the Dutch Physicist Jan Ingenhousz. He notes the irregular movement
of finely powdered charcoal suspended in alcohol. Some historians claim this as the first experimental discovery of what Brown
has been accredited for. However, our analysis of primary sources reveals this is likely not the case. Strict Brownian motion
requires a state of thermal equilibrium, yet in Ingenhousz’s analysis, the use of uncovered alcohol created rapid evaporation.
Instead, convection currents drove what Ingenhousz saw. Notably, the charcoal particles he observed where roughly 100μm. Our
calculations justify why this indicates he was not the first to discover Brownian motion. The **Stokes-Einstein Equation**
shows that the diffusion coefficient D, which measures the strength of random ‘jiggling’, is inversely proportional to the
particle's radius a,

$$D = \\frac{k_B T}{6\\pi\\eta a}$$

To explain why Ingenhousz's observation of 100μm charcoal particles (where a = 50μm) fails the criteria for Brownian motion,
we calculate the root mean square (RMS) displacement $\\Delta x$ over a time interval t:

$$\\sqrt{\\langle \\Delta x^2 \\rangle} = \\sqrt{2Dt}$$

Using the viscosity of ethanol ($\\eta \\approx 1.2 \\times 10^{-3}$ Pa·s) at room temperature (T = 293 K), the diffusion coefficient for a particle
of this size is approximately $D = 3.5 \\times 10^{-15}$ m²/s. For an observation period of t = 1s, the displacement is:

$$\\Delta x = \\sqrt{2(3.5 \\times 10^{-15})(1)} = 8.4 \\times 10^{-8} m = 0.084\\mu m$$

Because the displacement (0.084μm) is less than 0.1% of the particle's diameter (100μm), the motion would be imperceptible
under the microscopes of 1784. Therefore, the “violent" motion Ingenhousz saw was not stochastic diffusion, but likely
convection caused by evaporation. In financial terms, this is the equivalent of a “high-beta" environment where the volatility of a
single stock is completely drowned out by a massive market-wide trend. The underlying stochasticity exists, but the Péclet-like
ratio of the market indicates that the systemic drift $\\mu$ has overwhelmed the idiosyncratic diffusion $\\sigma$.

Whilst Norbert Wiener is lauded for his contributions to financial physics, before him there was Louis Bachelier (1870-1946). In his dissertation (written in Paris in 1900) and his subsequent work, he predicted much that was to come in financial physics, namely random walks and Brownian Motion. In his thesis, he had worked out the Wiener process and linked it mathematically to the diffusion equation, before both Einstein and Wiener.

Bachelier assumed that the movement of a price of an infinitesimal time period dt followed a normal distribution with a mean of 0. He established in his mathematical formulation that the total displacement x after time t is a random variable. Bachelier also argued that the variance must be proportional to the time elapsed in order for the process to be consistent, leading to the equation:
$Var(x) = \\sigma^2 t$
where $\\sigma$ is the volatility. This led to the insight that the 'scatter' of the random work grows proportionally to $t^{0.5}$, not t.

Another groundbreaking discovery that Bachelier made is the connection between probability and calculus. He showed that the way a probability distribution spreads out over time is identical to the way in which heat spreads out in one dimension. He showed that the probability density P satisfies the heat equation:
$$\\frac{\\delta P}{\\delta t} = D(\\frac{\\delta^2 P}{\\delta x^2})$$

In the context of finance, D represents the diffusion coefficient, which is related to the market volatility.

Whilst Bachelier remained unknown compared to Einstein and Wiener during and after his, nowadays he is recognised internationally as the father of financial mathematics.

However, Brownian motion showed no uses to the financial industry until mathematician Norbert Wiener
defined the Wiener process in 1918. Wiener defined a way to calculate the probability of a particle
taking a specific set of paths - this is known as the Wiener process.

The basic Wiener process can take negative values, which made it unsuitable for direct stock price
modelling. Stock prices, after all, cannot fall below zero, a company's value may plummet, but it cannot
become negative. Therefore, the mathematical framework was adapted to create Geometric Brownian Motion (GBM),
which ensures price changes are proportional to the current price level.`,
      },
      { type: "widget", key: "PlaceholderWidget" },
    ],
  },

  {
    id: "brownian",
    title: "Brownian Motion",
    short: "Wiener process foundations",
    widgetKey: "WienerWidget",
    pinsByDefault: true,
    description: `However, Brownian motion showed no uses to the financial industry until mathematician Norbert Wiener defined the Wiener process in 1918. Wiener defined a way to calculate the probability of a particle taking a specific set of paths - this is known as the Wiener process.

Although physically Brownian motion represents the motion of a particle, the Wiener process generalises the idea of a particle to just represent some variable, $W$. This variable can adopt a range of meanings, including representing the stock price in financial modelling.

The Wiener process is characterised by the following properties:

$W(0) = 0$ almost surely. This means that the initial value of our variable $W$ (in this case the price of the stock) starts from a value of 0.

$W$ has independent increments: for every $t > 0$: $W_{t+u} - W_t, u \\ge 0,$ are independent of the past values $W_s, s < t.$

$W$ has Gaussian increments - a time step $u$ results in an increment that is normally distributed with mean 0 and variance $u$.

$W$ has almost surely continuous paths: $W_t$ is almost surely continuous in $t$. i.e. $W$ has no sudden jumps - it passes through all intermediate values to get from one point to another.

In the above conditions, "almost surely" is a probability term - this means that the probability of the condition being true is 100%.

The basic Wiener process can take negative values, which made it unsuitable for direct stock price modelling. Therefore the mathematical framework was adapted to create Geometric Brownian Motion (GBM), which allows price changes proportional to the current price.`,
    content: [
      {
        type: "p",
        text: `However, Brownian motion showed no uses to the financial industry until mathematician Norbert Wiener defined the Wiener process in 1918. Wiener defined a way to calculate the probability of a particle taking a specific set of paths - this is known as the Wiener process.

Although physically Brownian motion represents the motion of a particle, the Wiener process generalises the idea of a particle to just represent some variable, $W$. This variable can adopt a range of meanings, including representing the stock price in financial modelling.

The Wiener process is characterised by the following properties:

$W(0) = 0$ almost surely. This means that the initial value of our variable $W$ (in this case the price of the stock) starts from a value of 0.

$W$ has independent increments: for every $t > 0$: $W_{t+u} - W_t, u \\ge 0,$ are independent of the past values $W_s, s < t.$

$W$ has Gaussian increments - a time step $u$ results in an increment that is normally distributed with mean 0 and variance $u$.

$W$ has almost surely continuous paths: $W_t$ is almost surely continuous in $t$. i.e. $W$ has no sudden jumps - it passes through all intermediate values to get from one point to another.

In the above conditions, "almost surely" is a probability term - this means that the probability of the condition being true is 100%.

The basic Wiener process can take negative values, which made it unsuitable for direct stock price modelling. Therefore the mathematical framework was adapted to create Geometric Brownian Motion (GBM), which allows price changes proportional to the current price.`,
      },
      { type: "widget", key: "WienerWidget" },
    ],
  },

  {
    id: "sde",
    title: "SDE formulation",
    short: "Drift + diffusion",
    widgetKey: "PlaceholderWidget",
    pinsByDefault: false,
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

The notation $dX$ represents an infinitesimal change interpreted in a specific mathematical sense, either through Itô calculus or Stratonovich calculus (but those are far too complex for you to do at this stage), which provide rigorous foundations for manipulating these objects.

Extra Content:
The drift parameter $\\mu$ dictates that general trend of an asset, which is separate from its volatility, which is fluctuating. If $\\mu > 0$, then the trend of the asset is upwards, and if $\\mu < 0$, then the general trend is downwards. In the absence of volatility, the expected value of the stock price at time T is:
$$E[S(T)] = S(0)e^{\\mu T}$$

The drift is often mistaken with the realised growth, which is the growth rate of the 'typical' path. By contrast, the drift is the average of all possible future outcomes.

For running simulations in real market scenarios, historical performance is often used to estimate the drift.

Depending on the current value of the drift, the market can be split into different categories: bull markets, bear markets, and sideways markets. Bull markets allude to a positive drift, where asset prices tend to increase. In a bull market, the conditions of the economy are generally favourable, for example when there is strong economic growth, high investor confidence and low unemployment.

On the other hand, negative drift indicates a bear market. In a bear market, asset prices tend to fall. Bear markets are often triggered by factors such as rising inflation and economic slowdowns, which weaken investor confidence. Bear markets can last from a few weeks to years. One of the last prolonged bear markets occurred in the US between 2007-2009 during the Financial Crisis, and this bear market last around 17 months, indicating a long term period of negative drift.

Sideways markets occur when the drift lies at around zero. In a sideways market, asset prices tend to stay roughly the same - there is no trend to asset prices. During a sideways market, trading volume tends to remain balanced. This means that investors are not rushing to buy or sell, and thus the market remains steady and balanced. There may be spikes in asset prices during a bear market, but these do not have an underlying trend.

The diffusion coefficient in GBM is directly related to the volatility of the market.
$$D(x) = \\frac{\\sigma^2 x^2}{2}$$
where D is the diffusion coefficient, $\\sigma$ is the volatility and $x$ is the current price of the stock. This differs to standard Brownian motion, where the diffusion coefficient is constant.

In turbulent markets, the volatility $\\sigma$ is higher. This in turn means that the diffusion coefficient is higher, reflecting a wider, faster spread in potential price outcomes. Turbulent markets tend to occur during periods of high uncertainty, such as during financial crashes, during extreme political tensions or other international disasters. For example, one of the highest volatilities ever recorded was in March 2020 during the COVID-19 pandemic, where the Cboe Volatility Index (VIX) reached a closing high of 82.69.

Low volatilities represent stable, growing markets. Price fluctuations of stocks are smaller and more predictable, and thus there is a slower spread of potential price outcomes of stocks. A VIX value below 12 generally indicates low volatility.

The above figure demonstrates the difference in price paths that high vs low volatility stocks. It can clearly be seen that the more volatile stock shows more discontinuous jumps in its value compared to the lower volatility stock.

In real market situations, the volatility is not constant. Although the future price of a stock cannot be predicted deterministically, variations in volatility combined with historical data can be used to gauge how the market will move.

The above figure demonstrates how a typical volatility cycle takes place. Before the volatility spike, the volatility gradually increases up until the peak, and then decreases back down to around the initial volatility value.`,
    content: [
      {
        type: "p",
        text: `A stochastic differential equation combines two fundamentally different components, a deterministic part which represents what would happen on average, and a stochastic part capturing unpredictable fluctuations. The general form of an SDE can be written as:
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

The notation $dX$ represents an infinitesimal change interpreted in a specific mathematical sense, either through Itô calculus or Stratonovich calculus (but those are far too complex for you to do at this stage), which provide rigorous foundations for manipulating these objects.

Extra Content:
The drift parameter $\\mu$ dictates that general trend of an asset, which is separate from its volatility, which is fluctuating. If $\\mu > 0$, then the trend of the asset is upwards, and if $\\mu < 0$, then the general trend is downwards. In the absence of volatility, the expected value of the stock price at time T is:
$$E[S(T)] = S(0)e^{\\mu T}$$

The drift is often mistaken with the realised growth, which is the growth rate of the 'typical' path. By contrast, the drift is the average of all possible future outcomes.

For running simulations in real market scenarios, historical performance is often used to estimate the drift.

Depending on the current value of the drift, the market can be split into different categories: bull markets, bear markets, and sideways markets. Bull markets allude to a positive drift, where asset prices tend to increase. In a bull market, the conditions of the economy are generally favourable, for example when there is strong economic growth, high investor confidence and low unemployment.

On the other hand, negative drift indicates a bear market. In a bear market, asset prices tend to fall. Bear markets are often triggered by factors such as rising inflation and economic slowdowns, which weaken investor confidence. Bear markets can last from a few weeks to years. One of the last prolonged bear markets occurred in the US between 2007-2009 during the Financial Crisis, and this bear market last around 17 months, indicating a long term period of negative drift.

Sideways markets occur when the drift lies at around zero. In a sideways market, asset prices tend to stay roughly the same - there is no trend to asset prices. During a sideways market, trading volume tends to remain balanced. This means that investors are not rushing to buy or sell, and thus the market remains steady and balanced. There may be spikes in asset prices during a bear market, but these do not have an underlying trend.

The diffusion coefficient in GBM is directly related to the volatility of the market.
$$D(x) = \\frac{\\sigma^2 x^2}{2}$$
where D is the diffusion coefficient, $\\sigma$ is the volatility and $x$ is the current price of the stock. This differs to standard Brownian motion, where the diffusion coefficient is constant.

In turbulent markets, the volatility $\\sigma$ is higher. This in turn means that the diffusion coefficient is higher, reflecting a wider, faster spread in potential price outcomes. Turbulent markets tend to occur during periods of high uncertainty, such as during financial crashes, during extreme political tensions or other international disasters. For example, one of the highest volatilities ever recorded was in March 2020 during the COVID-19 pandemic, where the Cboe Volatility Index (VIX) reached a closing high of 82.69.

Low volatilities represent stable, growing markets. Price fluctuations of stocks are smaller and more predictable, and thus there is a slower spread of potential price outcomes of stocks. A VIX value below 12 generally indicates low volatility.

The above figure demonstrates the difference in price paths that high vs low volatility stocks. It can clearly be seen that the more volatile stock shows more discontinuous jumps in its value compared to the lower volatility stock.

In real market situations, the volatility is not constant. Although the future price of a stock cannot be predicted deterministically, variations in volatility combined with historical data can be used to gauge how the market will move.

The above figure demonstrates how a typical volatility cycle takes place. Before the volatility spike, the volatility gradually increases up until the peak, and then decreases back down to around the initial volatility value.`,
      },
      { type: "widget", key: "PlaceholderWidget" },
    ],
  },

  {
    id: "gbm-sim",
    title: "GBM + Simulation",
    short: "Discretize and simulate paths",
    widgetKey: "GBMSinglePathWidget",
    pinsByDefault: true,
    description: `In GBM, the stock price $S_t$ typically follows the stochastic differential equation:

\\[
  dS_t = \\mu S_t \\, dt + \\sigma S_t \\, dW_t
\\]

This model ensures that asset prices have a natural lower bound of 0. However, it does allow the percentage change in price to become negative, i.e. the price is allowed to fall.

The parameter $\\mu$ represents the average growth rate or expected return of the asset. The parameter $\\sigma$ represents the volatility, a measure of how severely and frequently the price fluctuates around its trend. The multiplicative structure ensures that $S$ remains strictly positive for all time, provided it starts positive.

Although GBM does have an exact analytical solution, most SDEs encountered in practice do not. In these cases, we must resort to using numerical methods like the Euler-Maruyama method. We divide the time interval $[0, T]$ into $N$ small steps of size
\\[
  \\Delta t = \\frac{T}{N}.
\\]
We then approximate the continuous SDE by a discrete-time recursion:

\\[
  X(t + \\Delta t) = X(t) + a(X(t), t)\\,\\Delta t + b(X(t), t)\\,\\sqrt{\\Delta t}\\,Z.
\\]

For Geometric Brownian Motion specifically, the scheme becomes

\\[
  S(t + \\Delta t) = S(t) + \\mu S(t)\\,\\Delta t + \\sigma S(t)\\,\\sqrt{\\Delta t}\\,Z.
\\]

The algorithm is straightforward. We begin with the initial condition $S_0$.
At each time step, we draw a random number $Z$ from a standard normal distribution.
We then update the price using the formula above. We repeat this process for $N$ steps
until we reach the final time $T$. The result is a single simulated path, with one
possible trajectory that the stock price might follow given the model parameters.`,
    content: [
      {
        type: "p",
        text: `In GBM, the stock price $S_t$ typically follows the stochastic differential equation:

\\[
  dS_t = \\mu S_t \\, dt + \\sigma S_t \\, dW_t
\\]

This model ensures that asset prices have a natural lower bound of 0. However, it does allow the percentage change in price to become negative, i.e. the price is allowed to fall.

The parameter $\\mu$ represents the average growth rate or expected return of the asset. The parameter $\\sigma$ represents the volatility, a measure of how severely and frequently the price fluctuates around its trend. The multiplicative structure ensures that $S$ remains strictly positive for all time, provided it starts positive.

Although GBM does have an exact analytical solution, most SDEs encountered in practice do not. In these cases, we must resort to using numerical methods like the Euler-Maruyama method. We divide the time interval $[0, T]$ into $N$ small steps of size
\\[
  \\Delta t = \\frac{T}{N}.
\\]
We then approximate the continuous SDE by a discrete-time recursion:

\\[
  X(t + \\Delta t) = X(t) + a(X(t), t)\\,\\Delta t + b(X(t), t)\\,\\sqrt{\\Delta t}\\,Z.
\\]

For Geometric Brownian Motion specifically, the scheme becomes

\\[
  S(t + \\Delta t) = S(t) + \\mu S(t)\\,\\Delta t + \\sigma S(t)\\,\\sqrt{\\Delta t}\\,Z.
\\]

The algorithm is straightforward. We begin with the initial condition $S_0$.
At each time step, we draw a random number $Z$ from a standard normal distribution.
We then update the price using the formula above. We repeat this process for $N$ steps
until we reach the final time $T$. The result is a single simulated path, with one
possible trajectory that the stock price might follow given the model parameters.`,
      },
      { type: "widget", key: "GBMSinglePathWidget" },
    ],
  },

  {
    id: "outcomes",
    title: "Outcomes & Decisions",
    short: "Terminal distribution and choices",
    widgetKey: "TerminalDistributionWidget",
    pinsByDefault: true,
    description: `A single simulated path doesn't tell us much. The true power of stochastic simulation comes from generating many paths and analysing their statistical properties via Monte Carlo simulation.

The procedure involves running the Euler-Maruyama algorithm thousands or millions of times. Each run produces a different trajectory $S_1(t), S_2(t), ..., S_m(t)$. From this group of runs, we can compute the mean final price, the variance, percentiles for risk assessment, and probabilities of extreme outcomes.

Monte Carlo methods are particularly valuable because they scale well to high-dimensional problems. For a portfolio of n correlated assets, we can simply simulate all processes simultaneously at each time step.`,
    content: [
      {
        type: "p",
        text: `A single simulated path doesn't tell us much. The true power of stochastic simulation comes from generating many paths and analysing their statistical properties via Monte Carlo simulation.

The procedure involves running the Euler-Maruyama algorithm thousands or millions of times. Each run produces a different trajectory $S_1(t), S_2(t), ..., S_m(t)$. From this group of runs, we can compute the mean final price, the variance, percentiles for risk assessment, and probabilities of extreme outcomes.

Monte Carlo methods are particularly valuable because they scale well to high-dimensional problems. For a portfolio of n correlated assets, we can simply simulate all processes simultaneously at each time step.`,
      },
      { type: "widget", key: "TerminalDistributionWidget" },
    ],
  },

  {
    id: "limits",
    title: "Limitations & Extensions",
    short: "Disaster shocks and beyond GBM",
    widgetKey: "DecisionTheoryWidget",
    pinsByDefault: false,
    description: `Although the GBM model provides the foundation for the Black-Scholes option pricing formula, it has well-documented shortcomings. GBM assumes continuous paths with no sudden jumps, whereas real markets exhibit fat tails and sharp discontinuities. The 1987 Black Monday crash, the 2008 financial crisis, and the 2020 COVID-19 crash all involved movements that GBM would assign probabilities of less than one in several million years.

The main purpose of our model was not to provide precise forecasts of future asset prices, but rather to offer a simplified representation of how financial prices evolve under uncertainty, such as mass global events.

Our model captures two fundamental features observed in real markets: long-term growth trends and short-term randomness. A drift term is used to represent the change or expected rate of growth over time and can be associated with factors such as economic expansion, inflation, productivity gain and corporate profitability. These factors don't determine movement of prices at every moment but instead influence the overall direction of prices when viewed over long time intervals.

In contrast, short-term fluctuations in market prices are expressed through the 'shock term', which is influenced by the volatility value. This allows for day-to-day price change to be observed, something that is affected by news releases, trading behaviour or, in our case, global events. Over short time periods, this term can dominate the drift term, causing prices to move in unexpected directions, even when the long-term growth rate is a constant positive. A historical example of this can be seen through the 2011 Tohoku earthquake and Fukushima incident in Japan. This tragic event caused sudden uncertainty over supply chains, energy shortages and corporate losses; financial markets reacted with sharp, erratic price movements. In our model, such an event would result in an immediate increase on volatility, causing the shock term to grow larger and therefore simulated price paths would spread out much more over short intervals - expressing the immediate market panic.

Furthermore, Fukushima also had long term impacts on Japan's economy. Immediately after the disaster, all nuclear reactors were shut down, signifying a big shift away from nuclear energy and placing more reliance on imported fossil fuels. This lead to higher long-run energy costs, reduced energy security and an increased trade deficit, resulting in lower expected productivity growth and reduced competitiveness of energy-intensive industries. Applying these factors to our model would see a lower drift parameter. Additionally, permanent evacuation of certain regions, as well as general loss of local economic activity, would have added to the sustained downward pressure on the economy and contributed further to the lowering of the drift term in our model.`,
    content: [
      {
        type: "p",
        text: `Although the GBM model provides the foundation for the Black-Scholes option pricing formula, it has well-documented shortcomings. GBM assumes continuous paths with no sudden jumps, whereas real markets exhibit fat tails and sharp discontinuities. The 1987 Black Monday crash, the 2008 financial crisis, and the 2020 COVID-19 crash all involved movements that GBM would assign probabilities of less than one in several million years.

The main purpose of our model was not to provide precise forecasts of future asset prices, but rather to offer a simplified representation of how financial prices evolve under uncertainty, such as mass global events.

Our model captures two fundamental features observed in real markets: long-term growth trends and short-term randomness. A drift term is used to represent the change or expected rate of growth over time and can be associated with factors such as economic expansion, inflation, productivity gain and corporate profitability. These factors don't determine movement of prices at every moment but instead influence the overall direction of prices when viewed over long time intervals.

In contrast, short-term fluctuations in market prices are expressed through the 'shock term', which is influenced by the volatility value. This allows for day-to-day price change to be observed, something that is affected by news releases, trading behaviour or, in our case, global events. Over short time periods, this term can dominate the drift term, causing prices to move in unexpected directions, even when the long-term growth rate is a constant positive. A historical example of this can be seen through the 2011 Tohoku earthquake and Fukushima incident in Japan. This tragic event caused sudden uncertainty over supply chains, energy shortages and corporate losses; financial markets reacted with sharp, erratic price movements. In our model, such an event would result in an immediate increase on volatility, causing the shock term to grow larger and therefore simulated price paths would spread out much more over short intervals - expressing the immediate market panic.

Furthermore, Fukushima also had long term impacts on Japan's economy. Immediately after the disaster, all nuclear reactors were shut down, signifying a big shift away from nuclear energy and placing more reliance on imported fossil fuels. This lead to higher long-run energy costs, reduced energy security and an increased trade deficit, resulting in lower expected productivity growth and reduced competitiveness of energy-intensive industries. Applying these factors to our model would see a lower drift parameter. Additionally, permanent evacuation of certain regions, as well as general loss of local economic activity, would have added to the sustained downward pressure on the economy and contributed further to the lowering of the drift term in our model.`,
      },
      { type: "widget", key: "DecisionTheoryWidget" },
    ],
  },
];

export const stepOrder = steps.map((s) => s.id);

export function getStepById(id) {
  return steps.find((s) => s.id === id) ?? null;
}