'use client';

import { NewsArticle } from '@/lib/types';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { NewsCard } from '@/components/news-card';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, AlertCircle, FilterX } from 'lucide-react';
import { FirebaseCategory } from '@/lib/firebase-service';

interface SearchResultsProps {
  query: string;
  initialResults: NewsArticle[];
  categories?: FirebaseCategory[];
}

export function SearchResults({ query: initialQuery, initialResults, categories = [] }: SearchResultsProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState(initialResults);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim() && query.length >= 2) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header categories={categories} />

      <main className="flex-1">
        {/* Search Section */}
        <div className="bg-gradient-to-b from-primary/10 to-background py-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-8 text-center">
              Buscar noticias
            </h1>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-8">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ingresa tu búsqueda..."
                  className="w-full px-6 py-3 pr-14 rounded-lg border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Buscar"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </form>

            {/* Results Info */}
            {query && query.length >= 2 && (
              <p className="text-center text-muted-foreground mb-8">
                {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''} para "<strong>{query}</strong>"
              </p>
            )}

            {query && query.length < 2 && (
              <p className="text-center text-muted-foreground mb-8">
                Ingresa al menos 2 caracteres para buscar
              </p>
            )}
          </div>
        </div>

        {/* Results Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {results.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            ) : query && query.length >= 2 ? (
              <div className="text-center py-16">
                <div className="inline-block">
                  <div className="flex justify-center mb-4">
                    <FilterX className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-lg font-medium mb-2">
                    No encontramos resultados
                  </p>
                  <p className="text-muted-foreground mb-6">
                    No hay artículos que coincidan con "{query}"
                  </p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Sugerencias:</p>
                    <ul className="text-left inline-block">
                      <li className="flex items-center gap-2">
                        <span className="text-primary">•</span> Verifica la ortografía
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-primary">•</span> Intenta con palabras clave diferentes
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-primary">•</span> Usa términos más generales
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="inline-block">
                  <div className="flex justify-center mb-4">
                    <Search className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-lg font-medium">
                    Comienza a buscar noticias
                  </p>
                  <p className="text-muted-foreground mt-2 text-sm">
                    Ingresa al menos 2 caracteres en el campo de búsqueda
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer categories={categories} />
    </div>
  );
}
