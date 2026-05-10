import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase-config';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = (body?.email || '').trim().toLowerCase();

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Por favor ingresa un correo electrónico válido.' },
        { status: 400 }
      );
    }

    const subscribersRef = collection(db, 'newsletter_subscribers');

    // Verificar si ya está suscrito
    const existingQuery = query(subscribersRef, where('email', '==', email));
    const existing = await getDocs(existingQuery);

    if (!existing.empty) {
      return NextResponse.json(
        { message: 'Este correo ya está suscrito a nuestro boletín.' },
        { status: 200 }
      );
    }

    // Guardar nuevo suscriptor
    await addDoc(subscribersRef, {
      email,
      subscribedAt: new Date(),
      isActive: true,
      source: 'homepage_newsletter',
    });

    return NextResponse.json(
      { message: 'Te has suscrito correctamente. ¡Gracias!' },
      { status: 201 }
    );
  } catch (error) {
    console.error('[Newsletter] Error al suscribir:', error);
    return NextResponse.json(
      { error: 'Error interno. Intenta de nuevo más tarde.' },
      { status: 500 }
    );
  }
}
