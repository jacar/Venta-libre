"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { formatCOP } from "@/lib/formatPrice";

export default function ProductSlider({ products, autoPlay = false }: { products: any[], autoPlay?: boolean }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        // Check if we are at the end (with a small buffer of 10px)
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRight();
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [autoPlay]);

  if (!products || products.length === 0) return null;

  return (
    <div className="relative group/slider">
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 -mx-6 px-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {products.map((product: any) => {
          const currentPrice = product.price || "0";
          const oldPrice = product.regular_price;
          let discount = 0;
          if (oldPrice && oldPrice !== currentPrice && parseFloat(oldPrice) > 0) {
              discount = Math.round(((parseFloat(oldPrice) - parseFloat(currentPrice)) / parseFloat(oldPrice)) * 100);
          }

          return (
            <div key={product.id} className="snap-start shrink-0 w-[75vw] sm:w-[260px] lg:w-[280px]">
                <Link href={`/product/${product.id}`} className="group block relative">
                    <div className="bg-[#F5F5F5] aspect-[3/4] lg:aspect-[2/3] mb-5 relative overflow-hidden group/image shadow-sm hover:shadow-md transition-shadow duration-500 rounded-sm">
                        {product.images && product.images[0] ? (
                            <Image 
                                src={product.images[0].src || "https://admin.ventalibre.top/wp-content/uploads/woocommerce-placeholder.png"} 
                                alt={product.name} 
                                fill
                                sizes="(max-width: 640px) 80vw, 300px"
                                className="object-cover mix-blend-multiply group-hover/image:scale-110 transition-transform duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">Sin imagen</div>
                        )}
                        
                        {/* Corazón (Wishlist) */}
                        <button 
                            className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2.5 rounded-full text-black hover:bg-black hover:text-white transition-all duration-300 z-10 shadow-sm opacity-0 group-hover/image:opacity-100 translate-y-2 group-hover/image:translate-y-0"
                            onClick={(e) => {
                                e.preventDefault();
                                // Wishlist logic later
                            }}
                        >
                            <Heart className="w-4 h-4" strokeWidth={1.5} />
                        </button>

                        {/* Etiqueta Minimalista (opcional) */}
                        {discount > 0 && (
                            <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] uppercase tracking-[0.1em] font-bold px-3 py-1.5 rounded-sm">
                                -{discount}%
                            </div>
                        )}
                    </div>
                    
                    {/* Info del Producto */}
                    <div className="px-1 text-center">
                        <h3 className="font-medium text-black text-xs uppercase tracking-[0.1em] mb-2 line-clamp-1 group-hover:text-gray-600 transition-colors">{product.name}</h3>
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <span className="font-light text-black text-sm">{formatCOP(currentPrice)}</span>
                            {oldPrice && oldPrice !== currentPrice && (
                                <span className="text-gray-400 text-xs line-through">{formatCOP(oldPrice)}</span>
                            )}
                        </div>
                        
                        {/* Estrellas estáticas (como VITA) */}
                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="flex text-black text-[10px]">
                                {'★★★★★'.split('').map((star, i) => <span key={i}>{star}</span>)}
                            </div>
                            <span className="text-[10px] text-gray-400">({(String(product.id).charCodeAt(0) * 7) % 90 + 10})</span>
                        </div>
                    </div>
                </Link>
            </div>
          );
        })}
      </div>

      {/* Flechas Funcionales */}
      <button 
          onClick={scrollLeft}
          className="absolute left-0 top-1/3 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white shadow-md border border-gray-100 flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all z-10 hidden sm:flex cursor-pointer"
      >
          <ChevronLeft className="w-5 h-5 text-black" />
      </button>
      <button 
          onClick={scrollRight}
          className="absolute right-0 top-1/3 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white shadow-md border border-gray-100 flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all z-10 hidden sm:flex cursor-pointer"
      >
          <ChevronRight className="w-5 h-5 text-black" />
      </button>
    </div>
  );
}
