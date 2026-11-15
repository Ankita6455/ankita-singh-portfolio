import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Custom hook to synchronize Lenis smooth scrolling with GSAP ScrollTrigger
 * on a single animation loop, with anchor link handling and cleanup.
 */
export function useSmoothScroll() {
  useEffect(() => {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Register ScrollTrigger plugin with GSAP
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });

    // Update ScrollTrigger whenever Lenis scrolls
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis directly from GSAP ticker for a unified animation loop
    const tick = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Smooth scroll for internal anchor links
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href === '#' || href === '#!') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -60 });
      }
    };

    document.addEventListener('click', handleAnchorClick);

    // Recalculate triggers after assets load and once more after layout settles
    const handleLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', handleLoad);
    const settleTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 800);

    // Cleanup resources and listeners on unmount
    return () => {
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('load', handleLoad);
      clearTimeout(settleTimer);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
}

