'use client';

export interface ArticleJsonLdProps {
    schema: any;
}

export function ArticleJsonLd({ schema }: ArticleJsonLdProps) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(schema),
            }}
        />
    );
}
