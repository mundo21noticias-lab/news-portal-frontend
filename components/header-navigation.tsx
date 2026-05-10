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
        <ul className="hidden lg:flex items-center justify-center gap-2 py-3 overflow-x-auto">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/category/${category.slug}`}
                className="px-5 py-2.5 text-base font-bold uppercase tracking-wider text-foreground hover:text-primary transition-all duration-300 rounded-md hover:bg-primary/10"
              >
                {category.name}
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
