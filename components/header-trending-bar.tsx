'use client';

import { memo } from 'react';
import Link from 'next/link';
import { Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FirebaseCategory } from '@/lib/firebase-service';
import styles from './header-trending-bar.module.css';

interface HeaderTrendingBarProps {
  categories: FirebaseCategory[];
  currentDate: string;
  isScrollingDown: boolean;
  onSearchClick: () => void;
}

function HeaderTrendingBarComponent({
  categories,
  currentDate,
  isScrollingDown,
  onSearchClick,
}: HeaderTrendingBarProps) {
  const trendingTopics = categories.slice(0, 3).map(cat => cat.name);

  return (
    <div
      className={`border-b border-border bg-muted/50 ${
        isScrollingDown ? styles.hidden : styles.visible
      }`}
    >
      <div className="container mx-auto px-4 py-2">
        <div className="hidden md:flex items-center justify-center gap-6">
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">Hoy interesa:</span>
            <div className="flex items-center gap-2">
              {trendingTopics.map((topic, i) => (
                <span key={topic}>
                  <Link
                    href={`/category/${topic?.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-secondary hover:text-secondary/80 transition-colors"
                  >
                    {topic}
                  </Link>
                  {i < 2 && <span className="text-muted-foreground ml-2">•</span>}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onSearchClick}
              aria-label="Search"
              className="h-8 w-8"
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="User account"
              className="h-8 w-8"
            >
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="md:hidden flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{currentDate}</span>
        </div>
      </div>
    </div>
  );
}

export const HeaderTrendingBar = memo(HeaderTrendingBarComponent);
