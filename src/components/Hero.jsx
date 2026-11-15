import { lazy, Suspense, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { personalInfo, heroContent } from '../data/portfolioData';
import ScrambleText from './ScrambleText';

// Lazy load HeroScene so three.js is bundled in its own chunk
const HeroScene = lazy(() => import('./HeroScene'));

/**
 * Hero component - The centerpiece of the Signal HUD portfolio.
 * Combines high-impact typography with decoding animations, CTAs, and an interactive 3D signal core.
 */
export default function Hero() {
  const heroRef = useRef(null);

  // Split name for dual-style typography (solid first word, outlined remainder)
  const nameParts = (personalInfo.name || 'ANKITA SINGH').trim().split(/\s+/);
  const firstName = (nameParts[0] || 'ANKITA').toUpperCase();
  const restName = (nameParts.slice(1).join(' ') || 'SINGH').toUpperCase();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Fade and slide entrance for key information blocks
      gsap.from('[data-hero="fade"]', {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
        delay: 0.3,
      });

      // Technical divider drawn from left to right
      gsap.fromTo(
        '[data-hero="divider"]',
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: 'left center',
          duration: 1.2,
          ease: 'power3.inOut',
          delay: 0.4,
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={heroRef}
      className="hud-grid min-h-screen flex flex-col justify-between overflow-hidden px-5 md:px-10 pt-24 pb-10"
    >
      <div className="max-w-[1440px] w-full mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] items-center gap-10 flex-1 my-auto">
        {/* Left Column: Typography, Details, and CTAs */}
        <div className="flex flex-col gap-6 md:gap-8 max-w-2xl">
          {/* Eyebrow */}
          <div
            data-hero="fade"
            className="font-mono text-xs uppercase tracking-[0.3em] text-signal font-semibold"
          >
            {heroContent.eyebrow}
          </div>

          {/* Heading with Dual-Style Scrambled Name */}
          <h1
            data-hero="fade"
            className="text-[clamp(3.2rem,11vw,9.5rem)] font-bold uppercase leading-[0.88] tracking-[-0.04em] flex flex-col select-none"
          >
            <span className="text-bone">
              <ScrambleText text={firstName} trigger="mount" delay={200} />
            </span>
            <span className="text-transparent [-webkit-text-stroke:1.5px_#e8e6df]">
              <ScrambleText text={restName} trigger="mount" delay={500} />
            </span>
          </h1>

          {/* Divider Line */}
          <div
            data-hero="divider"
            className="h-px max-w-xl w-full bg-bone/25 origin-left"
          />

          {/* Role & Intro Description */}
          <div data-hero="fade" className="flex flex-col gap-3 max-w-xl">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-dim">
              {personalInfo.role}
            </span>
            <p className="text-lg md:text-xl text-bone/85 leading-relaxed font-sans">
              {heroContent.intro}
            </p>
          </div>

          {/* Action Buttons */}
          <div data-hero="fade" className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href={heroContent.ctaPrimary.href}
              className="px-6 py-3.5 bg-signal text-ink hover:bg-bone font-mono text-xs font-semibold uppercase tracking-[0.2em] transition-colors group inline-flex items-center gap-2"
            >
              <span>{heroContent.ctaPrimary.label}</span>
              <span
                className="transition-transform group-hover:translate-x-1.5"
                aria-hidden="true"
              >
                →
              </span>
            </a>
            <a
              href={heroContent.ctaSecondary.href}
              className="px-6 py-3.5 border border-bone/30 text-bone hover:border-signal hover:text-signal font-mono text-xs font-semibold uppercase tracking-[0.2em] transition-colors inline-flex items-center"
            >
              <span>{heroContent.ctaSecondary.label}</span>
            </a>
          </div>
        </div>

        {/* Right Column: HUD Frame holding 3D Signal Core */}
        <div
          data-hero="fade"
          className="hud-frame relative border border-bone/10 bg-panel/40 h-[48vh] min-h-[320px] lg:h-[70vh] flex items-center justify-center overflow-hidden"
        >
          <span
            aria-hidden="true"
            className="absolute top-3 left-4 text-[10px] uppercase tracking-[0.25em] text-dim font-mono pointer-events-none z-10"
          >
            core.view — drag to rotate
          </span>
          <span
            aria-hidden="true"
            className="absolute bottom-3 right-4 text-[10px] uppercase tracking-[0.25em] text-dim font-mono pointer-events-none z-10"
          >
            {personalInfo.city}
          </span>
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        </div>
      </div>

      {/* Bottom Technical Status Strip */}
      <div
        data-hero="fade"
        className="w-full max-w-[1440px] mx-auto mt-10 border-t border-bone/10 pt-5 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-dim"
      >
        <div className="flex items-center gap-2.5">
          <span
            className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse inline-block"
            aria-hidden="true"
          />
          <span>{personalInfo.availability}</span>
        </div>
        <span className="hidden sm:inline-block">Scroll ↓</span>
      </div>
    </section>
  );
}

