import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { useLocation } from 'react-router-dom';

interface LenisProviderProps {
  children: React.ReactNode;
}

export function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const location = useLocation();
  const [isEnabled, setIsEnabled] = useState(true);

  // We disable Lenis entirely on digital twin canvas since it handles its own 3D scene controls
  useEffect(() => {
    const disablePaths = ['/digital-twin'];
    const shouldDisable = disablePaths.some(path => location.pathname.startsWith(path));
    
    // Also respect user accessibility preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    setIsEnabled(!shouldDisable && !prefersReducedMotion);
  }, [location.pathname]);

  useEffect(() => {
    if (!isEnabled) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [isEnabled]);

  // Ensure scroll top on route change if enabled
  useEffect(() => {
    if (isEnabled && lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [location.pathname, isEnabled]);

  return <>{children}</>;
}
