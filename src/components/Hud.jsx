import { useEffect, useState } from 'react';
import { personalInfo, navLinks, heroContent } from '../data/portfolioData';

/**
 * Extracts up to two initials from a brand or person name.
 */
function getInitials(name) {
  if (!name) return 'AS';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Formats current time in 24-hour HH:MM:SS for a given IANA timezone.
 */
function formatTime(timezone) {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: timezone || 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(new Date());
  } catch {
    return new Date().toLocaleTimeString();
  }
}

/**
 * Hud component - Fixed top navigation bar with live status, clock, and responsive menu.
 */
export default function Hud() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);
  const [time, setTime] = useState(() => formatTime(personalInfo.timezone));

  const statusLines = heroContent?.statusLines || [];

  // Track window scroll to toggle background blur and border
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Cycle status line every 3.5 seconds
  useEffect(() => {
    if (statusLines.length <= 1) return;

    const statusInterval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % statusLines.length);
    }, 3500);

    return () => clearInterval(statusInterval);
  }, [statusLines.length]);

  // Update live clock every second
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setTime(formatTime(personalInfo.timezone));
    }, 1000);

    return () => clearInterval(clockInterval);
  }, []);

  const isHeaderActive = isScrolled || isMenuOpen;
  const currentStatus = statusLines[statusIndex] || '';

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-16 transition-colors duration-300 ${
        isHeaderActive
          ? 'bg-ink/80 backdrop-blur-md border-b border-bone/10'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 h-full flex items-center justify-between">
        {/* Left: Brand Initials Badge & Name */}
        <a
          href="#home"
          className="flex items-center gap-3 group"
          aria-label={`${personalInfo.brandName} - Home`}
        >
          <div className="w-8 h-8 flex items-center justify-center border border-signal font-mono text-xs font-semibold text-signal transition-transform group-hover:scale-105">
            {getInitials(personalInfo.brandName)}
          </div>
          <span className="hidden sm:inline-block font-mono text-xs uppercase tracking-[0.2em] text-bone group-hover:text-signal transition-colors">
            {personalInfo.brandName}
          </span>
        </a>

        {/* Centre (lg and up): Live Status Ticker */}
        {statusLines.length > 0 && (
          <div
            className="hidden lg:flex items-center gap-2.5"
            aria-live="polite"
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse"
              aria-hidden="true"
            />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-dim">
              {currentStatus}
            </span>
          </div>
        )}

        {/* Right (md and up): Navigation Links + Live Clock */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-6" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-xs uppercase tracking-[0.18em] text-bone/70 hover:text-signal transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div
            className="font-mono text-xs tabular-nums text-dim pl-4 border-l border-bone/10"
            title={personalInfo.timezone}
            aria-label={`Current time in ${personalInfo.timezone}: ${time}`}
          >
            {time}
          </div>
        </div>

        {/* Mobile (below md): Menu Toggle Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="md:hidden font-mono text-xs uppercase tracking-[0.18em] text-bone hover:text-signal focus:outline-none transition-colors"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav-panel"
        >
          {isMenuOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <nav
          id="mobile-nav-panel"
          className="absolute top-16 inset-x-0 bg-ink/95 backdrop-blur-lg border-b border-bone/10 px-6 py-6 flex flex-col md:hidden"
          aria-label="Mobile Navigation"
        >
          <div className="flex flex-col">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl font-semibold font-sans border-b border-bone/10 py-4 text-bone hover:text-signal transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="mt-6 pt-2 flex items-center justify-between font-mono text-xs text-dim uppercase tracking-[0.15em]">
            <span>{personalInfo.city}</span>
            <span className="tabular-nums" title={personalInfo.timezone}>
              {time}
            </span>
          </div>
        </nav>
      )}
    </header>
  );
}

