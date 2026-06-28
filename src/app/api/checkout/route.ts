import { NextResponse } from "next/server";
import { api } from "@/lib/woocommerce";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Creamos la orden en 'pending'
    const data = {
      payment_method: "cod",
      payment_method_title: "Pago contra entrega",
      status: "pending", 
      set_paid: false,
      billing: body.billing,
      shipping: body.shipping,
      line_items: body.line_items,
    };

    const response = await api.post("orders", data);
    const orderId = response.data.id;
    
    // La orden se crea en estado 'pending' (Pendiente de pago)
    // tal cual fue solicitada, sin forzar cambio de estado.

    // 3. Enviar a MasterShop (Dropshipping)
    try {
      const mastershopData = {
        id_order: String(orderId),
        notes: [],
        tags: [],
        shipping_address: {
            country: body.shipping?.country || "CO",
            state: body.shipping?.state || "",
            city: body.shipping?.city || "",
            address1: body.shipping?.address_1 || "",
            address2: body.shipping?.address_2 || null,
            company: body.shipping?.company || null,
            zip: body.shipping?.postcode || null,
            full_name: `${body.shipping?.first_name || ""} ${body.shipping?.last_name || ""}`.trim(),
            first_name: body.shipping?.first_name || "",
            last_name: body.shipping?.last_name || "",
            phone: body.billing?.phone || ""
        },
        billing_address: {
            country: body.billing?.country || "CO",
            state: body.billing?.state || "",
            city: body.billing?.city || "",
            address1: body.billing?.address_1 || "",
            address2: body.billing?.address_2 || null,
            company: body.billing?.company || null,
            zip: body.billing?.postcode || null,
            full_name: `${body.billing?.first_name || ""} ${body.billing?.last_name || ""}`.trim(),
            first_name: body.billing?.first_name || "",
            last_name: body.billing?.last_name || "",
            phone: body.billing?.phone || ""
        },
        order_transaction: {
            total: response.data.total ? parseFloat(response.data.total) : 0,
            currency: "COP",
            payment_method: "cod"
        },
        customer: {
            full_name: `${body.billing?.first_name || ""} ${body.billing?.last_name || ""}`.trim(),
            first_name: body.billing?.first_name || "",
            last_name: body.billing?.last_name || "",
            email: body.billing?.email || "",
            phone: body.billing?.phone || "",
            tags: [],
            documentType: null,
            documentNumber: null
        },
        order_items: body.line_items?.map((item: any) => ({
            id_variant: item.variation_id || null,
            id_product: item.product_id,
            quantity: item.quantity,
            sku: item.sku || "",
            name: item.name || "",
            weight: 1, 
            price: item.price || 0
        })) || [],
        additional_charge: []
      };

      const msApiKey = process.env.MASTERSHOP_API_KEY;
      if (msApiKey) {
        const msRes = await fetch("https://prod.api.mastershop.com/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ms-api-key": msApiKey
          },
          body: JSON.stringify(mastershopData)
        });
        
        if (!msRes.ok) {
          console.error("Error enviando pedido a MasterShop:", await msRes.text());
        } else {
          console.log("Pedido sincronizado correctamente con MasterShop.");
        }
      } else {
        console.warn("No se encontró MASTERSHOP_API_KEY en las variables de entorno.");
      }
    } catch (msError) {
      console.error("Excepción enviando pedido a MasterShop:", msError);
    }
    
    return NextResponse.json({ success: true, orderId: orderId });
  } catch (error: any) {
    console.error("Error creating order:", error.response?.data || error.message);
    return NextResponse.json(
      { success: false, message: error.response?.data?.message || "Error al crear la orden" },
      { status: 500 }
    );
  }
}
