import { NextResponse } from 'next/server';
import { api } from '@/lib/woocommerce';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, first_name, last_name, turnstileToken } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 });
    }

    if (!turnstileToken) {
      return NextResponse.json({ error: 'Token de seguridad requerido' }, { status: 400 });
    }

    // Validar token con Cloudflare Turnstile
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    if (turnstileSecret) {
      const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${turnstileSecret}&response=${turnstileToken}`,
      });
      const verifyData = await verifyRes.json();
      
      if (!verifyData.success) {
        return NextResponse.json({ error: 'Fallo en la validación de seguridad antibots' }, { status: 403 });
      }
    }

    // Crear cliente en WooCommerce usando el wrapper oficial
    const response = await api.post('customers', {
      email,
      password,
      first_name: first_name || "",
      last_name: last_name || "",
      role: "customer", // Forzar explícitamente el rol de cliente por seguridad
    });

    const data = response.data;

    return NextResponse.json({ success: true, user: data });
  } catch (error: any) {
    console.error("Register Error:", error.response?.data || error.message);
    const errorMessage = error.response?.data?.message || 'Error interno del servidor';
    return NextResponse.json({ error: errorMessage }, { status: error.response?.status || 500 });
  }
}
