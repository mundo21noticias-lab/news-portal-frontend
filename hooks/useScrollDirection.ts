import { useState, useEffect, useRef } from 'react';

export function useScrollDirection() {
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDifference = currentScrollY - lastScrollYRef.current;

      if (Math.abs(scrollDifference) < 10) return;

      // Para evitar el "flicker" (parpadeo) infinito por el cambio de altura del sticky header:
      // Solo encogemos si pasamos de 200px hacia abajo.
      // Y solo lo volvemos a expandir si llegamos casi arriba del todo (<= 50px).
      if (scrollDifference > 0 && currentScrollY > 200) {
        setIsScrollingDown(true);
      } else if (currentScrollY <= 50) {
        setIsScrollingDown(false);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return isScrollingDown;
}
