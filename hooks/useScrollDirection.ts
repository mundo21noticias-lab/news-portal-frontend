import { useState, useEffect } from 'react';

export function useScrollDirection() {
  const [isScrollingDown, setIsScrollingDown] = useState(false);

  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    let ticking = false;

    const updateScrollDir = () => {
      const scrollY = window.pageYOffset;

      // Ignore small movements (threshold 30px) to prevent fluttering
      if (Math.abs(scrollY - lastScrollY) < 30) {
        ticking = false;
        return;
      }

      // Always show header at the very top (first 200px)
      if (scrollY < 200) {
        setIsScrollingDown(false);
      } else {
        // Only set scrolling down if we actually moved significantly
        const scrollingDown = scrollY > lastScrollY;
        setIsScrollingDown(scrollingDown);
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

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return isScrollingDown;
}
