import { api } from "@/lib/woocommerce";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, ArrowLeft } from "lucide-react";

export const revalidate = 60;

// Helper para obtener productos por categoría (slug)
async function getProductsByCategory(slug: string) {
  try {
    // Primero, obtener la categoría por slug para tener el ID
    const catResponse = await api.get("products/categories", {
      slug: slug,
    });
    
    const catData = Array.isArray(catResponse.data) ? catResponse.data : [];
    if (catData.length === 0) {
      return { category: null, products: [] };
    }
    
    const category = catData[0];
    
    // Ahora, obtener productos para ese ID
    const prodResponse = await api.get("products", {
      category: category.id,
      per_page: 50,
      status: "publish"
    });
    
    const prodData = Array.isArray(prodResponse.data) ? prodResponse.data : [];
    return { category, products: prodData };
  } catch (error) {
    return { category: null, products: [] };
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { category, products } = await getProductsByCategory(slug);

  if (!category) {
    return <div className="p-12 text-center text-xl bg-[#f5f5f5] min-h-screen">Categoría no encontrada</div>;
  }

  return (
    <div className="bg-[#f5f5f5] min-h-screen pb-20">
      <div className="max-w-[1400px] mx-auto px-2 sm:px-4 pt-6">
        
        {/* Título de sección agresivo */}
        <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center justify-between rounded-t-lg shadow-sm">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-400 hover:text-black transition-colors" title="Regresar al inicio">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-gray-900 font-black text-2xl uppercase tracking-tighter flex items-center gap-2">
              {category.name}
            </h1>
          </div>
          <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-full">{products.length} productos</span>
        </div>

        {products.length === 0 ? (
          <div className="bg-white p-12 text-center text-gray-500 rounded-b-lg shadow-sm">
            No hay productos en esta categoría por ahora.
          </div>
        ) : (
          /* Muro ultra-denso de productos: 2 col movil, 4 col tablet, 6 col desktop */
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 bg-white p-2 sm:p-3 shadow-sm rounded-b-lg">
            {products.map((product: any) => {
              const currentPrice = product.price || "0";
              
              return (
                <div key={product.id} className="group flex flex-col bg-white hover:shadow-[0_0_10px_rgba(0,0,0,0.15)] transition-shadow border border-transparent hover:border-gray-200 relative overflow-hidden rounded">
                  
                  {/* Etiqueta de escasez/venta */}
                  <div className="absolute top-0 left-0 bg-[#e52e04] text-white text-[10px] font-bold px-2 py-0.5 z-10 rounded-br-lg">
                    Envío Rápido
                  </div>

                  <Link href={`/product/${product.id}`} className="block relative overflow-hidden bg-gray-50 aspect-square">
                    {product.images && product.images[0] ? (
                      <Image 
                        src={product.images[0].src || "https://admin.ventalibre.top/wp-content/uploads/woocommerce-placeholder.png"} 
                        alt={product.name} 
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        Sin foto
                      </div>
                    )}
                  </Link>
                  
                  <div className="p-2 sm:p-3 flex flex-col flex-grow">
                    <Link href={`/product/${product.id}`} className="hover:underline">
                      <h3 className="text-gray-800 text-[11px] sm:text-xs leading-tight line-clamp-2 mb-1">{product.name}</h3>
                    </Link>
                    
                    <div className="mt-auto pt-1">
                      <div className="flex items-baseline gap-1 flex-wrap">
                        <span className="font-black text-[#e52e04] text-lg sm:text-xl leading-none">
                          ${currentPrice}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[10px] text-gray-500 font-medium">Pago contra entrega</span>
                        
                        <Link 
                          href={`/product/${product.id}`} 
                          className="bg-black text-white p-1.5 rounded-full hover:bg-[#fb7701] transition-colors"
                          title="Ver y comprar"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
