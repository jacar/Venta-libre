"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { formatCOP } from "@/lib/formatPrice";

// Re-utilizamos lógica del producto
const generateFakeOriginalPrice = (price: string, id: number): number | null => {
  const current = parseFloat(price);
  if (isNaN(current)) return null;
  const multiplier = 1 + ((id % 40) / 100 + 0.3);
  return Math.round(current * multiplier);
};

export default function AutoCarousel({ products }: { products: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Drag states
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationFrameId: number;
    let scrollPos = container.scrollLeft;

    const scrollStep = () => {
      if (!isHovered) {
        scrollPos += 1.5; // Velocidad de scroll
        // Si llegamos al final del scroll, volver al inicio suavemente
        if (scrollPos >= container.scrollWidth - container.clientWidth) {
          scrollPos = 0;
        }
        container.scrollLeft = scrollPos;
      } else {
        // Actualizar la posición actual en caso de que el usuario haga scroll manual
        scrollPos = container.scrollLeft;
      }
      animationFrameId = requestAnimationFrame(scrollStep);
    };

    animationFrameId = requestAnimationFrame(scrollStep);

    return () => cancelAnimationFrame(animationFrameId);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered, isDragging]);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setIsHovered(true);
    setHasDragged(false);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const onMouseLeave = () => {
    setIsDragging(false);
    setIsHovered(false);
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Multiplicador de velocidad de arrastre
    
    if (Math.abs(walk) > 10) {
      setHasDragged(true);
    }
    
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    if (hasDragged) {
      e.preventDefault();
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-2 sm:px-4 mb-8 mt-4">
      <div className="bg-white px-4 py-3 border-b-2 border-[#e52e04] flex items-center justify-between rounded-t-lg shadow-sm">
        <h2 className="text-[#e52e04] font-black text-xl md:text-2xl tracking-tighter flex items-center gap-2 uppercase">
           🔥 SÚPER OFERTAS DEL DÍA
        </h2>
        <span className="text-xs text-[#e52e04] font-bold bg-[#fff3eb] px-2 py-1 rounded border border-[#fbd4b4] animate-pulse">
          Stock Limitado
        </span>
      </div>
      
      {/* Carrusel */}
      <div 
        className="bg-white shadow-sm rounded-b-lg overflow-hidden py-4 px-2 cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={onMouseLeave}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      >
        <div 
          ref={scrollRef}
          className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide select-none"
          style={{ scrollBehavior: (isHovered && !isDragging) ? 'smooth' : 'auto', msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          {products.map((product) => {
            const currentPrice = product.price || "0";
            const oldPrice = product.regular_price || generateFakeOriginalPrice(currentPrice, product.id);

            return (
              <div key={product.id} className="min-w-[160px] sm:min-w-[200px] max-w-[160px] sm:max-w-[200px] flex-shrink-0">
                <div className="group flex flex-col bg-white hover:shadow-[0_0_10px_rgba(0,0,0,0.15)] transition-shadow border border-gray-100 hover:border-gray-300 relative overflow-hidden rounded h-full">
                  <div className="absolute top-0 left-0 bg-[#e52e04] text-white text-[10px] font-bold px-2 py-0.5 z-10 rounded-br-lg">
                    Top Ventas
                  </div>

                  <Link 
                    href={`/product/${product.id}`} 
                    className="block relative overflow-hidden bg-gray-50 aspect-square"
                    onClick={handleLinkClick}
                  >
                    {product.images && product.images[0] ? (
                      <Image 
                        src={product.images[0].src} 
                        alt={product.name} 
                        fill
                        sizes="(max-width: 640px) 160px, 200px"
                        className="object-cover pointer-events-none"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        Sin foto
                      </div>
                    )}
                  </Link>
                  
                  <div className="p-2 sm:p-3 flex flex-col flex-grow">
                    <Link href={`/product/${product.id}`} className="hover:underline" onClick={handleLinkClick}>
                      <h3 className="text-gray-800 text-[11px] sm:text-xs leading-tight line-clamp-2 mb-1">{product.name}</h3>
                    </Link>
                    
                    <div className="mt-auto pt-1">
                      <div className="flex items-baseline gap-1 flex-wrap">
                        <span className="font-black text-[#e52e04] text-lg sm:text-xl leading-none">
                          {formatCOP(currentPrice)}
                        </span>
                        {oldPrice && oldPrice !== currentPrice && (
                          <span className="text-gray-400 text-[10px] sm:text-[11px] line-through">
                            {formatCOP(oldPrice)}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[10px] text-gray-500 font-medium">+10K vendidos</span>
                        <Link 
                          href={`/product/${product.id}`} 
                          className="bg-black text-white p-1.5 rounded-full hover:bg-[#fb7701] transition-colors z-10 relative"
                          onClick={handleLinkClick}
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
