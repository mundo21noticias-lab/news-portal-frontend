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
        <ul className="hidden lg:flex items-center justify-center gap-1 py-2 overflow-x-auto">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/category/${category.slug}`}
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors rounded-md hover:bg-primary/10"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <ul className="flex flex-col gap-1">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="block px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                    onClick={onMenuToggle}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-border">
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
