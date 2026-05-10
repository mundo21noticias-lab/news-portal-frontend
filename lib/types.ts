/**
 * Tipos para News Articles
 * Solo tipos, sin datos falsos
 */

export interface NewsArticle {
    id: string;
    title: string;
    summary: string;
    category: string;
    imageUrl: string;
    author: string;
    publishedAt: string;
    updatedAt?: string;
    readTime?: number;
    featured?: boolean;
    trending?: boolean;
    slug?: string;
    content?: string;
    status?: 'draft' | 'published';
    totalViews?: number;
    tags?: string[];
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    isActive?: boolean;
}

/**
 * Formatea una fecha en español
 */
export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

/**
 * Formatea tiempo relativo desde ahora
 */
export function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
        return `Hace ${diffMins} minuto${diffMins !== 1 ? 's' : ''}`;
    } else if (diffHours < 24) {
        return `Hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
    } else if (diffDays < 7) {
        return `Hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`;
    } else {
        return formatDate(dateString);
    }
}
