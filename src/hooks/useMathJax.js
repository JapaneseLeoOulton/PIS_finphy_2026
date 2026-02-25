import { useEffect } from "react";


export function useMathJax(containerRef, deps = []) {
  useEffect(() => {
    const mj = window.MathJax;
    const el = containerRef?.current;

    if (!mj || !el) return;

    
    mj.typesetClear?.([el]);

    
    mj.typesetPromise?.([el]).catch((err) => console.error("MathJax typeset failed:", err));
  
  }, deps);
}