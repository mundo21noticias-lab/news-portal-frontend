import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase-config';
import { NewsArticle, Category } from './types';
import { sanitizeHtml } from './sanitize';
import { FALLBACK_IMAGE_URL, CACHE_TTL_MS } from './constants';

export interface FirebaseArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  categoryId: string;
  imageIds: string[];
  authorId: string;
  slug: string;
  status: 'draft' | 'published';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  totalViews: number;
  uniqueViews: number;
  tags: string[];
  featured?: boolean;
}

export interface FirebaseCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
}

export interface FirebaseMedia {
  id: string;
  downloadURL: string;
  height: number;
  width: number;
  mimeType: string;
  type: 'image' | 'video';
  uploadedBy: string;
}

export interface FirebaseUser {
  id: string;
  displayName: string;
  email: string;
  isActive: boolean;
}

// ─── Cache con TTL de 5 minutos ──────────────────────────────────────────────

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

function isCacheValid<T>(entry: CacheEntry<T> | undefined): boolean {
  return !!entry && Date.now() - entry.timestamp < CACHE_TTL_MS;
}

let mediaCache: Map<string, CacheEntry<FirebaseMedia>> = new Map();
let categoryCache: Map<string, CacheEntry<FirebaseCategory>> = new Map();
let userCache: Map<string, CacheEntry<FirebaseUser>> = new Map();

// ─── Funciones públicas ───────────────────────────────────────────────────────

/**
 * Get all published articles from Firestore
 */
export async function getArticles(): Promise<NewsArticle[]> {
  try {
    const articlesRef = collection(db, 'articles');
    const q = query(
      articlesRef,
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    const articles: NewsArticle[] = [];

    for (const docSnap of snapshot.docs) {
      const article = await transformArticleToNewsArticle(
        docSnap.id,
        docSnap.data() as FirebaseArticle
      );
      articles.push(article);
    }

    return articles;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

/**
 * Get article by slug
 */
export async function getArticleBySlug(slug: string): Promise<NewsArticle | null> {
  try {
    const articlesRef = collection(db, 'articles');
    const q = query(
      articlesRef,
      where('slug', '==', slug),
      where('status', '==', 'published')
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const docSnap = snapshot.docs[0];
    return await transformArticleToNewsArticle(docSnap.id, docSnap.data() as FirebaseArticle);
  } catch (error) {
    console.error('Error fetching article by slug:', error);
    return null;
  }
}

/**
 * Get paginated articles for infinite scroll
 */
export async function getArticlesPaginated(
  pageSize: number = 9,
  lastDocSnapshot?: unknown
): Promise<{
  articles: NewsArticle[];
  lastDoc: unknown;
  hasMore: boolean;
}> {
  try {
    const articlesRef = collection(db, 'articles');
    const constraints = [
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc'),
      ...(lastDocSnapshot ? [startAfter(lastDocSnapshot)] : []),
      limit(pageSize),
    ];

    const q = query(articlesRef, ...constraints);
    const snapshot = await getDocs(q);
    const articles: NewsArticle[] = [];

    for (const docSnap of snapshot.docs) {
      const article = await transformArticleToNewsArticle(
        docSnap.id,
        docSnap.data() as FirebaseArticle
      );
      articles.push(article);
    }

    const lastDoc = snapshot.docs[snapshot.docs.length - 1];
    const hasMore = articles.length === pageSize;

    return { articles, lastDoc, hasMore };
  } catch (error) {
    console.error('Error fetching paginated articles:', error);
    return { articles: [], lastDoc: null, hasMore: false };
  }
}

/**
 * Get all categories
 */
export async function getCategories(): Promise<FirebaseCategory[]> {
  try {
    // Intentar servir desde caché primero
    const cached = Array.from(categoryCache.values()).filter(isCacheValid);
    if (cached.length > 0) {
      return cached.map((e) => e.data);
    }

    const categoriesRef = collection(db, 'categories');
    const q = query(categoriesRef, where('isActive', '==', true));

    const snapshot = await getDocs(q);
    const categories: FirebaseCategory[] = [];

    for (const docSnap of snapshot.docs) {
      const categoryData = docSnap.data();
      const category: FirebaseCategory = {
        id: docSnap.id,
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description,
        isActive: categoryData.isActive,
      };
      categories.push(category);
      categoryCache.set(docSnap.id, { data: category, timestamp: Date.now() });
    }

    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Get category by ID (con TTL cache)
 */
async function getCategoryById(categoryId: string): Promise<FirebaseCategory | null> {
  if (!categoryId) return null;
  try {
    const cached = categoryCache.get(categoryId);
    if (isCacheValid(cached)) return cached!.data;

    const categoryRef = doc(db, 'categories', categoryId);
    const docSnap = await getDoc(categoryRef);

    if (!docSnap.exists()) {
      return null;
    }

    const categoryData = docSnap.data();
    const category: FirebaseCategory = {
      id: docSnap.id,
      name: categoryData.name,
      slug: categoryData.slug,
      description: categoryData.description,
      isActive: categoryData.isActive,
    };
    categoryCache.set(docSnap.id, { data: category, timestamp: Date.now() });
    return category;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

/**
 * Get user by ID (con TTL cache)
 */
async function getUserById(userId: string): Promise<FirebaseUser | null> {
  if (!userId) return null;
  try {
    const cached = userCache.get(userId);
    if (isCacheValid(cached)) return cached!.data;

    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      return null;
    }

    const userData = docSnap.data() as FirebaseUser;
    const user: FirebaseUser = { ...userData, id: docSnap.id };
    userCache.set(docSnap.id, { data: user, timestamp: Date.now() });
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

/**
 * Get media by ID (con TTL cache)
 */
async function getMediaById(mediaId: string): Promise<FirebaseMedia | null> {
  if (!mediaId) return null;
  try {
    const cached = mediaCache.get(mediaId);
    if (isCacheValid(cached)) return cached!.data;

    const mediaRef = doc(db, 'media', mediaId);
    const docSnap = await getDoc(mediaRef);

    if (!docSnap.exists()) {
      return null;
    }

    const mediaData = docSnap.data() as FirebaseMedia;
    const media: FirebaseMedia = { ...mediaData, id: docSnap.id };
    mediaCache.set(docSnap.id, { data: media, timestamp: Date.now() });
    return media;
  } catch (error) {
    console.error('Error fetching media:', error);
    return null;
  }
}

/**
 * Get articles by category (con fallback si no existe el índice)
 */
export async function getArticlesByCategory(categoryId: string): Promise<NewsArticle[]> {
  try {
    const articlesRef = collection(db, 'articles');
    const q = query(
      articlesRef,
      where('categoryId', '==', categoryId),
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    const articles: NewsArticle[] = [];

    for (const docSnap of snapshot.docs) {
      const article = await transformArticleToNewsArticle(
        docSnap.id,
        docSnap.data() as FirebaseArticle
      );
      articles.push(article);
    }

    return articles;
  } catch (error: unknown) {
    const firebaseError = error as { code?: string };
    if (firebaseError.code === 'failed-precondition') {
      console.warn(`Index not created for category ${categoryId}, using fallback query`);
      try {
        const articlesRef = collection(db, 'articles');
        const q = query(articlesRef, where('categoryId', '==', categoryId));
        const snapshot = await getDocs(q);
        const articles: NewsArticle[] = [];

        for (const docSnap of snapshot.docs) {
          const data = docSnap.data() as FirebaseArticle;
          if (data.status === 'published') {
            const article = await transformArticleToNewsArticle(docSnap.id, data);
            articles.push(article);
          }
        }

        articles.sort(
          (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );

        return articles;
      } catch (fallbackError) {
        console.error('Error fetching articles by category (fallback):', fallbackError);
        return [];
      }
    }

    console.error('Error fetching articles by category:', error);
    return [];
  }
}

/**
 * Search articles — con límite de 200 documentos para controlar costos de Firestore
 */
export async function searchArticles(searchQuery: string): Promise<NewsArticle[]> {
  try {
    if (!searchQuery.trim()) {
      return [];
    }

    const queryLower = searchQuery.toLowerCase();
    const searchTerms = queryLower.split(' ').filter((term) => term.length > 0);

    const articlesRef = collection(db, 'articles');
    const q = query(
      articlesRef,
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc'),
      limit(200) // Límite para controlar costos
    );

    const snapshot = await getDocs(q);
    const scoredArticles: Array<{ article: NewsArticle; score: number }> = [];

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data() as FirebaseArticle;
      let score = 0;

      if (data.title?.toLowerCase().includes(queryLower)) score += 3;
      if (data.summary?.toLowerCase().includes(queryLower)) score += 2;

      if (Array.isArray(data.tags)) {
        data.tags.forEach((tag) => {
          if (tag.toLowerCase().includes(queryLower) || queryLower.includes(tag.toLowerCase())) {
            score += 1;
          }
        });
      }

      searchTerms.forEach((term) => {
        if (term.length >= 2) {
          if (data.title?.toLowerCase().includes(term)) score += 1;
          if (data.summary?.toLowerCase().includes(term)) score += 0.5;
        }
      });

      if (score > 0) {
        const article = await transformArticleToNewsArticle(docSnap.id, data);
        scoredArticles.push({ article, score });
      }
    }

    scoredArticles.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (
        new Date(b.article.publishedAt).getTime() - new Date(a.article.publishedAt).getTime()
      );
    });

    console.log(`Search: found ${scoredArticles.length} articles for "${searchQuery}"`);
    return scoredArticles.map((s) => s.article);
  } catch (error: unknown) {
    const firebaseError = error as { code?: string };
    if (firebaseError.code === 'failed-precondition') {
      console.warn('Search index not available, using fallback');
      return searchArticlesFallback(searchQuery);
    }
    console.error('Error searching articles:', error);
    return [];
  }
}

async function searchArticlesFallback(searchQuery: string): Promise<NewsArticle[]> {
  try {
    const queryLower = searchQuery.toLowerCase();
    const searchTerms = queryLower.split(' ').filter((t) => t.length > 0);
    const articlesRef = collection(db, 'articles');
    const q = query(articlesRef, where('status', '==', 'published'), limit(200));
    const snapshot = await getDocs(q);
    const scoredArticles: Array<{ article: NewsArticle; score: number }> = [];

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data() as FirebaseArticle;
      let score = 0;
      if (data.title?.toLowerCase().includes(queryLower)) score += 3;
      if (data.summary?.toLowerCase().includes(queryLower)) score += 2;
      if (Array.isArray(data.tags)) {
        data.tags.forEach((tag) => {
          if (tag.toLowerCase().includes(queryLower)) score += 1;
        });
      }
      searchTerms.forEach((term) => {
        if (term.length >= 2) {
          if (data.title?.toLowerCase().includes(term)) score += 1;
          if (data.summary?.toLowerCase().includes(term)) score += 0.5;
        }
      });
      if (score > 0) {
        const article = await transformArticleToNewsArticle(docSnap.id, data);
        scoredArticles.push({ article, score });
      }
    }

    scoredArticles.sort((a, b) => b.score - a.score);
    return scoredArticles.map((s) => s.article);
  } catch (error) {
    console.error('Search fallback error:', error);
    return [];
  }
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<FirebaseCategory | null> {
  try {
    const categories = await getCategories();
    return categories.find((cat) => cat.slug === slug) || null;
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    return null;
  }
}

/**
 * Obtiene artículo anterior y siguiente en una sola operación eficiente.
 * Usa queries con cursor (createdAt) en lugar de descargar 100 artículos.
 */
export async function getAdjacentArticles(
  currentPublishedAt: string,
  _currentId: string
): Promise<{ nextArticle: NewsArticle | null; prevArticle: NewsArticle | null }> {
  try {
    const currentDate = new Date(currentPublishedAt);
    const currentTs = Timestamp.fromDate(currentDate);
    const articlesRef = collection(db, 'articles');

    const [nextSnap, prevSnap] = await Promise.all([
      // Artículo más reciente (newer = next)
      getDocs(
        query(
          articlesRef,
          where('status', '==', 'published'),
          where('createdAt', '>', currentTs),
          orderBy('createdAt', 'asc'),
          limit(1)
        )
      ),
      // Artículo más antiguo (older = prev)
      getDocs(
        query(
          articlesRef,
          where('status', '==', 'published'),
          where('createdAt', '<', currentTs),
          orderBy('createdAt', 'desc'),
          limit(1)
        )
      ),
    ]);

    const nextArticle = nextSnap.empty
      ? null
      : await transformArticleToNewsArticle(
          nextSnap.docs[0].id,
          nextSnap.docs[0].data() as FirebaseArticle
        );

    const prevArticle = prevSnap.empty
      ? null
      : await transformArticleToNewsArticle(
          prevSnap.docs[0].id,
          prevSnap.docs[0].data() as FirebaseArticle
        );

    return { nextArticle, prevArticle };
  } catch (error) {
    console.error('Error fetching adjacent articles:', error);
    return { nextArticle: null, prevArticle: null };
  }
}

// Mantener por compatibilidad con código existente
export async function getNextArticle(currentSlug: string): Promise<NewsArticle | null> {
  const article = await getArticleBySlug(currentSlug);
  if (!article) return null;
  const { nextArticle } = await getAdjacentArticles(article.publishedAt, article.id);
  return nextArticle;
}

export async function getPreviousArticle(currentSlug: string): Promise<NewsArticle | null> {
  const article = await getArticleBySlug(currentSlug);
  if (!article) return null;
  const { prevArticle } = await getAdjacentArticles(article.publishedAt, article.id);
  return prevArticle;
}

/**
 * Transform Firebase article to NewsArticle interface
 */
async function transformArticleToNewsArticle(
  id: string,
  article: FirebaseArticle
): Promise<NewsArticle> {
  const category = await getCategoryById(article.categoryId);
  const categoryName = category?.name || 'Sin categoría';

  const user = await getUserById(article.authorId);
  const authorName = user?.displayName || 'Anónimo';

  // Buscar primera imagen válida
  let imageUrl = FALLBACK_IMAGE_URL;
  if (article.imageIds && article.imageIds.length > 0) {
    for (const imageId of article.imageIds) {
      if (imageId && imageId.trim()) {
        const media = await getMediaById(imageId);
        if (media) {
          imageUrl = media.downloadURL;
          break;
        }
      }
    }
  }

  // Tiempo de lectura estimado
  const wordCount = article.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  // Procesar contenido HTML (responsivo + sanitizado)
  let processedContent = sanitizeHtml(article.content);

  processedContent = processedContent.replace(
    /<img([^>]*)>/gi,
    (match, attrs) => {
      if (!attrs.includes('style')) {
        return `<img${attrs} style="max-width: 100%; height: auto; display: block; margin: 1.5rem auto; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">`;
      }
      return match;
    }
  );

  processedContent = processedContent.replace(
    /<iframe([^>]*)><\/iframe>/gi,
    '<div class="video-wrapper"><iframe$1></iframe></div>'
  );

  return {
    id,
    title: article.title,
    summary: article.summary,
    category: categoryName,
    imageUrl,
    author: authorName,
    publishedAt:
      article.createdAt?.toDate?.()?.toISOString?.() || new Date().toISOString(),
    updatedAt:
      article.updatedAt?.toDate?.()?.toISOString?.() ||
      article.createdAt?.toDate?.()?.toISOString?.() ||
      new Date().toISOString(),
    readTime,
    slug: article.slug,
    content: processedContent,
    status: article.status,
    totalViews: article.totalViews || 0,
    tags: article.tags || [],
    featured: article.featured || false,
  };
}

/**
 * Clear caches (useful after mutations)
 */
export function clearCaches() {
  mediaCache.clear();
  categoryCache.clear();
  userCache.clear();
}

/**
 * Get all article slugs for static generation
 */
export async function getAllArticleSlugs(): Promise<string[]> {
  try {
    const articlesRef = collection(db, 'articles');
    const q = query(
      articlesRef,
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc'),
      limit(100)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data() as FirebaseArticle;
      return data.slug;
    });
  } catch (error) {
    console.error('Error fetching article slugs:', error);
    return [];
  }
}

/**
 * Get all category slugs for static generation
 */
export async function getAllCategorySlugs(): Promise<string[]> {
  try {
    const categories = await getCategories();
    return categories.map((cat) => cat.slug);
  } catch (error) {
    console.error('Error fetching category slugs:', error);
    return [];
  }
}

/**
 * Get view statistics for an article
 */
export async function getArticleViewStats(articleId: string): Promise<{
  totalViews: number;
  uniqueDevices: number;
  lastViewedAt?: string;
}> {
  try {
    const articleRef = doc(db, 'articles', articleId);
    const articleDoc = await getDoc(articleRef);

    if (!articleDoc.exists()) {
      return { totalViews: 0, uniqueDevices: 0 };
    }

    const data = articleDoc.data() as FirebaseArticle;
    return {
      totalViews: data.totalViews || 0,
      uniqueDevices: data.uniqueViews || 0,
      lastViewedAt: data.updatedAt?.toDate?.()?.toISOString?.(),
    };
  } catch (error) {
    console.error('Error fetching article view stats:', error);
    return { totalViews: 0, uniqueDevices: 0 };
  }
}

/**
 * Get most viewed articles
 */
export async function getMostViewedArticles(limitCount: number = 10): Promise<NewsArticle[]> {
  try {
    const articlesRef = collection(db, 'articles');
    const q = query(
      articlesRef,
      where('status', '==', 'published'),
      orderBy('totalViews', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    const articles: NewsArticle[] = [];

    for (const docSnap of snapshot.docs) {
      const article = await transformArticleToNewsArticle(
        docSnap.id,
        docSnap.data() as FirebaseArticle
      );
      articles.push(article);
    }

    return articles;
  } catch (error) {
    console.error('Error fetching most viewed articles:', error);
    return [];
  }
}

/**
 * Get trending articles (más vistas en los últimos 7 días)
 */
export async function getTrendingArticles(limitCount: number = 5): Promise<NewsArticle[]> {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const articlesRef = collection(db, 'articles');
    const q = query(
      articlesRef,
      where('status', '==', 'published'),
      where('createdAt', '>=', Timestamp.fromDate(sevenDaysAgo)),
      orderBy('createdAt', 'desc'),
      orderBy('totalViews', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    const articles: NewsArticle[] = [];

    for (const docSnap of snapshot.docs) {
      const article = await transformArticleToNewsArticle(
        docSnap.id,
        docSnap.data() as FirebaseArticle
      );
      articles.push(article);
    }

    return articles;
  } catch (error: unknown) {
    // Fallback: si no hay índice, obtener artículos recientes ordenados por vistas
    console.warn('getTrendingArticles index missing, using fallback:', error);
    try {
      const articlesRef = collection(db, 'articles');
      const q = query(
        articlesRef,
        where('status', '==', 'published'),
        orderBy('totalViews', 'desc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      const articles: NewsArticle[] = [];
      for (const docSnap of snapshot.docs) {
        const article = await transformArticleToNewsArticle(
          docSnap.id,
          docSnap.data() as FirebaseArticle
        );
        articles.push(article);
      }
      return articles;
    } catch (fallbackError) {
      console.error('Error fetching trending articles (fallback):', fallbackError);
      return [];
    }
  }
}
