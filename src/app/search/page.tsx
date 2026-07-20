import { api } from "@/lib/woocommerce";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { formatCOP } from "@/lib/formatPrice";

export const revalidate = 0; // Búsqueda debe ser dinámica siempre

async function getSearchResults(query: string) {
  try {
    const response = await api.get("products", {
      search: query,
      per_page: 50,
      status: "publish"
    });
    
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    return [];
  }
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";
  
  const products = query.length >= 3 ? await getSearchResults(query) : [];

  return (
    <div className="bg-[#f5f5f5] min-h-screen pb-20">
      <div className="max-w-[1400px] mx-auto px-2 sm:px-4 pt-6">
        
        <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center justify-between rounded-t-lg shadow-sm">
          <h1 className="text-gray-900 font-black text-xl md:text-2xl uppercase tracking-tighter flex items-center gap-2">
            BÚSQUEDA: {query}
          </h1>
          <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-full">{products.length} resultados</span>
        </div>

        {query.length < 3 ? (
          <div className="bg-white p-12 text-center text-gray-500 rounded-b-lg shadow-sm">
            Por favor ingresa al menos 3 caracteres para buscar.
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white p-12 text-center text-gray-500 rounded-b-lg shadow-sm">
            No encontramos productos que coincidan con "{query}". Intenta con otros términos.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 bg-white p-2 sm:p-3 shadow-sm rounded-b-lg">
            {products.map((product: any) => {
              const currentPrice = product.price || "0";
              
              return (
                <div key={product.id} className="group flex flex-col bg-white hover:shadow-[0_0_10px_rgba(0,0,0,0.15)] transition-shadow border border-transparent hover:border-gray-200 relative overflow-hidden rounded">
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
                          {formatCOP(currentPrice)}
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
