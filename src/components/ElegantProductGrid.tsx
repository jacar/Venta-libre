"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { formatCOP } from "@/lib/formatPrice";

export default function ElegantProductGrid({ products }: { products: any[] }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
      {products.map((product: any) => {
        const currentPrice = product.price || "0";
        const oldPrice = product.regular_price;
        let discount = 0;
        if (oldPrice && oldPrice !== currentPrice && parseFloat(oldPrice) > 0) {
            discount = Math.round(((parseFloat(oldPrice) - parseFloat(currentPrice)) / parseFloat(oldPrice)) * 100);
        }

        return (
          <div key={product.id} className="w-full">
              <Link href={`/product/${product.id}`} className="group block relative">
                  <div className="bg-[#F5F5F5] aspect-[3/4] lg:aspect-[2/3] mb-2 sm:mb-5 relative overflow-hidden group/image shadow-sm hover:shadow-md transition-shadow duration-500 rounded-sm">
                      {product.images && product.images[0] ? (
                          <Image 
                              src={product.images[0].src || "https://admin.ventalibre.top/wp-content/uploads/woocommerce-placeholder.png"} 
                              alt={product.name} 
                              fill
                              sizes="(max-width: 640px) 50vw, 16vw"
                              className="object-cover mix-blend-multiply group-hover/image:scale-110 transition-transform duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                          />
                      ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">Sin imagen</div>
                      )}
                      
                      {/* Corazón (Wishlist) */}
                      <button 
                          className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/80 backdrop-blur-sm p-2 sm:p-2.5 rounded-full text-black hover:bg-black hover:text-white transition-all duration-300 z-10 shadow-sm opacity-0 group-hover/image:opacity-100 translate-y-2 group-hover/image:translate-y-0"
                          onClick={(e) => {
                              e.preventDefault();
                              // Wishlist logic later
                          }}
                      >
                          <Heart className="w-3 h-3 sm:w-4 sm:h-4" strokeWidth={1.5} />
                      </button>

                      {/* Etiqueta Minimalista (opcional) */}
                      {discount > 0 && (
                          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-red-600 text-white text-[9px] sm:text-[10px] uppercase tracking-[0.1em] font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-sm">
                              -{discount}%
                          </div>
                      )}
                  </div>
                  
                  {/* Info del Producto */}
                  <div className="px-1 text-center">
                      <h3 className="font-medium text-black text-[10px] sm:text-xs uppercase tracking-[0.1em] mb-1.5 sm:mb-2 line-clamp-1 group-hover:text-gray-600 transition-colors">{product.name}</h3>
                      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 mb-1.5 sm:mb-2">
                          <span className="font-light text-black text-xs sm:text-sm">{formatCOP(currentPrice)}</span>
                          {oldPrice && oldPrice !== currentPrice && (
                              <span className="text-gray-400 text-[10px] sm:text-xs line-through">{formatCOP(oldPrice)}</span>
                          )}
                      </div>
                      
                      {/* Estrellas estáticas */}
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="flex text-black text-[8px] sm:text-[10px]">
                              {'★★★★★'.split('').map((star, i) => <span key={i}>{star}</span>)}
                          </div>
                          <span className="text-[8px] sm:text-[10px] text-gray-400">({(String(product.id).charCodeAt(0) * 7) % 90 + 10})</span>
                      </div>
                  </div>
              </Link>
          </div>
        );
      })}
    </div>
  );
}
