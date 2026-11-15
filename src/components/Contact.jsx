import { useEffect, useRef, useState } from 'react';
import { personalInfo, socialLinks, contactContent, emailjsConfig } from '../data/portfolioData';
import ScrambleText from './ScrambleText';

/**
 * Contact component - Terminal-inspired message dispatcher with direct contact info,
 * social links, dynamic mailto fallback, and EmailJS integration.
 */
export default function Contact() {
  const formRef = useRef(null);
  const timeoutRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null

  // Extract recipient first name for the terminal command line
  const firstName = (personalInfo.name || 'ankita').trim().split(/\s+/)[0].toLowerCase();

  // Filter available social links
  const activeSocials = [
    { label: 'GitHub', url: socialLinks.github },
    { label: 'LinkedIn', url: socialLinks.linkedin },
    { label: 'Instagram', url: socialLinks.instagram },
  ].filter((item) => Boolean(item.url && item.url.trim()));

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const formData = new FormData(e.currentTarget);
    const userName = formData.get('user_name')?.toString() || '';
    const userEmail = formData.get('user_email')?.toString() || '';
    const message = formData.get('message')?.toString() || '';

    // Check if EmailJS environment variables or keys are fully configured
    const isConfigured = Boolean(
      emailjsConfig.serviceId &&
      emailjsConfig.templateId &&
      emailjsConfig.publicKey &&
      emailjsConfig.serviceId !== 'YOUR_EMAILJS_SERVICE_ID' &&
      emailjsConfig.templateId !== 'YOUR_EMAILJS_TEMPLATE_ID' &&
      emailjsConfig.publicKey !== 'YOUR_EMAILJS_PUBLIC_KEY'
    );

    if (!isConfigured) {
      // Fallback: Launch pre-filled email client in a new tab/window
      const body = `Name: ${userName}\nEmail: ${userEmail}\n\nMessage:\n${message}`;
      const mailtoUrl = `mailto:${personalInfo.email}?subject=${encodeURIComponent(
        'Portfolio contact'
      )}&body=${encodeURIComponent(body)}`;

      window.open(mailtoUrl, '_blank');
      setStatus('success');
      formRef.current?.reset();

      timeoutRef.current = setTimeout(() => {
        setStatus(null);
      }, 4000);
      return;
    }

    // EmailJS transmission
    setIsSubmitting(true);
    try {
      const emailjs = await import('@emailjs/browser');
      await emailjs.sendForm(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        formRef.current,
        emailjsConfig.publicKey
      );
      setStatus('success');
      formRef.current?.reset();
    } catch (err) {
      console.error('Email transmission error:', err);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
      timeoutRef.current = setTimeout(() => {
        setStatus(null);
      }, 4000);
    }
  };

  return (
    <section
      id="contact"
      className="hud-grid px-5 md:px-10 py-28 md:py-40"
    >
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">
        {/* Left Column: Direct Inquiries & Channels */}
        <div className="flex flex-col gap-6 md:gap-8">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-signal font-semibold">
            <ScrambleText text={contactContent.label} trigger="view" />
          </div>

          <h2 className="text-[clamp(2.6rem,7vw,6rem)] font-bold leading-[0.95] tracking-[-0.04em] text-bone">
            {contactContent.heading}
          </h2>

          <p className="text-lg text-bone/70 max-w-md font-sans leading-relaxed">
            {contactContent.note}
          </p>

          {/* Email Channel */}
          <div className="pt-2 flex flex-col gap-3">
            <a
              href={`mailto:${personalInfo.email}`}
              className="font-mono text-lg md:text-2xl underline decoration-signal decoration-2 underline-offset-8 text-bone hover:text-signal transition-colors break-all"
            >
              {personalInfo.email}
            </a>

            {personalInfo.phone && (
              <a
                href={`tel:${personalInfo.phone}`}
                className="font-mono text-sm text-dim hover:text-bone transition-colors"
              >
                {personalInfo.phone}
              </a>
            )}
          </div>

          {/* Social Links */}
          {activeSocials.length > 0 && (
            <div className="flex flex-wrap gap-6 pt-4 border-t border-bone/10">
              {activeSocials.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs uppercase tracking-[0.2em] text-bone/70 hover:text-signal transition-colors inline-flex items-center gap-1"
                >
                  <span>{social.label}</span>
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Terminal-Style Dispatch Form */}
        <div className="hud-frame border border-bone/10 bg-ink/70 backdrop-blur p-6 md:p-10 flex flex-col gap-6 relative">
          {/* Terminal Command Header */}
          <div className="font-mono text-xs text-dim flex items-center gap-2 pb-2 border-b border-bone/10">
            <span className="text-signal font-bold" aria-hidden="true">
              $
            </span>
            <span>new message --to {firstName}</span>
          </div>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
            noValidate={false}
          >
            {/* Field: Name */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="user_name"
                className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal font-semibold"
              >
                &gt; name
              </label>
              <input
                id="user_name"
                name="user_name"
                type="text"
                required
                placeholder="Your full name"
                className="w-full bg-transparent border-0 border-b border-bone/20 focus:border-signal text-bone placeholder:text-dim/50 font-mono text-sm py-2 px-0 focus:outline-none transition-colors rounded-none"
              />
            </div>

            {/* Field: Email */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="user_email"
                className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal font-semibold"
              >
                &gt; email
              </label>
              <input
                id="user_email"
                name="user_email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full bg-transparent border-0 border-b border-bone/20 focus:border-signal text-bone placeholder:text-dim/50 font-mono text-sm py-2 px-0 focus:outline-none transition-colors rounded-none"
              />
            </div>

            {/* Field: Message */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="message"
                className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal font-semibold"
              >
                &gt; message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="Tell me about the role or project…"
                className="w-full bg-transparent border-0 border-b border-bone/20 focus:border-signal text-bone placeholder:text-dim/50 font-mono text-sm py-2 px-0 focus:outline-none transition-colors resize-none rounded-none"
              />
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-signal text-ink hover:bg-bone font-mono text-xs font-semibold uppercase tracking-[0.25em] px-6 py-4 flex items-center justify-between transition-colors disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
            >
              <span>{isSubmitting ? 'Sending…' : 'Send message'}</span>
              <span
                className="transition-transform group-hover:translate-x-1.5"
                aria-hidden="true"
              >
                →
              </span>
            </button>

            {/* Feedback Status Line */}
            <p role="status" className="font-mono text-xs min-h-[1.25rem]">
              {status === 'success' && (
                <span className="text-emerald-400">
                  ✓ Message sent. Talk soon.
                </span>
              )}
              {status === 'error' && (
                <span className="text-red-400">
                  ✕ Something went wrong. Please try again.
                </span>
              )}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

