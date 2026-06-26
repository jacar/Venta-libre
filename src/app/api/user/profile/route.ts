import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { api } from "@/lib/woocommerce";

export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const customersRes = await api.get("customers", { email: session.user.email });
    const customers = customersRes.data;

    if (!customers || customers.length === 0) {
      return NextResponse.json({ error: 'Cliente no encontrado en WooCommerce' }, { status: 404 });
    }

    return NextResponse.json({ profile: customers[0] });
    
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener perfil' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();

    const customersRes = await api.get("customers", { email: session.user.email });
    const customers = customersRes.data;

    if (!customers || customers.length === 0) {
      return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });
    }

    const customerId = customers[0].id;

    const updateRes = await api.put(`customers/${customerId}`, body);

    return NextResponse.json({ success: true, profile: updateRes.data });
    
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar perfil' }, { status: 500 });
  }
}
