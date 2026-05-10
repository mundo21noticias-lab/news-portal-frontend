'use client';

import { useEffect, useRef } from 'react';
import { getDeviceId } from '@/lib/device-utils';

/**
 * Hook que rastrea las vistas de un artículo por dispositivo
 * Se ejecuta una sola vez por session para evitar múltiples registros
 *
 * @param articleId - ID del artículo en Firebase
 * @param articleSlug - Slug del artículo para logging
 */
export function useTrackView(articleId: string, articleSlug: string) {
    const hasTrackedRef = useRef(false);

    useEffect(() => {
        // Evitar tracking duplicado
        if (hasTrackedRef.current) return;
        hasTrackedRef.current = true;

        // Esperar a que el DOM esté listo
        if (typeof window === 'undefined') return;

        const trackView = async () => {
            try {
                const deviceId = getDeviceId();

                const response = await fetch('/api/articles/track-view', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        articleId,
                        articleSlug,
                        deviceId,
                        timestamp: new Date().toISOString(),
                    }),
                });

                if (!response.ok) {
                    console.warn(`Failed to track view for article ${articleSlug}:`, response.statusText);
                }
            } catch (error) {
                console.error('Error tracking article view:', error);
                // No lanzar error - el tracking es no-crítico
            }
        };

        // Rastrear después de que el componente esté montado
        trackView();
    }, [articleId, articleSlug]);
}
