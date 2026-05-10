'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { NewsArticle, formatRelativeTime } from '@/lib/types';
import { FALLBACK_IMAGE_URL } from '@/lib/constants';

interface NewsCardProps {
  article: NewsArticle;
  variant?: 'default' | 'compact' | 'horizontal';
  priority?: boolean;
}

function NewsCardSkeleton({ variant = 'default' }: { variant?: 'default' | 'compact' | 'horizontal' }) {
  if (variant === 'horizontal') {
    return (
      <div className="flex gap-4 animate-pulse">
        <div className="w-24 h-24 bg-muted rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-16 bg-muted rounded" />
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-3/4" />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-pulse">
      <div className={`bg-muted rounded-lg ${variant === 'compact' ? 'h-40' : 'h-48'}`} />
      <div className="mt-3 space-y-2">
        <div className="h-3 w-20 bg-muted rounded" />
        <div className="h-5 bg-muted rounded w-full" />
        <div className="h-5 bg-muted rounded w-4/5" />
        {variant !== 'compact' && <div className="h-4 bg-muted rounded w-full" />}
      </div>
    </div>
  );
}

export function NewsCard({ article, variant = 'default', priority = false }: NewsCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasError, setHasError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Usar imagen fallback centralizada si no hay imagen
  const imageUrl = article.imageUrl || FALLBACK_IMAGE_URL;

  useEffect(() => {
    if (priority) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  if (!isVisible) {
    return (
      <div ref={cardRef}>
        <NewsCardSkeleton variant={variant} />
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <article ref={cardRef} className="group">
        <Link href={`/articles/${article.slug || 'not-found'}`} className="flex gap-4">
          <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
            {!isLoaded && !hasError && <div className="absolute inset-0 bg-muted animate-pulse" />}
            {!hasError ? (
              <Image
                src={imageUrl}
                alt={article.title}
                fill
                className={`object-cover transition-all duration-300 group-hover:scale-105 ${isLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                onLoad={() => setIsLoaded(true)}
                onError={() => setHasError(true)}
                sizes="96px"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
                <span className="text-xs text-muted-foreground">Sin imagen</span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-semibold uppercase tracking-wide text-primary">
              {article.category}
            </span>
            <h3 className="mt-1 text-sm font-semibold leading-tight text-foreground group-hover:text-secondary transition-colors line-clamp-2">
              {article.title}
            </h3>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{formatRelativeTime(article.publishedAt)}</span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article ref={cardRef} className="group">
      <Link href={`/articles/${article.slug || 'not-found'}`} className="block">
        <div className={`relative rounded-lg overflow-hidden bg-muted ${variant === 'compact' ? 'h-40' : 'h-48'}`}>
          {!isLoaded && !hasError && <div className="absolute inset-0 bg-muted animate-pulse" />}
          {!hasError ? (
            <Image
              src={imageUrl}
              alt={article.title}
              fill
              className={`object-cover transition-all duration-500 group-hover:scale-105 ${isLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              onLoad={() => setIsLoaded(true)}
              onError={() => setHasError(true)}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={priority}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
              <span className="text-sm text-muted-foreground">Sin imagen disponible</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="mt-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-primary">
            {article.category}
          </span>
          <h3 className={`mt-1 font-serif font-semibold leading-tight text-foreground group-hover:text-secondary transition-colors ${variant === 'compact' ? 'text-base line-clamp-2' : 'text-lg line-clamp-3'
            }`}>
            {article.title}
          </h3>
          {variant !== 'compact' && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {article.summary}
            </p>
          )}
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span>{article.author}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{article.readTime} min</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

export { NewsCardSkeleton };
