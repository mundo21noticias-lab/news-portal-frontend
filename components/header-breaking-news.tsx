'use client';

import { memo } from 'react';
import { NewsArticle } from '@/lib/types';
import { BreakingNewsTicker } from '@/components/breaking-news-ticker';
import styles from './header-breaking-news.module.css';

interface HeaderBreakingNewsProps {
  articles: NewsArticle[];
  isScrollingDown: boolean;
}

function HeaderBreakingNewsComponent({
  articles,
  isScrollingDown,
}: HeaderBreakingNewsProps) {
  if (articles.length === 0) return null;

  return (
    <div
      className={`flex justify-center ${isScrollingDown ? styles.hidden : styles.visible}`}
    >
      <BreakingNewsTicker articles={articles} />
    </div>
  );
}

export const HeaderBreakingNews = memo(HeaderBreakingNewsComponent);
