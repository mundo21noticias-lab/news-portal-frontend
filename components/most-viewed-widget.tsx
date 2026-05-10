'use client';

import { NewsArticle } from '@/lib/types';
import Link from 'next/link';
import { Eye, TrendingUp } from 'lucide-react';

interface MostViewedWidgetProps {
    articles: NewsArticle[];
    title?: string;
    limit?: number;
}

/**
 * Widget que muestra los artículos más vistos
 * Útil para sidebar o footer
 * 
 * @example
 * ```tsx
 * const trending = await getMostViewedArticles(5);
 * <MostViewedWidget articles={trending} />
 * ```
 */
export function MostViewedWidget({
    articles,
    title = 'Lo Más Visto',
    limit = 5,
}: MostViewedWidgetProps) {
    const displayArticles = articles.slice(0, limit);

    return (
        <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg">{title}</h3>
            </div>

            <div className="space-y-3">
                {displayArticles.map((article, index) => (
                    <Link
                        key={article.id}
                        href={`/articles/${article.slug || article.id}`}
                        className="group block"
                    >
                        <div className="flex gap-3">
                            {/* Ranking number */}
                            <div className="flex items-start justify-center w-6 font-bold text-sm text-muted-foreground group-hover:text-primary transition-colors">
                                #{index + 1}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                                    {article.title}
                                </p>
                                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                    <Eye className="w-3 h-3" />
                                    <span>{formatViews(article.totalViews || 0)}</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

/**
 * Widget compacto para mostrar top 3 artículos
 */
export function TopArticlesCard({ articles }: { articles: NewsArticle[] }) {
    return (
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/10">
            <h4 className="font-semibold text-sm mb-3 text-primary">
                📈 Tendencias Calientes
            </h4>
            <div className="space-y-2">
                {articles.slice(0, 3).map((article, i) => (
                    <Link
                        key={article.id}
                        href={`/articles/${article.slug}`}
                        className="block text-xs hover:text-primary transition-colors line-clamp-1"
                    >
                        <span className="text-primary font-bold">{i + 1}.</span> {article.title}
                    </Link>
                ))}
            </div>
        </div>
    );
}

/**
 * Formatea el contador de vistas para display
 */
function formatViews(views: number): string {
    if (views === 0) return '0 vistas';
    if (views === 1) return '1 vista';
    if (views < 1000) return `${views} vistas`;
    if (views < 1_000_000) {
        const thousands = views / 1000;
        return `${thousands.toFixed(1)}K vistas`;
    }
    const millions = views / 1_000_000;
    return `${millions.toFixed(1)}M vistas`;
}
