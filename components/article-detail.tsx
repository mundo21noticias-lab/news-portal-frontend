'use client';

import { NewsArticle, formatDate, formatRelativeTime } from '@/lib/types';
import { useTrackView } from '@/hooks/use-track-view';
import { sanitizeHtml } from '@/lib/sanitize';
import { FALLBACK_IMAGE_URL } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Clock,
  User,
  Calendar,
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle,
} from 'lucide-react';
import { NewsCard } from './news-card';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ArticleDetailProps {
  article: NewsArticle;
  relatedArticles: NewsArticle[];
  prevArticle?: NewsArticle | null;
  nextArticle?: NewsArticle | null;
}

export function ArticleDetail({
  article,
  relatedArticles,
  prevArticle,
  nextArticle,
}: ArticleDetailProps) {
  const [shareUrl, setShareUrl] = useState('');
  const { toast } = useToast();

  // Rastrear vista del artículo (1 por dispositivo)
  useTrackView(article.id, article.slug || article.title);

  useEffect(() => {
    setShareUrl(typeof window !== 'undefined' ? window.location.href : '');
  }, []);

  const shareButtons = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        shareUrl
      )}&text=${encodeURIComponent(article.title)}`,
      color: 'text-secondary hover:bg-secondary/10 dark:hover:bg-secondary/20',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'text-secondary hover:bg-secondary/10 dark:hover:bg-secondary/20',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: 'text-secondary hover:bg-secondary/10 dark:hover:bg-secondary/20',
    },
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(
        `${article.summary}\n\n${shareUrl}`
      )}`,
      color: 'text-primary hover:bg-primary/10 dark:hover:bg-primary/20',
    },
  ];

const handleShare = (url: string, target: string) => {
  if (target === 'copy') {
    navigator.clipboard.writeText(shareUrl);

    toast({
      title: 'Enlace copiado',
      description: 'El enlace ha sido copiado al portapapeles.',
      duration: 3000,
      className: 'bg-background border-primary shadow-lg',
    });
  } else {
    window.open(url, 'share', 'width=600,height=400');
  }
};

  return (
    <div className="w-full">
      {/* Back button */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative w-full h-96 md:h-[500px] bg-muted overflow-hidden">
        <Image
          src={article.imageUrl || FALLBACK_IMAGE_URL}
          alt={article.title}
          fill
          priority
          className="object-cover object-top"
          sizes="(max-width: 768px) 100vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
        {/* Category Badge */}
        <Link
          href={`/category/${article.category?.toLowerCase().replace(/\s+/g, '-')}`}
          className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4 hover:bg-primary/20 transition-colors"
        >
          {article.category}
        </Link>

        {/* Title */}
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-foreground">
          {article.title}
        </h1>

        {/* Meta Information */}
        <div className="flex flex-wrap gap-4 md:gap-6 mb-8 pb-8 border-b">
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4" />
            <span className="text-sm">{article.author}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">{formatDate(article.publishedAt)}</span>
            <span className="text-xs text-muted-foreground">
              ({formatRelativeTime(article.publishedAt)})
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{article.readTime} min de lectura</span>
          </div>
          {article.totalViews && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span className="text-sm">{article.totalViews.toLocaleString()} vistas</span>
            </div>
          )}
        </div>

        {/* Summary */}
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          {article.summary}
        </p>

        {/* Article Content */}
        <article
          spellCheck="false"
          className="prose prose-sm md:prose-base dark:prose-invert max-w-none mb-12
            prose-headings:font-serif prose-headings:font-bold
            prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
            prose-p:text-base prose-p:leading-relaxed
            prose-strong:font-bold prose-em:italic
            prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded
            prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded
            prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4
            prose-blockquote:italic prose-blockquote:text-muted-foreground
            prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80
            prose-img:rounded prose-img:shadow-md
            prose-li:marker:text-primary
            prose-table:border-collapse prose-th:bg-muted prose-th:font-bold
            prose-td:border prose-td:p-3"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content || '') }}
        />

        {/* Share Section */}
        <div className="border-t border-b py-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Share2 className="h-5 w-5 text-foreground" />
            <h3 className="font-semibold text-foreground">Compartir artículo</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {shareButtons.map((button) => (
              <button
                key={button.name}
                onClick={() => handleShare(button.url, button.name)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${button.color} border border-primary/20 hover:border-primary/40`}
                title={`Compartir en ${button.name}`}
              >
                <button.icon className="h-4 w-4" />
                <span className="text-sm hidden sm:inline">{button.name}</span>
              </button>
            ))}
            <button
              onClick={() => handleShare('', 'copy')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium border border-primary/20 hover:border-primary/40 bg-primary/5 text-primary hover:bg-primary/15 transition-all"
              title="Copiar enlace"
            >
              <span className="text-sm">Copiar enlace</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation (Previous/Next Articles) */}
      <div className="bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Previous Article */}
            {prevArticle ? (
              <Link
                href={`/articles/${prevArticle.slug}`}
                className="group flex flex-col p-6 rounded-lg border border-border hover:border-primary/50 transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-2 text-muted-foreground mb-3 group-hover:text-primary transition-colors">
                  <ChevronLeft className="h-4 w-4" />
                  <span className="text-sm font-medium">Artículo anterior</span>
                </div>
                <h4 className="font-serif font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {prevArticle.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-1">
                  {prevArticle.summary}
                </p>
              </Link>
            ) : (
              <div className="flex flex-col p-6 rounded-lg border border-border bg-muted/50 opacity-50">
                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                  <ChevronLeft className="h-4 w-4" />
                  <span className="text-sm font-medium">Artículo anterior</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Este es el artículo más reciente
                </p>
              </div>
            )}

            {/* Next Article */}
            {nextArticle ? (
              <Link
                href={`/articles/${nextArticle.slug}`}
                className="group flex flex-col p-6 rounded-lg border border-border hover:border-primary/50 transition-all hover:shadow-md text-right md:text-left"
              >
                <div className="flex items-center gap-2 text-muted-foreground mb-3 group-hover:text-primary transition-colors justify-end md:justify-start">
                  <span className="text-sm font-medium">Artículo siguiente</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
                <h4 className="font-serif font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {nextArticle.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-1">
                  {nextArticle.summary}
                </p>
              </Link>
            ) : (
              <div className="flex flex-col p-6 rounded-lg border border-border bg-muted/50 opacity-50 text-right md:text-left">
                <div className="flex items-center gap-2 text-muted-foreground mb-3 justify-end md:justify-start">
                  <span className="text-sm font-medium">Artículo siguiente</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Este es el artículo más antiguo
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="bg-muted/30 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-8">
              Artículos relacionados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
