'use client';

import { memo } from 'react';
import Link from 'next/link';
import { FirebaseCategory } from '@/lib/firebase-service';
import { Button } from '@/components/ui/button';
import styles from './header-navigation.module.css';

interface HeaderNavigationProps {
  categories: FirebaseCategory[];
  isScrollingDown: boolean;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
}

function HeaderNavigationComponent({
  categories,
  isScrollingDown,
  isMenuOpen,
  onMenuToggle,
}: HeaderNavigationProps) {
  return (
    <nav
      className={`border-t border-border bg-card ${
        isScrollingDown ? styles.hidden : styles.visible
      }`}
    >
      <div className="container mx-auto px-4">
        {/* Desktop navigation */}
        <ul className="hidden lg:flex items-center justify-center flex-wrap gap-x-1 gap-y-2 py-2">
          {categories.map((category) => (
            <li key={category.id} className="flex-shrink-0">
              <Link
                href={`/category/${category.slug}`}
                className="relative px-4 py-2 text-[13px] font-bold uppercase tracking-[0.1em] text-foreground/80 hover:text-primary transition-all duration-300 whitespace-nowrap group"
              >
                {category.name}
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <ul className="flex flex-col gap-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="block px-5 py-3 text-lg font-bold uppercase tracking-wider text-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-all duration-300"
                    onClick={onMenuToggle}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-4 border-t border-border px-4">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Suscríbete
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export const HeaderNavigation = memo(HeaderNavigationComponent);
