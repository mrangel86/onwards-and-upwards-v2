import { useEffect, useRef } from 'react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * Traps keyboard focus inside the given container while isActive is true.
 * Restores focus to the previously-focused element when isActive becomes false.
 */
export function useFocusTrap(containerRef: React.RefObject<HTMLElement>, isActive: boolean) {
  const prevFocusRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    prevFocusRef.current = document.activeElement;
    const focusable = containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
    focusable[0]?.focus();

    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !containerRef.current) return;
      const els = Array.from(containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', trap);
    return () => {
      document.removeEventListener('keydown', trap);
      (prevFocusRef.current as HTMLElement | null)?.focus();
    };
  }, [isActive, containerRef]);
}
