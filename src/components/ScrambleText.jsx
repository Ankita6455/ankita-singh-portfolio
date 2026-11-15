import { useEffect, useRef, useState } from 'react';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/';

/**
 * ScrambleText component - creates a cinematic "decode" effect from random technical glyphs
 * into real text, while keeping full accessibility for screen readers.
 */
export default function ScrambleText({
  text = '',
  as: Tag = 'span',
  className = '',
  delay = 0,
  speed = 30,
  trigger = 'view',
}) {
  const [display, setDisplay] = useState(text);
  const elementRef = useRef(null);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    // If reduced motion is preferred, keep static text without animations
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    let intervalId = null;
    let delayTimeoutId = null;
    let observer = null;

    const startScramble = () => {
      if (hasPlayedRef.current) return;
      hasPlayedRef.current = true;

      delayTimeoutId = setTimeout(() => {
        let frame = 0;
        const totalChars = text.length;

        intervalId = setInterval(() => {
          frame += 1;
          const lockedCount = Math.floor(frame / 2);

          let output = '';
          for (let i = 0; i < totalChars; i++) {
            if (i < lockedCount) {
              output += text[i];
            } else if (text[i] === ' ') {
              output += ' ';
            } else {
              const randomIndex = Math.floor(Math.random() * GLYPHS.length);
              output += GLYPHS[randomIndex];
            }
          }

          setDisplay(output);

          if (lockedCount >= totalChars) {
            clearInterval(intervalId);
            setDisplay(text);
          }
        }, speed);
      }, delay);
    };

    if (trigger === 'mount') {
      startScramble();
    } else {
      const node = elementRef.current;
      if (node && 'IntersectionObserver' in window) {
        observer = new IntersectionObserver(
          (entries) => {
            const [entry] = entries;
            if (entry.isIntersecting) {
              startScramble();
              observer.disconnect();
            }
          },
          { threshold: 0.4 }
        );
        observer.observe(node);
      } else {
        startScramble();
      }
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (delayTimeoutId) clearTimeout(delayTimeoutId);
      if (observer) observer.disconnect();
    };
  }, [text, delay, speed, trigger]);

  return (
    <Tag ref={elementRef} className={className} aria-label={text}>
      <span aria-hidden="true">{display}</span>
    </Tag>
  );
}
