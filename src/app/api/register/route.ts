import { NextResponse } from 'next/server';
import { api } from '@/lib/woocommerce';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, first_name, last_name } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 });
    }

    // Crear cliente en WooCommerce usando el wrapper oficial
    const response = await api.post('customers', {
      email,
      password,
      first_name: first_name || "",
      last_name: last_name || "",
    });

    const data = response.data;

    return NextResponse.json({ success: true, user: data });
  } catch (error: any) {
    console.error("Register Error:", error.response?.data || error.message);
    const errorMessage = error.response?.data?.message || 'Error interno del servidor';
    return NextResponse.json({ error: errorMessage }, { status: error.response?.status || 500 });
  }
}
