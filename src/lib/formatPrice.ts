/**
 * Formatea un número o string de precio al formato de Pesos Colombianos (COP).
 * Ejemplo: "212300" -> "$ 212.300"
 * Ejemplo: 1500000 -> "$ 1.500.000"
 */
export function formatCOP(price: string | number | null | undefined): string {
  if (price === null || price === undefined || price === "") return "$ 0";

  // Limpiar el string: remover caracteres no numéricos excepto punto decimal
  const cleaned = String(price).replace(/[^0-9.]/g, "");
  const num = parseFloat(cleaned);

  if (isNaN(num)) return "$ 0";

  // Formatear con separadores de miles usando punto (estilo colombiano)
  return "$ " + Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * Limpia el HTML de price_html de WooCommerce e inserta el formato COP correcto.
 * WooCommerce devuelve algo como: <span class="woocommerce-Price-amount">212300<span...>$</span></span>
 * Esta función extrae el número y devuelve el HTML con formato correcto.
 */
export function formatPriceHTML(priceHtml: string): string {
  if (!priceHtml) return "";

  // Extraer todos los números del HTML (puede haber precio tachado y precio actual)
  const numbers = priceHtml.match(/[\d,.]+/g);
  if (!numbers) return priceHtml;

  let result = priceHtml;
  numbers.forEach((numStr) => {
    const cleaned = numStr.replace(/[,.]/g, "");
    const num = parseFloat(cleaned);
    if (!isNaN(num) && num > 0) {
      const formatted = Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      // Reemplazar el número original por el formateado en el HTML
      result = result.replace(numStr, formatted);
    }
  });

  // Reemplazar símbolo $ por "$ " con espacio si no lo tiene
  result = result.replace(/\$(?!\s)/g, "$ ");

  return result;
}
