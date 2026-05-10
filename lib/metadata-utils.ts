import { Metadata } from 'next';

const BASE_URL = 'https://mundoxxi.com';
const DEFAULT_IMAGE = `${BASE_URL}/logo.png`;
const SITE_NAME = 'MundoXXI';

export interface DynamicMetadataProps {
    title: string;
    description: string;
    imageUrl?: string;
    url: string;
    author?: string;
    publishedAt?: string;
    updatedAt?: string;
    tags?: string[];
    category?: string;
    type?: 'article' | 'website';
}

/**
 * Genera metadatos dinámicos para Open Graph y Twitter Card
 * Asegura URLs absolutas, imágenes públicas y dimensiones correctas
 */
export function generateDynamicMetadata(props: DynamicMetadataProps): Metadata {
    const {
        title,
        description,
        imageUrl = DEFAULT_IMAGE,
        url,
        author,
        publishedAt,
        updatedAt,
        tags = [],
        category,
        type = 'article',
    } = props;

    // Asegurar que la URL de imagen es absoluta
    const absoluteImageUrl = imageUrl.startsWith('http') ? imageUrl : `${BASE_URL}${imageUrl}`;

    const ogImage = {
        url: absoluteImageUrl,
        width: 1200,
        height: 630,
        alt: title,
        type: 'image/jpeg' as const,
    };

    return {
        title,
        description,
        keywords: ([...tags, category, 'noticias RD', 'República Dominicana'].filter(Boolean) as string[]).join(', '),
        authors: author ? [{ name: author }] : undefined,
        creator: author,
        ...(publishedAt && { publishedTime: publishedAt }),
        ...(updatedAt && { modifiedTime: updatedAt }),
        openGraph: {
            type: type as any,
            url,
            title,
            description,
            images: [ogImage],
            siteName: SITE_NAME,
            locale: 'es_DO',
            ...(type === 'article' &&
                publishedAt && {
                article: {
                    publishedTime: publishedAt,
                    ...(updatedAt && { modifiedTime: updatedAt }),
                    ...(author && { authors: [author] }),
                    ...(tags.length > 0 && { tags }),
                    ...(category && { section: category }),
                },
            }),
        },
        twitter: {
            card: 'summary_large_image',
            site: '@mundoxxi',
            creator: '@mundoxxi',
            title,
            description,
            images: [absoluteImageUrl],
        },
        alternates: {
            canonical: url,
        },
    };
}

/**
 * Valida que una URL de imagen sea pública y accesible
 * Retorna true si la imagen es de un CDN conocido (Firebase Storage, Unsplash, etc)
 */
export function isPublicImageUrl(url: string): boolean {
    const publicCdns = [
        'firebasestorage.googleapis.com',
        'unsplash.com',
        'images.unsplash.com',
        'pexels.com',
        'pixabay.com',
        'cloudinary.com',
        'imgur.com',
        'cdn.',
    ];

    return publicCdns.some(cdn => url.toLowerCase().includes(cdn));
}

/**
 * Asegura que todas las URLs sean absolutas
 */
export function ensureAbsoluteUrl(url: string, baseUrl: string = BASE_URL): string {
    if (!url) return DEFAULT_IMAGE;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('//')) return `https:${url}`;
    return `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`;
}
