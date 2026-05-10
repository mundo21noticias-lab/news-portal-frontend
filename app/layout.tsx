import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Source_Sans_3 } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: '--font-serif',
  display: 'swap',
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: '--font-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#FF6A00',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://mundoxxi.com'),
  title: 'MundoXXI - Noticias de República Dominicana',
  description: 'Es mejor una verdad dolorosa que una mentira inútil. Lee las últimas noticias de RD, América Latina y el mundo. Periodismo independiente y verificado desde República Dominicana.',
  keywords: ['noticias RD', 'noticias República Dominicana', 'noticias dominicanas', 'periodismo RD', 'mundoxxi', 'noticias actuales', 'noticias de hoy'],
  authors: [{ name: 'MundoXXI Noticias' }],
  creator: 'MundoXXI',
  publisher: 'MundoXXI Noticias',
  referrer: 'strict-origin-when-cross-origin',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  icons: {
    icon: [
      {
        url: '/favicon.png',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'es_DO',
    url: 'https://mundoxxi.com',
    siteName: 'MundoXXI',
    title: 'MundoXXI - Noticias de República Dominicana',
    description: 'Es mejor una verdad dolorosa que una mentira inútil. Noticias de RD, América Latina y el mundo. Periodismo independiente.',
    images: [
      {
        url: 'https://mundoxxi.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MundoXXI - Noticias de República Dominicana',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@mundoxxi',
    creator: '@mundoxxi',
    title: 'MundoXXI - Noticias de RD',
    description: 'Es mejor una verdad dolorosa que una mentira inútil.',
    images: ['https://mundoxxi.com/og-image.png'],
  },
  category: 'news',
  classification: 'News',
  alternates: {
    languages: {
      'es-DO': 'https://mundoxxi.com',
      'es': 'https://mundoxxi.com',
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${sourceSans.variable}`} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#FF6A00" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'NewsMediaOrganization',
              name: 'MundoXXI',
              alternateName: 'MXI Noticias',
              url: 'https://mundoxxi.com',
              logo: 'https://mundoxxi.com/logo.png',
              description: 'Es mejor una verdad dolorosa que una mentira inútil. Noticias de República Dominicana.',
              sameAs: [
                'https://twitter.com/mundoxxi',
                'https://facebook.com/mundoxxi',
                'https://instagram.com/mundoxxi',
              ],
              foundingDate: '2026',
              areaServed: 'DO',
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Media Relations',
                email: 'redaccion@mundoxxi.com',
              },
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground" suppressHydrationWarning>
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
