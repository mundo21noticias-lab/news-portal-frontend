#!/bin/bash

# Guía de Verificación de Metadatos SEO - MundoXXI
# Ejecuta estos comandos para validar que los metadatos Open Graph y Twitter Card están funcionando

echo "================================"
echo "VALIDACIÓN DE METADATOS SEO"
echo "================================"
echo ""

# 1. Verificar que Next.js App Router genera metadatos en servidor
echo "1️⃣  VERIFICAR QUE METADATOS SON GENERADOS EN SERVIDOR"
echo "   Comando:"
echo "   curl -s https://mundoxxi.com/articles/[slug] | grep -E 'og:|twitter:'"
echo ""

# 2. ValidarJSON-LD Schema
echo "2️⃣  VERIFICAR JSON-LD (Schema.org)"
echo "   Comando:"
echo "   curl -s https://mundoxxi.com/articles/[slug] | grep -A 20 'application/ld+json'"
echo ""

# 3. Twitter Card Validator
echo "3️⃣  TWITTER CARD VALIDATOR"
echo "   URL: https://cards-dev.twitter.com/validator"
echo "   Pegue: https://mundoxxi.com/articles/[slug]"
echo ""

# 4. Facebook Sharing Debugger
echo "4️⃣  FACEBOOK SHARING DEBUGGER"
echo "   URL: https://developers.facebook.com/tools/debug/sharing"
echo "   Pegue: https://mundoxxi.com/articles/[slug]"
echo ""

# 5. WhatsApp Preview
echo "5️⃣  WHATSAPP PREVIEW"
echo "   Abre WhatsApp → Pega el link y espera a que se cargue la vista previa"
echo "   Debe mostrar: Título, Descripción e Imagen"
echo ""

# 6. Verificar URLs absolutas
echo "6️⃣  VERIFICAR QUE TODAS LAS URLs SON ABSOLUTAS"
echo "   Comando:"
echo "   curl -s https://mundoxxi.com/articles/[slug] | grep -E 'og:image|og:url' | grep 'https://'"
echo ""

# 7. Verificar SSG
echo "7️⃣  VERIFICAR QUE SE GENERÓ COMO SSG"
echo "   En la carpeta: .next/server/app/articles/[slug]/page.html"
echo "   Busca: og:type, og:title, og:image"
echo ""

# 8. Response Headers
echo "8️⃣  VERIFICAR HEADERS HTTP"
echo "   Comando:"
echo "   curl -I https://mundoxxi.com/articles/[slug]"
echo "   Para ver: Content-Type, Cache-Control, ETag"
echo ""

echo "================================"
echo "ESTRUCTURA DE METADATOS ESPERADA"
echo "================================"
echo ""
echo "En el <head> debe haber:"
echo ""
echo "📌 OPEN GRAPH:"
echo '<meta property="og:type" content="article" />'
echo '<meta property="og:title" content="TÍTULO DEL ARTÍCULO" />'
echo '<meta property="og:description" content="DESCRIPCIÓN" />'
echo '<meta property="og:image" content="https://example.com/image.jpg" />'
echo '<meta property="og:url" content="https://mundoxxi.com/articles/slug" />'
echo '<meta property="og:site_name" content="MundoXXI" />'
echo '<meta property="article:published_time" content="..." />'
echo '<meta property="article:modified_time" content="..." />'
echo '<meta property="article:author" content="..." />'
echo ""
echo "📌 TWITTER CARD:"
echo '<meta name="twitter:card" content="summary_large_image" />'
echo '<meta name="twitter:site" content="@MundoXXI" />'
echo '<meta name="twitter:title" content="TÍTULO" />'
echo '<meta name="twitter:description" content="DESCRIPCIÓN" />'
echo '<meta name="twitter:image" content="https://example.com/image.jpg" />'
echo ""
echo "📌 CANONICAL:"
echo '<link rel="canonical" href="https://mundoxxi.com/articles/slug" />'
echo ""
echo "📌 JSON-LD (Schema.org):"
echo '{'
echo '  "@context": "https://schema.org",'
echo '  "@type": "NewsArticle",'
echo '  "headline": "...",'
echo '  "image": "...",'
echo '  "datePublished": "...",'
echo '  "dateModified": "...",'
echo "  ..."
echo '}'
echo ""

echo "================================"
echo "ARCHIVOS IMPLEMENTADOS"
echo "================================"
echo ""
echo "✅ lib/metadata-utils.ts"
echo "   - generateDynamicMetadata() - Genera OG + Twitter dinámicamente"
echo "   - ensureAbsoluteUrl() - Convierte URLs relativas a absolutas"
echo "   - isPublicImageUrl() - Valida URLs de CDN públicos"
echo ""
echo "✅ lib/schema-utils.ts"
echo "   - generateNewsArticleSchema() - Crea JSON-LD para artículos"
echo ""
echo "✅ components/article-json-ld.tsx"
echo "   - ArticleJsonLd - Componente que inyecta el schema"
echo ""
echo "✅ app/articles/[slug]/page.tsx"
echo "   - generateMetadata() - Genera metadatos dinámicos usando utils"
echo "   - Incluye JSON-LD schema"
echo ""
echo "✅ app/category/[slug]/page.tsx"
echo "   - Metadatos dinámicos para categorías"
echo ""
echo "✅ app/search/page.tsx"
echo "   - Metadatos dinámicos basados en query"
echo ""

echo "================================"
echo "PRÓXIMOS PASOS"
echo "================================"
echo ""
echo "1. npm run build (ya completado ✓)"
echo "2. npm run start (Verifica localmente)"
echo "3. Deploya a Vercel con: vercel deploy"
echo "4. Ejecuta validadores externos"
echo "5. Prueba compartiendo en WhatsApp/Facebook/Twitter"
echo ""
