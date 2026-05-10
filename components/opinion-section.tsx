'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MessageSquare, Clock, Quote } from 'lucide-react';
import { NewsArticle, formatDate } from '@/lib/types';

interface OpinionSectionProps {
  articles: NewsArticle[];
}

export function OpinionSection({ articles }: OpinionSectionProps) {
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  return (
    <section className="py-8 lg:py-12 bg-foreground text-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-primary rounded-lg">
            <MessageSquare className="h-5 w-5 text-primary-foreground" />
          </div>
          <h2 className="font-serif text-2xl font-bold">
            Opinión
          </h2>
        </div>

        {/* Articles grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {articles.map((article) => (
            <article key={article.id} className="group">
              <Link href={`/articles/${article.slug || '#'}`} className="block">
                <div className="relative p-6 rounded-xl bg-background/5 border border-background/10 hover:bg-background/10 transition-colors">
                  {/* Quote icon */}
                  <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/50" />

                  {/* Author image */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-primary">
                      {!loadedImages[article.id] && (
                        <div className="absolute inset-0 bg-background/20 animate-pulse" />
                      )}
                      <Image
                        src={article.imageUrl}
                        alt={article.author}
                        fill
                        className={`object-cover object-top transition-opacity duration-300 ${loadedImages[article.id] ? 'opacity-100' : 'opacity-0'
                          }`}
                        onLoad={() => setLoadedImages(prev => ({ ...prev, [article.id]: true }))}
                        sizes="56px"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-background">
                        {article.author}
                      </h4>
                      <span className="text-sm text-background/70">
                        Columnista
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="font-serif text-xl font-semibold leading-tight text-background group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="mt-3 text-sm text-background/80 line-clamp-3">
                    {article.summary}
                  </p>

                  {/* Meta */}
                  <div className="mt-4 flex items-center gap-3 text-xs text-background/60">
                    <span>{formatDate(article.publishedAt)}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{article.readTime} min lectura</span>
                    </div>
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
