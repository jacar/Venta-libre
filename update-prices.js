const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || "",
  consumerKey: process.env.WOOCOMMERCE_KEY || "",
  consumerSecret: process.env.WOOCOMMERCE_SECRET || "",
  version: "wc/v3",
  queryStringAuth: true
});

const MARGEN = 30000;

function cleanData(data) {
  if (typeof data === "string") {
    const jsonStart = data.indexOf("[");
    const jsonStartObj = data.indexOf("{");
    let startIdx = -1;

    if (jsonStart !== -1 && jsonStartObj !== -1) {
      startIdx = Math.min(jsonStart, jsonStartObj);
    } else {
      startIdx = jsonStart !== -1 ? jsonStart : jsonStartObj;
    }

    if (startIdx !== -1) {
      const lastBracket = data.lastIndexOf("]");
      const lastBrace = data.lastIndexOf("}");
      const endIdx = Math.max(lastBracket, lastBrace);

      if (endIdx !== -1) {
        const cleanJsonStr = data.substring(startIdx, endIdx + 1);
        try {
          return JSON.parse(cleanJsonStr);
        } catch (err) {
          console.error("Error al parsear JSON limpio:", err);
        }
      }
    }
  }
  return data;
}

async function processVariations(productId) {
  try {
    const response = await api.get(`products/${productId}/variations`, { per_page: 100 });
    const variations = cleanData(response.data);
    if (!variations || variations.length === 0) return 0;

    const updateData = [];
    for (const v of variations) {
      const currentPrice = parseFloat(v.price || 0);
      if (!isNaN(currentPrice) && currentPrice > 0) {
        updateData.push({
          id: v.id,
          regular_price: (currentPrice + MARGEN).toString()
        });
        console.log(`  -> Variación ${v.id} | ${currentPrice} -> ${currentPrice + MARGEN}`);
      }
    }

    if (updateData.length > 0) {
      await api.post(`products/${productId}/variations/batch`, { update: updateData });
      return updateData.length;
    }
  } catch (error) {
    console.error(`  ❌ Error obteniendo/actualizando variaciones del prod ${productId}`, error.message);
  }
  return 0;
}

async function updatePrices() {
  console.log(`🚀 Iniciando actualización de precios (+ $${MARGEN})...`);
  let page = 1;
  let hasMore = true;
  let totalUpdated = 0;

  try {
    while (hasMore) {
      console.log(`\n📦 Obteniendo página ${page}...`);
      const response = await api.get("products", {
        per_page: 50,
        page: page,
      });

      const products = cleanData(response.data);
      if (products.length === 0) {
        hasMore = false;
        break;
      }

      console.log(`Se encontraron ${products.length} productos en esta página. Procesando...`);
      
      const simpleUpdates = [];

      for (const product of products) {
        const currentPrice = parseFloat(product.price || 0);

        if (product.type === "simple") {
          if (!isNaN(currentPrice) && currentPrice > 0) {
            simpleUpdates.push({
              id: product.id,
              regular_price: (currentPrice + MARGEN).toString()
            });
            console.log(`- Producto (Simple): ${product.name} | ${currentPrice} -> ${currentPrice + MARGEN}`);
          }
        } else if (product.type === "variable") {
          console.log(`- Producto (Variable): ${product.name} | Obteniendo variaciones...`);
          const count = await processVariations(product.id);
          totalUpdated += count;
        }
      }

      if (simpleUpdates.length > 0) {
        console.log(`Enviando actualización por lotes de ${simpleUpdates.length} productos simples...`);
        await api.post("products/batch", { update: simpleUpdates });
        totalUpdated += simpleUpdates.length;
        console.log(`✅ Lote de productos simples actualizado con éxito.`);
      }

      page++;
    }

    console.log(`\n🎉 Proceso finalizado! Se actualizaron ${totalUpdated} productos/variaciones en total.`);
  } catch (error) {
    console.error("❌ Error actualizando los precios:", error.response ? error.response.data : error.message);
  }
}

updatePrices();
