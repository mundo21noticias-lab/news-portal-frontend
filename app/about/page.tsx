import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL, EMAIL_REDACCION } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Acerca de MundoXXI | Periodismo independiente desde República Dominicana',
  description:
    'Conoce la misión, valores y equipo de MundoXXI: tu fuente de periodismo independiente y verificado desde República Dominicana.',
  alternates: { canonical: `${SITE_URL}/about` },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-br from-secondary to-secondary/80 py-16">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <span className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-sm font-medium mb-4">
            Acerca de nosotros
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
            MundoXXI Noticias
          </h1>
          <p className="text-lg text-white/85 italic">
            &ldquo;Es mejor una verdad dolorosa que una mentira inútil.&rdquo;
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="prose prose-lg dark:prose-invert max-w-none">

          <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Nuestra misión</h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            MundoXXI nació en 2026 con la convicción de que la República Dominicana y el mundo merecen
            información honesta, verificada e independiente. Nos comprometemos a reportar los hechos con
            rigor periodístico, sin sesgos políticos ni presiones económicas.
          </p>

          <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Nuestros valores</h2>
          <ul className="space-y-3 mb-8">
            {[
              { title: 'Independencia', desc: 'No respondemos a intereses políticos ni corporativos.' },
              { title: 'Verificación', desc: 'Contrastamos toda información antes de publicarla.' },
              { title: 'Transparencia', desc: 'Corregimos errores abiertamente cuando los cometemos.' },
              { title: 'Impacto social', desc: 'Priorizamos noticias que afectan la vida de los dominicanos.' },
            ].map(({ title, desc }) => (
              <li key={title} className="flex gap-3">
                <span className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-primary" />
                <p className="text-muted-foreground">
                  <strong className="text-foreground">{title}:</strong> {desc}
                </p>
              </li>
            ))}
          </ul>

          <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Cobertura</h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Cubrimos noticias nacionales, política, economía, internacionales, deportes, cultura y tecnología,
            con especial énfasis en temas que afectan a República Dominicana y la región del Caribe y América Latina.
          </p>

          <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Contacto</h2>
          <p className="text-muted-foreground leading-relaxed">
            ¿Tienes una historia que contarnos? ¿Quieres anunciar en nuestro portal? Escríbenos a{' '}
            <a href={`mailto:${EMAIL_REDACCION}`} className="text-primary underline">
              {EMAIL_REDACCION}
            </a>{' '}
            o visita nuestra{' '}
            <Link href="/contact" className="text-primary underline">
              página de contacto
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
