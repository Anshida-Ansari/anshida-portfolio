import { useEffect } from 'react';

/**
 * Scroll reveal that triggers entrance animations without ever hiding content.
 */
export function useScrollReveal(rootMargin = '60px 0px 60px 0px') {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const elements = Array.from(document.querySelectorAll('.reveal'));
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animating');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin, threshold: 0.05 }
    );

    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [rootMargin]);
}

export default useScrollReveal;
