import { Metadata } from 'next';

export interface NewsArticleSchemaProps {
    title: string;
    description: string;
    imageUrl: string;
    articleUrl: string;
    publishedAt: string;
    updatedAt: string;
    author: string;
    category?: string;
}

/**
 * Genera un esquema JSON-LD para artículos de noticias
 * Mejora el SEO y permite que motores de búsqueda entiendan mejor el contenido
 */
export function generateNewsArticleSchema(props: NewsArticleSchemaProps) {
    const {
        title,
        description,
        imageUrl,
        articleUrl,
        publishedAt,
        updatedAt,
        author,
        category,
    } = props;

    return {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        '@id': articleUrl,
        url: articleUrl,
        headline: title,
        description: description,
        image: {
            '@type': 'ImageObject',
            url: imageUrl,
            width: 1200,
            height: 630,
        },
        datePublished: publishedAt,
        dateModified: updatedAt,
        author: {
            '@type': 'Person',
            name: author,
        },
        publisher: {
            '@type': 'Organization',
            name: 'MundoXXI',
            logo: {
                '@type': 'ImageObject',
                url: 'https://mundoxxi.com/logo.png',
                width: 150,
                height: 50,
            },
        },
        ...(category && {
            articleSection: category,
        }),
        inLanguage: 'es-DO',
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': articleUrl,
        },
    };
}

