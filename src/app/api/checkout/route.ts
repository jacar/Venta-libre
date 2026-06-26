import { NextResponse } from "next/server";
import { api } from "@/lib/woocommerce";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Pago Contra Entrega (COD) para Dropshipping
    const data = {
      payment_method: "cod",
      payment_method_title: "Pago contra entrega",
      status: "processing", // Importante para que MasterShop lo detecte
      set_paid: false,
      billing: body.billing,
      shipping: body.shipping,
      line_items: body.line_items,
    };

    const response = await api.post("orders", data);
    
    return NextResponse.json({ success: true, orderId: response.data.id });
  } catch (error: any) {
    console.error("Error creating order:", error.response?.data || error.message);
    return NextResponse.json(
      { success: false, message: error.response?.data?.message || "Error al crear la orden" },
      { status: 500 }
    );
  }
}
