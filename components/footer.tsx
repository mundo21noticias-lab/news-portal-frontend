import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Youtube, Rss } from 'lucide-react';
import { Category } from '@/lib/types';
import { EMAIL_REDACCION, EMAIL_PUBLICIDAD, SOCIAL_LINKS } from '@/lib/constants';

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: SOCIAL_LINKS.facebook },
  { name: 'Twitter', icon: Twitter, href: SOCIAL_LINKS.twitter },
  { name: 'Instagram', icon: Instagram, href: SOCIAL_LINKS.instagram },
  { name: 'YouTube', icon: Youtube, href: SOCIAL_LINKS.youtube },
  { name: 'RSS', icon: Rss, href: '/rss.xml' },
];

const quickLinks = [
  { name: 'Acerca de', href: '/about' },
  { name: 'Contacto', href: '/contact' },
  { name: 'Publicidad', href: '/contact' },
  { name: 'Términos de uso', href: '/terms' },
  { name: 'Política de privacidad', href: '/privacy' },
];

interface FooterProps {
  categories?: Category[];
}

export function Footer({ categories = [] }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background">
      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 mb-4">
              <Image
                src="/logo.png"
                alt="MundoXXI"
                width={150}
                height={50}
                className="h-14 w-auto"
                priority
              />
              <div className="flex flex-col">
                <div className="text-xl font-bold tracking-tight">
                  <span className="text-secondary">M</span><span className="text-primary">XXI</span>
                </div>
                <div className="text-xs font-semibold text-background/60">Noticias</div>
              </div>
            </Link>
            <p className="mt-4 text-sm text-background/70 leading-relaxed">
              Tu fuente confiable de noticias desde 2026. Comprometidos con la verdad, la objetividad
              y el periodismo de calidad.
            </p>
            {/* Social links */}
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-background/10 hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-background mb-4">Secciones</h3>
            <ul className="space-y-2">
              {categories.slice(0, 6).map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-sm text-background/70 hover:text-primary transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold text-background mb-4">Enlaces</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-background mb-4">Contacto</h3>
            <div className="space-y-3 text-sm text-background/70">
              <p>
                <span className="text-background">Redacción:</span>
                <br />
                <a href={`mailto:${EMAIL_REDACCION}`} className="hover:text-primary transition-colors">
                  {EMAIL_REDACCION}
                </a>
              </p>
              <p>
                <span className="text-background">Publicidad:</span>
                <br />
                <a href={`mailto:${EMAIL_PUBLICIDAD}`} className="hover:text-primary transition-colors">
                  {EMAIL_PUBLICIDAD}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-background/60">
            <p>© {currentYear} MundoXXI. Todos los derechos reservados.</p>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-primary transition-colors">Privacidad</Link>
              <Link href="/terms" className="hover:text-primary transition-colors">Términos</Link>
              <Link href="/contact" className="hover:text-primary transition-colors">Contacto</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
