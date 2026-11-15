import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { projects } from '../data/portfolioData';
import ScrambleText from './ScrambleText';

// Resolve project cover assets from src/assets/projects/
const projectImageModules = import.meta.glob('../assets/projects/*.(png|jpg|jpeg|webp|svg)', {
  eager: true,
  import: 'default',
});

function getProjectImage(projectId) {
  for (const path in projectImageModules) {
    const filename = path.split('/').pop().split('.')[0];
    if (filename === projectId) {
      return projectImageModules[path];
    }
  }
  return null;
}

/**
 * ProjectCard component - Displays a project with cover image, tags, and action links.
 */
function ProjectCard({ project }) {
  const coverSrc = getProjectImage(project.id);

  return (
    <article
      data-cursor="hot"
      className="border border-bone/10 bg-panel/60 w-full md:w-[min(560px,42vw)] shrink-0 group flex flex-col justify-between transition-colors hover:border-bone/25"
    >
      {/* Cover Area */}
      <div className="aspect-[16/10] md:aspect-[16/8] border-b border-bone/10 bg-ink overflow-hidden relative">
        {coverSrc ? (
          <img
            src={coverSrc}
            alt={project.title}
            className="grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-[1.04] transition-all duration-700 ease-out object-cover w-full h-full"
          />
        ) : (
          <div className="hud-grid w-full h-full flex items-center justify-center font-mono text-xs uppercase tracking-[0.25em] text-dim">
            {project.id}
          </div>
        )}

        {/* Top-Left Technical Badge */}
        <div className="absolute top-3 left-3 bg-ink/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-signal border border-bone/10">
          {project.number} / {project.year}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-6 md:p-8 flex flex-col justify-between flex-1 gap-6">
        <div className="flex flex-col gap-3">
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-bone group-hover:text-signal transition-colors">
            {project.title}
          </h3>
          <p className="text-sm md:text-base text-bone/70 leading-relaxed font-sans">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2.5 pt-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[11px] uppercase tracking-[0.15em] text-dim"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Project Links */}
        <div className="flex items-center gap-3 pt-4 border-t border-bone/10">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-signal text-ink hover:bg-bone font-mono text-[11px] font-semibold uppercase tracking-[0.2em] px-4 py-2.5 transition-colors inline-flex items-center gap-1"
            >
              <span>Live</span>
              <span aria-hidden="true">↗</span>
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-bone/30 text-bone hover:border-signal hover:text-signal font-mono text-[11px] font-semibold uppercase tracking-[0.2em] px-4 py-2.5 transition-colors inline-flex items-center gap-1"
            >
              <span>Code</span>
              <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/**
 * Projects component - Horizontal pinned scroll showcase for desktop viewports,
 * reflowing to clean vertical cards on mobile devices.
 */
export default function Projects() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    // Desktop horizontal pinned scroll trigger
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const track = trackRef.current;
      const section = sectionRef.current;
      const progressLine = progressRef.current;
      if (!track || !section) return;

      const getDistance = () => track.scrollWidth - window.innerWidth + 80;

      gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getDistance()}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressLine) {
              gsap.set(progressLine, { scaleX: self.progress });
            }
          },
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="w-full overflow-hidden py-24 md:py-0 md:h-screen md:flex md:flex-col md:justify-center relative"
    >
      {/* Header Row */}
      <div className="max-w-[1440px] w-full mx-auto px-5 md:px-10 mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-signal mb-2">
            <ScrambleText text="02 / Selected work" trigger="view" />
          </div>
          <h2 className="text-[clamp(2.4rem,6vw,5.5rem)] font-bold leading-none tracking-[-0.03em] text-bone">
            Projects
          </h2>
        </div>
        <div className="hidden md:block font-mono text-xs text-dim uppercase tracking-[0.2em]">
          {projects.length} projects · scroll →
        </div>
      </div>

      {/* Cards Track: horizontal row on desktop, vertical column on mobile */}
      <div className="w-full overflow-visible">
        <div
          ref={trackRef}
          className="flex flex-col gap-6 px-5 md:flex-row md:w-max md:gap-8 md:px-10"
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      {/* Progress Line Indicator (Desktop only) */}
      <div
        className="hidden md:block max-w-[1440px] w-full mx-auto px-5 md:px-10 mt-8"
        aria-hidden="true"
      >
        <div className="h-[2px] w-full bg-bone/10 relative overflow-hidden">
          <div
            ref={progressRef}
            className="h-full bg-signal w-full origin-left scale-x-0"
          />
        </div>
      </div>
    </section>
  );
}

