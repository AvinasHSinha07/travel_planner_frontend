'use client';

import Lenis from 'lenis';
import { ReactNode, useEffect, useRef } from 'react';

/**
 * Returns true if the element (or any ancestor up to <body>) has
 * its own scrollable overflow — Lenis should NOT intercept scroll
 * events on these so they can scroll natively.
 */
function isScrollableElement(el: Element): boolean {
  let node: Element | null = el;
  while (node && node !== document.body) {
    const style = window.getComputedStyle(node);
    const overflow = style.overflow + style.overflowY;
    const isScrollable =
      /(auto|scroll)/.test(overflow) &&
      node.scrollHeight > node.clientHeight;
    if (isScrollable) return true;
    node = node.parentElement;
  }
  return false;
}

export default function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      duration: 1.2,
      smoothWheel: true,
      // Prevent Lenis from hijacking scroll on elements that have
      // their own scrollable overflow (sidebar, modals, dropdowns…)
      prevent: (node: Element) => isScrollableElement(node),
    });

    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
