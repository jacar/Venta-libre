"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { formatCOP } from "@/lib/formatPrice";

export default function SplitProductGallery({ products }: { products: any[] }) {
  // Inicializamos con los primeros elementos para evitar el flash de hidratación (SSR)
  const [topProducts, setTopProducts] = useState<any[]>(products?.slice(0, 4) || []);
  const [bottomProducts, setBottomProducts] = useState<any[]>(products?.slice(4) || []);

  useEffect(() => {
    if (!products || products.length === 0) return;
    
    // Aleatorizar en el cliente
    const shuffled = [...products].sort(() => Math.random() - 0.5);
    setTopProducts(shuffled.slice(0, 4));
    setBottomProducts(shuffled.slice(4));
  }, [products]);

  if (!products || products.length === 0) return null;

  // Helper para renderizar una card de producto (grande o miniatura)
  const renderProductCard = (product: any, isLarge: boolean) => {
    const currentPrice = product.price || "0";
    const oldPrice = product.regular_price;
    let discount = 0;
    if (oldPrice && oldPrice !== currentPrice && parseFloat(oldPrice) > 0) {
        discount = Math.round(((parseFloat(oldPrice) - parseFloat(currentPrice)) / parseFloat(oldPrice)) * 100);
    }

    return (
      <div key={product.id} className="w-full">
          <Link href={`/product/${product.id}`} className="group block relative">
              <div className={`bg-[#F5F5F5] ${isLarge ? 'aspect-[4/5] sm:aspect-[3/4]' : 'aspect-square sm:aspect-[4/5]'} mb-3 sm:mb-4 relative overflow-hidden group/image shadow-sm hover:shadow-md transition-shadow duration-500 rounded-sm`}>
                  {product.images && product.images[0] ? (
                      <Image 
                          src={product.images[0].src || "https://admin.ventalibre.top/wp-content/uploads/woocommerce-placeholder.png"} 
                          alt={product.name} 
                          fill
                          sizes={isLarge ? "(max-width: 640px) 50vw, 25vw" : "(max-width: 640px) 33vw, 16vw"}
                          className="object-cover mix-blend-multiply group-hover/image:scale-110 transition-transform duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                      />
                  ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">Sin imagen</div>
                  )}
                  
                  {/* Corazón (Wishlist) */}
                  <button 
                      className={`absolute ${isLarge ? 'top-4 right-4' : 'top-2 right-2'} bg-white/80 backdrop-blur-sm p-1.5 sm:p-2 rounded-full text-black hover:bg-black hover:text-white transition-all duration-300 z-10 shadow-sm opacity-0 group-hover/image:opacity-100 translate-y-2 group-hover/image:translate-y-0`}
                      onClick={(e) => {
                          e.preventDefault();
                      }}
                  >
                      <Heart className={`${isLarge ? 'w-4 h-4' : 'w-3 h-3'}`} strokeWidth={1.5} />
                  </button>

                  {/* Etiqueta Minimalista */}
                  {discount > 0 && (
                      <div className={`absolute ${isLarge ? 'top-4 left-4 text-[10px] px-3 py-1.5' : 'top-2 left-2 text-[8px] px-2 py-1'} bg-red-600 text-white uppercase tracking-[0.1em] font-bold rounded-sm`}>
                          -{discount}%
                      </div>
                  )}
              </div>
              
              {/* Info del Producto */}
              <div className="px-1 text-center">
                  <h3 className={`font-medium text-black ${isLarge ? 'text-[10px] sm:text-xs' : 'text-[9px] sm:text-[10px]'} uppercase tracking-[0.1em] mb-1 sm:mb-2 line-clamp-1 group-hover:text-gray-600 transition-colors`}>{product.name}</h3>
                  <div className={`flex flex-wrap items-center justify-center ${isLarge ? 'gap-1.5 sm:gap-3' : 'gap-1'} mb-1 sm:mb-2`}>
                      <span className={`font-light text-black ${isLarge ? 'text-xs sm:text-sm' : 'text-[10px] sm:text-xs'}`}>{formatCOP(currentPrice)}</span>
                      {oldPrice && oldPrice !== currentPrice && (
                          <span className={`text-gray-400 ${isLarge ? 'text-[10px] sm:text-xs' : 'text-[8px] sm:text-[9px]'} line-through`}>{formatCOP(oldPrice)}</span>
                      )}
                  </div>
                  
                  {isLarge && (
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="flex text-black text-[8px] sm:text-[10px]">
                              {'★★★★★'.split('').map((star, i) => <span key={i}>{star}</span>)}
                          </div>
                          <span className="text-[8px] sm:text-[10px] text-gray-400">({(String(product.id).charCodeAt(0) * 7) % 90 + 10})</span>
                      </div>
                  )}
              </div>
          </Link>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col gap-6 lg:gap-10">
      {/* Top 4 Random (Grandes) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {topProducts.map((product) => renderProductCard(product, true))}
      </div>

      {/* Grid del resto en miniatura (no tan pequeñas) */}
      {bottomProducts.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 mt-4 pt-6 border-t border-gray-100">
          {bottomProducts.map((product) => renderProductCard(product, false))}
        </div>
      )}
    </div>
  );
}
