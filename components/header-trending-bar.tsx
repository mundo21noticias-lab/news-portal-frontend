'use client';

import { memo } from 'react';
import Link from 'next/link';
import { Search, User, Mail, CloudSun } from 'lucide-react';
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
  const trendingTopics = categories.slice(0, 5).map(cat => cat.name);

  return (
    <div
      className={`border-b border-border bg-card ${
        isScrollingDown ? styles.hidden : styles.visible
      }`}
    >
      <div className="container mx-auto px-4 py-1.5">
        <div className="hidden lg:flex items-center justify-between text-xs font-medium">
          {/* Left: Weather */}
          <div className="flex items-center gap-2 text-muted-foreground w-1/4">
            <span>Santo Domingo 28°C / 31°C</span>
            <CloudSun className="h-4 w-4 text-primary" />
          </div>

          {/* Center: Trending */}
          <div className="flex items-center justify-center gap-3 flex-1">
            <span className="font-bold text-foreground">Hoy interesa</span>
            <span className="text-muted-foreground/30">•</span>
            <div className="flex items-center gap-3">
              {trendingTopics.map((topic, i) => (
                <span key={topic} className="flex items-center gap-3">
                  <Link
                    href={`/category/${topic?.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {topic}
                  </Link>
                  {i < trendingTopics.length - 1 && <span className="text-muted-foreground/30">•</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center justify-end gap-1 w-1/4">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Newsletter"
              className="h-8 w-8 text-foreground hover:bg-primary/10 hover:text-primary"
            >
              <Mail className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onSearchClick}
              aria-label="Search"
              className="h-8 w-8 text-foreground hover:bg-primary/10 hover:text-primary"
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="User account"
              className="h-8 w-8 text-foreground hover:bg-primary/10 hover:text-primary"
            >
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden flex items-center justify-between text-xs py-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CloudSun className="h-3 w-3 text-primary" />
            <span>28°C</span>
          </div>
          <span className="text-muted-foreground">{currentDate}</span>
        </div>
      </div>
    </div>
  );
}

export const HeaderTrendingBar = memo(HeaderTrendingBarComponent);
