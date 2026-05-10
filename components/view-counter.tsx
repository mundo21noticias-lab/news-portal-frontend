'use client';

import { Eye } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ViewCounterProps {
    views?: number;
    className?: string;
}

/**
 * Componente que muestra el contador de vistas formateado
 * Optional: Úsalo en ArticleDetail o en la card del artículo
 * @param views - Número de vistas
 * @param className - Clases de Tailwind adicionales
 */
export function ViewCounter({ views = 0, className = '' }: ViewCounterProps) {
    const [formattedViews, setFormattedViews] = useState('0');

    useEffect(() => {
        setFormattedViews(formatViewCount(views));
    }, [views]);

    return (
        <div className={`flex items-center gap-1 text-sm text-muted-foreground ${className}`}>
            <Eye className="w-4 h-4" />
            <span>{formattedViews}</span>
        </div>
    );
}

/**
 * Formatea el contador de vistas (ej: 1.2M, 4.5K, 342)
 */
function formatViewCount(views: number): string {
    if (views === 0) return '0';
    if (views < 1000) return views.toString();
    if (views < 1_000_000) {
        const thousands = views / 1000;
        return thousands % 1 === 0 ? `${thousands}K` : `${thousands.toFixed(1)}K`;
    }
    const millions = views / 1_000_000;
    return millions % 1 === 0 ? `${millions}M` : `${millions.toFixed(1)}M`;
}
