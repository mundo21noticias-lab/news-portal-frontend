/**
 * Genera un ID único y persistente por dispositivo usando UUID v4.
 * Reemplaza el canvas fingerprinting anterior (ética y privacidad).
 */
export function getDeviceId(): string {
    const DEVICE_ID_KEY = 'mundoxxi_device_id';

    if (typeof window === 'undefined') return 'server';

    // Usar ID existente si es válido
    try {
        const stored = localStorage.getItem(DEVICE_ID_KEY);
        if (stored && isValidDeviceId(stored)) return stored;
    } catch {
        // localStorage no disponible (modo privado, etc.)
    }

    // Generar nuevo ID con UUID v4
    const deviceId = `device_${generateUUID()}`;

    try {
        localStorage.setItem(DEVICE_ID_KEY, deviceId);
    } catch (e) {
        console.warn('[DeviceId] No se puede acceder a localStorage:', e);
    }

    return deviceId;
}

/**
 * Genera un UUID v4 usando Web Crypto API (disponible en todos los navegadores modernos)
 */
function generateUUID(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }

    // Fallback para entornos más antiguos
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

/**
 * Valida que el ID de dispositivo tenga el formato correcto
 */
export function isValidDeviceId(deviceId: string): boolean {
    return (
        typeof deviceId === 'string' &&
        deviceId.startsWith('device_') &&
        deviceId.length > 15
    );
}

/**
 * Elimina el ID de dispositivo (útil para testing o a petición del usuario)
 */
export function clearDeviceId(): void {
    if (typeof window !== 'undefined') {
        try {
            localStorage.removeItem('mundoxxi_device_id');
        } catch (e) {
            console.warn('[DeviceId] No se puede limpiar localStorage:', e);
        }
    }
}
