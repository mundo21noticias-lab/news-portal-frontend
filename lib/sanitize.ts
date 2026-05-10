/**
 * Sanitizador HTML ligero para prevenir XSS
 * No requiere dependencias externas — funciona en SSR y cliente
 */

/**
 * Elimina elementos y atributos peligrosos del HTML de artículos.
 * Conserva el contenido editorial (imágenes, videos, tablas, iframes de YouTube).
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';

  let sanitized = html;

  // 1. Eliminar etiquetas <script> con su contenido
  sanitized = sanitized.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ''
  );

  // 2. Eliminar etiquetas <style> con su contenido
  sanitized = sanitized.replace(
    /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
    ''
  );

  // 3. Eliminar manejadores de eventos (onclick, onload, onerror, etc.)
  sanitized = sanitized.replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '');

  // 4. Eliminar javascript: y vbscript: en href/src
  sanitized = sanitized.replace(
    /(href|src|action)\s*=\s*["']\s*(javascript|vbscript|data):[^"']*/gi,
    '$1="#"'
  );

  // 5. Eliminar <meta>, <link>, <base> (pueden redirigir o cargar recursos externos)
  sanitized = sanitized.replace(/<(meta|link|base)\b[^>]*\/?>/gi, '');

  // 6. Eliminar formularios e inputs (no son contenido editorial)
  sanitized = sanitized.replace(
    /<(form|input|button|select|textarea)\b[^>]*>[\s\S]*?<\/\1>/gi,
    ''
  );
  sanitized = sanitized.replace(/<(form|input|button|select|textarea)\b[^>]*\/?>/gi, '');

  // 7. Eliminar <object> y <embed> (vectores clásicos de XSS)
  sanitized = sanitized.replace(/<(object|embed)\b[^>]*>[\s\S]*?<\/\1>/gi, '');
  sanitized = sanitized.replace(/<(object|embed)\b[^>]*\/?>/gi, '');

  return sanitized;
}
