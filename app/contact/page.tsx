'use client';

import { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EMAIL_REDACCION, EMAIL_PUBLICIDAD } from '@/lib/constants';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    // Simulated send — conectar a SendGrid/Resend en producción
    await new Promise((r) => setTimeout(r, 800));
    setStatus('success');
  };

  const contacts = [
    { label: 'Redacción', email: EMAIL_REDACCION, desc: 'Noticias, verificaciones y correcciones' },
    { label: 'Publicidad', email: EMAIL_PUBLICIDAD, desc: 'Espacios publicitarios y patrocinios' },
  ];

  return (
    <main className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary to-primary/80 py-16">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-3">Contacto</h1>
          <p className="text-white/85 text-lg">Estamos aquí para escucharte</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Emails */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Escríbenos</h2>
            <div className="space-y-4 mb-8">
              {contacts.map(({ label, email, desc }) => (
                <a
                  key={label}
                  href={`mailto:${email}`}
                  className="flex gap-4 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors group"
                >
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors flex-shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{label}</p>
                    <p className="text-sm text-primary">{email}</p>
                    <p className="text-sm text-muted-foreground mt-1">{desc}</p>
                  </div>
                </a>
              ))}
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Tiempo de respuesta:</strong> Respondemos en un plazo
                de 24–48 horas hábiles.
              </p>
            </div>
          </div>

          {/* Form */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
              <MessageSquare className="inline h-6 w-6 text-primary mr-2" />
              Formulario
            </h2>
            {status === 'success' ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <CheckCircle className="h-14 w-14 text-green-500" />
                <p className="font-semibold text-foreground text-lg">¡Mensaje enviado!</p>
                <p className="text-muted-foreground">Te responderemos lo antes posible.</p>
                <Button variant="outline" onClick={() => { setForm({ name: '', email: '', subject: '', message: '' }); setStatus('idle'); }}>
                  Enviar otro mensaje
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { id: 'name', label: 'Nombre', type: 'text', placeholder: 'Tu nombre completo' },
                  { id: 'email', label: 'Correo electrónico', type: 'email', placeholder: 'tu@correo.com' },
                  { id: 'subject', label: 'Asunto', type: 'text', placeholder: '¿En qué podemos ayudarte?' },
                ].map(({ id, label, type, placeholder }) => (
                  <div key={id}>
                    <label htmlFor={id} className="block text-sm font-medium text-foreground mb-1">{label}</label>
                    <input
                      id={id}
                      type={type}
                      required
                      value={(form as any)[id]}
                      onChange={(e) => setForm((p) => ({ ...p, [id]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                ))}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">Mensaje</label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                    placeholder="Escribe tu mensaje aquí..."
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>
                <Button type="submit" disabled={status === 'loading'} className="w-full bg-primary text-primary-foreground">
                  {status === 'loading' ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Enviando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2"><Send className="h-4 w-4" />Enviar mensaje</span>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
