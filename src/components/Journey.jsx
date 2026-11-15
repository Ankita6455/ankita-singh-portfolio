import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { experience } from '../data/portfolioData';
import ScrambleText from './ScrambleText';

/**
 * Journey component - Displays educational and professional milestones along a
 * scroll-driven progress line with activated state nodes.
 */
export default function Journey() {
  const sectionRef = useRef(null);
  const listRef = useRef(null);
  const fillRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const list = listRef.current;
      const fill = fillRef.current;
      const items = list?.querySelectorAll('[data-journey-item]');

      if (prefersReducedMotion) {
        if (fill) fill.style.transform = 'scaleY(1)';
        items?.forEach((item) => {
          item.classList.add('is-on');
        });
        return;
      }

      // Vertical line fill scrubber
      if (fill && list) {
        gsap.fromTo(
          fill,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: list,
              start: 'top 70%',
              end: 'bottom 60%',
              scrub: true,
            },
          }
        );
      }

      // Individual item entrances and node activation triggers
      items?.forEach((item) => {
        // Entrance animation
        gsap.from(item, {
          opacity: 0,
          x: 30,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            once: true,
          },
        });

        // Activation state trigger
        ScrollTrigger.create({
          trigger: item,
          start: 'top 65%',
          onEnter: () => item.classList.add('is-on'),
          onLeaveBack: () => item.classList.remove('is-on'),
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="px-5 md:px-10 py-28 md:py-40"
    >
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20 items-start">
        {/* Left Column (Sticky on large screens) */}
        <div className="lg:sticky lg:top-28 lg:self-start flex flex-col gap-4">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-signal">
            <ScrambleText text="03 / Journey" trigger="view" />
          </div>
          <h2 className="text-[clamp(2.4rem,5vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-bone">
            Where I&apos;ve been learning and building.
          </h2>
        </div>

        {/* Right Column: Timeline List */}
        <div className="w-full">
          <ol
            ref={listRef}
            className="relative pl-10 flex flex-col gap-12 md:gap-16"
          >
            {/* Base Background Track Line */}
            <div
              className="absolute top-2 bottom-2 left-0 w-px bg-bone/15"
              aria-hidden="true"
            />
            {/* Scroll-Linked Signal Orange Fill Line */}
            <div
              ref={fillRef}
              className="absolute top-2 bottom-2 left-0 w-px bg-signal origin-top scale-y-0"
              aria-hidden="true"
            />

            {experience.map((item) => (
              <li
                key={`${item.period}-${item.role}`}
                data-journey-item
                className="relative flex flex-col gap-2.5 [&.is-on_.node]:bg-signal [&.is-on_.node]:scale-100"
              >
                {/* 15px Square Interactive Node */}
                <div
                  className="node w-[15px] h-[15px] absolute -left-[47.5px] top-1.5 border border-signal bg-ink scale-75 transition-all duration-300 pointer-events-none"
                  aria-hidden="true"
                />

                <span className="font-mono text-xs uppercase tracking-[0.25em] text-dim">
                  {item.period}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-bone">
                  {item.role}
                </h3>
                <span className="font-mono text-sm text-signal font-semibold">
                  {item.org}
                </span>
                <p className="text-bone/70 leading-relaxed font-sans text-base max-w-2xl">
                  {item.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

