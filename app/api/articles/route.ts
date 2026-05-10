import { getArticlesPaginated } from '@/lib/firebase-service';
import { NextRequest, NextResponse } from 'next/server';

// Disable caching for this API route to always fetch fresh data from Firebase
export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const pageSize = parseInt(searchParams.get('pageSize') || '9');
    const lastDocId = searchParams.get('lastDocId');

    // For simplicity, we'll fetch all articles and manually paginate
    // In production, you might want to pass lastDocId to getArticlesPaginated
    const { articles, hasMore } = await getArticlesPaginated(pageSize);

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
