'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Newspaper } from 'lucide-react';
import { NewsCard, NewsCardSkeleton } from '@/components/news-card';
import { NewsArticle } from '@/lib/types';

interface LatestNewsProps {
  initialArticles: NewsArticle[];
}

export function LatestNews({ initialArticles }: LatestNewsProps) {
  const [articles, setArticles] = useState(initialArticles);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(initialArticles.length);
  const loaderRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const response = await fetch(
        `/api/articles?pageSize=9&offset=${offset}`,
        { method: 'GET' }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }

      const data = await response.json();
      const newArticles = data.articles || [];

      if (newArticles.length > 0) {
        // Filter out duplicates
        const existingIds = new Set(articles.map(a => a.id));
        const uniqueNewArticles = newArticles.filter(
          (a: NewsArticle) => !existingIds.has(a.id)
        );

        if (uniqueNewArticles.length > 0) {
          setArticles(prev => [...prev, ...uniqueNewArticles]);
          setOffset(prev => prev + uniqueNewArticles.length);
          setHasMore(data.hasMore !== false);
        } else {
          // Todos son duplicados, no hay más reales para mostrar
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more articles:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, offset, articles]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { rootMargin: '200px' }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore, hasMore, loading]);

  return (
    <section className="py-8 lg:py-12" spellCheck="false">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-primary rounded-lg">
            <Newspaper className="h-5 w-5 text-primary-foreground" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-foreground">
            Últimas Noticias
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {articles.map((article, index) => (
            <NewsCard
              key={article.id}
              article={article}
              priority={index < 3}
            />
          ))}
        </div>

        {/* Infinite scroll loader */}
        <div ref={loaderRef} className="mt-8">
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[1, 2, 3].map((i) => (
                <NewsCardSkeleton key={i} />
              ))}
            </div>
          )}
        </div>

        {!hasMore && articles.length > 0 && (
          <p className="text-center text-muted-foreground mt-8">
            Has visto todas las noticias recientes
          </p>
        )}
      </div>
    </section>
  );
}
