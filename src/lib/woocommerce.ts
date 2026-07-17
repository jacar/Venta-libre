import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const url = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || "";
const isHttps = url.startsWith("https");

export const api = new WooCommerceRestApi({
  url,
  consumerKey: process.env.WOOCOMMERCE_KEY || "",
  consumerSecret: process.env.WOOCOMMERCE_SECRET || "",
  version: "wc/v3",
  queryStringAuth: !isHttps
});

// Función helper para limpiar el JSON inyectado con comentarios HTML
function cleanData(data: any): any {
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
          const parsed = JSON.parse(cleanJsonStr);
          return postProcessPrices(parsed);
        } catch (err) {
          console.error("[WooCommerce API Wrapper] Error al parsear JSON limpio:", err);
        }
      }
    }
  }
  return postProcessPrices(data);
}

/**
 * Formatea los campos de precio de los productos WooCommerce al estilo COP (puntos de miles).
 * Recorre arrays y objetos recursivamente buscando campos price, regular_price y price_html.
 */
function postProcessPrices(data: any): any {
  if (!data) return data;

  if (Array.isArray(data)) {
    return data.map(postProcessPrices);
  }

  if (typeof data === "object") {
    // Sanear el nombre del producto (remover emojis, caracteres raros y signos de interrogación extraños)
    if (data.name && typeof data.name === "string") {
      data.name = data.name
        .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}\uFFFD\?]/gu, "") // Emojis y caracter de reemplazo / ?
        .replace(/\s{2,}/g, " ") // Remover espacios dobles
        .trim();
    }

    // Formatear price_html: reemplazar números grandes sin formato por formato COP
    if (data.price_html && typeof data.price_html === "string") {
      data.price_html = data.price_html.replace(/(\d{4,})/g, (match: string) => {
        const num = parseInt(match, 10);
        if (isNaN(num)) return match;
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      });
    }
  }

  return data;
}
// Envolver métodos principales para que limpien automáticamente las respuestas

const originalGet = api.get.bind(api);
api.get = async function (endpoint: string, params?: any) {
  try {
    const response = await originalGet(endpoint, params);
    if (response && response.data) {
      response.data = cleanData(response.data);
    }
    return response;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      // Evitar que el 404 rompa la consola o las páginas
      console.warn(`[WooCommerce API] 404 Ruta no encontrada: ${endpoint}`);
      return { data: [] }; 
    }
    throw error;
  }
};

const originalPost = api.post.bind(api);
api.post = async function (endpoint: string, data: any, params?: any) {
  const response = await originalPost(endpoint, data, params);
  if (response && response.data) {
    response.data = cleanData(response.data);
  }
  return response;
};

const originalPut = api.put.bind(api);
api.put = async function (endpoint: string, data: any, params?: any) {
  const response = await originalPut(endpoint, data, params);
  if (response && response.data) {
    response.data = cleanData(response.data);
  }
  return response;
};

const originalDelete = api.delete.bind(api);
api.delete = async function (endpoint: string, params?: any) {
  const response = await originalDelete(endpoint, params);
  if (response && response.data) {
    response.data = cleanData(response.data);
  }
  return response;
};

