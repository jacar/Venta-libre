import { NextResponse } from "next/server";
import crypto from "crypto";
import { api } from "@/lib/woocommerce";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    // 1. Validar la firma del Webhook
    const signature = payload.signature;
    const secret = process.env.WOMPI_EVENTS_SECRET || "";
    
    if (!signature || !signature.properties || !signature.checksum) {
      return NextResponse.json({ error: "Firma inválida" }, { status: 400 });
    }

    let concatString = "";
    for (const prop of signature.properties) {
      const keys = prop.split('.');
      let value = payload.data;
      for (const key of keys) {
        value = value[key];
      }
      concatString += String(value);
    }
    concatString += payload.timestamp;
    concatString += secret;

    const calculatedChecksum = crypto.createHash('sha256').update(concatString).digest('hex');

    if (calculatedChecksum !== signature.checksum) {
      console.error("Firma de Wompi rechazada. Posible intento de fraude.");
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const transaction = payload.data.transaction;

    // Solo procesamos transacciones aprobadas
    if (transaction.status !== "APPROVED") {
      return NextResponse.json({ success: true, message: "Transacción no aprobada, ignorando." });
    }

    // 2. Extraer el ID de la orden de WooCommerce a partir de la referencia (Ej: ORDER-1234-1628182)
    const reference = transaction.reference;
    const parts = reference.split("-");
    const orderId = parts.length > 1 ? parts[1] : null;

    if (!orderId) {
      console.error("No se pudo extraer el orderId de la referencia:", reference);
      return NextResponse.json({ error: "Referencia inválida" }, { status: 400 });
    }

    // 3. Actualizar la orden en WooCommerce a 'processing'
    console.log(`Actualizando orden ${orderId} a pagada...`);
    const wcRes = await api.put(`orders/${orderId}`, {
      status: "processing",
      set_paid: true,
      transaction_id: transaction.id
    });
    
    const wcOrder = wcRes.data;

    // 4. Sincronizar con MasterShop
    const syncMasterShop = async () => {
      const msApiKey = process.env.MASTERSHOP_API_KEY;
      if (!msApiKey) return;
      try {
        const mappedOrderItems = await Promise.all((wcOrder.line_items || []).map(async (item: any) => {
          let finalIdProduct = item.product_id;
          let finalIdVariant = item.variation_id || null;
          
          try {
            const searchName = encodeURIComponent(item.name.trim());
            const msSearchRes = await fetch(`https://prod.api.mastershop.com/api/products?search=${searchName}`, {
                headers: { "ms-api-key": msApiKey }
            });
            
            if (msSearchRes.ok) {
                const msSearchData = await msSearchRes.json();
                const foundProducts = msSearchData.results || [];
                
                const msProduct = foundProducts.find((p: any) => 
                    p.name.toLowerCase() === item.name.toLowerCase() || 
                    item.name.toLowerCase().includes(p.name.toLowerCase()) ||
                    (item.sku && item.sku !== "sin-sku" && p.variation?.some((v: any) => v.sku === item.sku))
                );

                if (msProduct) {
                    finalIdProduct = msProduct.idProduct;
                    if (msProduct.variation && msProduct.variation.length > 0) {
                        const variant = msProduct.variation.find((v: any) => 
                            (item.sku && item.sku !== "sin-sku" && v.sku === item.sku) || 
                            item.name.toLowerCase().includes(v.name.toLowerCase())
                        );
                        if (variant) {
                            finalIdVariant = variant.idVariant;
                        } else if (!finalIdVariant) {
                            const defaultVar = msProduct.variation.find((v: any) => v.name === "Default Variant") || msProduct.variation[0];
                            finalIdVariant = defaultVar?.idVariant || null;
                        }
                    }
                } else {
                    const matches = item.name ? item.name.match(/\b(\d{4,8})\b/g) : null;
                    if (matches) {
                        finalIdProduct = parseInt(matches[matches.length - 1], 10);
                    }
                }
            }
          } catch (e) {
              console.error(`Error buscando producto ${item.name} en Mastershop:`, e);
          }

          return {
              id_variant: finalIdVariant,
              id_product: finalIdProduct,
              quantity: item.quantity,
              sku: item.sku || "sin-sku",
              name: item.name || "Producto WooCommerce",
              weight: 1, 
              price: item.price ? parseFloat(item.price) : 0
          };
        }));

        const documentMeta = wcOrder.meta_data?.find((m: any) => m.key === "Documento")?.value;
        const tagsMeta = wcOrder.meta_data?.find((m: any) => m.key === "Etiquetas")?.value;
        const tags = tagsMeta ? String(tagsMeta).split(",").map(t => t.trim()).filter(Boolean) : [];

        const sanitizeAddress = (addr: string) => {
            if (!addr) return "";
            return addr.replace(/#/g, " No ").replace(/-/g, " ").replace(/[^a-zA-Z0-9\s.,]/g, " ").replace(/\s+/g, " ").trim();
        };

        const mastershopData = {
          id_order: String(orderId),
          notes: [wcOrder.customer_note].filter(Boolean),
          tags: tags,
          shipping_address: {
              country: wcOrder.shipping?.country || "CO",
              state: wcOrder.shipping?.state || "",
              city: wcOrder.shipping?.city || "",
              address1: sanitizeAddress(wcOrder.shipping?.address_1),
              address2: sanitizeAddress(wcOrder.shipping?.address_2) || null,
              company: wcOrder.shipping?.company || null,
              zip: wcOrder.shipping?.postcode || null,
              full_name: `${wcOrder.shipping?.first_name || ""} ${wcOrder.shipping?.last_name || ""}`.trim(),
              first_name: wcOrder.shipping?.first_name || "",
              last_name: wcOrder.shipping?.last_name || "",
              phone: wcOrder.billing?.phone || ""
          },
          billing_address: {
              country: wcOrder.billing?.country || "CO",
              state: wcOrder.billing?.state || "",
              city: wcOrder.billing?.city || "",
              address1: sanitizeAddress(wcOrder.billing?.address_1),
              address2: sanitizeAddress(wcOrder.billing?.address_2) || null,
              company: wcOrder.billing?.company || null,
              zip: wcOrder.billing?.postcode || null,
              full_name: `${wcOrder.billing?.first_name || ""} ${wcOrder.billing?.last_name || ""}`.trim(),
              first_name: wcOrder.billing?.first_name || "",
              last_name: wcOrder.billing?.last_name || "",
              phone: wcOrder.billing?.phone || ""
          },
          order_transaction: {
              total: wcOrder.total ? parseFloat(wcOrder.total) : 0,
              currency: "COP",
              payment_method: "prepaid"
          },
          customer: {
              full_name: `${wcOrder.billing?.first_name || ""} ${wcOrder.billing?.last_name || ""}`.trim(),
              first_name: wcOrder.billing?.first_name || "",
              last_name: wcOrder.billing?.last_name || "",
              email: wcOrder.billing?.email || "",
              phone: wcOrder.billing?.phone || "",
              tags: [],
              documentType: documentMeta ? "CC" : null,
              documentNumber: documentMeta || null
          },
          order_items: mappedOrderItems,
          additional_charge: []
        };

        const msRes = await fetch("https://prod.api.mastershop.com/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json", "ms-api-key": msApiKey },
          body: JSON.stringify(mastershopData)
        });
        
        if (!msRes.ok) {
          console.error(`Error enviando pedido a MasterShop (Status ${msRes.status}):`, await msRes.text());
        }
      } catch (msError: any) {
        console.error("Excepción enviando pedido a MasterShop:", msError?.message || msError);
      }
    };

    // 5. Notificar por WhatsApp
    const notifyWhatsApp = async () => {
      const whatsappApiKey = process.env.CALLMEBOT_API_KEY;
      if (!whatsappApiKey) return;
      try {
        const clientName = `${wcOrder.shipping?.first_name || ""} ${wcOrder.shipping?.last_name || ""}`.trim();
        const clientPhone = wcOrder.billing?.phone || "";
        const clientCity = wcOrder.shipping?.city || "";
        const totalCOP = wcOrder.total ? parseFloat(wcOrder.total).toLocaleString('es-CO') : "0";
        
        const itemsList = wcOrder.line_items?.map((item: any) => `- ${item.name} (x${item.quantity})`).join('\n') || "";
        
        const messageText = `✅ *¡Pago Wompi Aprobado!* (#${orderId})\n\n👤 *Cliente:* ${clientName}\n📞 *Teléfono:* ${clientPhone}\n📍 *Ciudad:* ${clientCity}\n💵 *Total:* $${totalCOP} COP\n💳 *Método:* Pago anticipado (Wompi)\n\n📦 *Productos:*\n${itemsList}`;
        
        const targetPhone = "573052891719";
        const callMeBotUrl = `https://api.callmebot.com/whatsapp.php?phone=${targetPhone}&text=${encodeURIComponent(messageText)}&apikey=${whatsappApiKey}`;
        
        await fetch(callMeBotUrl);
      } catch (waError: any) {
        console.error("Excepción al enviar notificación por WhatsApp:", waError?.message || waError);
      }
    };

    await Promise.allSettled([syncMasterShop(), notifyWhatsApp()]);

    return NextResponse.json({ success: true, message: "Webhook procesado exitosamente" });

  } catch (error: any) {
    console.error("Error procesando Webhook Wompi:", error.message);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
