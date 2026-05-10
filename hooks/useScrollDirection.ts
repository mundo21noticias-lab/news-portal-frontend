import { useState, useEffect, useRef } from 'react';

export function useScrollDirection() {
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDifference = currentScrollY - lastScrollYRef.current;

      // Con cualquier scroll hacia abajo se oculta (incluso 1px)
      // Solo reaparece al scroll hacia arriba
      if (scrollDifference > 0 && currentScrollY > 0) {
        setIsScrollingDown(true);
      } else if (currentScrollY === 0) {
        setIsScrollingDown(false);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return isScrollingDown;
}
