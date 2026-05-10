'use client';

import { NewsArticle } from '@/lib/types';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BreakingNewsTickerProps {
    articles: NewsArticle[];
}

/**
 * Ticker inline de "Última Hora" que muestra la noticia más reciente
 * Se integra dentro del header sin fondo decorativo
 */
export function BreakingNewsTicker({ articles }: BreakingNewsTickerProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Rotar noticias cada 5 segundos
    useEffect(() => {
        if (articles.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % articles.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [articles.length]);

    if (articles.length === 0) {
        return null;
    }

    const currentArticle = articles[currentIndex];

    return (
        <div className="flex items-center gap-2 flex-1 min-w-0 mx-1 mb-2">
            {/* Icon y label */}
            <div className="flex items-center gap-1 flex-shrink-0 animate-pulse">
                <AlertCircle className="h-4 w-4 text-primary" />
                <span className="text-lg font-bold uppercase tracking-widest whitespace-nowrap text-primary">
                    Última Hora
                </span>
            </div>

            {/* Divisor */}
            <div className="w-px h-4 bg-border flex-shrink-0"></div>

            {/* Noticia */}
            <Link
                href={`/articles/${currentArticle.slug}`}
                className="group flex-1 min-w-0 overflow-hidden"
            >
                <div className="flex items-center gap-1 text-xs font-medium text-foreground hover:text-primary transition-colors">
                    {/* Punto animado */}
                    <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0 animate-bounce"></span>

                    {/* Título con truncado */}
                    <span className="text-lg line-clamp-1 group-hover:underline">
                        {currentArticle.title}
                    </span>
                </div>
            </Link>

            {/* Navegación de noticias */}
            {articles.length > 1 && (
                <div className="flex items-center gap-1 flex-shrink-0">
                    {articles.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentIndex ? 'bg-primary w-4' : 'bg-muted-foreground/50 hover:bg-muted-foreground'
                                }`}
                            aria-label={`Noticia ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
