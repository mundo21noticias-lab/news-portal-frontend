import { NextRequest, NextResponse } from 'next/server';
import { doc, updateDoc, increment, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase-config';

interface TrackViewRequest {
    articleId: string;
    articleSlug: string;
    deviceId: string;
    timestamp?: string;
}

/**
 * Valida los datos requeridos para rastrear una vista.
 * Retorna un mensaje de error si es inválido, o null si es válido.
 */
function validateTrackingRequest(body: Partial<TrackViewRequest>): string | null {
    const { articleId, deviceId } = body;
    if (!articleId || !deviceId) {
        return 'Missing required fields: articleId, deviceId';
    }
    if (!deviceId.startsWith('device_') || deviceId.length < 20) {
        return 'Invalid device ID format';
    }
    return null;
}

/**
 * POST /api/articles/track-view
 * Incrementa el contador de vistas de un artículo
 * Validación: 1 vista por deviceId (evita inflado de números)
 */
export async function POST(request: NextRequest) {
    try {
        const body: Partial<TrackViewRequest> = await request.json();
        const { articleId, articleSlug, deviceId, timestamp } = body;

        const validationError = validateTrackingRequest(body);
        if (validationError) {
            return NextResponse.json({ error: validationError }, { status: 400 });
        }

        // El chequeo de validationError asegura que estas variables existan, 
        // pero TypeScript aún puede quejarse si no le decimos que son strings,
        // así que podemos usar aserciones no nulas o dejarlas que fluyan.
        const safeArticleId = articleId!;
        const safeDeviceId = deviceId!;

        // Obtener documento del artículo
        const articleRef = doc(db, 'articles', safeArticleId);
        const articleDoc = await getDoc(articleRef);

        if (!articleDoc.exists()) {
            return NextResponse.json(
                { error: 'Article not found', slug: articleSlug },
                { status: 404 }
            );
        }

        // Obtener o crear subcollection de vistas
        const viewsRef = doc(db, 'articles', safeArticleId, 'views', safeDeviceId);
        const viewDoc = await getDoc(viewsRef);

        // Si ya existe vista de este dispositivo, no incrementar
        if (viewDoc.exists()) {
            console.log(`View already tracked for article ${articleSlug} from device ${safeDeviceId}`);
            return NextResponse.json(
                {
                    success: false,
                    message: 'View already tracked for this device',
                    articleId: safeArticleId,
                    articleSlug,
                },
                { status: 200 }
            );
        }

        // Registrar nueva vista
        await setDoc(viewsRef, {
            deviceId: safeDeviceId,
            timestamp: timestamp || new Date().toISOString(),
            userAgent: request.headers.get('user-agent') || 'unknown',
            referer: request.headers.get('referer') || 'direct',
        });

        // Incrementar totalViews en el artículo
        await updateDoc(articleRef, {
            totalViews: increment(1),
            uniqueViews: increment(1), // También incrementar unique views
            lastViewedAt: new Date().toISOString(),
        });

        console.log(`✅ View tracked for article ${articleSlug} from device ${safeDeviceId}`);

        return NextResponse.json(
            {
                success: true,
                message: 'View tracked successfully',
                articleId: safeArticleId,
                articleSlug,
                deviceId: `${safeDeviceId.substring(0, 20)}...`, // No devolver deviceId completo
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error tracking view:', error);
        return NextResponse.json(
            {
                error: 'Internal server error',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

/**
 * GET /api/articles/track-view
 * Para verificar que el endpoint existe (health check)
 */
export async function GET() {
    return NextResponse.json(
        { status: 'ok', message: 'Article view tracking API is running' },
        { status: 200 }
    );
}
