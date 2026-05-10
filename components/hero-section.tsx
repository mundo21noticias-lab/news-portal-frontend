'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NewsArticle, formatRelativeTime } from '@/lib/types';

interface HeroSectionProps {
  featuredArticle: NewsArticle;
  sideArticles: NewsArticle[];
}

export function HeroSection({ featuredArticle, sideArticles }: HeroSectionProps) {
  const [mainImageLoaded, setMainImageLoaded] = useState(false);
  const [sideImagesLoaded, setSideImagesLoaded] = useState<Record<string, boolean>>({});

  return (
    <section className="py-8 lg:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Featured Article */}
          <div className="lg:col-span-2">
            <article className="group relative bg-primary rounded-xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Content */}
                <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-center order-2 md:order-1">
                  <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary-foreground/80 mb-3">
                    {featuredArticle.category}
                  </span>
                  <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-primary-foreground text-balance">
                    {featuredArticle.title}
                  </h2>
                  <p className="mt-4 text-primary-foreground/90 leading-relaxed line-clamp-3">
                    {featuredArticle.summary}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-sm text-primary-foreground/80">
                    <span>{featuredArticle.author}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatRelativeTime(featuredArticle.publishedAt)}</span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button
                      asChild
                      className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 group/btn"
                    >
                      <Link href={`/articles/${featuredArticle.slug || '#'}`}>
                        Leer más
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Image */}
                <div className="relative h-64 md:h-auto min-h-[300px] order-1 md:order-2">
                  {!mainImageLoaded && (
                    <div className="absolute inset-0 bg-primary/50 animate-pulse" />
                  )}
                  <Image
                    src={featuredArticle.imageUrl}
                    alt={featuredArticle.title}
                    fill
                    className={`object-cover object-top transition-opacity duration-300 ${mainImageLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                    onLoad={() => setMainImageLoaded(true)}
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent md:from-transparent" />
                </div>
              </div>
            </article>
          </div>

          {/* Side Articles */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-foreground border-b-2 border-primary pb-2">
              Lo más reciente
            </h3>
            <div className="space-y-4">
              {sideArticles.map((article) => (
                <article key={article.id} className="group">
                  <Link href={`/articles/${article.slug || '#'}`} className="flex gap-4">
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                      {!sideImagesLoaded[article.id] && (
                        <div className="absolute inset-0 bg-muted animate-pulse" />
                      )}
                      <Image
                        src={article.imageUrl}
                        alt={article.title}
                        fill
                        className={`object-cover object-top transition-all duration-300 group-hover:scale-105 ${sideImagesLoaded[article.id] ? 'opacity-100' : 'opacity-0'
                          }`}
                        onLoad={() => setSideImagesLoaded(prev => ({ ...prev, [article.id]: true }))}
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                        {article.category}
                      </span>
                      <h4 className="mt-1 text-sm font-semibold leading-tight text-foreground group-hover:text-secondary transition-colors line-clamp-2">
                        {article.title}
                      </h4>
                      <span className="mt-1 text-xs text-muted-foreground">
                        {formatRelativeTime(article.publishedAt)}
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
