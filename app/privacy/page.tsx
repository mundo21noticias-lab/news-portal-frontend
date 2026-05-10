import type { Metadata } from 'next';
import { SITE_URL, EMAIL_REDACCION } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Política de Privacidad | MundoXXI',
  description: 'Conoce cómo MundoXXI recopila, usa y protege tu información personal.',
  alternates: { canonical: `${SITE_URL}/privacy` },
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-10">
    <h2 className="font-serif text-xl font-bold text-foreground mb-3">{title}</h2>
    <div className="text-muted-foreground leading-relaxed space-y-3">{children}</div>
  </section>
);

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-secondary to-secondary/80 py-14">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h1 className="font-serif text-4xl font-bold text-white mb-2">Política de Privacidad</h1>
          <p className="text-white/75 text-sm">Última actualización: mayo 2026</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-14 max-w-3xl">
        <Section title="1. Información que recopilamos">
          <p>Recopilamos información limitada para brindar y mejorar nuestros servicios:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Correo electrónico:</strong> cuando te suscribes a nuestro boletín.</li>
            <li><strong>Datos de uso:</strong> páginas visitadas, tiempo de lectura y artículos leídos (de forma anónima).</li>
            <li><strong>Identificador de dispositivo:</strong> generado localmente en tu navegador para contar vistas únicas. No se comparte con terceros.</li>
          </ul>
        </Section>

        <Section title="2. Uso de la información">
          <p>Usamos la información exclusivamente para:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Enviar el boletín de noticias a suscriptores que lo solicitaron.</li>
            <li>Medir el desempeño editorial (artículos más leídos, categorías populares).</li>
            <li>Mejorar la experiencia de usuario en el portal.</li>
          </ul>
          <p>No vendemos, alquilamos ni compartimos tu información personal con terceros.</p>
        </Section>

        <Section title="3. Cookies y tecnologías de rastreo">
          <p>
            Usamos cookies esenciales para el funcionamiento del sitio (sesión de tema, preferencias).
            También utilizamos <strong>Google Analytics</strong> y <strong>Vercel Analytics</strong>
            para medir el tráfico de forma agregada y anónima.
          </p>
          <p>
            Puedes deshabilitar las cookies en la configuración de tu navegador. Algunas funcionalidades
            pueden verse afectadas.
          </p>
        </Section>

        <Section title="4. Almacenamiento de datos">
          <p>
            Los datos de suscriptores se almacenan de forma segura en <strong>Google Firebase</strong>,
            con cifrado en tránsito (HTTPS/TLS) y en reposo. Cumplimos con los estándares de seguridad
            de la industria.
          </p>
        </Section>

        <Section title="5. Tus derechos">
          <p>Tienes derecho a:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Acceder a la información que tenemos sobre ti.</li>
            <li>Solicitar la corrección o eliminación de tus datos.</li>
            <li>Cancelar tu suscripción al boletín en cualquier momento.</li>
          </ul>
          <p>
            Para ejercer estos derechos, escríbenos a{' '}
            <a href={`mailto:${EMAIL_REDACCION}`} className="text-primary underline">
              {EMAIL_REDACCION}
            </a>.
          </p>
        </Section>

        <Section title="6. Cambios en esta política">
          <p>
            Podemos actualizar esta política periódicamente. Te notificaremos sobre cambios
            significativos mediante un aviso en el portal o por correo electrónico si estás suscrito.
          </p>
        </Section>

        <Section title="7. Contacto">
          <p>
            Si tienes preguntas sobre esta política, contáctanos en{' '}
            <a href={`mailto:${EMAIL_REDACCION}`} className="text-primary underline">
              {EMAIL_REDACCION}
            </a>.
          </p>
        </Section>
      </div>
    </main>
  );
}
