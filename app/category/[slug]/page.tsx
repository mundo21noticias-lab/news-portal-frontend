import { getCategoryBySlug, getArticlesByCategory, getCategories, getAllCategorySlugs } from '@/lib/firebase-service';
import { generateDynamicMetadata } from '@/lib/metadata-utils';
import { CategoryList } from '@/components/category-list';
import { notFound } from 'next/navigation';

// Disable caching to always fetch fresh data from Firebase
export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs();
  return slugs.map(slug => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) {
    return { title: 'Categoría no encontrada' };
  }

  return generateDynamicMetadata({
    title: `${category.name} - MundoXXI`,
    description: category.description || `Noticias sobre ${category.name} en MundoXXI`,
    url: `https://mundoxxi.com/category/${slug}`,
    category: category.name,
    type: 'website',
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  const firebaseCategories = await getCategories();

  if (!category) {
    console.warn(`Category not found for slug: ${slug}`);
    notFound();
  }

  console.log(`Loading articles for category: ${category.name} (ID: ${category.id})`);
  const initialArticles = await getArticlesByCategory(category.id);
  console.log(`Found ${initialArticles.length} articles for category ${category.id}`);

  return (
    <div className="min-h-screen bg-background">
      <CategoryList
        categoryName={category.name}
        categoryId={category.id}
        initialArticles={initialArticles}
        categories={firebaseCategories}
      />
    </div>
  );
}
