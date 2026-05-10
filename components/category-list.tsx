'use client';

import { NewsArticle } from '@/lib/types';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { NewsCard } from '@/components/news-card';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { FirebaseCategory } from '@/lib/firebase-service';

interface CategoryListProps {
  categoryName: string;
  categoryId: string;
  initialArticles: NewsArticle[];
  categories?: FirebaseCategory[];
}

export function CategoryList({
  categoryName,
  categoryId,
  initialArticles,
  categories = [],
}: CategoryListProps) {
  const [articles, setArticles] = useState(initialArticles);

  return (
    <div className="min-h-screen flex flex-col">
      <Header categories={categories} />

      <main className="flex-1">
        {/* Header Section */}
        <div className="bg-gradient-to-b from-primary/10 to-background py-12">
          <div className="container mx-auto px-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Link>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
              {categoryName}
            </h1>
            <p className="text-muted-foreground mt-3">
              {articles.length} artículos en esta categoría
            </p>
          </div>
        </div>

        {/* Articles Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {articles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {articles.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mb-6">
                  <p className="text-2xl font-serif font-bold text-foreground mb-2">
                    Sin artículos aún
                  </p>
                  <p className="text-muted-foreground text-lg mb-4">
                    La categoría <strong>{categoryName}</strong> no tiene artículos publicados en este momento.
                  </p>

                </div>
                <Link
                  href="/"
                  className="inline-block mt-8 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Volver al inicio
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Load More Info */}
        {articles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Próximamente habrá artículos en esta categoría.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
