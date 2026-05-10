# Sistema de Tracking de Vistas - Documentación

## 📊 Descripción General

Se implementó un sistema de conteo de vistas **1 por dispositivo** para evitar inflado de números cuando un usuario recarga la página múltiples veces.

## 🔧 Cómo Funciona

### 1. **Device ID Único**
   - Se genera un ID único por dispositivo basado en:
     - User Agent del navegador
     - Resolución de pantalla
     - Profundidad de color
     - Idioma del navegador
     - Zona horaria
     - Número de cores del CPU
     - Memoria disponible
     - Canvas Fingerprint
   
   - Se guarda en `localStorage` para consistencia
   - **Archivo**: `lib/device-utils.ts`

### 2. **Hook di Tracking**
   - Se ejecuta automáticamente cuando se monta el componente ArticleDetail
   - Se ejecuta **UNA SOLA VEZ** por sesión (usando `useRef`)
   - Llama a la API `/api/articles/track-view`
   
   - **Archivo**: `hooks/use-track-view.ts`

### 3. **API Endpoint**
   - **Ruta**: `POST /api/articles/track-view`
   - **Request**:
     ```json
     {
       "articleId": "string",      // ID en Firebase
       "articleSlug": "string",    // Slug del artículo
       "deviceId": "string",       // Device ID único
       "timestamp": "ISO-8601"     // Timestamp de la vista
     }
     ```

   - **Lógica**:
     1. Valida que el `deviceId` sea válido
     2. Busca si ya existe vista del mismo dispositivo
     3. Si NO existe → Incrementa `totalViews` y `uniqueViews`
     4. Si SÍ existe → Retorna 200 OK sin incrementar
   
   - **Archivo**: `app/api/articles/track-view/route.ts`

### 4. **Integración en Firebase**
   - Crea subcollection `articles/{articleId}/views/{deviceId}`
   - Guarda metadata de cada vista:
     ```json
     {
       "deviceId": "device_..._",
       "timestamp": "2026-03-27T...",
       "userAgent": "Mozilla/5.0...",
       "referer": "https://..."
     }
     ```
   
   - Incrementa campos en el documento principal:
     - `totalViews`: +1
     - `uniqueViews`: +1
     - `lastViewedAt`: timestamp actual

## 📈 Estructura en Firebase

```
articles/
  ├── {articleId}
  │   ├── title: string
  │   ├── totalViews: number
  │   ├── uniqueViews: number
  │   ├── lastViewedAt: timestamp
  │   └── views/ (subcollection)
  │       └── {deviceId}
  │           ├── deviceId: string
  │           ├── timestamp: ISO-8601
  │           ├── userAgent: string
  │           └── referer: string
```

## 🔌 Integración en Componentes

### En `components/article-detail.tsx`:
```typescript
import { useTrackView } from '@/hooks/use-track-view';

export function ArticleDetail({ article, ... }) {
  // Rastrea la vista automáticamente
  useTrackView(article.id, article.slug || article.title);
  
  // El resto del componente...
}
```

## 📊 Funciones Auxiliares (firebase-service.ts)

### 1. `getArticleViewStats(articleId)`
   Obtiene estadísticas de vistas de un artículo
   
   ```typescript
   const stats = await getArticleViewStats('article-id');
   // Retorna: { totalViews: 42, uniqueDevices: 38, lastViewedAt: '...' }
   ```

### 2. `getMostViewedArticles(limit)`
   Obtiene los artículos más vistos
   
   ```typescript
   const articles = await getMostViewedArticles(10);
   ```

### 3. `getTrendingArticles(limit)`
   Obtiene artículos tendencia (top vistas últimos 7 días)
   
   ```typescript
   const trending = await getTrendingArticles(5);
   ```

## 🛡️ Seguridad y Validaciones

- ✅ Validación de `articleId` contra Firebase
- ✅ Validación de `deviceId` (debe ser valid format)
- ✅ Una vista por dispositivo garantizada
- ✅ Prevención de conteo duplicado (usando subcollection)
- ✅ Rate limiting implícito (máx 1 vista por deviceId por artículo)

## ⚠️ Consideraciones

### Limitaciones
- El device ID puede cambiar si:
  - El usuario limpia localStorage
  - Usa modo incógnito
  - Cambia de navegador
  - Accede desde otro dispositivo

- No hay tracking cross-device (esto es intencional para privacidad)

### Privacidad
- ✅ No se guarda IP del cliente
- ✅ Solo User-Agent (no información personal)
- ✅ Cada vista se asocia a un device ID anónimo
- ✅ Sin cookies de third-party tracking

## 🧪 Testing

### Verificar que funciona en desarrollo:

1. **Inspect Network**: 
   ```bash
   # En DevTools → Network tab
   # Al cargar un artículo debe haber un POST a /api/articles/track-view
   ```

2. **Revisar localStorage**:
   ```javascript
   // En console
   localStorage.getItem('MundoXXI_device_id')
   // Debe retornar algo como: "device_a1b2c3d4_1711532800000"
   ```

3. **Verificar en Firebase**:
   - Firestore Console
   - Ir a `articles/{articleId}/views`
   - Debe aparecer un documento con el deviceId como ID

4. **Simular máquinas diferentes**:
   ```bash
   # Terminal 1: Chrome
   npm run dev
   # Abre http://localhost:3000/articles/test
   
   # Terminal 2: Firefox (otro navegador = otro deviceId)
   # La vista debe contar como diferente
   
   # Luego abre el mismo artículo en Chrome otra vez
   # No debe incrementar (mismo deviceId)
   ```

## 📝 Monitoreo

### Queries útiles en Firebase Console:

```firestore
# Artículos más vistos
db.collection('articles')
  .orderBy('totalViews', 'desc')
  .limit(10)

# Vistas recientes
db.collectionGroup('views')
  .orderBy('timestamp', 'desc')
  .limit(100)

# Devices únicos de un artículo
db.collection('articles')
  .doc('{articleId}')
  .collection('views')
  .get()
  .then(snap => console.log('Unique devices:', snap.size))
```

## 🚀 Próximos Pasos (Opcionales)

1. **Analytics Dashboard**: Mostrar top artículos por vistas
2. **Real-time Updates**: WebSocket para mostrar vistas en vivo
3. **Heatmaps**: Crear mapas de donde más se lee
4. **Export Data**: Reportes de vistas por período
5. **Bot Detection**: Detectar y filtrar bots
6. **Duplicate Prevention**: Hashear deviceId para mayor seguridad

## 📞 Debugging

### Si la vista no se registra:

1. **Revisar console**:
   ```javascript
   // Error en /api/articles/track-view?
   console.log('Error tracking view:', error)
   ```

2. **Verificar endpoint**:
   ```bash
   curl -X POST http://localhost:3000/api/articles/track-view \
     -H "Content-Type: application/json" \
     -d '{
       "articleId": "test-id",
       "articleSlug": "test-slug",
       "deviceId": "device_test123_999",
       "timestamp": "2026-03-27T00:00:00Z"
     }'
   ```

3. **Revisar Firebase Rules**:
   - Asegúrate que tienes permisos para escribir a `articles/{articleId}/views/{deviceId}`
   - Las subcollections deben permitir escritura

## 📚 Archivos Implementados

```
lib/
  ├── device-utils.ts          ✅ Generador de Device ID
  └── firebase-service.ts      ✅ (Actualizado con nuevas funciones)

hooks/
  └── use-track-view.ts        ✅ Hook de tracking

app/api/articles/
  └── track-view/
      └── route.ts             ✅ Endpoint de tracking

components/
  └── article-detail.tsx       ✅ (Actualizado para usar hook)
```
