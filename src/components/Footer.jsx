import { personalInfo, socialLinks, navLinks, footerContent, academy } from '../data/portfolioData';

// Hoist date evaluation outside component render for compiler purity
const CURRENT_YEAR = new Date().getFullYear();

/**
 * Footer component - Renders site navigation, external links, brand watermark,
 * and academic attribution in a clean technical HUD layout.
 */
export default function Footer() {
  // Filter available social platforms
  const activeSocials = [
    { label: 'GitHub', url: socialLinks.github },
    { label: 'LinkedIn', url: socialLinks.linkedin },
    { label: 'Instagram', url: socialLinks.instagram },
  ].filter((item) => Boolean(item.url && item.url.trim()));

  return (
    <footer className="w-full overflow-hidden border-t border-bone/10 px-5 md:px-10 pt-16 pb-8">
      <div className="max-w-[1440px] mx-auto flex flex-col justify-between">
        {/* Three-Column Directory */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-14">
          {/* Column 1: Navigation */}
          <div className="flex flex-col">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal font-semibold mb-4">
              Navigate
            </span>
            <ul className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-sans text-sm text-bone/75 hover:text-signal transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: External Links */}
          <div className="flex flex-col">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal font-semibold mb-4">
              Elsewhere
            </span>
            <ul className="flex flex-col gap-2.5">
              {activeSocials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-sm text-bone/75 hover:text-signal transition-colors inline-flex items-center gap-1"
                  >
                    <span>{social.label}</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact & Location */}
          <div className="flex flex-col md:items-end">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal font-semibold mb-4">
              Say hello
            </span>
            <div className="flex flex-col gap-2 md:items-end">
              <a
                href={`mailto:${personalInfo.email}`}
                className="font-mono text-sm text-bone/75 hover:text-signal transition-colors break-all"
              >
                {personalInfo.email}
              </a>
              <span className="font-mono text-xs text-dim tracking-wider uppercase">
                {personalInfo.city}
              </span>
            </div>
          </div>
        </div>

        {/* Faint Brand Watermark */}
        <div
          aria-hidden="true"
          className="w-full text-center uppercase whitespace-nowrap text-[13.5vw] font-bold leading-none tracking-[-0.05em] text-bone/[0.07] select-none pointer-events-none py-6"
        >
          {personalInfo.brandName}
        </div>

        {/* Bottom Metadata & TAP Academy Credit Row */}
        <div className="border-t border-bone/10 pt-6 font-mono text-[11px] uppercase tracking-[0.15em] text-dim flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            © {CURRENT_YEAR} {personalInfo.name} · {footerContent.tagline}
          </div>
          <div>
            Trained at{' '}
            <a
              href={academy.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-signal transition-colors"
            >
              {academy.name}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
