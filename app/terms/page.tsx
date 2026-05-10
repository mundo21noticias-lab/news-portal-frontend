import type { Metadata } from 'next';
import { SITE_URL, EMAIL_REDACCION } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Términos de Uso | MundoXXI',
  description: 'Lee los términos y condiciones de uso del portal de noticias MundoXXI.',
  alternates: { canonical: `${SITE_URL}/terms` },
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-10">
    <h2 className="font-serif text-xl font-bold text-foreground mb-3">{title}</h2>
    <div className="text-muted-foreground leading-relaxed space-y-3">{children}</div>
  </section>
);

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary to-primary/80 py-14">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h1 className="font-serif text-4xl font-bold text-white mb-2">Términos de Uso</h1>
          <p className="text-white/75 text-sm">Última actualización: mayo 2026</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-14 max-w-3xl">
        <Section title="1. Aceptación de los términos">
          <p>
            Al acceder y utilizar MundoXXI (<strong>mundoxxi.com</strong>), aceptas estos Términos de Uso.
            Si no estás de acuerdo, por favor no utilices el sitio.
          </p>
        </Section>

        <Section title="2. Uso del contenido">
          <p>
            Todo el contenido publicado en MundoXXI — artículos, fotografías, gráficos y diseños —
            es propiedad de MundoXXI o de sus proveedores de contenido, y está protegido por las
            leyes de derechos de autor de la República Dominicana y tratados internacionales.
          </p>
          <p>
            Puedes compartir artículos en redes sociales citando la fuente. Queda prohibida la
            reproducción total o parcial sin autorización escrita.
          </p>
        </Section>

        <Section title="3. Conducta del usuario">
          <p>Al usar este sitio, aceptas no:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Publicar contenido difamatorio, obsceno o ilegal.</li>
            <li>Intentar acceder a sistemas sin autorización.</li>
            <li>Distribuir spam, malware o contenido engañoso.</li>
            <li>Suplantar la identidad de personas o entidades.</li>
          </ul>
        </Section>

        <Section title="4. Exactitud de la información">
          <p>
            MundoXXI se esfuerza por publicar información precisa y verificada. Sin embargo, no
            garantizamos la exactitud absoluta de todo el contenido. Si encuentras un error, escríbenos
            a{' '}
            <a href={`mailto:${EMAIL_REDACCION}`} className="text-primary underline">
              {EMAIL_REDACCION}
            </a>{' '}
            para que podamos corregirlo.
          </p>
        </Section>

        <Section title="5. Limitación de responsabilidad">
          <p>
            MundoXXI no se hace responsable de daños directos, indirectos o consecuentes derivados del
            uso o imposibilidad de uso del portal. Los enlaces externos son responsabilidad de sus
            respectivos propietarios.
          </p>
        </Section>

        <Section title="6. Publicidad">
          <p>
            Este sitio puede mostrar publicidad a través de Google AdSense y otras redes. Los anunciantes
            son independientes de la línea editorial de MundoXXI.
          </p>
        </Section>

        <Section title="7. Cambios en los términos">
          <p>
            Nos reservamos el derecho de modificar estos términos en cualquier momento.
            Los cambios serán publicados en esta página con la fecha de actualización.
          </p>
        </Section>

        <Section title="8. Contacto">
          <p>
            Para consultas sobre estos términos, contáctanos en{' '}
            <a href={`mailto:${EMAIL_REDACCION}`} className="text-primary underline">
              {EMAIL_REDACCION}
            </a>.
          </p>
        </Section>
      </div>
    </main>
  );
}
