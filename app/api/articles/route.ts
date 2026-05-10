import { getArticlesPaginated } from '@/lib/firebase-service';
import { NextRequest, NextResponse } from 'next/server';

// Disable caching for this API route to always fetch fresh data from Firebase
export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const pageSize = parseInt(searchParams.get('pageSize') || '9');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Fetch all articles and manually paginate using offset
    const allArticles = await getArticlesPaginated(1000); // get up to 1000
    const articles = allArticles.articles.slice(offset, offset + pageSize);
    const hasMore = offset + pageSize < allArticles.articles.length;

    return NextResponse.json({
      success: true,
      articles,
      hasMore,
    });
  } catch (error) {
    console.error('Error in articles API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}
