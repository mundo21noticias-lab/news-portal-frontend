import { searchArticles, getCategories } from '@/lib/firebase-service';
import { SearchResults } from '@/components/search-results';
import { Suspense } from 'react';
import type { Metadata } from 'next';

// Disable caching to always fetch fresh data from Firebase
export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q || '';

  return {
    title: query ? `Resultados: "${query}" - MundoXXI` : 'Buscar noticias - MundoXXI',
    description: query
      ? `Resultados de búsqueda para "${query}" en MundoXXI - Noticias de República Dominicana`
      : 'Busca tus noticias favoritas en MundoXXI',
    openGraph: {
      type: 'website',
      url: `https://mundoxxi.com/search${query ? `?q=${encodeURIComponent(query)}` : ''}`,
      title: query ? `Resultados: "${query}" - MundoXXI` : 'Buscar noticias - MundoXXI',
      description: query
        ? `Resultados de búsqueda para "${query}"`
        : 'Busca tus noticias favoritas en MundoXXI',
      siteName: 'MundoXXI',
      locale: 'es_DO',
    },
  };
}

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || '';
  let results = await searchArticles(query);
  const firebaseCategories = await getCategories();

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div>Buscando noticias...</div>}>
        <SearchResults query={query} initialResults={results} categories={firebaseCategories} />
      </Suspense>
    </div>
  );
}
