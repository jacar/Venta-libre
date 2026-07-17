import { NextResponse } from "next/server";
import { api } from "@/lib/woocommerce";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Creamos la orden en estado 'processing' (confirmado)
    const data = {
      payment_method: body.paymentMethod || "cod",
      payment_method_title: body.paymentMethod === "prepaid" ? "Pago anticipado" : "Pago contra entrega",
      status: "processing", 
      set_paid: body.paymentMethod === "prepaid",
      billing: body.billing,
      shipping: body.shipping,
      line_items: body.line_items,
      customer_note: body.supplierNotes || "",
      meta_data: [
        { key: "Documento", value: body.documentNumber || "" },
        { key: "Notas internas", value: body.internalNotes || "" },
        { key: "Etiquetas", value: body.tags || "" },
        { key: "Entregar en transportadora", value: body.pickupOffice ? "Sí" : "No" }
      ]
    };
    // 2. Creamos la orden en WooCommerce
    const response = await api.post("orders", data);
    
    // WooCommerce devuelve en la respuesta el pedido completo incluyendo los datos de los productos (SKU, nombre real, precio).
    const createdOrder = response.data;
    const orderId = createdOrder.id;

    // 3. Enviar a MasterShop (Dropshipping)
    try {
      const msApiKey = process.env.MASTERSHOP_API_KEY;

      // 1. Procesar order items y buscar IDs en Mastershop
      const mappedOrderItems = [];
      for (const item of (createdOrder.line_items || [])) {
          let finalIdProduct = item.product_id;
          let finalIdVariant = item.variation_id || null;

          if (msApiKey) {
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
          } else {
              const matches = item.name ? item.name.match(/\b(\d{4,8})\b/g) : null;
              if (matches) {
                  finalIdProduct = parseInt(matches[matches.length - 1], 10);
              }
          }

          mappedOrderItems.push({
              id_variant: finalIdVariant,
              id_product: finalIdProduct,
              quantity: item.quantity,
              sku: item.sku || "sin-sku",
              name: item.name || "Producto WooCommerce",
              weight: 1, 
              price: item.price ? parseFloat(item.price) : 0
          });
      }

      // Notas: MasterShop espera notas como strings en el array, no objetos
      const notesList = body.supplierNotes ? [body.supplierNotes] : [];

      // Mastershop rechaza caracteres especiales en las direcciones (ej. #, -)
      const sanitizeAddress = (addr: string) => {
          if (!addr) return "";
          // Reemplazar # por "No", - por espacio, y limpiar otros caracteres raros
          return addr.replace(/#/g, " No ").replace(/-/g, " ").replace(/[^a-zA-Z0-9\s.,]/g, " ").replace(/\s+/g, " ").trim();
      };

      const mastershopData = {
        id_order: String(orderId),
        notes: notesList,
        tags: body.tags ? body.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
        shipping_address: {
            country: body.shipping?.country || "CO",
            state: body.shipping?.state || "",
            city: body.shipping?.city || "",
            address1: sanitizeAddress(body.shipping?.address_1),
            address2: sanitizeAddress(body.shipping?.address_2) || null,
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
            address1: sanitizeAddress(body.billing?.address_1),
            address2: sanitizeAddress(body.billing?.address_2) || null,
            company: body.billing?.company || null,
            zip: body.billing?.postcode || null,
            full_name: `${body.billing?.first_name || ""} ${body.billing?.last_name || ""}`.trim(),
            first_name: body.billing?.first_name || "",
            last_name: body.billing?.last_name || "",
            phone: body.billing?.phone || ""
        },
        order_transaction: {
            total: createdOrder.total ? parseFloat(createdOrder.total) : 0,
            currency: "COP",
            payment_method: body.paymentMethod || "cod"
        },
        customer: {
            full_name: `${body.billing?.first_name || ""} ${body.billing?.last_name || ""}`.trim(),
            first_name: body.billing?.first_name || "",
            last_name: body.billing?.last_name || "",
            email: body.billing?.email || "",
            phone: body.billing?.phone || "",
            tags: [],
            documentType: body.documentNumber ? "CC" : null,
            documentNumber: body.documentNumber || null
        },
        order_items: mappedOrderItems,
        additional_charge: []
      };

      console.log("Iniciando sincronización con MasterShop. ¿Tiene API Key?:", !!msApiKey);
      if (msApiKey) {
        const msRes = await fetch("https://prod.api.mastershop.com/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ms-api-key": msApiKey
          },
          body: JSON.stringify(mastershopData)
        });
        
        const msResponseText = await msRes.text();
        if (!msRes.ok) {
          console.error(`Error enviando pedido a MasterShop (Status ${msRes.status}):`, msResponseText);
        } else {
          console.log("Pedido sincronizado correctamente con MasterShop. Respuesta:", msResponseText);
        }
      } else {
        console.warn("No se encontró MASTERSHOP_API_KEY en las variables de entorno.");
      }
    } catch (msError: any) {
      console.error("Excepción enviando pedido a MasterShop:", msError?.message || msError);
    }

    // 4. Enviar notificación por WhatsApp usando CallMeBot
    try {
      const whatsappApiKey = process.env.CALLMEBOT_API_KEY;
      console.log("Iniciando notificación WhatsApp. ¿Tiene API Key?:", !!whatsappApiKey);
      if (whatsappApiKey) {
        const clientName = `${body.shipping?.first_name || ""} ${body.shipping?.last_name || ""}`.trim();
        const clientPhone = body.billing?.phone || "";
        const clientCity = body.shipping?.city || "";
        const totalCOP = createdOrder.total ? parseFloat(createdOrder.total).toLocaleString('es-CO') : "0";
        
        // Formatear items del pedido usando los datos reales devueltos de WooCommerce
        const itemsList = createdOrder.line_items?.map((item: any) => `- ${item.name} (x${item.quantity})`).join('\n') || "";
        
        const messageText = `🛍️ *¡Nuevo pedido registrado!* (#${orderId})\n\n👤 *Cliente:* ${clientName}\n📞 *Teléfono:* ${clientPhone}\n📍 *Ciudad:* ${clientCity}\n💵 *Total:* $${totalCOP} COP\n💳 *Método:* ${body.paymentMethod === "prepaid" ? "Pago anticipado" : "Pago contra entrega"}\n\n📦 *Productos:*\n${itemsList}`;
        
        // El número destino debe ir SIN el prefijo + para evitar error 403 en CallMeBot
        const targetPhone = "573052891719";
        const callMeBotUrl = `https://api.callmebot.com/whatsapp.php?phone=${targetPhone}&text=${encodeURIComponent(messageText)}&apikey=${whatsappApiKey}`;
        
        console.log("Enviando petición a CallMeBot:", callMeBotUrl.replace(whatsappApiKey, "SECRET_KEY"));
        const waRes = await fetch(callMeBotUrl);
        const waResText = await waRes.text();
        if (!waRes.ok) {
          console.error(`Error enviando notificación a CallMeBot (Status ${waRes.status}):`, waResText);
        } else {
          console.log("Notificación de WhatsApp enviada exitosamente. Respuesta:", waResText);
        }
      } else {
        console.warn("No se encontró CALLMEBOT_API_KEY en las variables de entorno. Notificación por WhatsApp omitida.");
      }
    } catch (waError: any) {
      console.error("Excepción al enviar notificación por WhatsApp:", waError?.message || waError);
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
