import { getArticleBySlug, getArticlesByCategory, getCategoryBySlug, getCategories, getAdjacentArticles, getAllArticleSlugs } from '@/lib/firebase-service';
import { generateDynamicMetadata } from '@/lib/metadata-utils';
import { generateNewsArticleSchema } from '@/lib/schema-utils';
import { ArticleJsonLd } from '@/components/article-json-ld';
import { ArticleDetail } from '@/components/article-detail';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

// Disable caching to always fetch fresh data from Firebase
export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
  return slugs.map(slug => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) {
    return { title: 'Artículo no encontrado' };
  }

  const articleUrl = `https://mundoxxi.com/articles/${slug}`;

  return generateDynamicMetadata({
    title: `${article.title} | MundoXXI`,
    description: article.summary || 'Lee las últimas noticias de República Dominicana en MundoXXI',
    imageUrl: article.imageUrl,
    url: articleUrl,
    author: article.author,
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
    tags: article.tags || [],
    category: article.category,
    type: 'article',
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  const firebaseCategories = await getCategories();

  if (!article) {
    notFound();
  }

  // Get related articles from the same category
  let relatedArticles: typeof article[] = [];
  if (article.category) {
    const categoryData = await getCategoryBySlug(article.category.toLowerCase().replace(/\s+/g, '-'));
    if (categoryData?.id) {
      const categoryArticles = await getArticlesByCategory(categoryData.id);
      relatedArticles = categoryArticles
        .filter(a => a.id !== article.id)
        .slice(0, 3);
    }
  }

  // Get previous and next articles for navigation (single efficient query)
  const { nextArticle, prevArticle } = await getAdjacentArticles(
    article.publishedAt,
    article.id
  );

  const baseUrl = 'https://mundoxxi.com';
  const articleUrl = `${baseUrl}/articles/${slug}`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header categories={firebaseCategories} />
      <main className="flex-1">
        <ArticleJsonLd
          schema={generateNewsArticleSchema({
            title: article.title,
            description: article.summary,
            imageUrl: article.imageUrl,
            articleUrl,
            publishedAt: article.publishedAt || new Date().toISOString(),
            updatedAt: article.updatedAt || article.publishedAt || new Date().toISOString(),
            author: article.author,
            category: article.category,
          })}
        />
        <ArticleDetail
          article={article}
          relatedArticles={relatedArticles}
          prevArticle={prevArticle}
          nextArticle={nextArticle}
        />
      </main>
      <Footer categories={firebaseCategories} />
    </div>
  );
}
