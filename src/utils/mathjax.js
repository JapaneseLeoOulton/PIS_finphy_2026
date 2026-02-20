export async function typesetMath(rootEl) {
  if (typeof window === "undefined") return;
  const mj = window.MathJax;
  if (!mj) return;

  // MathJax v3: typesetPromise re-renders math in given elements
  if (mj.typesetPromise) {
    try {
      await mj.typesetPromise(rootEl ? [rootEl] : undefined);
    } catch {
      // ignore typeset errors
    }
  }
}
