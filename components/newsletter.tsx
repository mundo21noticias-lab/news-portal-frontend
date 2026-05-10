'use client';

import { useState } from 'react';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok || response.status === 200) {
        setIsSubmitted(true);
      } else {
        setErrorMsg(data.error || 'Ocurrió un error. Inténtalo de nuevo.');
      }
    } catch {
      setErrorMsg('Error de conexión. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-br from-secondary to-secondary/80">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex p-4 bg-secondary-foreground/10 rounded-full mb-6">
            <Mail className="h-8 w-8 text-secondary-foreground" />
          </div>

          {/* Content */}
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-secondary-foreground text-balance">
            Mantente informado
          </h2>
          <p className="mt-4 text-lg text-secondary-foreground/90">
            Suscríbete a nuestro boletín y recibe las noticias más importantes directamente en tu
            correo cada mañana.
          </p>

          {/* Form */}
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="mt-8">
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Tu correo electrónico"
                  required
                  className="flex-1 px-4 py-3 rounded-lg bg-secondary-foreground text-secondary placeholder:text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-6"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Enviando
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Suscribirme
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </div>
              {errorMsg && (
                <p className="mt-3 text-sm text-red-300">{errorMsg}</p>
              )}
              <p className="mt-4 text-sm text-secondary-foreground/70">
                Sin spam. Puedes cancelar cuando quieras.
              </p>
            </form>
          ) : (
            <div className="mt-8 flex flex-col items-center gap-3">
              <CheckCircle className="h-12 w-12 text-primary" />
              <p className="text-lg font-semibold text-secondary-foreground">
                ¡Gracias por suscribirte!
              </p>
              <p className="text-secondary-foreground/80">
                Recibirás nuestro próximo boletín muy pronto.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
