import { useState, useEffect } from 'react';

export function useScrollDirection() {
  const [isScrollingDown, setIsScrollingDown] = useState(false);

  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    let ticking = false;

    const updateScrollDir = () => {
      const scrollY = window.pageYOffset;

      // Ignore small scroll movements to prevent fluttering
      if (Math.abs(scrollY - lastScrollY) < 15) {
        ticking = false;
        return;
      }

      // Always show header at the very top
      if (scrollY < 150) {
        setIsScrollingDown(false);
      } else {
        setIsScrollingDown(scrollY > lastScrollY);
      }
      
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return isScrollingDown;
}
