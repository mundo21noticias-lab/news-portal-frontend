'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, TrendingUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NewsArticle, formatRelativeTime } from '@/lib/types';

interface TrendingSectionProps {
  articles: NewsArticle[];
}

export function TrendingSection({ articles }: TrendingSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener('scroll', checkScroll);
      return () => ref.removeEventListener('scroll', checkScroll);
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-8 lg:py-12 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary rounded-lg">
              <TrendingUp className="h-5 w-5 text-secondary-foreground" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Tendencias
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="rounded-full"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="rounded-full"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 -mx-4 px-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {articles.map((article, index) => (
            <article
              key={article.id}
              className="group flex-shrink-0 w-72 snap-start"
            >
              <Link href={`/articles/${article.slug || '#'}`} className="block">
                <div className="relative h-44 rounded-xl overflow-hidden">
                  {!loadedImages[article.id] && (
                    <div className="absolute inset-0 bg-muted animate-pulse" />
                  )}
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    className={`object-cover transition-all duration-500 group-hover:scale-105 ${loadedImages[article.id] ? 'opacity-100' : 'opacity-0'
                      }`}
                    onLoad={() => setLoadedImages(prev => ({ ...prev, [article.id]: true }))}
                    sizes="288px"
                    priority={index < 3}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Trend number */}
                  <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-foreground">
                      {index + 1}
                    </span>
                  </div>

                  {/* Category badge */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 bg-secondary/90 text-secondary-foreground text-xs font-semibold rounded-full">
                      {article.category}
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <h3 className="font-serif text-base font-semibold leading-tight text-foreground group-hover:text-secondary transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatRelativeTime(article.publishedAt)}</span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
