import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { api } from "@/lib/woocommerce";

export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Buscar al cliente por email
    const customersRes = await api.get("customers", { email: session.user.email });
    const customers = Array.isArray(customersRes.data) ? customersRes.data : [];

    if (customers.length === 0) {
      return NextResponse.json({ orders: [] }); // Sin cuenta de cliente = sin pedidos
    }

    const customerId = customers[0].id;

    // Buscar pedidos
    const ordersRes = await api.get("orders", { customer: customerId });
    const ordersData = Array.isArray(ordersRes.data) ? ordersRes.data : [];
    return NextResponse.json({ orders: ordersData });
    
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: 'Error al obtener pedidos' }, { status: 500 });
  }
}
