import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero-section';
import { TrendingSection } from '@/components/trending-section';
import { LatestNews } from '@/components/latest-news';
import { OpinionSection } from '@/components/opinion-section';
import { Newsletter } from '@/components/newsletter';
import { Footer } from '@/components/footer';
import { getArticles, getCategories } from '@/lib/firebase-service';
import { NewsArticle } from '@/lib/types';

// Revalidate every 60 seconds (1 minute) for ISR to reflect Firebase changes
export const revalidate = 60;

export default async function HomePage() {
  // Fetch articles and categories from Firebase
  let allArticles: NewsArticle[] = [];
  let firebaseCategories: any[] = [];

  try {
    allArticles = await Promise.race([
      getArticles(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Firebase timeout')), 5000)
      )
    ]);
  } catch (error) {
    console.error('Error fetching articles from Firebase:', error);
    allArticles = [];
  }

  try {
    firebaseCategories = await Promise.race([
      getCategories(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Firebase timeout')), 5000)
      )
    ]);
  } catch (error) {
    console.error('Error fetching categories from Firebase:', error);
    firebaseCategories = [];
  }

  // Use real Firebase data only
  if (allArticles.length === 0) {
    console.warn('No articles available from Firebase');
    return (
      <div className="min-h-screen flex flex-col">
        <Header categories={firebaseCategories} />
        <main className="flex-1 flex items-center justify-center p-4">
          <p className="text-center text-gray-500">No hay artículos disponibles en este momento.</p>
        </main>
        <Footer />
      </div>
    );
  }

  // Artículo destacado: priorizar campo featured:true, si no el más visto
  const featuredArticle =
    allArticles.find((a) => a.featured) ||
    allArticles.reduce((prev, current) =>
      (prev.totalViews || 0) > (current.totalViews || 0) ? prev : current
    );

  // Get side articles for hero (excluding featured, take 4)
  const sideArticles = allArticles
    .filter(a => a.id !== featuredArticle?.id)
    .slice(0, 4);

  // Get trending articles (most viewed, limit 6-8, excluding featured)
  const trendingArticles = allArticles
    .filter(a => a.id !== featuredArticle?.id)
    .sort((a, b) => (b.totalViews || 0) - (a.totalViews || 0))
    .slice(0, 8)
    .map(a => ({ ...a, trending: true }));

  // Get latest articles for grid (excluding featured, take 9)
  const latestArticles = allArticles
    .filter(a => a.id !== featuredArticle?.id)
    .slice(0, 9);

  // Get opinion articles (most recent 3 without featured flag)
  const opinionArticles = allArticles
    .filter(a => !a.featured)
    .slice(0, 3)
    .map(a => ({ ...a, featured: false }));

  return (
    <div className="min-h-screen flex flex-col">
      <Header categories={firebaseCategories} />

      <main className="flex-1">
        <HeroSection
          featuredArticle={featuredArticle}
          sideArticles={sideArticles}
        />

        <TrendingSection articles={trendingArticles} />

        <LatestNews initialArticles={latestArticles} />

        <OpinionSection articles={opinionArticles} />

        <Newsletter />
      </main>

      <Footer categories={firebaseCategories} />
    </div>
  );
}
