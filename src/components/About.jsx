import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { personalInfo, aboutContent, skillGroups } from '../data/portfolioData';
import ScrambleText from './ScrambleText';

// Dynamically resolve portrait image from src/assets/about/
const portraitModules = import.meta.glob('../assets/about/about-portrait.*', {
  eager: true,
  import: 'default',
});
const portraitSrc = Object.values(portraitModules)[0] || null;

/**
 * About component - Presents personal identity, biography, animated numeric metrics,
 * and structured skill matrices in a technical HUD grid.
 */
export default function About() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const statEls = sectionRef.current?.querySelectorAll('[data-stat-target]');

      if (prefersReducedMotion) {
        // If reduced motion is requested, immediately set target values
        statEls?.forEach((el) => {
          const target = parseFloat(el.getAttribute('data-stat-target'));
          const isDecimal = target % 1 !== 0;
          el.textContent = isDecimal ? target.toFixed(2) : target.toString();
        });
        return;
      }

      // Staggered reveal for about elements when section reaches top 75%
      gsap.from('[data-about="reveal"]', {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      });

      // Animated count-up for stats
      statEls?.forEach((el) => {
        const target = parseFloat(el.getAttribute('data-stat-target'));
        const isDecimal = target % 1 !== 0;
        const counter = { val: 0 };

        gsap.to(counter, {
          val: target,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
          onUpdate: () => {
            el.textContent = isDecimal
              ? counter.val.toFixed(2)
              : Math.floor(counter.val).toString();
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="w-full px-5 md:px-10 py-28 md:py-40"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Section Label */}
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-signal mb-10">
          <ScrambleText text={aboutContent.label} trigger="view" />
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20 items-start">
          {/* Left Column: Portrait */}
          <div data-about="reveal" className="flex justify-center lg:justify-start">
            <div className="hud-frame aspect-[4/5] max-w-[420px] w-full border border-bone/10 bg-panel overflow-hidden relative">
              {portraitSrc ? (
                <>
                  <img
                    src={portraitSrc}
                    alt={`${personalInfo.name} — ${personalInfo.role}`}
                    className="grayscale contrast-125 object-cover w-full h-full"
                  />
                  <div
                    className="absolute inset-0 bg-signal mix-blend-multiply opacity-25 pointer-events-none"
                    aria-hidden="true"
                  />
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center font-mono text-xs uppercase tracking-[0.2em] text-dim p-6 text-center">
                  <span>Portrait Placeholder</span>
                  <span className="text-[10px] text-bone/40 mt-1">
                    src/assets/about/about-portrait.*
                  </span>
                </div>
              )}

              {/* Technical Badge */}
              <div className="absolute bottom-3 left-4 font-mono text-[10px] uppercase tracking-[0.25em] text-dim z-10 pointer-events-none">
                ID · {personalInfo.brandName}
              </div>
            </div>
          </div>

          {/* Right Column: Bio, Stats, and Skills */}
          <div className="flex flex-col gap-10">
            {/* Heading */}
            <h2
              data-about="reveal"
              className="text-[clamp(2.2rem,5vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-bone"
            >
              {aboutContent.heading}
            </h2>

            {/* Paragraph */}
            <p
              data-about="reveal"
              className="text-lg md:text-xl leading-relaxed text-bone/75 max-w-2xl font-sans"
            >
              {aboutContent.paragraph}
            </p>

            {/* Stats Metrics Grid */}
            <dl
              data-about="reveal"
              className="border-y border-bone/10 py-8 grid grid-cols-3 gap-4 md:gap-6"
            >
              {aboutContent.stats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1">
                  <dd className="text-4xl md:text-6xl font-bold text-bone flex items-baseline">
                    <span data-stat-target={stat.value}>0</span>
                    {stat.suffix && (
                      <span className="text-signal">{stat.suffix}</span>
                    )}
                  </dd>
                  <dt className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-dim">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>

            {/* Skill Modules */}
            <div
              data-about="reveal"
              className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-bone/10 border border-bone/10"
            >
              {skillGroups.map((group, index) => (
                <div
                  key={group.title}
                  className="bg-ink p-6 hover:bg-panel transition-colors flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal font-semibold">
                      {group.title}
                    </span>
                    <span className="font-mono text-xs text-dim">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((skill) => (
                      <span
                        key={skill}
                        className="border border-bone/15 px-2.5 py-1 font-mono text-xs text-bone/80 bg-bone/[0.02]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

