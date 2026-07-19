import { api } from "@/lib/woocommerce";
import AddToCartButton from "@/components/AddToCartButton";
import ProductGallery from "@/components/ProductGallery";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { formatCOP } from "@/lib/formatPrice";

import { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  let product;
  try {
    const response = await api.get(`products/${id}`);
    product = response.data;
  } catch (error) {
    return {
      title: "Producto no encontrado",
    };
  }

  // Limpiar el HTML de la descripción (priorizar descripción corta si existe)
  const rawDesc = product.short_description || product.description || "";
  const cleanDescription = rawDesc
    .replace(/<[^>]*>?/gm, '') // Remover etiquetas HTML
    .replace(/&nbsp;/g, ' ')   // Reemplazar espacios
    .replace(/\s+/g, ' ')      // Remover saltos de línea y múltiples espacios
    .trim()
    .substring(0, 160);        // Limitar a 160 caracteres (estándar SEO)

  const title = `${product.name} | Tienda Venta Libre`;
  
  const images = product.images && product.images.length > 0 
    ? [{ url: product.images[0].src }] 
    : [];

  return {
    title,
    description: cleanDescription,
    openGraph: {
      title,
      description: cleanDescription,
      images,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: cleanDescription,
      images,
    },
  };
}

async function getRelatedProducts(categoryId: number, excludeId: number) {
  try {
    const response = await api.get("products", {
      category: categoryId,
      per_page: 6,
      exclude: [excludeId],
      status: "publish"
    });
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    return [];
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let product;
  try {
    const response = await api.get(`products/${id}`);
    product = response.data;
  } catch (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f5f5f5] px-4 text-center">
        <div className="w-24 h-24 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center mb-6">
          <ShoppingCart className="w-12 h-12 opacity-50" />
        </div>
        <h1 className="text-4xl font-black text-gray-900 mb-4">Producto no encontrado</h1>
        <p className="text-lg text-gray-600 max-w-md mb-8">
          Lo sentimos, el producto que buscas no existe, se ha agotado o estamos actualizando nuestro inventario.
        </p>
        <Link 
          href="/" 
          className="bg-black text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#fb7701] transition-all shadow-lg"
        >
          Volver a la Tienda
        </Link>
      </div>
    );
  }

  const priceNum = parseFloat(product.price) || 0;
  
  // Obtener productos similares basados en la primera categoría del producto
  const categoryId = product.categories && product.categories.length > 0 ? product.categories[0].id : 0;
  const relatedProducts = categoryId ? await getRelatedProducts(categoryId, product.id) : [];

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          
          {/* Imagen Interactiva (Galería) */}
          <div className="w-full md:w-1/2 flex justify-center">
             <ProductGallery images={product.images || []} productName={product.name} />
          </div>

          {/* Detalles estilo Temu (Denso, texto claro) */}
          <div className="w-full md:w-1/2 flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-2 mb-6 border-b pb-4">
               <span className="text-xs bg-black text-white px-2 py-0.5 font-bold">Top Ventas</span>
               <span className="text-xs text-gray-500 font-medium">+10K vendidos</span>
            </div>

            <div className="mb-6">
              <div className="text-sm text-gray-500 font-bold mb-1">Precio Especial:</div>
              <div 
                className="text-4xl font-black text-[#e52e04]" 
                dangerouslySetInnerHTML={{ __html: typeof product.price_html === 'string' ? product.price_html : '' }} 
              />
            </div>
            
            <div className="bg-[#fff3eb] border border-[#fbd4b4] p-4 rounded-lg mb-8">
               <p className="text-sm font-bold text-[#fb7701] flex items-center gap-2 mb-1">
                 🚀 Envío Rápido a toda Colombia
               </p>
               <p className="text-xs text-gray-700">Aprovecha el pago contra entrega seguro en tu domicilio.</p>
            </div>

            {(() => {
              // Comprobamos si la categoría está relacionada con ropa o calzado
              const categoryNames = product.categories ? product.categories.map((c: any) => c.name.toLowerCase()).join(" ") : "";
              const requireNote = categoryNames.includes("ropa") || categoryNames.includes("calzado") || categoryNames.includes("zapatos") || categoryNames.includes("hombre") || categoryNames.includes("mujer") || categoryNames.includes("niño") || categoryNames.includes("bebe");

              return (
                <AddToCartButton 
                  product={{
                    id: product.id,
                    name: product.name,
                    price: priceNum,
                    image: (product.images && product.images[0]) ? product.images[0].src : "",
                  }} 
                  requireNote={requireNote}
                />
              );
            })()}

            {(() => {
              // Limpiar textos indeseados (IA) de la descripción
              let displayDescription = product.description || "No hay descripción disponible.";
              const unwantedTexts = [
                "Aquí tienes el texto optimizado y estructurado de forma profesional para la descripción del producto en tu tienda, manteniendo el formato limpio y completamente libre de emojis:",
                "<p>Aquí tienes el texto optimizado y estructurado de forma profesional para la descripción del producto en tu tienda, manteniendo el formato limpio y completamente libre de emojis:</p>",
                "Aquí tienes el texto optimizado y estructurado de forma profesional para tu catálogo o plataforma de e-commerce, manteniendo un diseño limpio, una lectura clara de las políticas y completamente libre de emojis:",
                "<p>Aquí tienes el texto optimizado y estructurado de forma profesional para tu catálogo o plataforma de e-commerce, manteniendo un diseño limpio, una lectura clara de las políticas y completamente libre de emojis:</p>"
              ];
              
              unwantedTexts.forEach(text => {
                // Remove exact matches (case insensitive)
                const regex = new RegExp(text, 'gi');
                displayDescription = displayDescription.replace(regex, '');
              });

              return (
                <div className="mt-12">
                  <h3 className="font-bold text-gray-900 border-b pb-2 mb-4">Descripción del Producto</h3>
                  <div 
                    className="prose prose-sm prose-gray max-w-none text-gray-700 text-sm"
                    dangerouslySetInnerHTML={{ __html: displayDescription }}
                  />
                </div>
              );
            })()}

            {/* Información Técnica y Atributos (Extraída de WordPress) */}
            <div className="mt-8 border border-gray-100 rounded-lg p-5 bg-gray-50">
              <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Información Adicional</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                {product.sku && (
                  <li className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-semibold">SKU:</span> 
                    <span>{product.sku}</span>
                  </li>
                )}
                
                {product.categories && product.categories.length > 0 && (
                  <li className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-semibold">Categorías:</span> 
                    <span>{product.categories.map((c: any) => c.name).join(", ")}</span>
                  </li>
                )}

                {product.tags && product.tags.length > 0 && (
                  <li className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-semibold">Etiquetas:</span> 
                    <span>{product.tags.map((t: any) => t.name).join(", ")}</span>
                  </li>
                )}

                {product.stock_status && (
                  <li className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-semibold">Disponibilidad:</span> 
                    <span className={product.stock_status === "instock" ? "text-green-600 font-bold" : "text-red-500 font-bold"}>
                      {product.stock_status === "instock" ? "En stock" : "Agotado"}
                    </span>
                  </li>
                )}

                {product.weight && (
                  <li className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-semibold">Peso:</span> 
                    <span>{product.weight} kg</span>
                  </li>
                )}

                {product.dimensions && (product.dimensions.length || product.dimensions.width || product.dimensions.height) && (
                  <li className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-semibold">Dimensiones:</span> 
                    <span>
                      {product.dimensions.length || 0} x {product.dimensions.width || 0} x {product.dimensions.height || 0} cm
                    </span>
                  </li>
                )}

                {product.attributes && product.attributes.map((attr: any, idx: number) => (
                  <li key={idx} className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-semibold">{attr.name}:</span> 
                    <span>{attr.options ? attr.options.join(", ") : ""}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Productos Relacionados */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-10 border-t border-gray-200">
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
              TAMBIÉN TE PUEDE INTERESAR
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
              {relatedProducts.map((relProduct: any) => (
                <div key={relProduct.id} className="group flex flex-col bg-white hover:shadow-[0_0_10px_rgba(0,0,0,0.15)] transition-shadow border border-gray-100 hover:border-gray-200 relative overflow-hidden rounded">
                  <Link href={`/product/${relProduct.id}`} className="block relative overflow-hidden bg-white aspect-square">
                    {relProduct.images && relProduct.images[0] ? (
                      <Image 
                        src={relProduct.images[0].src || "https://admin.ventalibre.top/wp-content/uploads/woocommerce-placeholder.png"} 
                        alt={relProduct.name} 
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs bg-gray-50">
                        Sin foto
                      </div>
                    )}
                  </Link>
                  <div className="p-2 sm:p-3 flex flex-col flex-grow">
                    <Link href={`/product/${relProduct.id}`} className="hover:underline">
                      <h3 className="text-gray-800 text-[11px] sm:text-xs leading-tight line-clamp-2 mb-1">{relProduct.name}</h3>
                    </Link>
                    <div className="mt-auto pt-1 flex items-center justify-between">
                      <span className="font-black text-[#e52e04] text-lg sm:text-xl leading-none">
                        {formatCOP(relProduct.price || "0")}
                      </span>
                      <Link 
                        href={`/product/${relProduct.id}`} 
                        className="bg-black text-white p-1.5 rounded-full hover:bg-[#fb7701] transition-colors"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
