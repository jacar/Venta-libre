import { api } from "@/lib/woocommerce";
import AddToCartButton from "@/components/AddToCartButton";
import ProductGallery from "@/components/ProductGallery";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export const revalidate = 60;

async function getRelatedProducts(categoryId: number, excludeId: number) {
  try {
    const response = await api.get("products", {
      category: categoryId,
      per_page: 6,
      exclude: [excludeId],
      status: "publish"
    });
    return response.data;
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
    return <div className="p-12 text-center text-xl bg-white min-h-screen">Producto no encontrado</div>;
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
                dangerouslySetInnerHTML={{ __html: product.price_html }} 
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

            <div className="mt-12">
              <h3 className="font-bold text-gray-900 border-b pb-2 mb-4">Descripción del Producto</h3>
              <div 
                className="prose prose-sm prose-gray max-w-none text-gray-700 text-sm"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
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
                      <img 
                        src={relProduct.images[0].src} 
                        alt={relProduct.name} 
                        className="w-full h-full object-cover"
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
                        ${relProduct.price || "0"}
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
