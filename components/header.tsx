'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Menu, Search, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FirebaseCategory } from '@/lib/firebase-service';
import { NewsArticle } from '@/lib/types';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { HeaderTrendingBar } from '@/components/header-trending-bar';
import { HeaderBreakingNews } from '@/components/header-breaking-news';
import { HeaderNavigation } from '@/components/header-navigation';
import styles from './header.module.css';

interface HeaderProps {
  categories?: FirebaseCategory[];
}

export function Header({ categories = [] }: HeaderProps) {
  const router = useRouter();
  const isScrollingDown = useScrollDirection();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [breakingNews, setBreakingNews] = useState<NewsArticle[]>([]);

  const rawDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const currentDate = rawDate.charAt(0).toUpperCase() + rawDate.slice(1);

  // Obtener noticias más recientes para la cinta de "Última Hora"
  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        const response = await fetch('/api/articles');
        if (response.ok) {
          const data = await response.json();
          setBreakingNews(data.articles?.slice(0, 5) || []);
        }
      } catch (error) {
        console.error('Error fetching breaking news:', error);
      }
    };

    fetchLatestNews();
    const interval = setInterval(fetchLatestNews, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim() && searchQuery.length >= 2) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  }, [searchQuery, router]);

  const handleSearchClick = useCallback(() => {
    setIsSearchOpen(prev => !prev);
  }, []);

  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      {/* Top bar con lema */}
      <div className="border-b border-border bg-secondary">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <p className="text-xs md:text-sm font-semibold text-white italic">
              "Es mejor una verdad dolorosa que una mentira inútil"
            </p>
            <span className="hidden md:block text-white">{currentDate}</span>
          </div>
        </div>
      </div>

      {/* Trending bar component */}
      <HeaderTrendingBar
        categories={categories}
        currentDate={currentDate}
        isScrollingDown={isScrollingDown}
        onSearchClick={handleSearchClick}
      />

      {/* Logo section - separate container */}
      <div className={`${isScrollingDown ? styles.logoCompressed : styles.logoExpanded}`}>
        <div className="container mx-auto px-4">
          {/* Mobile: Left menu button and right actions */}
          <div className="lg:hidden flex items-center justify-between gap-2 mb-2">
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0"
              onClick={handleMenuToggle}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSearchClick}
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="User account"
              >
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Centered logo */}
          <div className="flex flex-col items-center justify-center gap-2">
            <Link href="/" className="flex items-center group">
              <Image
                src="/logo-mundoxxi.png"
                alt="MundoXXI"
                width={280}
                height={100}
                className={`${isScrollingDown ? styles.logoSmall : styles.logoLarge} w-auto drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-300 group-hover:scale-105`}
                priority
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Breaking news component */}
      <div className="container mx-auto px-4">
        <HeaderBreakingNews articles={breakingNews} isScrollingDown={isScrollingDown} />
      </div>

      {/* Search bar */}
      {isSearchOpen && (
        <div className="container mx-auto px-4 py-2">
          <form onSubmit={handleSearchSubmit} className="animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar noticias (mínimo 2 caracteres)..."
                className="w-full pl-10 pr-4 py-3 bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-secondary"
                autoFocus
              />
            </div>
          </form>
        </div>
      )}

      {/* Navigation component */}
      <HeaderNavigation
        categories={categories}
        isScrollingDown={isScrollingDown}
        isMenuOpen={isMenuOpen}
        onMenuToggle={handleMenuToggle}
      />
    </header>
  );
}
